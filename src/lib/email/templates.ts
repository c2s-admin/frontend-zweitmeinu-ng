import type { ContactFormData } from '@/types/contact'
import { URGENCY_LEVELS } from '@/types/contact'

/**
 * Healthcare email template styling
 */
const emailStyles = `
  body {
    font-family: 'Roboto', Arial, sans-serif;
    line-height: 1.6;
    color: #1f2937;
    background-color: #f8fafc;
    margin: 0;
    padding: 0;
  }
  .email-container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .email-header {
    background-color: #004166;
    color: #ffffff;
    padding: 24px;
    text-align: center;
  }
  .email-header h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 500;
  }
  .email-body {
    padding: 32px 24px;
  }
  .urgency-badge {
    display: inline-block;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 16px;
  }
  .field-group {
    margin-bottom: 24px;
  }
  .field-label {
    font-weight: 500;
    color: #004166;
    margin-bottom: 8px;
    display: block;
  }
  .field-value {
    color: #1f2937;
    padding: 12px;
    background-color: #f8fafc;
    border-radius: 6px;
    border-left: 3px solid #1278B3;
  }
  .message-content {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  .email-footer {
    background-color: #f8fafc;
    padding: 24px;
    text-align: center;
    font-size: 14px;
    color: #6b7280;
    border-top: 1px solid #e5e7eb;
  }
  .emergency-notice {
    background-color: #fef2f2;
    border: 2px solid #dc2626;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
    color: #991b1b;
  }
  .emergency-notice strong {
    color: #dc2626;
  }
  .metadata {
    font-size: 12px;
    color: #9ca3af;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
  }
`

/**
 * Get urgency badge HTML
 */
function getUrgencyBadge(urgency: ContactFormData['urgency']): string {
  const urgencyData = URGENCY_LEVELS.find(u => u.value === urgency)
  if (!urgencyData) return ''

  return `<div class="urgency-badge" style="background-color: ${urgencyData.color}; color: white;">
    ${urgencyData.label}
  </div>`
}

/**
 * Admin notification email template
 */
export function generateAdminNotificationEmail(data: ContactFormData, metadata?: {
  ipAddress?: string
  userAgent?: string
  timestamp?: string
}): { subject: string; html: string } {
  const isEmergency = data.urgency === 'emergency'

  const subject = `${isEmergency ? '🚨 NOTFALL - ' : ''}[${data.urgency.toUpperCase()}] Kontaktanfrage: ${data.subject}`

  const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neue Kontaktanfrage</title>
  <style>${emailStyles}</style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>🏥 Neue Kontaktanfrage</h1>
    </div>

    <div class="email-body">
      ${isEmergency ? `
        <div class="emergency-notice">
          <strong>⚠️ NOTFALL-KONTAKTANFRAGE</strong><br>
          Diese Anfrage wurde als Notfall markiert und benötigt sofortige Aufmerksamkeit!
        </div>
      ` : ''}

      ${getUrgencyBadge(data.urgency)}

      <div class="field-group">
        <span class="field-label">Betreff</span>
        <div class="field-value"><strong>${data.subject}</strong></div>
      </div>

      <div class="field-group">
        <span class="field-label">Name</span>
        <div class="field-value">${data.firstName} ${data.lastName}</div>
      </div>

      <div class="field-group">
        <span class="field-label">E-Mail</span>
        <div class="field-value">
          <a href="mailto:${data.email}" style="color: #1278B3;">${data.email}</a>
        </div>
      </div>

      ${data.phone ? `
        <div class="field-group">
          <span class="field-label">Telefon</span>
          <div class="field-value">
            <a href="tel:${data.phone}" style="color: #1278B3;">${data.phone}</a>
          </div>
        </div>
      ` : ''}

      ${data.specialty ? `
        <div class="field-group">
          <span class="field-label">Fachbereich</span>
          <div class="field-value">${data.specialty}</div>
        </div>
      ` : ''}

      <div class="field-group">
        <span class="field-label">Bevorzugter Kontaktweg</span>
        <div class="field-value">
          ${data.preferredContact === 'email' ? 'E-Mail' : data.preferredContact === 'phone' ? 'Telefon' : 'E-Mail und Telefon'}
        </div>
      </div>

      <div class="field-group">
        <span class="field-label">Nachricht</span>
        <div class="field-value message-content">${data.message}</div>
      </div>

      ${data.newsletter ? `
        <div class="field-group">
          <span class="field-label">✓ Newsletter angemeldet</span>
        </div>
      ` : ''}

      ${metadata ? `
        <div class="metadata">
          <strong>Metadaten:</strong><br>
          ${metadata.timestamp ? `Zeitstempel: ${metadata.timestamp}<br>` : ''}
          ${metadata.ipAddress ? `IP-Adresse: ${metadata.ipAddress}<br>` : ''}
          ${metadata.userAgent ? `User-Agent: ${metadata.userAgent}<br>` : ''}
        </div>
      ` : ''}
    </div>

    <div class="email-footer">
      <p style="margin: 0;">
        <strong>zweitmeinung.ng</strong> Healthcare Platform<br>
        Medizinische Zweitmeinung für bessere Entscheidungen
      </p>
      <p style="margin: 8px 0 0; font-size: 12px;">
        Diese E-Mail wurde automatisch generiert. Bitte antworten Sie direkt an die E-Mail-Adresse des Absenders.
      </p>
    </div>
  </div>
</body>
</html>
  `

  return { subject, html }
}

/**
 * User confirmation email template
 */
export function generateUserConfirmationEmail(data: ContactFormData): { subject: string; html: string } {
  const subject = `Ihre Kontaktanfrage bei zweitmeinung.ng`

  const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bestätigung Ihrer Kontaktanfrage</title>
  <style>${emailStyles}</style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>✓ Empfangsbestätigung</h1>
    </div>

    <div class="email-body">
      <p>Sehr geehrte/r ${data.firstName} ${data.lastName},</p>

      <p>vielen Dank für Ihre Kontaktanfrage bei <strong>zweitmeinung.ng</strong>.</p>

      <p>Wir haben Ihre Nachricht erhalten und werden uns innerhalb von <strong>24 Stunden</strong> bei Ihnen melden.</p>

      <h3 style="color: #004166; margin-top: 32px; margin-bottom: 16px;">Ihre gesendeten Daten:</h3>

      ${getUrgencyBadge(data.urgency)}

      <div class="field-group">
        <span class="field-label">Betreff</span>
        <div class="field-value">${data.subject}</div>
      </div>

      ${data.specialty ? `
        <div class="field-group">
          <span class="field-label">Fachbereich</span>
          <div class="field-value">${data.specialty}</div>
        </div>
      ` : ''}

      <div class="field-group">
        <span class="field-label">Ihre Nachricht</span>
        <div class="field-value message-content">${data.message}</div>
      </div>

      <div class="field-group">
        <span class="field-label">Bevorzugter Kontaktweg</span>
        <div class="field-value">
          ${data.preferredContact === 'email' ? 'E-Mail' : data.preferredContact === 'phone' ? 'Telefon' : 'E-Mail und Telefon'}
        </div>
      </div>

      ${data.urgency === 'emergency' ? `
        <div class="emergency-notice">
          <strong>⚠️ NOTFALL-HINWEIS</strong><br>
          Bei medizinischen Notfällen wenden Sie sich bitte umgehend an:<br>
          <strong>Notruf: 112</strong> (lebensbedrohliche Situationen)<br>
          <strong>Ärztlicher Bereitschaftsdienst: 116 117</strong> (dringend, aber nicht lebensbedrohlich)
        </div>
      ` : `
        <div style="background-color: #eff6ff; border-left: 3px solid #1278B3; padding: 16px; border-radius: 6px; margin-top: 24px;">
          <strong>📞 Bei dringenden medizinischen Fragen:</strong><br>
          Notruf: <a href="tel:112" style="color: #1278B3;">112</a> (lebensbedrohlich)<br>
          Ärztlicher Bereitschaftsdienst: <a href="tel:116117" style="color: #1278B3;">116 117</a>
        </div>
      `}
    </div>

    <div class="email-footer">
      <p style="margin: 0;">
        <strong>zweitmeinung.ng</strong><br>
        Medizinische Zweitmeinung für bessere Entscheidungen
      </p>
      <p style="margin: 16px 0 8px;">
        <a href="https://zweitmeinu.ng" style="color: #1278B3; text-decoration: none;">🌐 Website besuchen</a> |
        <a href="mailto:kontakt@zweitmeinu.ng" style="color: #1278B3; text-decoration: none;">✉️ E-Mail senden</a>
      </p>
      <p style="margin: 8px 0 0; font-size: 12px;">
        Diese E-Mail wurde automatisch generiert.<br>
        Alle Angaben werden vertraulich behandelt (DSGVO-konform).
      </p>
    </div>
  </div>
</body>
</html>
  `

  return { subject, html }
}
