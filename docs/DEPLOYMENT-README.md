# Deployment-Dokumentation Übersicht
**zweitmeinung.ng Healthcare Platform**

Vollständige Deployment-Infrastruktur für den Plesk-basierten Workflow.

---

## 📚 Dokumentations-Struktur

| Dokument | Zweck | Zielgruppe |
|----------|-------|------------|
| **[DEPLOYMENT-QUICKSTART.md](./DEPLOYMENT-QUICKSTART.md)** | 15-Minuten Setup-Guide | DevOps, Admins |
| **[DEPLOYMENT-WORKFLOW.md](./DEPLOYMENT-WORKFLOW.md)** | Vollständige Workflow-Dokumentation | Alle |

---

## 🗂️ Bereitgestellte Dateien

### Konfigurationsdateien
```
📁 Root-Verzeichnis
├── ecosystem.config.js          # PM2 Process Manager Konfiguration
├── .env.production.example      # Production Environment Template
└── .env.development.example     # Development Environment Template
```

### Deployment-Scripts
```
📁 scripts/
├── deploy.sh                    # Manuelles Deployment-Script
├── plesk-post-deploy.sh         # Plesk Git Post-Deploy Hook
└── rollback.sh                  # Rollback zu vorheriger Version
```

### API-Endpoints
```
📁 src/app/api/
└── health/
    └── route.ts                 # Health-Check Endpoint (/api/health)
```

### CI/CD
```
📁 .github/workflows/
└── healthcare-deploy.yml        # GitHub Actions Workflow
```

---

## 🚀 Quick Start

### Für DevOps/Admins (Server-Setup)
1. **[DEPLOYMENT-QUICKSTART.md](./DEPLOYMENT-QUICKSTART.md)** lesen
2. Phase 1-5 durchführen (15 Minuten)
3. Automatisches Deployment testen

### Für Entwickler (Daily Workflow)
1. Feature entwickeln in `feature/*` Branch
2. Merge in `development` → Auto-Deploy auf dev.zweitmeinu.ng
3. PR `development` → `main` → Auto-Deploy auf zweitmeinu.ng

---

## 📋 Deployment-Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Repository                        │
│              c2s-admin/frontend-zweitmeinu-ng                │
│                                                               │
│  Branches:                                                    │
│  • main (production) → zweitmeinu.ng                         │
│  • development (staging) → dev.zweitmeinu.ng                 │
│  • feature/* (development)                                    │
└────────────┬─────────────────────────────────┬──────────────┘
             │                                  │
             │ Webhook on push                  │ Webhook on push
             ▼                                  ▼
    ┌─────────────────────┐          ┌─────────────────────┐
    │  Development Server │          │  Production Server   │
    │  dev.zweitmeinu.ng  │          │   zweitmeinu.ng     │
    │                     │          │                     │
    │  • Plesk Git pulls  │          │  • Plesk Git pulls  │
    │  • npm ci           │          │  • npm ci           │
    │  • npm run build    │          │  • npm run build    │
    │  • PM2 reload       │          │  • PM2 reload       │
    └─────────────────────┘          └─────────────────────┘
```

---

## 🛠️ Setup-Checkliste

### Server-Vorbereitung
- [ ] SSH-Zugriff eingerichtet
- [ ] Node.js v20.x installiert
- [ ] PM2 global installiert
- [ ] Verzeichnisse erstellt (`/var/www/vhosts/...`)
- [ ] Berechtigungen gesetzt (`chown www-data:www-data`)

### Plesk-Konfiguration
- [ ] Git Extension aktiviert
- [ ] GitHub Personal Access Token erstellt
- [ ] Repository in Plesk eingerichtet
- [ ] Deployment-Aktionen (Post-Deploy Hook) konfiguriert
- [ ] Webhook URL kopiert

### Environment-Setup
- [ ] `.env.production` erstellt und konfiguriert
- [ ] `.env.development` erstellt (optional)
- [ ] Berechtigungen: `chmod 600 .env.*`
- [ ] Strapi CMS URL konfiguriert
- [ ] Secrets (Sentry, hCaptcha) hinzugefügt

### Initial Deployment
- [ ] Manuelles Build erfolgreich: `npm run build`
- [ ] PM2 gestartet: `pm2 start ecosystem.config.js`
- [ ] Health-Check OK: `curl http://localhost:3000/api/health`
- [ ] PM2 Auto-Start aktiviert: `pm2 startup` + `pm2 save`

### GitHub-Integration
- [ ] Webhook in GitHub eingerichtet
- [ ] Webhook Secret konfiguriert
- [ ] Test-Push durchgeführt
- [ ] Automatisches Deployment funktioniert

### CI/CD (Optional)
- [ ] GitHub Actions Workflow aktiviert
- [ ] Secrets in GitHub konfiguriert:
  - [ ] `PLESK_PRODUCTION_WEBHOOK_URL`
  - [ ] `PLESK_DEVELOPMENT_WEBHOOK_URL`
  - [ ] `PLESK_WEBHOOK_SECRET`
  - [ ] `NEXT_PUBLIC_STRAPI_URL`

---

## 🔧 Wichtige Commands

### Deployment
```bash
# Manuelles Deployment
./scripts/deploy.sh production
./scripts/deploy.sh development

# Rollback
./scripts/rollback.sh production
```

### PM2 Management
```bash
# Status prüfen
pm2 status

# Logs ansehen
pm2 logs prod-frontend

# Prozess neustarten
pm2 restart prod-frontend

# Real-time Monitoring
pm2 monit
```

### Health-Checks
```bash
# Lokal
curl http://localhost:3000/api/health | jq

# Extern
curl https://zweitmeinu.ng/api/health | jq
```

### Git Workflow
```bash
# Feature entwickeln
git checkout development
git checkout -b feature/neue-funktion
# ... entwickeln ...
git push origin feature/neue-funktion

# Merge & Deploy
git checkout development
git merge feature/neue-funktion
git push origin development  # → Auto-Deploy auf dev.zweitmeinu.ng

# Production Release (via PR)
# GitHub UI: PR development → main
# Nach Merge: Auto-Deploy auf zweitmeinu.ng
```

---

## 📊 Monitoring & Logs

### Health-Check Endpoint
```bash
GET https://zweitmeinu.ng/api/health

# Response:
{
  "status": "healthy",
  "timestamp": "2025-03-23T14:30:00.000Z",
  "version": "1.0.0",
  "environment": "production",
  "uptime": 123456.78,
  "memory": {...},
  "strapi": "connected",
  "responseTime": "45ms"
}
```

### PM2 Logs
```bash
# Production Logs
/var/log/pm2/prod-frontend-out.log
/var/log/pm2/prod-frontend-error.log

# Development Logs
/var/log/pm2/dev-frontend-out.log
/var/log/pm2/dev-frontend-error.log
```

### Backups
```bash
# Backup-Verzeichnis
/var/www/vhosts/zweitmeinu.ng/backups/

# Format: backup-YYYYMMDD-HHMMSS
backup-20250323-143022/
```

---

## 🔒 Sicherheit

### Environment-Variablen
- ✅ Niemals in Git committen
- ✅ `chmod 600` Berechtigungen
- ✅ Production-Secrets getrennt von Development

### Server-Zugriff
- ✅ SSH Key-Auth (Passwort deaktiviert)
- ✅ Fail2Ban für SSH-Schutz
- ✅ Firewall nur Port 80/443 öffentlich

### Secrets Management
- ✅ GitHub Personal Access Token sicher speichern
- ✅ Plesk Webhook Secret nicht öffentlich machen
- ✅ Sentry DSN, hCaptcha Keys in `.env` nur

---

## 🆘 Troubleshooting

### Häufige Probleme

**Problem**: Deployment schlägt fehl
```bash
# Manuell debuggen
ssh root@zweitmeinu.ng
cd /var/www/vhosts/zweitmeinu.ng/httpdocs
npm ci
npm run build  # Fehler hier analysieren
```

**Problem**: PM2 Prozess crasht
```bash
pm2 logs prod-frontend --err
pm2 describe prod-frontend
pm2 restart prod-frontend
```

**Problem**: Environment-Variablen fehlen
```bash
# .env-Datei prüfen
cat .env.production

# PM2 neu starten mit Env-Update
pm2 restart prod-frontend --update-env
```

**Problem**: Port bereits in Verwendung
```bash
# Port-Konflikt finden
lsof -i :3000

# PM2 Prozess neu starten
pm2 delete prod-frontend
pm2 start ecosystem.config.js --only prod-frontend
```

### Support-Ressourcen
- **Full Workflow Guide**: [DEPLOYMENT-WORKFLOW.md](./DEPLOYMENT-WORKFLOW.md)
- **Quick Start**: [DEPLOYMENT-QUICKSTART.md](./DEPLOYMENT-QUICKSTART.md)
- **Healthcare Standards**: [CLAUDE.md](../CLAUDE.md)

---

## 📦 Deployment-Checklist

### Pre-Deployment
- [ ] Tests erfolgreich: `npm test`
- [ ] Linting erfolgreich: `npm run lint`
- [ ] Healthcare-Validierung: `npm run healthcare:validate`
- [ ] Build erfolgreich: `npm run build`

### Deployment
- [ ] Feature-Branch in `development` gemergt
- [ ] Development-Deployment erfolgreich
- [ ] Funktionalität auf dev.zweitmeinu.ng getestet
- [ ] PR `development` → `main` erstellt
- [ ] CI/CD Checks bestanden
- [ ] PR gemergt
- [ ] Production-Deployment erfolgreich

### Post-Deployment
- [ ] Health-Check erfolgreich: `https://zweitmeinu.ng/api/health`
- [ ] PM2 Status OK: `pm2 status`
- [ ] Funktionalität auf zweitmeinu.ng verifiziert
- [ ] Logs prüfen: `pm2 logs prod-frontend`
- [ ] Backup erstellt (automatisch)

---

## 🎯 Next Steps

1. **Setup durchführen**: [DEPLOYMENT-QUICKSTART.md](./DEPLOYMENT-QUICKSTART.md) folgen
2. **Test-Deployment**: Kleinen Commit pushen und Webhook testen
3. **Team Training**: Daily Workflow mit Team durchgehen
4. **Monitoring**: UptimeRobot oder ähnlichen Service einrichten
5. **Documentation**: Team-Onboarding-Session durchführen

---

## 📞 Kontakt & Support

### Wichtige URLs
- **Production**: https://zweitmeinu.ng
- **Development**: https://dev.zweitmeinu.ng
- **Plesk Admin**: https://zweitmeinu.ng:8443
- **GitHub Repo**: https://github.com/c2s-admin/frontend-zweitmeinu-ng

### Support-Kanäle
- **Server Issues**: Plesk Support (support@plesk.com)
- **GitHub Issues**: Repository Issue Tracker
- **Team Chat**: [Team-Chat eintragen]

---

**Version**: 1.0
**Status**: Production-Ready ✅
**Last Updated**: 2025-03-23
**Next Review**: 2025-06-23
