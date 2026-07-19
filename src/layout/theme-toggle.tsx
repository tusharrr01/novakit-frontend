'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`h-9 w-9 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 ${className}`} />
    );
  }

  const activeTheme = theme === 'system' ? resolvedTheme : theme;

  const toggle = () => {
    setTheme(activeTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-neutral-800 dark:text-neutral-200 transition hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:bg-neutral-100 dark:hover:bg-neutral-850 ${className}`}
    >
      {activeTheme === 'dark' ? (
        <Sun className="h-4 w-4 text-amber-500 transition-all" />
      ) : (
        <Moon className="h-4 w-4 text-indigo-600 transition-all" />
      )}
    </button>
  );
}
export default ThemeToggle;
