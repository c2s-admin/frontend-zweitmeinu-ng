# Plesk Verzeichnisstruktur - zweitmeinung.ng

**Plesk Obsidian Web Pro Edition 18.0.73**
**Debian 12 Bookworm**

---

## 📁 Existierende Plesk-Struktur

### Verzeichnis-Übersicht
```
/var/www/vhosts/zweitmeinu.ng/
├── httpdocs/          # Webroot (psaserv:psacln)
│   ├── .next/         # Next.js Build-Output
│   ├── node_modules/  # NPM Dependencies
│   ├── src/           # Source Code (aus Git)
│   ├── public/        # Static Assets
│   ├── .env.production  # Environment-Variablen (600)
│   └── ...
├── logs/              # Plesk Logs (root:root)
│   ├── error_log      # Apache/Nginx Error Log
│   ├── access_log     # Access Log
│   ├── prod-frontend-error.log  # PM2 Error Log
│   └── prod-frontend-out.log    # PM2 Output Log
└── backups/           # Deployment Backups (psaserv:psacln) - NEU
    ├── backup-20250323-143022/
    ├── backup-20250323-150145/
    └── ...
```

### Berechtigungen (Owner:Group)

| Verzeichnis/Datei | Owner | Group | Permissions | Zweck |
|-------------------|-------|-------|-------------|-------|
| `/var/www/vhosts/zweitmeinu.ng/` | root | root | 755 | Plesk Hauptverzeichnis |
| `httpdocs/` | psaserv | psacln | 755 | Webroot (von Plesk verwaltet) |
| `logs/` | root | root | 755 | Plesk Log-Verzeichnis |
| `backups/` | psaserv | psacln | 755 | Deployment-Backups (neu erstellt) |
| `.env.production` | psaserv | psacln | 600 | Secrets (nur Owner lesen/schreiben) |
| `.next/` | psaserv | psacln | 755 | Build-Output |
| `node_modules/` | psaserv | psacln | 755 | NPM Dependencies |

---

## 🔐 Berechtigungs-Konzept

### Plesk Standard-User: `psaserv`
- **Zweck**: Plesk Service-Account für Website-Verwaltung
- **Group**: `psacln` (Plesk Client Group)
- **Verwendung**: Alle Dateien in `httpdocs/` gehören diesem User

### Warum `psaserv` statt `www-data`?
Plesk verwendet eigene User-Struktur:
- `www-data` → Standard Apache/Nginx User (läuft als Web-Server)
- `psaserv` → Plesk Dateisystem-Owner (für FTP, Git, File Manager)

**Best Practice**:
- Dateien: `psaserv:psacln` (Dateisystem-Zugriff)
- Prozesse: Laufen als `www-data` (Web-Server) oder `root` (PM2)

---

## 🛠️ Setup-Anpassungen für existierende Struktur

### 1. Backup-Verzeichnis erstellen
```bash
# Als root auf Server
ssh root@zweitmeinu.ng

# Backup-Verzeichnis erstellen
mkdir -p /var/www/vhosts/zweitmeinu.ng/backups
chown psaserv:psacln /var/www/vhosts/zweitmeinu.ng/backups
chmod 755 /var/www/vhosts/zweitmeinu.ng/backups

# Prüfen
ls -la /var/www/vhosts/zweitmeinu.ng/
# Erwartet:
# drwxr-xr-x 2 psaserv psacln ... backups
# drwxr-xr-x X psaserv psacln ... httpdocs
# drwxr-xr-x 2 root     root   ... logs
```

### 2. Environment-Datei erstellen
```bash
cd /var/www/vhosts/zweitmeinu.ng/httpdocs

# Als root erstellen
cat > .env.production << 'EOF'
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_STRAPI_URL=https://cms.zweitmeinu.ng/api
# ... weitere Variablen
EOF

# Plesk-User als Owner setzen
chown psaserv:psacln .env.production
chmod 600 .env.production

# Prüfen
ls -la .env.production
# Erwartet: -rw------- 1 psaserv psacln ... .env.production
```

### 3. NPM/Node-Befehle ausführen
```bash
# Option 1: Als psaserv-User (empfohlen)
su - psaserv -s /bin/bash
cd /var/www/vhosts/zweitmeinu.ng/httpdocs
npm ci --production=false
npm run build
exit

# Option 2: Als root mit sudo (Scripts verwenden dies)
sudo -u psaserv npm ci --production=false
sudo -u psaserv npm run build

# WICHTIG: Niemals als root OHNE sudo -u ausführen!
# Das würde node_modules mit root:root ownership erstellen
```

### 4. PM2 Log-Pfade
```bash
# PM2 Logs gehen in Plesk logs/ Verzeichnis
# Siehe ecosystem.config.js:
# error_file: '/var/www/vhosts/zweitmeinu.ng/logs/prod-frontend-error.log'
# out_file: '/var/www/vhosts/zweitmeinu.ng/logs/prod-frontend-out.log'

# Logs ansehen
tail -f /var/www/vhosts/zweitmeinu.ng/logs/prod-frontend-out.log

# Oder via PM2
pm2 logs prod-frontend
```

---

## 📋 Plesk Git Integration

### Git-Repository in Plesk
1. Plesk UI → **Git** → **Repository hinzufügen**
2. Konfiguration:
   ```
   Repository URL: https://github.com/c2s-admin/frontend-zweitmeinu-ng.git
   Branch: main
   Deployment-Pfad: /httpdocs
   ```
3. **Pull/Deploy** → Code landet in `httpdocs/`

### Post-Deploy Hook in Plesk
Plesk UI → **Git** → Repository → **Zusätzliche Aktionen**:

```bash
#!/bin/bash
# Wird nach Git-Pull automatisch ausgeführt
# Working Directory: /var/www/vhosts/zweitmeinu.ng/httpdocs

# Dependencies & Build als psaserv
sudo -u psaserv npm ci --production=false
sudo -u psaserv npm run build

# PM2 Restart (als root)
pm2 reload prod-frontend || pm2 start /var/www/vhosts/zweitmeinu.ng/httpdocs/ecosystem.config.js --only prod-frontend
pm2 save
```

**WICHTIG**: Plesk führt Git-Hooks als `root` aus, daher `sudo -u psaserv` für NPM!

---

## 🔄 File Ownership Best Practices

### Bei manuellen Datei-Operationen

**Nach Git-Pull (manuell):**
```bash
cd /var/www/vhosts/zweitmeinu.ng/httpdocs
git pull origin main

# Ownership sicherstellen (falls als root gepullt)
chown -R psaserv:psacln /var/www/vhosts/zweitmeinu.ng/httpdocs
```

**Nach Backup-Restore:**
```bash
cp -r /var/www/vhosts/zweitmeinu.ng/backups/backup-xyz /var/www/vhosts/zweitmeinu.ng/httpdocs

# Ownership wiederherstellen
chown -R psaserv:psacln /var/www/vhosts/zweitmeinu.ng/httpdocs
```

**Nach Datei-Upload via SFTP:**
```bash
# SFTP-User sollte psaserv sein (Plesk-Standard)
# Falls als root hochgeladen:
chown -R psaserv:psacln /var/www/vhosts/zweitmeinu.ng/httpdocs/neue-dateien/
```

### Deployment-Scripts

Alle Scripts (`deploy.sh`, `rollback.sh`) sind angepasst:
- NPM-Befehle: `sudo -u psaserv npm ...`
- Nach Backup-Restore: `chown -R psaserv:psacln ...`
- Backup-Verzeichnis: `chown psaserv:psacln backups/...`

---

## 📊 Verzeichnis-Größen überwachen

```bash
# Disk-Usage prüfen
du -sh /var/www/vhosts/zweitmeinu.ng/*

# Output:
# 2.5G    httpdocs
# 120M    logs
# 8.0G    backups  # Alte Backups regelmäßig löschen!

# Alte Backups aufräumen (behalte letzte 5)
cd /var/www/vhosts/zweitmeinu.ng/backups
ls -t | tail -n +6 | xargs rm -rf
```

---

## 🚨 Häufige Probleme

### Problem: "Permission denied" bei npm install

**Ursache**: NPM als root ohne `sudo -u` ausgeführt

**Lösung**:
```bash
# node_modules mit falschen Berechtigungen löschen
rm -rf /var/www/vhosts/zweitmeinu.ng/httpdocs/node_modules

# Korrekt installieren
cd /var/www/vhosts/zweitmeinu.ng/httpdocs
sudo -u psaserv npm ci --production=false
```

### Problem: ".env.production not found"

**Ursache**: Datei nicht erstellt oder falsche Berechtigungen

**Lösung**:
```bash
cd /var/www/vhosts/zweitmeinu.ng/httpdocs

# Datei erstellen
cp .env.production.example .env.production
nano .env.production  # Secrets eintragen

# Berechtigungen setzen
chown psaserv:psacln .env.production
chmod 600 .env.production
```

### Problem: PM2 kann Logs nicht schreiben

**Ursache**: Log-Verzeichnis existiert nicht oder falsche Berechtigungen

**Lösung**:
```bash
# Logs-Verzeichnis ist von Plesk verwaltet (root:root)
# PM2 läuft als root → sollte funktionieren

# Falls Probleme:
ls -la /var/www/vhosts/zweitmeinu.ng/logs/
chmod 755 /var/www/vhosts/zweitmeinu.ng/logs/

# PM2 neu starten
pm2 restart prod-frontend
```

---

## ✅ Setup-Checkliste

- [ ] Backup-Verzeichnis existiert: `/var/www/vhosts/zweitmeinu.ng/backups/`
- [ ] Backup-Verzeichnis: `psaserv:psacln` ownership
- [ ] `.env.production` erstellt in `httpdocs/`
- [ ] `.env.production`: `psaserv:psacln` + `chmod 600`
- [ ] NPM-Befehle mit `sudo -u psaserv` ausführen
- [ ] PM2 Logs gehen nach `logs/` (nicht `/var/log/pm2/`)
- [ ] Plesk Git Post-Deploy Hook konfiguriert mit `sudo -u psaserv`
- [ ] `httpdocs/` NIEMALS manuell `chown` (außer nach Restore)

---

## 📞 Quick Reference

### Verzeichnisse
```bash
# Webroot
/var/www/vhosts/zweitmeinu.ng/httpdocs/

# Logs
/var/www/vhosts/zweitmeinu.ng/logs/

# Backups
/var/www/vhosts/zweitmeinu.ng/backups/
```

### Wichtige Befehle
```bash
# Als psaserv arbeiten
su - psaserv -s /bin/bash

# NPM als psaserv (von root aus)
sudo -u psaserv npm ci
sudo -u psaserv npm run build

# Ownership prüfen
ls -la /var/www/vhosts/zweitmeinu.ng/httpdocs/

# Ownership wiederherstellen
chown -R psaserv:psacln /var/www/vhosts/zweitmeinu.ng/httpdocs/
```

### User-Übersicht
| User | Zweck | Verwendung |
|------|-------|------------|
| `root` | Server-Admin | SSH, PM2, System-Befehle |
| `psaserv` | Plesk Service-Account | Dateien in `httpdocs/`, NPM, Git |
| `www-data` | Web-Server | Nginx/Apache (läuft als dieser User) |

---

**Version**: 1.0
**Erstellt**: 2025-03-23
**Zuletzt geprüft**: 2025-03-23
