import {
  LayoutDashboard,
  Sparkles,
  Rocket,
  Bot,
  Palette,
  ShoppingCart,
  Layers,
  Boxes,
  type LucideIcon,
} from 'lucide-react';

export type LicenseTier = {
  id: string;
  name: string;
  price: number;
  duration: string;
  seats: string;
  features: string[];
  highlight?: boolean;
};

export type ProductCategory =
  | 'Dashboard'
  | 'Marketing'
  | 'Full Stack'
  | 'AI'
  | 'Ecommerce'
  | 'Components';

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  price: number;
  rating: number;
  reviews: number;
  tag?: string;
  icon: LucideIcon;
  desc: string;
  longDescription: string;
  themes: { name: string; colors: string[] }[];
  highlights: string[];
  techStack: string[];
  pages: string[];
  licenses: LicenseTier[];
  gallery: { title: string; caption: string }[];
  bestFor: string[];
  lastUpdated: string;
  version: string;
};

const baseLicenses = (base: number): LicenseTier[] => [
  {
    id: 'personal',
    name: 'Personal',
    price: base,
    duration: 'Lifetime access · 6 months of updates',
    seats: '1 developer · 1 end product',
    features: [
      'Full source code',
      'Figma design file',
      '6 months of updates',
      'Community support',
    ],
  },
  {
    id: 'studio',
    name: 'Studio',
    price: base * 2 + 20,
    duration: 'Lifetime access · 12 months of updates',
    seats: 'Up to 5 developers · unlimited client projects',
    features: [
      'Everything in Personal',
      'Use in client work',
      '12 months of updates',
      'Priority email support',
      'Private Discord channel',
    ],
    highlight: true,
  },
  {
    id: 'team',
    name: 'Team & Extended',
    price: base * 4 + 60,
    duration: 'Lifetime access · 24 months of updates',
    seats: 'Unlimited developers · unlimited SaaS products',
    features: [
      'Everything in Studio',
      'Resell as part of SaaS',
      '24 months of updates',
      '1:1 onboarding call',
      'Custom branding removal',
    ],
  },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    slug: 'aurora-admin',
    name: 'Aurora Admin',
    tagline: 'Analytics-first admin panel with realtime charts.',
    category: 'Dashboard',
    price: 49,
    rating: 4.9,
    reviews: 218,
    tag: 'Bestseller',
    icon: LayoutDashboard,
    desc: 'Analytics-first admin panel with realtime charts.',
    longDescription:
      'Aurora Admin is a production-grade dashboard built for data-heavy SaaS products. It ships with 40+ meticulously crafted screens, a themable design system, realtime chart primitives, and battle-tested table patterns — so your team can focus on the metrics that matter, not the plumbing.',
    themes: [
      { name: 'Midnight Violet', colors: ['#0B0B14', '#6D28D9', '#A78BFA', '#E9D5FF'] },
      { name: 'Nordic Light', colors: ['#F8FAFC', '#0F172A', '#3B82F6', '#22D3EE'] },
      { name: 'Emerald Pro', colors: ['#062A22', '#059669', '#34D399', '#ECFDF5'] },
    ],
    highlights: [
      '40+ dashboard screens',
      'Realtime charts via Recharts',
      'Command palette & shortcuts',
      'Role-based access ready',
    ],
    techStack: ['React 19', 'TypeScript', 'Tailwind v4', 'TanStack Query', 'Recharts'],
    pages: ['Overview', 'Analytics', 'Customers', 'Billing', 'Team', 'Settings', 'Audit log'],
    licenses: baseLicenses(49),
    gallery: [
      { title: 'Overview', caption: 'KPIs, revenue trends and cohort snapshots at a glance.' },
      { title: 'Customers', caption: 'Segmented tables with saved filters and bulk actions.' },
      { title: 'Settings', caption: 'Team, billing, integrations, appearance and API keys.' },
    ],
    bestFor: ['SaaS analytics', 'Internal tools', 'Fintech dashboards'],
    lastUpdated: 'Jun 24, 2026',
    version: '3.2.0',
  },
  {
    id: '2',
    slug: 'zenith-landing',
    name: 'Zenith Landing',
    tagline: 'High-converting SaaS landing with 20+ sections.',
    category: 'Marketing',
    price: 29,
    rating: 4.8,
    reviews: 142,
    icon: Sparkles,
    desc: 'High-converting SaaS landing with 20+ sections.',
    longDescription:
      'Zenith is a conversion-tuned marketing template with 20+ modular sections — heroes, pricing, testimonials, FAQ, comparison tables and more. Copy, drop and ship a beautiful launch page in an afternoon.',
    themes: [
      { name: 'Cobalt Night', colors: ['#0A0F1F', '#1E3A8A', '#60A5FA', '#DBEAFE'] },
      { name: 'Sunset Peach', colors: ['#FFF7ED', '#F97316', '#FB7185', '#111827'] },
    ],
    highlights: [
      '20+ modular sections',
      'SEO-friendly semantic HTML',
      'Animated hero variants',
      'MDX-powered changelog',
    ],
    techStack: ['React 19', 'TanStack Start', 'Tailwind v4', 'Framer Motion'],
    pages: ['Home', 'Pricing', 'Changelog', 'Blog', 'Legal'],
    licenses: baseLicenses(29),
    gallery: [
      { title: 'Hero variants', caption: 'Six hero patterns — video, split, spotlight and more.' },
      { title: 'Pricing', caption: 'Toggleable annual / monthly with feature comparison.' },
      { title: 'Testimonials', caption: 'Marquee, grid and card layouts with logo clouds.' },
    ],
    bestFor: ['SaaS launches', 'Product waitlists', 'Indie hackers'],
    lastUpdated: 'May 12, 2026',
    version: '2.1.0',
  },
  {
    id: '3',
    slug: 'prism-saas',
    name: 'Prism SaaS',
    tagline: 'Complete SaaS starter with auth, billing & AI.',
    category: 'Full Stack',
    price: 89,
    rating: 4.9,
    reviews: 96,
    tag: 'New',
    icon: Rocket,
    desc: 'Complete SaaS starter with auth, billing & AI.',
    longDescription:
      'Prism is the fastest way to launch a modern SaaS. Auth, teams, subscriptions, usage-based billing, AI-ready endpoints and a polished dashboard — all wired together and typed end to end.',
    themes: [
      { name: 'Deep Space', colors: ['#050510', '#7C3AED', '#22D3EE', '#F5F3FF'] },
      { name: 'Paper White', colors: ['#FFFFFF', '#0F172A', '#7C3AED', '#F59E0B'] },
    ],
    highlights: [
      'Auth + teams + roles',
      'Stripe subscriptions & metering',
      'AI Gateway ready',
      'Typed server functions',
    ],
    techStack: ['TanStack Start', 'Lovable Cloud', 'Stripe', 'AI Gateway'],
    pages: ['Landing', 'App shell', 'Billing', 'Team', 'AI playground', 'Settings'],
    licenses: baseLicenses(89),
    gallery: [
      { title: 'App shell', caption: 'Sidebar navigation with workspace switcher.' },
      { title: 'Billing', caption: 'Plans, invoices and usage meters out of the box.' },
      { title: 'AI playground', caption: 'Streaming chat with tools and memory scaffolding.' },
    ],
    bestFor: ['AI startups', 'B2B SaaS', 'Internal platforms'],
    lastUpdated: 'Jul 02, 2026',
    version: '1.4.0',
  },
  {
    id: '4',
    slug: 'nimbus-ai-chat',
    name: 'Nimbus AI Chat',
    tagline: 'Streaming chat UI with tools & memory.',
    category: 'AI',
    price: 39,
    rating: 4.7,
    reviews: 74,
    icon: Bot,
    desc: 'Streaming chat UI with tools & memory.',
    longDescription:
      'A polished chat interface for LLM products. Message streaming, tool calls, attachments, code blocks with syntax highlighting, thread history and prompt templates — everything you need to launch an AI product.',
    themes: [
      { name: 'Carbon', colors: ['#0A0A0A', '#171717', '#22C55E', '#F5F5F5'] },
      { name: 'Frost', colors: ['#F0F9FF', '#0EA5E9', '#0F172A', '#7DD3FC'] },
    ],
    highlights: [
      'Streaming message rendering',
      'Tool call visualisation',
      'Attachments & code blocks',
      'Thread history & pinning',
    ],
    techStack: ['React 19', 'AI Gateway', 'TanStack Query', 'Tailwind v4'],
    pages: ['Chat', 'Thread history', 'Prompt library', 'Settings'],
    licenses: baseLicenses(39),
    gallery: [
      { title: 'Chat surface', caption: 'Streaming markdown with reasoning panels.' },
      { title: 'Prompt library', caption: 'Reusable prompt templates with variables.' },
      { title: 'Thread history', caption: 'Search, pin and organise long conversations.' },
    ],
    bestFor: ['AI copilots', 'Support bots', 'Research tools'],
    lastUpdated: 'Jun 30, 2026',
    version: '1.9.0',
  },
  {
    id: '5',
    slug: 'vertex-portfolio',
    name: 'Vertex Portfolio',
    tagline: 'Refined portfolio for designers & studios.',
    category: 'Marketing',
    price: 19,
    rating: 4.6,
    reviews: 51,
    icon: Palette,
    desc: 'Refined portfolio for designers & studios.',
    longDescription:
      'Vertex is an editorial portfolio template for independent designers and small studios. Case study layouts, project index, about and contact — presented with restraint and typographic elegance.',
    themes: [
      { name: 'Ivory', colors: ['#FAF9F6', '#111111', '#B45309', '#E5E7EB'] },
      { name: 'Obsidian', colors: ['#0B0B0B', '#F5F5F4', '#EAB308', '#27272A'] },
    ],
    highlights: [
      'Editorial case study layout',
      'MDX project entries',
      'Custom cursor & transitions',
      'Contact form ready',
    ],
    techStack: ['TanStack Start', 'MDX', 'Tailwind v4', 'Framer Motion'],
    pages: ['Home', 'Work', 'Case study', 'About', 'Contact'],
    licenses: baseLicenses(19),
    gallery: [
      { title: 'Case study', caption: 'Long-form layout with pull quotes and galleries.' },
      { title: 'Work index', caption: 'Filterable grid of projects with hover previews.' },
      { title: 'About', caption: 'Story, clients, awards and a warm contact CTA.' },
    ],
    bestFor: ['Designers', 'Illustrators', 'Small studios'],
    lastUpdated: 'Apr 08, 2026',
    version: '1.6.0',
  },
  {
    id: '6',
    slug: 'cobalt-commerce',
    name: 'Cobalt Commerce',
    tagline: 'Headless-ready storefront with cart & checkout.',
    category: 'Ecommerce',
    price: 59,
    rating: 4.8,
    reviews: 133,
    icon: ShoppingCart,
    desc: 'Headless-ready storefront with cart & checkout.',
    longDescription:
      'A modern storefront template that plugs into any headless commerce backend. Product listings, PDPs, cart, checkout and account — accessible, fast and ready to convert.',
    themes: [
      { name: 'Cobalt', colors: ['#0F172A', '#2563EB', '#93C5FD', '#F8FAFC'] },
      { name: 'Sand', colors: ['#FDF6E3', '#111827', '#D97706', '#FBBF24'] },
    ],
    highlights: [
      'PLP + PDP + cart + checkout',
      'Variant + inventory patterns',
      'Wishlist & recently viewed',
      'Guest & account checkout',
    ],
    techStack: ['TanStack Start', 'Stripe', 'Shopify-ready', 'Tailwind v4'],
    pages: ['Home', 'Catalog', 'Product', 'Cart', 'Checkout', 'Account'],
    licenses: baseLicenses(59),
    gallery: [
      { title: 'Product page', caption: 'Gallery, variants, reviews and cross-sells.' },
      { title: 'Cart', caption: 'Slide-over cart with upsells and discount codes.' },
      { title: 'Checkout', caption: 'Three-step checkout with address autocomplete.' },
    ],
    bestFor: ['DTC brands', 'Shopify Hydrogen', 'Headless commerce'],
    lastUpdated: 'Jun 18, 2026',
    version: '2.4.0',
  },
  {
    id: '7',
    slug: 'meridian-blog',
    name: 'Meridian Blog',
    tagline: 'Editorial-grade MDX blog with categories & search.',
    category: 'Marketing',
    price: 25,
    rating: 4.7,
    reviews: 68,
    icon: Layers,
    desc: 'Editorial-grade MDX blog with categories & search.',
    longDescription:
      'Meridian is a beautifully typeset publishing template. Categories, authors, search, RSS and reading progress — everything a modern editorial team needs to publish with taste.',
    themes: [
      { name: 'Newsprint', colors: ['#F7F5EF', '#111', '#B91C1C', '#374151'] },
      { name: 'Slate', colors: ['#0F172A', '#F1F5F9', '#38BDF8', '#334155'] },
    ],
    highlights: [
      'MDX with custom components',
      'Category & author pages',
      'Full-text search',
      'RSS + sitemap',
    ],
    techStack: ['TanStack Start', 'MDX', 'Fuse.js', 'Tailwind v4'],
    pages: ['Home', 'Article', 'Category', 'Author', 'Search'],
    licenses: baseLicenses(25),
    gallery: [
      { title: 'Article', caption: 'Typographic long-form with pull quotes and code.' },
      { title: 'Category', caption: 'Curated collections with featured articles.' },
      { title: 'Search', caption: 'Instant client-side search with keyboard nav.' },
    ],
    bestFor: ['Publications', 'Company blogs', 'Newsletters'],
    lastUpdated: 'May 28, 2026',
    version: '1.3.0',
  },
  {
    id: '8',
    slug: 'quanta-blocks',
    name: 'Quanta Blocks',
    tagline: '300+ copy-paste UI blocks & patterns.',
    category: 'Components',
    price: 79,
    rating: 5.0,
    reviews: 204,
    tag: 'Hot',
    icon: Boxes,
    desc: '300+ copy-paste UI blocks & patterns.',
    longDescription:
      'Quanta is a curated library of 300+ production-ready UI blocks — heroes, navbars, pricing, feature grids, testimonials, footers and more. Copy the JSX, paste into your project, ship.',
    themes: [
      { name: 'Neutral', colors: ['#FFFFFF', '#0A0A0A', '#525252', '#E5E5E5'] },
      { name: 'Brand Violet', colors: ['#0B0B14', '#7C3AED', '#C4B5FD', '#F5F3FF'] },
      { name: 'Ocean', colors: ['#F0F9FF', '#0369A1', '#0EA5E9', '#7DD3FC'] },
    ],
    highlights: [
      '300+ blocks & patterns',
      'Fully typed & themable',
      'Dark mode built in',
      'Copy-paste ergonomics',
    ],
    techStack: ['React 19', 'Tailwind v4', 'Radix UI', 'Lucide'],
    pages: ['Hero', 'Nav', 'Features', 'Pricing', 'Testimonials', 'Footer', '…and more'],
    licenses: baseLicenses(79),
    gallery: [
      { title: 'Hero library', caption: '24 hero variants covering every product shape.' },
      { title: 'Pricing tables', caption: 'Simple, tiered, comparison and usage-based.' },
      { title: 'Footers', caption: 'Compact, sitemap, newsletter and gradient variants.' },
    ],
    bestFor: ['Agencies', 'Design teams', 'Rapid prototyping'],
    lastUpdated: 'Jul 05, 2026',
    version: '4.0.0',
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getRelatedProducts(slug: string, category: ProductCategory, limit = 3): Product[] {
  const sameCat = PRODUCTS.filter((p) => p.slug !== slug && p.category === category);
  const rest = PRODUCTS.filter((p) => p.slug !== slug && p.category !== category);
  return [...sameCat, ...rest].slice(0, limit);
}
