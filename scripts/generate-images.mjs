// Renders the static images in public/ with Playwright: the link-preview (Open Graph) image
// and PNG icons for platforms that don't support SVG favicons.
// Run after changing the name, title or tagline: `npm run images`.
import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Keep in sync with src/content/profile.yaml and the stats on Home.
const og = {
  logo: '/home',
  name: 'Amit Chaudhary',
  title: 'Software Engineer',
  tagline:
    'I build microservices, cloud-native APIs and AI-driven platforms in Python and Go, and frontends in React and TypeScript.',
  facts: ['50K+ daily logins', '500+ videos a day', '128K+ Flathub downloads'],
  url: 'amit9838.github.io/portfolio',
};

const font = async (pkg, file) =>
  (await readFile(path.join('node_modules/@fontsource-variable', pkg, 'files', file))).toString(
    'base64',
  );
const [figtree, serif] = await Promise.all([
  font('figtree', 'figtree-latin-wght-normal.woff2'),
  font('source-serif-4', 'source-serif-4-latin-wght-normal.woff2'),
]);
const fonts = `
  @font-face { font-family: Figtree; font-weight: 300 900; src: url(data:font/woff2;base64,${figtree}) format('woff2'); }
  @font-face { font-family: 'Source Serif 4'; font-weight: 200 900; src: url(data:font/woff2;base64,${serif}) format('woff2'); }
  * { box-sizing: border-box; margin: 0; }
  body { font-family: Figtree, sans-serif; }`;

const wave = `<svg width="150" height="20" viewBox="0 0 150 20" fill="none"><path d="M3 10 Q9 2 15 10 T27 10 T39 10 T51 10 T63 10 T75 10 T87 10 T99 10 T111 10 T123 10 T135 10 T147 10" stroke="#fca311" stroke-width="3.5" stroke-linecap="round"/></svg>`;

const ogHtml = `<!doctype html><html><head><style>${fonts}
  body { width: 1200px; height: 630px; background: #111113; color: #ededea; padding: 64px 80px; display: flex; flex-direction: column; }
  .logo { font-family: ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace; font-size: 32px; font-weight: 700; display: flex; align-items: center; }
  .logo span { color: #fca311; }
  .logo i { display: inline-block; width: 0.55em; height: 0.85em; margin-left: 4px; background: #fca311; }
  .eyebrow { margin-top: 56px; font-size: 20px; font-weight: 600; color: #94948e; }
  h1 { margin-top: 14px; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: 76px; line-height: 1.05; letter-spacing: -1px; }
  h1 span { color: #94948e; }
  p { margin-top: 24px; font-size: 26px; line-height: 1.5; color: #c8c8c3; max-width: 980px; }
  .wave { margin-top: 28px; }
  .foot { margin-top: auto; display: flex; justify-content: space-between; align-items: center; font-size: 22px; color: #94948e; }
  .facts { display: flex; gap: 12px; }
  .facts b { font-weight: 600; color: #e2e2de; padding: 8px 16px; border: 1px solid #28282b; background: #18181b; border-radius: 999px; font-size: 20px; }
</style></head><body>
  <div class="logo"><span>~</span>${og.logo}<i></i></div>
  <div class="eyebrow">${og.title}</div>
  <h1><span>Hey, I’m</span> ${og.name}!</h1>
  <p>${og.tagline}</p>
  <div class="wave">${wave}</div>
  <div class="foot"><div class="facts">${og.facts.map((f) => `<b>${f}</b>`).join('')}</div><div>${og.url}</div></div>
</body></html>`;

const favicon = await readFile('public/favicon.svg', 'utf8');
const iconHtml = (size) =>
  `<!doctype html><html><head><style>*{margin:0} body{width:${size}px;height:${size}px}</style></head><body>${favicon.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`;

const browser = await chromium.launch();
const shots = [
  { html: ogHtml, w: 1200, h: 630, out: 'public/og.png' },
  { html: iconHtml(180), w: 180, h: 180, out: 'public/apple-touch-icon.png' },
  { html: iconHtml(32), w: 32, h: 32, out: 'public/favicon-32.png' },
];
for (const s of shots) {
  const page = await browser.newPage({ viewport: { width: s.w, height: s.h } });
  await page.setContent(s.html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: s.out, omitBackground: s.out.includes('icon') });
  console.log('wrote', s.out);
  await page.close();
}
await browser.close();
