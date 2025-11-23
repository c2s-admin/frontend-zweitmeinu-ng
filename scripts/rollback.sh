#!/bin/bash

################################################################################
# Healthcare Platform Rollback Script
# zweitmeinung.ng - Quick rollback to previous deployment
#
# Usage:
#   ./scripts/rollback.sh production
#   ./scripts/rollback.sh development [backup-name]
################################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Environment parameter
ENV=${1:-production}
BACKUP_NAME=${2:-}

# Validate environment
if [[ "$ENV" != "production" && "$ENV" != "development" ]]; then
  echo -e "${RED}❌ Error: Invalid environment. Use 'production' or 'development'${NC}"
  exit 1
fi

echo -e "${RED}========================================${NC}"
echo -e "${RED}⚠️  Healthcare Platform ROLLBACK${NC}"
echo -e "${RED}Environment: ${ENV}${NC}"
echo -e "${RED}========================================${NC}"
echo ""

# Auto-detect Plesk user
detect_plesk_user() {
  local path=$1
  if [ -d "$path" ]; then
    PLESK_USER=$(stat -c '%U' "$path" 2>/dev/null || stat -f '%Su' "$path" 2>/dev/null)
    PLESK_GROUP=$(stat -c '%G' "$path" 2>/dev/null || stat -f '%Sg' "$path" 2>/dev/null)
    echo -e "${GREEN}✅ Detected Plesk User: $PLESK_USER:$PLESK_GROUP${NC}"
  else
    PLESK_USER="psaserv"
    PLESK_GROUP="psacln"
    echo -e "${YELLOW}⚠️  Using fallback user: $PLESK_USER:$PLESK_GROUP${NC}"
  fi
}

# Configuration based on environment
if [[ "$ENV" == "production" ]]; then
  APP_NAME="prod-frontend"
  DEPLOY_PATH="/var/www/vhosts/zweitmeinu.ng/httpdocs"
  BACKUP_DIR="/var/www/vhosts/zweitmeinu.ng/backups"
else
  APP_NAME="dev-frontend"
  DEPLOY_PATH="/var/www/vhosts/dev.zweitmeinu.ng/httpdocs"
  BACKUP_DIR="/var/www/vhosts/dev.zweitmeinu.ng/backups"
fi

# Detect Plesk user
detect_plesk_user "$DEPLOY_PATH"

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
  echo -e "${RED}❌ Error: Backup directory not found: $BACKUP_DIR${NC}"
  exit 1
fi

# List available backups
echo -e "${YELLOW}📋 Available backups:${NC}"
cd "$BACKUP_DIR"
BACKUPS=($(ls -t))

if [ ${#BACKUPS[@]} -eq 0 ]; then
  echo -e "${RED}❌ No backups found!${NC}"
  exit 1
fi

# Display backups with numbers
for i in "${!BACKUPS[@]}"; do
  BACKUP="${BACKUPS[$i]}"
  BACKUP_SIZE=$(du -sh "$BACKUP" | cut -f1)
  echo "  [$i] $BACKUP ($BACKUP_SIZE)"
done
echo ""

# Select backup
if [ -z "$BACKUP_NAME" ]; then
  echo -e "${YELLOW}🔢 Enter backup number to restore (0 = most recent):${NC}"
  read -r BACKUP_INDEX

  # Validate input
  if ! [[ "$BACKUP_INDEX" =~ ^[0-9]+$ ]] || [ "$BACKUP_INDEX" -ge ${#BACKUPS[@]} ]; then
    echo -e "${RED}❌ Invalid backup number!${NC}"
    exit 1
  fi

  BACKUP_NAME="${BACKUPS[$BACKUP_INDEX]}"
else
  # Check if specified backup exists
  if [ ! -d "$BACKUP_DIR/$BACKUP_NAME" ]; then
    echo -e "${RED}❌ Backup not found: $BACKUP_NAME${NC}"
    exit 1
  fi
fi

BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

echo -e "${YELLOW}⚠️  You are about to rollback to:${NC}"
echo "  Backup: $BACKUP_NAME"
echo "  Path: $BACKUP_PATH"
echo ""
echo -e "${RED}⚠️  This will overwrite the current deployment!${NC}"
echo -e "${YELLOW}Continue? (yes/no):${NC}"
read -r CONFIRM

if [[ "$CONFIRM" != "yes" ]]; then
  echo -e "${BLUE}ℹ️  Rollback cancelled.${NC}"
  exit 0
fi

echo ""
echo -e "${YELLOW}🔄 Starting rollback...${NC}"

# Step 1: Stop PM2 process
echo -e "${YELLOW}🛑 Step 1: Stopping PM2 process...${NC}"
pm2 stop "$APP_NAME" || true
echo -e "${GREEN}✅ Process stopped${NC}"
echo ""

# Step 2: Create safety backup of current state
echo -e "${YELLOW}📦 Step 2: Creating safety backup...${NC}"
SAFETY_BACKUP="$BACKUP_DIR/pre-rollback-$(date +%Y%m%d-%H%M%S)"
if [ -d "$DEPLOY_PATH" ]; then
  cp -r "$DEPLOY_PATH" "$SAFETY_BACKUP"
  echo -e "${GREEN}✅ Safety backup created: $SAFETY_BACKUP${NC}"
fi
echo ""

# Step 3: Restore from backup
echo -e "${YELLOW}♻️  Step 3: Restoring from backup...${NC}"
rm -rf "$DEPLOY_PATH"
cp -r "$BACKUP_PATH" "$DEPLOY_PATH"
# Plesk-Berechtigungen wiederherstellen (automatisch erkannt)
chown -R $PLESK_USER:$PLESK_GROUP "$DEPLOY_PATH"
echo -e "${GREEN}✅ Restored from backup${NC}"
echo ""

# Step 4: Restart PM2 process
echo -e "${YELLOW}🔄 Step 4: Restarting PM2 process...${NC}"
pm2 restart "$APP_NAME" --update-env
pm2 save
echo -e "${GREEN}✅ Process restarted${NC}"
echo ""

# Step 5: Health check
echo -e "${YELLOW}🏥 Step 5: Running health check...${NC}"
sleep 5

if [[ "$ENV" == "production" ]]; then
  PORT=3000
else
  PORT=3001
fi

HEALTH_URL="http://localhost:$PORT/api/health"
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" || echo "000")

if [ "$HEALTH_RESPONSE" == "200" ]; then
  echo -e "${GREEN}✅ Health check passed (HTTP $HEALTH_RESPONSE)${NC}"
else
  echo -e "${RED}⚠️  Health check failed (HTTP $HEALTH_RESPONSE)${NC}"
  echo -e "${YELLOW}ℹ️  Check logs: pm2 logs $APP_NAME${NC}"
fi
echo ""

# Rollback summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Rollback Completed!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}📊 Rollback Summary:${NC}"
echo "  - Environment: $ENV"
echo "  - Restored from: $BACKUP_NAME"
echo "  - Safety backup: $SAFETY_BACKUP"
echo "  - Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
echo -e "${BLUE}🔗 Quick Commands:${NC}"
echo "  - View logs:    pm2 logs $APP_NAME"
echo "  - Check status: pm2 status"
echo ""
echo -e "${GREEN}🎉 Rollback successful!${NC}"
