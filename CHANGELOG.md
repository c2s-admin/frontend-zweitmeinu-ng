# Changelog

## v0.1.0 - 2025-08-29

### Added
- Comprehensive healthcare component library (Phase 2 & 3) with WCAG 2.1 AA.
- Monitoring and analytics system with performance metric endpoints.
- Storybook 9.1.1 with documentation overhaul; CI/Chromatic and bundle analysis workflows.
- Contact form security: validation, configurable captcha (incl. reCAPTCHA), and rate limiting.
- Strapi integration improvements: typed clients, retries/monitoring, env-driven endpoints, uploads path docs.
- `useSiteConfig` SWR hook and environment-specific structured logger.
- Motivation page integrated with the design system.
- Accessibility enhancements including enforced alt text rule.

### Fixed
- Storybook bundle analyzer and webpack conflicts.
- CI build issues (migrated from bun to npm; temporary TS/ESLint allowances).
- CORS handling and environment variable issues.
- Contact form field types and isolated vote request validation.
- CSS optimization/critters-related build errors.

### Changed
- Centralized design tokens; added security headers; general cleanup and memoization.
- Moved medical dictionary to `src/lib` and replaced `any` with explicit types.
- Cached site config in layout for performance.
- Sourced API endpoints from environment variables.

### Tests
- Integration test for contact messages.
- Coverage for FAQ vote rate limiting and validation.
- Analytics tests for recalculation and time range updates.

### Docs
- Updated README and architecture; added env examples.
- Sentry initialization notes and token source clarifications.
- Beasties installation and Strapi uploads path documentation.

### Chore/Build
- CI workflows and badges; TypeScript/ESLint adjustments.
- Size-limit and bundling configuration tweaks.

---

## 2025-08-04
### Added
- Enable `jsx-a11y/alt-text` ESLint rule to require alt text on images.

### Updated
- Sync README tech stack versions with current dependencies.
