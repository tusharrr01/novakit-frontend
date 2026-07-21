'use client';

import { useMemo, useState } from 'react';
import {
  Globe,
  Palette,
  Share2,
  MessageSquare,
  Mail,
  Cloud,
  BarChart3,
  ShieldCheck,
  Megaphone,
  Wrench,
  FileCheck2,
  Search,
  RefreshCw,
  Save,
  Upload,
  Link2,
  Eye,
  EyeOff,
  X,
  Check,
} from 'lucide-react';
import { systemPreferencesStore, defaultSystemPreferences, type SystemPreferences } from '@/src/lib/system-preferences';
import { pagesStore } from '@/src/lib/pages-content';

type SubKey =
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

const SUBS: { key: SubKey; label: string; sub: string; icon: typeof Globe }[] = [
  { key: 'general', label: 'General', sub: 'App info & preferences', icon: Globe },
  { key: 'branding', label: 'Branding', sub: 'Logos & icons', icon: Palette },
  { key: 'email', label: 'Email', sub: 'SMTP configuration', icon: Mail },
  { key: 'google', label: 'Google', sub: 'Google API credentials', icon: Globe },
  { key: 'aws', label: 'AWS', sub: 'AWS S3 configuration', icon: Cloud },
  { key: 'limits', label: 'Limits', sub: 'File & group limits', icon: BarChart3 },
  { key: 'otp', label: 'OTP Delivery', sub: 'Configure OTP delivery methods', icon: ShieldCheck },
  { key: 'maintenance', label: 'Maintenance', sub: 'Maintenance & error pages', icon: Wrench },
  { key: 'signup', label: 'Signup Customization', sub: 'Signup agreements & checkboxes', icon: FileCheck2 },
  { key: 'seo', label: 'SEO Optimization', sub: 'Meta tags & social previews', icon: Share2 },
];

export function SystemPreferencesTab() {
  const [active, setActive] = useState<SubKey>('general');
  const [draft, setDraft] = useState<SystemPreferences>(() => systemPreferencesStore.get());
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [showAwsSecret, setShowAwsSecret] = useState(false);

  const meta = useMemo(() => SUBS.find((s) => s.key === active)!, [active]);
  const Icon = meta.icon;

  const save = () => {
    systemPreferencesStore.save(draft);
  };
  const refresh = () => setDraft(systemPreferencesStore.get());

  const patch = <K extends keyof SystemPreferences>(
    section: K,
    values: Partial<SystemPreferences[K]>,
  ) => setDraft((d) => ({ ...d, [section]: { ...d[section], ...values } }));

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="mb-4 shrink-0">
        <h2 className="text-2xl font-semibold text-brand">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your application configuration and preferences</p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden lg:flex-row">
        {/* Sidebar */}
        <aside className="max-h-72 min-h-0 w-full shrink-0 overflow-y-auto custom-scrollbar rounded-lg border border-border/60 bg-card p-2 lg:max-h-none lg:w-72">
          <nav className="space-y-1">
            {SUBS.map((s) => {
              const SIcon = s.icon;
              const isActive = s.key === active;
              return (
                <button
                  key={s.key}
                  onClick={() => setActive(s.key)}
                  className={`flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left transition ${
                    isActive
                      ? 'border-brand/40 bg-brand/10 text-brand dark:bg-brand/10 dark:text-brand'
                      : 'border-transparent hover:bg-muted/60'
                  }`}
                >
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-lg ${
                      isActive ? 'bg-brand/10 text-brand' : 'bg-muted text-foreground/70'
                    }`}
                  >
                    <SIcon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{s.label}</span>
                    <span className="block truncate text-xs text-muted-foreground">{s.sub}</span>
                  </span>
                  {isActive && <span className="h-6 w-1 rounded bg-brand/100" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main panel */}
        <div className="flex min-w-0 flex-1 min-h-0 flex-col overflow-hidden">
          <div className="shrink-0">
            {/* Header card */}
            <div className="flex items-center justify-between admin-card p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand/10 text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-semibold">{meta.label}</div>
                  <div className="text-xs text-muted-foreground">{meta.sub}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={refresh}
                  className="inline-flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm hover:bg-muted"
                >
                  <RefreshCw className="h-4 w-4" /> Refresh
                </button>
                <button
                  onClick={save}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-gradient px-3 py-2 text-sm font-medium text-white shadow-lg shadow-brand/20 hover:opacity-95"
                >
                  <Save className="h-4 w-4" /> Save Changes
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-1">
            {/* Content */}
            {active === 'general' && (
              <>
                <Card title="Application Info" subtitle="Basic information about your application.">
                  <Grid2>
                    <Field label="App Name">
                      <Input value={draft.general.appName} onChange={(v) => patch('general', { appName: v })} />
                    </Field>
                    <Field label="App Email">
                      <Input value={draft.general.appEmail} onChange={(v) => patch('general', { appEmail: v })} />
                    </Field>
                    <Field label="App Description">
                      <Input value={draft.general.appDescription} onChange={(v) => patch('general', { appDescription: v })} />
                    </Field>
                    <Field label="Support Email">
                      <Input value={draft.general.supportEmail} onChange={(v) => patch('general', { supportEmail: v })} />
                    </Field>
                    <Field label="Default Theme Mode">
                      <Select
                        value={draft.general.defaultTheme}
                        onChange={(v) => patch('general', { defaultTheme: v as 'light' })}
                        options={[
                          { value: 'light', label: 'Light' },
                          { value: 'dark', label: 'Dark' },
                          { value: 'system', label: 'System' },
                        ]}
                      />
                    </Field>
                    <Field label="Session Expiration (days)">
                      <Input
                        type="number"
                        value={String(draft.general.sessionExpirationDays)}
                        onChange={(v) => patch('general', { sessionExpirationDays: Number(v) || 0 })}
                      />
                    </Field>
                  </Grid2>
                </Card>
                <Card title="Preferences" subtitle="Control application-wide behavior.">
                  <ToggleRow
                    title="Allow User Signup"
                    subtitle="Allow new users to register for an account."
                    checked={draft.general.allowUserSignup}
                    onChange={(v) => patch('general', { allowUserSignup: v })}
                  />
                  <ToggleRow
                    title="Enable Cookie Preference Pop-up"
                    subtitle="Display a GDPR-compliant cookie consent banner on landing pages."
                    checked={draft.general.enableCookiePopup}
                    onChange={(v) => patch('general', { enableCookiePopup: v })}
                  />
                  <ToggleRow
                    title="Demo Mode"
                    subtitle="Mask sensitive data and show demo credentials."
                    checked={draft.general.demoMode}
                    onChange={(v) => patch('general', { demoMode: v })}
                  />
                </Card>
              </>
            )}

            {active === 'branding' && (
              <Card title="Logos & Icons" subtitle="Set URLs or upload images for your application logos and icons.">
                <div className="space-y-6">
                  <UrlUploadRow
                    label="Favicon"
                    value={draft.branding.favicon}
                    onChange={(v) => patch('branding', { favicon: v })}
                  />
                  <UrlUploadRow
                    label="Logo (Light Mode)"
                    value={draft.branding.logoLight}
                    onChange={(v) => patch('branding', { logoLight: v })}
                  />
                  <UrlUploadRow
                    label="Logo (Dark Mode)"
                    value={draft.branding.logoDark}
                    onChange={(v) => patch('branding', { logoDark: v })}
                  />
                  <UrlUploadRow
                    label="Sidebar Favicon (Light)"
                    value={draft.branding.sidebarFaviconLight}
                    onChange={(v) => patch('branding', { sidebarFaviconLight: v })}
                  />
                  <UrlUploadRow
                    label="Sidebar Favicon (Dark)"
                    value={draft.branding.sidebarFaviconDark}
                    onChange={(v) => patch('branding', { sidebarFaviconDark: v })}
                  />
                </div>
              </Card>
            )}

            {active === 'email' && (
              <>
                <Card title="SMTP Configuration" subtitle="Configure outgoing email via SMTP.">
                  <Grid2>
                    <Field label="SMTP Host">
                      <Input value={draft.email.smtpHost} onChange={(v) => patch('email', { smtpHost: v })} />
                    </Field>
                    <Field label="SMTP Port">
                      <Input
                        type="number"
                        value={String(draft.email.smtpPort)}
                        onChange={(v) => patch('email', { smtpPort: Number(v) || 0 })}
                      />
                    </Field>
                    <Field label="SMTP Username">
                      <Input value={draft.email.smtpUsername} onChange={(v) => patch('email', { smtpUsername: v })} />
                    </Field>
                    <Field label="SMTP Password">
                      <div className="relative">
                        <Input
                          type={showSmtpPass ? 'text' : 'password'}
                          value={draft.email.smtpPassword}
                          onChange={(v) => patch('email', { smtpPassword: v })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowSmtpPass((s) => !s)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showSmtpPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </Field>
                  </Grid2>
                </Card>
                <Card title="Sender Details" subtitle="Set the name and email address shown to recipients.">
                  <Grid2>
                    <Field label="From Name">
                      <Input value={draft.email.fromName} onChange={(v) => patch('email', { fromName: v })} />
                    </Field>
                    <Field label="From Email">
                      <Input value={draft.email.fromEmail} onChange={(v) => patch('email', { fromEmail: v })} />
                    </Field>
                  </Grid2>
                </Card>
              </>
            )}

            {active === 'google' && (
              <Card title="Google Configuration" subtitle="Configure your Google Cloud Project credentials for OAuth2 integration.">
                <div className="space-y-4">
                  <Field label="Google Client ID">
                    <Input value={draft.google.clientId} onChange={(v) => patch('google', { clientId: v })} placeholder="Your Google Client ID" />
                  </Field>
                  <Field label="Google Client Secret">
                    <Input value={draft.google.clientSecret} onChange={(v) => patch('google', { clientSecret: v })} placeholder="Your Google Client Secret" />
                  </Field>
                  <Field label="Google Redirect URI">
                    <Input value={draft.google.redirectUri} onChange={(v) => patch('google', { redirectUri: v })} />
                  </Field>
                </div>
              </Card>
            )}

            {active === 'aws' && (
              <Card title="AWS Configuration" subtitle="Configure your AWS S3 credentials for media storage.">
                <ToggleRow
                  title="Enable AWS S3 Storage"
                  subtitle="Use AWS S3 for media storage"
                  checked={draft.aws.enabled}
                  onChange={(v) => patch('aws', { enabled: v })}
                />
                <div className="mt-4 space-y-4">
                  <Field label="AWS Access Key ID">
                    <Input value={draft.aws.accessKeyId} onChange={(v) => patch('aws', { accessKeyId: v })} placeholder="Your AWS Access Key ID" />
                  </Field>
                  <Field label="AWS Secret Access Key">
                    <div className="relative">
                      <Input
                        type={showAwsSecret ? 'text' : 'password'}
                        value={draft.aws.secretAccessKey}
                        onChange={(v) => patch('aws', { secretAccessKey: v })}
                        placeholder="Your AWS Secret Access Key"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAwsSecret((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showAwsSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </Field>
                  <Grid2>
                    <Field label="AWS Region">
                      <Input value={draft.aws.region} onChange={(v) => patch('aws', { region: v })} placeholder="e.g. us-east-1" />
                    </Field>
                    <Field label="AWS S3 Bucket">
                      <Input value={draft.aws.bucket} onChange={(v) => patch('aws', { bucket: v })} placeholder="Your S3 Bucket Name" />
                    </Field>
                  </Grid2>
                </div>
              </Card>
            )}

            {active === 'limits' && (
              <>
                <Card title="Communication Features" subtitle="Enable or disable communication capabilities.">
                  <ToggleRow
                    title="Media Sharing"
                    subtitle="Allow users to send media files."
                    checked={draft.limits.mediaSharing}
                    onChange={(v) => patch('limits', { mediaSharing: v })}
                  />
                </Card>
                <Card title="File Upload Limits" subtitle="Set maximum file sizes for uploads (in MB).">
                  <Grid3>
                    <Field label="Document Limit (MB)">
                      <Input type="number" value={String(draft.limits.documentMb)} onChange={(v) => patch('limits', { documentMb: Number(v) || 0 })} />
                    </Field>
                    <Field label="Audio Limit (MB)">
                      <Input type="number" value={String(draft.limits.audioMb)} onChange={(v) => patch('limits', { audioMb: Number(v) || 0 })} />
                    </Field>
                    <Field label="Video Limit (MB)">
                      <Input type="number" value={String(draft.limits.videoMb)} onChange={(v) => patch('limits', { videoMb: Number(v) || 0 })} />
                    </Field>
                    <Field label="Image Limit (MB)">
                      <Input type="number" value={String(draft.limits.imageMb)} onChange={(v) => patch('limits', { imageMb: Number(v) || 0 })} />
                    </Field>
                    <Field label="Multi-file Share Limit">
                      <Input type="number" value={String(draft.limits.multiFileMb)} onChange={(v) => patch('limits', { multiFileMb: Number(v) || 0 })} />
                    </Field>
                    <Field label="Total Storage Limit (MB)">
                      <Input type="number" value={String(draft.limits.totalStorageMb)} onChange={(v) => patch('limits', { totalStorageMb: Number(v) || 0 })} />
                    </Field>
                  </Grid3>
                  <div className="mt-4">
                    <Field label="Allowed File Upload Types">
                      <TagInput
                        values={draft.limits.allowedTypes}
                        onChange={(vals) => patch('limits', { allowedTypes: vals })}
                      />
                      <p className="mt-1 text-xs text-muted-foreground">Press Enter or comma to add values.</p>
                    </Field>
                  </div>
                </Card>
                <Card title="Storage Management" subtitle="Configure how file storage is calculated.">
                  <ToggleRow
                    title="Restore Storage on Delete"
                    subtitle="If enabled, deleted files will be subtracted from user's storage usage."
                    checked={draft.limits.restoreOnDelete}
                    onChange={(v) => patch('limits', { restoreOnDelete: v })}
                  />
                </Card>
              </>
            )}

            {active === 'otp' && (
              <Card title="OTP Delivery Method" subtitle="Select the preferred delivery method for OTP verification.">
                <div className="grid gap-3 sm:grid-cols-2">
                  <OtpMethodCard
                    icon={Mail}
                    label="Email"
                    subtitle="Send OTP via email"
                    active={draft.otp.method === 'email'}
                    onClick={() => patch('otp', { method: 'email' })}
                  />
                  <OtpMethodCard
                    icon={MessageSquare}
                    label="WhatsApp"
                    subtitle="Send OTP via WhatsApp message"
                    active={draft.otp.method === 'whatsapp'}
                    onClick={() => patch('otp', { method: 'whatsapp' })}
                  />
                </div>
              </Card>
            )}

            {active === 'maintenance' && (
              <>
                <Card title="App Loader" subtitle="Set the label for the application loader.">
                  <Field label="App Loader Label">
                    <Input value={draft.maintenance.appLoaderLabel} onChange={(v) => patch('maintenance', { appLoaderLabel: v })} />
                  </Field>
                </Card>
                <Card title="Maintenance Mode" subtitle="Put the application in maintenance mode.">
                  <ToggleRow
                    title="Enable Maintenance Mode"
                    subtitle="When enabled, users will see the maintenance page."
                    checked={draft.maintenance.enabled}
                    onChange={(v) => patch('maintenance', { enabled: v })}
                  />
                  <div className="mt-4 space-y-4">
                    <Field label="Maintenance Title">
                      <Input value={draft.maintenance.title} onChange={(v) => patch('maintenance', { title: v })} />
                    </Field>
                    <Field label="Maintenance Message">
                      <Textarea value={draft.maintenance.message} onChange={(v) => patch('maintenance', { message: v })} />
                    </Field>
                    <Field label="Allowed IPs (during maintenance)">
                      <TagInput
                        values={draft.maintenance.allowedIps}
                        onChange={(vals) => patch('maintenance', { allowedIps: vals })}
                      />
                      <p className="mt-1 text-xs text-muted-foreground">IPs that can bypass maintenance and access the application.</p>
                    </Field>
                    <Field label="Maintenance Page Image">
                      <UrlUploadRow
                        value={draft.maintenance.maintenanceImage}
                        onChange={(v) => patch('maintenance', { maintenanceImage: v })}
                      />
                    </Field>
                  </div>
                </Card>
                <Card title="Error Pages" subtitle="Customize the 404 and no-internet error pages.">
                  <div className="space-y-6">
                    <div>
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">404 Page</div>
                      <div className="space-y-3">
                        <Field label="404 Page Title">
                          <Input value={draft.maintenance.notFoundTitle} onChange={(v) => patch('maintenance', { notFoundTitle: v })} />
                        </Field>
                        <Field label="404 Page Content">
                          <Input value={draft.maintenance.notFoundContent} onChange={(v) => patch('maintenance', { notFoundContent: v })} />
                        </Field>
                        <UrlUploadRow
                          label="404 Page Image"
                          value={draft.maintenance.notFoundImage}
                          onChange={(v) => patch('maintenance', { notFoundImage: v })}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">No Internet Page</div>
                      <div className="space-y-3">
                        <Field label="No Internet Title">
                          <Input value={draft.maintenance.noInternetTitle} onChange={(v) => patch('maintenance', { noInternetTitle: v })} />
                        </Field>
                        <Field label="No Internet Content">
                          <Input value={draft.maintenance.noInternetContent} onChange={(v) => patch('maintenance', { noInternetContent: v })} />
                        </Field>
                        <UrlUploadRow
                          label="No Internet Page Image"
                          value={draft.maintenance.noInternetImage}
                          onChange={(v) => patch('maintenance', { noInternetImage: v })}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {active === 'signup' && <SignupSection draft={draft} patch={patch} />}

            {active === 'seo' && (
              <>
                <Card title="SEO Basics" subtitle="Title, description and keywords search engines see.">
                  <div className="space-y-4">
                    <UrlUploadRow
                      label="Favicon"
                      value={draft.seo.favicon}
                      onChange={(v) => patch('seo', { favicon: v })}
                    />
                    <Field label="Meta Title">
                      <Input value={draft.seo.title} onChange={(v) => patch('seo', { title: v })} />
                    </Field>
                    <Field label="Meta Description">
                      <Textarea value={draft.seo.description} onChange={(v) => patch('seo', { description: v })} />
                    </Field>
                    <Field label="Keywords (comma separated)">
                      <Input value={draft.seo.keywords} onChange={(v) => patch('seo', { keywords: v })} />
                    </Field>
                    <Grid2>
                      <Field label="Canonical URL">
                        <Input value={draft.seo.canonicalUrl} onChange={(v) => patch('seo', { canonicalUrl: v })} />
                      </Field>
                      <Field label="Robots">
                        <Select
                          value={draft.seo.robots}
                          onChange={(v) => patch('seo', { robots: v })}
                          options={[
                            { value: 'index,follow', label: 'index, follow' },
                            { value: 'noindex,follow', label: 'noindex, follow' },
                            { value: 'index,nofollow', label: 'index, nofollow' },
                            { value: 'noindex,nofollow', label: 'noindex, nofollow' },
                          ]}
                        />
                      </Field>
                    </Grid2>
                  </div>
                </Card>
                <Card title="Social Preview" subtitle="How your app looks when shared on social platforms.">
                  <div className="space-y-4">
                    <Field label="OG Title">
                      <Input value={draft.seo.ogTitle} onChange={(v) => patch('seo', { ogTitle: v })} />
                    </Field>
                    <Field label="OG Description">
                      <Textarea value={draft.seo.ogDescription} onChange={(v) => patch('seo', { ogDescription: v })} />
                    </Field>
                    <UrlUploadRow
                      label="OG Image (1200×630)"
                      value={draft.seo.ogImage}
                      onChange={(v) => patch('seo', { ogImage: v })}
                    />
                    <Grid2>
                      <Field label="Twitter Card">
                        <Select
                          value={draft.seo.twitterCard}
                          onChange={(v) => patch('seo', { twitterCard: v as 'summary' })}
                          options={[
                            { value: 'summary', label: 'Summary' },
                            { value: 'summary_large_image', label: 'Summary large image' },
                          ]}
                        />
                      </Field>
                      <Field label="Twitter Handle">
                        <Input value={draft.seo.twitterHandle} onChange={(v) => patch('seo', { twitterHandle: v })} placeholder="@yourhandle" />
                      </Field>
                    </Grid2>
                    <Grid2>
                      <Field label="Facebook App ID">
                        <Input value={draft.seo.facebookAppId} onChange={(v) => patch('seo', { facebookAppId: v })} />
                      </Field>
                      <Field label="LinkedIn URL">
                        <Input value={draft.seo.linkedinUrl} onChange={(v) => patch('seo', { linkedinUrl: v })} />
                      </Field>
                    </Grid2>
                    {/* Live preview */}
                    <div className="rounded-md border border-border/60 bg-muted/30 p-3">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Link preview</div>
                      <div className="flex items-stretch gap-3 admin-card p-3">
                        <div className="grid h-24 w-32 shrink-0 place-items-center overflow-hidden rounded-md bg-muted">
                          {draft.seo.ogImage ? (
                            <img src={draft.seo.ogImage} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <Share2 className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs text-muted-foreground">
                            {draft.seo.canonicalUrl || 'example.com'}
                          </div>
                          <div className="truncate font-semibold">{draft.seo.ogTitle || draft.seo.title}</div>
                          <div className="line-clamp-2 text-sm text-muted-foreground">
                            {draft.seo.ogDescription || draft.seo.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
                <Card title="Structured Data (JSON-LD)" subtitle="Advanced: paste JSON-LD to help search engines understand your content.">
                  <Textarea
                    value={draft.seo.jsonLd}
                    onChange={(v) => patch('seo', { jsonLd: v })}
                    rows={6}
                    placeholder='{"@context":"https://schema.org","@type":"Organization","name":"NovaKit"}'
                  />
                </Card>
                <div className="flex justify-end">
                  <button
                    onClick={() => setDraft((d) => ({ ...d, seo: defaultSystemPreferences.seo }))}
                    className="text-xs text-muted-foreground underline hover:text-foreground"
                  >
                    Reset SEO to defaults
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Signup subsection ---------------- */

function SignupSection({
  draft,
  patch,
}: {
  draft: SystemPreferences;
  patch: <K extends keyof SystemPreferences>(section: K, values: Partial<SystemPreferences[K]>) => void;
}) {
  const pages = pagesStore.list();
  const toggleRequired = (slug: string, checked: boolean) => {
    const set = new Set(draft.signup.requiredPageSlugs);
    if (checked) set.add(slug);
    else set.delete(slug);
    patch('signup', { requiredPageSlugs: Array.from(set) });
  };

  return (
    <>
      <Card title="Signup Agreement Customization" subtitle="Customize the signup agreement line and linked page on the user signup page.">
        <ToggleRow
          title="Enable Signup Agreement Line"
          subtitle="Display the agreement checkbox and link line on the user signup page."
          checked={draft.signup.enableAgreementLine}
          onChange={(v) => patch('signup', { enableAgreementLine: v })}
        />
        <div className="mt-4 space-y-4">
          <Grid2>
            <Field label="Prefix Text">
              <Input value={draft.signup.prefixText} onChange={(v) => patch('signup', { prefixText: v })} />
            </Field>
            <Field label="Link Text">
              <Input value={draft.signup.linkText} onChange={(v) => patch('signup', { linkText: v })} />
            </Field>
          </Grid2>
          <Field label="Target Dynamic Page">
            <Select
              value={draft.signup.targetPageSlug}
              onChange={(v) => patch('signup', { targetPageSlug: v })}
              options={pages.map((p) => ({ value: p.slug, label: `${p.title} (${p.slug})` }))}
            />
          </Field>
        </div>
      </Card>
      <Card title="Required Consent Checkboxes" subtitle="Choose which dynamic pages the user must explicitly accept via checkboxes at signup.">
        {pages.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No dynamic pages yet. Create pages from the “Page Management” tab first.
          </p>
        ) : (
          <div className="space-y-2">
            {pages.map((p) => {
              const checked = draft.signup.requiredPageSlugs.includes(p.slug);
              return (
                <label
                  key={p.id}
                  className="flex cursor-pointer items-start gap-3 rounded-md border border-border/60 p-3 hover:bg-muted/40"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => toggleRequired(p.slug, e.target.checked)}
                    className="mt-1 h-4 w-4 accent-[hsl(var(--brand))]"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{p.title}</div>
                    <div className="truncate text-xs text-muted-foreground">/{p.slug}</div>
                  </div>
                  {checked && <Check className="h-4 w-4 text-brand" />}
                </label>
              );
            })}
          </div>
        )}
      </Card>
    </>
  );
}

/* ---------------- Presentational bits ---------------- */

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="admin-card p-5">
      <div className="mb-4">
        <div className="font-semibold">{title}</div>
        {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}
function Grid3({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium text-foreground/80">{label}</div>
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20"
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20"
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function ToggleRow({
  title,
  subtitle,
  checked,
  onChange,
}: {
  title: string;
  subtitle?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <div className="text-sm font-medium">{title}</div>
        {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? 'bg-brand/100' : 'bg-muted'
        }`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}

function UrlUploadRow({
  label,
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      {label && <div className="mb-1 text-xs font-medium text-foreground/80">{label}</div>}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="relative">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter URL"
            className="w-full rounded-lg border border-dashed border-border/60 bg-background/60 py-3 pl-9 pr-3 text-sm outline-none focus:border-brand/50"
          />
        </div>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 bg-background/60 py-3 text-sm text-muted-foreground hover:bg-muted/40">
          <Upload className="h-4 w-4" /> Upload File
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const reader = new FileReader();
              reader.onload = () => onChange(String(reader.result || ''));
              reader.readAsDataURL(f);
            }}
          />
        </label>
      </div>
    </div>
  );
}

function TagInput({ values, onChange }: { values: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState('');
  const commit = () => {
    const v = input.trim().replace(/,$/, '');
    if (!v) return;
    if (values.includes(v)) return setInput('');
    onChange([...values, v]);
    setInput('');
  };
  return (
    <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-background p-2">
      {values.map((v) => (
        <span
          key={v}
          className="inline-flex items-center gap-1 rounded-md bg-brand/10 px-2 py-0.5 text-xs text-brand dark:bg-brand/10 dark:text-brand"
        >
          {v}
          <button
            type="button"
            onClick={() => onChange(values.filter((x) => x !== v))}
            className="hover:text-brand"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            commit();
          } else if (e.key === 'Backspace' && !input && values.length) {
            onChange(values.slice(0, -1));
          }
        }}
        onBlur={commit}
        placeholder="Add more..."
        className="min-w-24 flex-1 bg-transparent px-1 py-1 text-sm outline-none"
      />
    </div>
  );
}

function OtpMethodCard({
  icon: Icon,
  label,
  subtitle,
  active,
  onClick,
}: {
  icon: typeof Mail;
  label: string;
  subtitle: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-start gap-3 rounded-lg border p-4 text-left transition ${
        active
          ? 'border-brand/40 bg-brand/5 dark:bg-brand/5'
          : 'border-border/60 hover:bg-muted/40'
      }`}
    >
      <span className={`grid h-10 w-10 place-items-center rounded-lg ${active ? 'bg-brand/10 text-brand' : 'bg-muted'}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <div className="font-semibold">{label}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
      {active && <Check className="absolute right-3 top-3 h-4 w-4 text-brand" />}
    </button>
  );
}
