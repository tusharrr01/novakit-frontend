import type { PaymentsContent } from '@/src/lib/payments-content';

export function isPaymentConfigDirty(draft: PaymentsContent, remote: PaymentsContent): boolean {
  return JSON.stringify(draft) !== JSON.stringify(remote);
}

export function validateGatewayKeys(provider: string, config: any): string | null {
  if (provider === 'stripe') {
    if (!config.publicKey?.trim() || !config.secretKey?.trim()) {
      return 'Stripe Publishable Key and Secret Key are required';
    }
  } else if (provider === 'paypal') {
    if (!config.clientId?.trim() || !config.clientSecret?.trim()) {
      return 'PayPal Client ID and Client Secret are required';
    }
  } else if (provider === 'razorpay') {
    if (!config.keyId?.trim() || !config.keySecret?.trim()) {
      return 'Razorpay Key ID and Key Secret are required';
    }
  }
  return null;
}
