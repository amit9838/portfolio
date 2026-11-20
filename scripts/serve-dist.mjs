// Serves dist/ under /portfolio exactly like GitHub Pages: directory index.html,
// and dist/404.html with status 404 for unknown paths. Stays in the foreground
// (unlike `astro preview`), so Playwright can start and stop it.
// Usage: node scripts/serve-dist.mjs [port]
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';

const PORT = Number(process.argv[2] ?? 4399);
const BASE = '/portfolio';
const ROOT = path.resolve('dist');
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.json': 'application/json',
};

async function resolve(urlPath) {
  const rel = decodeURIComponent(urlPath.slice(BASE.length)) || '/';
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT)) return null;
  for (const candidate of [file, path.join(file, 'index.html'), `${file}.html`]) {
    const s = await stat(candidate).catch(() => null);
    if (s?.isFile()) return candidate;
  }
  return null;
}

createServer(async (req, res) => {
  const urlPath = new URL(req.url ?? '/', 'http://x').pathname;
  if (urlPath === BASE) return res.writeHead(301, { Location: `${BASE}/` }).end();
  const file = urlPath.startsWith(`${BASE}/`) ? await resolve(urlPath) : null;
  const target = file ?? path.join(ROOT, '404.html');
  res.writeHead(file ? 200 : 404, {
    'Content-Type': TYPES[path.extname(target)] ?? 'application/octet-stream',
  });
  createReadStream(target).pipe(res);
}).listen(PORT, () => console.log(`Serving dist/ at http://localhost:${PORT}${BASE}/`));
