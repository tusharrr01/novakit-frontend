# Frontend Development Rules & Standards - NovaKit

Follow these strict guidelines when adding or modifying frontend components, pages, hooks, or API slices.

---

## 1. BFF (Backend For Frontend) & API Architecture Rules
* **BFF Proxy Pattern**: ALL data fetching and mutation requests originating from frontend UI pages/components MUST pass through RTK Query API slices to Next.js API Route Handlers in `src/app/api/...`. Direct browser fetch calls to Express API (`http://localhost:5000/api/...`) are strictly prohibited.
* **Feature-Based API Isolation**:
  * Every domain entity MUST have its own dedicated RTK Query API slice in `src/redux/api/` (e.g. `templateApi.ts`, `designApi.ts`, `serviceApi.ts`, `faqApi.ts`, `testimonialApi.ts`, `pageApi.ts`, `userApi.ts`, `orderApi.ts`, `authApi.ts`).
  * Do NOT create consolidated API slices like `catalogApi` or `adminApi`.
* **Explicit Action Subpaths (No `/catalog` Prefix)**:
  * Do NOT use `/catalog` routes.
  * Use explicit action subpaths for admin endpoints:
    * List: `GET /api/<entity>`
    * Single: `GET /api/<entity>/[slug]`
    * Create: `POST /api/<entity>/create`
    * Edit: `PUT /api/<entity>/edit/[id]`
    * Delete: `DELETE /api/<entity>/delete/[id]`

---

## 2. Naming Conventions & Folder Organization
* **Entity Components Folder Structure**:
  * All feature-specific components MUST reside in a subfolder named after the entity inside `src/components/{entity_name}/` (e.g. `src/components/template/`, `src/components/design/`, `src/components/service/`, `src/components/faq/`, `src/components/testimonial/`, `src/components/user/`, `src/components/plan/`, `src/components/order/`, `src/components/page_management/`).
* **Entity Utility Files**:
  * Common domain utility functions MUST be placed in `src/utils/{entity_name}.ts` (e.g. `src/utils/template.ts`, `src/utils/faq.ts`, `src/utils/testimonial.ts`).
* **Root Layout Directory**:
  * Main site layout shells (`SiteHeader.tsx`, `SiteFooter.tsx`, `Logo.tsx`, `ThemeToggle.tsx`, `AuthShell.tsx`, `AnnouncementMarquee.tsx`, `AnnouncementPopup.tsx`) MUST reside in `src/layout/` (NOT in `src/components/layout/`).
* **Reusable Shared Components**:
  * Generic UI components MUST reside in `src/components/shared/` (`DataTable.tsx`, `CommonHeader.tsx`, `ConfirmModal.tsx`, `Pagination.tsx`, `ExportModal.tsx`) and `src/components/shared/form-fields/` (`TextInput.tsx`, `TextAreaField.tsx`, `SelectField.tsx`).
* **Shadcn UI Elements**:
  * Low-level primitives reside in `src/elements/ui/` (`dialog.tsx`, `button.tsx`, `input.tsx`, etc.).

---

## 3. Route Protection & Proxy Middleware
* **Next.js 16 Proxy Middleware (`src/proxy.ts`)**:
  * Route protection MUST be defined in `src/proxy.ts` using `next-auth/jwt` session tokens.
  * Role keys are **case-insensitive** (normalized to lowercase `'admin'`).
  * Unauthenticated users accessing `/admin/*`, `/profile`, or `/orders/*` are redirected to `/auth/login?callbackUrl=...`.
  * Non-admin users accessing `/admin/*` are redirected to `/`.
  * Authenticated users accessing `/auth/*` are redirected to `callbackUrl` if present, `/admin` if Admin, or `/` otherwise.

---

## 4. UI Aesthetics & Shared Patterns
* **Use Shared Components**: ALWAYS use `DataTable` for data grids, `CommonHeader` for page headers, `ConfirmModal` for deletion dialogs, `Pagination` for page navigation, and `ExportModal` for CSV/Excel/PDF exports.
* **Formik & Yup**: All forms must be built using Formik and validated with Yup schemas.
* **sonner Toast Notifications**: Use `toast.success()` and `toast.error()` from `sonner`.
* **CSS Variables**: Use CSS design tokens (`text-primary`, `bg-background`, `border-border`). Avoid hardcoded colors like `text-blue-500`.
