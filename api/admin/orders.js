import { json, error, readJson, safe } from '../../lib/http.js';
import { requireAdmin } from '../../lib/auth.js';
import { listOrders, saveOrders } from '../../lib/store.js';

const STATUSES = ['awaiting_payment', 'paid', 'shipped', 'picked_up', 'cancelled'];

// GET   /api/admin/orders
// PATCH /api/admin/orders  { id, status }
export const GET = safe(async (request) => {
  requireAdmin(request);
  return json({ orders: await listOrders() });
});

export const PATCH = safe(async (request) => {
  requireAdmin(request);
  const { id, status } = await readJson(request, 2000);
  if (!STATUSES.includes(status)) return error(400, 'Ungültiger Status.');
  const orders = await listOrders();
  const o = orders.find((x) => x.id === id);
  if (!o) return error(404, 'Bestellung nicht gefunden.');
  o.status = status;
  o.updatedAt = new Date().toISOString();
  await saveOrders(orders);
  return json({ order: o });
});
