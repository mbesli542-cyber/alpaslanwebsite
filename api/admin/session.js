import { json, error, readJson, safe } from '../../lib/http.js';
import { checkPassword, sessionCookie, clearCookie, isAdmin } from '../../lib/auth.js';

// Simple brute-force brake: failed logins wait a moment.
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

export const GET = safe(async (request) => json({ loggedIn: isAdmin(request) }));

export const POST = safe(async (request) => {
  const { password } = await readJson(request, 2000);
  if (!checkPassword(password)) {
    await pause(1200);
    return error(401, 'Falsches Passwort.');
  }
  return json({ loggedIn: true }, { headers: { 'set-cookie': sessionCookie() } });
});

export const DELETE = safe(async () => json({ loggedIn: false }, { headers: { 'set-cookie': clearCookie() } }));
