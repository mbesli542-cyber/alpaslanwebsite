import { json, safe } from '../lib/http.js';
import { getSettings } from '../lib/store.js';

// Public shipping info for the cart.
export const GET = safe(async () => {
  const s = await getSettings();
  return json({
    shippingCents: s.shippingCents,
    freeShippingFromCents: s.freeShippingFromCents,
    allowShipping: s.allowShipping,
    allowPickup: s.allowPickup,
    checkoutEnabled: Boolean(process.env.STRIPE_SECRET_KEY) || (!process.env.VERCEL && process.env.DEV_FAKE_STRIPE === '1'),
  });
});
