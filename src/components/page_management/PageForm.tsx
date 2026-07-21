'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { TextInput } from '@/src/components/shared/form-fields/TextInput';
import { TextAreaField } from '@/src/components/shared/form-fields/TextAreaField';

interface PageFormData {
  title: string;
  slug: string;
  content: string;
  meta_title: string;
  meta_description: string;
  status: boolean;
}

interface PageFormProps {
  initialData?: Partial<PageFormData> & { _id?: string };
  onSubmit: (data: PageFormData) => Promise<void>;
  isLoading: boolean;
  isEdit?: boolean;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function PageForm({ initialData, onSubmit, isLoading, isEdit = false }: PageFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<PageFormData>({
    title: '',
    slug: '',
    content: '',
    meta_title: '',
    meta_description: '',
    status: true,
  });
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [errors, setErrors] = useState<Partial<Record<keyof PageFormData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title ?? '',
        slug: initialData.slug ?? '',
        content: initialData.content ?? '',
        meta_title: initialData.meta_title ?? '',
        meta_description: initialData.meta_description ?? '',
        status: initialData.status ?? true,
      });
    }
  }, [initialData]);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }));
    setErrors((prev) => ({ ...prev, title: undefined }));
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlugTouched(true);
    setForm((prev) => ({ ...prev, slug: e.target.value }));
    setErrors((prev) => ({ ...prev, slug: undefined }));
  }

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.slug.trim()) newErrors.slug = 'Slug is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({ ...form, slug: slugify(form.slug) });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full pb-8">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-4 bg-[var(--admin-bg,#f8fafc)] dark:bg-neutral-900 border-b border-neutral-200/60 dark:border-neutral-800/60 shadow-sm">
        <button
          type="button"
          onClick={() => router.back()}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors shadow-sm"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
            {isEdit ? 'Edit Page' : 'Create New Page'}
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {isEdit
              ? 'Update the page content and settings below.'
              : 'Fill in the details to create a publicly accessible page.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Check size={16} />
            )}
            {isLoading
              ? isEdit ? 'Updating…' : 'Saving…'
              : isEdit ? 'Update Page' : 'Save Page'}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left — Main content */}
        <div className="xl:col-span-8 space-y-5">
          {/* Title */}
          <div className="admin-card p-6">
            <TextInput
              label="Title"
              value={form.title}
              onChange={handleTitleChange}
              placeholder="e.g. Privacy Policy"
              error={errors.title}
              required
            />
          </div>

          {/* Content */}
          <div className="admin-card p-6">
            <TextAreaField
              label="Content (HTML supported)"
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              rows={20}
              placeholder="<h2>Section Title</h2><p>Write your page content here…</p>"
            />
          </div>

          {/* SEO */}
          <div className="admin-card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">SEO Settings</h3>
            <TextInput
              label="Meta Title"
              value={form.meta_title}
              onChange={(e) => setForm((prev) => ({ ...prev, meta_title: e.target.value }))}
              placeholder="Leave blank to use page title"
            />
            <TextAreaField
              label="Meta Description"
              value={form.meta_description}
              onChange={(e) => setForm((prev) => ({ ...prev, meta_description: e.target.value }))}
              rows={3}
              placeholder="Brief summary for search engines (160 chars recommended)"
            />
          </div>
        </div>

        {/* Right — Sidebar */}
        <div className="xl:col-span-4 space-y-5">
          {/* Slug */}
          <div className="admin-card p-5 space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Slug / URL <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 px-3 py-2.5 focus-within:border-indigo-500 transition-colors">
              <span className="shrink-0 text-xs text-neutral-400 select-none">/page/</span>
              <input
                value={form.slug}
                onChange={handleSlugChange}
                placeholder="privacy-policy"
                className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-white outline-none min-w-0"
              />
            </div>
            {errors.slug ? (
              <p className="text-xs text-red-500 mt-1">
                {errors.slug}
              </p>
            ) : (
              <p className="text-xs text-neutral-400">
                Auto-generated from title. Edit to customise.
              </p>
            )}
          </div>

          {/* Status */}
          <div className="admin-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">Published</p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {form.status ? 'Visible to all visitors' : 'Hidden from public'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, status: !prev.status }))}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none cursor-pointer ${
                  form.status ? 'bg-indigo-600' : 'bg-neutral-300 dark:bg-neutral-600'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    form.status ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="admin-card p-5">
            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">Tips</p>
            <ul className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400 list-disc pl-4">
              <li>Content supports <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">HTML</code> tags for rich formatting.</li>
              <li>Use <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">&lt;h2&gt;</code>, <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">&lt;p&gt;</code>, <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">&lt;ul&gt;</code> for structure.</li>
              <li>Slug must be lowercase and hyphen-separated.</li>
              <li>Once published, this page is accessible at <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">/page/slug</code>.</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
}
