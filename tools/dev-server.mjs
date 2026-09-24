// Local development server: static files + /api/* Vercel-style functions (Web Request/Response).
// Usage: ADMIN_PASSWORD=… SESSION_SECRET=… DEV_FAKE_STRIPE=1 node tools/dev-server.mjs
import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const port = Number(process.env.PORT || 3000);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.webm': 'video/webm', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.md': 'text/plain; charset=utf-8' };

const readBody = (req) => new Promise((resolve, reject) => {
  const chunks = [];
  req.on('data', (c) => chunks.push(c));
  req.on('end', () => resolve(Buffer.concat(chunks)));
  req.on('error', reject);
});

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  try {
    if (url.pathname.startsWith('/api/')) {
      const file = path.join(root, url.pathname.replace(/\/$/, '') + '.js');
      if (!file.startsWith(path.join(root, 'api'))) throw Object.assign(new Error('bad path'), { code: 'ENOENT' });
      await fs.access(file);
      const mod = await import(pathToFileURL(file).href + '?t=' + Date.now());
      const handler = mod[req.method];
      if (!handler) { res.writeHead(405); return res.end('Method not allowed'); }
      const body = ['GET', 'HEAD'].includes(req.method) ? undefined : await readBody(req);
      const request = new Request(url, { method: req.method, headers: req.headers, body });
      const response = await handler(request);
      const headers = {};
      response.headers.forEach((v, k) => { headers[k] = v; });
      res.writeHead(response.status, headers);
      return res.end(Buffer.from(await response.arrayBuffer()));
    }
    let rel = decodeURIComponent(url.pathname);
    if (rel.endsWith('/')) rel += 'index.html';
    const file = rel.startsWith('/uploads/') ? path.join(root, '.data', rel) : path.join(root, rel);
    if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
    const data = await fs.readFile(file);
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(data);
  } catch (e) {
    if (e.code === 'ENOENT' || e.code === 'EISDIR') { res.writeHead(404); return res.end('Not found'); }
    console.error(e);
    res.writeHead(500); res.end('Server error');
  }
}).listen(port, () => console.log(`PARLA dev server on http://localhost:${port}`));
