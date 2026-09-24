import { json, safe } from '../lib/http.js';
import { listProducts } from '../lib/store.js';
import { publicProduct, sortProducts } from '../lib/products.js';

// GET /api/products          all published products
// GET /api/products?slug=x   one product
export const GET = safe(async (request) => {
  const slug = new URL(request.url).searchParams.get('slug');
  const products = sortProducts((await listProducts()).filter((p) => p.published));
  if (slug) {
    const p = products.find((x) => x.slug === slug);
    return p ? json(publicProduct(p)) : json({ error: 'Nicht gefunden' }, { status: 404 });
  }
  return json(products.map(publicProduct), { headers: { 'cache-control': 'public, max-age=0, s-maxage=30, stale-while-revalidate=300' } });
});
