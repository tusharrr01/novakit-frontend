export type PaymentProviderKey = 'stripe' | 'razorpay' | 'paypal';

export type PaymentProvider = {
  enabled: boolean;
  publishableKey: string;
  secretKey: string;
};

export type PaymentsContent = {
  active: PaymentProviderKey;
  providers: Record<PaymentProviderKey, PaymentProvider>;
};

export const PAYMENT_PROVIDER_META: {
  key: PaymentProviderKey;
  label: string;
  short: string;
  description: string;
  publishablePlaceholder: string;
  secretPlaceholder: string;
  publishableLabel: string;
  secretLabel: string;
  configTitle: string;
  configBlurb: string;
  keyHints: { label: string; codes: string[] }[];
  docsLabel: string;
  docsUrl: string;
  accent: string;
}[] = [
  {
    key: 'stripe',
    label: 'Stripe',
    short: 'S',
    description: 'Cards, wallets and global payment methods with a single integration.',
    publishablePlaceholder: 'pk_test_••••••••••••',
    secretPlaceholder: 'sk_test_••••••••••••',
    publishableLabel: 'Publishable Key',
    secretLabel: 'Secret Key',
    configTitle: 'Stripe Configuration',
    configBlurb:
      'Get your Stripe credentials from the Stripe Dashboard. You\'ll need both Test and Live credentials.',
    keyHints: [
      { label: 'Test keys start with', codes: ['pk_test_', 'sk_test_'] },
      { label: 'Live keys start with', codes: ['pk_live_', 'sk_live_'] },
    ],
    docsLabel: 'Get Stripe API Keys',
    docsUrl: 'https://dashboard.stripe.com/apikeys',
    accent: 'from-indigo-500 to-violet-600',
  },
  {
    key: 'razorpay',
    label: 'Razorpay',
    short: 'R',
    description: 'UPI, cards, netbanking and wallets for customers in India.',
    publishablePlaceholder: 'rzp_test_••••••••',
    secretPlaceholder: '••••••••••••••••',
    publishableLabel: 'Key ID',
    secretLabel: 'Key Secret',
    configTitle: 'Razorpay Configuration',
    configBlurb:
      'Generate API keys from the Razorpay Dashboard under Settings → API Keys. Use test mode until you\'re ready to go live.',
    keyHints: [
      { label: 'Test keys start with', codes: ['rzp_test_'] },
      { label: 'Live keys start with', codes: ['rzp_live_'] },
    ],
    docsLabel: 'Get Razorpay API Keys',
    docsUrl: 'https://dashboard.razorpay.com/app/keys',
    accent: 'from-sky-500 to-blue-600',
  },
  {
    key: 'paypal',
    label: 'PayPal',
    short: 'P',
    description: 'Accept PayPal balance, cards and Pay Later across 200+ markets.',
    publishablePlaceholder: 'Client ID',
    secretPlaceholder: 'Client Secret',
    publishableLabel: 'Client ID',
    secretLabel: 'Client Secret',
    configTitle: 'PayPal Configuration',
    configBlurb:
      'Create a REST app inside the PayPal Developer Dashboard to get Sandbox and Live client credentials.',
    keyHints: [
      { label: 'Environment', codes: ['sandbox', 'live'] },
    ],
    docsLabel: 'Get PayPal Credentials',
    docsUrl: 'https://developer.paypal.com/dashboard/applications',
    accent: 'from-amber-500 to-orange-600',
  },
];

export const defaultPaymentsContent: PaymentsContent = {
  active: 'stripe',
  providers: {
    stripe: { enabled: true, publishableKey: 'pk_test_1234567890abcd', secretKey: 'sk_test_1234567890abcd' },
    razorpay: { enabled: false, publishableKey: '', secretKey: '' },
    paypal: { enabled: false, publishableKey: '', secretKey: '' },
  },
};

const KEY = 'novakit.payments.v1';

import { useEffect, useState } from 'react';

function read(): PaymentsContent {
  if (typeof window === 'undefined') return defaultPaymentsContent;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultPaymentsContent;
    const parsed = JSON.parse(raw);
    return { ...defaultPaymentsContent, ...parsed, providers: { ...defaultPaymentsContent.providers, ...(parsed?.providers ?? {}) } };
  } catch {
    return defaultPaymentsContent;
  }
}

const listeners = new Set<() => void>();

export const paymentsStore = {
  get: read,
  save(content: PaymentsContent) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(KEY, JSON.stringify(content));
    listeners.forEach((l) => l());
  },
  reset() {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(KEY);
    listeners.forEach((l) => l());
  },
};

export function usePayments(): PaymentsContent {
  const [content, setContent] = useState<PaymentsContent>(defaultPaymentsContent);
  useEffect(() => {
    setContent(read());
    const cb = () => setContent(read());
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  }, []);
  return content;
}
