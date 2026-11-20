// Checks WCAG contrast of every text/background token pair, in both themes.
// Reads the tokens from src/styles/global.css so it stays in sync with the design.
import { readFile } from 'node:fs/promises';

const css = await readFile('src/styles/global.css', 'utf8');
const block = (start) => css.slice(css.indexOf(start), css.indexOf('}', css.indexOf(start)));
const tokens = (text) =>
  Object.fromEntries(
    [...text.matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]),
  );

const dark = tokens(block('@theme {'));
const light = { ...dark, ...tokens(block(":root[data-theme='light']")) };

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const f = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

// [text token, background token, minimum ratio, what it's used for]
const pairs = [
  ['strong', 'page', 4.5, 'headings, primary text'],
  ['strong', 'surface', 4.5, 'text on cards'],
  ['soft', 'page', 4.5, 'company line, tags'],
  ['soft', 'surface', 4.5, 'skill tags'],
  ['body', 'page', 4.5, 'body copy'],
  ['body', 'surface', 4.5, 'card text'],
  ['muted', 'page', 4.5, 'dates, metadata'],
  ['muted', 'surface', 4.5, 'card sources'],
  ['accent-ink', 'page', 4.5, 'accent text (name, active nav)'],
  ['accent-ink', 'surface', 4.5, 'stat numbers on cards'],
  ['on-accent', 'accent', 4.5, 'text on amber button'],
];
// Reported but not enforced: decorative borders. Every outlined button is identified by its
// icon/text (checked above), so WCAG 1.4.11 does not require the border itself to reach 3:1.
const info = [['line-strong', 'page', 'outline button border (decorative)']];

let failed = 0;
for (const [name, theme] of [
  ['dark', dark],
  ['light', light],
]) {
  console.log(`\n${name} theme`);
  for (const [fg, bg, min, use] of pairs) {
    const r = ratio(theme[fg], theme[bg]);
    const ok = r >= min;
    if (!ok) failed++;
    console.log(
      `  ${ok ? '✓' : '✗'} ${`${fg} on ${bg}`.padEnd(26)} ${r.toFixed(2).padStart(5)}:1  (min ${min})  ${use}`,
    );
  }
  for (const [fg, bg, use] of info) {
    console.log(
      `  · ${`${fg} on ${bg}`.padEnd(26)} ${ratio(theme[fg], theme[bg]).toFixed(2).padStart(5)}:1  (info)   ${use}`,
    );
  }
}
if (failed) {
  console.error(`\n${failed} pair(s) below the WCAG minimum.`);
  process.exit(1);
}
console.log('\nlint:contrast — all text pairs meet WCAG AA in both themes');
