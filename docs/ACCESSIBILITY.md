# Accessibility Guidelines (WCAG 2.1 AA)

Goal: Ensure patient‑safe, accessible UI across all components and pages.

## Checklist
- Contrast: 4.5:1 for text, 3:1 for large text/icons; 7:1 for emergency UI.
- Touch targets: ≥44px (standard), ≥56px (healthcare), ≥64px (emergency).
- Keyboard: Tab order, Escape/Enter/Space support; no keyboard traps.
- Focus: Always visible focus styles; maintain logical focus after actions.
- Motion: Respect reduced motion; avoid flashing content.
- Semantics: Proper landmarks, headings, labels, roles; no empty links/buttons.
- Images/media: Alt text required; captions/transcripts for media.
- Forms: Associated labels, clear errors, instructions; accessible validation.
- Language: `lang` set; avoid medical jargon without explanation.

## Project Rules
- Enforce alt text (see ESLint rules) and accessible names on interactive elements.
- Emergency components must meet higher thresholds (contrast/touch/latency targets).
- Prefer semantic HTML; ARIA only when necessary.

## Verification
- Local: `npm run accessibility:full`
- CI/A11y subset: `npm run accessibility:ci`
- Emergency focus: `npm run accessibility:emergency`
- WCAG scripts: `npm run wcag`, `npm run wcag:storybook`

## References
- Storybook a11y demos: run `npm run storybook` and open component stories with a11y panel.
- Tokens and styles: `tokens.json`, `tailwind.config.ts`.

