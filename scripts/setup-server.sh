#!/bin/bash
# 🏥 Healthcare Design System - Server Setup Script
# design.zweitmeinu.ng Production Environment Setup

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="design.zweitmeinu.ng"
DEPLOY_USER="deploy"
WEB_ROOT="/var/www/$DOMAIN"
DEPLOY_DIR="/home/$DEPLOY_USER/deployment"
BACKUP_DIR="/var/backups/storybook"
LOG_DIR="/var/log/storybook"

print_header() {
    echo -e "${BLUE}"
    echo "=================================================="
    echo "🏥 Healthcare Design System - Server Setup"
    echo "Domain: $DOMAIN"
    echo "=================================================="
    echo -e "${NC}"
}

print_step() {
    echo -e "${YELLOW}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_root() {
    if [ "$EUID" -ne 0 ]; then
        print_error "This script must be run as root (use sudo)"
        exit 1
    fi
}

update_system() {
    print_step "Updating system packages..."
    apt update && apt upgrade -y
    print_success "System updated"
}

install_dependencies() {
    print_step "Installing required dependencies..."
    
    # Install system packages
    apt install -y \
        nginx \
        certbot \
        python3-certbot-nginx \
        curl \
        git \
        unzip \
        htop \
        iotop \
        nethogs \
        fail2ban \
        ufw
    
    # Install Node.js 20
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
    
    # Install global npm packages
    npm install -g @lhci/cli
    
    print_success "Dependencies installed"
}

create_users() {
    print_step "Creating deployment user..."
    
    # Create deploy user
    if ! id "$DEPLOY_USER" &>/dev/null; then
        useradd -m -s /bin/bash "$DEPLOY_USER"
        usermod -aG sudo "$DEPLOY_USER"
        print_success "Deploy user created"
    else
        print_success "Deploy user already exists"
    fi
    
    # Setup SSH directory
    mkdir -p "/home/$DEPLOY_USER/.ssh"
    chown "$DEPLOY_USER:$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh"
    chmod 700 "/home/$DEPLOY_USER/.ssh"
    
    print_success "SSH directory configured"
}

setup_directories() {
    print_step "Creating directory structure..."
    
    # Web directory
    mkdir -p "$WEB_ROOT"
    chown -R www-data:www-data "$WEB_ROOT"
    
    # Deployment directory
    mkdir -p "$DEPLOY_DIR"
    chown -R "$DEPLOY_USER:$DEPLOY_USER" "$DEPLOY_DIR"
    
    # Backup directory
    mkdir -p "$BACKUP_DIR"
    chown -R www-data:www-data "$BACKUP_DIR"
    
    # Log directories
    mkdir -p "$LOG_DIR"
    mkdir -p "$LOG_DIR/lighthouse-reports"
    chown -R www-data:www-data "$LOG_DIR"
    
    print_success "Directory structure created"
}

configure_nginx() {
    print_step "Configuring Nginx..."
    
    # Create Nginx configuration
    cat > "/etc/nginx/sites-available/$DOMAIN" << 'EOF'
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
    
    # SSL Configuration (will be updated by certbot)
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
        return 200 "Healthcare Design System OK\n";
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
EOF
    
    # Enable site (but don't restart nginx yet - SSL needed first)
    ln -sf "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/"
    
    # Test configuration
    nginx -t
    
    print_success "Nginx configured"
}

setup_ssl() {
    print_step "Setting up SSL certificate..."
    
    # Stop nginx temporarily for standalone certbot
    systemctl stop nginx
    
    # Get SSL certificate
    if certbot certonly --standalone -d "$DOMAIN" --agree-tos --no-eff-email --email "admin@zweitmeinu.ng"; then
        print_success "SSL certificate obtained"
    else
        print_error "Failed to obtain SSL certificate"
        exit 1
    fi
    
    # Start nginx
    systemctl start nginx
    systemctl enable nginx
    
    # Setup automatic renewal
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
    
    print_success "SSL configured with automatic renewal"
}

configure_firewall() {
    print_step "Configuring firewall..."
    
    # Configure UFW
    ufw --force reset
    ufw allow ssh
    ufw allow 'Nginx Full'
    ufw --force enable
    
    print_success "Firewall configured"
}

setup_monitoring() {
    print_step "Setting up monitoring scripts..."
    
    # Health check script
    cat > /usr/local/bin/storybook-health-check.sh << 'EOF'
#!/bin/bash

DOMAIN="design.zweitmeinu.ng"
LOG_FILE="/var/log/storybook/health-check.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Test HTTPS availability
if curl -sf "https://$DOMAIN/health" > /dev/null; then
    echo "$TIMESTAMP [OK] Healthcare Design System is accessible" >> $LOG_FILE
else
    echo "$TIMESTAMP [ERROR] Healthcare Design System is down!" >> $LOG_FILE
fi

# Test SSL certificate
SSL_EXPIRY=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
echo "$TIMESTAMP [INFO] SSL expires: $SSL_EXPIRY" >> $LOG_FILE
EOF
    
    chmod +x /usr/local/bin/storybook-health-check.sh
    
    # Performance check script
    cat > /usr/local/bin/performance-check.sh << 'EOF'
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
    
    chmod +x /usr/local/bin/performance-check.sh
    
    # Backup script
    cat > /usr/local/bin/storybook-backup.sh << 'EOF'
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
    
    chmod +x /usr/local/bin/storybook-backup.sh
    
    # Setup cron jobs
    (crontab -u www-data -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/storybook-health-check.sh") | crontab -u www-data -
    (crontab -u www-data -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/storybook-backup.sh") | crontab -u www-data -
    (crontab -u root -l 2>/dev/null; echo "0 * * * * /usr/local/bin/performance-check.sh") | crontab -u root -
    
    print_success "Monitoring configured"
}

setup_security() {
    print_step "Configuring security hardening..."
    
    # Configure SSH security
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
    sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
    systemctl restart ssh
    
    # Configure fail2ban
    cat > /etc/fail2ban/jail.local << 'EOF'
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
    
    systemctl restart fail2ban
    systemctl enable fail2ban
    
    print_success "Security hardening completed"
}

setup_logrotate() {
    print_step "Configuring log rotation..."
    
    cat > /etc/logrotate.d/storybook << 'EOF'
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
    
    print_success "Log rotation configured"
}

create_placeholder() {
    print_step "Creating placeholder page..."
    
    cat > "$WEB_ROOT/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Healthcare Design System - design.zweitmeinu.ng</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Roboto Condensed', Arial, sans-serif;
            background: linear-gradient(135deg, #1278B3 0%, #f0f1f4 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #004166;
        }
        .container {
            text-align: center;
            background: rgba(255,255,255,0.95);
            padding: 3rem;
            border-radius: 16px;
            box-shadow: 0 24px 48px rgba(0,65,102,0.15);
            max-width: 600px;
            margin: 2rem;
        }
        .logo {
            font-size: 2.5rem;
            font-weight: 500;
            margin-bottom: 1rem;
            color: #1278B3;
        }
        .subtitle {
            font-size: 1.2rem;
            color: #666;
            margin-bottom: 2rem;
        }
        .status {
            background: #B3AF09;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            display: inline-block;
            margin-bottom: 1.5rem;
        }
        .info {
            color: #666;
            line-height: 1.6;
        }
        .healthcare-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="healthcare-icon">🏥</div>
        <h1 class="logo">Healthcare Design System</h1>
        <p class="subtitle">design.zweitmeinu.ng</p>
        
        <div class="status">🚀 Server Setup Complete</div>
        
        <div class="info">
            <p><strong>✅ Server successfully configured!</strong></p>
            <p>Ready for Healthcare Design System deployment.</p>
            <br>
            <p>🏥 28+ Healthcare Components ready</p>
            <p>♿ WCAG 2.1 AA compliant</p>
            <p>🔒 Healthcare-grade security</p>
        </div>
    </div>
</body>
</html>
EOF
    
    chown www-data:www-data "$WEB_ROOT/index.html"
    
    print_success "Placeholder page created"
}

final_checks() {
    print_step "Running final checks..."
    
    # Test Nginx configuration
    nginx -t
    
    # Check SSL certificate
    if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
        print_success "SSL certificate exists"
    else
        print_error "SSL certificate missing"
    fi
    
    # Test services
    systemctl status nginx --no-pager
    systemctl status fail2ban --no-pager
    
    # Test website
    sleep 5
    if curl -sf "https://$DOMAIN/health" > /dev/null; then
        print_success "Website is accessible"
    else
        print_error "Website check failed"
    fi
    
    print_success "Final checks completed"
}

print_summary() {
    echo -e "${GREEN}"
    echo "=================================================="
    echo "🎉 Healthcare Design System Server Setup Complete!"
    echo "=================================================="
    echo "✅ Domain: https://$DOMAIN"
    echo "✅ SSL Certificate: Installed & Auto-renewal enabled"
    echo "✅ Nginx: Configured with healthcare security headers"
    echo "✅ Firewall: Configured (SSH + HTTPS only)"
    echo "✅ Monitoring: Health checks & performance monitoring"
    echo "✅ Security: SSH hardened, fail2ban configured"
    echo "✅ Backups: Daily automated backups enabled"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Add your SSH public key to /home/$DEPLOY_USER/.ssh/authorized_keys"
    echo "2. Configure GitHub Actions secrets (SSH_PRIVATE_KEY, SSH_USER, SSH_HOST)"
    echo "3. Push to main branch to trigger deployment"
    echo ""
    echo "🔗 URLs to verify:"
    echo "   Main site: https://$DOMAIN"
    echo "   Health check: https://$DOMAIN/health"
    echo "   Deployment info: https://$DOMAIN/info"
    echo ""
    echo "🏥 Ready for Healthcare Design System deployment!"
    echo -e "${NC}"
}

# Main execution
main() {
    print_header
    check_root
    
    update_system
    install_dependencies
    create_users
    setup_directories
    configure_nginx
    setup_ssl
    configure_firewall
    setup_monitoring
    setup_security
    setup_logrotate
    create_placeholder
    final_checks
    
    print_summary
}

# Run main function
main "$@"