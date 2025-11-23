# Setup Commands - zweitmeinung.ng (Server-spezifisch)

**Server**: complexcaresolutions
**Domain**: zweitmeinu.ng
**Plesk User**: `mporwoll_zw`
**Plesk Group**: `psaserv`

---

## 🚀 Complete Setup (Copy & Paste)

```bash
#!/bin/bash
# SSH auf Server
ssh root@zweitmeinu.ng

# === SCHRITT 1: User-Konfiguration ===
DOMAIN="zweitmeinu.ng"
VHOST="/var/www/vhosts/$DOMAIN"
PLESK_USER="mporwoll_zw"
PLESK_GROUP="psaserv"

echo "🔧 Setup für $DOMAIN"
echo "👤 Plesk User: $PLESK_USER:$PLESK_GROUP"

# === SCHRITT 2: Verzeichnisse erstellen ===
cd $VHOST

# Backup-Verzeichnis
mkdir -p backups
chown $PLESK_USER:$PLESK_GROUP backups
chmod 755 backups

echo "✅ Backup-Verzeichnis erstellt"

# === SCHRITT 3: Environment-Datei erstellen ===
cd httpdocs

cat > .env.production << 'EOF'
# Production Environment - zweitmeinung.ng
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Strapi CMS - ANPASSEN!
NEXT_PUBLIC_STRAPI_URL=https://cms.zweitmeinu.ng/api

# Sentry Error Tracking - ANPASSEN!
SENTRY_DSN=https://your-sentry-dsn
SENTRY_ENVIRONMENT=production
SENTRY_RELEASE=1.0.0

# hCaptcha - ANPASSEN!
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-production-site-key
RECAPTCHA_SECRET_KEY=your-production-secret-key

# Rate Limiting (Production)
CONTACT_MESSAGES_RATE_LIMIT_WINDOW=60
CONTACT_MESSAGES_RATE_LIMIT_MAX=3

# Analytics - ANPASSEN (Optional)
# NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Healthcare Settings
MEDICAL_DATA_RETENTION_DAYS=3650
ENABLE_GDPR_LOGGING=true
EMERGENCY_CONTACT_PHONE=+4980080441100
EOF

# Berechtigungen setzen
chown $PLESK_USER:$PLESK_GROUP .env.production
chmod 600 .env.production

echo "✅ .env.production erstellt"
echo "⚠️  WICHTIG: Secrets in .env.production eintragen!"

# Prüfen
ls -la .env.production
# Erwartet: -rw------- 1 mporwoll_zw psaserv ... .env.production

# === SCHRITT 4: Dependencies & Build ===
echo "📦 Installing dependencies..."
sudo -u $PLESK_USER npm ci --production=false

echo "🔨 Building application..."
sudo -u $PLESK_USER npm run build

echo "✅ Build completed"

# === SCHRITT 5: PM2 starten ===
echo "🚀 Starting PM2..."

# PM2 starten
pm2 start ecosystem.config.js --only prod-frontend
pm2 save

# PM2 Startup konfigurieren (falls noch nicht)
pm2 startup systemd

echo "✅ PM2 gestartet"

# === SCHRITT 6: Status prüfen ===
echo ""
echo "📊 Status Check:"
pm2 status

echo ""
echo "🏥 Health Check:"
sleep 5
curl -s http://localhost:3000/api/health | jq || curl -s http://localhost:3000/api/health

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "📋 Nächste Schritte:"
echo "1. Secrets eintragen: nano $VHOST/httpdocs/.env.production"
echo "2. Plesk Git einrichten (siehe Dokumentation)"
echo "3. PM2 Logs prüfen: pm2 logs prod-frontend"
echo ""
echo "🔗 Logs:"
echo "  - PM2: pm2 logs prod-frontend"
echo "  - Error: tail -f $VHOST/logs/prod-frontend-error.log"
echo "  - Output: tail -f $VHOST/logs/prod-frontend-out.log"
```

---

## 📝 Individual Commands

### User & Verzeichnis Setup
```bash
# Variablen setzen
DOMAIN="zweitmeinu.ng"
VHOST="/var/www/vhosts/$DOMAIN"
PLESK_USER="mporwoll_zw"
PLESK_GROUP="psaserv"

# Backup-Verzeichnis
cd $VHOST
mkdir -p backups
chown $PLESK_USER:$PLESK_GROUP backups
chmod 755 backups
```

### Environment-Datei
```bash
cd /var/www/vhosts/zweitmeinu.ng/httpdocs

# Template erstellen
cp .env.production.example .env.production

# Oder manuell bearbeiten
nano .env.production

# Berechtigungen setzen
chown mporwoll_zw:psaserv .env.production
chmod 600 .env.production
```

### NPM Build
```bash
cd /var/www/vhosts/zweitmeinu.ng/httpdocs

# Als Plesk-User ausführen
sudo -u mporwoll_zw npm ci --production=false
sudo -u mporwoll_zw npm run build
```

### PM2 Management
```bash
# Starten
pm2 start ecosystem.config.js --only prod-frontend
pm2 save

# Status
pm2 status

# Logs
pm2 logs prod-frontend

# Restart
pm2 restart prod-frontend

# Stop
pm2 stop prod-frontend

# Delete
pm2 delete prod-frontend
```

---

## 🔧 Plesk Git Integration

### Post-Deploy Hook (Plesk UI)
Plesk UI → **Git** → Repository → **Zusätzliche Aktionen**:

```bash
#!/bin/bash
cd /var/www/vhosts/zweitmeinu.ng/httpdocs

# User für zweitmeinung.ng
PLESK_USER="mporwoll_zw"

# Build
sudo -u $PLESK_USER npm ci --production=false
sudo -u $PLESK_USER npm run build

# PM2 Restart
pm2 reload prod-frontend || pm2 start ecosystem.config.js --only prod-frontend
pm2 save

echo "✅ Deployment complete"
```

**ODER** (mit Auto-Detection - universell):

```bash
#!/bin/bash
cd /var/www/vhosts/zweitmeinu.ng/httpdocs

# User automatisch erkennen
PLESK_USER=$(stat -c '%U' .)

# Build
sudo -u $PLESK_USER npm ci --production=false
sudo -u $PLESK_USER npm run build

# PM2 Restart
pm2 reload prod-frontend || pm2 start ecosystem.config.js --only prod-frontend
pm2 save
```

---

## 🔍 Debugging Commands

### Check Permissions
```bash
# httpdocs Ownership prüfen
ls -la /var/www/vhosts/zweitmeinu.ng/httpdocs/

# Backup Ownership prüfen
ls -la /var/www/vhosts/zweitmeinu.ng/backups/

# .env Permissions prüfen
ls -la /var/www/vhosts/zweitmeinu.ng/httpdocs/.env.production
# Erwartet: -rw------- 1 mporwoll_zw psaserv
```

### Fix Permissions (falls nötig)
```bash
cd /var/www/vhosts/zweitmeinu.ng

# httpdocs Ownership wiederherstellen (nur im Notfall!)
chown -R mporwoll_zw:psaserv httpdocs/

# node_modules Ownership korrigieren (nach fehlerhaftem npm install)
chown -R mporwoll_zw:psaserv httpdocs/node_modules/
chown -R mporwoll_zw:psaserv httpdocs/.next/
```

### Check Logs
```bash
# PM2 Logs
pm2 logs prod-frontend --lines 100

# PM2 Error Log
tail -f /var/www/vhosts/zweitmeinu.ng/logs/prod-frontend-error.log

# PM2 Output Log
tail -f /var/www/vhosts/zweitmeinu.ng/logs/prod-frontend-out.log

# Plesk Web-Server Logs
tail -f /var/www/vhosts/zweitmeinu.ng/logs/error_log
```

### Health Check
```bash
# Lokal
curl http://localhost:3000/api/health | jq

# Extern (nach Nginx/Apache Config)
curl https://zweitmeinu.ng/api/health | jq

# Verbose
curl -v http://localhost:3000/api/health
```

### Process Status
```bash
# PM2 Status
pm2 status

# PM2 Details
pm2 describe prod-frontend

# PM2 Monitoring
pm2 monit

# Node.js Prozesse
ps aux | grep node
```

---

## 🚨 Troubleshooting

### Problem: npm install schlägt fehl (Permission denied)

**Lösung**:
```bash
cd /var/www/vhosts/zweitmeinu.ng/httpdocs

# node_modules mit falschen Berechtigungen löschen
rm -rf node_modules .next

# Ownership korrigieren
chown -R mporwoll_zw:psaserv .

# Korrekt installieren
sudo -u mporwoll_zw npm ci --production=false
```

### Problem: PM2 startet nicht

**Lösung**:
```bash
# Logs prüfen
pm2 logs prod-frontend --err

# .env-Datei prüfen
cat /var/www/vhosts/zweitmeinu.ng/httpdocs/.env.production

# Port-Konflikt prüfen
lsof -i :3000

# PM2 neu starten
pm2 delete prod-frontend
pm2 start ecosystem.config.js --only prod-frontend
pm2 save
```

### Problem: Health-Check schlägt fehl

**Lösung**:
```bash
# Prüfen ob Prozess läuft
pm2 status

# Prüfen ob Port offen
curl http://localhost:3000/api/health

# Build-Fehler prüfen
cd /var/www/vhosts/zweitmeinu.ng/httpdocs
sudo -u mporwoll_zw npm run build
```

---

## 📦 Deployment Scripts

Alle Scripts funktionieren automatisch mit User-Detection:

```bash
# Manuelles Deployment
cd /var/www/vhosts/zweitmeinu.ng/httpdocs
./scripts/deploy.sh production

# Rollback
./scripts/rollback.sh production

# Scripts zeigen automatisch:
# ✅ Detected Plesk User: mporwoll_zw:psaserv
```

---

## ✅ Verification Checklist

- [ ] Backup-Verzeichnis existiert: `/var/www/vhosts/zweitmeinu.ng/backups/`
- [ ] Backup-Verzeichnis Owner: `mporwoll_zw:psaserv`
- [ ] `.env.production` existiert mit korrekten Secrets
- [ ] `.env.production` Permissions: `600` (mporwoll_zw:psaserv)
- [ ] `node_modules/` Owner: `mporwoll_zw:psaserv`
- [ ] Build erfolgreich: `.next/` Verzeichnis existiert
- [ ] PM2 läuft: `pm2 status` zeigt `online`
- [ ] Health-Check OK: `curl localhost:3000/api/health` → HTTP 200
- [ ] Logs werden geschrieben: `/var/www/vhosts/zweitmeinu.ng/logs/prod-*`

---

**Server**: complexcaresolutions
**Domain**: zweitmeinu.ng
**User**: mporwoll_zw:psaserv
**Erstellt**: 2025-03-23
**Zuletzt getestet**: 2025-03-23
