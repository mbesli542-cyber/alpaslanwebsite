import { json, readJson, safe } from '../../lib/http.js';
import { requireAdmin } from '../../lib/auth.js';
import { getSettings, saveSettings } from '../../lib/store.js';
import { redisUrl, redisToken, blobToken } from '../../lib/env.js';

const toCents = (v, fallback) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n >= 0 && n <= 100000 ? n : fallback;
};

export const GET = safe(async (request) => {
  requireAdmin(request);
  return json({
    settings: await getSettings(),
    setup: {
      database: Boolean(redisUrl() && redisToken()),
      images: Boolean(blobToken()),
      stripe: Boolean(process.env.STRIPE_SECRET_KEY),
      webhook: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
      testMode: (process.env.STRIPE_SECRET_KEY || '').startsWith('sk_test_'),
    },
  });
});

export const POST = safe(async (request) => {
  requireAdmin(request);
  const body = await readJson(request, 2000);
  const cur = await getSettings();
  const next = {
    shippingCents: toCents(body.shippingCents, cur.shippingCents),
    freeShippingFromCents: toCents(body.freeShippingFromCents, cur.freeShippingFromCents),
    allowShipping: Boolean(body.allowShipping),
    allowPickup: Boolean(body.allowPickup),
  };
  if (!next.allowShipping && !next.allowPickup) next.allowPickup = true;
  await saveSettings(next);
  return json({ settings: next });
});
