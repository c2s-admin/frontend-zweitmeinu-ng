# Chromatic Visual Regression Testing Setup

## 🎯 Healthcare Design System Visual Testing

Chromatic ist für das Visual Regression Testing des Healthcare Design Systems konfiguriert, um sicherzustellen, dass medizinische UI-Komponenten visuell konsistent bleiben.

## 🏥 Healthcare-Spezifische Konfiguration

### Viewports (Mobile-First Healthcare)
- **Mobile**: 375×667px (Healthcare Mobile - iPhone SE)
- **Tablet**: 768×1024px (Healthcare Tablet - iPad Portrait) 
- **Desktop**: 1024×768px (Healthcare Desktop - Small)
- **Large**: 1920×1080px (Healthcare Desktop - Large)

### Test Modi
- **Desktop**: Standard light theme
- **Mobile**: Mobile-optimized light theme
- **Tablet**: Tablet-optimized light theme  
- **Accessibility**: High-contrast mode für WCAG 2.1 AA Compliance

## 🚀 Setup & Usage

### 1. Environment Variable Setup
```bash
# Kopiere .env.example zu .env.local
cp .env.example .env.local

# Füge dein Chromatic Project Token hinzu
# Get token from: https://www.chromatic.com/
CHROMATIC_PROJECT_TOKEN=your-chromatic-project-token
```

### 2. Verfügbare Scripts

#### Development
```bash
# Standard Chromatic run (exit zero on changes)
npm run chromatic

# CI-optimierte Version (upload and exit)
npm run chromatic:ci

# Baseline erstellen (auto-accept changes)
npm run chromatic:baseline
```

#### Manuelle Execution
```bash
# Mit spezifischen Optionen
npx chromatic --project-token YOUR_TOKEN --exit-zero-on-changes

# Nur spezifische Stories testen
npx chromatic --only-story-names "Healthcare/*"

# Debug Mode
npx chromatic --debug
```

### 3. CI/CD Integration

Für GitHub Actions füge dies zu deiner Workflow-Datei hinzu:

```yaml
- name: Run Chromatic
  uses: chromaui/action@v1
  with:
    projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
    buildScriptName: build-storybook
    exitOnceUploaded: true
```

## 📊 Healthcare-Optimierte Features

### TurboSnap (Performance)
- **Nur geänderte Stories**: `onlyChanged: true`
- **External Files**: Public assets werden überwacht
- **File Hashing**: Aktiviert für optimale Performance

### Healthcare UX Checks  
- **Threshold**: 0.2 (20% Änderung für Alarm)
- **Delay**: 300ms für Animationen
- **Diff Threshold**: 0.1 für feine Unterschiede

### Medical Compliance
- **Console Errors**: Deaktiviert (`allowConsoleErrors: false`)
- **JUnit Reports**: Aktiviert für CI/CD Integration
- **Diagnostics**: Vollständige Debug-Informationen

## 🔧 Konfiguration Details

Die `.chromatic.json` enthält:

```json
{
  "projectToken": "${CHROMATIC_PROJECT_TOKEN}",
  "buildScriptName": "build-storybook", 
  "exitOnceUploaded": true,
  "onlyChanged": true,
  "viewports": {
    // Healthcare-optimierte Viewports
  },
  "modes": {
    // Mobile-first Modi mit A11y
  }
}
```

## 🏥 Healthcare Testing Best Practices

### 1. Component Stories
- **Minimum 6 Stories** pro Healthcare Component
- **Accessibility Story** mit high-contrast theme
- **Mobile/Desktop** Responsive Tests
- **Error States** für medizinische Kontexte

### 2. Visual Changes
- **Auto-Accept** nur für `main` Branch
- **Review Required** für alle Medical Components
- **Emergency Bypass** via `--auto-accept-changes` wenn nötig

### 3. Performance
- **TurboSnap** reduziert Test-Zeit um 90%
- **ZIP Upload** für schnellere CI Builds
- **File Hashing** für optimale Caching

## 🚨 Troubleshooting

### Common Issues

#### 1. Environment Token nicht gefunden
```bash
Error: Required option '--project-token' is missing
```
**Lösung**: Setze `CHROMATIC_PROJECT_TOKEN` in `.env.local`

#### 2. Build Script Fehler
```bash
Error: build-storybook script not found
```  
**Lösung**: Prüfe `package.json` - `build-storybook` muss existieren

#### 3. Viewport Issues
```bash
Error: Invalid viewport configuration
```
**Lösung**: Überprüfe `.chromatic.json` viewport syntax

### Healthcare-Spezifische Issues

#### WCAG Compliance Failures
- Check A11y addon in Storybook
- Verify contrast ratios > 4.5:1
- Test keyboard navigation

#### Mobile Touch Targets  
- Minimum 44px touch targets (WCAG)
- Preferred 56px for healthcare users
- Test on actual devices

## 📱 Next Steps

Nach diesem Setup:
1. **Baseline erstellen**: `npm run chromatic:baseline`
2. **CI Integration** konfigurieren
3. **Team Training** für Visual Review Process
4. **Automated Checks** in PR Workflow einbauen

---

*Healthcare Design System - Visual Regression Testing*
*Configured for WCAG 2.1 AA Compliance and Mobile-First Medical UX*