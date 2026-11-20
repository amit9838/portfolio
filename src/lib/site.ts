/** The site's pages: one source for the header nav and the "Keep exploring" links. */

export const pages = {
  home: { label: 'Home', href: '/' },
  resume: { label: 'Resume', href: '/resume' },
  projects: { label: 'Projects', href: '/projects' },
  contact: { label: 'Contact', href: '/contact' },
} as const;

export type PageKey = keyof typeof pages;
export type Page = (typeof pages)[PageKey];

/** Header navigation, in order. */
export const nav: Page[] = [pages.resume, pages.projects, pages.contact];

/** Pages suggested at the bottom of each route. Routes not listed (e.g. 404) use the fallback. */
const suggestions: Record<string, PageKey[]> = {
  '/': ['resume', 'projects'],
  '/resume': ['projects', 'contact'],
  '/projects': ['resume', 'contact'],
  '/contact': ['home', 'resume'],
};
const fallback: PageKey[] = ['home', 'projects'];

export const suggestionsFor = (route: string): Page[] =>
  (suggestions[route] ?? fallback).map((key) => pages[key]);
