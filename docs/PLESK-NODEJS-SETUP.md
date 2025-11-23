# Plesk Node.js Manager Setup - zweitmeinung.ng

**Server**: complexcaresolutions
**Domain**: zweitmeinu.ng
**Plesk Version**: Obsidian Web Pro Edition 18.0.73

---

## 🎯 Plesk Node.js Manager Konfiguration

### **Schritt 1: Node.js Anwendung aktivieren**

In Plesk UI navigieren zu:
```
Websites & Domains → zweitmeinu.ng → Node.js
```

### **Schritt 2: Anwendungseinstellungen**

| Einstellung | Wert | Hinweis |
|------------|------|---------|
| **Node.js Version** | `20.x.x` oder neuer | Aktuellste LTS Version wählen |
| **Anwendungsmodus** | `Production` | NICHT Development |
| **Anwendungsstartdatei** | `server.js` | ✅ Diese Datei muss existieren |
| **Anwendungsverzeichnis** | `/httpdocs` | Pfad zum Next.js Projekt |
| **Dokumentenstamm** | `/httpdocs/public` | Next.js public Ordner |

### **Schritt 3: Umgebungsvariablen**

In Plesk unter "Custom environment variables":

```bash
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_STRAPI_URL=https://st.zh3.de/api
SENTRY_DSN=your-sentry-dsn
SENTRY_ENVIRONMENT=production
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-hcaptcha-site-key
RECAPTCHA_SECRET_KEY=your-hcaptcha-secret-key
HCAPTCHA_SECRET_KEY=your-hcaptcha-secret-key
CAPTCHA_PROVIDER=hcaptcha
CAPTCHA_ENABLED=true
CONTACT_MESSAGES_RATE_LIMIT_WINDOW=60
CONTACT_MESSAGES_RATE_LIMIT_MAX=3
MEDICAL_DATA_RETENTION_DAYS=3650
ENABLE_GDPR_LOGGING=true
EMERGENCY_CONTACT_PHONE=+4980080441100
```

### **Schritt 4: NPM Installation**

In Plesk Node.js Manager auf **"NPM Install"** klicken oder manuell:

```bash
ssh root@zweitmeinu.ng
cd /var/www/vhosts/zweitmeinu.ng/httpdocs
npm ci --production=false
npm run build
```

### **Schritt 5: Anwendung starten**

**Option A - Über Plesk UI:**
```
Node.js → "Enable Node.js" → "Restart App"
```

**Option B - Manuell (falls Plesk Manager nicht funktioniert):**
```bash
# Als root oder mit sudo
cd /var/www/vhosts/zweitmeinu.ng/httpdocs
node server.js
```

---

## 🔍 Troubleshooting

### **Fehler: "Anwendungsstartdatei server.js Die Datei ist nicht vorhanden"**

**Ursache**: Die `server.js` Datei fehlt oder hat falsche Permissions.

**Lösung**:
```bash
cd /var/www/vhosts/zweitmeinu.ng/httpdocs

# Prüfen ob server.js existiert
ls -la server.js

# Falls nicht vorhanden, aus Git pullen:
git pull origin main

# Oder manuell erstellen (siehe unten)
```

**server.js manuell erstellen:**
```bash
cat > server.js << 'EOF'
#!/usr/bin/env node
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(port, '0.0.0.0', (err) => {
    if (err) throw err
    console.log(\`✅ Next.js server ready on http://0.0.0.0:\${port}\`)
  })
})
EOF

# Permissions setzen
chmod 755 server.js
chown mporwoll_zw:psaserv server.js
```

### **Fehler: "Web application could not be started" (Passenger Error)**

**Ursache**: Phusion Passenger kann die Anwendung nicht starten.

**Mögliche Lösungen**:

1. **Build fehlt:**
```bash
cd /var/www/vhosts/zweitmeinu.ng/httpdocs
npm run build
```

2. **Node-Module fehlen:**
```bash
npm ci --production=false
```

3. **Permissions falsch:**
```bash
PLESK_USER=$(stat -c '%U' /var/www/vhosts/zweitmeinu.ng/httpdocs)
PLESK_GROUP=$(stat -c '%G' /var/www/vhosts/zweitmeinu.ng/httpdocs)
chown -R $PLESK_USER:$PLESK_GROUP /var/www/vhosts/zweitmeinu.ng/httpdocs
```

4. **Logs prüfen:**
```bash
tail -f /var/www/vhosts/zweitmeinu.ng/logs/error_log
tail -f /var/www/vhosts/zweitmeinu.ng/logs/proxy_error_log
```

### **Fehler: "duplicate location /" in Nginx**

**Ursache**: Plesk Node.js Manager erstellt automatisch einen Nginx Proxy.

**Lösung**:
- ✅ **Alle manuellen Nginx-Direktiven entfernen**
- ✅ **Plesk Node.js Manager übernimmt Nginx-Konfiguration automatisch**

```bash
# In Plesk UI:
# Websites & Domains → Apache & nginx Settings → Additional nginx directives
# → LÖSCHEN: Alle location / Blöcke
```

---

## 🔄 Alternative: PM2 statt Plesk Node.js Manager

Falls Plesk Node.js Manager Probleme macht, verwenden Sie PM2:

```bash
# PM2 installieren
npm install -g pm2

# Anwendung starten
cd /var/www/vhosts/zweitmeinu.ng/httpdocs
pm2 start ecosystem.config.js --env production

# PM2 Auto-Start aktivieren
pm2 startup
pm2 save
```

**Nginx Proxy manuell konfigurieren:**

```bash
# /var/www/vhosts/system/zweitmeinu.ng/conf/vhost_nginx.conf
cat > /var/www/vhosts/system/zweitmeinu.ng/conf/vhost_nginx.conf << 'EOF'
server {
    listen 443 ssl http2;
    server_name zweitmeinu.ng www.zweitmeinu.ng;

    # SSL Zertifikate (von Plesk automatisch verwaltet)
    ssl_certificate /opt/psa/var/certificates/scf...
    ssl_certificate_key /opt/psa/var/certificates/scf...

    # Next.js Proxy
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Next.js Static Files
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Nginx neu laden
nginx -t && systemctl reload nginx
```

---

## ✅ Verification Checklist

Nach der Konfiguration prüfen:

- [ ] **server.js existiert** in `/var/www/vhosts/zweitmeinu.ng/httpdocs/`
- [ ] **npm install** erfolgreich durchgeführt
- [ ] **npm run build** erfolgreich abgeschlossen
- [ ] **Plesk Node.js "Enable"** aktiviert
- [ ] **Health-Check funktioniert**: `curl https://zweitmeinu.ng/api/health`
- [ ] **Homepage lädt**: `curl https://zweitmeinu.ng/`
- [ ] **Keine Nginx-Fehler**: `nginx -t`
- [ ] **Logs zeigen keine Fehler**: `tail -f /var/www/vhosts/zweitmeinu.ng/logs/*`

---

## 📊 Expected Results

**Erfolgreich konfiguriert:**
```bash
# Health Check
curl https://zweitmeinu.ng/api/health
# Response:
{
  "status": "healthy",
  "strapi": "connected",
  "environment": "production",
  "uptime": 12345,
  "responseTime": "50ms"
}

# Homepage
curl -I https://zweitmeinu.ng/
# Response:
HTTP/2 200
content-type: text/html; charset=utf-8
```

**Plesk Node.js Manager Status:**
```
✅ Application running
✅ Node.js version: 20.x.x
✅ Mode: Production
✅ Startup file: server.js
```

---

## 🔗 Weitere Ressourcen

- **DEPLOYMENT-WORKFLOW.md** - Vollständiger Deployment-Guide
- **DEPLOYMENT-QUICKSTART.md** - 15-Minuten Setup
- **SETUP-COMMANDS-ZWEITMEINU.md** - Server-spezifische Befehle
- **PLESK-DIRECTORY-STRUCTURE.md** - Verzeichnisstruktur

---

**Erstellt**: 2025-11-23
**Server**: zweitmeinu.ng (complexcaresolutions)
**Plesk**: Obsidian Web Pro Edition 18.0.73
