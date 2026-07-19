'use client';

import React from 'react';
import { useFormik } from 'formik';
import {
  useGetLandingPageQuery,
  useGetFaqsQuery,
  useGetTestimonialsQuery,
} from '@/src/redux/api/catalogApi';
import {
  useUpdateLandingPageSettingsMutation,
} from '@/src/redux/api/adminApi';
import { Megaphone, Save, Plus, HelpCircle, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminAnnouncementsPage() {
  const { data: landingData, refetch: refetchLanding } = useGetLandingPageQuery(undefined);
  const { data: faqData } = useGetFaqsQuery(undefined);
  const { data: testimonialData } = useGetTestimonialsQuery(undefined);
  const [updateLanding] = useUpdateLandingPageSettingsMutation();

  const landing = landingData?.data || {};
  const faqs = faqData?.data || [];
  const testimonials = testimonialData?.data || [];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      marquee_enabled: landing?.announcement?.marquee_enabled ?? true,
      marquee_text: landing?.announcement?.marquee_text || '🔥 New templates catalog added this week!',
      hero_badge: landing?.hero?.badge || 'NovaKit Premium v1.0',
      hero_title: landing?.hero?.title || 'The ultimate UI starts framework',
      hero_description: landing?.hero?.description || 'Build modular platforms in record time.',
      hero_button_text: landing?.hero?.primary_button_text || 'Get started',
      hero_button_link: landing?.hero?.primary_button_link || '/templates',
    },
    onSubmit: async (values) => {
      try {
        const payload = {
          announcement: {
            marquee_enabled: values.marquee_enabled,
            marquee_text: values.marquee_text,
          },
          hero: {
            badge: values.hero_badge,
            title: values.hero_title,
            description: values.hero_description,
            primary_button_text: values.hero_button_text,
            primary_button_link: values.hero_button_link,
          },
        };
        await updateLanding(payload).unwrap();
        toast.success('Landing layouts and banners updated successfully!');
        refetchLanding();
      } catch (err) {
        toast.error('Failed to save announcement banner configurations');
      }
    },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-850 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Announcements & Page layouts</h1>
          <p className="mt-1.5 text-sm text-neutral-500">Configure marquee promotional banners and landing copy blocks.</p>
        </div>
        <button
          onClick={() => formik.submitForm()}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-full text-xs font-semibold shadow-lg"
        >
          <Save className="h-4 w-4" /> Save Copy Layouts
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* Main form copy block */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-900/60 p-6 space-y-6 text-xs">
          {/* Marquee Banner Option */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-indigo-600" /> Marquee Promo Banner
            </h3>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="marquee_enabled"
                checked={formik.values.marquee_enabled}
                onChange={(e) => formik.setFieldValue('marquee_enabled', e.target.checked)}
                className="rounded border-neutral-300 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="marquee_enabled" className="text-xs font-bold text-neutral-700 dark:text-neutral-350">
                Display marquee promo notification banner
              </label>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Promo Text</label>
              <input
                type="text"
                {...formik.getFieldProps('marquee_text')}
                className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Hero segment */}
          <div className="space-y-4 pt-6 border-t border-neutral-100 dark:border-neutral-850">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Hero Section Copy</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Badge Title</label>
                <input
                  type="text"
                  {...formik.getFieldProps('hero_badge')}
                  className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Hero Button Text</label>
                <input
                  type="text"
                  {...formik.getFieldProps('hero_button_text')}
                  className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 outline-none focus:border-indigo-500"
                />
              </div>
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Hero Title Copy</label>
                <input
                  type="text"
                  {...formik.getFieldProps('hero_title')}
                  className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 outline-none focus:border-indigo-500"
                />
              </div>
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Hero description copy</label>
                <textarea
                  rows={2}
                  {...formik.getFieldProps('hero_description')}
                  className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Side columns: FAQs and Reviews viewer */}
        <div className="space-y-6">
          {/* FAQs List */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-900/60 p-6">
            <div className="mb-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-850 pb-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-indigo-650" /> Live FAQs List ({faqs.length})
              </h3>
              <button className="text-[10px] font-bold bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 px-2.5 py-1 rounded hover:border-indigo-500 transition">
                Add FAQ
              </button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {faqs.map((faq: any, i: number) => (
                <div key={i} className="text-xs border-b border-neutral-100 dark:border-neutral-850 pb-2">
                  <span className="font-semibold text-neutral-900 dark:text-white">{faq.title}</span>
                  <p className="text-neutral-500 mt-1">{faq.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials List */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-900/60 p-6">
            <div className="mb-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-850 pb-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-indigo-655" /> Testimonials ({testimonials.length})
              </h3>
              <button className="text-[10px] font-bold bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 px-2.5 py-1 rounded hover:border-indigo-500 transition">
                Add Review
              </button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {testimonials.map((test: any, i: number) => (
                <div key={i} className="text-xs border-b border-neutral-100 dark:border-neutral-850 pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-neutral-900 dark:text-white">{test.user_name}</span>
                    <span className="text-[10px] text-neutral-450">{test.user_post}</span>
                  </div>
                  <p className="text-neutral-500 mt-1 italic">"{test.description}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export { AdminAnnouncementsPage };
