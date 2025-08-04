# Beasties Installation Task

The Next.js build currently fails during prerendering with
`Cannot find module 'critters'` because the experimental
`optimizeCss.beasties` option is enabled but the `beasties`
dependency could not be installed. The `bun install` step reports a
403 (forbidden) when fetching `beasties` from the registry.

## Goal
Restore a successful build with critical CSS inlining.

## Steps
1. Investigate the HTTP 403 from `bun install`:
   - Validate npm authentication tokens and registry URL.
   - Check company firewall/proxy rules and allow access to the
     registry hosting `beasties`.
   - Retry `bun install` after addressing network or credentials.
2. If installation succeeds, run `bun run build` to ensure the build
   completes.
3. If `beasties` remains inaccessible:
   - Temporarily install `critters` and disable the `beasties` flag in
     `next.config.js`, **or**
   - Remove `optimizeCss` configuration to fall back to the default
     optimizer.
   - After the change, run `bun run build` to verify the build passes.
4. Document the outcome of the above steps.

Always finish by running `bun run build` so the team knows whether the
real point of failure has been resolved.
