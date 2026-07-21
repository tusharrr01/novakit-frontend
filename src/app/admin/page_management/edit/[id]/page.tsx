'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, AlertCircle } from 'lucide-react';
import { PageForm } from '@/src/components/page_management/PageForm';
import { useAdminGetPageByIdQuery, useUpdatePageMutation } from '@/src/redux/api/pageApi';

export default function AdminPageEdit() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data, isLoading: isFetching } = useAdminGetPageByIdQuery(id);
  const [updatePage, { isLoading: isSaving }] = useUpdatePageMutation();

  async function handleSubmit(formData: any) {
    try {
      await updatePage({ id, ...formData }).unwrap();
      toast.success('Page updated successfully');
      router.push('/admin/page_management');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update page');
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
        <AlertCircle className="h-8 w-8" />
        <p className="text-sm">Page not found.</p>
      </div>
    );
  }

  return (
    <PageForm
      initialData={data.data}
      onSubmit={handleSubmit}
      isLoading={isSaving}
      isEdit={true}
    />
  );
}
