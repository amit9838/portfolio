// Fails if a hex colour appears anywhere in src/ outside the token file.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('src');
const ALLOWED = new Set([path.join(ROOT, 'styles', 'global.css')]);
// Artwork (app icons, screenshots) keeps its own colours.
const SKIP_DIRS = new Set([path.join(ROOT, 'assets')]);
const EXTS = new Set([
  '.astro',
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.css',
  '.yaml',
  '.yml',
  '.json',
  '.svg',
]);
// A hex colour: 3, 4, 6 or 8 hex digits, not part of a URL fragment like href="#about".
const HEX = /(?<![\w&/="'-])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})\b/gi;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(full)) yield* walk(full);
    } else if (EXTS.has(path.extname(entry.name))) yield full;
  }
}

let failures = 0;
for await (const file of walk(ROOT)) {
  if (ALLOWED.has(file)) continue;
  const lines = (await readFile(file, 'utf8')).split('\n');
  lines.forEach((line, i) => {
    for (const m of line.matchAll(HEX)) {
      failures++;
      console.error(
        `${path.relative(process.cwd(), file)}:${i + 1}  ${m[0]}  → use a token from src/styles/global.css`,
      );
    }
  });
}

if (failures) {
  console.error(`\n${failures} hard-coded colour(s) found.`);
  process.exit(1);
}
console.log('lint:tokens — no hard-coded colours outside src/styles/global.css');
