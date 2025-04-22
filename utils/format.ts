/**
 * Format a number with thousands separators
 * @param value The number to format
 * @returns Formatted string with thousands separators
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}
