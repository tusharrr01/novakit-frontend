import { useState, useEffect } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // exchange rate compared to USD
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.5 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.78 },
];

export function useCurrency() {
  const [activeCode, setActiveCode] = useState<string>('USD');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('currency_code');
      if (stored && CURRENCIES.some((c) => c.code === stored)) {
        setActiveCode(stored);
      }
    }
  }, []);

  const active = CURRENCIES.find((c) => c.code === activeCode) || CURRENCIES[0];

  const setActive = (code: string) => {
    if (CURRENCIES.some((c) => c.code === code)) {
      setActiveCode(code);
      try {
        localStorage.setItem('currency_code', code);
        // Dispatch custom event to sync switchers across components
        window.dispatchEvent(new Event('currency_change'));
      } catch {}
    }
  };

  useEffect(() => {
    function handleSync() {
      const stored = localStorage.getItem('currency_code');
      if (stored) setActiveCode(stored);
    }
    window.addEventListener('currency_change', handleSync);
    return () => window.removeEventListener('currency_change', handleSync);
  }, []);

  const formatPrice = (priceUSD: number) => {
    const converted = priceUSD * active.rate;
    // Format appropriately
    if (active.code === 'INR') {
      return `${active.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
    }
    return `${active.symbol}${converted.toFixed(2)}`;
  };

  return {
    active,
    currencies: CURRENCIES,
    setActive,
    formatPrice,
  };
}
export default useCurrency;
