# Datenschutzerklärung Integration - alfright.eu

## ✅ Implementierungs-Status

**Stand:** 2025-11-21
**Strapi Version:** 5.31.1
**Status:** Backend CMS Integration abgeschlossen ✅

### Implementierte Features

- ✅ Legal Page Content Type erstellt (`api::legal-page.legal-page`)
- ✅ Schema erweitert mit alfright.eu Integration-Feldern
- ✅ Multi-Site Support via `siteIdentifier` Feld
- ✅ API Endpoints öffentlich verfügbar (`/api/legal-pages`)
- ✅ TypeScript-Typen generiert
- ✅ Controller, Routes und Services konfiguriert

### Backend API Endpoints

```
GET  /api/legal-pages              # Liste aller Legal Pages
GET  /api/legal-pages/:id          # Einzelne Legal Page
POST /api/legal-pages              # Neue Legal Page erstellen (Auth)
PUT  /api/legal-pages/:id          # Legal Page aktualisieren (Auth)
DELETE /api/legal-pages/:id        # Legal Page löschen (Auth)
```

### Nächste Schritte (Frontend)

- [ ] Frontend Datenschutz-Seite erstellen (siehe Phase 1 unten)
- [ ] alfright.eu iFrame/Widget einbinden
- [ ] API Integration für Metadaten-Abruf

---

## 📋 Kontext

Du arbeitest auf einem Strapi 5.31.1 CMS Server für eine medizinische Zweitmeinungs-Plattform (zweitmeinung.ng). Die Datenschutzerklärung wird über **alfright.eu** via iFrame oder JavaScript-Widget bereitgestellt, nicht über eine traditionelle API-Synchronisation.

---

## 🎯 Neue Implementierungsstrategie

Die Datenschutzerklärung wird direkt von alfright.eu eingebettet mit folgenden Optionen:

### Option 1: JavaScript Widget

```html
<!-- Header-Bereich -->
<script
  src="https://app.alfright.eu/hosted/dps/alfidcl.js"
  defer
  alfidcl-script
></script>

<!-- Content-Bereich -->
<div
  data-alfidcl-type="dps"
  data-alfidcl-tenant="alfright_schutzteam"
  data-alfidcl-lang="de-de"
  data-alfidcl-key="f60250224d4a459a90dbeeb289cd47f9"
></div>
```

### Option 2: iFrame (Empfohlen für Healthcare)

```html
<iframe
  src="https://app.alfright.eu/ext/dps/alfright_schutzteam/f60250224d4a459a90dbeeb289cd47f9?lang=de-de&headercolor=#004166&headerfont=Roboto+Condensed&headersize=21px&subheadersize=18px&fontcolor=#333333&textfont=Roboto+Condensed&textsize=14px&background=#ffffff&linkcolor=#1278B3"
  width="100%"
  height="5000"
  style="border:0;"
  loading="lazy"
  title="Datenschutzerklärung"
>
</iframe>
```

### Healthcare Design Parameter

```
&headercolor=#004166        // Healthcare Primary
&headerfont=Roboto+Condensed
&headersize=21px
&subheadersize=18px
&fontcolor=#333333
&textfont=Roboto+Condensed
&textsize=14px
&background=#ffffff
&linkcolor=#1278B3           // Healthcare Primary Light
```

---

## 🏗️ Frontend Integration (Empfohlener Ansatz)

### Phase 1: Datenschutz-Seite erstellen

**Aufgabe 1.1:** Erstelle eine einfache Datenschutz-Seite im Frontend

**Dateipfad:** `src/app/datenschutz/page.tsx`

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | Zweitmeinung.ng",
  description:
    "Datenschutzerklärung und Informationen zum Umgang mit personenbezogenen Daten",
  robots: { index: true, follow: true },
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-healthcare-background">
      {/* Emergency Contact Banner */}
      <div className="bg-healthcare-primary text-white text-center py-3 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm">
            <span className="font-medium">Medizinischer Notfall?</span>
            <span className="mx-2">|</span>
            <a
              href="tel:+4911219122"
              className="hover:underline focus:underline"
              aria-label="Notruf wählen"
            >
              📞 Notruf: 112
            </a>
            <span className="mx-2">|</span>
            <a
              href="tel:+49080080441100"
              className="hover:underline focus:underline"
              aria-label="Ärztlicher Bereitschaftsdienst"
            >
              📞 Ärztlicher Bereitschaftsdienst: 116 117
            </a>
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-healthcare-primary mb-4">
            Datenschutzerklärung
          </h1>
          <p className="text-lg text-gray-600">
            Informationen zum Umgang mit personenbezogenen Daten gemäß DSGVO
          </p>
        </div>

        {/* alfright.eu iFrame Integration */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <iframe
            src="https://app.alfright.eu/ext/dps/alfright_schutzteam/f60250224d4a459a90dbeeb289cd47f9?lang=de-de&headercolor=%23004166&headerfont=Roboto+Condensed&headersize=21px&subheadersize=18px&fontcolor=%23333333&textfont=Roboto+Condensed&textsize=14px&background=%23ffffff&linkcolor=%231278B3"
            width="100%"
            height="5000"
            style={{ border: 0 }}
            loading="lazy"
            title="Datenschutzerklärung - bereitgestellt von alfright.eu"
            aria-label="Datenschutzerklärung Inhalt"
          />
        </div>

        {/* Healthcare Footer Info */}
        <div className="mt-8 p-6 bg-healthcare-background rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-healthcare-success rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <h3 className="text-lg font-semibold text-healthcare-primary">
              Medizinische Schweigepflicht
            </h3>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Als medizinische Plattform unterliegen alle unsere Ärzte und
            Mitarbeiter der ärztlichen Schweigepflicht. Ihre Gesundheitsdaten
            werden nach höchsten Standards geschützt und nur für Ihre
            medizinische Betreuung verwendet.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-healthcare-success">🛡️</span>
              <span>DSGVO-konform</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-healthcare-success">🔒</span>
              <span>Ende-zu-Ende verschlüsselt</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-healthcare-success">⚕️</span>
              <span>Ärztliche Schweigepflicht</span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Fragen zum Datenschutz? Kontaktieren Sie unseren
            <a
              href="mailto:datenschutz@zweitmeinung.ng"
              className="text-healthcare-primary-light hover:underline focus:underline ml-1"
            >
              Datenschutzbeauftragten
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Phase 2: Alternative JavaScript Widget Integration

**Aufgabe 2.1:** Alternative Implementierung mit JavaScript Widget

Falls das iFrame nicht die gewünschte User Experience bietet, kann alternativ das JavaScript Widget verwendet werden:

**Dateipfad:** `src/app/datenschutz/page.tsx` (Alternative)

```typescript
"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-healthcare-background">
      {/* alfright.eu Script */}
      <Script
        src="https://app.alfright.eu/hosted/dps/alfidcl.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("alfright.eu Datenschutz-Widget geladen");
        }}
      />

      {/* Rest der Seite... */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header bleibt gleich */}

        {/* JavaScript Widget Container */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div
            data-alfidcl-type="dps"
            data-alfidcl-tenant="alfright_schutzteam"
            data-alfidcl-lang="de-de"
            data-alfidcl-key="f60250224d4a459a90dbeeb289cd47f9"
            className="min-h-[3000px]"
          >
            {/* Loading Fallback */}
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-healthcare-primary"></div>
              <span className="ml-3 text-gray-600">
                Datenschutzerklärung wird geladen...
              </span>
            </div>
          </div>
        </div>

        {/* Rest bleibt gleich */}
      </div>
    </div>
  );
}
```

## 🏗️ Strapi CMS Integration ✅ ABGESCHLOSSEN

### Phase 3: Strapi Content Entry für Metadaten ✅

**Status:** Implementiert am 2025-11-21

Das Legal Page Content Type wurde erfolgreich in Strapi erstellt und konfiguriert:

**Dateipfad:** `src/api/legal-page/content-types/legal-page/schema.json`

```json
{
  "kind": "collectionType",
  "collectionName": "legal_pages",
  "info": {
    "singularName": "legal-page",
    "pluralName": "legal-pages",
    "displayName": "Legal Page"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "type": {
      "type": "enumeration",
      "enum": ["impressum", "datenschutz", "agb", "cookie-policy", "other"]
    },
    "title": {
      "type": "string",
      "required": true
    },
    "description": {
      "type": "text"
    },
    "provider": {
      "type": "string",
      "default": "alfright.eu"
    },
    "embedType": {
      "type": "enumeration",
      "enum": ["iframe", "javascript", "static"],
      "default": "iframe"
    },
    "embedUrl": {
      "type": "text"
    },
    "lastChecked": {
      "type": "datetime"
    },
    "isActive": {
      "type": "boolean",
      "default": true
    },
    "country": {
      "type": "string",
      "default": "DE"
    },
    "language": {
      "type": "string",
      "default": "de"
    }
  }
}
```

**Beispiel-Dateneintrag für Datenschutz:**

```json
{
  "type": "datenschutz",
  "title": "Datenschutzerklärung",
  "description": "DSGVO-konforme Datenschutzerklärung bereitgestellt von alfright.eu",
  "provider": "alfright.eu",
  "embedType": "iframe",
  "embedUrl": "https://app.alfright.eu/ext/dps/alfright_schutzteam/f60250224d4a459a90dbeeb289cd47f9?lang=de-de&headercolor=%23004166&headerfont=Roboto+Condensed&headersize=21px&subheadersize=18px&fontcolor=%23333333&textfont=Roboto+Condensed&textsize=14px&background=%23ffffff&linkcolor=%231278B3",
  "isActive": true,
  "country": "DE",
  "language": "de"
}
```

---

## 🛡️ Sicherheit & Performance

### DSGVO & Privacy Considerations

1. **iFrame Vorteile:**

   - ✅ Keine Third-Party Scripts im Hauptdokument
   - ✅ Content Security Policy (CSP) freundlich
   - ✅ Bessere Isolation
   - ✅ Kein JavaScript im Hauptkontext

2. **JavaScript Widget Nachteile:**
   - ⚠️ Externe Scripts im Hauptdokument
   - ⚠️ Potenzielle CSP-Konflikte
   - ⚠️ Zusätzliche Security-Überprüfungen nötig

### Performance Optimierung

```typescript
// Lazy Loading für bessere Performance
<iframe
  src="..."
  loading="lazy"
  width="100%"
  height="5000"
  style={{ border: 0 }}
/>

// Preload DNS für schnellere Verbindung
<link rel="dns-prefetch" href="//app.alfright.eu" />
```

### CSP Header Anpassungen

```nginx
# Nginx Konfiguration
add_header Content-Security-Policy "frame-src 'self' https://app.alfright.eu; script-src 'self' https://app.alfright.eu;";
```

---

## ✅ Vereinfachte Implementierungs-Checkliste

**Frontend-Integration:**

- [ ] Datenschutz-Seite erstellt (`/src/app/datenschutz/page.tsx`)
- [ ] alfright.eu iFrame korrekt eingebettet
- [ ] Healthcare Design Parameter angewendet
- [ ] Emergency Banner integriert
- [ ] Mobile Responsiveness getestet
- [ ] WCAG 2.1 AA Compliance geprüft
- [ ] Loading States implementiert
- [ ] Error Handling hinzugefügt

**Strapi Backend Integration:** ✅ ABGESCHLOSSEN

- [x] Legal Page Content Type erstellt und erweitert
- [x] Schema mit alfright.eu Feldern konfiguriert
- [x] API Endpoints öffentlich verfügbar
- [x] TypeScript-Typen generiert
- [x] Multi-Site Support via siteIdentifier
- [ ] Datenschutz-Metadaten-Eintrag im Admin erstellt (Optional)

**Sicherheit & Performance:**

- [ ] CSP Header konfiguriert
- [ ] DNS Preload hinzugefügt
- [ ] Lazy Loading aktiviert
- [ ] HTTPS-Only Verbindungen geprüft

---

## 🚀 Go-Live Schritte

1. **Frontend deployen** mit neuer Datenschutz-Seite
2. **DNS/CDN konfigurieren** für app.alfright.eu Zugriff
3. **CSP Header** in Webserver anpassen
4. **Monitoring** der iFrame-Performance einrichten
5. **Testing** der kompletten User Journey

---

## 📞 Support & Kontakt

**alfright.eu Integration:**

- Dokumentation: [alfright.eu Support]
- API-Key Management: alfright_schutzteam
- Tenant ID: alfright_schutzteam
- Key: f60250224d4a459a90dbeeb289cd47f9

**Bei technischen Problemen:**

- Frontend-Team für Layout/Design Issues
- alfright.eu Support für Widget-Probleme
- DevOps für CSP/Security Konfiguration

---

**Vereinfachte Implementierung abgeschlossen! 🎉**

Die neue Lösung ist **deutlich einfacher**, **wartungsärmer** und **DSGVO-konformer** als eine komplexe API-Synchronisation.
