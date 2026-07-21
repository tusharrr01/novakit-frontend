export function formatOverviewStat(val: number, format: 'currency' | 'number' | 'percent'): string {
  if (format === 'currency') {
    return `$${val.toLocaleString()}`;
  }
  if (format === 'percent') {
    return `${val.toFixed(1)}%`;
  }
  return val.toLocaleString();
}
