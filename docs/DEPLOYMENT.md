# Deployment

Preferred: deploy Storybook static build for documentation; Next.js app deploys follow standard host practices.

## Storybook (UI Docs)
1) Build: `npm run build-storybook` → `storybook-static/`
2) Deploy options:
- Netlify: see `netlify.toml` (serve `storybook-static`)
- Vercel: static build from `storybook-static`
- GitHub Pages: publish `storybook-static` folder

## Next.js App
- Build: `npm run build`
- Start: `npm start` (ensure env vars in `.env.local`)

## Notes
- Keep CSP strict; avoid `'unsafe-eval'/'unsafe-inline'` where possible.
- Use environment-gated analytics and Sentry.

## Self-hosting (outline)
- Serve `storybook-static` behind HTTPS; enable long cache for static assets.
- Apply security headers (HSTS, X-Content-Type-Options, Referrer-Policy).

