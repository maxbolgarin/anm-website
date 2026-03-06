/**
 * Format a number with space as thousands separator (Russian convention).
 * Example: 132000 → "132 000"
 */
export function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Format price with currency symbol.
 * Example: 132000 → "132 000 ₽"
 */
export function formatPrice(n: number): string {
  return `${formatNumber(n)} ₽`;
}

/**
 * Format area with unit.
 * Example: 120 → "120 м²"
 */
export function formatArea(n: number): string {
  return `${formatNumber(n)} м²`;
}
