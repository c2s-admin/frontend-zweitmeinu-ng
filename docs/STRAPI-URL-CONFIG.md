# Strapi URL Configuration - zweitmeinung.ng

**Strapi Server**: `st.zh3.de`

---

## 📝 Korrekte Strapi-URL für Production

```bash
# Production Strapi Server
NEXT_PUBLIC_STRAPI_URL=https://st.zh3.de/api
```

---

## 🔧 Update auf dem Server

```bash
ssh root@zweitmeinu.ng
cd /var/www/vhosts/zweitmeinu.ng/httpdocs

# .env.production bearbeiten
nano .env.production
```

**Wichtige Zeile ändern:**
```bash
# VORHER (falsch):
# NEXT_PUBLIC_STRAPI_URL=https://cms.zweitmeinu.ng/api

# NACHHER (korrekt):
NEXT_PUBLIC_STRAPI_URL=https://st.zh3.de/api
```

**Komplette .env.production:**
```bash
# Production Environment - zweitmeinung.ng
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# ✅ Strapi CMS - KORREKTE URL
NEXT_PUBLIC_STRAPI_URL=https://st.zh3.de/api

# Sentry Error Tracking
SENTRY_DSN=your-sentry-dsn
SENTRY_ENVIRONMENT=production
SENTRY_RELEASE=1.0.0

# hCaptcha
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-hcaptcha-site-key
RECAPTCHA_SECRET_KEY=your-hcaptcha-secret-key
CAPTCHA_PROVIDER=hcaptcha
CAPTCHA_ENABLED=true

# Rate Limiting (Production)
CONTACT_MESSAGES_RATE_LIMIT_WINDOW=60
CONTACT_MESSAGES_RATE_LIMIT_MAX=3

# Healthcare Settings
MEDICAL_DATA_RETENTION_DAYS=3650
ENABLE_GDPR_LOGGING=true
EMERGENCY_CONTACT_PHONE=+4980080441100
```

**Nach der Änderung:**
```bash
# PM2 neu starten mit neuen Environment-Variablen
pm2 restart prod-frontend --update-env

# Health-Check testen
curl http://localhost:3000/api/health | jq

# Strapi-Verbindung sollte jetzt "connected" sein:
# "strapi": "connected"
```

---

## 🔍 Strapi-Verbindung testen

```bash
# Direkt Strapi testen
curl https://st.zh3.de/api

# Erwartete Antwort (Strapi Welcome):
# {"data":null,"meta":{"server":"Strapi","strapi":"5.x.x",...}}

# Oder spezifischer Endpoint:
curl https://st.zh3.de/api/site-config
```

---

## 📊 Verification Checklist

- [ ] `.env.production` mit `NEXT_PUBLIC_STRAPI_URL=https://st.zh3.de/api` aktualisiert
- [ ] PM2 neu gestartet: `pm2 restart prod-frontend --update-env`
- [ ] Health-Check zeigt `"strapi":"connected"`
- [ ] Strapi-Server erreichbar: `curl https://st.zh3.de/api`
- [ ] Next.js kann Strapi-Daten laden

---

**Server**: st.zh3.de
**Strapi Version**: 5.20.0
**Erstellt**: 2025-11-23
