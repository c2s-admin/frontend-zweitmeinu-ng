# Beasties Installation Task

The Next.js build fails because required CSS optimization packages cannot be resolved.

## Goal
Ensure the `beasties` optimizer (or a compatible alternative such as `critters`) is available so that the build can inline critical CSS.

## Steps
1. Investigate the 403 error when running `bun install`. Check network/firewall settings or npm credentials on the server.
2. Install `beasties@^0.1.0` (or ensure `critters` is installed if `beasties` remains unavailable).
3. Run:
   - `bun install`
   - `bun run build`
4. Confirm that the build completes successfully and critical CSS is inlined.

Report the findings and any remaining issues.
