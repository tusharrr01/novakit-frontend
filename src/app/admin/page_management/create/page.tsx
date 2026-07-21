'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PageForm } from '@/src/components/page_management/PageForm';
import { useCreatePageMutation } from '@/src/redux/api/pageApi';

export default function AdminPageCreate() {
  const router = useRouter();
  const [createPage, { isLoading }] = useCreatePageMutation();

  async function handleSubmit(data: any) {
    try {
      await createPage(data).unwrap();
      toast.success('Page created successfully');
      router.push('/admin/page_management');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create page');
    }
  }

  return <PageForm onSubmit={handleSubmit} isLoading={isLoading} isEdit={false} />;
}
