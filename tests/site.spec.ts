import { expect, test, type Page } from '@playwright/test';

const pages = [
  { path: '', h1: /Hey, I’m/ },
  { path: 'resume', h1: 'My Resume / CV' },
  { path: 'projects', h1: 'Projects' },
  { path: 'contact', h1: 'Get in touch' },
];

/** Collects console errors and uncaught exceptions for the page's lifetime. */
function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

for (const theme of ['dark', 'light'] as const) {
  test.describe(`${theme} theme`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
    });

    for (const { path, h1 } of pages) {
      test(`/${path} renders cleanly`, async ({ page }) => {
        const errors = trackErrors(page);
        const res = await page.goto(path);
        expect(res?.status()).toBe(200);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(h1);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        );
        expect(overflow, 'no horizontal scrolling').toBe(0);
        expect(errors).toEqual([]);
      });
    }
  });
}

test('unknown routes show the 404 page', async ({ page }) => {
  const res = await page.goto('this-page-does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page Not Found');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
});

test('theme toggle switches and remembers the theme', async ({ page, isMobile }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem('theme', 'dark');
      sessionStorage.setItem('seeded', '1');
    }
  });
  await page.goto('');
  if (isMobile) await page.getByRole('button', { name: 'Open menu' }).click();
  await page
    .locator(isMobile ? '#site-drawer [data-theme-toggle]' : 'header [data-theme-toggle]')
    .click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('header navigation marks the current page', async ({ page, isMobile }) => {
  await page.goto('projects');
  if (isMobile) await page.getByRole('button', { name: 'Open menu' }).click();
  const nav = page
    .getByRole(isMobile ? 'dialog' : 'banner')
    .getByRole('navigation', { name: 'Main' });
  await expect(nav.getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page');
  await nav.getByRole('link', { name: 'Resume' }).click();
  await expect(page).toHaveURL(/\/resume\/?$/);
});

test('terminal cursor sits on the selected tab, or on the logo', async ({ page, isMobile }) => {
  test.skip(isMobile, 'the desktop nav shows the tabs inline');
  const header = page.getByRole('banner');
  await page.goto('projects');
  await expect(header.locator('[data-cursor]')).toHaveCount(1);
  await expect(header.getByRole('link', { name: 'Projects' }).locator('[data-cursor]')).toHaveCount(
    1,
  );
  await page.goto('');
  await expect(header.locator('[data-cursor]')).toHaveCount(1);
  await expect(header.getByRole('link', { name: /home/ }).locator('[data-cursor]')).toHaveCount(1);
});

test('logo types itself once per session', async ({ page }) => {
  await page.goto('');
  await expect(page.locator('html')).toHaveAttribute('data-typing', '');
  await expect(page.locator('[data-prompt]').first()).toHaveText('~/home');
  await page.goto('resume');
  await expect(page.locator('html')).not.toHaveAttribute('data-typing');
});

test('page content animates on page switch, unless motion is reduced', async ({ page }) => {
  const transitionName = () =>
    page.locator('main').evaluate((el) => getComputedStyle(el).viewTransitionName);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('');
  expect(await transitionName()).toBe('page');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await transitionName()).toBe('none');
});

test('mobile drawer opens and closes', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'the drawer only exists on small screens');
  // A nav page, so the drawer has a selected tab (marked without a cursor).
  await page.goto('projects');
  const drawer = page.locator('#site-drawer');
  for (const close of ['Escape', 'button', 'backdrop'] as const) {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(drawer).toBeVisible();
    await expect(drawer.locator('[data-cursor]')).toHaveCount(0);
    if (close === 'Escape') await page.keyboard.press('Escape');
    if (close === 'button') await page.getByRole('button', { name: 'Close menu' }).click();
    if (close === 'backdrop') await page.mouse.click(10, 300);
    await expect(drawer).toBeHidden();
  }
});

test('drawer slides closed before following a link', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'the drawer only exists on small screens');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('');
  // Record whether the drawer was still open as the page unloads.
  await page.evaluate(() =>
    addEventListener('pagehide', () => {
      const open = (document.getElementById('site-drawer') as HTMLDialogElement).open;
      sessionStorage.setItem('drawerOpenOnLeave', String(open));
    }),
  );
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.locator('#site-drawer').getByRole('link', { name: 'Resume' }).click();
  await expect(page).toHaveURL(/\/resume$/);
  expect(await page.evaluate(() => sessionStorage.getItem('drawerOpenOnLeave'))).toBe('false');
});

test('desktop has no menu button', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop only');
  await page.goto('');
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden();
});

test('Mousam screenshot dialog opens and closes', async ({ page }) => {
  await page.goto('projects');
  const dialog = page.locator('dialog[id^="evidence-"]');
  await page.getByRole('button', { name: 'See screenshot' }).click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('img')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('external links open in a new tab, internal ones do not', async ({ page }) => {
  for (const { path } of pages) {
    await page.goto(path);
    const links = await page.locator('a[href]').evaluateAll((as) =>
      as.map((a) => ({
        href: a.getAttribute('href')!,
        target: a.getAttribute('target'),
        rel: a.getAttribute('rel') ?? '',
      })),
    );
    for (const l of links) {
      if (/^https?:/.test(l.href)) {
        expect(l.target, l.href).toBe('_blank');
        expect(l.rel, l.href).toContain('noopener');
      } else if (!l.href.endsWith('.png')) {
        expect(l.target, l.href).toBeNull();
      }
    }
  }
});

test('"Keep exploring" links match each page', async ({ page }) => {
  const expected: Record<string, string[]> = {
    '': ['Resume', 'Projects'],
    resume: ['Projects', 'Contact'],
    projects: ['Resume', 'Contact'],
    contact: ['Home', 'Resume'],
  };
  for (const [path, labels] of Object.entries(expected)) {
    await page.goto(path);
    const nav = page.getByRole('navigation', { name: 'Keep exploring' });
    await expect(nav.getByRole('link')).toHaveText(labels);
  }
});

test('home has link-preview tags and structured data', async ({ page }) => {
  await page.goto('');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\.png$/);
  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(ld['@type']).toBe('Person');
  expect(ld.name).toBe('Amit Chaudhary');
});

test('Flathub downloads show the full number', async ({ page }) => {
  await page.goto('projects');
  // The count is refreshed at build time, so match its shape: "128,573 downloads on Flathub".
  await expect(page.getByText(/^\d{1,3}(,\d{3})+ downloads on Flathub$/)).toBeVisible();
  // The home stat tile: the number sits above its "Flathub downloads" label.
  await page.goto('');
  const tile = page.getByRole('listitem').filter({ hasText: 'Flathub downloads' });
  await expect(tile.getByText(/^\d{1,3}(,\d{3})+$/)).toBeVisible();
});
