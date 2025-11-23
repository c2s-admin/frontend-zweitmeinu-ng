# Quick Plesk Setup - Universal Script

**Problem gelöst**: Funktioniert mit jedem Plesk-User automatisch!

---

## 🚀 One-Command Setup

Kopiere dieses Script auf deinen Server und führe es aus:

```bash
# SSH auf Server
ssh root@zweitmeinu.ng

# Setup-Script erstellen
cat > /tmp/plesk-setup.sh << 'SCRIPT_END'
#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🏥 zweitmeinung.ng Plesk Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Variablen
DOMAIN="zweitmeinu.ng"
VHOST_PATH="/var/www/vhosts/$DOMAIN"
HTTPDOCS="$VHOST_PATH/httpdocs"

# Schritt 1: User auto-detect
echo -e "${YELLOW}🔍 Step 1: Detecting Plesk user...${NC}"
if [ -d "$HTTPDOCS" ]; then
  PLESK_USER=$(stat -c '%U' "$HTTPDOCS" 2>/dev/null || stat -f '%Su' "$HTTPDOCS")
  PLESK_GROUP=$(stat -c '%G' "$HTTPDOCS" 2>/dev/null || stat -f '%Sg' "$HTTPDOCS")
  echo -e "${GREEN}✅ Detected: $PLESK_USER:$PLESK_GROUP${NC}"
else
  echo -e "${RED}❌ Error: $HTTPDOCS not found!${NC}"
  exit 1
fi
echo ""

# Schritt 2: Backup-Verzeichnis erstellen
echo -e "${YELLOW}📦 Step 2: Creating backup directory...${NC}"
mkdir -p "$VHOST_PATH/backups"
chown $PLESK_USER:$PLESK_GROUP "$VHOST_PATH/backups"
chmod 755 "$VHOST_PATH/backups"
echo -e "${GREEN}✅ Backup directory created${NC}"
echo ""

# Schritt 3: Environment-Datei erstellen (falls nicht vorhanden)
echo -e "${YELLOW}🔐 Step 3: Checking environment file...${NC}"
if [ ! -f "$HTTPDOCS/.env.production" ]; then
  echo "Creating .env.production template..."
  cat > "$HTTPDOCS/.env.production" << 'EOF'
# Production Environment - zweitmeinung.ng
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Strapi CMS
NEXT_PUBLIC_STRAPI_URL=https://cms.zweitmeinu.ng/api

# Sentry (Error Tracking)
SENTRY_DSN=https://your-sentry-dsn
SENTRY_ENVIRONMENT=production

# hCaptcha
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-production-site-key
RECAPTCHA_SECRET_KEY=your-production-secret-key

# Rate Limiting
CONTACT_MESSAGES_RATE_LIMIT_WINDOW=60
CONTACT_MESSAGES_RATE_LIMIT_MAX=3

# Healthcare Settings
MEDICAL_DATA_RETENTION_DAYS=3650
ENABLE_GDPR_LOGGING=true
EMERGENCY_CONTACT_PHONE=+4980080441100
EOF

  chown $PLESK_USER:$PLESK_GROUP "$HTTPDOCS/.env.production"
  chmod 600 "$HTTPDOCS/.env.production"

  echo -e "${GREEN}✅ .env.production created${NC}"
  echo -e "${YELLOW}⚠️  WICHTIG: Bitte Secrets in .env.production eintragen!${NC}"
  echo -e "   nano $HTTPDOCS/.env.production"
else
  echo -e "${GREEN}✅ .env.production already exists${NC}"
fi
echo ""

# Schritt 4: Node.js & PM2 prüfen
echo -e "${YELLOW}🔧 Step 4: Checking dependencies...${NC}"

# Node.js
if command -v node &> /dev/null; then
  NODE_VERSION=$(node -v)
  echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"
else
  echo -e "${RED}❌ Node.js not found${NC}"
  echo "Install: curl -fsSL https://deb.nodesource.com/setup_20.x | bash -"
fi

# PM2
if command -v pm2 &> /dev/null; then
  PM2_VERSION=$(pm2 -v)
  echo -e "${GREEN}✅ PM2: $PM2_VERSION${NC}"
else
  echo -e "${YELLOW}⚠️  PM2 not found - installing...${NC}"
  npm install -g pm2
  pm2 startup systemd
fi
echo ""

# Schritt 5: Zusammenfassung
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}📊 Configuration:${NC}"
echo "  Domain: $DOMAIN"
echo "  Plesk User: $PLESK_USER:$PLESK_GROUP"
echo "  Webroot: $HTTPDOCS"
echo "  Backups: $VHOST_PATH/backups"
echo "  Logs: $VHOST_PATH/logs"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Edit environment file:"
echo "   nano $HTTPDOCS/.env.production"
echo ""
echo "2. Configure Plesk Git:"
echo "   - Plesk UI → Git → Add Repository"
echo "   - Repository: https://github.com/c2s-admin/frontend-zweitmeinu-ng.git"
echo "   - Branch: main"
echo "   - Deploy to: /httpdocs"
echo ""
echo "3. Initial build:"
echo "   cd $HTTPDOCS"
echo "   sudo -u $PLESK_USER npm ci --production=false"
echo "   sudo -u $PLESK_USER npm run build"
echo "   pm2 start ecosystem.config.js --only prod-frontend"
echo "   pm2 save"
echo ""
echo -e "${GREEN}🎉 Ready for deployment!${NC}"

SCRIPT_END

# Script ausführbar machen und ausführen
chmod +x /tmp/plesk-setup.sh
/tmp/plesk-setup.sh
```

---

## 📋 Nach dem Setup

### 1. Environment-Variablen eintragen
```bash
# Auf Server
nano /var/www/vhosts/zweitmeinu.ng/httpdocs/.env.production

# Trage deine echten Werte ein:
# - NEXT_PUBLIC_STRAPI_URL
# - SENTRY_DSN
# - NEXT_PUBLIC_RECAPTCHA_SITE_KEY
# - RECAPTCHA_SECRET_KEY
```

### 2. Plesk Git einrichten
1. Plesk UI → **Git** → **Repository hinzufügen**
2. Konfiguration:
   ```
   Repository URL: https://github.com/c2s-admin/frontend-zweitmeinu-ng.git
   Branch: main
   Deployment-Pfad: /httpdocs
   ```
3. **Access Token**: GitHub Personal Access Token
4. **Pull** → Initial Clone

### 3. Post-Deploy Hook in Plesk
Plesk UI → **Git** → Repository → **Zusätzliche Aktionen**:

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

### 4. Initial Build
```bash
cd /var/www/vhosts/zweitmeinu.ng/httpdocs

# User wurde vom Setup-Script erkannt
PLESK_USER=$(stat -c '%U' .)

# Build
sudo -u $PLESK_USER npm ci --production=false
sudo -u $PLESK_USER npm run build

# PM2 starten
pm2 start ecosystem.config.js --only prod-frontend
pm2 save

# Status prüfen
pm2 status
pm2 logs prod-frontend
```

### 5. Health-Check testen
```bash
# Lokal auf Server
curl http://localhost:3000/api/health

# Extern (nach Nginx/Apache Config)
curl https://zweitmeinu.ng/api/health
```

---

## ✅ Verification Checklist

- [ ] Setup-Script erfolgreich ausgeführt
- [ ] Plesk User erkannt (z.B. `zweitmeinun:psacln`)
- [ ] Backup-Verzeichnis existiert
- [ ] `.env.production` erstellt und mit Secrets befüllt
- [ ] Node.js installiert (v20.x+)
- [ ] PM2 installiert und konfiguriert
- [ ] Plesk Git Repository eingerichtet
- [ ] Post-Deploy Hook konfiguriert
- [ ] Initial Build erfolgreich
- [ ] PM2 läuft: `pm2 status`
- [ ] Health-Check OK: `curl localhost:3000/api/health`

---

## 🚨 Troubleshooting

### Script zeigt "Error: /var/www/vhosts/zweitmeinu.ng/httpdocs not found"

**Ursache**: Domain noch nicht in Plesk angelegt

**Lösung**:
1. Plesk UI → **Websites & Domains** → **Domain hinzufügen**
2. Domain: `zweitmeinu.ng`
3. Setup-Script erneut ausführen

### "chown: invalid user" auch nach Auto-Detection

**Ursache**: User existiert nicht oder Berechtigungsproblem

**Debug**:
```bash
# User manuell prüfen
ls -la /var/www/vhosts/zweitmeinu.ng/

# Output sollte zeigen:
# drwxr-xr-x XX <user> <group> ... httpdocs

# Dann manuell verwenden:
PLESK_USER=<user>
PLESK_GROUP=<group>
chown $PLESK_USER:$PLESK_GROUP /var/www/vhosts/zweitmeinu.ng/backups
```

---

## 📞 Support

**Setup-Script funktioniert nicht?**

Teile den Output mit:
```bash
ls -la /var/www/vhosts/zweitmeinu.ng/
```

Dann kann ich das Script anpassen!

---

**Version**: 2.0 (Universal mit Auto-Detection)
**Erstellt**: 2025-03-23
**Kompatibel mit**: Alle Plesk-Versionen
