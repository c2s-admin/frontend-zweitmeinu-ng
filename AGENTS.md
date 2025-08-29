# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: Next.js App Router pages, layouts, and routes.
- `src/components`: Reusable React components (PascalCase files/folders).
- `src/lib`: Utilities (performance, analytics, helpers).
- `src/hooks`: Custom hooks (files start with `use*`).
- `src/types`: Shared types; generated API types in `src/types/generated`.
- `src/stories`: Storybook stories and examples.
- `public`: Static assets.
- `tests`: Playwright e2e/visual tests and helpers.
- `accessibility`, `performance`, `analytics`: QA and CI scripts.
- `.storybook`: Storybook configuration.

## Build, Test, and Development Commands
- `npm run dev`: Start Next.js locally with Turbopack.
- `npm run build` / `npm start`: Production build and serve.
- `npm run lint`: TypeScript compile checks + ESLint (Next + TS rules).
- `npm run format`: Format and organize imports via Biome.
- `npm run storybook` / `npm run build-storybook`: UI docs/dev and static build.
- `npm run test:e2e`: Playwright suite (starts app + Storybook via webServer).
- `npm run screenshot` / `npm run screenshot:update`: Visual regression tests.
- `npm run accessibility:full`: Axe + WCAG validation and report.
- `npm run size` / `npm run size:healthcare`: Bundle size budgets.
- `npm run analytics:validate`: Validate analytics wiring/events.

## Coding Style & Naming Conventions
- TypeScript-first. Use spaces, consistent imports, and Biome formatting.
- React components: PascalCase (`src/components/Card.tsx`). Hooks: `useX` in `src/hooks`.
- Modules/utilities: kebab-case (`src/lib/network-utils.ts`). Types: PascalCase.
- TailwindCSS for styling; prefer utility classes and co-locate component styles.

## Testing Guidelines
- Framework: Playwright (`tests/*.spec.ts`). Projects cover mobile, tablet, desktop, and accessibility.
- Snapshots: update deliberately with `npm run screenshot:update`; review diffs.
- API/integration examples: see `tests/contact-api.spec.ts`.
- Prefer Storybook stories (`*.stories.tsx` in `src/stories`) for component scenarios.

## Commit & Pull Request Guidelines
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
- Before opening a PR: run `npm run lint` and `npm run format` and ensure Playwright/Storybook are green.
- PRs should include: clear description, linked issues, screenshots (mobile + desktop), Storybook URL (if UI), and test plan. Note accessibility/size impacts when relevant.

## Security & Configuration Tips
- Never commit secrets. Use `.env.local`; mirror keys in `.env.example`.
- Sentry/analytics are env-gated; enable only per environment.
- When backend schemas change, regenerate types: `npm run ts:generate-types`.
