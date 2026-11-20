// Checks every link in the built site (dist/), internal and external.
// The site is served under /portfolio, so dist/ is exposed at that path for the check.
import { check } from 'linkinator';
import { mkdir, rm, symlink } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('.linkcheck');
await rm(root, { recursive: true, force: true });
await mkdir(root);
await symlink(path.resolve('dist'), path.join(root, 'portfolio'), 'dir');

// Sites that block automated requests (they work in a browser).
const blocksBots = ['linkedin.com', 'x.com', 'dribbble.com'];
// Absolute URLs of this site itself (canonical, og:image): checked locally instead,
// since they only exist on the live site after deploy.
const SELF = 'https://amit9838.github.io/portfolio/';

const result = await check({
  path: 'portfolio/',
  serverRoot: root,
  recurse: true,
  timeout: 15000,
  retry: true,
  concurrency: 10,
  linksToSkip: async (link) =>
    link.startsWith('mailto:') ||
    link.startsWith(SELF) ||
    blocksBots.some((d) => new URL(link, 'http://x').hostname.endsWith(d)),
});

await rm(root, { recursive: true, force: true });

const broken = result.links.filter((l) => l.state === 'BROKEN');
const ok = result.links.filter((l) => l.state === 'OK').length;
const skipped = result.links.filter((l) => l.state === 'SKIPPED').length;
for (const l of broken) console.error(`✗ ${l.status ?? 'ERR'}  ${l.url}  (on ${l.parent})`);
console.log(
  `test:links — ${ok} ok, ${skipped} skipped (${blocksBots.join(', ')}, mailto, own live URLs), ${broken.length} broken`,
);
process.exit(broken.length ? 1 : 0);
