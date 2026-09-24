// Order bookkeeping shared by checkout and the Stripe webhook.
import * as store from './store.js';

const pendingKey = (sessionId) => `pending:${sessionId}`;

export const savePending = (sessionId, cart) => store.set(pendingKey(sessionId), cart);
export const loadPending = (sessionId) => store.get(pendingKey(sessionId), null);

const nextNumber = async () => {
  const n = ((await store.get('orderSeq', 1000)) || 1000) + 1;
  await store.set('orderSeq', n);
  return `P-${n}`;
};

// Create or update the order for a Checkout Session; decrement stock once when it becomes paid.
export async function recordOrder({ sessionId, paid, cart, customer, address, shippingName, shippingCents, totalCents }) {
  const orders = await store.listOrders();
  let order = orders.find((o) => o.id === sessionId);
  if (!order) {
    order = {
      id: sessionId,
      number: await nextNumber(),
      createdAt: new Date().toISOString(),
      status: paid ? 'paid' : 'awaiting_payment',
      items: cart.items,
      subtotalCents: cart.subtotalCents,
      shippingCents: shippingCents ?? 0,
      totalCents: totalCents ?? cart.subtotalCents,
      shippingMethod: shippingName || '',
      customer: customer || {},
      address: address || null,
      stockIssue: false,
    };
    orders.unshift(order);
  } else if (paid && order.status === 'awaiting_payment') {
    order.status = 'paid';
  }

  if (paid && (await store.claim(`stock:${sessionId}`))) {
    const products = await store.listProducts();
    for (const item of cart.items) {
      const p = products.find((x) => x.id === item.productId);
      const s = p && p.sizes.find((x) => x.label === item.size);
      if (!s || s.stock < item.qty) order.stockIssue = true;
      if (s) s.stock = Math.max(0, s.stock - item.qty);
    }
    await store.saveProducts(products);
  }
  await store.saveOrders(orders);
  return order;
}
