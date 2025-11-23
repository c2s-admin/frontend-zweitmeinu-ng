#!/bin/bash

################################################################################
# Healthcare Platform Deployment Script
# zweitmeinung.ng - Production & Development Deployment
#
# Usage:
#   ./scripts/deploy.sh production
#   ./scripts/deploy.sh development
################################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Environment parameter
ENV=${1:-production}

# Validate environment
if [[ "$ENV" != "production" && "$ENV" != "development" ]]; then
  echo -e "${RED}❌ Error: Invalid environment. Use 'production' or 'development'${NC}"
  exit 1
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🏥 Healthcare Platform Deployment${NC}"
echo -e "${BLUE}Environment: ${ENV}${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Auto-detect Plesk user (works with any Plesk configuration)
detect_plesk_user() {
  local path=$1
  if [ -d "$path" ]; then
    PLESK_USER=$(stat -c '%U' "$path" 2>/dev/null || stat -f '%Su' "$path" 2>/dev/null)
    PLESK_GROUP=$(stat -c '%G' "$path" 2>/dev/null || stat -f '%Sg' "$path" 2>/dev/null)
    echo -e "${GREEN}✅ Detected Plesk User: $PLESK_USER:$PLESK_GROUP${NC}"
  else
    # Fallback defaults
    PLESK_USER="psaserv"
    PLESK_GROUP="psacln"
    echo -e "${YELLOW}⚠️  Using fallback user: $PLESK_USER:$PLESK_GROUP${NC}"
  fi
}

# Configuration based on environment
if [[ "$ENV" == "production" ]]; then
  APP_NAME="prod-frontend"
  DEPLOY_PATH="/var/www/vhosts/zweitmeinu.ng/httpdocs"
  GIT_BRANCH="main"
  ENV_FILE=".env.production"
  PORT=3000
else
  APP_NAME="dev-frontend"
  DEPLOY_PATH="/var/www/vhosts/dev.zweitmeinu.ng/httpdocs"
  GIT_BRANCH="development"
  ENV_FILE=".env.development"
  PORT=3001
fi

# Detect Plesk user from deploy path
detect_plesk_user "$DEPLOY_PATH"

echo -e "${YELLOW}📋 Deployment Configuration:${NC}"
echo "  - Plesk User: $PLESK_USER:$PLESK_GROUP"
echo "  - App Name: $APP_NAME"
echo "  - Deploy Path: $DEPLOY_PATH"
echo "  - Git Branch: $GIT_BRANCH"
echo "  - Environment File: $ENV_FILE"
echo "  - Port: $PORT"
echo ""

# Step 1: Create backup
echo -e "${YELLOW}📦 Step 1: Creating backup...${NC}"
BACKUP_DIR="/var/www/vhosts/$(basename $(dirname $DEPLOY_PATH))/backups"
BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"

# Backup-Verzeichnis erstellen (falls nicht vorhanden)
if [ ! -d "$BACKUP_DIR" ]; then
  mkdir -p "$BACKUP_DIR"
  chown $PLESK_USER:$PLESK_GROUP "$BACKUP_DIR"
fi

if [ -d "$DEPLOY_PATH" ]; then
  cp -r "$DEPLOY_PATH" "$BACKUP_DIR/$BACKUP_NAME"
  chown -R $PLESK_USER:$PLESK_GROUP "$BACKUP_DIR/$BACKUP_NAME"
  echo -e "${GREEN}✅ Backup created: $BACKUP_DIR/$BACKUP_NAME${NC}"
else
  echo -e "${YELLOW}⚠️  No existing deployment found. Skipping backup.${NC}"
fi
echo ""

# Step 2: Pull latest code
echo -e "${YELLOW}🔄 Step 2: Pulling latest code from Git...${NC}"
cd "$DEPLOY_PATH"

# Check if git repository exists
if [ ! -d ".git" ]; then
  echo -e "${RED}❌ Error: Not a git repository. Please clone first.${NC}"
  exit 1
fi

# Fetch and reset to latest
git fetch origin
git checkout "$GIT_BRANCH"
git pull origin "$GIT_BRANCH"

COMMIT_HASH=$(git rev-parse --short HEAD)
echo -e "${GREEN}✅ Code updated to commit: $COMMIT_HASH${NC}"
echo ""

# Step 3: Check environment variables
echo -e "${YELLOW}🔐 Step 3: Checking environment variables...${NC}"
if [ ! -f "$ENV_FILE" ]; then
  echo -e "${RED}❌ Error: $ENV_FILE not found!${NC}"
  echo -e "${YELLOW}ℹ️  Copy from template: cp $ENV_FILE.example $ENV_FILE${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Environment file found: $ENV_FILE${NC}"
echo ""

# Step 4: Install dependencies
echo -e "${YELLOW}📦 Step 4: Installing dependencies...${NC}"
# Als Plesk-User ausführen (automatisch erkannt)
sudo -u $PLESK_USER npm ci --production=false
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 5: Run healthcare validation (production only)
if [[ "$ENV" == "production" ]]; then
  echo -e "${YELLOW}🏥 Step 5: Running healthcare validation...${NC}"

  echo "  - Type checking..."
  npm run type-check || {
    echo -e "${RED}❌ Type check failed!${NC}"
    exit 1
  }

  echo "  - Linting..."
  npm run lint || {
    echo -e "${RED}❌ Linting failed!${NC}"
    exit 1
  }

  echo -e "${GREEN}✅ Healthcare validation passed${NC}"
  echo ""
fi

# Step 6: Build application
echo -e "${YELLOW}🔨 Step 6: Building application...${NC}"
# Als Plesk-User ausführen (automatisch erkannt)
sudo -u $PLESK_USER npm run build || {
  echo -e "${RED}❌ Build failed!${NC}"
  echo -e "${YELLOW}🔄 Rolling back to backup...${NC}"
  rm -rf "$DEPLOY_PATH"
  cp -r "$BACKUP_DIR/$BACKUP_NAME" "$DEPLOY_PATH"
  chown -R $PLESK_USER:$PLESK_GROUP "$DEPLOY_PATH"
  exit 1
}
echo -e "${GREEN}✅ Build completed successfully${NC}"
echo ""

# Step 7: Restart PM2 process
echo -e "${YELLOW}🔄 Step 7: Restarting PM2 process...${NC}"

# Check if PM2 process exists
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  echo "  - Reloading existing process..."
  pm2 reload "$APP_NAME" --update-env
else
  echo "  - Starting new process..."
  pm2 start npm --name "$APP_NAME" -- start
fi

# Save PM2 configuration
pm2 save

echo -e "${GREEN}✅ PM2 process restarted: $APP_NAME${NC}"
echo ""

# Step 8: Health check
echo -e "${YELLOW}🏥 Step 8: Running health check...${NC}"
sleep 5  # Wait for application to start

HEALTH_URL="http://localhost:$PORT/api/health"
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" || echo "000")

if [ "$HEALTH_RESPONSE" == "200" ]; then
  echo -e "${GREEN}✅ Health check passed (HTTP $HEALTH_RESPONSE)${NC}"
else
  echo -e "${RED}⚠️  Health check failed (HTTP $HEALTH_RESPONSE)${NC}"
  echo -e "${YELLOW}ℹ️  Check logs: pm2 logs $APP_NAME${NC}"
fi
echo ""

# Step 9: Cleanup old backups (keep last 5)
echo -e "${YELLOW}🧹 Step 9: Cleaning up old backups...${NC}"
cd "$BACKUP_DIR"
ls -t | tail -n +6 | xargs -r rm -rf
BACKUP_COUNT=$(ls -1 | wc -l)
echo -e "${GREEN}✅ Keeping $BACKUP_COUNT recent backups${NC}"
echo ""

# Deployment summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Deployment Completed Successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo "  - Environment: $ENV"
echo "  - Commit: $COMMIT_HASH"
echo "  - Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
echo "  - Backup: $BACKUP_DIR/$BACKUP_NAME"
echo ""
echo -e "${BLUE}🔗 Quick Commands:${NC}"
echo "  - View logs:    pm2 logs $APP_NAME"
echo "  - Check status: pm2 status"
echo "  - Restart:      pm2 restart $APP_NAME"
echo "  - Rollback:     cp -r $BACKUP_DIR/$BACKUP_NAME $DEPLOY_PATH && pm2 restart $APP_NAME"
echo ""
echo -e "${GREEN}🎉 Happy healthcare deployment!${NC}"
