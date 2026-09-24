// Small helpers for Vercel Functions written against the Web Request/Response API.

export const json = (data, init = {}) =>
  new Response(JSON.stringify(data), {
    status: init.status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...(init.headers || {}) },
  });

export const error = (status, message) => json({ error: message }, { status });

export const readJson = async (request, maxBytes = 200_000) => {
  const text = await request.text();
  if (text.length > maxBytes) throw Object.assign(new Error('Payload too large'), { status: 413 });
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw Object.assign(new Error('Invalid JSON'), { status: 400 });
  }
};

// Base URL of the site for redirects (Stripe success/cancel). Prefers an explicit SITE_URL.
export const siteUrl = (request) => {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  const url = new URL(request.url);
  const proto = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '');
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || url.host;
  return `${proto}://${host}`;
};

// Wrap a handler so thrown errors become JSON responses instead of a crash page.
export const safe = (fn) => async (request) => {
  try {
    return await fn(request);
  } catch (e) {
    const status = e.status || 500;
    if (status >= 500) console.error(e);
    return error(status, status >= 500 ? 'Serverfehler. Bitte später erneut versuchen.' : e.message);
  }
};
