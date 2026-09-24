// Vercel can add a custom prefix when a store is connected (e.g. STORAGE_KV_REST_API_URL).
// Find a variable by its exact name first, then by suffix.
export const envBySuffix = (...names) => {
  for (const n of names) if (process.env[n]) return process.env[n];
  for (const n of names) {
    const key = Object.keys(process.env).find((k) => k.endsWith('_' + n) && process.env[k]);
    if (key) return process.env[key];
  }
  return undefined;
};
export const redisUrl = () => envBySuffix('KV_REST_API_URL', 'UPSTASH_REDIS_REST_URL');
export const redisToken = () => envBySuffix('KV_REST_API_TOKEN', 'UPSTASH_REDIS_REST_TOKEN');
export const blobToken = () => envBySuffix('BLOB_READ_WRITE_TOKEN') ||
  process.env[Object.keys(process.env).find((k) => /BLOB/.test(k) && /READ_WRITE_TOKEN$/.test(k) && process.env[k]) || ''];

// Newer Blob stores authenticate with the project's OIDC token plus the store id (no read/write token).
export const blobStoreId = () => envBySuffix('BLOB_STORE_ID');
export const hasBlob = () => Boolean(blobToken() || blobStoreId());

// Names only (never values) of storage-related variables, to diagnose a missing connection.
export const storageVarNames = () =>
  Object.keys(process.env).filter((k) => /BLOB|KV_|REDIS|UPSTASH/i.test(k)).sort();
