import { json, error, readJson, safe } from '../../lib/http.js';
import { requireAdmin } from '../../lib/auth.js';
import { listProducts, saveProducts } from '../../lib/store.js';
import { cleanProduct, sortProducts, CATEGORIES } from '../../lib/products.js';
import { deleteImage } from '../../lib/blob.js';

// GET    /api/admin/products          all products incl. drafts and stock
// POST   /api/admin/products          create or update (body.id = update)
// DELETE /api/admin/products?id=…     delete product and its images
export const GET = safe(async (request) => {
  requireAdmin(request);
  return json({ products: sortProducts(await listProducts()), categories: CATEGORIES });
});

export const POST = safe(async (request) => {
  requireAdmin(request);
  const body = await readJson(request);
  const products = await listProducts();
  const i = body.id ? products.findIndex((p) => p.id === body.id) : -1;
  if (body.id && i < 0) return error(404, 'Artikel nicht gefunden.');
  const existing = i >= 0 ? products[i] : null;
  const product = cleanProduct(body, existing);
  if (existing) {
    const removed = existing.images.filter((u) => !product.images.includes(u));
    products[i] = product;
    await saveProducts(products);
    await Promise.all(removed.map(deleteImage));
  } else {
    products.push(product);
    await saveProducts(products);
  }
  return json({ product });
});

export const DELETE = safe(async (request) => {
  requireAdmin(request);
  const id = new URL(request.url).searchParams.get('id');
  const products = await listProducts();
  const p = products.find((x) => x.id === id);
  if (!p) return error(404, 'Artikel nicht gefunden.');
  await saveProducts(products.filter((x) => x.id !== id));
  await Promise.all(p.images.map(deleteImage));
  return json({ deleted: id });
});
