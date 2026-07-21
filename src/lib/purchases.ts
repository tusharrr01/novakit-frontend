import { PRODUCTS } from './products';

export type Purchase = {
  id: string;
  productSlug: string;
  license: 'Personal' | 'Studio' | 'Team & Extended';
  price: number;
  purchasedAt: string; // ISO
  expiresAt: string; // ISO - updates window end
  status: 'Active' | 'Expiring' | 'Expired';
  invoiceId: string;
  downloads: number;
};

export const MOCK_PURCHASES: Purchase[] = [
  {
    id: 'p_001',
    productSlug: 'aurora-admin',
    license: 'Studio',
    price: 118,
    purchasedAt: '2026-01-14T09:22:00Z',
    expiresAt: '2027-01-14T09:22:00Z',
    status: 'Active',
    invoiceId: 'INV-2026-00142',
    downloads: 7,
  },
  {
    id: 'p_002',
    productSlug: 'zenith-landing',
    license: 'Personal',
    price: 29,
    purchasedAt: '2026-03-02T15:40:00Z',
    expiresAt: '2026-09-02T15:40:00Z',
    status: 'Expiring',
    invoiceId: 'INV-2026-00318',
    downloads: 3,
  },
  {
    id: 'p_003',
    productSlug: 'prism-saas',
    license: 'Team & Extended',
    price: 416,
    purchasedAt: '2026-05-19T11:08:00Z',
    expiresAt: '2028-05-19T11:08:00Z',
    status: 'Active',
    invoiceId: 'INV-2026-00521',
    downloads: 12,
  },
];

export function getPurchasesWithProduct() {
  return MOCK_PURCHASES.map((p) => {
    const product = PRODUCTS.find((pr) => pr.slug === p.productSlug);
    return { ...p, product };
  }).filter((p) => p.product);
}

export function daysUntil(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
