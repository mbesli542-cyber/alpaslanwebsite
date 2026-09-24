import { json, safe } from '../../lib/http.js';
import { requireAdmin } from '../../lib/auth.js';
import { saveImage } from '../../lib/blob.js';

// POST /api/admin/upload  raw image body (the admin page resizes photos before sending)
export const POST = safe(async (request) => {
  requireAdmin(request);
  const type = (request.headers.get('content-type') || '').split(';')[0].trim();
  const bytes = await request.arrayBuffer();
  const url = await saveImage(bytes, type);
  return json({ url });
});
