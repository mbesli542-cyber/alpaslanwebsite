// Product model: validation for admin input and the public view sent to shoppers.
import { randomUUID } from 'node:crypto';

export const CATEGORIES = ['anzug', 'hochzeit', 'sakko', 'hose', 'hemd', 'accessoires'];

const text = (v, max) => String(v ?? '').trim().slice(0, max);
const cents = (v) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n >= 0 && n <= 10_000_000 ? n : null;
};
const slugify = (s) =>
  s.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ç/g, 'c')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'artikel';

export function cleanProduct(input, existing) {
  const nameDe = text(input?.name?.de, 120);
  if (!nameDe) throw Object.assign(new Error('Name (Deutsch) fehlt.'), { status: 400 });
  const price = cents(input.priceCents);
  if (price == null || price < 50) throw Object.assign(new Error('Preis fehlt oder ist ungültig.'), { status: 400 });
  const compare = input.compareAtCents ? cents(input.compareAtCents) : null;
  const category = CATEGORIES.includes(input.category) ? input.category : 'anzug';

  const sizes = Array.isArray(input.sizes) ? input.sizes : [];
  const seen = new Set();
  const cleanSizes = sizes
    .map((s) => ({ label: text(s?.label, 20), stock: Math.max(0, Math.min(9999, Math.floor(Number(s?.stock) || 0))) }))
    .filter((s) => s.label && !seen.has(s.label) && seen.add(s.label))
    .slice(0, 40);

  const images = (Array.isArray(input.images) ? input.images : [])
    .map((u) => text(u, 500))
    .filter((u) => /^https:\/\//.test(u) || u.startsWith('/uploads/'))
    .slice(0, 12);

  const now = new Date().toISOString();
  return {
    id: existing?.id || randomUUID(),
    slug: existing?.slug || `${slugify(nameDe)}-${Math.random().toString(36).slice(2, 6)}`,
    published: Boolean(input.published),
    featured: Boolean(input.featured),
    category,
    name: { de: nameDe, tr: text(input?.name?.tr, 120) },
    description: { de: text(input?.description?.de, 2000), tr: text(input?.description?.tr, 2000) },
    priceCents: price,
    compareAtCents: compare && compare > price ? compare : null,
    images,
    sizes: cleanSizes,
    sort: Number.isFinite(Number(input.sort)) ? Number(input.sort) : existing?.sort ?? 0,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
}

export const totalStock = (p) => p.sizes.reduce((n, s) => n + s.stock, 0);

// What shoppers see: no internal fields, stock only as availability per size.
export const publicProduct = (p) => ({
  id: p.id,
  slug: p.slug,
  featured: p.featured,
  category: p.category,
  name: p.name,
  description: p.description,
  priceCents: p.priceCents,
  compareAtCents: p.compareAtCents,
  images: p.images,
  sizes: p.sizes.map((s) => ({ label: s.label, available: s.stock > 0, few: s.stock > 0 && s.stock <= 2 })),
  soldOut: totalStock(p) === 0,
});

export const sortProducts = (list) =>
  [...list].sort((a, b) => (b.featured - a.featured) || (a.sort - b.sort) || b.createdAt.localeCompare(a.createdAt));
