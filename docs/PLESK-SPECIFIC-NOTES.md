# Plesk-spezifische Hinweise

**Quick Reference für Plesk Obsidian Web Pro Edition**

---

## 🚨 Wichtigste Unterschiede zu Standard-Setup

### 1. User & Berechtigungen
```bash
# ❌ FALSCH (Standard Linux/Apache)
chown www-data:www-data /var/www/html/

# ✅ RICHTIG (Plesk)
chown psaserv:psacln /var/www/vhosts/zweitmeinu.ng/httpdocs/
```

### 2. NPM-Befehle
```bash
# ❌ FALSCH (als root direkt)
npm ci
npm run build

# ✅ RICHTIG (als psaserv)
sudo -u psaserv npm ci
sudo -u psaserv npm run build
```

### 3. Verzeichnisstruktur
```bash
# ❌ FALSCH (Standard)
/var/www/html/
/var/log/pm2/

# ✅ RICHTIG (Plesk)
/var/www/vhosts/zweitmeinu.ng/httpdocs/
/var/www/vhosts/zweitmeinu.ng/logs/
```

---

## 📁 Plesk Verzeichnisse

| Verzeichnis | Owner | Zweck |
|-------------|-------|-------|
| `/var/www/vhosts/zweitmeinu.ng/httpdocs/` | `psaserv:psacln` | Webroot (Git-Ziel) |
| `/var/www/vhosts/zweitmeinu.ng/logs/` | `root:root` | Plesk Logs + PM2 Logs |
| `/var/www/vhosts/zweitmeinu.ng/backups/` | `psaserv:psacln` | Deployment-Backups (neu) |

**NIEMALS manuell ändern**: `httpdocs/` und `logs/` werden von Plesk verwaltet!

---

## 🔧 Plesk Git Integration

### Post-Deploy Hook
Plesk UI → **Git** → Repository → **Zusätzliche Aktionen**:

```bash
#!/bin/bash
# WICHTIG: Läuft als root, daher sudo -u psaserv!

cd /var/www/vhosts/zweitmeinu.ng/httpdocs

# Dependencies & Build als psaserv
sudo -u psaserv npm ci --production=false
sudo -u psaserv npm run build

# PM2 Restart
pm2 reload prod-frontend || pm2 start ecosystem.config.js --only prod-frontend
pm2 save
```

### Webhook-URL
```
https://zweitmeinu.ng:8443/modules/git/public/index.php/webhook/<REPO_ID>
```

**REPO_ID** findest du in Plesk Git-Settings → Webhook-URL kopieren

---

## 🔐 Environment-Variablen in Plesk

### Plesk UI Methode (alternativ)
1. Plesk UI → **Websites & Domains** → zweitmeinu.ng
2. **Node.js** → **Environment Variables**
3. Variablen hinzufügen:
   ```
   NODE_ENV=production
   PORT=3000
   NEXT_PUBLIC_STRAPI_URL=https://cms.zweitmeinu.ng/api
   ```

### File-basiert (empfohlen für Secrets)
```bash
cd /var/www/vhosts/zweitmeinu.ng/httpdocs
nano .env.production
chown psaserv:psacln .env.production
chmod 600 .env.production
```

**Vorteil File**: Secrets nicht in Plesk UI sichtbar

---

## 🛠️ NPM & Node.js in Plesk

### Node.js Version einstellen
1. Plesk UI → **Websites & Domains** → zweitmeinu.ng
2. **Node.js** → **Node.js Version auswählen**
3. Version **20.x oder höher** wählen
4. **Application Mode**: Production
5. **Document Root**: `/httpdocs`

### NPM als psaserv ausführen

**Option 1: User wechseln**
```bash
su - psaserv -s /bin/bash
cd /var/www/vhosts/zweitmeinu.ng/httpdocs
npm ci
npm run build
exit
```

**Option 2: sudo (in Scripts)**
```bash
sudo -u psaserv npm ci --production=false
sudo -u psaserv npm run build
```

**Option 3: Plesk Node.js Manager**
- Plesk UI → **Node.js** → **NPM Install**
- UI führt `npm install` als psaserv aus

---

## 📊 Logs in Plesk

### Log-Dateien
```bash
# Plesk Web-Server Logs
/var/www/vhosts/zweitmeinu.ng/logs/error_log
/var/www/vhosts/zweitmeinu.ng/logs/access_log

# PM2 Application Logs (unsere Config)
/var/www/vhosts/zweitmeinu.ng/logs/prod-frontend-error.log
/var/www/vhosts/zweitmeinu.ng/logs/prod-frontend-out.log
```

### Logs ansehen
```bash
# Via Plesk UI
Plesk → Websites & Domains → zweitmeinu.ng → Logs

# Via SSH
tail -f /var/www/vhosts/zweitmeinu.ng/logs/prod-frontend-out.log

# Via PM2
pm2 logs prod-frontend
```

---

## 🔄 Deployment-Workflow in Plesk

### Automatisches Deployment
```
1. GitHub Push → main branch
2. GitHub Webhook → Plesk Git Extension
3. Plesk Git Pull → /var/www/vhosts/zweitmeinu.ng/httpdocs/
4. Post-Deploy Hook ausführen:
   - sudo -u psaserv npm ci
   - sudo -u psaserv npm run build
   - pm2 reload prod-frontend
5. ✅ Deployment complete
```

### Manuelles Deployment
```bash
# SSH auf Server
ssh root@zweitmeinu.ng

# Deployment-Script ausführen
cd /var/www/vhosts/zweitmeinu.ng/httpdocs
./scripts/deploy.sh production
```

---

## 🚨 Troubleshooting Plesk-spezifisch

### Problem: "EACCES: permission denied"

**Ursache**: NPM als root ohne `sudo -u` ausgeführt

**Lösung**:
```bash
# node_modules mit falschen Berechtigungen löschen
rm -rf /var/www/vhosts/zweitmeinu.ng/httpdocs/node_modules
rm -rf /var/www/vhosts/zweitmeinu.ng/httpdocs/.next

# Ownership korrigieren
chown -R psaserv:psacln /var/www/vhosts/zweitmeinu.ng/httpdocs

# Korrekt installieren
cd /var/www/vhosts/zweitmeinu.ng/httpdocs
sudo -u psaserv npm ci --production=false
sudo -u psaserv npm run build
```

### Problem: Plesk Git Pull funktioniert nicht

**Checks**:
1. GitHub Personal Access Token korrekt?
   - Plesk Git Settings → Token prüfen
2. Branch korrekt?
   - Plesk Git Settings → Branch = `main`
3. Webhook funktioniert?
   - GitHub → Webhooks → Recent Deliveries prüfen
   - Firewall: Port 8443 erreichbar?

### Problem: Environment-Variablen werden nicht geladen

**Lösung**:
```bash
# .env-Datei prüfen
cat /var/www/vhosts/zweitmeinu.ng/httpdocs/.env.production

# Berechtigungen prüfen
ls -la /var/www/vhosts/zweitmeinu.ng/httpdocs/.env.production
# Erwartet: -rw------- 1 psaserv psacln

# PM2 mit Env-Update neu starten
pm2 restart prod-frontend --update-env
```

---

## 📋 Plesk-spezifische Checkliste

- [ ] Node.js Version 20.x in Plesk UI gesetzt
- [ ] Git Extension aktiviert
- [ ] Repository eingerichtet (Branch: main)
- [ ] Post-Deploy Hook konfiguriert mit `sudo -u psaserv`
- [ ] Webhook URL in GitHub eingetragen
- [ ] `.env.production` mit `psaserv:psacln` ownership
- [ ] Backup-Verzeichnis erstellt: `/var/www/vhosts/zweitmeinu.ng/backups/`
- [ ] PM2 Logs gehen nach `/var/www/vhosts/zweitmeinu.ng/logs/`
- [ ] NPM-Befehle NUR mit `sudo -u psaserv` ausführen
- [ ] `httpdocs/` ownership NIEMALS manuell ändern (außer nach Restore)

---

## 🔗 Weiterführende Dokumentation

- **Verzeichnisstruktur Details**: [`PLESK-DIRECTORY-STRUCTURE.md`](./PLESK-DIRECTORY-STRUCTURE.md)
- **Deployment Workflow**: [`DEPLOYMENT-WORKFLOW.md`](./DEPLOYMENT-WORKFLOW.md)
- **Quick Start**: [`DEPLOYMENT-QUICKSTART.md`](./DEPLOYMENT-QUICKSTART.md)

---

**Version**: 1.0
**Plesk Version**: Obsidian Web Pro Edition 18.0.73
**OS**: Debian 12 Bookworm
**Erstellt**: 2025-03-23
