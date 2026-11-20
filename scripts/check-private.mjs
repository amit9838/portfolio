// Fails if the built site contains a phone number or a resume PDF.
// The phone number itself is never written here: the check matches any mobile-number shape.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve('dist');
// Indian mobile numbers (+91 optional, 10 digits starting 6–9, with or without separators),
// plus any long run of digits that looks like a phone number.
const PHONE = /(?<!\d)(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}(?!\d)/g;

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const problems = [];
for await (const file of walk(DIST)) {
  const rel = path.relative(DIST, file);
  if (file.endsWith('.pdf'))
    problems.push(`${rel}: PDF in the build (resumes contain the phone number)`);
  if (!/\.(html|xml|txt|json|js)$/.test(file)) continue;
  // Strip inline data URIs (fonts/images) so base64 can't cause false matches.
  const text = (await readFile(file, 'utf8')).replace(/data:[^"')\s]+/g, '');
  for (const m of text.matchAll(PHONE)) problems.push(`${rel}: looks like a phone number: ${m[0]}`);
}

if (problems.length) {
  problems.forEach((p) => console.error('✗ ' + p));
  process.exit(1);
}
console.log('test:private — no phone numbers or PDFs in dist/');
