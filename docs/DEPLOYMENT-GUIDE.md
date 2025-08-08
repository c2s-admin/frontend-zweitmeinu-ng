# 🚀 Production Deployment Guide - design.zweitmeinu.ng

> **Phase 4 Complete Guide**: Vollständige Anleitung für das Deployment des Healthcare Design Systems auf design.zweitmeinu.ng

---

## 🎯 Deployment Overview

### **Deployment Architecture**
```
GitHub Repository (main branch)
         ↓
GitHub Actions Workflow
         ↓  
Build & Validate Healthcare Components
         ↓
Deploy to Root Server
         ↓
Nginx → SSL → design.zweitmeinu.ng
```

### **Infrastructure Requirements**
- **Domain**: design.zweitmeinu.ng (bereits eingerichtet)
- **Server**: Root-Server mit Ubuntu 20.04+ 
- **Web Server**: Nginx mit SSL/TLS
- **SSL**: Let's Encrypt (automatisch)
- **Monitoring**: Uptime & Performance Tracking

---

## 🔧 Root-Server Setup

### **1. Initial Server Configuration**

#### **System Updates & Dependencies**
```bash
# System Updates
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx certbot python3-certbot-nginx curl git unzip

# Install Node.js 20 (for build processes)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installations
nginx -v
certbot --version
node -v
npm -v
```

#### **Create Deployment User**
```bash
# Create deployment user
sudo useradd -m -s /bin/bash deploy
sudo usermod -aG sudo deploy

# Setup SSH key for deployment user
sudo mkdir -p /home/deploy/.ssh
sudo chown deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh

# Add your public key to authorized_keys
sudo nano /home/deploy/.ssh/authorized_keys
sudo chown deploy:deploy /home/deploy/.ssh/authorized_keys
sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

### **2. Directory Structure Setup**

```bash
# Create web directory
sudo mkdir -p /var/www/design.zweitmeinu.ng
sudo chown -R www-data:www-data /var/www/design.zweitmeinu.ng

# Create deployment directory
sudo mkdir -p /home/deploy/deployment
sudo chown -R deploy:deploy /home/deploy/deployment

# Create backup directory
sudo mkdir -p /var/backups/storybook
sudo chown -R www-data:www-data /var/backups/storybook

# Create log directories
sudo mkdir -p /var/log/storybook
sudo chown -R www-data:www-data /var/log/storybook
```

### **3. SSL Certificate Setup**

```bash
# Request SSL certificate for design.zweitmeinu.ng
sudo certbot certonly --nginx -d design.zweitmeinu.ng

# Verify SSL certificate
sudo certbot certificates

# Setup automatic renewal
sudo crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### **4. Nginx Configuration**

**Erstelle Nginx-Konfiguration**: `/etc/nginx/sites-available/design.zweitmeinu.ng`

```nginx
# Healthcare Design System - design.zweitmeinu.ng
server {
    listen 80;
    listen [::]:80;
    server_name design.zweitmeinu.ng;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name design.zweitmeinu.ng;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/design.zweitmeinu.ng/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/design.zweitmeinu.ng/privkey.pem;
    
    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Healthcare Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https: wss:; img-src 'self' data: https: blob:; font-src 'self' data: https:;" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;
    
    # Healthcare Performance Optimization
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        text/json
        application/javascript
        application/xml+rss
        application/json
        application/ld+json
        image/svg+xml;
    
    # Root directory
    root /var/www/design.zweitmeinu.ng;
    index index.html;
    
    # Logging
    access_log /var/log/nginx/design.zweitmeinu.ng.access.log combined;
    error_log /var/log/nginx/design.zweitmeinu.ng.error.log warn;
    
    # Main location
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }
        
        # Cache JSON files for shorter period
        location ~* \.(json)$ {
            expires 1h;
            add_header Cache-Control "public";
        }
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "Healthcare Design System OK - $(date)\n";
        add_header Content-Type text/plain;
        add_header Cache-Control "no-cache";
    }
    
    # Deployment info endpoint
    location /info {
        try_files /healthcare-info.json =404;
        add_header Content-Type application/json;
        add_header Cache-Control "no-cache";
    }
    
    # Security: Hide sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Security: Block access to backup files
    location ~ ~$ {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Robots.txt for healthcare compliance
    location = /robots.txt {
        allow all;
        log_not_found off;
        access_log off;
    }
    
    # Favicon handling
    location = /favicon.ico {
        log_not_found off;
        access_log off;
        expires 1y;
    }
}
```

**Aktiviere die Konfiguration:**
```bash
# Enable site
sudo ln -sf /etc/nginx/sites-available/design.zweitmeinu.ng /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

# Verify status
sudo systemctl status nginx
```

---

## 🔑 GitHub Actions Secrets Setup

### **Required Secrets in GitHub Repository**

Navigate to: **Repository → Settings → Secrets and Variables → Actions**

#### **SSH Deployment Secrets**
```bash
SSH_PRIVATE_KEY    # Your private SSH key for server access
SSH_USER           # Deployment user (e.g., "deploy")  
SSH_HOST          # Server IP or hostname
```

#### **Generate SSH Key Pair**
```bash
# On your local machine
ssh-keygen -t ed25519 -C "github-actions@design.zweitmeinu.ng" -f ~/.ssh/design_deploy_key

# Copy public key to server
ssh-copy-id -i ~/.ssh/design_deploy_key.pub deploy@YOUR_SERVER_IP

# Add private key content to GitHub Secrets
cat ~/.ssh/design_deploy_key
# Copy entire content to SSH_PRIVATE_KEY secret
```

---

## 🚀 Deployment Workflow

### **Automatic Deployment Triggers**

#### **1. Push to Main Branch**
- Jeder Push zu `main` triggert automatisches Deployment
- Nur bei Änderungen in Storybook-relevanten Dateien

#### **2. Manual Deployment**
- GitHub Actions → "Deploy Storybook" → "Run workflow"
- Wähle Environment: production/staging

### **Deployment Process**

#### **Phase 1: Validation (🩺 Healthcare Component Validation)**
1. ✅ Healthcare component tests
2. ✅ TypeScript healthcare validation  
3. ✅ WCAG 2.1 AA accessibility pre-check
4. ✅ Storybook build validation

#### **Phase 2: Build (🏗️ Build Healthcare Design System)**
1. 🏥 Production Storybook build
2. 📊 Build output validation
3. 🏥 Healthcare metadata injection
4. 📤 Artifact upload

#### **Phase 3: Deploy (🚀 Deploy to design.zweitmeinu.ng)**
1. 📥 Download build artifact
2. 🔍 Pre-deployment validation
3. 🚀 Execute server deployment
4. 🏥 Post-deployment healthcare validation
5. 📊 Deployment summary

#### **Phase 4: Notification (📬 Deployment Notification)**
1. ✅ Success/failure notification
2. 🏥 Healthcare compliance confirmation
3. 🎉 Phase 4 completion announcement

---

## 🔍 Monitoring & Maintenance

### **Health Checks**

#### **Automated Health Monitoring**
```bash
# Create monitoring script
sudo tee /usr/local/bin/storybook-health-check.sh > /dev/null << 'EOF'
#!/bin/bash

DOMAIN="design.zweitmeinu.ng"
LOG_FILE="/var/log/storybook/health-check.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Test HTTPS availability
if curl -sf "https://$DOMAIN/health" > /dev/null; then
    echo "$TIMESTAMP [OK] Healthcare Design System is accessible" >> $LOG_FILE
else
    echo "$TIMESTAMP [ERROR] Healthcare Design System is down!" >> $LOG_FILE
    # Optional: Send alert email
    # echo "Healthcare Design System down at $TIMESTAMP" | mail -s "ALERT: design.zweitmeinu.ng DOWN" admin@zweitmeinu.ng
fi

# Test SSL certificate
SSL_EXPIRY=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
echo "$TIMESTAMP [INFO] SSL expires: $SSL_EXPIRY" >> $LOG_FILE
EOF

sudo chmod +x /usr/local/bin/storybook-health-check.sh

# Setup cron job for health checks
echo "*/5 * * * * /usr/local/bin/storybook-health-check.sh" | sudo crontab -u www-data -
```

### **Log Rotation**
```bash
# Configure log rotation
sudo tee /etc/logrotate.d/storybook > /dev/null << 'EOF'
/var/log/storybook/*.log {
    daily
    missingok
    rotate 30
    compress
    notifempty
    create 644 www-data www-data
    sharedscripts
    postrotate
        systemctl reload nginx > /dev/null 2>&1 || true
    endscript
}
EOF
```

### **Backup Strategy**
```bash
# Create backup script
sudo tee /usr/local/bin/storybook-backup.sh > /dev/null << 'EOF'
#!/bin/bash

BACKUP_DIR="/var/backups/storybook"
SOURCE_DIR="/var/www/design.zweitmeinu.ng"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="healthcare-design-system-$TIMESTAMP.tar.gz"

# Create backup
tar -czf "$BACKUP_DIR/$BACKUP_NAME" -C "$SOURCE_DIR" .

# Keep only last 10 backups
cd "$BACKUP_DIR"
ls -t healthcare-design-system-*.tar.gz | tail -n +11 | xargs rm -f

echo "Backup created: $BACKUP_NAME"
EOF

sudo chmod +x /usr/local/bin/storybook-backup.sh

# Daily backup cron job
echo "0 2 * * * /usr/local/bin/storybook-backup.sh" | sudo crontab -u www-data -
```

---

## 📊 Performance Monitoring

### **Server Performance**

#### **System Monitoring**
```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Create performance monitoring script
sudo tee /usr/local/bin/performance-check.sh > /dev/null << 'EOF'
#!/bin/bash

LOG_FILE="/var/log/storybook/performance.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# System load
LOAD=$(uptime | awk '{print $10,$11,$12}')
echo "$TIMESTAMP [PERF] Load average: $LOAD" >> $LOG_FILE

# Memory usage
MEM_USAGE=$(free | grep Mem | awk '{printf "%.2f%%", ($3/$2)*100}')
echo "$TIMESTAMP [PERF] Memory usage: $MEM_USAGE" >> $LOG_FILE

# Disk usage
DISK_USAGE=$(df /var/www/design.zweitmeinu.ng | tail -1 | awk '{print $5}')
echo "$TIMESTAMP [PERF] Disk usage: $DISK_USAGE" >> $LOG_FILE

# Nginx status
if systemctl is-active --quiet nginx; then
    echo "$TIMESTAMP [PERF] Nginx: Active" >> $LOG_FILE
else
    echo "$TIMESTAMP [PERF] Nginx: Inactive" >> $LOG_FILE
fi
EOF

sudo chmod +x /usr/local/bin/performance-check.sh

# Hourly performance check
echo "0 * * * * /usr/local/bin/performance-check.sh" | sudo crontab -u root -
```

### **Web Performance Monitoring**

#### **Lighthouse CI Setup**
```bash
# Install Lighthouse CI
sudo npm install -g @lhci/cli

# Create Lighthouse configuration
sudo tee /home/deploy/lighthouserc.js > /dev/null << 'EOF'
module.exports = {
  ci: {
    collect: {
      url: ['https://design.zweitmeinu.ng/'],
      startServerCommand: 'echo "Server already running"',
      startServerReadyPattern: 'Server already running',
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', {minScore: 0.8}],
        'categories:accessibility': ['error', {minScore: 0.95}],
        'categories:best-practices': ['warn', {minScore: 0.8}],
        'categories:seo': ['warn', {minScore: 0.8}],
      },
    },
  },
};
EOF

# Create weekly performance audit script
sudo tee /usr/local/bin/lighthouse-audit.sh > /dev/null << 'EOF'
#!/bin/bash

cd /home/deploy
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
REPORT_DIR="/var/log/storybook/lighthouse-reports"

mkdir -p "$REPORT_DIR"

# Run Lighthouse audit
lhci collect --config=/home/deploy/lighthouserc.js
lhci assert --config=/home/deploy/lighthouserc.js

# Move reports
if [ -d ".lighthouseci" ]; then
    mv .lighthouseci "$REPORT_DIR/audit-$TIMESTAMP"
    echo "Lighthouse audit completed: $TIMESTAMP" >> /var/log/storybook/performance.log
fi
EOF

sudo chmod +x /usr/local/bin/lighthouse-audit.sh

# Weekly Lighthouse audit
echo "0 3 * * 1 /usr/local/bin/lighthouse-audit.sh" | sudo crontab -u deploy -
```

---

## 🛡️ Security Configuration

### **Firewall Setup**
```bash
# Configure UFW firewall
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
sudo ufw status
```

### **Security Hardening**
```bash
# Disable unnecessary services
sudo systemctl disable apache2 2>/dev/null || true
sudo systemctl stop apache2 2>/dev/null || true

# Configure SSH security
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

# Install fail2ban
sudo apt install -y fail2ban

# Configure fail2ban for Nginx
sudo tee /etc/fail2ban/jail.local > /dev/null << 'EOF'
[DEFAULT]
bantime = 3600

[nginx-http-auth]
enabled = true

[nginx-noscript]
enabled = true

[nginx-badbots]
enabled = true

[nginx-noproxy]
enabled = true
EOF

sudo systemctl restart fail2ban
sudo systemctl enable fail2ban
```

---

## 🚨 Troubleshooting

### **Common Issues & Solutions**

#### **Issue: Deployment Fails**
```bash
# Check deployment logs
ssh deploy@YOUR_SERVER_IP
cd ~/deployment
ls -la
cat deploy.log

# Check Nginx status
sudo systemctl status nginx
sudo nginx -t

# Check SSL certificate
sudo certbot certificates
```

#### **Issue: SSL Certificate Problems**
```bash
# Renew SSL certificate
sudo certbot renew --dry-run
sudo certbot renew --force-renewal -d design.zweitmeinu.ng

# Check certificate details
echo | openssl s_client -servername design.zweitmeinu.ng -connect design.zweitmeinu.ng:443 | openssl x509 -noout -text
```

#### **Issue: Performance Problems**
```bash
# Check server resources
htop
iotop
df -h

# Check Nginx logs
sudo tail -f /var/log/nginx/design.zweitmeinu.ng.access.log
sudo tail -f /var/log/nginx/design.zweitmeinu.ng.error.log

# Analyze response times
curl -w "@/home/deploy/curl-format.txt" -o /dev/null -s "https://design.zweitmeinu.ng"
```

#### **Curl Format File** (`/home/deploy/curl-format.txt`)
```
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
```

---

## ✅ Deployment Checklist

### **Pre-Deployment Checklist**
- [ ] Domain DNS points to server IP
- [ ] SSH key added to GitHub Secrets
- [ ] Server dependencies installed
- [ ] SSL certificate obtained
- [ ] Nginx configuration created
- [ ] Firewall configured
- [ ] Backup system setup

### **Post-Deployment Verification**
- [ ] https://design.zweitmeinu.ng loads successfully
- [ ] https://design.zweitmeinu.ng/health returns "OK"
- [ ] https://design.zweitmeinu.ng/info shows deployment metadata
- [ ] All healthcare components load correctly
- [ ] WCAG 2.1 AA compliance maintained
- [ ] SSL certificate valid and secure
- [ ] Performance meets healthcare standards

---

## 🎉 Success Metrics

### **Healthcare Design System Goals**
- ✅ **28+ Healthcare Components** deployed and accessible
- ✅ **100% WCAG 2.1 AA compliance** maintained  
- ✅ **Healthcare-grade security** with proper headers
- ✅ **Mobile-optimized** for medical professionals
- ✅ **Performance optimized** for stressed medical users
- ✅ **Automated deployment** with zero-downtime updates

### **Phase 4 Completion Criteria**
- ✅ Production deployment automated via GitHub Actions
- ✅ SSL certificate automated with Let's Encrypt
- ✅ Monitoring and health checks implemented
- ✅ Backup and recovery procedures established
- ✅ Security hardening completed
- ✅ Performance optimization validated

---

**🏥 Healthcare Design System - Production Ready!**
*All systems operational for medical professionals and patients.*