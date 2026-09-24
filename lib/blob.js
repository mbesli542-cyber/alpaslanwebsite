// Image storage: Vercel Blob in production, .data/uploads locally.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { blobToken, blobStoreId, hasBlob } from './env.js';

// Credentials for @vercel/blob: classic read/write token, or OIDC with the store id.
const blobAuth = () => (blobToken() ? { token: blobToken() } : blobStoreId() ? { storeId: blobStoreId() } : {});

const TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

export async function saveImage(bytes, contentType) {
  const ext = TYPES[contentType];
  if (!ext) throw Object.assign(new Error('Nur JPG, PNG oder WebP.'), { status: 415 });
  if (bytes.byteLength > 4 * 1024 * 1024) throw Object.assign(new Error('Bild zu groß (max. 4 MB).'), { status: 413 });
  const name = `produkte/${randomUUID()}.${ext}`;

  if (hasBlob()) {
    const { put } = await import('@vercel/blob');
    const blob = await put(name, Buffer.from(bytes), { access: 'public', contentType, addRandomSuffix: false, ...blobAuth() });
    return blob.url;
  }
  if (process.env.VERCEL) throw Object.assign(new Error('Fotoğraf deposu bağlı değil. Vercel → Storage → Blob ekleyip Redeploy yapın.'), { status: 503, expose: true });
  const file = path.join(process.cwd(), '.data', 'uploads', name);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, Buffer.from(bytes));
  return '/uploads/' + name;
}

export async function deleteImage(url) {
  try {
    if (hasBlob() && /^https:\/\//.test(url)) {
      const { del } = await import('@vercel/blob');
      await del(url, blobAuth());
    } else if (url.startsWith('/uploads/')) {
      await fs.unlink(path.join(process.cwd(), '.data', url));
    }
  } catch (e) {
    console.warn('Bild konnte nicht gelöscht werden', url, e.message);
  }
}
