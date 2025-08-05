# Architekturübersicht

Diese Dokumentation bietet einen schnellen Überblick über die wichtigsten Bestandteile des Systems und deren Zusammenspiel.

## Systemübersicht
```mermaid
graph TD
    U[User] -->|HTTP| F[Next.js Frontend]
    F -->|REST| S[Strapi CMS]
    F -->|Cache| R[(Redis)]
    F -->|Logs| L[Logging Service]
    S -->|Cache| R
    S -->|Logs| L
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

---

*Zuletzt aktualisiert: 2025-08-05*

