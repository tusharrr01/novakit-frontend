import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2 ${className}`}>
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white glow-brand">
        <Sparkles className="h-4 w-4" strokeWidth={2.5} />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">
        Nova<span className="text-brand-gradient">Kit</span>
      </span>
    </Link>
  );
}
