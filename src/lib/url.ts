const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** True for links that must not get the site base path prepended. */
export const isExternal = (href: string) => /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(href);

/** Prefix an internal path with the deploy base (`/portfolio`). */
export const url = (path = '/') =>
  isExternal(path) ? path : `${BASE}${path.startsWith('/') ? path : `/${path}`}`;

/** Path without the base and trailing slash, for "current page" checks. */
export const routeOf = (pathname: string) => pathname.slice(BASE.length).replace(/\/$/, '') || '/';
