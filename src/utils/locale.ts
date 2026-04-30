export type Locale = 'ru' | 'en';

/**
 * Detect locale from URL pathname.
 * Paths starting with /en/ (or /base/en/) are English; everything else is Russian.
 */
export function getLocaleFromPath(pathname: string): Locale {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const path = base && pathname.startsWith(base)
    ? pathname.slice(base.length)
    : pathname;
  return path.startsWith('/en/') || path === '/en' ? 'en' : 'ru';
}

/**
 * Get the equivalent path in another locale.
 * If currently on /en/about/, returns /about/ (for ru).
 * If currently on /about/, returns /en/about/ (for en).
 */
export function getLocalePath(pathname: string, targetLocale: Locale): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const path = base && pathname.startsWith(base)
    ? pathname.slice(base.length)
    : pathname;

  const strippedPath = path.startsWith('/en/') ? path.slice(3) : path === '/en' ? '/' : path;

  if (targetLocale === 'en') {
    return '/en' + (strippedPath === '/' ? '/' : strippedPath);
  }
  return strippedPath || '/';
}
