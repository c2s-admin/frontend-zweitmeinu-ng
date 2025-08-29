# Quality & CI

Unified reference for visual tests, accessibility, performance budgets, and analytics.

## Local/CI Commands
- Verify CI set: `npm run ci:verify`
- Screenshots (Playwright): `npm run screenshot`, update: `npm run screenshot:update`
- E2E tests: `npm run test:e2e`
- Accessibility: `npm run accessibility:full` (CI subset: `npm run accessibility:ci`)
- Size budgets: `npm run size:healthcare` (why: `npm run size:analyze`)
- Storybook builds: `npm run storybook`, `npm run build-storybook`, analyze: `npm run storybook:analyze`
- Analytics wiring: `npm run analytics:validate`

## Guidance
- Visual: keep stable stories; update snapshots deliberately and review diffs.
- A11y: fail fast on violations; fix labels/roles/contrast before merging.
- Performance: investigate budget regressions; prefer code splitting and token reuse.
- Analytics: avoid PII; use event helpers and env-gated providers.

