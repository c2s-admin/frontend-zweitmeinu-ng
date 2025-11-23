#!/bin/bash

################################################################################
# Plesk Git Post-Deploy Hook
# Automatically run after Plesk Git pulls latest code
#
# Setup in Plesk:
# 1. Go to Git → Repository → Additional Actions
# 2. Add this script path to "Post-deploy actions"
################################################################################

set -e

echo "🏥 Healthcare Platform - Plesk Post-Deploy Hook"
echo "================================================"

# Auto-detect Plesk user
detect_plesk_user() {
  local path=$1
  if [ -d "$path" ]; then
    PLESK_USER=$(stat -c '%U' "$path" 2>/dev/null || stat -f '%Su' "$path" 2>/dev/null)
    PLESK_GROUP=$(stat -c '%G' "$path" 2>/dev/null || stat -f '%Sg' "$path" 2>/dev/null)
  else
    PLESK_USER=$(whoami)
    PLESK_GROUP=$(id -gn)
  fi
}

# Get current directory
DEPLOY_PATH=$(pwd)
echo "📁 Deploy path: $DEPLOY_PATH"

# Detect Plesk user
detect_plesk_user "$DEPLOY_PATH"

# Detect environment based on path
if [[ "$DEPLOY_PATH" == *"zweitmeinu.ng"* ]] && [[ "$DEPLOY_PATH" != *"dev."* ]]; then
  ENV="production"
  APP_NAME="prod-frontend"
  ENV_FILE=".env.production"
else
  ENV="development"
  APP_NAME="dev-frontend"
  ENV_FILE=".env.development"
fi

echo "🌍 Environment: $ENV"
echo "👤 Plesk User: $PLESK_USER:$PLESK_GROUP"
echo ""

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
# Prüfen ob als Plesk-User oder als root ausgeführt
if [ "$(whoami)" = "root" ]; then
  sudo -u $PLESK_USER npm ci --production=false
else
  npm ci --production=false
fi

# Step 2: Build application
echo "🔨 Building application..."
if [ "$(whoami)" = "root" ]; then
  sudo -u $PLESK_USER npm run build
else
  npm run build
fi

# Step 3: Restart PM2 process
echo "🔄 Restarting PM2 process..."
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  pm2 reload "$APP_NAME" --update-env
else
  pm2 start npm --name "$APP_NAME" -- start
fi
pm2 save

echo "✅ Post-deploy completed successfully!"
echo ""
echo "📊 Status:"
pm2 status "$APP_NAME"
