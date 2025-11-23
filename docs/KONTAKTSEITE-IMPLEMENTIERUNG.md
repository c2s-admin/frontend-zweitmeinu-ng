# Kontaktseite - Implementierungsplan

**Stand:** 22.11.2025
**Plattform:** zweitmeinung.ng (Healthcare Second Opinion Platform)
**Ziel:** Production-ready Kontaktformular mit Email-Integration

---

## 📊 Bestehende Infrastruktur (✅ Vorhanden)

### ✅ TypeScript Types (`src/types/contact.ts`)
```typescript
interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  subject: string
  message: string
  specialty?: string  // Medical specialty
  urgency: 'low' | 'medium' | 'high' | 'emergency'
  preferredContact: 'email' | 'phone' | 'both'
  consent: boolean  // GDPR mandatory
  newsletter?: boolean
  captchaToken?: string
}
```

### ✅ Strapi Integration (`src/lib/strapi/contact-messages.ts`)
- `submitContactMessage()` - POST to Strapi
- `getCaptchaConfig()` - CAPTCHA configuration
- Content Type: `contact-messages` bereits vorhanden

### ✅ Medical Context
- 10 medizinische Fachbereiche vordefiniert
- 4 Dringlichkeitsstufen (low, medium, high, emergency)
- 3 Kontaktpräferenzen

---

## 🎯 Architektur-Übersicht

```
┌─────────────────────────────────────────────────────────────┐
│                     Kontaktseite (/kontakt)                  │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
    ┌─────▼─────┐      ┌─────▼─────┐      ┌─────▼─────┐
    │ Kontakt-  │      │  Formular │      │ Erfolgs-  │
    │  Infos    │      │ Component │      │ Feedback  │
    │ (Strapi)  │      │ (Client)  │      │  Modal    │
    └───────────┘      └─────┬─────┘      └───────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Validation       │
                    │  (Zod + RHF)      │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │  API Route        │
                    │  /api/contact     │
                    └─────────┬─────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
    ┌─────▼─────┐      ┌─────▼─────┐      ┌─────▼─────┐
    │  Strapi   │      │   Email   │      │  Logging  │
    │   Save    │      │   Send    │      │  (Pino)   │
    └───────────┘      └───────────┘      └───────────┘
```

---

## 🔧 Komponenten-Struktur

### 1. **Kontaktseite** (`src/app/kontakt/page.tsx`)
**Typ:** Server Component
**Verantwortung:**
- Strapi-Daten laden (Kontaktinformationen, Öffnungszeiten)
- SEO Metadata generieren
- Statische Kontaktinformationen darstellen
- Formular-Component einbinden

**Features:**
```tsx
- Emergency Banner (112 / 116 117)
- Kontaktinformationen-Card (Email, Telefon, Öffnungszeiten)
- Standort/Adresse mit Google Maps Integration
- Kontaktformular-Component
- FAQ-Section "Häufige Kontaktfragen"
```

---

### 2. **Kontaktformular** (`src/components/forms/ContactForm.tsx`)
**Typ:** Client Component (`'use client'`)
**Libraries:**
- `react-hook-form` (v7.53.0) - Form State Management
- `zod` - Schema Validation
- `@hookform/resolvers/zod` - Integration

**Form Fields:**
```typescript
1. firstName (required, min 2 chars)
2. lastName (required, min 2 chars)
3. email (required, valid email)
4. phone (optional, German format)
5. subject (required, min 5 chars)
6. specialty (dropdown, optional)
7. message (required, min 20 chars, max 2000 chars)
8. urgency (radio buttons)
9. preferredContact (radio buttons)
10. consent (checkbox, required - GDPR)
11. newsletter (checkbox, optional)
12. captcha (hCaptcha/reCAPTCHA)
```

**Validation Schema:**
```typescript
import { z } from 'zod'

const contactFormSchema = z.object({
  firstName: z.string()
    .min(2, 'Vorname muss mindestens 2 Zeichen lang sein')
    .max(50, 'Vorname darf maximal 50 Zeichen lang sein'),

  lastName: z.string()
    .min(2, 'Nachname muss mindestens 2 Zeichen lang sein')
    .max(50, 'Nachname darf maximal 50 Zeichen lang sein'),

  email: z.string()
    .email('Bitte geben Sie eine gültige E-Mail-Adresse ein')
    .min(5, 'E-Mail zu kurz')
    .max(100, 'E-Mail zu lang'),

  phone: z.string()
    .regex(/^(\+49|0)[1-9]\d{1,14}$/, 'Ungültige Telefonnummer (deutsches Format)')
    .optional()
    .or(z.literal('')),

  subject: z.string()
    .min(5, 'Betreff muss mindestens 5 Zeichen lang sein')
    .max(200, 'Betreff darf maximal 200 Zeichen lang sein'),

  message: z.string()
    .min(20, 'Nachricht muss mindestens 20 Zeichen lang sein')
    .max(2000, 'Nachricht darf maximal 2000 Zeichen lang sein'),

  specialty: z.string().optional(),

  urgency: z.enum(['low', 'medium', 'high', 'emergency']),

  preferredContact: z.enum(['email', 'phone', 'both']),

  consent: z.boolean()
    .refine(val => val === true, {
      message: 'Datenschutzerklärung muss akzeptiert werden'
    }),

  newsletter: z.boolean().optional(),

  captchaToken: z.string().optional()
})
```

**States:**
- `isSubmitting` - Loading während Formular-Submit
- `submitError` - Fehler-State mit Fehlermeldung
- `submitSuccess` - Erfolgs-State
- `showSuccessModal` - Success-Modal Visibility

---

### 3. **API Route** (`src/app/api/contact/route.ts`)
**Typ:** Next.js API Route (POST)
**Verantwortung:**
- Request Validation (Zod)
- CAPTCHA Verification
- Strapi Save (contact-messages)
- Email Send (via Mail Server)
- Error Handling
- Logging

**Flow:**
```typescript
export async function POST(request: Request) {
  try {
    // 1. Parse & Validate Request Body
    const body = await request.json()
    const validatedData = contactFormSchema.parse(body)

    // 2. Verify CAPTCHA (if enabled)
    if (validatedData.captchaToken) {
      await verifyCaptcha(validatedData.captchaToken)
    }

    // 3. Save to Strapi CMS
    const strapiResponse = await submitContactMessage({
      ...validatedData,
      submittedAt: new Date().toISOString(),
      ipAddress: getClientIP(request),
      userAgent: request.headers.get('user-agent')
    })

    // 4. Send Email Notification
    await sendContactEmail({
      to: process.env.CONTACT_EMAIL_TO,
      from: process.env.CONTACT_EMAIL_FROM,
      ...validatedData
    })

    // 5. Send Confirmation Email to User
    await sendConfirmationEmail({
      to: validatedData.email,
      name: `${validatedData.firstName} ${validatedData.lastName}`
    })

    // 6. Log Success
    logger.info('Contact form submitted', {
      id: strapiResponse.data.id,
      email: validatedData.email,
      urgency: validatedData.urgency
    })

    // 7. Return Success Response
    return NextResponse.json({
      success: true,
      message: 'Ihre Nachricht wurde erfolgreich gesendet',
      data: strapiResponse.data
    })

  } catch (error) {
    // Error Handling
    logger.error('Contact form error', { error })
    return NextResponse.json(
      {
        success: false,
        message: 'Fehler beim Senden der Nachricht'
      },
      { status: 500 }
    )
  }
}
```

---

### 4. **Email Service** (`src/lib/email/contact-email.ts`)
**Typ:** Server-side Email Helper
**Library:** `nodemailer` (recommended)

**Configuration:**
```typescript
import nodemailer from 'nodemailer'

// Create transporter from environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,     // Your mail server
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendContactEmail(data: ContactFormData) {
  const urgencyEmoji = {
    low: '📧',
    medium: '⚡',
    high: '🔥',
    emergency: '🚨'
  }

  await transporter.sendMail({
    from: process.env.CONTACT_EMAIL_FROM,
    to: process.env.CONTACT_EMAIL_TO,
    replyTo: data.email,
    subject: `${urgencyEmoji[data.urgency]} Kontaktanfrage: ${data.subject}`,
    html: getContactEmailTemplate(data),
  })
}

export async function sendConfirmationEmail(
  to: string,
  name: string
) {
  await transporter.sendMail({
    from: process.env.CONTACT_EMAIL_FROM,
    to,
    subject: 'Ihre Kontaktanfrage bei zweitmeinung.ng',
    html: getConfirmationEmailTemplate(name),
  })
}
```

**Email Templates:**
```typescript
// Admin notification email
function getContactEmailTemplate(data: ContactFormData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Neue Kontaktanfrage</title>
</head>
<body style="font-family: 'Roboto Condensed', Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">

    <!-- Header -->
    <div style="background-color: #004166; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
      <h1 style="margin: 0; font-size: 24px;">🏥 Neue Kontaktanfrage</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">zweitmeinu.ng Healthcare Platform</p>
    </div>

    <!-- Content -->
    <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">

      <!-- Urgency Badge -->
      <div style="margin-bottom: 20px;">
        <span style="background-color: ${getUrgencyColor(data.urgency)}; color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold;">
          Dringlichkeit: ${getUrgencyLabel(data.urgency)}
        </span>
      </div>

      <!-- Personal Info -->
      <h2 style="color: #004166; border-bottom: 2px solid #1278B3; padding-bottom: 10px;">
        Kontaktdaten
      </h2>
      <table style="width: 100%; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 40%;">Name:</td>
          <td style="padding: 8px 0;">${data.firstName} ${data.lastName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">E-Mail:</td>
          <td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td>
        </tr>
        ${data.phone ? `
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Telefon:</td>
          <td style="padding: 8px 0;"><a href="tel:${data.phone}">${data.phone}</a></td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Bevorzugte Kontaktart:</td>
          <td style="padding: 8px 0;">${getContactPreferenceLabel(data.preferredContact)}</td>
        </tr>
      </table>

      <!-- Medical Context -->
      ${data.specialty ? `
      <h2 style="color: #004166; border-bottom: 2px solid #1278B3; padding-bottom: 10px;">
        Medizinischer Kontext
      </h2>
      <table style="width: 100%; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 40%;">Fachbereich:</td>
          <td style="padding: 8px 0;">${getSpecialtyLabel(data.specialty)}</td>
        </tr>
      </table>
      ` : ''}

      <!-- Message -->
      <h2 style="color: #004166; border-bottom: 2px solid #1278B3; padding-bottom: 10px;">
        Betreff
      </h2>
      <p style="font-weight: bold; margin: 10px 0;">${data.subject}</p>

      <h2 style="color: #004166; border-bottom: 2px solid #1278B3; padding-bottom: 10px; margin-top: 20px;">
        Nachricht
      </h2>
      <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #1278B3; margin: 10px 0;">
        ${data.message.replace(/\n/g, '<br>')}
      </div>

      <!-- Footer -->
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
        <p>Diese Nachricht wurde über das Kontaktformular auf <a href="https://zweitmeinu.ng">zweitmeinu.ng</a> gesendet.</p>
        <p>Zeitpunkt: ${new Date().toLocaleString('de-DE')}</p>
      </div>
    </div>
  </div>
</body>
</html>
  `
}

// User confirmation email
function getConfirmationEmailTemplate(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Bestätigung Ihrer Kontaktanfrage</title>
</head>
<body style="font-family: 'Roboto Condensed', Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">

    <div style="background-color: #004166; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
      <h1 style="margin: 0; font-size: 24px;">✅ Nachricht erhalten</h1>
    </div>

    <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">
      <p>Sehr geehrte/r ${name},</p>

      <p>vielen Dank für Ihre Kontaktanfrage über <strong>zweitmeinu.ng</strong>.</p>

      <p>Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>

      <div style="background-color: #10B981; color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <strong>⏱️ Antwortzeit:</strong> In der Regel innerhalb von 24 Stunden
      </div>

      <p><strong>Bei medizinischen Notfällen:</strong></p>
      <ul>
        <li>Notruf: <a href="tel:112" style="color: #DC2626; font-weight: bold;">112</a></li>
        <li>Ärztlicher Bereitschaftsdienst: <a href="tel:116117" style="color: #1278B3; font-weight: bold;">116 117</a></li>
      </ul>

      <p style="margin-top: 30px;">Mit freundlichen Grüßen<br><strong>Ihr Team von zweitmeinu.ng</strong></p>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
        <p>complex care solutions GmbH | Hans-Böckler-Str. 19 | 46236 Bottrop</p>
        <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht direkt auf diese Nachricht.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `
}
```

---

## 🔒 GDPR-Compliance Features

### 1. **Consent Management**
```tsx
<div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
  <input
    type="checkbox"
    {...register('consent')}
    required
    className="mt-1 w-5 h-5"
  />
  <label className="text-sm">
    Ich habe die{' '}
    <a href="/datenschutz" className="text-healthcare-primary-light underline">
      Datenschutzerklärung
    </a>{' '}
    gelesen und stimme der Verarbeitung meiner Daten zu. *
  </label>
</div>
{errors.consent && (
  <p className="text-red-600 text-sm mt-1">{errors.consent.message}</p>
)}
```

### 2. **Data Minimization**
- Nur erforderliche Felder als `required` markieren
- Telefon ist optional (nur wenn bevorzugte Kontaktart = phone)
- Specialty ist optional

### 3. **Purpose Limitation**
```tsx
<div className="bg-healthcare-background p-4 rounded-lg text-sm">
  <h4 className="font-semibold mb-2">🛡️ Datenschutz-Hinweis</h4>
  <p>
    Ihre Daten werden ausschließlich zur Bearbeitung Ihrer Anfrage verwendet
    und nicht an Dritte weitergegeben. Weitere Informationen finden Sie in
    unserer{' '}
    <a href="/datenschutz" className="text-healthcare-primary-light underline">
      Datenschutzerklärung
    </a>.
  </p>
</div>
```

### 4. **IP Address & User Agent Logging**
```typescript
// In API Route
const metadata = {
  ipAddress: getClientIP(request),
  userAgent: request.headers.get('user-agent'),
  submittedAt: new Date().toISOString()
}
```

---

## 🎨 Healthcare Design System

### Color Scheme
```css
--healthcare-primary: #004166
--healthcare-primary-light: #1278B3
--healthcare-success: #10B981
--healthcare-error: #DC2626
--healthcare-warning: #F59E0B
--healthcare-background: #f8fafc
```

### Touch Targets
- **Buttons:** 56px+ height (64px for primary CTA)
- **Input Fields:** 56px height
- **Checkboxes/Radio:** 24px (clickable area 44px+)

### Focus Indicators
```css
focus:ring-3 focus:ring-healthcare-primary-light focus:ring-offset-2
```

---

## ⚙️ Environment Variables

```bash
# .env.local
# SMTP Configuration
SMTP_HOST=your-mail-server.com
SMTP_PORT=587
SMTP_USER=noreply@zweitmeinung.ng
SMTP_PASS=your-smtp-password
SMTP_SECURE=false

# Contact Email Addresses
CONTACT_EMAIL_FROM=noreply@zweitmeinung.ng
CONTACT_EMAIL_TO=kontakt@zweitmeinung.ng

# CAPTCHA (optional)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# Strapi API
NEXT_PUBLIC_STRAPI_URL=https://st.zh3.de/api
```

---

## 📦 Dependencies hinzufügen

```bash
npm install nodemailer @types/nodemailer
npm install react-hook-form @hookform/resolvers zod
npm install @hcaptcha/react-hcaptcha  # Optional: für CAPTCHA
```

---

## ✅ Implementation Checklist

### Phase 1: Setup & Configuration
- [ ] Environment Variables konfigurieren (.env.local)
- [ ] nodemailer installieren
- [ ] SMTP-Server testen
- [ ] Email-Templates erstellen

### Phase 2: API Route
- [ ] /api/contact/route.ts erstellen
- [ ] Zod Validation Schema implementieren
- [ ] Strapi Integration testen
- [ ] Email-Versand implementieren
- [ ] Error Handling & Logging

### Phase 3: Form Component
- [ ] ContactForm.tsx erstellen
- [ ] React Hook Form Setup
- [ ] Alle Formfelder implementieren
- [ ] Client-side Validation
- [ ] Success/Error States
- [ ] Loading States

### Phase 4: Kontaktseite
- [ ] /kontakt/page.tsx erstellen
- [ ] Strapi-Daten laden (Kontaktinfo)
- [ ] Statische Sections (Öffnungszeiten, Adresse)
- [ ] Form Component integrieren
- [ ] Healthcare Design anwenden

### Phase 5: Testing & Polish
- [ ] Formular-Submission testen
- [ ] Email-Empfang testen
- [ ] WCAG 2.1 AA Accessibility prüfen
- [ ] Mobile Responsiveness
- [ ] Browser-Testing
- [ ] Error Scenarios testen

---

## 🚀 Zeitschätzung

| Phase | Zeitaufwand |
|-------|-------------|
| Phase 1: Setup & Config | 1-2h |
| Phase 2: API Route | 2-3h |
| Phase 3: Form Component | 3-4h |
| Phase 4: Kontaktseite | 2-3h |
| Phase 5: Testing & Polish | 1-2h |
| **Gesamt** | **9-14h** (~1-2 Arbeitstage) |

---

## 🎯 Nächste Schritte

1. **Environment Variables bereitstellen:**
   - SMTP-Server Zugangsdaten
   - Email-Adressen (from/to)

2. **SMTP-Server testen:**
   - Einfachen Test-Email-Versand durchführen

3. **Implementation starten:**
   - Mit Phase 1 (Setup) beginnen
   - Schrittweise implementieren

---

**Soll ich mit der Implementierung beginnen?** 🚀
