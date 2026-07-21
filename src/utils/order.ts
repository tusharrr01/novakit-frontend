import type { Order } from '@/src/lib/orders';

export function formatOrderDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return isoString;
  }
}

export function newOrderId(): string {
  return `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
}
