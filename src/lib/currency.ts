import { useSyncExternalStore } from 'react';

/**
 * Currency library.
 *
 * Prices in the app are authored in the base currency (USD by default).
 * Each registered currency stores a rate multiplier vs. that base, plus a
 * symbol and formatting position. `useCurrency().format(usd)` converts and
 * formats a numeric USD price into the currently selected currency.
 */

export type Currency = {
  code: string;      // ISO code, e.g. "USD", "EUR", "INR"
  name: string;      // Display name, e.g. "US Dollar"
  symbol: string;    // "$", "€", "₹"
  rate: number;      // 1 USD = <rate> <currency>
  position: 'prefix' | 'suffix';
  decimals: number;  // decimal places to show
};

export type CurrencyStoreState = {
  active: string;        // code
  base: string;          // code of the base currency (rate = 1)
  currencies: Currency[];
};

const STORAGE_KEY = 'novakit:currency';
const EVENT = 'novakit:currency-changed';

const DEFAULT_STATE: CurrencyStoreState = {
  active: 'USD',
  base: 'USD',
  currencies: [
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1, position: 'prefix', decimals: 2 },
  ],
};

let cached: CurrencyStoreState = DEFAULT_STATE;
let hydrated = false;

function computeFromStorage(): CurrencyStoreState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as CurrencyStoreState;
    if (!parsed.currencies?.length) return DEFAULT_STATE;
    return {
      active: parsed.active || 'USD',
      base: parsed.base || 'USD',
      currencies: parsed.currencies,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function read(): CurrencyStoreState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  if (!hydrated) {
    cached = computeFromStorage();
    hydrated = true;
  }
  return cached;
}

function write(next: CurrencyStoreState) {
  if (typeof window === 'undefined') return;
  cached = next;
  hydrated = true;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
}

if (typeof window !== 'undefined') {
  const refresh = () => {
    cached = computeFromStorage();
  };
  window.addEventListener(EVENT, refresh);
  window.addEventListener('storage', refresh);
}

export const currencyStore = {
  get: read,
  setActive(code: string) {
    const s = read();
    if (!s.currencies.some((c) => c.code === code)) return;
    write({ ...s, active: code });
  },
  upsert(c: Currency) {
    const s = read();
    const exists = s.currencies.some((x) => x.code === c.code);
    const currencies = exists
      ? s.currencies.map((x) => (x.code === c.code ? c : x))
      : [...s.currencies, c];
    write({ ...s, currencies });
  },
  remove(code: string) {
    const s = read();
    if (code === s.base) return; // never remove the base
    write({
      ...s,
      active: s.active === code ? s.base : s.active,
      currencies: s.currencies.filter((c) => c.code !== code),
    });
  },
  reset() {
    write(DEFAULT_STATE);
  },
};

function subscribe(cb: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}

function formatWith(c: Currency | undefined, baseAmount: number): string {
  if (!c) return `$${baseAmount}`;
  const converted = baseAmount * (c.rate || 1);
  const rounded = converted.toFixed(c.decimals);
  const parts = rounded.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const num = parts.join('.');
  return c.position === 'suffix' ? `${num} ${c.symbol}` : `${c.symbol}${num}`;
}

export function useCurrency() {
  const state = useSyncExternalStore(subscribe, read, () => DEFAULT_STATE);
  const active = state.currencies.find((c) => c.code === state.active) || state.currencies[0];
  return {
    active,
    currencies: state.currencies,
    base: state.base,
    /** Format a numeric price expressed in the base currency (USD). */
    format: (baseAmount: number) => formatWith(active, baseAmount),
    formatPrice: (baseAmount: number) => formatWith(active, baseAmount),
    setActive: currencyStore.setActive,
  };
}

export function useCurrencyState(): CurrencyStoreState {
  return useSyncExternalStore(subscribe, read, () => DEFAULT_STATE);
}
