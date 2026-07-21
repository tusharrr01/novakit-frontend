'use client';

import { useState } from 'react';
import { PageShell } from '@/src/components/admin/page-shell';
import {
  Search,
  Plus,
  Pencil,
  Info,
  Trash2,
  X,
  Layers,
  Palette,
  Bot,
  Eye,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Star,
  ExternalLink,
  Copy,
  Download,
  Code2,
  Sparkles,
  Zap,
  Link2,
  CheckCircle2,
  Activity,
  Package,
  KeyRound,
  Globe,
  Clock,
  Users as UsersIcon,
  FolderPlus,
  Tag,
  ArrowLeft,
  AlertTriangle,
  Filter,
} from 'lucide-react';

/* --------------------------- Types --------------------------- */

type SubTab = 'templates' | 'designs' | 'services';

type BaseAnalytics = {
  views: number;
  sales: number;
  revenue: number;
  conversion: number; // %
  rating: number;
  reviews: number;
  refunds: number;
  activeLicenses: number;
  trend: number[]; // sparkline
};

type Template = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  price: number;
  version: string;
  status: 'live' | 'draft' | 'archived';
  cover: string; // gradient key
  backendEndpoint: string;
  provisionEndpoint: string;
  adminUrlKey: string;
  frontendUrlKey: string;
  webhookSecret: string;
  analytics: BaseAnalytics;
};

type Design = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  price: number;
  status: 'live' | 'draft' | 'archived';
  cover: string;
  formats: string[]; // html, react, next, vue
  hasPromptCopy: boolean;
  zipUrl: string;
  previewUrl: string;
  aiPrompt: string;
  analytics: BaseAnalytics;
};

type ServicePlan = { id: string; label: string; interval: 'monthly' | 'yearly'; price: number };

type Service = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  price: number;
  status: 'live' | 'draft' | 'archived';
  cover: string;
  loginUrl: string;
  licenseFormat: string;
  plans: ServicePlan[];
  integrations: string[];
  analytics: BaseAnalytics;
};

/* --------------------------- Seed data --------------------------- */

const sparkline = (seed: number) =>
  Array.from({ length: 14 }, (_, i) => Math.round(20 + Math.abs(Math.sin(seed + i * 0.7)) * 80));

const TEMPLATES: Template[] = [
  {
    id: 't1',
    name: 'Aurora Admin',
    tagline: 'Analytics-first admin panel with realtime charts.',
    category: 'Dashboard',
    price: 49,
    version: '3.2.0',
    status: 'live',
    cover: 'violet',
    backendEndpoint: 'https://api.aurora-admin.novakit.app',
    provisionEndpoint: '/v1/provision',
    adminUrlKey: 'admin_url',
    frontendUrlKey: 'app_url',
    webhookSecret: 'whsec_••••4021',
    analytics: {
      views: 24800,
      sales: 412,
      revenue: 20188,
      conversion: 1.66,
      rating: 4.9,
      reviews: 218,
      refunds: 6,
      activeLicenses: 398,
      trend: sparkline(1),
    },
  },
  {
    id: 't2',
    name: 'Prism SaaS',
    tagline: 'Complete SaaS starter with auth, billing & AI.',
    category: 'Full Stack',
    price: 89,
    version: '1.4.0',
    status: 'live',
    cover: 'cobalt',
    backendEndpoint: 'https://api.prism.novakit.app',
    provisionEndpoint: '/v1/tenants',
    adminUrlKey: 'console_url',
    frontendUrlKey: 'app_url',
    webhookSecret: 'whsec_••••9812',
    analytics: {
      views: 18220,
      sales: 96,
      revenue: 8544,
      conversion: 0.52,
      rating: 4.9,
      reviews: 96,
      refunds: 1,
      activeLicenses: 94,
      trend: sparkline(3),
    },
  },
  {
    id: 't3',
    name: 'Cobalt Commerce',
    tagline: 'Headless storefront with cart & checkout.',
    category: 'Ecommerce',
    price: 59,
    version: '2.4.0',
    status: 'draft',
    cover: 'emerald',
    backendEndpoint: 'https://api.cobalt.novakit.app',
    provisionEndpoint: '/v1/storefront/init',
    adminUrlKey: 'dashboard',
    frontendUrlKey: 'storefront',
    webhookSecret: 'whsec_••••5521',
    analytics: {
      views: 9800,
      sales: 133,
      revenue: 7847,
      conversion: 1.35,
      rating: 4.8,
      reviews: 133,
      refunds: 3,
      activeLicenses: 128,
      trend: sparkline(5),
    },
  },
];

const DESIGNS: Design[] = [
  {
    id: 'd1',
    name: 'Glass Pricing Card',
    tagline: 'Frosted pricing card with animated border.',
    category: 'Pricing',
    price: 9,
    status: 'live',
    cover: 'violet',
    formats: ['html', 'react', 'next', 'vue'],
    hasPromptCopy: true,
    zipUrl: '/downloads/glass-pricing.zip',
    previewUrl: '/preview/glass-pricing',
    aiPrompt: 'A frosted glass pricing card with an animated gradient border, 3 tiers…',
    analytics: {
      views: 12400,
      sales: 812,
      revenue: 7308,
      conversion: 6.5,
      rating: 4.9,
      reviews: 214,
      refunds: 2,
      activeLicenses: 812,
      trend: sparkline(7),
    },
  },
  {
    id: 'd2',
    name: 'Bento Feature Grid',
    tagline: 'Editorial bento grid with hover reveal.',
    category: 'Features',
    price: 12,
    status: 'live',
    cover: 'cobalt',
    formats: ['html', 'react', 'next'],
    hasPromptCopy: true,
    zipUrl: '/downloads/bento.zip',
    previewUrl: '/preview/bento',
    aiPrompt: 'A bento-style feature grid, asymmetric, with subtle gradients…',
    analytics: {
      views: 22050,
      sales: 1204,
      revenue: 14448,
      conversion: 5.4,
      rating: 5.0,
      reviews: 402,
      refunds: 1,
      activeLicenses: 1204,
      trend: sparkline(9),
    },
  },
  {
    id: 'd3',
    name: 'Command Palette',
    tagline: '⌘K palette with fuzzy search & groups.',
    category: 'Overlay',
    price: 15,
    status: 'live',
    cover: 'emerald',
    formats: ['react', 'next'],
    hasPromptCopy: true,
    zipUrl: '/downloads/cmdk.zip',
    previewUrl: '/preview/cmdk',
    aiPrompt: 'A ⌘K style command palette with grouped results and keyboard nav…',
    analytics: {
      views: 8140,
      sales: 331,
      revenue: 4965,
      conversion: 4.06,
      rating: 4.8,
      reviews: 108,
      refunds: 0,
      activeLicenses: 331,
      trend: sparkline(11),
    },
  },
  {
    id: 'd4',
    name: 'Marquee Testimonials',
    tagline: 'Dual-row infinite marquee testimonials.',
    category: 'Social Proof',
    price: 8,
    status: 'draft',
    cover: 'sunset',
    formats: ['html', 'react'],
    hasPromptCopy: false,
    zipUrl: '/downloads/marquee.zip',
    previewUrl: '/preview/marquee',
    aiPrompt: 'Two-row infinite marquee of testimonial cards, pausing on hover…',
    analytics: {
      views: 4200,
      sales: 121,
      revenue: 968,
      conversion: 2.88,
      rating: 4.6,
      reviews: 42,
      refunds: 1,
      activeLicenses: 121,
      trend: sparkline(13),
    },
  },
];

const SERVICES: Service[] = [
  {
    id: 's1',
    name: 'WhatsFlow Automation',
    tagline: 'WhatsApp automations with visual flow builder.',
    category: 'Messaging',
    price: 29,
    status: 'live',
    cover: 'emerald',
    loginUrl: 'https://app.whatsflow.novakit.app/login',
    licenseFormat: 'WF-XXXX-XXXX-XXXX',
    plans: [
      { id: 'p1', label: 'Starter Monthly', interval: 'monthly', price: 29 },
      { id: 'p2', label: 'Starter Yearly', interval: 'yearly', price: 290 },
      { id: 'p3', label: 'Pro Monthly', interval: 'monthly', price: 79 },
      { id: 'p4', label: 'Pro Yearly', interval: 'yearly', price: 790 },
    ],
    integrations: ['WhatsApp Cloud', 'Zapier', 'Webhooks'],
    analytics: {
      views: 15320,
      sales: 604,
      revenue: 17516,
      conversion: 3.94,
      rating: 4.8,
      reviews: 184,
      refunds: 4,
      activeLicenses: 588,
      trend: sparkline(2),
    },
  },
  {
    id: 's2',
    name: 'InstaGrow Scheduler',
    tagline: 'Auto-schedule reels & carousels with AI captions.',
    category: 'Social',
    price: 19,
    status: 'live',
    cover: 'sunset',
    loginUrl: 'https://app.instagrow.novakit.app/login',
    licenseFormat: 'IG-XXXX-XXXX',
    plans: [
      { id: 'p1', label: 'Basic Monthly', interval: 'monthly', price: 19 },
      { id: 'p2', label: 'Basic Yearly', interval: 'yearly', price: 190 },
    ],
    integrations: ['Instagram Graph', 'OpenAI'],
    analytics: {
      views: 9840,
      sales: 402,
      revenue: 7638,
      conversion: 4.08,
      rating: 4.7,
      reviews: 121,
      refunds: 2,
      activeLicenses: 396,
      trend: sparkline(4),
    },
  },
  {
    id: 's3',
    name: 'MailPilot AI',
    tagline: 'Cold-email sequences with reply-detection AI.',
    category: 'Email',
    price: 39,
    status: 'draft',
    cover: 'cobalt',
    loginUrl: 'https://app.mailpilot.novakit.app/login',
    licenseFormat: 'MP-XXXX-XXXX',
    plans: [
      { id: 'p1', label: 'Solo Monthly', interval: 'monthly', price: 39 },
      { id: 'p2', label: 'Team Monthly', interval: 'monthly', price: 99 },
    ],
    integrations: ['Gmail', 'Outlook', 'Postmark'],
    analytics: {
      views: 3120,
      sales: 48,
      revenue: 1872,
      conversion: 1.54,
      rating: 4.5,
      reviews: 22,
      refunds: 0,
      activeLicenses: 48,
      trend: sparkline(6),
    },
  },
];

/* --------------------------- Utils --------------------------- */

const COVER_GRADIENTS: Record<string, string> = {
  violet: 'linear-gradient(135deg,#6D28D9,#A78BFA)',
  cobalt: 'linear-gradient(135deg,#1E3A8A,#60A5FA)',
  emerald: 'linear-gradient(135deg,#059669,#34D399)',
  sunset: 'linear-gradient(135deg,#F97316,#FB7185)',
  carbon: 'linear-gradient(135deg,#0A0A0A,#404040)',
};

const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const short = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `${n}`;

function StatusPill({ status }: { status: 'live' | 'draft' | 'archived' }) {
  const map = {
    live: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
    draft: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
    archived: 'bg-muted text-muted-foreground border-border',
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${map[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" /> {status}
    </span>
  );
}

function Sparkline({ data, className = '' }: { data: number[]; className?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={className}>
      <polyline
        points={pts}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* --------------------------- Main --------------------------- */

const SEED_CATEGORIES: Record<SubTab, string[]> = {
  templates: Array.from(new Set(TEMPLATES.map((t) => t.category))),
  designs: Array.from(new Set(DESIGNS.map((d) => d.category))),
  services: Array.from(new Set(SERVICES.map((s) => s.category))),
};

function getSubTab(val: SubTab): SubTab {
  return val;
}

export function ProductsTab() {
  const sub = getSubTab('services');
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Live' | 'Draft' | 'Archived'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [view, setView] = useState<
    | { kind: 'info'; type: SubTab; id: string }
    | { kind: 'edit'; type: SubTab; id: string | null }
    | { kind: 'category'; type: SubTab }
    | null
  >(null);
  const [categories, setCategories] = useState<Record<SubTab, string[]>>(SEED_CATEGORIES);


  const subMeta: Record<SubTab, { title: string; desc: string; icon: React.ComponentType<{ className?: string }> }> = {
    templates: {
      title: 'Templates',
      desc: 'Fulfillment templates — on purchase we call the template\'s backend to provision admin & frontend URLs.',
      icon: Layers,
    },
    designs: {
      title: 'Designs',
      desc: 'Copy-paste design blocks with framework variants (HTML, React, Next…) and optional AI prompt copy.',
      icon: Palette,
    },
    services: {
      title: 'Services',
      desc: 'Built-in SaaS services — license-based access with monthly / yearly subscription plans.',
      icon: Bot,
    },
  };
  const meta = subMeta[sub];
  const MetaIcon = meta.icon;

  // Full-page views take over the whole tab area
  if (view?.kind === 'info') {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <InfoPage
          type={view.type}
          id={view.id}
          onBack={() => setView(null)}
          onEdit={() => setView({ kind: 'edit', type: view.type, id: view.id })}
          onDeleted={() => setView(null)}
        />
      </div>
    );
  }
  if (view?.kind === 'edit') {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <EditPage
          type={view.type}
          id={view.id}
          onBack={() =>
            setView(view.id ? { kind: 'info', type: view.type, id: view.id } : null)
          }
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <Package className="h-3.5 w-3.5" /> Products
              <span className="text-muted-foreground/50">/</span>
              <span className="inline-flex items-center gap-1 text-brand">
                <MetaIcon className="h-3.5 w-3.5" /> {meta.title}
              </span>
            </div>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">{meta.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{meta.desc}</p>
          </div>
        </div>

        {/* Toolbar (matches Plans style) */}
        <div className="admin-card-static flex flex-wrap items-center gap-2 p-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search ${sub}…`}
              className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-4 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <ProductFilterSelect
            icon={<Filter className="h-3.5 w-3.5" />}
            label="Status"
            value={statusFilter}
            options={['All', 'Live', 'Draft', 'Archived']}
            onChange={(v) => setStatusFilter(v as typeof statusFilter)}
          />
          <ProductFilterSelect
            label="Category"
            value={categoryFilter}
            options={['All', ...categories[sub]]}
            onChange={setCategoryFilter}
          />
          <button
            onClick={() => setView({ kind: 'category', type: sub })}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition hover:border-brand/50 hover:text-brand"
          >
            <FolderPlus className="h-3.5 w-3.5" /> Add category
          </button>
          <button
            onClick={() => setView({ kind: 'edit', type: sub, id: null })}
            className="inline-flex items-center gap-2 rounded-md bg-brand-gradient px-4 py-2 text-xs font-medium text-white shadow-lg shadow-brand/20"
          >
            <Plus className="h-3.5 w-3.5" /> New {sub.slice(0, -1)}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pt-6">
        {/* Grid */}
        {sub === 'templates' && (
          <Grid
            items={TEMPLATES.filter(
              (t) =>
                match(t.name + t.tagline + t.category, q) &&
                (statusFilter === 'All' || t.status === statusFilter.toLowerCase()) &&
                (categoryFilter === 'All' || t.category === categoryFilter),
            )}
            render={(t) => (
              <TemplateCard
                key={t.id}
                t={t}
                onInfo={() => setView({ kind: 'info', type: 'templates', id: t.id })}
                onEdit={() => setView({ kind: 'edit', type: 'templates', id: t.id })}
              />
            )}
            empty="No templates match your filters."
          />
        )}
        {sub === 'designs' && (
          <Grid
            items={DESIGNS.filter(
              (d) =>
                match(d.name + d.tagline + d.category, q) &&
                (statusFilter === 'All' || d.status === statusFilter.toLowerCase()) &&
                (categoryFilter === 'All' || d.category === categoryFilter),
            )}
            render={(d) => (
              <DesignCard
                key={d.id}
                d={d}
                onInfo={() => setView({ kind: 'info', type: 'designs', id: d.id })}
                onEdit={() => setView({ kind: 'edit', type: 'designs', id: d.id })}
              />
            )}
            empty="No designs match your filters."
          />
        )}
        {sub === 'services' && (
          <Grid
            items={SERVICES.filter(
              (s) =>
                match(s.name + s.tagline + s.category, q) &&
                (statusFilter === 'All' || s.status === statusFilter.toLowerCase()) &&
                (categoryFilter === 'All' || s.category === categoryFilter),
            )}
            render={(s) => (
              <ServiceCard
                key={s.id}
                s={s}
                onInfo={() => setView({ kind: 'info', type: 'services', id: s.id })}
                onEdit={() => setView({ kind: 'edit', type: 'services', id: s.id })}
              />
            )}
            empty="No services match your filters."
          />
        )}
      </div>

      {/* Category modal */}
      {view?.kind === 'category' && (
        <CategoryModal
          type={view.type}
          categories={categories[view.type]}
          onAdd={(name) =>
            setCategories((prev) => ({
              ...prev,
              [view.type]: prev[view.type].includes(name) ? prev[view.type] : [...prev[view.type], name],
            }))
          }
          onRemove={(name) =>
            setCategories((prev) => ({
              ...prev,
              [view.type]: prev[view.type].filter((c) => c !== name),
            }))
          }
          onClose={() => setView(null)}
        />
      )}
    </div>
  );
}

function ProductFilterSelect({
  label,
  value,
  options,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <label className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs">
      {icon}
      <span className="text-muted-foreground">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-xs font-medium outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function match(hay: string, needle: string) {
  return hay.toLowerCase().includes(needle.trim().toLowerCase());
}

function Grid<T>({
  items,
  render,
  empty,
}: {
  items: T[];
  render: (item: T) => React.ReactNode;
  empty: string;
}) {
  if (items.length === 0) {
    return (
      <div className="admin-card-static flex items-center justify-center rounded-xl p-12 text-sm text-muted-foreground">
        {empty}
      </div>
    );
  }
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map(render)}</div>;
}

/* --------------------------- Cards --------------------------- */

function CardShell({
  cover,
  status,
  category,
  icon: Icon,
  name,
  tagline,
  price,
  priceSuffix,
  onInfo,
  onEdit,
  extras,
  meta,
}: {
  cover: string;
  status: 'live' | 'draft' | 'archived';
  category: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  name: string;
  tagline: string;
  price: number;
  priceSuffix?: string;
  onInfo: () => void;
  onEdit: () => void;
  extras?: React.ReactNode;
  meta?: React.ReactNode;
}) {
  return (
    <div className="admin-card group flex flex-col overflow-hidden">
      <div
        className="relative aspect-[16/9] w-full overflow-hidden"
        style={{ background: COVER_GRADIENTS[cover] || COVER_GRADIENTS.violet }}
      >
        <div className="absolute inset-0 bg-grid opacity-[0.18] mix-blend-overlay" />
        <div className="pointer-events-none absolute -top-14 -right-10 h-40 w-40 rounded-full bg-white/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-14 -left-10 h-40 w-40 rounded-full bg-black/20 blur-3xl" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <StatusPill status={status} />
          <span className="inline-flex items-center rounded-full bg-background/25 px-2 py-0.5 text-[10px] font-medium text-white/90 ring-1 ring-white/15 backdrop-blur">
            {category}
          </span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background/15 ring-1 ring-white/25 backdrop-blur-md">
            <Icon className="h-8 w-8 text-white" strokeWidth={1.6} />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-semibold tracking-tight">{name}</h3>
            <div className="font-display text-base font-semibold text-brand">
              {money(price)}
              {priceSuffix && <span className="ml-0.5 text-[10px] font-normal text-muted-foreground">{priceSuffix}</span>}
            </div>
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{tagline}</p>
        </div>

        {extras}

        {meta && <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">{meta}</div>}

        <div className="mt-auto flex items-center gap-2 border-t border-border/60 pt-3">
          <button
            onClick={onInfo}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 py-2 text-xs font-medium transition hover:bg-brand/10 hover:text-brand"
          >
            <Info className="h-3.5 w-3.5" /> Info
          </button>
          <button
            onClick={onEdit}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 py-2 text-xs font-medium transition hover:bg-brand/10 hover:text-brand"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
        </div>
      </div>
    </div>
  );
}

function AnalyticsRow({ a }: { a: BaseAnalytics }) {
  return (
    <div className="grid grid-cols-4 items-center gap-2 rounded-lg border border-border/60 bg-background/40 p-2">
      <MiniMetric icon={Eye} label="Views" value={short(a.views)} />
      <MiniMetric icon={ShoppingBag} label="Sales" value={short(a.sales)} />
      <MiniMetric icon={TrendingUp} label="Conv." value={`${a.conversion}%`} />
      <div className="flex h-8 items-center text-brand">
        <Sparkline data={a.trend} className="h-full w-full" />
      </div>
    </div>
  );
}

function MiniMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <div className="min-w-0">
        <div className="truncate text-[11px] font-semibold leading-tight">{value}</div>
        <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function TemplateCard({ t, onInfo, onEdit }: { t: Template; onInfo: () => void; onEdit: () => void }) {
  return (
    <CardShell
      cover={t.cover}
      status={t.status}
      category={t.category}
      icon={Layers}
      name={t.name}
      tagline={t.tagline}
      price={t.price}
      onInfo={onInfo}
      onEdit={onEdit}
      extras={<AnalyticsRow a={t.analytics} />}
      meta={
        <>
          <span className="inline-flex items-center gap-1">
            <Link2 className="h-3 w-3" /> {t.provisionEndpoint}
          </span>
          <span className="inline-flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> v{t.version}
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" /> {t.analytics.rating}
          </span>
        </>
      }
    />
  );
}

function DesignCard({ d, onInfo, onEdit }: { d: Design; onInfo: () => void; onEdit: () => void }) {
  return (
    <CardShell
      cover={d.cover}
      status={d.status}
      category={d.category}
      icon={Palette}
      name={d.name}
      tagline={d.tagline}
      price={d.price}
      onInfo={onInfo}
      onEdit={onEdit}
      extras={
        <>
          <div className="flex flex-wrap items-center gap-1">
            {d.formats.map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-background/40 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
              >
                <Code2 className="h-3 w-3" /> {f}
              </span>
            ))}
            {d.hasPromptCopy && (
              <span className="inline-flex items-center gap-1 rounded-md border border-brand/40 bg-brand/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand">
                <Sparkles className="h-3 w-3" /> Prompt
              </span>
            )}
          </div>
          <AnalyticsRow a={d.analytics} />
        </>
      }
      meta={
        <>
          <span className="inline-flex items-center gap-1">
            <Copy className="h-3 w-3" /> Copy-paste
          </span>
          <span className="inline-flex items-center gap-1">
            <Download className="h-3 w-3" /> ZIP
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" /> {d.analytics.rating}
          </span>
        </>
      }
    />
  );
}

function ServiceCard({ s, onInfo, onEdit }: { s: Service; onInfo: () => void; onEdit: () => void }) {
  return (
    <CardShell
      cover={s.cover}
      status={s.status}
      category={s.category}
      icon={Bot}
      name={s.name}
      tagline={s.tagline}
      price={s.price}
      priceSuffix="/mo from"
      onInfo={onInfo}
      onEdit={onEdit}
      extras={
        <>
          <div className="flex flex-wrap items-center gap-1">
            {s.integrations.slice(0, 3).map((i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-background/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                <Zap className="h-3 w-3" /> {i}
              </span>
            ))}
          </div>
          <AnalyticsRow a={s.analytics} />
        </>
      }
      meta={
        <>
          <span className="inline-flex items-center gap-1">
            <KeyRound className="h-3 w-3" /> {s.licenseFormat}
          </span>
          <span className="inline-flex items-center gap-1">
            <Globe className="h-3 w-3" /> {s.plans.length} plans
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" /> {s.analytics.rating}
          </span>
        </>
      }
    />
  );
}

/* --------------------------- Modals --------------------------- */

function ModalShell({
  title,
  subtitle,
  onClose,
  children,
  footer,
  wide,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl ${
          wide ? 'max-w-4xl' : 'max-w-2xl'
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div>
            <h3 className="font-display text-lg font-semibold tracking-tight">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="custom-scrollbar flex-1 overflow-y-auto p-5">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 border-t border-border bg-background/40 p-4">{footer}</div>}
      </div>
    </div>
  );
}

function findItem(type: SubTab, id: string) {
  if (type === 'templates') return TEMPLATES.find((x) => x.id === id);
  if (type === 'designs') return DESIGNS.find((x) => x.id === id);
  return SERVICES.find((x) => x.id === id);
}


function InfoPage({
  type,
  id,
  onBack,
  onEdit,
  onDeleted,
}: {
  type: SubTab;
  id: string;
  onBack: () => void;
  onEdit: () => void;
  onDeleted: () => void;
}) {
  const item = findItem(type, id);
  const [confirmDelete, setConfirmDelete] = useState(false);
  if (!item) return null;

  const typeLabel = type[0].toUpperCase() + type.slice(1, -1);
  const TypeIcon = type === 'templates' ? Layers : type === 'designs' ? Palette : Bot;

  return (
    <PageShell
      onBack={onBack}
      eyebrow={
        <>
          <Package className="h-3.5 w-3.5" /> Products
          <span className="text-muted-foreground/50">/</span>
          <span className="inline-flex items-center gap-1 text-brand">
            <TypeIcon className="h-3.5 w-3.5" /> {typeLabel}
          </span>
          <span className="text-muted-foreground/50">/</span>
          <StatusPill status={item.status} />
        </>
      }
      title={item.name}
      subtitle={item.tagline}
      actions={
        <>
          <button
            onClick={onEdit}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium transition hover:border-brand/50 hover:text-brand"
          >
            <Pencil className="h-4 w-4" /> Edit
          </button>
          <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-gradient px-4 text-sm font-medium text-white shadow-lg shadow-brand/20">
            <ExternalLink className="h-4 w-4" /> Open live
          </button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Analytics KPIs */}
        <div>
          <SectionLabel icon={Activity}>Performance</SectionLabel>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <KpiCard label="Revenue" value={money(item.analytics.revenue)} sub="Lifetime" icon={DollarSign} />
            <KpiCard label="Sales" value={String(item.analytics.sales)} sub={`${item.analytics.conversion}% conv.`} icon={ShoppingBag} />
            <KpiCard label="Views" value={short(item.analytics.views)} sub="Last 30 days" icon={Eye} />
            <KpiCard label="Rating" value={item.analytics.rating.toFixed(1)} sub={`${item.analytics.reviews} reviews`} icon={Star} />
          </div>
        </div>

        {/* Trend */}
        <div className="admin-card rounded-xl p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Sales trend</div>
              <div className="font-display text-lg font-semibold">Last 14 days</div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 text-emerald-500">
                <TrendingUp className="h-3.5 w-3.5" /> +12.4%
              </span>
            </div>
          </div>
          <div className="h-24 text-brand">
            <Sparkline data={item.analytics.trend} className="h-full w-full" />
          </div>
        </div>

        {/* Type-specific configuration */}
        {type === 'templates' && <TemplateInfo t={item as Template} />}
        {type === 'designs' && <DesignInfo d={item as Design} />}
        {type === 'services' && <ServiceInfo s={item as Service} />}

        {/* Secondary analytics */}
        <div>
          <SectionLabel icon={Activity}>Health</SectionLabel>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <KpiCard label="Active licenses" value={String(item.analytics.activeLicenses)} sub="Currently valid" icon={CheckCircle2} />
            <KpiCard label="Refunds" value={String(item.analytics.refunds)} sub={`${((item.analytics.refunds / (item.analytics.sales || 1)) * 100).toFixed(1)}% rate`} icon={Trash2} />
            <KpiCard label="Avg. order" value={money(item.analytics.revenue / (item.analytics.sales || 1))} sub="Per sale" icon={ShoppingBag} />
            <KpiCard label="Time on page" value={'3m 12s'} sub="Median" icon={Clock} />
          </div>
        </div>

        {/* Danger zone */}
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-destructive">
                <AlertTriangle className="h-3.5 w-3.5" /> Danger zone
              </div>
              <div className="mt-1 font-display text-base font-semibold">Delete this {typeLabel.toLowerCase()}</div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                This permanently removes <span className="font-medium text-foreground">{item.name}</span> and all its analytics. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setConfirmDelete(true)}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 text-sm font-medium text-destructive transition hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" /> Delete {typeLabel.toLowerCase()}
            </button>
          </div>
        </div>
      </div>

      {confirmDelete && (
        <ConfirmDialog
          title={`Delete ${item.name}?`}
          description={`This will permanently delete this ${typeLabel.toLowerCase()} and all associated analytics, licenses, and settings. This cannot be undone.`}
          confirmLabel={`Yes, delete ${typeLabel.toLowerCase()}`}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => {
            setConfirmDelete(false);
            onDeleted();
          }}
        />
      )}
    </PageShell>
  );
}

function ConfirmDialog({
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-start gap-3 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-base font-semibold tracking-tight">{title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border bg-background/40 p-4">
          <button
            onClick={onCancel}
            className="inline-flex h-9 items-center rounded-lg border border-border bg-background px-4 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-destructive px-4 text-sm font-medium text-destructive-foreground hover:opacity-90"
          >
            <Trash2 className="h-4 w-4" /> {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
      <Icon className="h-3.5 w-3.5 text-brand" /> {children}
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="admin-card p-3">
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="mt-1.5 font-display text-lg font-semibold leading-none">{value}</div>
      <div className="mt-1 text-[10px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function KVRow({ k, v, mono }: { k: string; v: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border/50 py-2 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-xs font-medium text-muted-foreground">{k}</div>
      <div className={`text-xs ${mono ? 'font-mono' : ''} text-foreground`}>{v}</div>
    </div>
  );
}

function TemplateInfo({ t }: { t: Template }) {
  return (
    <div>
      <SectionLabel icon={Link2}>Fulfillment / provisioning</SectionLabel>
      <p className="mt-2 text-xs text-muted-foreground">
        On purchase, NovaKit calls this template's backend. The response returns the URLs handed to the customer.
      </p>
      <div className="admin-card mt-3 rounded-xl p-4">
        <KVRow k="Backend base URL" v={t.backendEndpoint} mono />
        <KVRow k="Provision endpoint" v={<span>POST {t.provisionEndpoint}</span>} mono />
        <KVRow k="Admin URL key" v={t.adminUrlKey} mono />
        <KVRow k="Frontend URL key" v={t.frontendUrlKey} mono />
        <KVRow k="Webhook secret" v={t.webhookSecret} mono />
        <KVRow k="Version" v={`v${t.version}`} />
      </div>
    </div>
  );
}

function DesignInfo({ d }: { d: Design }) {
  return (
    <div>
      <SectionLabel icon={Code2}>Delivery formats</SectionLabel>
      <p className="mt-2 text-xs text-muted-foreground">
        Buyers can copy, download the ZIP with framework variants, or copy the AI prompt.
      </p>
      <div className="admin-card mt-3 rounded-xl p-4">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {d.formats.map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background/40 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
            >
              <Code2 className="h-3 w-3" /> {f}
            </span>
          ))}
          {d.hasPromptCopy && (
            <span className="inline-flex items-center gap-1 rounded-md border border-brand/40 bg-brand/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-brand">
              <Sparkles className="h-3 w-3" /> Prompt copy enabled
            </span>
          )}
        </div>
        <KVRow k="ZIP URL" v={d.zipUrl} mono />
        <KVRow k="Preview URL" v={d.previewUrl} mono />
        <KVRow k="AI prompt" v={<span className="line-clamp-2 max-w-md">{d.aiPrompt}</span>} />
      </div>
    </div>
  );
}

function ServiceInfo({ s }: { s: Service }) {
  return (
    <div className="space-y-5">
      <div>
        <SectionLabel icon={KeyRound}>Licensing & access</SectionLabel>
        <div className="admin-card mt-3 rounded-xl p-4">
          <KVRow k="Service login" v={s.loginUrl} mono />
          <KVRow k="License format" v={s.licenseFormat} mono />
          <KVRow k="Integrations" v={s.integrations.join(' · ')} />
        </div>
      </div>
      <div>
        <SectionLabel icon={DollarSign}>Subscription plans</SectionLabel>
        <div className="admin-card mt-3 divide-y divide-border rounded-xl">
          {s.plans.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3">
              <div>
                <div className="text-sm font-medium">{p.label}</div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{p.interval}</div>
              </div>
              <div className="font-display text-sm font-semibold text-brand">
                {money(p.price)}
                <span className="ml-0.5 text-[10px] font-normal text-muted-foreground">
                  /{p.interval === 'monthly' ? 'mo' : 'yr'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Edit Page --------------------------- */

function EditPage({
  type,
  id,
  onBack,
}: {
  type: SubTab;
  id: string | null;
  onBack: () => void;
}) {
  const existing = id ? findItem(type, id) : null;
  const typeLabel = type[0].toUpperCase() + type.slice(1, -1);
  const TypeIcon = type === 'templates' ? Layers : type === 'designs' ? Palette : Bot;
  const title = id ? `Edit ${typeLabel.toLowerCase()}` : `New ${typeLabel.toLowerCase()}`;
  const subtitle =
    type === 'templates'
      ? 'Configure fulfillment endpoints, licensing and metadata.'
      : type === 'designs'
        ? 'Set delivery formats, ZIP contents and AI prompt.'
        : 'Configure service access, license format and plans.';

  return (
    <PageShell
      onBack={onBack}
      eyebrow={
        <>
          <Package className="h-3.5 w-3.5" /> Products
          <span className="text-muted-foreground/50">/</span>
          <span className="inline-flex items-center gap-1 text-brand">
            <TypeIcon className="h-3.5 w-3.5" /> {typeLabel}
          </span>
          <span className="text-muted-foreground/50">/</span>
          <span>{id ? 'Edit' : 'New'}</span>
        </>
      }
      title={id ? (existing?.name ?? title) : title}
      subtitle={subtitle}
      actions={
        <>
          <button
            onClick={onBack}
            className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-4 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onBack}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-gradient px-4 text-sm font-medium text-white shadow-lg shadow-brand/20"
          >
            <CheckCircle2 className="h-4 w-4" /> Save changes
          </button>
        </>
      }
    >
      <div className="admin-card-static rounded-2xl p-5 sm:p-6">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" defaultValue={existing?.name ?? ''} placeholder="Product name" />
            <Field label="Category" defaultValue={existing?.category ?? ''} placeholder="e.g. Dashboard" />

            <Field label="Tagline" className="sm:col-span-2" defaultValue={existing?.tagline ?? ''} placeholder="One-line summary" />
            <Field label={type === 'services' ? 'Starting price ($/mo)' : 'Price ($)'} type="number" defaultValue={String(existing?.price ?? '')} />
            <SelectField label="Status" defaultValue={existing?.status ?? 'draft'} options={['live', 'draft', 'archived']} />
          </div>

          {type === 'templates' && existing && 'backendEndpoint' in existing && (
            <div>
              <SectionLabel icon={Link2}>Backend fulfillment</SectionLabel>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Field label="Backend base URL" defaultValue={existing.backendEndpoint} placeholder="https://api.example.com" />
                <Field label="Provision endpoint" defaultValue={existing.provisionEndpoint} placeholder="/v1/provision" />
                <Field label="Admin URL key" defaultValue={existing.adminUrlKey} placeholder="admin_url" />
                <Field label="Frontend URL key" defaultValue={existing.frontendUrlKey} placeholder="app_url" />
                <Field label="Webhook secret" defaultValue={existing.webhookSecret} className="sm:col-span-2" />
              </div>
            </div>
          )}

          {type === 'designs' && existing && 'formats' in existing && (
            <div className="space-y-4">
              <div>
                <SectionLabel icon={Code2}>Delivery formats</SectionLabel>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['html', 'react', 'next', 'vue', 'svelte', 'angular'].map((f) => {
                    const on = existing.formats.includes(f);
                    return (
                      <button
                        key={f}
                        type="button"
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
                          on
                            ? 'border-brand/40 bg-brand/10 text-brand'
                            : 'border-border bg-card text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="ZIP URL" defaultValue={existing.zipUrl} />
                <Field label="Preview URL" defaultValue={existing.previewUrl} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">AI prompt (copyable)</label>
                <textarea
                  defaultValue={existing.aiPrompt}
                  rows={3}
                  className="mt-1.5 w-full rounded-lg border border-border bg-card p-3 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </div>
          )}

          {type === 'services' && existing && 'plans' in existing && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Service login URL" defaultValue={existing.loginUrl} className="sm:col-span-2" />
                <Field label="License format" defaultValue={existing.licenseFormat} />
                <Field label="Integrations (comma sep)" defaultValue={existing.integrations.join(', ')} />
              </div>
              <div>
                <SectionLabel icon={DollarSign}>Plans</SectionLabel>
                <div className="admin-card-static mt-3 divide-y divide-border rounded-xl">
                  {existing.plans.map((p) => (
                    <div key={p.id} className="grid gap-2 p-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center">
                      <input
                        defaultValue={p.label}
                        className="h-9 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-brand/60"
                      />
                      <select
                        defaultValue={p.interval}
                        className="h-9 rounded-lg border border-border bg-card px-2 text-sm outline-none focus:border-brand/60"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                      <input
                        type="number"
                        defaultValue={p.price}
                        className="h-9 w-24 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-brand/60"
                      />
                      <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  <button className="inline-flex w-full items-center justify-center gap-1.5 p-3 text-xs font-medium text-brand hover:bg-brand/5">
                    <Plus className="h-3.5 w-3.5" /> Add plan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

function Field({
  label,
  className = '',
  ...props
}: {
  label: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <input
        {...props}
        className="mt-1.5 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
      />
    </div>
  );
}

function SelectField({
  label,
  options,
  defaultValue,
}: {
  label: string;
  options: string[];
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <select
        defaultValue={defaultValue}
        className="mt-1.5 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o[0].toUpperCase() + o.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

/* --------------------------- Category Modal --------------------------- */

function CategoryModal({
  type,
  categories,
  onAdd,
  onRemove,
  onClose,
}: {
  type: SubTab;
  categories: string[];
  onAdd: (name: string) => void;
  onRemove: (name: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const label = type[0].toUpperCase() + type.slice(1);

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setName('');
  };

  return (
    <ModalShell
      title={`${label} categories`}
      subtitle={`Organize your ${type} into categories. Buyers filter by these on the storefront.`}
      onClose={onClose}
      footer={
        <button
          onClick={onClose}
          className="inline-flex h-9 items-center rounded-lg border border-border bg-background px-4 text-sm"
        >
          Done
        </button>
      }
    >
      <div className="space-y-5">
        <div>
          <label className="text-xs font-medium text-muted-foreground">New category</label>
          <div className="mt-1.5 flex gap-2">
            <div className="relative flex-1">
              <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
                placeholder="e.g. Dashboard, Ecommerce, Messaging…"
                className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={!name.trim()}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-gradient px-4 text-sm font-medium text-white shadow-lg shadow-brand/20 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </div>

        <div>
          <SectionLabel icon={FolderPlus}>Existing ({categories.length})</SectionLabel>
          {categories.length === 0 ? (
            <div className="admin-card-static mt-3 rounded-xl p-6 text-center text-xs text-muted-foreground">
              No categories yet — add one above.
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((c) => (
                <span
                  key={c}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground"
                >
                  <Tag className="h-3 w-3 text-brand" />
                  {c}
                  <button
                    onClick={() => onRemove(c)}
                    className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition hover:bg-destructive/15 hover:text-destructive"
                    aria-label={`Remove ${c}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </ModalShell>
  );
}

export const __k = { UsersIcon };
