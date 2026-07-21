'use client';

import { ServiceList } from '@/src/components/service/ServiceList';
import { useGetServicesQuery } from '@/src/redux/api/serviceApi';
import { SiteHeader } from '@/src/layout/SiteHeader';
import { SiteFooter } from '@/src/layout/SiteFooter';

export default function ServicesPage() {
  const { data, isLoading } = useGetServicesQuery(undefined);

  const items = data?.data || [];
  const categories = Array.from(new Set(items.map((i: any) => i.category)));

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 flex flex-col">
      <SiteHeader />
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center p-20 text-neutral-500 text-sm">
          Loading services catalog...
        </div>
      ) : (
        <ServiceList
          items={items}
          eyebrow="Custom Engineering Services"
          title="Hire professional developer squads."
          subtitle="Hire experts to build custom SaaS portals, configure Stripe subscriptions, and automate marketing."
          categories={categories as string[]}
          searchPlaceholder="Search services..."
          detailPrefix="/services"
          priceSuffix="Project Flat"
        />
      )}
      <SiteFooter />
    </div>
  );
}

