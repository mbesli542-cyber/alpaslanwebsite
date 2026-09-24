// Admin session: a signed, HttpOnly cookie. ADMIN_PASSWORD and SESSION_SECRET come from Vercel env vars.
import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE = 'parla_admin';
const MAX_AGE = 60 * 60 * 12; // 12 hours

const secret = () => {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw Object.assign(new Error('SESSION_SECRET eksik ya da çok kısa (en az 16 karakter).'), { status: 500, expose: true });
  return s;
};
const sign = (payload) => createHmac('sha256', secret()).update(payload).digest('base64url');

const safeEqual = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};

export const checkPassword = (password) => {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw Object.assign(new Error('ADMIN_PASSWORD tanımlı değil.'), { status: 500, expose: true });
  return safeEqual(password || '', expected);
};

const secureFlag = () => (process.env.VERCEL || process.env.NODE_ENV === 'production' ? '; Secure' : '');

export const sessionCookie = () => {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `admin.${exp}`;
  return `${COOKIE}=${payload}.${sign(payload)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${MAX_AGE}${secureFlag()}`;
};

export const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secureFlag()}`;

export const isAdmin = (request) => {
  const raw = (request.headers.get('cookie') || '').split(/;\s*/).find((c) => c.startsWith(COOKIE + '='));
  if (!raw) return false;
  const value = raw.slice(COOKIE.length + 1);
  const i = value.lastIndexOf('.');
  if (i < 0) return false;
  const payload = value.slice(0, i);
  const sig = value.slice(i + 1);
  if (!safeEqual(sig, sign(payload))) return false;
  const exp = Number(payload.split('.')[1]);
  return Number.isFinite(exp) && exp > Date.now() / 1000;
};

export const requireAdmin = (request) => {
  if (!isAdmin(request)) throw Object.assign(new Error('Nicht angemeldet.'), { status: 401 });
};
