'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useGetDesignsQuery } from '@/src/redux/api/catalogApi';
import {
  useCreateAdminDesignMutation,
  useUpdateAdminDesignMutation,
  useDeleteAdminDesignMutation,
} from '@/src/redux/api/catalogAdminApi';
import { Plus, Pencil, Trash2, X, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { useCurrency } from '@/src/lib/currency';

export default function AdminDesignsPage() {
  const { data, refetch, isLoading } = useGetDesignsQuery(undefined);
  const [createDesign] = useCreateAdminDesignMutation();
  const [updateDesign] = useUpdateAdminDesignMutation();
  const [deleteDesign] = useDeleteAdminDesignMutation();
  const { formatPrice } = useCurrency();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const items = data?.data || [];

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this design system?')) {
      try {
        await deleteDesign(id).unwrap();
        toast.success('Design system deleted successfully');
        refetch();
      } catch (err) {
        toast.error('Failed to delete design system');
      }
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsDrawerOpen(true);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editingItem?.name || '',
      slug: editingItem?.slug || '',
      tagline: editingItem?.tagline || '',
      description: editingItem?.description || '',
      longDescription: editingItem?.longDescription || '',
      price: editingItem?.price || 0,
      category: editingItem?.category || 'Fintech',
      icon: editingItem?.icon || 'Palette',
      rating: editingItem?.rating || 5,
      reviews: editingItem?.reviews || 0,
      author: editingItem?.author || 'NovaKit Team',
      figma_link: editingItem?.figma_link || 'https://figma.com/file/mock',
      screen_count: editingItem?.screen_count || 12,
      highlightsStr: editingItem?.highlights?.join(', ') || '12 full dashboard layouts, OKLCH themed variables, Auto-layout tokens v5',
      bundlesStr: editingItem?.bundles ? JSON.stringify(editingItem.bundles, null, 2) : `{\n  "App.js": "export default function App() {\\n  return <div style={{padding: 24, background: '#09090b', color: '#fff', minHeight: '100vh'}}>Design system mock</div>;\\n}"\n}`,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      slug: Yup.string().required('Slug is required'),
      price: Yup.number().min(0, 'Price must be positive').required('Price is required'),
      category: Yup.string().required('Category is required'),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          highlights: values.highlightsStr.split(',').map((s: string) => s.trim()).filter(Boolean),
          bundles: JSON.parse(values.bundlesStr),
        };

        if (editingItem) {
          await updateDesign({ id: editingItem._id, ...payload }).unwrap();
          toast.success('Design updated successfully');
        } else {
          await createDesign(payload).unwrap();
          toast.success('Design created successfully');
        }
        setIsDrawerOpen(false);
        refetch();
      } catch (err) {
        console.error(err);
        toast.error('Failed to submit design form. Check JSON payload syntax.');
      }
    },
  });

  return (
    <div className="space-y-6 relative min-h-screen pb-16">
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-850 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Manage Designs</h1>
          <p className="mt-1.5 text-sm text-neutral-500">Configure Figma UI Kits and design assets lists.</p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-full text-xs font-semibold shadow-lg shadow-indigo-650/15"
        >
          <Plus className="h-4 w-4" /> Add Design System
        </button>
      </div>

      {isLoading ? (
        <div className="p-10 text-center text-xs text-neutral-500">Fetching designs collections...</div>
      ) : items.length === 0 ? (
        <div className="p-10 text-center text-xs text-neutral-500">No designs seeded yet. Add one to begin.</div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item: any) => (
            <div
              key={item._id}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-900/60 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 px-2.5 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">{formatPrice(item.price)}</span>
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-tight">{item.name}</h3>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{item.description}</p>
                <div className="mt-4 flex gap-4 text-[10px] text-neutral-450 font-bold tracking-wider">
                  <span>SCREENS: {item.screen_count}</span>
                  <span className="truncate max-w-[150px]">LINK: {item.figma_link}</span>
                </div>
              </div>

              <div className="mt-5 flex gap-2 border-t border-neutral-100 dark:border-neutral-850 pt-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-semibold hover:border-indigo-500 hover:text-indigo-650 transition text-neutral-700 dark:text-neutral-300"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="inline-flex h-9 w-9 items-center justify-center bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 hover:bg-rose-100 rounded-lg transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-white dark:bg-neutral-950 h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl animate-sheet-up">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900 pb-4 mb-6">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    {editingItem ? 'Edit design system details' : 'Create new design system'}
                  </h3>
                  <span className="text-[10px] text-neutral-400">FIGMA DESIGN SYSTEM ASSET</span>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center hover:bg-neutral-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={formik.handleSubmit} className="space-y-4 text-xs">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Design Name</label>
                    <input
                      type="text"
                      {...formik.getFieldProps('name')}
                      className="h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 outline-none focus:border-indigo-500"
                    />
                    {formik.touched.name && formik.errors.name && (
                      <span className="text-[10px] text-rose-500">{String(formik.errors.name)}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Unique slug identifier</label>
                    <input
                      type="text"
                      {...formik.getFieldProps('slug')}
                      className="h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Price USD</label>
                    <input
                      type="number"
                      {...formik.getFieldProps('price')}
                      className="h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Category tag</label>
                    <input
                      type="text"
                      {...formik.getFieldProps('category')}
                      className="h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Figma URL Link</label>
                    <input
                      type="text"
                      {...formik.getFieldProps('figma_link')}
                      className="h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Screen Count</label>
                    <input
                      type="number"
                      {...formik.getFieldProps('screen_count')}
                      className="h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Short tagline</label>
                  <input
                    type="text"
                    {...formik.getFieldProps('tagline')}
                    className="h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Description</label>
                  <textarea
                    rows={2}
                    {...formik.getFieldProps('description')}
                    className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Highlights (comma separated)</label>
                  <input
                    type="text"
                    {...formik.getFieldProps('highlightsStr')}
                    className="h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Codesandbox Bundles JSON</label>
                  <textarea
                    rows={4}
                    {...formik.getFieldProps('bundlesStr')}
                    className="p-3 font-mono rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-950 text-indigo-400 outline-none focus:border-indigo-500"
                  />
                </div>
              </form>
            </div>

            <div className="flex items-center gap-3 border-t border-neutral-100 dark:border-neutral-900 pt-5 mt-8">
              <button
                onClick={() => formik.submitForm()}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 bg-indigo-655 hover:bg-indigo-700 text-white rounded-full text-xs font-semibold transition"
              >
                {editingItem ? 'Save Updates' : 'Add to Catalog'}
              </button>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-6 py-3 border border-neutral-250 dark:border-neutral-800 hover:border-neutral-500 rounded-full text-xs font-semibold transition text-neutral-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export { AdminDesignsPage };
