import {
  LayoutDashboard,
  Sparkles,
  Rocket,
  Bot,
  Palette,
  ShoppingCart,
  Layers,
  Boxes,
  Wand2,
  Brush,
  PenTool,
  Figma,
  Component,
  Code2,
  LineChart,
  Users,
  Search,
  Zap,
  type LucideIcon,
} from 'lucide-react';

export type CatalogItem = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  price: number;
  priceUnit?: string;
  rating: number;
  reviews: number;
  tag?: string;
  icon: LucideIcon;
  desc: string;
  longDescription: string;
  themes: { name: string; colors: string[] }[];
  highlights: string[];
  deliverables: string[];
  bestFor: string[];
  lastUpdated: string;
};

// ------------------------------ TEMPLATES ------------------------------
export const TEMPLATES: CatalogItem[] = [
  {
    id: 't1',
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
      'A production-grade dashboard for data-heavy SaaS. 40+ screens, themable design system, realtime charts and battle-tested table patterns.',
    themes: [
      { name: 'Midnight Violet', colors: ['#0B0B14', '#6D28D9', '#A78BFA', '#E9D5FF'] },
      { name: 'Nordic Light', colors: ['#F8FAFC', '#0F172A', '#3B82F6', '#22D3EE'] },
    ],
    highlights: ['40+ screens', 'Realtime charts', 'Command palette', 'RBAC ready'],
    deliverables: ['Source code', 'Figma file', '6 months updates', 'Docs'],
    bestFor: ['SaaS analytics', 'Internal tools', 'Fintech'],
    lastUpdated: 'Jun 24, 2026',
  },
  {
    id: 't2',
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
      'Conversion-tuned marketing template with 20+ modular sections — heroes, pricing, testimonials, FAQ and more.',
    themes: [
      { name: 'Cobalt Night', colors: ['#0A0F1F', '#1E3A8A', '#60A5FA', '#DBEAFE'] },
      { name: 'Sunset Peach', colors: ['#FFF7ED', '#F97316', '#FB7185', '#111827'] },
    ],
    highlights: ['20+ sections', 'SEO-friendly', 'Animated heroes', 'MDX changelog'],
    deliverables: ['Source code', 'Figma file', '6 months updates'],
    bestFor: ['SaaS launches', 'Waitlists', 'Indie hackers'],
    lastUpdated: 'May 12, 2026',
  },
  {
    id: 't3',
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
      'The fastest way to launch a modern SaaS: auth, teams, subscriptions, metering, AI endpoints and a polished dashboard.',
    themes: [
      { name: 'Deep Space', colors: ['#050510', '#7C3AED', '#22D3EE', '#F5F3FF'] },
      { name: 'Paper White', colors: ['#FFFFFF', '#0F172A', '#7C3AED', '#F59E0B'] },
    ],
    highlights: ['Auth + teams', 'Stripe billing', 'AI Gateway ready', 'Typed RPC'],
    deliverables: ['Source code', 'Deployment guide', '12 months updates'],
    bestFor: ['AI startups', 'B2B SaaS', 'Platforms'],
    lastUpdated: 'Jul 02, 2026',
  },
  {
    id: 't4',
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
      'A polished chat interface for LLM products with streaming, tool calls, attachments, code blocks and thread history.',
    themes: [
      { name: 'Carbon', colors: ['#0A0A0A', '#171717', '#22C55E', '#F5F5F5'] },
      { name: 'Frost', colors: ['#F0F9FF', '#0EA5E9', '#0F172A', '#7DD3FC'] },
    ],
    highlights: ['Streaming', 'Tool calls', 'Attachments', 'Thread history'],
    deliverables: ['Source code', 'Prompt library', '6 months updates'],
    bestFor: ['AI copilots', 'Support bots', 'Research tools'],
    lastUpdated: 'Jun 30, 2026',
  },
  {
    id: 't5',
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
      'Modern storefront that plugs into any headless commerce backend. PLP, PDP, cart, checkout and account included.',
    themes: [
      { name: 'Cobalt', colors: ['#0F172A', '#2563EB', '#93C5FD', '#F8FAFC'] },
      { name: 'Sand', colors: ['#FDF6E3', '#111827', '#D97706', '#FBBF24'] },
    ],
    highlights: ['PLP + PDP', 'Cart + checkout', 'Wishlist', 'Guest checkout'],
    deliverables: ['Source code', 'Stripe wiring', '12 months updates'],
    bestFor: ['DTC brands', 'Hydrogen', 'Headless commerce'],
    lastUpdated: 'Jun 18, 2026',
  },
  {
    id: 't6',
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
      'Curated library of 300+ production-ready UI blocks — heroes, navbars, pricing, testimonials, footers and more.',
    themes: [
      { name: 'Neutral', colors: ['#FFFFFF', '#0A0A0A', '#525252', '#E5E5E5'] },
      { name: 'Brand Violet', colors: ['#0B0B14', '#7C3AED', '#C4B5FD', '#F5F3FF'] },
    ],
    highlights: ['300+ blocks', 'Typed & themable', 'Dark mode', 'Copy-paste'],
    deliverables: ['Block library', 'Figma source', 'Lifetime updates'],
    bestFor: ['Agencies', 'Design teams', 'Prototyping'],
    lastUpdated: 'Jul 05, 2026',
  },
];

// ------------------------------ DESIGN ------------------------------
export const DESIGNS: CatalogItem[] = [
  {
    id: 'd1',
    slug: 'aurora-design-system',
    name: 'Aurora Design System',
    tagline: 'Complete Figma design system with 2000+ components.',
    category: 'Design System',
    price: 129,
    rating: 4.9,
    reviews: 156,
    tag: 'Featured',
    icon: Figma,
    desc: 'Complete Figma design system with 2000+ components.',
    longDescription:
      'A meticulously crafted design system in Figma with 2000+ reusable components, semantic tokens, variants and auto-layout everywhere.',
    themes: [
      { name: 'Aurora Dark', colors: ['#0F0F1E', '#8B5CF6', '#EC4899', '#F5F3FF'] },
      { name: 'Aurora Light', colors: ['#FAFAFA', '#7C3AED', '#DB2777', '#111827'] },
    ],
    highlights: ['2000+ components', 'Semantic tokens', 'Auto-layout', 'Dark + light'],
    deliverables: ['Figma library', 'Token JSON', 'Style guide PDF'],
    bestFor: ['Design teams', 'Product design', 'Design ops'],
    lastUpdated: 'Jul 08, 2026',
  },
  {
    id: 'd2',
    slug: 'nova-ui-kit',
    name: 'Nova UI Kit',
    tagline: 'Minimal UI kit for modern web apps.',
    category: 'UI Kit',
    price: 49,
    rating: 4.8,
    reviews: 89,
    icon: Component,
    desc: 'Minimal UI kit for modern web apps.',
    longDescription:
      'A restrained, minimal UI kit for web apps. Forms, tables, modals, navigation — everything wired with variants and states.',
    themes: [
      { name: 'Slate', colors: ['#0F172A', '#334155', '#94A3B8', '#F1F5F9'] },
      { name: 'Warm', colors: ['#FEF3C7', '#92400E', '#F59E0B', '#78350F'] },
    ],
    highlights: ['Forms & inputs', 'Tables', 'Navigation', 'All states'],
    deliverables: ['Figma file', 'Sketch file', 'Icon set'],
    bestFor: ['Web apps', 'Startups', 'MVP builds'],
    lastUpdated: 'Jun 22, 2026',
  },
  {
    id: 'd3',
    slug: 'brand-kit-pro',
    name: 'Brand Kit Pro',
    tagline: 'Logo, palette & type system starter.',
    category: 'Branding',
    price: 39,
    rating: 4.7,
    reviews: 62,
    icon: Brush,
    desc: 'Logo, palette & type system starter.',
    longDescription:
      'A complete branding starter: logo templates, color palettes, type scales, business cards and social media templates.',
    themes: [
      { name: 'Editorial', colors: ['#FFFFFF', '#000000', '#DC2626', '#F3F4F6'] },
      { name: 'Playful', colors: ['#FDF2F8', '#EC4899', '#8B5CF6', '#1F2937'] },
    ],
    highlights: ['Logo variants', 'Color system', 'Type scale', 'Social templates'],
    deliverables: ['Figma + AI files', 'Brand guidelines', 'Print templates'],
    bestFor: ['New brands', 'Rebrands', 'Freelancers'],
    lastUpdated: 'May 30, 2026',
  },
  {
    id: 'd4',
    slug: 'iconpack-x',
    name: 'IconPack X',
    tagline: '1200 crafted icons across 6 styles.',
    category: 'Icons',
    price: 29,
    rating: 4.9,
    reviews: 174,
    tag: 'Bestseller',
    icon: PenTool,
    desc: '1200 crafted icons across 6 styles.',
    longDescription:
      'A comprehensive icon library with 1200 icons across outline, filled, duotone, and more. SVG, PNG and Figma components included.',
    themes: [
      { name: 'Line', colors: ['#111827', '#6B7280', '#D1D5DB', '#F9FAFB'] },
      { name: 'Duotone', colors: ['#7C3AED', '#C4B5FD', '#EDE9FE', '#1E1B4B'] },
    ],
    highlights: ['1200 icons', '6 styles', 'SVG + PNG', 'Figma library'],
    deliverables: ['Icon files', 'Figma library', 'Web font'],
    bestFor: ['Product design', 'Marketing', 'Documentation'],
    lastUpdated: 'Jun 15, 2026',
  },
  {
    id: 'd5',
    slug: 'motion-presets',
    name: 'Motion Presets',
    tagline: 'Ready-to-use Framer Motion animations.',
    category: 'Motion',
    price: 35,
    rating: 4.6,
    reviews: 41,
    icon: Wand2,
    desc: 'Ready-to-use Framer Motion animations.',
    longDescription:
      '60 hand-tuned animation presets for Framer Motion covering page transitions, hovers, list stagger, and scroll reveals.',
    themes: [
      { name: 'Neon', colors: ['#0F0F1E', '#00F5D4', '#F72585', '#F5F3FF'] },
      { name: 'Muted', colors: ['#FAFAFA', '#525252', '#A3A3A3', '#171717'] },
    ],
    highlights: ['60 presets', 'Copy-paste', 'TypeScript', 'Docs & demos'],
    deliverables: ['Code snippets', 'CodeSandbox demos', 'Docs site'],
    bestFor: ['Web apps', 'Portfolios', 'Marketing'],
    lastUpdated: 'Jul 01, 2026',
  },
  {
    id: 'd6',
    slug: 'landing-mockups',
    name: 'Landing Mockups',
    tagline: '40 device mockup scenes for launch shots.',
    category: 'Mockups',
    price: 25,
    rating: 4.7,
    reviews: 58,
    icon: Palette,
    desc: '40 device mockup scenes for launch shots.',
    longDescription:
      '40 stunning device mockup scenes — desktop, laptop, phone and tablet — perfect for launch shots and app store screenshots.',
    themes: [
      { name: 'Studio', colors: ['#F5F5F5', '#171717', '#EF4444', '#FEE2E2'] },
      { name: 'Gradient', colors: ['#312E81', '#7C3AED', '#EC4899', '#FDE68A'] },
    ],
    highlights: ['40 scenes', '4K resolution', 'Editable in Figma', 'Smart objects'],
    deliverables: ['PSD + Figma', 'Rendered PNGs'],
    bestFor: ['Launches', 'App store', 'Marketing'],
    lastUpdated: 'Jun 05, 2026',
  },
];

// ------------------------------ SERVICES ------------------------------
export const SERVICES: CatalogItem[] = [
  {
    id: 's1',
    slug: 'custom-web-development',
    name: 'Custom Web Development',
    tagline: 'Bespoke web apps built with modern stacks.',
    category: 'Development',
    price: 4500,
    priceUnit: 'starting at',
    rating: 4.9,
    reviews: 87,
    tag: 'Popular',
    icon: Code2,
    desc: 'Bespoke web apps built with modern stacks.',
    longDescription:
      'Full-stack web application builds tailored to your product. TypeScript, TanStack Start, Tailwind and cloud-native by default.',
    themes: [
      { name: 'Fast track', colors: ['#0F172A', '#3B82F6', '#22D3EE', '#F1F5F9'] },
      { name: 'Enterprise', colors: ['#111827', '#DC2626', '#F59E0B', '#F9FAFB'] },
    ],
    highlights: ['Discovery workshop', 'Sprint-based', 'Type-safe stack', 'Handoff docs'],
    deliverables: ['Source code', 'CI/CD pipeline', 'Docs', '30-day support'],
    bestFor: ['MVPs', 'Rebuilds', 'Feature sprints'],
    lastUpdated: 'Jul 10, 2026',
  },
  {
    id: 's2',
    slug: 'ux-audit',
    name: 'UX Audit',
    tagline: 'Heuristic review with prioritized fixes.',
    category: 'Design',
    price: 1200,
    priceUnit: 'flat',
    rating: 4.8,
    reviews: 54,
    icon: Search,
    desc: 'Heuristic review with prioritized fixes.',
    longDescription:
      'A rigorous UX audit of your product surfaced as a prioritized action list with annotated screens and quick-win fixes.',
    themes: [
      { name: 'Report', colors: ['#FFFFFF', '#111827', '#EF4444', '#F3F4F6'] },
      { name: 'Insights', colors: ['#0F172A', '#22D3EE', '#F59E0B', '#F1F5F9'] },
    ],
    highlights: ['Heuristic review', 'Annotated screens', 'Prioritised fixes', 'Readout call'],
    deliverables: ['Audit report PDF', 'Figma annotations', '60-min readout'],
    bestFor: ['Live products', 'Pre-launch', 'Growth teams'],
    lastUpdated: 'Jun 28, 2026',
  },
  {
    id: 's3',
    slug: 'brand-identity',
    name: 'Brand Identity',
    tagline: 'Logo, palette, type & brand guidelines.',
    category: 'Branding',
    price: 3500,
    priceUnit: 'starting at',
    rating: 4.9,
    reviews: 42,
    tag: 'New',
    icon: Brush,
    desc: 'Logo, palette, type & brand guidelines.',
    longDescription:
      'A complete brand identity system — from discovery to logo, palette, typography and a polished guidelines PDF.',
    themes: [
      { name: 'Bold', colors: ['#000000', '#FFFFFF', '#F97316', '#1F2937'] },
      { name: 'Warm', colors: ['#FEF3C7', '#7C2D12', '#DC2626', '#78350F'] },
    ],
    highlights: ['Discovery', '3 logo directions', 'Type system', 'Guidelines PDF'],
    deliverables: ['Logo files', 'Guidelines PDF', 'Templates'],
    bestFor: ['Startups', 'Rebrands', 'Product launches'],
    lastUpdated: 'Jun 12, 2026',
  },
  {
    id: 's4',
    slug: 'seo-optimization',
    name: 'SEO Optimization',
    tagline: 'Technical SEO + content strategy.',
    category: 'Marketing',
    price: 2200,
    priceUnit: 'flat',
    rating: 4.6,
    reviews: 33,
    icon: LineChart,
    desc: 'Technical SEO + content strategy.',
    longDescription:
      'Technical SEO audit, on-page fixes and a 90-day content roadmap tuned to your niche and target keywords.',
    themes: [
      { name: 'Growth', colors: ['#052E16', '#16A34A', '#86EFAC', '#F0FDF4'] },
      { name: 'Report', colors: ['#FFFFFF', '#0F172A', '#DC2626', '#F3F4F6'] },
    ],
    highlights: ['Technical audit', 'Keyword map', 'Content plan', 'Monthly review'],
    deliverables: ['SEO audit', 'Content calendar', 'Implementation guide'],
    bestFor: ['SaaS', 'Content sites', 'Ecommerce'],
    lastUpdated: 'Jun 20, 2026',
  },
  {
    id: 's5',
    slug: 'ai-integration',
    name: 'AI Integration',
    tagline: 'Ship LLM features into your product.',
    category: 'AI',
    price: 5500,
    priceUnit: 'starting at',
    rating: 4.9,
    reviews: 29,
    tag: 'Hot',
    icon: Bot,
    desc: 'Ship LLM features into your product.',
    longDescription:
      'From discovery to launch: model selection, prompt design, evals and production integration for AI features that matter.',
    themes: [
      { name: 'Neural', colors: ['#050510', '#7C3AED', '#22D3EE', '#F5F3FF'] },
      { name: 'Clean', colors: ['#FFFFFF', '#0F172A', '#3B82F6', '#DBEAFE'] },
    ],
    highlights: ['Model selection', 'Prompt design', 'Evals', 'Production wiring'],
    deliverables: ['Prototype', 'Production code', 'Evals suite'],
    bestFor: ['SaaS', 'Copilots', 'Support automation'],
    lastUpdated: 'Jul 06, 2026',
  },
  {
    id: 's6',
    slug: 'team-training',
    name: 'Team Training',
    tagline: 'Workshops on modern React & TypeScript.',
    category: 'Training',
    price: 1800,
    priceUnit: 'per day',
    rating: 4.8,
    reviews: 47,
    icon: Users,
    desc: 'Workshops on modern React & TypeScript.',
    longDescription:
      'Hands-on workshops for your engineering team covering React 19, TanStack, Tailwind v4 and modern testing practices.',
    themes: [
      { name: 'Workshop', colors: ['#F5F5F5', '#171717', '#EF4444', '#FEE2E2'] },
      { name: 'Deep dive', colors: ['#0F172A', '#F59E0B', '#F5F5F4', '#78350F'] },
    ],
    highlights: ['Hands-on labs', 'Custom curriculum', 'Recording', 'Follow-up Q&A'],
    deliverables: ['Course materials', 'Recordings', 'Take-home labs'],
    bestFor: ['Engineering teams', 'Onboarding', 'Upskilling'],
    lastUpdated: 'May 22, 2026',
  },
];

export function getTemplateBySlug(slug: string) {
  return TEMPLATES.find((t) => t.slug === slug);
}
export function getDesignBySlug(slug: string) {
  return DESIGNS.find((d) => d.slug === slug);
}
export function getServiceBySlug(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
export function getRelated(items: CatalogItem[], slug: string, category: string, limit = 3) {
  const same = items.filter((i) => i.slug !== slug && i.category === category);
  const rest = items.filter((i) => i.slug !== slug && i.category !== category);
  return [...same, ...rest].slice(0, limit);
}

export const CATALOG_ICON_ZAP = Zap;
export const CATALOG_ICON_LAYERS = Layers;
