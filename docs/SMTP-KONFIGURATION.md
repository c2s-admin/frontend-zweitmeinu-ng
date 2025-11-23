# SMTP-Konfiguration für Kontaktformular

**Stand:** 22.11.2025
**Plattform:** zweitmeinung.ng Healthcare Platform

---

## 📧 Bereitgestellte SMTP-Konfiguration

### Server-Details
```
Host:     smtp.zweitmeinu.ng
Port:     465 (SSL/TLS)
Secure:   true
Protocol: SMTPS
```

### Authentifizierung
```
Username: noreply@zweitmeinu.ng
Password: [VERTRAULICH - In .env.local gespeichert]
```

### Email-Adressen
```
Absender (FROM): noreply@zweitmeinu.ng
Empfänger (TO):  kontakt@zweitmeinu.ng  # Achtung: Typo im Original "kontakkt"
```

---

## ⚠️ Wichtige Hinweise

### 1. Typo in Email-Adresse
**Original angegeben:** `kontakkt@zweitmeinu.ng` (mit doppeltem 'k')
**Korrigiert auf:** `kontakt@zweitmeinu.ng` (Standard)

**Bitte prüfen:**
- Existiert `kontakkt@zweitmeinu.ng` wirklich?
- Oder war es ein Tippfehler?

### 2. Port 465 (SMTPS)
- Verwendet **implizites SSL/TLS**
- `SMTP_SECURE=true` in nodemailer erforderlich
- Alternative: Port 587 mit STARTTLS (`SMTP_SECURE=false`)

### 3. Sender Copy Feature
**Anforderung:** Absender des Formulars soll Kopie erhalten

**Implementierung:**
```typescript
// In API Route - 2 Emails versenden:

// 1. Admin-Benachrichtigung
await sendContactEmail({
  to: process.env.CONTACT_EMAIL_TO,  // kontakt@zweitmeinu.ng
  from: process.env.CONTACT_EMAIL_FROM,  // noreply@zweitmeinu.ng
  replyTo: formData.email,  // User Email für Reply
  ...formData
})

// 2. Bestätigung an Nutzer (Kopie)
await sendConfirmationEmail({
  to: formData.email,  // User Email
  from: process.env.CONTACT_EMAIL_FROM,
  ...formData
})
```

---

## 🔧 nodemailer Konfiguration

### Transporter Setup

```typescript
// src/lib/email/transporter.ts
import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,  // smtp.zweitmeinu.ng
  port: parseInt(process.env.SMTP_PORT || '465'),  // 465
  secure: process.env.SMTP_PORT === '465',  // true für 465
  auth: {
    user: process.env.SMTP_USER,  // noreply@zweitmeinu.ng
    pass: process.env.SMTP_PASS,  // [Password]
  },
  // Optional: Debugging
  debug: process.env.NODE_ENV === 'development',
  logger: true,
})

// Connection testen
export async function verifyEmailConnection() {
  try {
    await transporter.verify()
    console.log('✅ SMTP Server ready')
    return true
  } catch (error) {
    console.error('❌ SMTP Error:', error)
    return false
  }
}
```

---

## 📋 Email-Typen

### 1. Admin-Benachrichtigung
**An:** `kontakt@zweitmeinu.ng`
**Von:** `noreply@zweitmeinu.ng`
**Reply-To:** User-Email (für direkte Antwort)
**Betreff:** `[Dringlichkeit] Kontaktanfrage: [Betreff]`

**Inhalt:**
- Kontaktdaten (Name, Email, Telefon)
- Medizinischer Kontext (Fachbereich, Dringlichkeit)
- Nachricht
- Metadaten (Zeitstempel, IP, User-Agent)

### 2. Nutzer-Bestätigung (Kopie)
**An:** User-Email (aus Formular)
**Von:** `noreply@zweitmeinu.ng`
**Betreff:** `Ihre Kontaktanfrage bei zweitmeinung.ng`

**Inhalt:**
- Empfangsbestätigung
- **Kopie der gesendeten Daten:**
  - Betreff
  - Nachricht
  - Fachbereich
  - Dringlichkeit
- Antwortzeit-Hinweis (24h)
- Notfall-Kontakte (112 / 116 117)

---

## 🧪 Testing

### 1. SMTP-Connection testen

```bash
# In Project Root
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.zweitmeinu.ng',
  port: 465,
  secure: true,
  auth: {
    user: 'noreply@zweitmeinu.ng',
    pass: '87n*4b6dM'
  }
});

transporter.verify()
  .then(() => console.log('✅ SMTP OK'))
  .catch(err => console.error('❌ Error:', err));
"
```

### 2. Test-Email senden

```typescript
// Test-Script: scripts/test-email.ts
import { transporter } from '@/lib/email/transporter'

async function sendTestEmail() {
  await transporter.sendMail({
    from: 'noreply@zweitmeinu.ng',
    to: 'kontakt@zweitmeinu.ng',
    subject: 'Test-Email von zweitmeinung.ng',
    text: 'Dies ist eine Test-Email.',
    html: '<h1>Test erfolgreich!</h1><p>SMTP funktioniert.</p>'
  })
  console.log('✅ Test-Email gesendet')
}

sendTestEmail()
```

```bash
# Ausführen:
npx tsx scripts/test-email.ts
```

---

## 🔒 Sicherheit

### 1. .env.local Schutz

**WICHTIG:** `.env.local` darf **NIEMALS** in Git committed werden!

```bash
# .gitignore prüfen
cat .gitignore | grep ".env.local"

# Output sollte sein:
# .env.local
```

### 2. Environment Variables Validierung

```typescript
// src/lib/env.ts
import { z } from 'zod'

const emailEnvSchema = z.object({
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.string().regex(/^\d+$/),
  SMTP_USER: z.string().email(),
  SMTP_PASS: z.string().min(8),
  CONTACT_EMAIL_FROM: z.string().email(),
  CONTACT_EMAIL_TO: z.string().email(),
})

export const emailConfig = emailEnvSchema.parse({
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  CONTACT_EMAIL_FROM: process.env.CONTACT_EMAIL_FROM,
  CONTACT_EMAIL_TO: process.env.CONTACT_EMAIL_TO,
})
```

### 3. Rate Limiting

**Empfehlung:** Rate Limiting für Contact-API implementieren

```typescript
// Verhindert Spam/Abuse
// Max 5 Formulare pro IP pro Stunde
```

---

## ✅ Checklist

### Setup
- [ ] .env.local erstellt (von .env.local.example)
- [ ] SMTP-Credentials eingetragen
- [ ] Typo in Email-Adresse geklärt (kontakt vs kontakkt)
- [ ] nodemailer installiert (`npm install nodemailer @types/nodemailer`)

### Testing
- [ ] SMTP-Connection getestet (verify())
- [ ] Test-Email gesendet an kontakt@zweitmeinu.ng
- [ ] Test-Email empfangen bestätigt
- [ ] Reply-To funktioniert
- [ ] User-Kopie funktioniert

### Sicherheit
- [ ] .env.local in .gitignore
- [ ] Environment Validation implementiert
- [ ] Rate Limiting geplant
- [ ] Error Logging eingerichtet

### Production
- [ ] Gleiche Credentials für Production-Server
- [ ] DNS/MX Records geprüft
- [ ] SPF/DKIM konfiguriert (Anti-Spam)
- [ ] Email-Delivery getestet

---

## 📞 Support

**Bei SMTP-Problemen:**
1. SMTP-Logs prüfen (nodemailer debug mode)
2. Server-Firewall prüfen (Port 465 offen?)
3. Email-Provider kontaktieren
4. Alternative: Port 587 mit STARTTLS testen

---

**Erstellt:** 22.11.2025
**Status:** Bereit für Implementation
**Nächster Schritt:** nodemailer integration + Email-Templates
