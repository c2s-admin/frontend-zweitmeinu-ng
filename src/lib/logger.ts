// Simplified logger for development to avoid worker exit issues
const isProduction = process.env.NODE_ENV === "production";

export const logger = {
  info: (...args: unknown[]) => {
    if (!isProduction) {
      console.log('[INFO]', ...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (!isProduction) {
      console.warn('[WARN]', ...args);
    }
  },
  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args);
  },
  debug: (...args: unknown[]) => {
    if (!isProduction && process.env.LOG_LEVEL === 'debug') {
      console.debug('[DEBUG]', ...args);
    }
  }
};
