'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
} from '@/src/redux/api/adminApi';
import {
  Globe,
  Palette,
  Mail,
  Lock,
  Cloud,
  Sliders,
  ShieldAlert,
  Wrench,
  UserPlus,
  Share2,
  Save,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';

type SubSection =
  | 'general'
  | 'branding'
  | 'email'
  | 'google'
  | 'aws'
  | 'limits'
  | 'otp'
  | 'maintenance'
  | 'signup'
  | 'seo';

export default function AdminSettingsPage() {
  const { data: settingsData, isLoading } = useGetAdminSettingsQuery(undefined);
  const [updateSettings] = useUpdateAdminSettingsMutation();
  const [activeTab, setActiveTab] = useState<SubSection>('general');

  const settings = settingsData?.data || {};

  const tabs = [
    { id: 'general', label: 'General', icon: Globe, desc: 'App info & defaults' },
    { id: 'branding', label: 'Branding', icon: Palette, desc: 'Logos & icons' },
    { id: 'email', label: 'Email SMTP', icon: Mail, desc: 'Transporter records' },
    { id: 'google', label: 'Google OAuth', icon: Lock, desc: 'API Client credentials' },
    { id: 'aws', label: 'AWS S3', icon: Cloud, desc: 'Storage credentials' },
    { id: 'limits', label: 'Limits', icon: Sliders, desc: 'File uploads limits' },
    { id: 'otp', label: 'OTP Delivery', icon: ShieldAlert, desc: 'Verification settings' },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, desc: 'App maintenance state' },
    { id: 'signup', label: 'Signup UI', icon: UserPlus, desc: 'T&C agreement prompts' },
    { id: 'seo', label: 'SEO Settings', icon: Share2, desc: 'Metadata & social shares' },
  ];

  // We instantiate Formik form with current settings values
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      general: {
        appName: settings?.general?.appName || 'NovaKit',
        appEmail: settings?.general?.appEmail || '',
        appDescription: settings?.general?.appDescription || '',
        supportEmail: settings?.general?.supportEmail || '',
        defaultTheme: settings?.general?.defaultTheme || 'dark',
        sessionExpirationDays: settings?.general?.sessionExpirationDays || 7,
        allowUserSignup: settings?.general?.allowUserSignup ?? true,
        enableCookiePopup: settings?.general?.enableCookiePopup ?? false,
        demoMode: settings?.general?.demoMode ?? false,
      },
      branding: {
        favicon: settings?.branding?.favicon || '',
        logoLight: settings?.branding?.logoLight || '',
        logoDark: settings?.branding?.logoDark || '',
        sidebarFaviconLight: settings?.branding?.sidebarFaviconLight || '',
        sidebarFaviconDark: settings?.branding?.sidebarFaviconDark || '',
      },
      email: {
        smtpHost: settings?.email?.smtpHost || '',
        smtpPort: settings?.email?.smtpPort || 2525,
        smtpUsername: settings?.email?.smtpUsername || '',
        smtpPassword: settings?.email?.smtpPassword || '',
        fromName: settings?.email?.fromName || '',
        fromEmail: settings?.email?.fromEmail || '',
      },
      google: {
        clientId: settings?.google?.clientId || '',
        clientSecret: settings?.google?.clientSecret || '',
        redirectUri: settings?.google?.redirectUri || '',
      },
      aws: {
        enabled: settings?.aws?.enabled ?? false,
        accessKeyId: settings?.aws?.accessKeyId || '',
        secretAccessKey: settings?.aws?.secretAccessKey || '',
        region: settings?.aws?.region || 'us-east-1',
        bucket: settings?.aws?.bucket || '',
      },
      limits: {
        mediaSharing: settings?.limits?.mediaSharing ?? true,
        documentMb: settings?.limits?.documentMb || 10,
        audioMb: settings?.limits?.audioMb || 15,
        videoMb: settings?.limits?.videoMb || 50,
        imageMb: settings?.limits?.imageMb || 5,
        multiFileMb: settings?.limits?.multiFileMb || 20,
        totalStorageMb: settings?.limits?.totalStorageMb || 1000,
        restoreOnDelete: settings?.limits?.restoreOnDelete ?? false,
      },
      otp: {
        method: settings?.otp?.method || 'email',
      },
      maintenance: {
        appLoaderLabel: settings?.maintenance?.appLoaderLabel || 'Loading...',
        enabled: settings?.maintenance?.enabled ?? false,
        title: settings?.maintenance?.title || '',
        message: settings?.maintenance?.message || '',
        maintenanceImage: settings?.maintenance?.maintenanceImage || '',
        notFoundTitle: settings?.maintenance?.notFoundTitle || '',
        notFoundContent: settings?.maintenance?.notFoundContent || '',
        notFoundImage: settings?.maintenance?.notFoundImage || '',
        noInternetTitle: settings?.maintenance?.noInternetTitle || '',
        noInternetContent: settings?.maintenance?.noInternetContent || '',
        noInternetImage: settings?.maintenance?.noInternetImage || '',
      },
      signup: {
        enableAgreementLine: settings?.signup?.enableAgreementLine ?? true,
        prefixText: settings?.signup?.prefixText || '',
        linkText: settings?.signup?.linkText || '',
        targetPageSlug: settings?.signup?.targetPageSlug || '',
      },
      seo: {
        title: settings?.seo?.title || '',
        description: settings?.seo?.description || '',
        keywords: settings?.seo?.keywords || '',
        canonicalUrl: settings?.seo?.canonicalUrl || '',
        ogTitle: settings?.seo?.ogTitle || '',
        ogDescription: settings?.seo?.ogDescription || '',
        ogImage: settings?.seo?.ogImage || '',
        twitterCard: settings?.seo?.twitterCard || 'summary_large_image',
        twitterHandle: settings?.seo?.twitterHandle || '',
        robots: settings?.seo?.robots || 'index, follow',
      },
    },
    onSubmit: async (values) => {
      try {
        await updateSettings(values).unwrap();
        toast.success('System preferences saved successfully!');
      } catch (err) {
        toast.error('Failed to update system settings');
      }
    },
  });

  if (isLoading) {
    return <div className="p-10 text-center text-xs text-neutral-500">Loading system settings...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-850 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Preferences settings</h1>
          <p className="mt-1.5 text-sm text-neutral-500">Configure global dashboard options and operational limits.</p>
        </div>
        <button
          onClick={() => formik.submitForm()}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-full text-xs font-semibold shadow-lg shadow-indigo-650/15"
        >
          <Save className="h-4 w-4" /> Save Preferences
        </button>
      </div>

      {/* Grid container */}
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Navigation Sidebar list */}
        <aside className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SubSection)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
                  isActive
                    ? 'bg-indigo-600/10 text-indigo-650 dark:text-indigo-400 font-semibold ring-1 ring-indigo-500/20'
                    : 'text-neutral-500 hover:bg-white dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold leading-none">{tab.label}</span>
                  <span className="text-[10px] text-neutral-450 mt-1 truncate">{tab.desc}</span>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Dynamic configuration form panel */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-900/60 p-6 space-y-6">
          {activeTab === 'general' && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">
                General app information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">App name</label>
                  <input
                    type="text"
                    {...formik.getFieldProps('general.appName')}
                    className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">App email</label>
                  <input
                    type="email"
                    {...formik.getFieldProps('general.appEmail')}
                    className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">App Description</label>
                  <textarea
                    rows={3}
                    {...formik.getFieldProps('general.appDescription')}
                    className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">
                Logos & Branding resources
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Favicon url</label>
                  <input
                    type="text"
                    {...formik.getFieldProps('branding.favicon')}
                    className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Logo Light Mode</label>
                  <input
                    type="text"
                    {...formik.getFieldProps('branding.logoLight')}
                    className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">
                SMTP Configuration details
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">SMTP Host</label>
                  <input
                    type="text"
                    {...formik.getFieldProps('email.smtpHost')}
                    className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">SMTP Port</label>
                  <input
                    type="number"
                    {...formik.getFieldProps('email.smtpPort')}
                    className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">SMTP Username</label>
                  <input
                    type="text"
                    {...formik.getFieldProps('email.smtpUsername')}
                    className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">SMTP Password</label>
                  <input
                    type="password"
                    {...formik.getFieldProps('email.smtpPassword')}
                    className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'google' && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">
                Google Client parameters
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Google Client ID</label>
                  <input
                    type="text"
                    {...formik.getFieldProps('google.clientId')}
                    className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Google Secret key</label>
                  <input
                    type="password"
                    {...formik.getFieldProps('google.clientSecret')}
                    className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'aws' && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">
                AWS S3 Storage configuration
              </h3>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="aws.enabled"
                  checked={formik.values.aws.enabled}
                  onChange={(e) => formik.setFieldValue('aws.enabled', e.target.checked)}
                  className="rounded border-neutral-350 dark:border-neutral-800 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="aws.enabled" className="text-xs font-bold text-neutral-700 dark:text-neutral-350">
                  Enable AWS S3 remote uploads storage
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Access key ID</label>
                  <input
                    type="text"
                    {...formik.getFieldProps('aws.accessKeyId')}
                    className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Secret access key</label>
                  <input
                    type="password"
                    {...formik.getFieldProps('aws.secretAccessKey')}
                    className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Bucket region</label>
                  <input
                    type="text"
                    {...formik.getFieldProps('aws.region')}
                    className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">S3 bucket name</label>
                  <input
                    type="text"
                    {...formik.getFieldProps('aws.bucket')}
                    className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'limits' && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">
                Media sharing upload size limits
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Max document size (MB)</label>
                  <input
                    type="number"
                    {...formik.getFieldProps('limits.documentMb')}
                    className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Max image size (MB)</label>
                  <input
                    type="number"
                    {...formik.getFieldProps('limits.imageMb')}
                    className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Max video size (MB)</label>
                  <input
                    type="number"
                    {...formik.getFieldProps('limits.videoMb')}
                    className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'otp' && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">
                OTP verification channels
              </h3>
              <div className="flex flex-col gap-1.5 max-w-xs">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Preferred method</label>
                <select
                  {...formik.getFieldProps('otp.method')}
                  className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                >
                  <option value="email">Email verification</option>
                  <option value="whatsapp">WhatsApp verification</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">
                System operational state
              </h3>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="maintenance.enabled"
                  checked={formik.values.maintenance.enabled}
                  onChange={(e) => formik.setFieldValue('maintenance.enabled', e.target.checked)}
                  className="rounded border-neutral-350 dark:border-neutral-800 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="maintenance.enabled" className="text-xs font-bold text-neutral-700 dark:text-neutral-350">
                  Switch application to MAINTENANCE MODE (offline page lock)
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Loader Label</label>
                  <input
                    type="text"
                    {...formik.getFieldProps('maintenance.appLoaderLabel')}
                    className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Maintenance header</label>
                  <input
                    type="text"
                    {...formik.getFieldProps('maintenance.title')}
                    className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Offline Message</label>
                  <textarea
                    rows={2}
                    {...formik.getFieldProps('maintenance.message')}
                    className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'signup' && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">
                Sign-up form disclosures
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Prefix text prompt</label>
                  <input
                    type="text"
                    {...formik.getFieldProps('signup.prefixText')}
                    className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Legal document label</label>
                  <input
                    type="text"
                    {...formik.getFieldProps('signup.linkText')}
                    className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">
                Metadata search optimizations
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">SEO Title format</label>
                  <input
                    type="text"
                    {...formik.getFieldProps('seo.title')}
                    className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">SEO keywords comma list</label>
                  <input
                    type="text"
                    {...formik.getFieldProps('seo.keywords')}
                    className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">SEO description</label>
                  <textarea
                    rows={2}
                    {...formik.getFieldProps('seo.description')}
                    className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export { AdminSettingsPage };
