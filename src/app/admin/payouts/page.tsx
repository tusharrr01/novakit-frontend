'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AdminPayoutsPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center p-6 border border-border bg-card/40 rounded-xl">
      <Sparkles className="h-12 w-12 text-brand animate-pulse mb-3" />
      <h2 className="font-display text-xl font-semibold tracking-tight">Payouts Module</h2>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        This administration tab is currently under active development. More features are coming soon.
      </p>
    </div>
  );
}
