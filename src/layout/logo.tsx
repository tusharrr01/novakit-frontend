import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2 ${className}`}>
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
        <Sparkles className="h-4 w-4" strokeWidth={2.5} />
      </span>
      <span className="font-sans text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
        Nova<span className="text-indigo-600">Kit</span>
      </span>
    </Link>
  );
}
export default Logo;
