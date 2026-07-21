export function formatServicePrice(price: number, unit?: string): string {
  const base = `$${price.toLocaleString()}`;
  return unit ? `${base} / ${unit}` : base;
}

export function isDeliveryUrgent(deliveryTimeDays: number): boolean {
  return deliveryTimeDays <= 3;
}
