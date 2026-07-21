'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetServiceBySlugQuery, useGetServicesQuery } from '@/src/redux/api/serviceApi';
import { ServiceDetail, ServiceNotFound } from '@/src/components/service/ServiceDetail';
import { SiteHeader } from '@/src/components/layout/SiteHeader';
import { SiteFooter } from '@/src/components/layout/SiteFooter';

export default function ServiceDetailPage() {
  const { slug } = useParams();

  const { data: itemData, isLoading: isItemLoading } = useGetServiceBySlugQuery(slug as string);
  const { data: allData } = useGetServicesQuery(undefined);

  const item = itemData?.data;
  const services = allData?.data || [];

  const related = services
    .filter((s: any) => s.slug !== slug && s.category === item?.category)
    .slice(0, 3);

  if (isItemLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
        <SiteHeader />
        <div className="flex flex-1 items-center justify-center text-sm text-neutral-500">Loading asset...</div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col text-neutral-900 dark:text-neutral-50">
      <SiteHeader />
      {item ? (
        <ServiceDetail
          item={item}
          related={related}
          listTo="/services"
          detailPrefix="/services"
          crumbLabel="Services"
          ctaLabel="Book Service"
          relatedEyebrow="Related Services"
        />
      ) : (
        <ServiceNotFound listTo="/services" crumbLabel="Services" />
      )}
      <SiteFooter />
    </div>
  );
}
export { ServiceDetailPage };
