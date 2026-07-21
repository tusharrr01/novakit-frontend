import { PRODUCTS, type Product } from './products';

export type OrderStatus = 'Paid' | 'Pending' | 'Refunded' | 'Cancelled';
export type PaymentMethod = 'Visa •• 4242' | 'Mastercard •• 8891' | 'PayPal' | 'Apple Pay' | 'Stripe';

export type OrderItem = {
  productSlug: string;
  license: 'Personal' | 'Studio' | 'Team & Extended';
  quantity: number;
  unitPrice: number;
};

export type OrderEvent = {
  at: string; // ISO
  label: string;
  detail?: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  country: string;
};

export type Order = {
  id: string; // "#NK-4021"
  number: string; // raw number
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  placedAt: string; // ISO
  invoiceId: string;
  billingAddress: string;
  notes?: string;
  timeline: OrderEvent[];
};

const CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Ava Bennett', email: 'ava.bennett@studio.co', country: 'United States' },
  { id: 'c2', name: 'Leo Martins', email: 'leo@martins.dev', country: 'Portugal' },
  { id: 'c3', name: 'Mira Chen', email: 'mira.chen@prism.io', country: 'Singapore' },
  { id: 'c4', name: 'Jonah Reed', email: 'jonah@reedlabs.com', country: 'United Kingdom' },
  { id: 'c5', name: 'Sana Iqbal', email: 'sana.iqbal@cobalt.co', country: 'United Arab Emirates' },
  { id: 'c6', name: 'Noa Weiss', email: 'noa@weiss.design', country: 'Germany' },
  { id: 'c7', name: 'Kai Tanaka', email: 'kai.tanaka@atlas.jp', country: 'Japan' },
  { id: 'c8', name: 'Priya Rao', email: 'priya@raoworks.in', country: 'India' },
  { id: 'c9', name: 'Diego Alvarez', email: 'diego@alvarez.mx', country: 'Mexico' },
  { id: 'c10', name: 'Ella Nord', email: 'ella.nord@northpine.se', country: 'Sweden' },
];

function makeItem(slug: string, license: OrderItem['license'], qty = 1): OrderItem {
  const p = PRODUCTS.find((x) => x.slug === slug)!;
  const l = p.licenses.find((x) => x.name === license) ?? p.licenses[0];
  return { productSlug: slug, license: license, quantity: qty, unitPrice: l.price };
}

function totals(items: OrderItem[]) {
  const subtotal = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  return { subtotal, tax, total };
}

function timelineFor(status: OrderStatus, placedAt: string): OrderEvent[] {
  const base: OrderEvent[] = [
    { at: placedAt, label: 'Order placed', detail: 'Customer completed checkout.' },
  ];
  const plus = (mins: number) => new Date(new Date(placedAt).getTime() + mins * 60_000).toISOString();
  if (status === 'Paid') {
    base.push({ at: plus(2), label: 'Payment captured', detail: 'Charge succeeded.' });
    base.push({ at: plus(5), label: 'License issued', detail: 'Download link emailed.' });
  } else if (status === 'Pending') {
    base.push({ at: plus(1), label: 'Awaiting payment', detail: 'Waiting for gateway confirmation.' });
  } else if (status === 'Refunded') {
    base.push({ at: plus(3), label: 'Payment captured' });
    base.push({ at: plus(60 * 24 * 3), label: 'Refund issued', detail: 'Full refund processed.' });
  } else {
    base.push({ at: plus(4), label: 'Order cancelled', detail: 'Cancelled before capture.' });
  }
  return base;
}

function makeOrder(
  n: number,
  cIdx: number,
  items: OrderItem[],
  status: OrderStatus,
  method: PaymentMethod,
  placedAt: string,
  notes?: string,
): Order {
  const customer = CUSTOMERS[cIdx];
  const t = totals(items);
  return {
    id: `#NK-${4000 + n}`,
    number: String(4000 + n),
    customer,
    items,
    ...t,
    status,
    paymentMethod: method,
    placedAt,
    invoiceId: `INV-2026-${String(140 + n).padStart(5, '0')}`,
    billingAddress: `${customer.name}\n${customer.country}`,
    notes,
    timeline: timelineFor(status, placedAt),
  };
}

export const ORDERS: Order[] = [
  makeOrder(21, 0, [makeItem('aurora-admin', 'Studio')], 'Paid', 'Visa •• 4242', '2026-07-13T09:22:00Z'),
  makeOrder(20, 1, [makeItem('nimbus-ai-chat', 'Personal')], 'Paid', 'PayPal', '2026-07-13T07:48:00Z'),
  makeOrder(19, 2, [makeItem('prism-saas', 'Team & Extended')], 'Refunded', 'Stripe', '2026-07-12T18:11:00Z', 'Customer requested refund within trial window.'),
  makeOrder(18, 3, [makeItem('zenith-landing', 'Personal'), makeItem('aurora-admin', 'Personal')], 'Pending', 'Mastercard •• 8891', '2026-07-12T14:02:00Z'),
  makeOrder(17, 4, [makeItem('cobalt-commerce', 'Studio')], 'Paid', 'Visa •• 4242', '2026-07-11T21:33:00Z'),
  makeOrder(16, 5, [makeItem('aurora-admin', 'Personal')], 'Paid', 'Apple Pay', '2026-07-11T10:12:00Z'),
  makeOrder(15, 6, [makeItem('prism-saas', 'Studio')], 'Cancelled', 'Stripe', '2026-07-10T15:44:00Z'),
  makeOrder(14, 7, [makeItem('nimbus-ai-chat', 'Studio'), makeItem('zenith-landing', 'Personal')], 'Paid', 'Mastercard •• 8891', '2026-07-10T08:20:00Z'),
  makeOrder(13, 8, [makeItem('cobalt-commerce', 'Personal')], 'Paid', 'PayPal', '2026-07-09T19:05:00Z'),
  makeOrder(12, 9, [makeItem('aurora-admin', 'Team & Extended')], 'Paid', 'Visa •• 4242', '2026-07-08T12:41:00Z'),
];

export function findOrder(id: string): Order | undefined {
  const key = id.startsWith('#') ? id : `#${id}`;
  return ORDERS.find((o) => o.id === key || o.number === id.replace(/^#?NK-?/i, ''));
}

export function productFor(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export const ORDER_STATUSES: OrderStatus[] = ['Paid', 'Pending', 'Refunded', 'Cancelled'];

export function formatOrderDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
