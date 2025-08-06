# Storybook & Design Tokens Playbook

## Goal
Establish a Storybook-powered UI catalog backed by shared design tokens to ensure consistent styling across all section components.

## Steps
1. **Component Inventory**
   - List all section components (e.g., `HeroSection`, `CTASection`, `TeamSection`).
   - Note props and variants that should be demonstrated in stories.
2. **Define Design Tokens**
   - Maintain `tokens.json` as the **single source of truth** for all design tokens (colors, typography, spacing, breakpoints, z-index, etc.).
   - Reflect every token from `tokens.json` in `src/styles/tokens.css` as a corresponding CSS variable; never introduce tokens directly in `tokens.css`.
   - Update **both files together** whenever tokens are added or changed to prevent drift between the JSON source and the CSS variables.
   - Hook tokens into `tailwind.config.ts` so Tailwind utilities reference the shared values.
3. **Set Up Storybook**
   - Run `npx storybook@latest init` using the Next.js framework.
   - Add scripts `storybook` and `build-storybook` to `package.json`.
   - Load global styles in `.storybook/preview.ts` (import Tailwind and `tokens.css`).
   - Install and register recommended addons: `@storybook/addon-essentials`, `@storybook/addon-a11y`, `@storybook/addon-interactions`.
4. **Document Design Tokens**
   - Create an MDX or Docs page in Storybook that lists all tokens and their values.
   - Optionally use `@storybook/addon-styling` or a custom React component to render a token gallery.
5. **Author Component Stories**
   - For each section component, create a CSF story file (e.g., `HeroSection.stories.tsx`).
   - Showcase default, filled, and dark/light variants using mock data.
6. **Quality Assurance**
   - Run `npm test` and `npm run lint` to verify code quality.
   - Enable accessibility checks via the a11y addon; optionally add visual regression tests with `@storybook/test-runner`.
7. **Continuous Integration**
   - Extend CI to run `npm run build-storybook` on each pull request.
   - Publish the static Storybook to a hosting service (e.g., Netlify, GitHub Pages, Vercel) for review.
8. **Governance & Maintenance**
   - Document naming conventions for tokens and stories.
   - Require that new components include Storybook stories and adhere to existing tokens.
   - When modifying tokens, update `tokens.json` **and** `src/styles/tokens.css` in the same commit to keep the system in sync and avoid mismatched styles.

## Outcome
A living UI catalog that documents all section components and enforces a single source of truth for design tokens, improving visual consistency and developer productivity.
