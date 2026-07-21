export function formatPlanPrice(price: number, interval: 'month' | 'year' = 'month'): string {
  return `$${price}/${interval === 'month' ? 'mo' : 'yr'}`;
}

export function newPlanId(): string {
  return `plan_${Date.now()}`;
}
