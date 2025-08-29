# Design System (Healthcare)

Principles and references for the UI system. Details live in Storybook and tokens.

## Principles
- Trust & clarity: calm colors, clear hierarchy, medical tone.
- Accessibility first: WCAG 2.1 AA defaults; larger targets for healthcare.
- Consistency: shared tokens, components, and patterns across pages.

## Tokens & Sources of Truth
- Design tokens: `tokens.json`
- Tailwind theme: `tailwind.config.ts`
- Component docs: Storybook (`npm run storybook`)

## Color & Typography
- Colors: derive from tokens; do not hardcode hex values in components.
- Contrast: follow Accessibility guide thresholds.
- Typography: use configured font stack from Tailwind/theme.

## Components
- Build and document in Storybook first.
- Co-locate stories and keep props accessible by default (labels, aria, alt).
- Reuse utilities from `src/components` and `src/lib`.

## Do/Don’t
- Do: prefer semantic HTML, Tailwind utilities, tokenized values.
- Don’t: duplicate styles or redefine tokens per component.

