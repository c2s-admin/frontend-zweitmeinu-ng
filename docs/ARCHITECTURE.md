# Architekturübersicht

Diese Dokumentation bietet einen schnellen Überblick über die wichtigsten Bestandteile des Systems und deren Zusammenspiel.

## Systemübersicht
```mermaid
graph TD
    U[User] -->|HTTP| F[Next.js Frontend]
    F -->|REST| S[Strapi CMS]
    F -->|Cache| R[(Redis)]
    F -->|Logs| L[Logging Service]
    F -->|Components| SB[Storybook Design System]
    S -->|Cache| R
    S -->|Logs| L
    SB -->|Development| F
```

## Component Architecture
```mermaid
graph LR
    SB[Storybook 9.1.1] -->|Healthcare Components| F[Next.js App]
    SB -->|Design System| DS[Healthcare Design Tokens]
    SB -->|A11y Testing| A11Y[WCAG 2.1 AA]
    F -->|58+ Section Types| SEC[Dynamic Sections]
    DS -->|Colors/Typography| F
```

## Request Flow
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant R as Redis
    participant S as Strapi
    participant L as Logger

    U->>F: Request page
    F->>R: Cache lookup
    R-->>F: Miss
    F->>S: Fetch content
    S-->>F: Response
    F->>R: Store in cache
    F->>L: Emit log
    F-->>U: Rendered page
```

## Development Architecture

### Frontend Stack
- **Next.js 15.4.6** - React framework with App Router
- **TypeScript 5.5.4** - Type safety and developer experience  
- **Tailwind CSS 3.4.10** - Utility-first styling with healthcare tokens
- **Storybook 9.1.1** - Component development and design system
- **Bun 1.1.26** - Fast package manager and runtime

### Component Development Flow
```mermaid
sequenceDiagram
    participant D as Developer
    participant SB as Storybook
    participant A11Y as A11y Addon
    participant CI as GitHub Actions
    participant P as Production

    D->>SB: Develop Component
    SB->>A11Y: Run Accessibility Tests
    A11Y-->>SB: WCAG 2.1 AA Validation
    D->>CI: Commit & Push
    CI->>CI: Build Storybook
    CI->>CI: Run Tests & Lint
    CI-->>P: Deploy if Successful
```

### Healthcare Design System
- **Color Palette**: Medical-grade trust colors (#004166, #1278B3, #B3AF09)
- **Typography**: Roboto Condensed for healthcare readability
- **Components**: WCAG 2.1 AA compliant with 56px+ touch targets
- **Accessibility**: Screen reader optimized, high contrast support

---

*Zuletzt aktualisiert: 2025-08-06 - Storybook Integration*

