export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`
}

export function pluralize(
  count: number,
  singular: string,
  plural?: string,
): string {
  return count === 1 ? singular : plural || `${singular}s`
}
