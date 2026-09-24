import { randomUUID } from 'node:crypto';
import { json, error, readJson, safe, siteUrl } from '../lib/http.js';
import { listProducts, getSettings } from '../lib/store.js';
import { savePending, recordOrder } from '../lib/orders.js';

// POST /api/checkout  { items: [{ id, size, qty }], lang }
// Prices and stock are always taken from the database, never from the browser.
export const POST = safe(async (request) => {
  const body = await readJson(request);
  const lines = Array.isArray(body.items) ? body.items.slice(0, 20) : [];
  if (!lines.length) return error(400, 'Der Warenkorb ist leer.');
  const lang = body.lang === 'tr' ? 'tr' : 'de';

  const products = await listProducts();
  const items = [];
  for (const line of lines) {
    const p = products.find((x) => x.id === line.id && x.published);
    const size = p && p.sizes.find((s) => s.label === String(line.size));
    const qty = Math.floor(Number(line.qty));
    if (!p || !size) return error(409, 'Ein Artikel ist nicht mehr verfügbar. Bitte Warenkorb prüfen.');
    if (!(qty >= 1 && qty <= 5)) return error(400, 'Ungültige Menge.');
    if (size.stock < qty) return error(409, `„${p.name.de}“ in Größe ${size.label} ist nur noch ${size.stock}× verfügbar.`);
    items.push({
      productId: p.id,
      name: p.name.de,
      nameTr: p.name.tr || p.name.de,
      size: size.label,
      qty,
      unitCents: p.priceCents,
      image: p.images.find((u) => /^https:\/\//.test(u)) || null,
    });
  }
  const subtotalCents = items.reduce((n, i) => n + i.unitCents * i.qty, 0);
  const settings = await getSettings();
  const base = siteUrl(request);

  // Local development without Stripe: record a paid order straight away.
  if (!process.env.STRIPE_SECRET_KEY) {
    if (process.env.VERCEL || process.env.DEV_FAKE_STRIPE !== '1') return error(503, 'Online-Bezahlung ist noch nicht eingerichtet.');
    const sessionId = 'dev_' + randomUUID();
    await recordOrder({ sessionId, paid: true, cart: { items, subtotalCents }, customer: { name: 'Testkunde', email: 'test@example.com' }, shippingName: 'Test', totalCents: subtotalCents });
    return json({ url: `${base}/danke.html?session_id=${sessionId}` });
  }

  const { default: Stripe } = await import('stripe');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const shippingFree = settings.freeShippingFromCents > 0 && subtotalCents >= settings.freeShippingFromCents;
  const shipping_options = [];
  if (settings.allowPickup) {
    shipping_options.push({ shipping_rate_data: {
      type: 'fixed_amount', fixed_amount: { amount: 0, currency: 'eur' },
      display_name: lang === 'tr' ? 'Mağazadan teslim (F1 8, Mannheim)' : 'Abholung im Laden (F1 8, Mannheim)',
    } });
  }
  if (settings.allowShipping) {
    shipping_options.push({ shipping_rate_data: {
      type: 'fixed_amount', fixed_amount: { amount: shippingFree ? 0 : settings.shippingCents, currency: 'eur' },
      display_name: lang === 'tr' ? 'Almanya içi kargo' : 'Versand innerhalb Deutschlands',
      delivery_estimate: { minimum: { unit: 'business_day', value: 2 }, maximum: { unit: 'business_day', value: 5 } },
    } });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    locale: lang,
    line_items: items.map((i) => ({
      quantity: i.qty,
      price_data: {
        currency: 'eur',
        unit_amount: i.unitCents,
        product_data: {
          name: `${lang === 'tr' ? i.nameTr : i.name} (${lang === 'tr' ? 'Beden' : 'Größe'} ${i.size})`,
          ...(i.image ? { images: [i.image] } : {}),
        },
      },
    })),
    shipping_options,
    ...(settings.allowShipping ? { shipping_address_collection: { allowed_countries: ['DE'] } } : {}),
    phone_number_collection: { enabled: true },
    billing_address_collection: 'required',
    ...(process.env.STRIPE_REQUIRE_TERMS === '1' ? { consent_collection: { terms_of_service: 'required' } } : {}),
    custom_text: {
      submit: { message: lang === 'tr'
        ? `Ödeme yaparak AGB ve cayma koşullarımızı kabul edersiniz: ${base}/agb.html`
        : `Mit der Bestellung akzeptieren Sie unsere AGB und die Widerrufsbelehrung: ${base}/agb.html` },
    },
    expires_at: Math.floor(Date.now() / 1000) + 60 * 30,
    success_url: `${base}/danke.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/shop.html?warenkorb=1`,
  });

  await savePending(session.id, { items, subtotalCents });
  return json({ url: session.url });
});
