/**
 * SEO helpers.
 *
 * The official site lives at https://ukanm.ru (served from the domain root).
 * Test builds (GitHub Pages, base /anm-website) are marked noindex and point
 * their canonical URLs at the production address, so search engines only ever
 * index ukanm.ru.
 *
 *   DEPLOY_TARGET=production pnpm build   → site https://ukanm.ru, base "/", indexable
 *   pnpm build                            → GitHub Pages test copy, noindex
 */
export const PRODUCTION_ORIGIN = 'https://ukanm.ru';

/** True only for the real ukanm.ru build. */
export const IS_PRODUCTION = import.meta.env.PUBLIC_DEPLOY_TARGET === 'production';

/** Strip the build's base path (e.g. /anm-website) from a pathname. */
export function stripBase(pathname: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const path = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  return path.startsWith('/') ? path : `/${path}`;
}

/** Absolute production URL for a site path like "/buildings/fidel/" (no base). */
export function absoluteUrl(path = '/'): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${PRODUCTION_ORIGIN}${p}`;
}
