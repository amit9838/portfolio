# AGENTS.md

Guidance for AI coding agents working in this repository. Humans: see `README.md`.

## Project

Personal portfolio for Amit Chaudhary. Static site, Astro 7 + Tailwind CSS v4, deployed to GitHub Pages at `https://amit9838.github.io/portfolio/` (served under the **`/portfolio` base path**). Pages: Home, Resume, Projects, Contact, 404. Light and dark themes. Almost no client-side JavaScript.

## Commands

| Task                                 | Command                                            |
| ------------------------------------ | -------------------------------------------------- |
| Install                              | `npm install` (Node ≥ 22.23)                       |
| Dev server                           | `npm run dev` → `http://localhost:4321/portfolio/` |
| Type-check                           | `npm run check`                                    |
| Lint                                 | `npm run lint` (design tokens + WCAG contrast)     |
| Build                                | `npm run build` (runs `astro check` first)         |
| Serve the build                      | `npm run preview`                                  |
| All tests                            | `npm test` (needs a fresh build)                   |
| Everything CI runs                   | `npm run verify`                                   |
| Format                               | `npm run format`                                   |
| Regenerate `public/og.png` and icons | `npm run images`                                   |

Run `npm run verify` before declaring work done. A task is not finished if it fails.

## Layout

```
src/content/        All site copy, as YAML (schemas in src/content.config.ts)
src/components/     Shared UI components
src/layouts/        BaseLayout.astro: <head>, Header, Footer, theme script
src/lib/            content.ts (data access), site.ts (page list), url.ts, format.ts, project-stats.ts
src/pages/          One file per route; composes components and data only
src/styles/global.css   The only place colours, fonts and line heights are defined
public/             favicon, og.png, robots.txt (generated or static)
scripts/            lint, test and image scripts
tests/site.spec.ts  Playwright end-to-end tests
```

## Rules

### Privacy (hard rules)

- **Never add a phone number** anywhere (content, code, tests, commits, PR text). The profile schema rejects unknown keys, and `npm run test:private` fails the build on anything shaped like one. Don't write the actual number in a test or script to "check" for it.
- **Never publish a resume PDF.** The resumes contain the phone number.

### Content

- Pages hold no copy. Text lives in `src/content/*.yaml`; read it through the helpers in `src/lib/content.ts` (`getProfile`, `getStatGroups`, `getProjects`, …), not raw `getCollection`.
- YAML files are **keyed maps** (`id:` as the key), not lists with an `id` field: schemas use `z.strictObject`, which rejects an `id` key.
- Every schema is `strictObject`. To add a field, add it to `src/content.config.ts` first.
- `stars`, `forks` and `downloads` in `projects.yaml` are fallbacks. `src/lib/project-stats.ts` refreshes them from GitHub and Flathub at build time. The GitHub API rate-limits anonymous requests, so `HTTP 403` warnings locally are expected.
- Don't make claims the sources don't support. Quotes must be verbatim, and numbers must come from a checkable source.
- After changing the name, title or tagline, run `npm run images` so `public/og.png` matches.

### Styling

- **Colours exist only as tokens in `src/styles/global.css`** (`--color-page`, `--color-surface`, `--color-strong`, `--color-body`, `--color-muted`, `--color-accent`, `--color-accent-ink`, …). Tailwind's default palette is disabled. Use token classes (`bg-surface`, `text-muted`), never hex or arbitrary colours. `npm run lint:tokens` enforces this (`src/assets/` artwork is exempt).
- Every text colour must meet WCAG AA in **both** themes. Light-theme values live in `:root[data-theme='light']`. Check with `npm run lint:contrast`.
- Amber `--color-accent` is for decoration. Text in the accent colour uses `--color-accent-ink`.
- **Only two typefaces:** Figtree (`font-sans`, body and UI) and Source Serif 4 (`font-serif`, headings). Don't add fonts or fallback stacks.
- Paragraph line height is **1.5** site-wide via the theme. Don't add `leading-*` to paragraphs. Only display text (page titles, stat numbers: `leading-[1.1]`) and tags override it.
- Mobile-first. Breakpoints: `sm` 640px (type and stats), `md` 768px (header switches from drawer to inline nav). Nothing may scroll horizontally from 320px up.

### Components

- Reuse before adding. Make a component the second time markup repeats; avoid one-off wrappers.
- Components receive data through props. Only pages and `BaseLayout` read content.
- Variants use `tailwind-variants` (`tv()`), with a string-union prop (`variant`, `size`, `shape`), not boolean flags.
- **All links go through `Link.astro`.** It adds the `/portfolio` base path to internal links, and makes `http(s)` links open in a new tab with `rel="noopener noreferrer"` plus a screen-reader note. For a raw path, use `url()` from `src/lib/url.ts`; never hard-code `/portfolio/...`.
- Buttons go through `Button.astro` (`variant`: `primary` / `outline`; `shape`: `default` / `pill` / `circle`). A `circle` button is icon-only and needs `label`.
- Icons come from `astro-icon`: `lucide:*` for UI, `simple-icons:*` for brands. No hand-written SVG paths in components. To recolour a fill, render with `is:inline` and target `[&_path]`.
- Navigation is defined once in `src/lib/site.ts` (header nav and "Keep exploring" suggestions).
- Interactive bits use native elements: `<dialog>` for the drawer and screenshot viewer, `<button>` for toggles. Keep JavaScript to small inline scripts.

### Accessibility

- Real `<a>` / `<button>` elements, 44px minimum touch targets, `aria-label` on icon-only controls, decorative icons `aria-hidden`.
- Heading levels stay in order on every page.

## Testing notes

- `npm run test:e2e` builds nothing itself: run `npm run build` first. Playwright serves `dist/` with `scripts/serve-dist.mjs` on **port 4399**, which mimics GitHub Pages (base path, 404 page).
- Don't use `astro preview` in scripts or tests. Astro 7 detaches it into the background when not run in a TTY, so a test runner can't manage it. If one is left running, stop it with `npx astro preview stop`.
- Don't point tests at the dev server: it injects the Astro toolbar, which breaks link assertions.
- `npm run test:links` skips sites that block bots (LinkedIn, X, Dribbble) and the site's own live URLs.
- Add or update a test in `tests/site.spec.ts` when you add behaviour (new page, interactive component, navigation change).

## Git and deploy

- Default branch: `master`. Work on a feature branch.
- Ask before committing, pushing or opening a PR.
- Never add a `Co-Authored-By` (or any AI attribution) line to commits or PRs.
- Commit in phases: one commit per logical change, not one big commit.
- CI (`.github/workflows/deploy.yml`) runs lint, build, the privacy check, e2e and link checks on every PR. Pushes to `master` deploy to GitHub Pages.
- Not committed: `PLAN.md`, `docs/design-ref/` (third-party design screenshots), `dist/`, `.astro/`, test output.
- Credit for the original design (Andrei Hudovich, Dribbble) stays in the footer and README.
