# Deployment Workflow - zweitmeinung.ng

**Version**: 1.0
**Plattform**: Plesk Obsidian Web Pro Edition 18.0.73
**Server**: Debian 12 Bookworm
**Domain**: zweitmeinu.ng

---

## 🎯 Übersicht

Dieser Workflow ermöglicht strukturierte Deployments vom Development-Server zum Live-Server mit Git-basierter Versionskontrolle und automatisierten Deployment-Prozessen.

## 📋 Architektur

### Server-Setup
```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Repository                        │
│              c2s-admin/frontend-zweitmeinu-ng                │
└────────────┬─────────────────────────────────┬──────────────┘
             │                                  │
             │ push/merge                       │ webhook/pull
             ▼                                  ▼
    ┌────────────────────┐          ┌──────────────────────┐
    │ Development Server │          │   Production Server   │
    │  dev.zweitmeinu.ng │          │    zweitmeinu.ng     │
    │                    │          │                      │
    │ Branch: development│          │   Branch: main       │
    │ Auto-deploy: Yes   │          │   Auto-deploy: Yes   │
    │ PM2: dev-frontend  │          │   PM2: prod-frontend │
    └────────────────────┘          └──────────────────────┘
```

---

## 🌳 Git-Branch-Strategie

### Branch-Modell
```
main (production)
├── stable, tagged releases
├── auto-deploys to zweitmeinu.ng
└── protected branch (requires PR + review)

development (staging)
├── integration branch
├── auto-deploys to dev.zweitmeinu.ng
└── features merge here first

feature/* (feature branches)
└── individual features, merge to development
```

### Branch-Schutz-Regeln
| Branch | Push direkt | Merge Voraussetzung | Auto-Deploy |
|--------|-------------|---------------------|-------------|
| `main` | ❌ Nein | PR + Review + CI ✅ | ✅ Ja |
| `development` | ✅ Ja (Team) | Feature-Branch fertig | ✅ Ja |
| `feature/*` | ✅ Ja | - | ❌ Nein |

---

## 🚀 Deployment-Methode: Plesk Git Extension

### Vorteile
✅ Automatische Deployments bei Git-Push
✅ Integriert in Plesk UI
✅ Webhook-basiert (GitHub → Plesk)
✅ Build-Hooks für `npm install` und `npm run build`
✅ Rollback-Funktionalität

### Einrichtung auf Plesk

#### 1. Plesk Git Extension installieren
```bash
# SSH-Zugriff auf Server
ssh root@zweitmeinu.ng

# Git Extension prüfen/installieren (falls nicht vorhanden)
plesk bin extension --install git
```

#### 2. Node.js Toolkit konfigurieren
1. Plesk UI → **Websites & Domains** → zweitmeinu.ng
2. **Node.js** → Node.js Version **20.x oder höher** auswählen
3. **Application Mode**: Production
4. **Document Root**: `/httpdocs`
5. **Application Startup File**: `server.js` (wird erstellt)

#### 3. Git-Repository einrichten

**Für Production (zweitmeinu.ng):**
1. Plesk UI → **Git** → **Repository hinzufügen**
2. **Repository URL**: `https://github.com/c2s-admin/frontend-zweitmeinu-ng.git`
3. **Branch**: `main`
4. **Deployment-Pfad**: `/httpdocs`
5. **Access Token**: GitHub Personal Access Token (erstellen unter GitHub Settings → Developer Settings)

**Für Development (dev.zweitmeinu.ng):**
- Gleiche Schritte, aber **Branch**: `development`

#### 4. Deployment-Aktionen konfigurieren

In Plesk Git-Settings → **Deployment-Aktionen**:

```bash
# Pre-Deploy (Backup erstellen)
cp -r /httpdocs /var/www/vhosts/zweitmeinu.ng/backups/backup-$(date +%Y%m%d-%H%M%S)

# Post-Deploy (Dependencies installieren & Build)
cd /httpdocs
npm ci --production=false
npm run build

# PM2 Prozess neustarten
pm2 restart prod-frontend || pm2 start npm --name "prod-frontend" -- start
pm2 save
```

#### 5. GitHub Webhook einrichten
1. GitHub Repo → **Settings** → **Webhooks** → **Add webhook**
2. **Payload URL**: `https://zweitmeinu.ng:8443/modules/git/public/index.php/webhook/<REPO_ID>`
   (Repo ID findest du in Plesk Git-Settings)
3. **Content type**: `application/json`
4. **Secret**: Webhook-Secret aus Plesk kopieren
5. **Events**: Push events

---

## 📦 Environment-Konfiguration

### Environment-Dateien erstellen

#### Production `.env.production`
```bash
# Strapi Production API
NEXT_PUBLIC_STRAPI_URL=https://cms.zweitmeinu.ng/api

# Sentry Production
SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
SENTRY_ENVIRONMENT=production

# hCaptcha Production
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=production-site-key
RECAPTCHA_SECRET_KEY=production-secret-key

# Rate Limiting
CONTACT_MESSAGES_RATE_LIMIT_WINDOW=60
CONTACT_MESSAGES_RATE_LIMIT_MAX=3

# Analytics Production
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Node Environment
NODE_ENV=production
```

#### Development `.env.development`
```bash
# Strapi Development API
NEXT_PUBLIC_STRAPI_URL=https://dev-cms.zweitmeinu.ng/api

# Sentry Development
SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
SENTRY_ENVIRONMENT=development

# hCaptcha Test Keys
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=10000000-ffff-ffff-ffff-000000000001
RECAPTCHA_SECRET_KEY=0x0000000000000000000000000000000000000000

# Rate Limiting (relaxed)
CONTACT_MESSAGES_RATE_LIMIT_WINDOW=60
CONTACT_MESSAGES_RATE_LIMIT_MAX=10

# Node Environment
NODE_ENV=development
```

### Environment-Dateien auf Server hochladen
```bash
# SSH-Zugriff auf Server
ssh admin@zweitmeinu.ng

# Environment-Dateien erstellen
cd /var/www/vhosts/zweitmeinu.ng/httpdocs
nano .env.production  # Inhalt einfügen und speichern

# Für Development-Server analog
ssh admin@dev.zweitmeinu.ng
cd /var/www/vhosts/dev.zweitmeinu.ng/httpdocs
nano .env.development
```

### Sicherheit: Environment-Variablen verschlüsseln
```bash
# Berechtigungen setzen
chmod 600 .env.production
chown www-data:www-data .env.production
```

---

## 🔧 PM2 Process Manager Setup

### PM2 installieren (falls nicht vorhanden)
```bash
# Als Root-User
npm install -g pm2

# PM2 Startup-Script erstellen
pm2 startup systemd
# Befehl ausführen, der von pm2 startup ausgegeben wird
```

### PM2 Ecosystem-Konfiguration erstellen

Erstelle `ecosystem.config.js` im Projekt-Root:

```javascript
module.exports = {
  apps: [
    {
      name: 'prod-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/vhosts/zweitmeinu.ng/httpdocs',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/pm2/prod-frontend-error.log',
      out_file: '/var/log/pm2/prod-frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 5,
      min_uptime: '10s',
      max_memory_restart: '500M'
    },
    {
      name: 'dev-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/vhosts/dev.zweitmeinu.ng/httpdocs',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      error_file: '/var/log/pm2/dev-frontend-error.log',
      out_file: '/var/log/pm2/dev-frontend-out.log',
      autorestart: true
    }
  ]
}
```

### PM2 starten
```bash
# Application starten
pm2 start ecosystem.config.js

# Status prüfen
pm2 status

# Logs ansehen
pm2 logs prod-frontend

# Prozess speichern (überlebt Reboot)
pm2 save
```

---

## 🔄 Deployment-Workflow

### Szenario 1: Feature-Entwicklung → Development
```bash
# 1. Feature-Branch erstellen
git checkout development
git pull origin development
git checkout -b feature/neue-funktion

# 2. Entwicklung durchführen
# ... Code changes ...

# 3. Commit & Push
git add .
git commit -m "feat: neue Funktion implementiert"
git push origin feature/neue-funktion

# 4. Merge in development (nach Review)
git checkout development
git merge feature/neue-funktion
git push origin development

# ✅ Automatisches Deployment auf dev.zweitmeinu.ng via Webhook
```

### Szenario 2: Development → Production
```bash
# 1. Prüfen, dass development stabil ist
# - Tests ausführen: npm run test
# - Build prüfen: npm run build
# - Healthcare-Validierung: npm run healthcare:validate

# 2. Pull Request erstellen (GitHub UI)
# - Base: main
# - Compare: development
# - Reviewers hinzufügen
# - CI/CD muss erfolgreich sein

# 3. Nach Approval: Merge PR in main

# ✅ Automatisches Deployment auf zweitmeinu.ng via Webhook
```

### Szenario 3: Hotfix auf Production
```bash
# 1. Hotfix-Branch von main erstellen
git checkout main
git pull origin main
git checkout -b hotfix/kritischer-fehler

# 2. Fehler beheben
# ... fix code ...

# 3. Commit & Push
git add .
git commit -m "fix: kritischer Fehler behoben"
git push origin hotfix/kritischer-fehler

# 4. Pull Request zu main UND development
# - Merge in main (sofortiges Production-Deployment)
# - Merge in development (synchronisiert Branches)
```

---

## 🏥 Healthcare-spezifische Validierung

### Pre-Deployment Checkliste
```bash
# Vor jedem Production-Deployment ausführen:

# 1. TypeScript & Linting
npm run lint

# 2. Accessibility-Validierung (WCAG 2.1 AA)
npm run accessibility:full

# 3. Bundle-Größe prüfen
npm run size:healthcare

# 4. Performance-Check
npm run perf:healthcare

# 5. Build-Test
npm run build

# ✅ Alle Checks müssen bestehen, bevor in main gemergt wird
```

### CI/CD Integration (GitHub Actions)

Erstelle `.github/workflows/healthcare-ci.yml`:

```yaml
name: Healthcare CI/CD

on:
  push:
    branches: [main, development]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run healthcare validation
        run: npm run healthcare:ci

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: .next/
          retention-days: 7

  deploy-production:
    needs: validate
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Plesk webhook
        run: |
          curl -X POST ${{ secrets.PLESK_WEBHOOK_URL }} \
               -H "X-Hub-Signature-256: ${{ secrets.PLESK_WEBHOOK_SECRET }}"
```

---

## 🔙 Rollback-Strategie

### Methode 1: Plesk Git Rollback
1. Plesk UI → **Git** → Repository auswählen
2. **Deployment-Historie** → Vorherige Version auswählen
3. **Rollback** → Bestätigen

### Methode 2: Git-basiertes Rollback
```bash
# SSH auf Server
ssh admin@zweitmeinu.ng
cd /var/www/vhosts/zweitmeinu.ng/httpdocs

# Letzten Commit rückgängig machen
git log --oneline -n 5  # Commit-ID finden
git checkout <commit-id>

# Build & Restart
npm ci
npm run build
pm2 restart prod-frontend
```

### Methode 3: Backup-Restore
```bash
# Backup-Verzeichnis prüfen
ls -lh /var/www/vhosts/zweitmeinu.ng/backups/

# Backup wiederherstellen
cd /var/www/vhosts/zweitmeinu.ng
rm -rf httpdocs
cp -r backups/backup-20250323-143022 httpdocs

# PM2 Restart
pm2 restart prod-frontend
```

---

## 📊 Monitoring & Health-Checks

### Health-Check Endpoint erstellen

Erstelle `src/app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  }

  // Strapi-Verbindung prüfen
  try {
    const strapiResponse = await fetch(process.env.NEXT_PUBLIC_STRAPI_URL!)
    health.strapi = strapiResponse.ok ? 'connected' : 'error'
  } catch {
    health.strapi = 'unavailable'
  }

  return NextResponse.json(health)
}
```

### PM2 Monitoring
```bash
# Real-time Monitoring
pm2 monit

# Status-Übersicht
pm2 status

# Resource-Nutzung
pm2 describe prod-frontend

# Logs live verfolgen
pm2 logs prod-frontend --lines 100
```

### Uptime-Monitoring einrichten

**Option 1: UptimeRobot** (kostenlos)
1. https://uptimerobot.com/ registrieren
2. Monitor hinzufügen:
   - URL: `https://zweitmeinu.ng/api/health`
   - Interval: 5 Minuten
   - Alert bei Downtime

**Option 2: Plesk Server Health Monitor**
- Plesk UI → **Tools & Einstellungen** → **Server-Zustand**
- Schwellenwerte für CPU/RAM/Disk konfigurieren

---

## 🔐 Sicherheits-Checkliste

### Pre-Deployment Security
- [ ] Keine `.env`-Dateien in Git committed
- [ ] GitHub Personal Access Token sicher gespeichert
- [ ] Plesk Webhook-Secret konfiguriert
- [ ] HTTPS erzwungen (Plesk SSL Let's Encrypt)
- [ ] Firewall-Regeln geprüft (nur Port 80/443 öffentlich)
- [ ] `NODE_ENV=production` auf Live-Server
- [ ] Console-Logs in Production entfernt (`removeConsole: true`)

### Server-Härtung
```bash
# SSH-Key-Auth aktivieren (Passwort deaktivieren)
sudo nano /etc/ssh/sshd_config
# PasswordAuthentication no
sudo systemctl restart sshd

# Fail2Ban für SSH-Schutz
sudo apt install fail2ban
sudo systemctl enable fail2ban

# Automatische Security-Updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 📝 Troubleshooting

### Problem: Deployment hängt
```bash
# PM2-Logs prüfen
pm2 logs prod-frontend --err

# Build-Prozess manuell ausführen
cd /var/www/vhosts/zweitmeinu.ng/httpdocs
npm run build

# Node-Version prüfen
node -v  # Mindestens v20.x

# Disk-Space prüfen
df -h
```

### Problem: Build schlägt fehl
```bash
# Node-Modules neu installieren
rm -rf node_modules package-lock.json
npm install
npm run build

# TypeScript-Fehler prüfen
npm run type-check
```

### Problem: Environment-Variablen fehlen
```bash
# .env-Datei prüfen
cat .env.production

# Environment-Variablen in PM2 setzen
pm2 restart prod-frontend --update-env
```

---

## 🎯 Quick Reference

### Wichtige Befehle
| Befehl | Zweck |
|--------|-------|
| `pm2 restart prod-frontend` | Production neu starten |
| `pm2 logs prod-frontend` | Logs ansehen |
| `npm run build` | Build erstellen |
| `npm run healthcare:validate` | Healthcare-Checks |
| `git pull origin main` | Neueste Version holen |

### URLs
- **Production**: https://zweitmeinu.ng
- **Development**: https://dev.zweitmeinu.ng
- **Health-Check**: https://zweitmeinu.ng/api/health
- **Plesk Admin**: https://zweitmeinu.ng:8443
- **GitHub Repo**: https://github.com/c2s-admin/frontend-zweitmeinu-ng

### Support-Kontakte
- **Plesk Support**: support@plesk.com
- **Server-Admin**: [Admin-Email eintragen]
- **Entwickler**: [Dev-Team-Email eintragen]

---

**Version**: 1.0
**Letzte Aktualisierung**: 2025-03-23
**Nächste Review**: 2025-06-23
