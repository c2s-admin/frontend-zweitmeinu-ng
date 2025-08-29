# Component Development

Build components Storybook-first with strong typing, tokens, and accessibility.

## Quickstart
- Install: `npm install`
- Develop: `npm run storybook` (components) and `npm run dev` (integration)
- Type generation: `npm run ts:generate-types`

## Conventions
- Components in `src/components` (PascalCase), hooks in `src/hooks` (`useX`).
- Styles via Tailwind; use tokens and theme utilities.
- Stories in `src/stories`; prefer scenario-focused examples.
- Accessibility: labels/aria/alt by default; keyboard interactions covered.

## Quality Checks
- Lint/types: `npm run lint` and `npm run type-check`
- Screenshots: `npm run screenshot` / `npm run screenshot:update`
- E2E: `npm run test:e2e`
- Accessibility: `npm run accessibility:full`
- Size budgets: `npm run size:healthcare`

## Contributing
- Keep props minimal, typed, and documented in Storybook.
- Add tests or stories for new states (error, disabled, keyboard).
- Run `npm run format` before pushing.

