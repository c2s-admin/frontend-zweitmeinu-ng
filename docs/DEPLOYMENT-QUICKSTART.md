# Deployment Quick Start Guide
**zweitmeinung.ng Healthcare Platform**

Schnellstart-Anleitung für die Einrichtung des Deployment-Workflows auf Plesk.

---

## 🚀 Quick Setup (15 Minuten)

### Phase 1: Server-Vorbereitung (5 Min)

#### 1.1 SSH-Zugriff testen
```bash
# Als Root oder Admin-User
ssh root@zweitmeinu.ng

# Erfolgreiche Verbindung? ✅
```

#### 1.2 Node.js & PM2 installieren/prüfen
```bash
# Node.js Version prüfen (mindestens v20.x)
node -v

# Falls nicht installiert:
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# PM2 global installieren
npm install -g pm2

# PM2 Startup konfigurieren
pm2 startup systemd
# Befehl ausführen, der ausgegeben wird
```

#### 1.3 Verzeichnisstruktur prüfen und erweitern
```bash
# Existierende Struktur prüfen
ls -la /var/www/vhosts/zweitmeinu.ng/
# Erwartet: httpdocs (mporwoll_zw:psaserv), logs (root) existieren bereits

# WICHTIG: Plesk-User automatisch erkennen (empfohlen)
cd /var/www/vhosts/zweitmeinu.ng
PLESK_USER=$(stat -c '%U' httpdocs)
PLESK_GROUP=$(stat -c '%G' httpdocs)

echo "Detected Plesk User: $PLESK_USER:$PLESK_GROUP"
# Output: mporwoll_zw:psaserv

# Nur fehlende Verzeichnisse erstellen
mkdir -p backups
mkdir -p /var/log/pm2

# Berechtigungen setzen (NUR für neue Verzeichnisse)
# httpdocs gehört bereits dem Plesk-User (von Plesk verwaltet)
chown $PLESK_USER:$PLESK_GROUP backups
chmod 755 backups

# PM2 Logs können von root verwaltet werden
chown root:root /var/log/pm2
chmod 755 /var/log/pm2

# WICHTIG: httpdocs NICHT anfassen - wird von Plesk verwaltet!
```

---

### Phase 2: Plesk Git-Integration (5 Min)

#### 2.1 Git Extension aktivieren
1. Plesk UI → **Erweiterungen**
2. Suche: "Git"
3. **Installieren** (falls nicht vorhanden)

#### 2.2 GitHub Personal Access Token erstellen
1. GitHub → **Settings** → **Developer Settings** → **Personal Access Tokens** → **Tokens (classic)**
2. **Generate new token (classic)**
3. Scopes auswählen:
   - ✅ `repo` (Full control of private repositories)
4. Token kopieren (wird nur einmal angezeigt!)

#### 2.3 Repository in Plesk einrichten

**Für Production:**
1. Plesk UI → **Websites & Domains** → `zweitmeinu.ng`
2. **Git** → **Repository hinzufügen**
3. Konfiguration:
   ```
   Repository URL: https://github.com/c2s-admin/frontend-zweitmeinu-ng.git
   Branch: main
   Deployment-Pfad: /httpdocs
   ```
4. **Access Token**: Personal Access Token einfügen
5. **Speichern & Pull** → Initialer Clone

**Für Development (optional):**
- Gleiche Schritte, aber:
  - Domain: `dev.zweitmeinu.ng`
  - Branch: `development`

---

### Phase 3: Environment-Konfiguration (5 Min)

#### 3.1 Environment-Dateien erstellen

**Production:**
```bash
ssh root@zweitmeinu.ng
cd /var/www/vhosts/zweitmeinu.ng

# User automatisch erkennen
PLESK_USER=$(stat -c '%U' httpdocs)
PLESK_GROUP=$(stat -c '%G' httpdocs)
echo "Using Plesk User: $PLESK_USER:$PLESK_GROUP"
# Output: mporwoll_zw:psaserv

cd httpdocs

# .env.production erstellen (als root, dann ownership ändern)
cat > .env.production << 'EOF'
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_STRAPI_URL=https://cms.zweitmeinu.ng/api
SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key
# ... weitere Variablen aus Template anpassen
EOF

# WICHTIG: Berechtigungen für Plesk-User setzen
chown $PLESK_USER:$PLESK_GROUP .env.production
chmod 600 .env.production

# Prüfen
ls -la .env.production
# Erwartet: -rw------- 1 mporwoll_zw psaserv ... .env.production
```

**Development (analog):**
```bash
cd /var/www/vhosts/dev.zweitmeinu.ng/httpdocs
nano .env.development
chmod 600 .env.development
```

#### 3.2 PM2 Ecosystem konfigurieren

```bash
# ecosystem.config.js ist bereits im Repo
# Pfade in der Datei prüfen und ggf. anpassen
cd /var/www/vhosts/zweitmeinu.ng/httpdocs
cat ecosystem.config.js
```

---

### Phase 4: Initial Deployment (3 Min)

#### 4.1 Manuelles Build & Start

**Production:**
```bash
cd /var/www/vhosts/zweitmeinu.ng

# User automatisch erkennen
PLESK_USER=$(stat -c '%U' httpdocs)
echo "Building as user: $PLESK_USER"
# Output: mporwoll_zw

cd httpdocs

# WICHTIG: Als Plesk-User arbeiten (für NPM-Berechtigungen)
# Option 1: Als root mit korrekten Berechtigungen (empfohlen)
sudo -u $PLESK_USER npm ci --production=false
sudo -u $PLESK_USER npm run build

# Option 2: User wechseln (falls sudo nicht funktioniert)
# su - mporwoll_zw -s /bin/bash
# cd /var/www/vhosts/zweitmeinu.ng/httpdocs
# npm ci --production=false
# npm run build
# exit

# PM2 starten (als root, läuft als Systemdienst)
pm2 start ecosystem.config.js --only prod-frontend
pm2 save

# Status prüfen
pm2 status
pm2 logs prod-frontend --lines 50
```

#### 4.2 Health-Check testen
```bash
# Lokal auf Server
curl http://localhost:3000/api/health

# Extern (nach Firewall/Proxy-Setup)
curl https://zweitmeinu.ng/api/health
```

---

### Phase 5: Automatisches Deployment einrichten (5 Min)

#### 5.1 Plesk Deployment-Aktionen konfigurieren

1. Plesk UI → **Git** → Repository auswählen
2. **Zusätzliche Aktionen** → **Nach Deployment**
3. Script einfügen:

```bash
#!/bin/bash
cd {DEPLOY_PATH}

# Dependencies & Build
npm ci --production=false
npm run build

# PM2 Restart
if [ -f "/var/www/vhosts/zweitmeinu.ng/httpdocs/ecosystem.config.js" ]; then
  pm2 reload prod-frontend || pm2 start ecosystem.config.js --only prod-frontend
  pm2 save
fi
```

4. **Speichern**

#### 5.2 GitHub Webhook einrichten

1. GitHub Repo → **Settings** → **Webhooks** → **Add webhook**
2. Konfiguration:
   ```
   Payload URL: [Kopiere aus Plesk Git-Settings → Webhook URL]
   Content type: application/json
   Secret: [Kopiere aus Plesk Git-Settings → Webhook Secret]
   Events: ☑ Just the push event
   Active: ✅
   ```
3. **Add webhook**

#### 5.3 Automatisches Deployment testen

```bash
# Auf Development-Maschine
git checkout main
git pull origin main

# Kleine Änderung machen
echo "# Test deployment" >> README.md
git add README.md
git commit -m "test: automatic deployment"
git push origin main

# 🎉 Webhook sollte Plesk-Deployment triggern
# Logs ansehen auf Server: pm2 logs prod-frontend
```

---

## 🎯 Daily Workflow

### Entwicklung → Development Server
```bash
# Feature entwickeln
git checkout development
git checkout -b feature/neue-funktion

# Entwickeln...
git add .
git commit -m "feat: neue Funktion"
git push origin feature/neue-funktion

# Merge in development
git checkout development
git merge feature/neue-funktion
git push origin development

# ✅ Auto-Deploy auf dev.zweitmeinu.ng
```

### Development → Production
```bash
# 1. GitHub PR erstellen: development → main
# 2. Review & Tests abwarten
# 3. PR mergen
# ✅ Auto-Deploy auf zweitmeinu.ng
```

### Notfall-Rollback
```bash
# SSH auf Server
ssh root@zweitmeinu.ng

# Rollback-Script ausführen
cd /var/www/vhosts/zweitmeinu.ng/httpdocs
./scripts/rollback.sh production
```

---

## 📊 Monitoring & Logs

### PM2 Commands
```bash
# Status aller Prozesse
pm2 status

# Logs live verfolgen
pm2 logs prod-frontend

# Resource-Nutzung
pm2 monit

# Prozess neustarten
pm2 restart prod-frontend

# Prozess Details
pm2 describe prod-frontend
```

### Health-Checks
```bash
# Lokal
curl http://localhost:3000/api/health | jq

# Extern
curl https://zweitmeinu.ng/api/health | jq
```

### Log-Dateien
```bash
# PM2 Logs
tail -f /var/log/pm2/prod-frontend-out.log
tail -f /var/log/pm2/prod-frontend-error.log

# Next.js Build Logs
cat /var/www/vhosts/zweitmeinu.ng/httpdocs/.next/build-manifest.json
```

---

## 🔧 Troubleshooting

### Problem: "Deployment schlägt fehl"

**Lösung 1: Manueller Build**
```bash
cd /var/www/vhosts/zweitmeinu.ng/httpdocs
npm ci
npm run build
pm2 restart prod-frontend
```

**Lösung 2: Node-Modules neu installieren**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Problem: "Port bereits in Verwendung"

```bash
# Prozess auf Port 3000 finden
lsof -i :3000

# PM2 Prozess killen
pm2 delete prod-frontend
pm2 start ecosystem.config.js --only prod-frontend
```

### Problem: "Environment-Variablen fehlen"

```bash
# .env-Datei prüfen
cat /var/www/vhosts/zweitmeinu.ng/httpdocs/.env.production

# PM2 mit neuen Env-Vars neustarten
pm2 restart prod-frontend --update-env
```

### Problem: "Webhook funktioniert nicht"

**Checks:**
1. GitHub Webhook-Logs prüfen (GitHub → Settings → Webhooks → Recent Deliveries)
2. Plesk Git-Logs ansehen (Plesk UI → Git → Repository → Logs)
3. Firewall-Regel prüfen:
   ```bash
   # Port 8443 für Plesk muss erreichbar sein
   ufw status
   ```

---

## 🔐 Sicherheits-Checkliste

- [ ] SSH Key-Auth aktiviert (Passwort deaktiviert)
- [ ] `.env.*` Dateien haben `chmod 600`
- [ ] GitHub Token sicher gespeichert
- [ ] Plesk SSL Let's Encrypt aktiviert
- [ ] Firewall nur Port 80/443 öffentlich
- [ ] `NODE_ENV=production` auf Live-Server
- [ ] Backup-Routine eingerichtet

---

## 📞 Support

### Wichtige URLs
- **Production**: https://zweitmeinu.ng
- **Development**: https://dev.zweitmeinu.ng
- **Plesk Admin**: https://zweitmeinu.ng:8443
- **Health-Check**: https://zweitmeinu.ng/api/health

### Dokumentation
- **Full Deployment Guide**: [`docs/DEPLOYMENT-WORKFLOW.md`](./DEPLOYMENT-WORKFLOW.md)
- **Healthcare Standards**: [`CLAUDE.md`](../CLAUDE.md)

### Scripts
- **Deployment**: `./scripts/deploy.sh production`
- **Rollback**: `./scripts/rollback.sh production`
- **Plesk Hook**: `./scripts/plesk-post-deploy.sh`

---

**Quick Start Version**: 1.0
**Estimated Setup Time**: 15-20 Minuten
**Last Updated**: 2025-03-23
