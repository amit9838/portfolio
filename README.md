# Amit Chaudhary — Portfolio

Personal site: **https://amit9838.github.io/portfolio/**

A static site built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com), deployed to GitHub Pages. It has a light and a dark theme and ships almost no JavaScript.

Design based on [Full Stack Developer Personal Website](https://dribbble.com/shots/24357096-Full-Stack-Developer-Personal-Website) by Andrei Hudovich.

## Run it locally

Requires Node.js 22.23 or later.

```sh
npm install
npm run dev        # http://localhost:4321/portfolio/
```

## Editing content

All text lives in `src/content/` as YAML; pages never contain copy. Each file is checked against a schema in `src/content.config.ts` when the site builds, so a typo in a field name fails the build instead of shipping.

| File                                  | What it holds                                                                                                                             |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `profile.yaml`                        | Name, title, tagline, location, email, social links                                                                                       |
| `stats.yaml`                          | "By the numbers" on Home                                                                                                                  |
| `experience.yaml`                     | Work history (newest first is worked out from `start`)                                                                                    |
| `skills.yaml`                         | Skill groups on the Resume page                                                                                                           |
| `education.yaml`, `achievements.yaml` | Resume page                                                                                                                               |
| `projects.yaml`                       | Project cards. `stars`, `forks` and `downloads` are refreshed from GitHub and Flathub at build time; the values in the file are fallbacks |

Never add a phone number: the profile schema rejects unknown fields, and `npm run test:private` fails the build if one appears.

After changing the name, title or tagline, regenerate the link-preview image with `npm run images`.

## Code layout

```
src/
  components/   Shared UI (Button, Card, Timeline, ProjectCard, Header…)
  content/      Site content (YAML)
  layouts/      BaseLayout: <head>, header, footer, theme script
  lib/          Content helpers, page list, URL and number formatting
  pages/        One file per route
  styles/       global.css — the only place colours and fonts are defined
public/         Favicon, link-preview image, robots.txt
scripts/        Lint, test and image-generation scripts
tests/          Playwright end-to-end tests
```

Colours are design tokens in `src/styles/global.css`; components use token classes (`bg-surface`, `text-muted`) and never raw colours. Typefaces are Figtree (text), Source Serif 4 (headings) and JetBrains Mono (the header logo and nav tabs), served from the site itself.

## Checks

| Command          | What it does                                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`   | No hard-coded colours outside the token file; every text colour meets WCAG AA contrast in both themes                           |
| `npm run build`  | Type-checks, then builds to `dist/`                                                                                             |
| `npm test`       | No phone numbers or PDFs in the build, Playwright end-to-end tests (desktop and mobile, both themes), and a check of every link |
| `npm run verify` | All of the above                                                                                                                |

`npm run preview` serves the build at `http://localhost:4321/portfolio/`, the same way GitHub Pages does.

## Deployment

`.github/workflows/deploy.yml` runs the checks on every pull request and push. Pushes to `master` are then built with `withastro/action` and deployed to GitHub Pages.

One-time setup: in the repository's **Settings → Pages**, set **Source** to **GitHub Actions**.
