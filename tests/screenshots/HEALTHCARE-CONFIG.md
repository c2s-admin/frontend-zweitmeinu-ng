# Healthcare Screenshot Testing Configuration

## Implementierte Healthcare Configuration

### 🏥 Healthcare-Spezifische Browser Settings

```typescript
use: {
  baseURL: 'http://localhost:6006',  // Storybook als primäre Test-Umgebung
  colorScheme: 'light',              // Healthcare bevorzugt helle Modi für klinische Klarheit
  actionTimeout: 15000,              // Erweiterte Timeouts für Healthcare-Benutzer mit Mobilitätsproblemen
  navigationTimeout: 30000,          // Medizinische Datenladung kann länger dauern
}
```

### 📱 Healthcare Device Projects

#### 1. healthcare-mobile (375x667)
- **Gerät**: iPhone SE - häufigstes Healthcare-Benutzer-Gerät
- **Fokus**: 56px+ Touch Targets für gestresste medizinische Benutzer
- **Validierung**: Thumb-friendly mobile medizinische Interfaces

#### 2. healthcare-tablet (768x1024) 
- **Gerät**: iPad - klinische Tablet-Größe
- **Fokus**: Healthcare-Professional-Workflows auf Tablets
- **Validierung**: Medizinische Datenpräsentation auf Tablets

#### 3. healthcare-desktop (1440x900)
- **Gerät**: Standard klinische Arbeitsstation
- **Fokus**: Healthcare-Professional Desktop-Workflows
- **Validierung**: Umfassende medizinische Datenlayouts

#### 4. healthcare-accessibility (1200x800)
- **Fokus**: WCAG 2.1 AA Compliance Testing
- **Features**: Reduced Motion, High Contrast
- **Validierung**: Visuelle Barrierefreiheitsprüfung

### 🎯 Screenshot Comparison Settings

```typescript
expect: {
  toHaveScreenshot: {
    threshold: 0.2,        // Healthcare-Farbgenauigkeit ist kritisch
    maxDiffPixels: 500,    // Angemessene Diff für Healthcare-Komponenten
  }
}
```

### ⚡ Healthcare Performance Settings

- **Global Timeout**: 600000ms (10 Minuten) für vollständige Healthcare-Komponenten-Suite
- **Component Timeout**: 30000ms für medizinische Datenladung
- **Visual Timeout**: 10000ms für Healthcare-Screenshot-Vergleiche
- **Workers**: 2 (konservativ für Screenshot-Konsistenz)
- **Retries**: 2 in CI für Healthcare-Komponentenstabilität

### 🔍 Getestete Healthcare States

```typescript
const healthcareStates = [
  'default',        // Normale Healthcare-Komponenten-Darstellung
  'emergency',      // Notfall-medizinische Kontexte mit roter Gestaltung
  'disabled',       // Deaktivierter Zustand für medizinische Formularsteuerungen  
  'error',          // Fehlerzustände mit medizinischem Kontext
  'high-contrast',  // WCAG 2.1 AA High-Contrast-Modus
  'reduced-motion'  // Reduzierte Bewegung für Barrierefreiheit
];
```

## Validierte Healthcare Requirements

### ✅ Touch Target Validierung
- **Minimum**: 44px (WCAG 2.1 AA absolutes Minimum)
- **Healthcare Standard**: 56px+ (für gestresste Benutzer)
- **Emergency Actions**: 64px+ (für kritische Healthcare-Situationen)

### ✅ Healthcare Farbpalette Compliance
- **Primary**: #004166 (Headlines, Navigation, Vertrauen)
- **Primary Light**: #1278B3 (CTAs, Links, Akzente)
- **Accent Green**: #B3AF09 (Erfolg, Highlights, positive Aktionen)
- **Emergency Red**: #dc2626 (medizinische Warnungen, kritisch)

### ✅ WCAG 2.1 AA Compliance
- **Kontrastratios**: 4.5:1 minimum für normalen Text
- **Fokus-Indikatoren**: 3px solider Umriss sichtbar
- **Touch Targets**: 44px+ minimum, 56px+ bevorzugt
- **Reduced Motion**: Alle Animationen deaktivierbar

### ✅ Medizinische Kontext-Validierung
- Emergency States zeigen rote Gestaltung und Kontaktinformationen
- Datenschutz-Indikatoren in medizinischen Formular-Komponenten sichtbar
- Medizinische Spezialisierungsfarben konsistent über Komponenten

## Test Commands für Healthcare Development

### Vollständige Healthcare Test Suite
```bash
npm run screenshot
```

### Healthcare Baseline Updates
```bash
npm run screenshot:update
```

### Device-Spezifische Tests
```bash
npm run screenshot:mobile        # Mobile Healthcare UX
npm run screenshot:desktop       # Clinical Desktop
npm run screenshot:accessibility # WCAG 2.1 AA Compliance
```

### Komponenten-Spezifische Tests
```bash
npx playwright test tests/screenshots --grep "EmergencyBanner"
npx playwright test tests/screenshots --grep "DoctorProfile" 
npx playwright test tests/screenshots --grep "HealthcareButton"
```

## Healthcare CI/CD Integration

### Automatisierte Validierung
- Screenshot-Konsistenz über alle Healthcare-Geräte
- Healthcare-Farbpaletten-Compliance-Prüfung
- Touch-Target-Größen-Validierung für mobile Healthcare
- WCAG 2.1 AA Barrierefreiheits-Screenshot-Validierung

### Performance Optimiert
- Conservative parallel execution (2 workers)
- Healthcare-specific timeouts für medizinische Daten
- Retry logic für Healthcare-Komponenten-Stabilität
- Automatische baseline updates für Healthcare Design System

## Nächste Schritte

1. **Smoke Test ausführen**: `npx playwright test tests/screenshots/smoke-test.spec.ts`
2. **Baseline Screenshots generieren**: `npm run screenshot:update`
3. **Full Healthcare Suite testen**: `npm run screenshot`
4. **CI Integration validieren**: Test in GitHub Actions Pipeline