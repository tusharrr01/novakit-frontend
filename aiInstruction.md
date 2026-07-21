# AI Agent Guidelines - Frontend Workflows

All AI agents working on the NovaKit frontend codebase must strictly follow these operational procedures and validation steps.

---

## 1. Task Execution Protocol
1. **Review Rules & PRD**: Read `frontend/rule.md` and `frontend/prd.md` to ensure your plan adheres to BFF proxy flow, RTK Query slice isolation, and component naming conventions.
2. **Implementation Plan**: Formulate your plan in `implementation_plan.md` specifying:
   * Affected files (use `[NEW]`, `[MODIFY]`, `[DELETE]`).
   * RTK Query API slice updates in `src/redux/api/`.
   * BFF route handler updates in `src/app/api/`.
   * Component creations in `src/components/{entity_name}/` or `src/components/shared/`.
   * Wait for user approval before making changes.
3. **Execution**: Implement changes ensuring all user-facing text uses i18n (`t()`) and styling adheres to project CSS variables.

---

## 2. Validation & Quality Checklist
Before completing your task:
1. **Compilation Check**: Run `npm run build` in `frontend/` to verify that Next.js App Router, Turbopack, and TypeScript compilation pass with zero errors.
2. **Hydration Warning Guard**: Ensure `suppressHydrationWarning` is present on `<html>` and `<body>` tags in `src/app/layout.tsx`. Ensure client components match server-rendered markup before hydration.
3. **Documentation**: Update `walkthrough.md` with file links (`[basename](file:///path)`) and details of changes.
