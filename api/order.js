import { json, safe } from '../lib/http.js';
import { listOrders } from '../lib/store.js';
import { loadPending } from '../lib/orders.js';

// GET /api/order?session_id=…  minimal status for the thank-you page (no personal data).
export const GET = safe(async (request) => {
  const id = new URL(request.url).searchParams.get('session_id') || '';
  if (!/^(cs_|dev_)[\w-]+$/.test(id)) return json({ status: 'unknown' });
  const order = (await listOrders()).find((o) => o.id === id);
  if (order) return json({ status: order.status, number: order.number, totalCents: order.totalCents, items: order.items.map((i) => ({ name: i.name, size: i.size, qty: i.qty })) });
  return json({ status: (await loadPending(id)) ? 'processing' : 'unknown' });
});
