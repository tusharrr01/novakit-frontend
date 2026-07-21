import type { Currency } from '@/src/lib/currency';

export function formatCurrencyValue(val: number, currency: Currency): string {
  const formatted = val.toFixed(currency.decimals);
  return currency.position === 'prefix' ? `${currency.symbol}${formatted}` : `${formatted} ${currency.symbol}`;
}

export function validateCurrency(draft: Currency, isEdit: boolean, list: Currency[]): string | null {
  const code = draft.code.trim().toUpperCase();
  const name = draft.name.trim();
  const symbol = draft.symbol.trim();
  if (!code || !name || !symbol) {
    return 'Code, Name and Symbol are required';
  }
  if (!isEdit && list.some((c) => c.code === code)) {
    return `Currency with code "${code}" already exists`;
  }
  if (draft.rate <= 0) {
    return 'Exchange rate must be greater than 0';
  }
  return null;
}
