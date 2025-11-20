# Fehlende Seiten - Übersicht

Stand: 20.11.2025

## ✅ Vorhandene Seiten (7)

1. **Homepage** (`/`) ✅
2. **FAQ** (`/faq`) ✅
3. **Motivation** (`/motivation`) ✅
4. **Impressum** (`/impressum`) ✅ *Erstellt am 20.11.2025*
5. **Fachbereich Kardiologie** (`/fachbereiche/kardiologie`) ✅
6. **Fachbereich Onkologie** (`/fachbereiche/onkologie`) ✅
7. **Fachbereich Intensivmedizin** (`/fachbereiche/intensivmedizin`) ✅

---

## 🔴 Fehlende Seiten nach Priorität

### **P0 - Rechtlich Erforderlich (DRINGEND)**

Diese Seiten sind rechtlich zwingend erforderlich nach TMG/DSGVO:

| Seite | Route | Status | Begründung |
|-------|-------|--------|------------|
| **Datenschutzerklärung** | `/datenschutz` | ❌ Fehlt | DSGVO-Pflicht, wird im Impressum verlinkt |
| **AGB** | `/agb` | ❌ Fehlt | Geschäftsbedingungen, wird im Impressum verlinkt |
| **Cookie-Policy** | `/cookie-richtlinie` | ❌ Fehlt | DSGVO-Pflicht für Cookie-Verwendung |

**Rechtliche Konsequenzen bei Fehlen:**
- Abmahnungen möglich
- Bußgelder bis zu 20 Mio. EUR oder 4% des Jahresumsatzes (DSGVO)
- Unterlassungsansprüche von Wettbewerbern

---

### **P1 - Navigation/Header-Links (HOCH)**

Diese Seiten werden in der Hauptnavigation verlinkt und sind für die User Experience kritisch:

| Seite | Route | Status | Sichtbar in |
|-------|-------|--------|-------------|
| **So funktioniert's** | `/so-funktionierts` | ❌ Fehlt | Header-Navigation |
| **Über uns** | `/ueber-uns` | ❌ Fehlt | Header-Navigation |
| **Kontakt** | `/kontakt` | ❌ Fehlt | Header-Navigation, Footer, Impressum |
| **Notfall** | `/notfall` | ❌ Fehlt | CTA-Button im Header |

**User Impact:**
- Broken Links in Navigation führen zu 404-Fehlern
- Nutzer können wichtige Informationen nicht finden
- Negative Auswirkung auf SEO und Conversion Rate

---

### **P2 - Fachbereiche (MITTEL)**

Weitere medizinische Fachbereiche laut CLAUDE.md (7 Fachbereiche total):

| Fachbereich | Route | Status | Theme Color |
|-------------|-------|--------|-------------|
| **Gallenblase** | `/fachbereiche/gallenblase` | ❌ Fehlt | Yellow (#f59e0b) |
| **Nephrologie** | `/fachbereiche/nephrologie` | ❌ Fehlt | Blue (#3b82f6) |
| **Schilddrüse** | `/fachbereiche/schilddruese` | ❌ Fehlt | Green (#10b981) |
| **Allgemeine Fragen** | `/fachbereiche/allgemeine-fragen` | ❌ Fehlt | Brand Color (#1278B3) |

**Hinweise:**
- Jeder Fachbereich hat ein eigenes Theme mit Farbschema
- FAQ-System kategorisiert nach Fachbereichen
- Strapi CMS enthält bereits Content für diese Bereiche

---

### **P3 - Ergänzende Seiten (NIEDRIG)**

Optionale Seiten für vollständiges Portal-Erlebnis:

| Seite | Route | Status | Zweck |
|-------|-------|--------|-------|
| **Zweitmeinung anfragen** | `/zweitmeinung-anfragen` | ❌ Fehlt | Hauptformular für Anfragen |
| **Experten-Profile** | `/experten/[slug]` | ❌ Fehlt | Dynamische Expertenprofile |
| **Team** | `/team` | ❌ Fehlt | Teamvorstellung |
| **Karriere** | `/karriere` | ❌ Fehlt | Stellenangebote |
| **Presse** | `/presse` | ❌ Fehlt | Pressemitteilungen |
| **Blog/Ratgeber** | `/ratgeber` | ❌ Fehlt | Medizinische Artikel |
| **Kosten** | `/kosten` | ❌ Fehlt | Preisübersicht |
| **Versicherungen** | `/versicherungen` | ❌ Fehlt | Akzeptierte Versicherungen |
| **Für Ärzte** | `/fuer-aerzte` | ❌ Fehlt | Information für medizinisches Fachpersonal |
| **Qualitätssicherung** | `/qualitaet` | ❌ Fehlt | Qualitätsstandards und Zertifizierungen |
| **Behandlungsablauf** | `/ablauf` | ❌ Fehlt | Schritt-für-Schritt Prozessbeschreibung |
| **Patientenberichte** | `/erfahrungen` | ❌ Fehlt | Testimonials und Erfolgsgeschichten |

---

## 📊 Zusammenfassung

| Kategorie | Anzahl | Status |
|-----------|--------|--------|
| **Vorhandene Seiten** | 7 | ✅ Implementiert |
| **P0 - Rechtlich kritisch** | 3 | ❌ Fehlt |
| **P1 - Wichtig für UX** | 4 | ❌ Fehlt |
| **P2 - Fachbereiche** | 4 | ❌ Fehlt |
| **P3 - Ergänzend** | 12 | ❌ Fehlt |
| **Gesamt fehlend** | **23** | ❌ |

---

## 💡 Empfohlene Implementierungsreihenfolge

### Phase 1: Rechtliche Compliance (P0)
1. **Datenschutzerklärung** - Höchste Priorität
2. **AGB** - Rechtlich erforderlich
3. **Cookie-Policy** - DSGVO-Compliance

**Zeitaufwand:** ~1-2 Tage
**Content-Quelle:** Strapi CMS (legal-pages Content Type)

### Phase 2: Kernseitennavigation (P1)
4. **Kontakt** - Mehrfach verlinkt, wichtig für Support
5. **So funktioniert's** - User Journey Erklärung
6. **Über uns** - Vertrauensbildung
7. **Notfall** - CTA-Landing Page

**Zeitaufwand:** ~2-3 Tage
**Content-Quelle:** Strapi CMS + Custom Design

### Phase 3: Fachbereich-Vervollständigung (P2)
8. **Gallenblase**
9. **Nephrologie**
10. **Schilddrüse**
11. **Allgemeine Fragen**

**Zeitaufwand:** ~1-2 Tage (Template-basiert)
**Vorlage:** Bestehende Fachbereich-Pages als Template nutzen

### Phase 4: Content-Erweiterung (P3)
12-23. Ergänzende Seiten nach Bedarf

**Zeitaufwand:** Variabel, je nach Content-Verfügbarkeit

---

## 🏥 Technische Hinweise

### Strapi CMS Integration

**Verfügbare Content Types:**
- `legal-pages` - Für Impressum, Datenschutz, AGB, Cookie-Policy
- `pages` - Für dynamische Seiten (Über uns, Kontakt, etc.)
- `faq` - FAQ-Einträge mit Kategorisierung
- `sections` - Wiederverwendbare Seitenabschnitte

**API-Endpunkte:**
```typescript
// Legal Pages
GET /api/legal-pages?filters[type][$eq]=datenschutz
GET /api/legal-pages?filters[type][$eq]=agb
GET /api/legal-pages?filters[type][$eq]=cookie-policy

// Dynamic Pages
GET /api/pages?filters[slug][$eq]=kontakt
GET /api/pages?filters[slug][$eq]=ueber-uns
```

### Healthcare Design System

**Wichtige Standards:**
- WCAG 2.1 AA Compliance (Pflicht für Healthcare)
- Touch Targets: 56px+ (Healthcare-User sind oft gestresst)
- Notfall-Kontakte: Immer sichtbar
- Farbschema: Healthcare-approved Palette (#004166, #1278B3, #B3AF09)

### Implementierungs-Template

Für neue Seiten folgendes Pattern verwenden:

```typescript
// src/app/[page-name]/page.tsx
import type { Metadata } from 'next'
import { getLegalPage } from '@/lib/strapi/legal-pages'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Seitentitel | Zweitmeinung.ng',
  description: 'SEO-Beschreibung',
  robots: { index: true, follow: true },
}

export default async function PageName() {
  const data = await getLegalPage('type')

  if (!data) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-healthcare-background">
      {/* Emergency Banner */}
      <div className="bg-healthcare-primary text-white text-center py-3 px-4">
        {/* ... */}
      </div>

      {/* Content */}
    </div>
  )
}
```

---

## 📋 Checkliste für neue Seiten

Für jede neue Seite durchführen:

- [ ] Strapi Content erstellen/prüfen
- [ ] TypeScript Interfaces definieren
- [ ] API-Integration implementieren
- [ ] Healthcare Design System anwenden
- [ ] WCAG 2.1 AA Compliance testen
- [ ] Mobile Responsiveness prüfen
- [ ] Emergency Contact Banner integrieren
- [ ] SEO Metadaten hinzufügen
- [ ] Navigation/Footer Links aktualisieren
- [ ] Error States (404, no data) implementieren
- [ ] Loading States hinzufügen
- [ ] Browser-Testing (Chrome, Firefox, Safari)
- [ ] Accessibility Testing (Screen Reader)

---

## 🔗 Referenzen

- [CLAUDE.md](./CLAUDE.md) - Healthcare Development Guidelines
- [FRONTEND-DATENMODELL.md](./FRONTEND-DATENMODELL.md) - Strapi Content Types
- [API-REFERENCE.md](./API-REFERENCE.md) - API Integration Patterns
- [Healthcare Design System](../src/styles/globals.css) - Color Palette & Tokens

---

**Letzte Aktualisierung:** 20.11.2025
**Erstellt durch:** Claude Code
**Status:** In Bearbeitung - Phase 1 (P0 Pages)
