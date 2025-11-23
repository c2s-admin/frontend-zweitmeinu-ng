import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import { logger } from '@/lib/logger'

// Email configuration from environment variables
const emailConfig = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true',
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  from: process.env.CONTACT_EMAIL_FROM,
  to: process.env.CONTACT_EMAIL_TO,
  sendCopyToSender: process.env.CONTACT_SEND_COPY_TO_SENDER === 'true'
}

// Validate email configuration
function validateEmailConfig(): boolean {
  const requiredFields = ['host', 'user', 'pass', 'from', 'to']
  const missing = requiredFields.filter(field => !emailConfig[field as keyof typeof emailConfig])

  if (missing.length > 0) {
    logger.error(`Missing required email configuration: ${missing.join(', ')}`)
    return false
  }

  return true
}

// Create nodemailer transporter
export const transporter: Transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass,
  },
  // Optional: Debugging
  debug: process.env.NODE_ENV === 'development',
  logger: process.env.NODE_ENV === 'development',
})

// Verify email connection
export async function verifyEmailConnection(): Promise<boolean> {
  if (!validateEmailConfig()) {
    return false
  }

  try {
    await transporter.verify()
    logger.info('✅ SMTP Server ready')
    return true
  } catch (error) {
    logger.error({ err: error }, '❌ SMTP connection error')
    return false
  }
}

// Export email configuration for use in API routes
export { emailConfig }
