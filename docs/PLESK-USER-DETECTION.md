# Plesk User Detection Guide

**Problem**: `chown: invalid user: 'psaserv:psacln'`

Plesk verwendet unterschiedliche User-Namen je nach Version und Konfiguration.

---

## 🔍 Schritt 1: Korrekten User herausfinden

### Auf dem Server ausführen:

```bash
# SSH auf Server
ssh root@zweitmeinu.ng

# Methode 1: Prüfe httpdocs Ownership
ls -la /var/www/vhosts/zweitmeinu.ng/
# Beispiel Output:
# drwxr-xr-x 10 zweitmeinun psacln  ... httpdocs
# drwxr-xr-x  2 root        root    ... logs

# Methode 2: Prüfe existierende Datei
ls -la /var/www/vhosts/zweitmeinu.ng/httpdocs/
# Beispiel Output:
# -rw-r--r-- 1 zweitmeinun psacln ... package.json

# Methode 3: Plesk System-User auflisten
ls -la /var/www/vhosts/ | grep zweitmeinu.ng
```

---

## 📊 Mögliche User-Namen in Plesk

| Plesk Version | Typischer User | Group | Beispiel |
|---------------|----------------|-------|----------|
| Plesk Obsidian | `<domainname>` | `psacln` oder `psaserv` | `zweitmeinun:psacln` |
| Plesk Onyx | `<domainname>` | `psacln` | `zweitmeinu:psacln` |
| Plesk 12.5+ | `<domainname>` | `psaserv` | `zweitmeinu:psaserv` |
| Alte Plesk | `apache` | `apache` | `apache:apache` |

**Häufigster Fall**: Domain-Name als User (gekürzt auf max. 10 Zeichen)

---

## ✅ Korrekten User verwenden

### Schritt 1: User ermitteln
```bash
# Auf Server
PLESK_USER=$(stat -c '%U' /var/www/vhosts/zweitmeinu.ng/httpdocs)
PLESK_GROUP=$(stat -c '%G' /var/www/vhosts/zweitmeinu.ng/httpdocs)

echo "User: $PLESK_USER"
echo "Group: $PLESK_GROUP"

# Beispiel Output:
# User: zweitmeinun
# Group: psacln
```

### Schritt 2: In allen Befehlen verwenden
```bash
# Statt psaserv:psacln verwenden:
chown $PLESK_USER:$PLESK_GROUP /var/www/vhosts/zweitmeinu.ng/backups
```

---

## 🔧 Deployment-Scripts anpassen

### Option 1: Automatische User-Detection (empfohlen)

Füge am Anfang aller Scripts hinzu:

```bash
#!/bin/bash

# Plesk User automatisch ermitteln
DEPLOY_PATH="/var/www/vhosts/zweitmeinu.ng/httpdocs"
PLESK_USER=$(stat -c '%U' "$DEPLOY_PATH")
PLESK_GROUP=$(stat -c '%G' "$DEPLOY_PATH")

echo "Detected Plesk User: $PLESK_USER:$PLESK_GROUP"

# In Befehlen verwenden:
chown $PLESK_USER:$PLESK_GROUP .env.production
sudo -u $PLESK_USER npm ci
```

### Option 2: Manuelle Anpassung

Ersetze in allen Dokumenten/Scripts:
```bash
# VORHER (funktioniert nicht):
psaserv:psacln

# NACHHER (dein tatsächlicher User):
zweitmeinun:psacln  # Beispiel - ersetze mit deinem User!
```

---

## 📝 Quick Setup mit automatischer Detection

```bash
# SSH auf Server
ssh root@zweitmeinu.ng

# User ermitteln
cd /var/www/vhosts/zweitmeinu.ng
PLESK_USER=$(stat -c '%U' httpdocs)
PLESK_GROUP=$(stat -c '%G' httpdocs)

echo "🔍 Detected User: $PLESK_USER:$PLESK_GROUP"

# Backup-Verzeichnis erstellen
mkdir -p backups
chown $PLESK_USER:$PLESK_GROUP backups
chmod 755 backups

# Environment-Datei erstellen
cd httpdocs
cat > .env.production << 'EOF'
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_STRAPI_URL=https://cms.zweitmeinu.ng/api
# ... weitere Variablen
EOF

chown $PLESK_USER:$PLESK_GROUP .env.production
chmod 600 .env.production

# NPM Build
sudo -u $PLESK_USER npm ci --production=false
sudo -u $PLESK_USER npm run build

# PM2 starten
pm2 start ecosystem.config.js --only prod-frontend
pm2 save

# Prüfen
ls -la .env.production
# Sollte: $PLESK_USER:$PLESK_GROUP als Owner zeigen
```

---

## 🔄 Scripts mit Auto-Detection aktualisieren

Ich erstelle jetzt angepasste Versionen der Scripts mit automatischer User-Detection.

---

**Nächster Schritt**: Teile mir den Output von diesem Befehl mit:

```bash
ssh root@zweitmeinu.ng "ls -la /var/www/vhosts/zweitmeinu.ng/ | grep httpdocs"
```

Dann passe ich alle Scripts und Dokumentationen mit dem korrekten User an.
