# Product Requirements Document (PRD) - Frontend (NovaKit)

NovaKit Frontend is a high-performance Next.js 16 (App Router) web application designed for browsing, sharing, previewing, and purchasing digital designs, templates, and services. It interfaces exclusively with Next.js BFF (Backend For Frontend) API Route Handlers in `src/app/api/...`, which forward authenticated requests to the Express API backend.

---

## 1. Core Objectives & Architecture Principles
* **Framework**: Next.js 16 (App Router) with Turbopack and React 19.
* **BFF Proxy Pattern**: Direct calls from browser components to the Express backend (`http://localhost:5000/api/...`) are **strictly prohibited**. All UI components fetch and mutate data via RTK Query API slices targeting Next.js API route handlers in `src/app/api/...`. The BFF retrieves the user session (`getServerSession(authOptions)`), attaches `Authorization: Bearer <accessToken>`, and proxies requests.
* **Feature-Based API Isolation**: Every domain entity (e.g. `template`, `design`, `service`, `faq`, `testimonial`, `landing`, `language`, `profile`, `auth`, `order`, `plan`) MUST have its own isolated RTK Query slice (`templateApi.ts`, `designApi.ts`, `serviceApi.ts`, `faqApi.ts`, `testimonialApi.ts`, `pageApi.ts`, etc.).
* **Explicit Action Subpaths (No `/catalog` Prefix)**: Domain entity routes use explicit, self-documenting action paths (e.g. `/templates`, `/designs`, `/services`, `/admin/templates/create`, `/admin/templates/edit/[id]`).

---

## 2. Target Modules & Responsibilities

### A. Public Marketplace Pages
* **Templates (`/templates`, `/templates/[slug]`)**: High-converting web templates with live interactive code sandboxes (`@codesandbox/sandpack-react`).
* **Designs (`/designs`, `/designs/[slug]`)**: Figma design kits, icon packages, and brand assets.
* **Services (`/services`, `/services/[slug]`)**: Customized web development, SEO, and automation services.
* **Dynamic Custom Pages (`/page/[slug]`)**: Content pages managed via Admin Page Management (e.g., terms, privacy policy).

### B. User Dashboard & Orders
* **Purchases & Downloads (`/profile`)**: User account details, invoice downloads, purchased licenses, and security settings.
* **Order History (`/orders`, `/orders/[id]`)**: Listing of user transactions and item status.

### C. Admin Administration Panel
* **Entity Management Dashboards**:
  * `/admin/templates` — CRUD management for template listings.
  * `/admin/designs` — CRUD management for design assets.
  * `/admin/services` — CRUD management for service listings.
  * `/admin/faqs` — Drag-and-drop order and category management for FAQs.
  * `/admin/testimonials` — Customer review management.
  * `/admin/pages` — Custom page builder and slug management.
  * `/admin/users` — Account management, roles, and spend metrics.
  * `/admin/plans` — Subscription plan feature configuration.

### D. Centralized Route Protection & Layout
* **Next.js 16 Proxy Middleware (`src/proxy.ts`)**: Intercepts requests using `next-auth/jwt` session tokens. Redirects unauthenticated users to `/auth/login` with `callbackUrl`, redirects non-admin users away from `/admin/*`, and handles role-based redirects.
* **Layout Directory (`src/layout/`)**: Root-level layout components (`SiteHeader.tsx`, `SiteFooter.tsx`, `Logo.tsx`, `ThemeToggle.tsx`, `AuthShell.tsx`, `AnnouncementMarquee.tsx`, `AnnouncementPopup.tsx`).
