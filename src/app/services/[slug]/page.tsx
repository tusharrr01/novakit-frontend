'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetServiceBySlugQuery, useGetServicesQuery } from '@/src/redux/api/catalogApi';
import { CatalogDetail, CatalogNotFound } from '@/src/components/reusable/CatalogDetail';
import { SiteHeader } from '@/src/layout/site-header';
import { SiteFooter } from '@/src/layout/site-footer';

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
        <CatalogDetail
          item={item}
          related={related}
          listTo="/services"
          detailPrefix="/services"
          crumbLabel="Services"
          ctaLabel="Book Service"
          relatedEyebrow="Related Services"
        />
      ) : (
        <CatalogNotFound listTo="/services" crumbLabel="Services" />
      )}
      <SiteFooter />
    </div>
  );
}
export { ServiceDetailPage };
