/**
 * PM2 Ecosystem Configuration for zweitmeinung.ng
 *
 * Production deployment configuration for Plesk server
 * Usage: pm2 start ecosystem.config.js
 */

module.exports = {
  apps: [
    {
      // Production Application
      name: 'prod-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/vhosts/zweitmeinu.ng/httpdocs',
      instances: 2,
      exec_mode: 'cluster',

      // Environment
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0'
      },

      // Logging (Plesk hat eigenes logs-Verzeichnis)
      error_file: '/var/www/vhosts/zweitmeinu.ng/logs/prod-frontend-error.log',
      out_file: '/var/www/vhosts/zweitmeinu.ng/logs/prod-frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Auto-restart configuration
      autorestart: true,
      max_restarts: 5,
      min_uptime: '10s',
      max_memory_restart: '500M',

      // Graceful restart
      kill_timeout: 5000,
      listen_timeout: 10000,

      // Healthcare-specific: Keep process alive
      exp_backoff_restart_delay: 100,
    },

    {
      // Development/Staging Application
      name: 'dev-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/vhosts/dev.zweitmeinu.ng/httpdocs',
      instances: 1,
      exec_mode: 'cluster',

      // Environment
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
        HOST: '0.0.0.0'
      },

      // Logging (Plesk hat eigenes logs-Verzeichnis)
      error_file: '/var/www/vhosts/dev.zweitmeinu.ng/logs/dev-frontend-error.log',
      out_file: '/var/www/vhosts/dev.zweitmeinu.ng/logs/dev-frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Auto-restart
      autorestart: true,
      max_restarts: 10,
      min_uptime: '5s',

      // Less strict memory limit for development
      max_memory_restart: '800M',
    }
  ],

  // PM2 Deploy configuration (optional, für SSH-basiertes Deployment)
  deploy: {
    production: {
      user: 'admin',
      host: 'zweitmeinu.ng',
      ref: 'origin/main',
      repo: 'https://github.com/c2s-admin/frontend-zweitmeinu-ng.git',
      path: '/var/www/vhosts/zweitmeinu.ng/httpdocs',
      'post-deploy': 'npm ci && npm run build && pm2 reload ecosystem.config.js --only prod-frontend && pm2 save'
    },

    development: {
      user: 'admin',
      host: 'dev.zweitmeinu.ng',
      ref: 'origin/development',
      repo: 'https://github.com/c2s-admin/frontend-zweitmeinu-ng.git',
      path: '/var/www/vhosts/dev.zweitmeinu.ng/httpdocs',
      'post-deploy': 'npm ci && npm run build && pm2 reload ecosystem.config.js --only dev-frontend && pm2 save'
    }
  }
}
