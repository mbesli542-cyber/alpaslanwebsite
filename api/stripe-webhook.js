import { json, error } from '../lib/http.js';
import { loadPending, recordOrder } from '../lib/orders.js';

// Stripe → POST /api/stripe-webhook
// Events: checkout.session.completed, checkout.session.async_payment_succeeded
export async function POST(request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) return error(503, 'Stripe not configured');
  const { default: Stripe } = await import('stripe');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const raw = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, request.headers.get('stripe-signature'), process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    return error(400, `Webhook signature: ${e.message}`);
  }

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const s = event.data.object;
    const cart = await loadPending(s.id);
    if (!cart) {
      console.error('Keine Warenkorbdaten für Session', s.id);
      return json({ received: true, warning: 'no cart' });
    }
    const details = s.customer_details || {};
    const ship = s.shipping_details || s.collected_information?.shipping_details || null;
    await recordOrder({
      sessionId: s.id,
      paid: s.payment_status === 'paid' || event.type === 'checkout.session.async_payment_succeeded',
      cart,
      customer: { name: details.name || '', email: details.email || '', phone: details.phone || '' },
      address: ship?.address ? { name: ship.name || details.name || '', ...ship.address } : details.address || null,
      shippingName: s.shipping_cost?.shipping_rate ? await rateName(stripe, s.shipping_cost.shipping_rate) : '',
      shippingCents: s.shipping_cost?.amount_total ?? 0,
      totalCents: s.amount_total,
    });
  }
  return json({ received: true });
}

async function rateName(stripe, rate) {
  try {
    const r = typeof rate === 'string' ? await stripe.shippingRates.retrieve(rate) : rate;
    return r.display_name || '';
  } catch {
    return '';
  }
}
