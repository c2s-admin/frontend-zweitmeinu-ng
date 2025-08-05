// Simplified logger for development to avoid worker exit issues
const isProduction = process.env.NODE_ENV === "production";

export const logger = {
  info: (...args: any[]) => {
    if (!isProduction) {
      console.log('[INFO]', ...args);
    }
  },
  warn: (...args: any[]) => {
    if (!isProduction) {
      console.warn('[WARN]', ...args);
    }
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
  debug: (...args: any[]) => {
    if (!isProduction && process.env.LOG_LEVEL === 'debug') {
      console.debug('[DEBUG]', ...args);
    }
  }
};

