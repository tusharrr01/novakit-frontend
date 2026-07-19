'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Layers,
  ShieldCheck,
  Zap,
  Code2,
  Blocks,
  Star,
  Bot,
  Check,
  LineChart,
  Plus,
  Minus,
  Quote,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SiteHeader } from '@/src/layout/site-header';
import { SiteFooter } from '@/src/layout/site-footer';
import { useCurrency } from '@/src/lib/currency';
import {
  useGetLandingPageQuery,
  useGetFaqsQuery,
  useGetTestimonialsQuery,
} from '@/src/redux/api/catalogApi';

export default function LandingPage() {
  const { data: landingData } = useGetLandingPageQuery(undefined);
  const { data: faqData } = useGetFaqsQuery(undefined);
  const { data: testimonialData } = useGetTestimonialsQuery(undefined);
  const { t } = useTranslation();

  const hero = landingData?.data?.hero || {
    badge: 'NovaKit Premium v1.0',
    title: 'The Ultimate Component Marketplace for Modern Developers',
    description: 'Browse and download premium designs, responsive templates, and WhatsApp automations.',
    primary_button_text: 'Explore Marketplace',
    primary_button_link: '/templates',
  };

  const marquee = landingData?.data?.announcement || {
    marquee_enabled: true,
    marquee_text: '🔥 Special Offer: Get 30% off on all template purchases this week!',
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 flex flex-col">
      {/* Marquee Banner */}
      {marquee.marquee_enabled && marquee.marquee_text && (
        <div className="w-full bg-indigo-600 text-white py-2 text-center text-xs font-semibold overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-marquee select-none">
            {marquee.marquee_text} &nbsp;&bull;&nbsp; {marquee.marquee_text} &nbsp;&bull;&nbsp; {marquee.marquee_text}
          </div>
        </div>
      )}

      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden flex flex-col items-center justify-center py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-indigo-650/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 text-center z-10">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 px-3 py-1 text-xs text-neutral-500 backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-500 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-500" />
            </span>
            {hero.badge}
            <ArrowRight className="h-3 w-3" />
          </div>

          <h1 className="mt-6 font-sans text-4xl font-extrabold leading-[1.05] tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-6xl lg:text-7xl max-w-4xl mx-auto">
            The <span className="text-indigo-600 dark:text-indigo-400">AI-first</span> toolkit for shipping products.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-neutral-550 dark:text-neutral-400 sm:text-lg">
            {hero.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={hero.primary_button_link}
              className="group inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-600/25 transition hover:bg-indigo-700"
            >
              {hero.primary_button_text}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/designs"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-250 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/50 px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 backdrop-blur transition hover:border-indigo-500/50"
            >
              <LineChart className="h-4 w-4" />
              Browse Designs
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500">
            <div className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-indigo-650" /> MIT-friendly license
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-indigo-650" /> Tailwind v4 pure styling
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-indigo-650" /> Lifetime free updates
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="mx-auto max-w-7xl px-3 py-20 sm:px-4 lg:px-6 w-full">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-8 flex flex-col justify-between">
            <div>
              <Layers className="h-8 w-8 text-indigo-600" />
              <h3 className="mt-4 text-xl font-bold tracking-tight text-neutral-900 dark:text-white">Premium UI Assets</h3>
              <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                Unlock 2,000+ Figma assets and clean design tokens mapped using auto-layout. Reusable screens and systems covering fintech, charts, and SaaS portals.
              </p>
            </div>
            <Link href="/designs" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-650 hover:underline">
              View designs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-8 flex flex-col justify-between">
            <div>
              <Zap className="h-8 w-8 text-indigo-600" />
              <h3 className="mt-4 text-xl font-bold tracking-tight text-neutral-900 dark:text-white">Live Code Previews</h3>
              <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                Preview component scripts interactively using our built-in Sandpack launcher before buying.
              </p>
            </div>
            <Link href="/templates" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-650 hover:underline">
              View templates <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonialData?.data && testimonialData.data.length > 0 && (
        <section className="bg-neutral-50/30 dark:bg-neutral-950 border-y border-neutral-200/60 dark:border-neutral-800/60 py-20">
          <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">{t('Testimonials')}</span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">Loved by builders worldwide</h2>
              <p className="mt-3 text-sm text-neutral-500">Read reviews from engineers shipping serious platforms.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
              {testimonialData.data.slice(0, 4).map((test: any) => (
                <div key={test._id} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-6 flex flex-col justify-between shadow-sm">
                  <p className="text-sm italic text-neutral-600 dark:text-neutral-350 leading-relaxed">
                    "{test.description}"
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-850 pt-4">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white leading-none">{test.user_name}</h4>
                      <span className="text-[11px] text-neutral-450 mt-1 block">{test.user_post}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faqData?.data && faqData.data.length > 0 && (
        <section className="mx-auto max-w-3xl px-3 py-20 sm:px-4 w-full">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">{t('FAQ')}</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqData.data.map((faq: any) => (
              <div key={faq._id} className="rounded-2xl border border-neutral-200 dark:border-neutral-850 bg-neutral-50/20 dark:bg-neutral-900/10 p-5">
                <h4 className="text-base font-semibold text-neutral-900 dark:text-white tracking-tight">{faq.title}</h4>
                <p className="mt-2 text-sm text-neutral-500 leading-relaxed">{faq.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Box */}
      <section className="mx-auto max-w-7xl px-3 pb-24 sm:px-4 lg:px-6 w-full mt-auto">
        <div className="relative overflow-hidden rounded-3xl border border-neutral-250 dark:border-neutral-800 bg-neutral-950/90 text-white p-10 sm:p-16">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-10" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="relative text-center z-10">
            <Sparkles className="mx-auto h-8 w-8 text-indigo-400" />
            <h2 className="mt-4 font-sans text-3xl font-extrabold tracking-tight sm:text-5xl">
              Start shipping tonight.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-neutral-400 text-sm">
              Join thousands of builders using NovaKit components to bootstrap SaaS products in record time.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-650/25 hover:bg-indigo-700"
              >
                Create Account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/50 px-6 py-3 text-sm font-semibold text-neutral-300 hover:border-neutral-700"
              >
                Explore Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
