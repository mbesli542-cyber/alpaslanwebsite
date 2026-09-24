// Data store. On Vercel it uses Upstash Redis (added from the Vercel Marketplace, env vars are set
// automatically). Without those env vars (local development) it falls back to a JSON file in .data/.
import { promises as fs } from 'node:fs';
import path from 'node:path';

const PREFIX = 'parla:';
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

let redis = null;
if (url && token) {
  const { Redis } = await import('@upstash/redis');
  redis = new Redis({ url, token });
} else if (process.env.VERCEL) {
  console.error('Upstash Redis is not connected: set KV_REST_API_URL / KV_REST_API_TOKEN.');
}

const notConnected = () => Object.assign(
  new Error('Veritabanı bağlı değil. Vercel → Storage → Upstash for Redis ekleyip Redeploy yapın.'),
  { status: 503, expose: true },
);

const FILE = path.join(process.cwd(), '.data', 'db.json');
const readFile = async () => {
  try { return JSON.parse(await fs.readFile(FILE, 'utf8')); } catch { return {}; }
};
const writeFile = async (db) => {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(db, null, 2));
};

export const hasDatabase = () => Boolean(redis) || !process.env.VERCEL;

export async function get(key, fallback) {
  if (redis) {
    const v = await redis.get(PREFIX + key);
    return v == null ? fallback : v;
  }
  if (process.env.VERCEL) return fallback;
  const db = await readFile();
  return key in db ? db[key] : fallback;
}

export async function set(key, value) {
  if (redis) return redis.set(PREFIX + key, value);
  if (process.env.VERCEL) throw notConnected();
  const db = await readFile();
  db[key] = value;
  await writeFile(db);
}

// Set-if-absent, used to process each Stripe event only once.
export async function claim(key, ttlSeconds = 60 * 60 * 24 * 30) {
  if (redis) return (await redis.set(PREFIX + 'once:' + key, 1, { nx: true, ex: ttlSeconds })) === 'OK';
  if (process.env.VERCEL) throw notConnected();
  const db = await readFile();
  db.once = db.once || {};
  if (db.once[key]) return false;
  db.once[key] = 1;
  await writeFile(db);
  return true;
}

/* ---------- Products ---------- */
export const listProducts = async () => (await get('products', [])) || [];
export const saveProducts = (products) => set('products', products);

/* ---------- Orders ---------- */
export const listOrders = async () => (await get('orders', [])) || [];
export const saveOrders = (orders) => set('orders', orders.slice(0, 1000));

/* ---------- Settings ---------- */
export const DEFAULT_SETTINGS = {
  shippingCents: 990,        // Versand innerhalb Deutschlands
  freeShippingFromCents: 0,  // 0 = keine Versandkostenfreiheit
  allowShipping: true,
  allowPickup: true,         // Abholung im Laden, F1 8
};
export const getSettings = async () => ({ ...DEFAULT_SETTINGS, ...((await get('settings', {})) || {}) });
export const saveSettings = (s) => set('settings', s);
