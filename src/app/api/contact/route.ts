import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { transporter, emailConfig } from '@/lib/email/transporter'
import { generateAdminNotificationEmail, generateUserConfirmationEmail } from '@/lib/email/templates'
import { logger } from '@/lib/logger'
import type { ContactFormData } from '@/types/contact'

// Zod validation schema for contact form
const contactFormSchema = z.object({
  firstName: z.string().min(2, 'Vorname muss mindestens 2 Zeichen lang sein').max(50),
  lastName: z.string().min(2, 'Nachname muss mindestens 2 Zeichen lang sein').max(50),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  phone: z.string().regex(/^(\+49|0)[1-9]\d{1,14}$/, 'Ungültige Telefonnummer').optional().or(z.literal('')),
  subject: z.string().min(5, 'Betreff muss mindestens 5 Zeichen lang sein').max(200),
  message: z.string().min(20, 'Nachricht muss mindestens 20 Zeichen lang sein').max(2000),
  specialty: z.string().optional(),
  urgency: z.enum(['low', 'medium', 'high', 'emergency']),
  preferredContact: z.enum(['email', 'phone', 'both']),
  consent: z.boolean().refine(val => val === true, 'Zustimmung zur Datenschutzerklärung ist erforderlich'),
  newsletter: z.boolean().optional(),
  captchaToken: z.string().optional()
})

/**
 * Verify hCaptcha token
 */
async function verifyHCaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.HCAPTCHA_SECRET_KEY

  if (!secretKey) {
    logger.error('HCAPTCHA_SECRET_KEY not configured')
    return false
  }

  try {
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: token
      })
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    logger.error({ err: error }, 'CAPTCHA verification error')
    return false
  }
}

/**
 * Send contact form emails (admin notification + user confirmation)
 */
async function sendContactEmails(data: ContactFormData, metadata: {
  ipAddress?: string
  userAgent?: string
  timestamp: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Send admin notification
    const adminEmail = generateAdminNotificationEmail(data, metadata)

    await transporter.sendMail({
      from: emailConfig.from,
      to: emailConfig.to,
      replyTo: data.email, // Allow direct reply to user
      subject: adminEmail.subject,
      html: adminEmail.html,
      priority: data.urgency === 'emergency' ? 'high' : 'normal'
    })

    logger.info('✅ Admin notification sent', {
      to: emailConfig.to,
      subject: adminEmail.subject
    })

    // 2. Send user confirmation (if enabled)
    if (emailConfig.sendCopyToSender) {
      const userEmail = generateUserConfirmationEmail(data)

      await transporter.sendMail({
        from: emailConfig.from,
        to: data.email,
        subject: userEmail.subject,
        html: userEmail.html
      })

      logger.info('✅ User confirmation sent', { to: data.email })
    }

    return { success: true }
  } catch (error) {
    logger.error({ err: error }, '❌ Email sending error')
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Email sending failed'
    }
  }
}

/**
 * Rate limiting check (simple in-memory implementation)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now()
  const windowMs = parseInt(process.env.CONTACT_MESSAGES_RATE_LIMIT_WINDOW || '60') * 1000
  const maxRequests = parseInt(process.env.CONTACT_MESSAGES_RATE_LIMIT_MAX || '5')

  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    // Create new record or reset expired one
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return { allowed: true }
  }

  if (record.count >= maxRequests) {
    return { allowed: false, resetTime: record.resetTime }
  }

  // Increment count
  record.count++
  return { allowed: true }
}

/**
 * POST /api/contact
 * Handle contact form submission
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP address
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown'

    // Check rate limiting
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      const retryAfter = rateLimit.resetTime
        ? Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        : 60

      return NextResponse.json(
        {
          error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.',
          retryAfter
        },
        {
          status: 429,
          headers: { 'Retry-After': retryAfter.toString() }
        }
      )
    }

    // Parse request body
    const body = await request.json()

    // Validate CAPTCHA (if enabled)
    const captchaEnabled = process.env.CAPTCHA_ENABLED === 'true'

    logger.info('CAPTCHA config', {
      captchaEnabled,
      envValue: process.env.CAPTCHA_ENABLED,
      hasToken: !!body.captchaToken
    })

    if (captchaEnabled) {
      if (!body.captchaToken) {
        return NextResponse.json(
          { error: 'CAPTCHA-Token fehlt.' },
          { status: 400 }
        )
      }

      const isValidCaptcha = await verifyHCaptcha(body.captchaToken)
      if (!isValidCaptcha) {
        logger.warn('CAPTCHA verification failed', { ip })
        return NextResponse.json(
          { error: 'CAPTCHA-Verifizierung fehlgeschlagen. Bitte versuchen Sie es erneut.' },
          { status: 400 }
        )
      }
    }

    // Validate form data
    const validationResult = contactFormSchema.safeParse(body)
    if (!validationResult.success) {
      logger.warn('Form validation failed', {
        errors: validationResult.error.errors,
        formData: Object.keys(body),
        ip
      })
      return NextResponse.json(
        {
          error: 'Ungültige Formulardaten.',
          details: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    const formData: ContactFormData = validationResult.data

    // Collect metadata
    const metadata = {
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || undefined,
      timestamp: new Date().toISOString()
    }

    // Development mode: Check if email sending is enabled
    const isDevelopment = process.env.NODE_ENV === 'development'
    const enableEmailInDev = process.env.ENABLE_EMAIL_IN_DEV === 'true'
    const shouldSendEmail = !isDevelopment || enableEmailInDev

    if (shouldSendEmail) {
      // Send emails
      logger.info('📧 Sending contact form emails...', {
        from: formData.email,
        subject: formData.subject,
        urgency: formData.urgency
      })

      const emailResult = await sendContactEmails(formData, metadata)
      if (!emailResult.success) {
        return NextResponse.json(
          { error: 'E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.' },
          { status: 500 }
        )
      }

      logger.info('✅ Emails sent successfully')
    } else {
      // Development: Skip email sending, just log
      logger.info('📧 [DEV MODE] Contact form submitted (email not sent)', {
        from: formData.email,
        subject: formData.subject,
        urgency: formData.urgency,
        specialty: formData.specialty,
        timestamp: metadata.timestamp
      })
      logger.info('📝 [DEV MODE] Form data:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message.substring(0, 100) + '...'
      })
    }

    // Log successful submission (without sensitive data)
    logger.info('✅ Contact form submission successful', {
      urgency: formData.urgency,
      specialty: formData.specialty,
      timestamp: metadata.timestamp
    })

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns in Kürze bei Ihnen.'
    })

  } catch (error) {
    logger.error({ err: error }, '❌ Contact form submission error')
    return NextResponse.json(
      { error: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.' },
      { status: 500 }
    )
  }
}
