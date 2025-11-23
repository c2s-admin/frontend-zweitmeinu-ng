# Deployment-Dateien Übersicht
**Erstellt: 2025-03-23**

Vollständige Liste aller erstellten Deployment-Dateien und deren Verwendung.

---

## 📁 Neu erstellte Dateien

### 1. Dokumentation
| Datei | Beschreibung | Verwendung |
|-------|--------------|------------|
| `docs/DEPLOYMENT-README.md` | Haupt-Übersicht | Einstiegspunkt für Deployment-Dokumentation |
| `docs/DEPLOYMENT-WORKFLOW.md` | Vollständige Workflow-Dokumentation | Detaillierte Anleitung für gesamten Prozess |
| `docs/DEPLOYMENT-QUICKSTART.md` | 15-Minuten Setup-Guide | Schneller Einstieg für DevOps/Admins |
| `docs/DEPLOYMENT-FILES-OVERVIEW.md` | Diese Datei | Übersicht aller Deployment-Dateien |

### 2. Konfigurationsdateien
| Datei | Beschreibung | Verwendung |
|-------|--------------|------------|
| `ecosystem.config.js` | PM2 Process Manager Config | PM2 Prozess-Definition für Production & Development |
| `.env.production.example` | Production Environment Template | Vorlage für `.env.production` auf Live-Server |
| `.env.development.example` | Development Environment Template | Vorlage für `.env.development` auf Dev-Server |

### 3. Deployment-Scripts
| Datei | Beschreibung | Verwendung |
|-------|--------------|------------|
| `scripts/deploy.sh` | Manuelles Deployment-Script | `./scripts/deploy.sh production` |
| `scripts/plesk-post-deploy.sh` | Plesk Git Post-Deploy Hook | Automatisch nach Git-Pull ausgeführt |
| `scripts/rollback.sh` | Rollback-Script | `./scripts/rollback.sh production` |

**Berechtigungen**: Alle Scripts sind ausführbar (`chmod +x`)

### 4. API-Endpoints
| Datei | Beschreibung | Verwendung |
|-------|--------------|------------|
| `src/app/api/health/route.ts` | Health-Check API | `GET /api/health` für Monitoring |

### 5. CI/CD
| Datei | Beschreibung | Verwendung |
|-------|--------------|------------|
| `.github/workflows/healthcare-deploy.yml` | GitHub Actions Workflow | Automatische CI/CD Pipeline |

---

## 🔧 Verwendungszwecke

### Initiales Server-Setup
```bash
# 1. Server-Setup durchführen
docs/DEPLOYMENT-QUICKSTART.md → Phase 1-5 folgen

# 2. Wichtige Dateien:
- ecosystem.config.js → PM2 Konfiguration
- .env.production.example → Environment-Template kopieren
- scripts/plesk-post-deploy.sh → Als Plesk Hook konfigurieren
```

### Täglicher Workflow
```bash
# Feature entwickeln & deployen
git push origin development  # → Auto-Deploy via Webhook

# Bei Problemen: Manuelles Deployment
./scripts/deploy.sh production

# Bei Fehler: Rollback
./scripts/rollback.sh production
```

### Monitoring & Debugging
```bash
# Health-Check prüfen
curl https://zweitmeinu.ng/api/health

# PM2 Status
pm2 status

# Logs ansehen
pm2 logs prod-frontend
```

---

## 📋 Setup-Schritte

### Schritt 1: Dokumentation lesen
```
START → docs/DEPLOYMENT-README.md
   ↓
   ├→ Erste Setup? → docs/DEPLOYMENT-QUICKSTART.md (15 Min)
   ├→ Details? → docs/DEPLOYMENT-WORKFLOW.md (Vollständig)
   └→ Übersicht? → docs/DEPLOYMENT-FILES-OVERVIEW.md (Diese Datei)
```

### Schritt 2: Server vorbereiten
```bash
# SSH-Zugriff
ssh root@zweitmeinu.ng

# Node.js, PM2, Verzeichnisse
# → Siehe: docs/DEPLOYMENT-QUICKSTART.md, Phase 1
```

### Schritt 3: Plesk konfigurieren
```bash
# Git Extension aktivieren
# Repository einrichten
# Webhook konfigurieren
# → Siehe: docs/DEPLOYMENT-QUICKSTART.md, Phase 2
```

### Schritt 4: Environment-Dateien erstellen
```bash
# Auf dem Server:
cd /var/www/vhosts/zweitmeinu.ng/httpdocs

# Template kopieren
cp .env.production.example .env.production

# Secrets eintragen
nano .env.production

# Berechtigungen setzen
chmod 600 .env.production
```

### Schritt 5: PM2 starten
```bash
# Initial Build & Start
npm ci
npm run build
pm2 start ecosystem.config.js --only prod-frontend
pm2 save
```

### Schritt 6: Automatisches Deployment testen
```bash
# Auf Development-Maschine
git push origin main

# Auf Server prüfen
pm2 logs prod-frontend
curl http://localhost:3000/api/health
```

---

## 🎯 Wichtigste Dateien pro Rolle

### DevOps / Server-Admin
**Must-Read:**
- `docs/DEPLOYMENT-QUICKSTART.md` - Erster Setup
- `ecosystem.config.js` - PM2 Konfiguration verstehen
- `scripts/plesk-post-deploy.sh` - Plesk Hook
- `.env.production.example` - Environment-Variablen

**Optional:**
- `docs/DEPLOYMENT-WORKFLOW.md` - Vollständige Details
- `scripts/deploy.sh` - Manuelles Deployment verstehen

### Entwickler
**Must-Read:**
- `docs/DEPLOYMENT-README.md` - Workflow-Übersicht
- `.github/workflows/healthcare-deploy.yml` - CI/CD verstehen

**Optional:**
- `docs/DEPLOYMENT-WORKFLOW.md` - Troubleshooting
- `scripts/rollback.sh` - Rollback-Prozess

### Team Lead / Project Manager
**Must-Read:**
- `docs/DEPLOYMENT-README.md` - Übersicht
- `docs/DEPLOYMENT-WORKFLOW.md` - Gesamtprozess

---

## 🚨 Kritische Dateien (NICHT in Git)

Diese Dateien sind in `.gitignore` und DÜRFEN NICHT committed werden:

```
❌ .env.production      # Production Secrets
❌ .env.development     # Development Secrets
❌ .env.local           # Lokale Overrides
❌ .secrets             # Weitere Secrets
```

✅ **Nur Example-Dateien committen**:
```
✅ .env.production.example
✅ .env.development.example
✅ .env.example
```

---

## 📊 Datei-Struktur Übersicht

```
frontend-zweitmeinu-ng/
│
├── docs/                                    # 📚 Dokumentation
│   ├── DEPLOYMENT-README.md                 # Haupt-Übersicht
│   ├── DEPLOYMENT-WORKFLOW.md               # Vollständiger Workflow
│   ├── DEPLOYMENT-QUICKSTART.md             # Quick Start Guide
│   └── DEPLOYMENT-FILES-OVERVIEW.md         # Diese Datei
│
├── scripts/                                 # 🔧 Deployment-Scripts
│   ├── deploy.sh                            # Manuelles Deployment
│   ├── plesk-post-deploy.sh                 # Plesk Hook
│   └── rollback.sh                          # Rollback-Script
│
├── .github/workflows/                       # ⚙️ CI/CD
│   └── healthcare-deploy.yml                # GitHub Actions
│
├── src/app/api/health/                      # 🏥 Health-Check
│   └── route.ts                             # Health-Check Endpoint
│
├── ecosystem.config.js                      # 🚀 PM2 Config
├── .env.production.example                  # 🔐 Production Env Template
├── .env.development.example                 # 🔐 Development Env Template
└── .gitignore                               # 🛡️ Git Ignore (aktualisiert)
```

---

## 🔄 Update-Historie

| Datum | Version | Änderungen |
|-------|---------|------------|
| 2025-03-23 | 1.0 | Initial deployment infrastructure erstellt |

---

## 📞 Nächste Schritte

1. **Server-Setup**: `docs/DEPLOYMENT-QUICKSTART.md` durcharbeiten
2. **Test-Deployment**: Ersten automatischen Deploy durchführen
3. **Team-Training**: Workflow mit Team durchgehen
4. **Monitoring**: UptimeRobot / Health-Check-Monitoring einrichten
5. **Backup-Strategie**: Regelmäßige Backups verifizieren

---

**Version**: 1.0
**Status**: Production-Ready ✅
**Erstellt**: 2025-03-23
**Letzte Aktualisierung**: 2025-03-23
