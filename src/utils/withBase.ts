const EXTERNAL_URL_PATTERN = /^(?:[a-z]+:)?\/\//i;

export function withBase(path: string): string {
  if (!path) return path;

  if (
    path.startsWith('#') ||
    path.startsWith('mailto:') ||
    path.startsWith('tel:') ||
    path.startsWith('data:') ||
    path.startsWith('javascript:') ||
    EXTERNAL_URL_PATTERN.test(path)
  ) {
    return path;
  }

  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = path === '/' ? '' : path.replace(/^\/+/, '');

  return `${normalizedBase}${normalizedPath}`;
}
