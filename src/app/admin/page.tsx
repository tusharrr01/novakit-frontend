'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ShieldCheck } from 'lucide-react';
import { OverviewTab } from '@/src/components/dashboard';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-neutral-500 text-sm">
        Verifying administrator session...
      </div>
    );
  }

  const role = (session?.user as any)?.role || (session?.user as any)?.role_key || 'user';
  const isAdmin = role === 'admin' || role === 'super_admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-center p-8">
        <ShieldCheck className="h-16 w-16 text-rose-500 mb-4 animate-bounce" />
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Access Denied</h1>
        <p className="mt-2 text-sm text-neutral-500 max-w-sm">
          You do not have the required administrative permissions to access this control dashboard.
        </p>
        <Link href="/" className="mt-6 text-sm font-semibold text-indigo-600 hover:underline">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  return <OverviewTab />;
}
