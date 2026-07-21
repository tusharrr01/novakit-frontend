import { useEffect, useState } from 'react';

export type EmailTemplateKey =
  | 'accountVerification'
  | 'otpVerification'
  | 'forgotPassword'
  | 'passwordResetConfirmed'
  | 'welcome'
  | 'purchaseReceipt'
  | 'licenseDelivery'
  | 'refundIssued';

export type EmailTemplate = {
  enabled: boolean;
  subject: string;
  preheader: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  footerNote: string;
};

export type EmailContent = Record<EmailTemplateKey, EmailTemplate>;

export const EMAIL_TEMPLATE_META: {
  key: EmailTemplateKey;
  label: string;
  description: string;
  trigger: string;
  variables: string[];
}[] = [
  {
    key: 'accountVerification',
    label: 'Account verification',
    description: 'Sent right after sign up to verify email ownership',
    trigger: 'On new account signup',
    variables: ['{{name}}', '{{verify_url}}', '{{expires_in}}'],
  },
  {
    key: 'otpVerification',
    label: 'OTP verification',
    description: 'One-time 6-digit code for sensitive actions',
    trigger: 'On login / step-up verification',
    variables: ['{{name}}', '{{otp_code}}', '{{expires_in}}'],
  },
  {
    key: 'forgotPassword',
    label: 'Forgot password',
    description: 'Secure link to reset a forgotten password',
    trigger: 'On password reset request',
    variables: ['{{name}}', '{{reset_url}}', '{{expires_in}}'],
  },
  {
    key: 'passwordResetConfirmed',
    label: 'Password reset confirmed',
    description: 'Confirms the account password was successfully changed',
    trigger: 'After password successfully changed',
    variables: ['{{name}}', '{{changed_at}}', '{{support_url}}'],
  },
  {
    key: 'welcome',
    label: 'Welcome email',
    description: 'Warm welcome after email verification',
    trigger: 'After email verified',
    variables: ['{{name}}', '{{dashboard_url}}'],
  },
  {
    key: 'purchaseReceipt',
    label: 'Purchase receipt',
    description: 'Order confirmation & invoice details',
    trigger: 'On successful purchase',
    variables: ['{{name}}', '{{product_name}}', '{{amount}}', '{{invoice_url}}'],
  },
  {
    key: 'licenseDelivery',
    label: 'License delivery',
    description: 'Delivers license key & download link',
    trigger: 'After purchase completed',
    variables: ['{{name}}', '{{product_name}}', '{{license_key}}', '{{download_url}}'],
  },
  {
    key: 'refundIssued',
    label: 'Refund issued',
    description: 'Notifies the customer their refund is processed',
    trigger: 'On refund approved',
    variables: ['{{name}}', '{{product_name}}', '{{amount}}', '{{invoice_url}}'],
  },
];

export const defaultEmailContent: EmailContent = {
  accountVerification: {
    enabled: true,
    subject: 'Verify your NovaKit email',
    preheader: 'Confirm your email to activate your account',
    heading: 'Verify your email',
    body: 'Hi {{name}}, welcome to NovaKit! Please confirm your email address to activate your account. This link expires in {{expires_in}}.',
    ctaLabel: 'Verify email',
    ctaUrl: '{{verify_url}}',
    footerNote: 'If you didn\'t create an account, you can safely ignore this email.',
  },
  otpVerification: {
    enabled: true,
    subject: 'Your NovaKit verification code',
    preheader: 'Use this code to continue signing in',
    heading: 'Your one-time code',
    body: 'Hi {{name}}, use the code below to complete verification. It expires in {{expires_in}}.\n\n{{otp_code}}',
    ctaLabel: '',
    ctaUrl: '',
    footerNote: 'Never share this code with anyone. NovaKit staff will never ask for it.',
  },
  forgotPassword: {
    enabled: true,
    subject: 'Reset your NovaKit password',
    preheader: 'A secure link to set a new password',
    heading: 'Reset your password',
    body: 'Hi {{name}}, we received a request to reset your password. Click the button below to choose a new one. This link expires in {{expires_in}}.',
    ctaLabel: 'Reset password',
    ctaUrl: '{{reset_url}}',
    footerNote: 'If you didn\'t request this, no changes have been made.',
  },
  passwordResetConfirmed: {
    enabled: true,
    subject: 'Your NovaKit password was changed',
    preheader: 'Confirmation of your recent password update',
    heading: 'Password changed',
    body: 'Hi {{name}}, your password was successfully changed on {{changed_at}}. If this wasn\'t you, contact support immediately.',
    ctaLabel: 'Contact support',
    ctaUrl: '{{support_url}}',
    footerNote: 'This is an automated security notification.',
  },
  welcome: {
    enabled: true,
    subject: 'Welcome to NovaKit 🎉',
    preheader: 'Everything you need to get started',
    heading: 'Welcome aboard, {{name}}!',
    body: 'Thanks for joining NovaKit. Explore premium templates, download source files, and ship faster than ever.',
    ctaLabel: 'Open dashboard',
    ctaUrl: '{{dashboard_url}}',
    footerNote: 'Need help getting started? Just reply to this email.',
  },
  purchaseReceipt: {
    enabled: true,
    subject: 'Your NovaKit receipt for {{product_name}}',
    preheader: 'Thanks for your purchase',
    heading: 'Thanks for your purchase!',
    body: 'Hi {{name}}, we\'ve received your payment of {{amount}} for {{product_name}}. Your invoice is attached and also available online.',
    ctaLabel: 'View invoice',
    ctaUrl: '{{invoice_url}}',
    footerNote: 'All prices in USD. Taxes may apply based on your region.',
  },
  licenseDelivery: {
    enabled: true,
    subject: 'Your {{product_name}} license & downloads',
    preheader: 'Your license key and download link inside',
    heading: 'You\'re all set, {{name}}',
    body: 'Here\'s your license key for {{product_name}}:\n\n{{license_key}}\n\nUse the button below to download the source files.',
    ctaLabel: 'Download files',
    ctaUrl: '{{download_url}}',
    footerNote: 'Keep this email safe — it contains your license key.',
  },
  refundIssued: {
    enabled: true,
    subject: 'Your refund for {{product_name}} has been issued',
    preheader: 'Refund confirmation',
    heading: 'Refund on the way',
    body: 'Hi {{name}}, we\'ve issued a refund of {{amount}} for {{product_name}}. It may take 5–10 business days to appear on your statement.',
    ctaLabel: 'View invoice',
    ctaUrl: '{{invoice_url}}',
    footerNote: 'Sorry it didn\'t work out — we\'d love your feedback.',
  },
};

const STORAGE_KEY = 'novakit:email-templates';
const EVENT = 'novakit:email-templates-changed';
const listeners = new Set<() => void>();

function read(): EmailContent {
  if (typeof window === 'undefined') return defaultEmailContent;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultEmailContent;
    const parsed = JSON.parse(raw) as Partial<EmailContent>;
    const merged = { ...defaultEmailContent };
    (Object.keys(defaultEmailContent) as EmailTemplateKey[]).forEach((k) => {
      merged[k] = { ...defaultEmailContent[k], ...(parsed[k] || {}) };
    });
    return merged;
  } catch {
    return defaultEmailContent;
  }
}

function notify() {
  listeners.forEach((l) => l());
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(EVENT));
}

export const emailTemplatesStore = {
  get: read,
  save(next: EmailContent) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    notify();
  },
  update(key: EmailTemplateKey, patch: Partial<EmailTemplate>) {
    const current = read();
    const next = { ...current, [key]: { ...current[key], ...patch } };
    this.save(next);
  },
  reset() {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(STORAGE_KEY);
    notify();
  },
};

export function useEmailTemplates(): EmailContent {
  const [state, setState] = useState<EmailContent>(defaultEmailContent);
  useEffect(() => {
    setState(read());
    const on = () => setState(read());
    listeners.add(on);
    window.addEventListener(EVENT, on);
    window.addEventListener('storage', on);
    return () => {
      listeners.delete(on);
      window.removeEventListener(EVENT, on);
      window.removeEventListener('storage', on);
    };
  }, []);
  return state;
}
