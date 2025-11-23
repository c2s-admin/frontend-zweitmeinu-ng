# CAPTCHA Setup-Anleitung

**Ziel:** CAPTCHA für Kontaktformular einrichten (Spam-Schutz)
**Plattform:** zweitmeinung.ng Healthcare Platform
**Stand:** 22.11.2025

---

## 📊 CAPTCHA-Vergleich: hCaptcha vs. reCAPTCHA

| Feature | hCaptcha | Google reCAPTCHA v2 | Google reCAPTCHA v3 |
|---------|----------|---------------------|---------------------|
| **Preis** | ✅ Kostenlos (unlimitiert) | ✅ Kostenlos (1M/Monat) | ✅ Kostenlos (1M/Monat) |
| **Datenschutz** | ✅ DSGVO-freundlich | ⚠️ Google-Analytics | ⚠️ Google-Analytics |
| **User Experience** | Checkbox + Bildauswahl | Checkbox + Bildauswahl | Unsichtbar (Score-basiert) |
| **Healthcare** | ✅ Empfohlen | ⚠️ OK | ⚠️ OK |
| **Accessibility** | ✅ Gut (Audio-Fallback) | ✅ Gut | ⚠️ Problematisch |
| **Bot-Schutz** | ✅ Sehr gut | ✅ Sehr gut | ✅ Exzellent |

**Empfehlung für Healthcare:** **hCaptcha** (DSGVO-konform, keine Google-Tracking)

---

## 🔷 Option 1: hCaptcha (Empfohlen)

### Vorteile
- ✅ **DSGVO-konform** ohne zusätzliche Anpassungen
- ✅ **Kostenlos** ohne Limits
- ✅ **Privacy-First** (keine Tracking-Cookies)
- ✅ **Accessibility** (Audio-Alternative, Tastatur-Navigation)
- ✅ **Healthcare-geeignet** (keine medizinischen Daten an Dritte)

### Schritt-für-Schritt Anleitung

#### 1. hCaptcha Account erstellen

1. **Website öffnen:** [https://www.hcaptcha.com/](https://www.hcaptcha.com/)
2. **"Sign Up" klicken** (Oben rechts)
3. **Registrierung:**
   - Email: `kontakt@zweitmeinu.ng` (oder Admin-Email)
   - Password: Sicheres Passwort wählen
   - Account Type: **"Publisher"** auswählen

#### 2. Site hinzufügen

Nach Login:

1. **Dashboard öffnen:** [https://dashboard.hcaptcha.com/sites](https://dashboard.hcaptcha.com/sites)
2. **"New Site" klicken**
3. **Site-Konfiguration:**
   ```
   Site Name: zweitmeinung.ng - Contact Form
   Hostname: zweitmeinu.ng
   Additional Hostnames:
     - localhost (für Development)
     - dev.zweitmeinu.ng (falls vorhanden)
   ```
4. **Difficulty Level:** "Easy" (für Healthcare-Nutzer empfohlen)
5. **"Save" klicken**

#### 3. Site Key & Secret Key kopieren

Nach dem Speichern zeigt hCaptcha:

```
Site Key (Public):  xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Secret Key:         0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Wichtig:**
- ✅ **Site Key** → Frontend (.env.local als `NEXT_PUBLIC_*`)
- ✅ **Secret Key** → Backend (.env.local **OHNE** `NEXT_PUBLIC_`)

#### 4. Environment Variables setzen

In `.env.local` (Root-Verzeichnis):

```bash
# hCaptcha Configuration
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
HCAPTCHA_SECRET_KEY=0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
CAPTCHA_PROVIDER=hcaptcha
```

#### 5. Dependency installieren

```bash
npm install @hcaptcha/react-hcaptcha
```

#### 6. Frontend-Integration (Beispiel)

```tsx
'use client'

import HCaptcha from '@hcaptcha/react-hcaptcha'
import { useRef } from 'react'

export function ContactForm() {
  const captchaRef = useRef<HCaptcha>(null)

  const onSubmit = async (data: FormData) => {
    // Get CAPTCHA token
    const token = await captchaRef.current?.execute()

    // Submit with token
    await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({ ...data, captchaToken: token })
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields... */}

      {/* hCaptcha Widget */}
      <HCaptcha
        ref={captchaRef}
        sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
        size="normal"
        theme="light"
        onVerify={(token) => console.log('Verified:', token)}
        onError={(err) => console.error('CAPTCHA Error:', err)}
        onExpire={() => console.warn('CAPTCHA Expired')}
      />

      <button type="submit">Absenden</button>
    </form>
  )
}
```

#### 7. Backend-Verification (API Route)

```typescript
// src/app/api/contact/route.ts
async function verifyHCaptcha(token: string): Promise<boolean> {
  const response = await fetch('https://hcaptcha.com/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: process.env.HCAPTCHA_SECRET_KEY!,
      response: token
    })
  })

  const data = await response.json()
  return data.success === true
}

export async function POST(request: Request) {
  const body = await request.json()

  // Verify CAPTCHA
  if (body.captchaToken) {
    const isValid = await verifyHCaptcha(body.captchaToken)
    if (!isValid) {
      return NextResponse.json(
        { error: 'CAPTCHA-Verifizierung fehlgeschlagen' },
        { status: 400 }
      )
    }
  }

  // Process form...
}
```

#### 8. Accessibility-Features aktivieren

In hCaptcha Dashboard:

1. **Settings → Accessibility**
2. **Enable Audio Challenge** ✅
3. **Enable Keyboard Navigation** ✅
4. **Language:** `de` (Deutsch)

#### 9. Healthcare-Optimierungen

In hCaptcha Dashboard → **Appearance Settings:**

```
Theme: Light (bessere Kontraste für Healthcare)
Size: Normal (56px+ Touch-Target konform)
Difficulty: Easy (für gestresste Patienten)
```

#### 10. DSGVO-Datenschutzerklärung aktualisieren

In `/datenschutz` ergänzen:

```markdown
### Spam-Schutz (hCaptcha)

Zum Schutz vor Spam verwenden wir hCaptcha von Intuition Machines, Inc.
Bei der Nutzung des Kontaktformulars wird ein CAPTCHA angezeigt.

**Datenverarbeitung:**
- IP-Adresse (anonymisiert)
- Browserinformationen
- Interaktionsdaten mit dem CAPTCHA

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
**Datenschutzerklärung hCaptcha:** https://www.hcaptcha.com/privacy
```

---

## 🔵 Option 2: Google reCAPTCHA v2 (Alternative)

### Schritt-für-Schritt Anleitung

#### 1. Google Account & reCAPTCHA Admin

1. **Website öffnen:** [https://www.google.com/recaptcha/admin](https://www.google.com/recaptcha/admin)
2. **Mit Google-Account anmelden**
3. **"Create" / "+" klicken**

#### 2. Site registrieren

**Formular ausfüllen:**

```
Label: zweitmeinung.ng Contact Form
reCAPTCHA type: ✅ reCAPTCHA v2 → "I'm not a robot" Checkbox
Domains:
  - zweitmeinu.ng
  - localhost (für Development)
Owners: kontakt@zweitmeinung.ng
Accept reCAPTCHA Terms: ✅
```

**"Submit" klicken**

#### 3. Keys kopieren

Google zeigt nach Registrierung:

```
Site Key:   6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Secret Key: 6LcYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
```

#### 4. Environment Variables

```bash
# reCAPTCHA v2 Configuration
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
RECAPTCHA_SECRET_KEY=6LcYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
CAPTCHA_PROVIDER=recaptcha
```

#### 5. Dependency installieren

```bash
npm install react-google-recaptcha @types/react-google-recaptcha
```

#### 6. Frontend-Integration

```tsx
'use client'

import ReCAPTCHA from 'react-google-recaptcha'
import { useRef } from 'react'

export function ContactForm() {
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const onSubmit = async (data: FormData) => {
    const token = recaptchaRef.current?.getValue()

    await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({ ...data, captchaToken: token })
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields... */}

      {/* reCAPTCHA Widget */}
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        theme="light"
        size="normal"
        onChange={(token) => console.log('Token:', token)}
        onExpired={() => recaptchaRef.current?.reset()}
      />

      <button type="submit">Absenden</button>
    </form>
  )
}
```

#### 7. Backend-Verification

```typescript
async function verifyReCaptcha(token: string): Promise<boolean> {
  const response = await fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY!,
        response: token
      })
    }
  )

  const data = await response.json()
  return data.success === true
}
```

#### 8. DSGVO-Hinweise

**Wichtig für reCAPTCHA:**
- ⚠️ Google Analytics Tracking (IP-Adressen an Google)
- ⚠️ Cookie-Banner erforderlich
- ⚠️ Datenschutzerklärung muss Google-Datenübermittlung erwähnen

**Datenschutzerklärung ergänzen:**

```markdown
### Spam-Schutz (Google reCAPTCHA)

Zum Schutz vor Spam verwenden wir Google reCAPTCHA.

**Datenübermittlung an Google LLC (USA):**
- IP-Adresse
- Browserinformationen
- Interaktionsdaten

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO
**Datenschutzerklärung:** https://policies.google.com/privacy
```

---

## 🔧 Testing & Debugging

### Development-Modus

Für lokales Testen **ohne** CAPTCHA:

```typescript
// .env.local
CAPTCHA_ENABLED=false  // Disable in Development
```

```typescript
// API Route
const captchaEnabled = process.env.CAPTCHA_ENABLED !== 'false'

if (captchaEnabled && body.captchaToken) {
  const isValid = await verifyCaptcha(body.captchaToken)
  if (!isValid) {
    return NextResponse.json({ error: 'CAPTCHA failed' }, { status: 400 })
  }
}
```

### Test-Keys (hCaptcha)

hCaptcha bietet Test-Keys für Development:

```bash
# Immer erfolgreich
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=10000000-ffff-ffff-ffff-000000000001
HCAPTCHA_SECRET_KEY=0x0000000000000000000000000000000000000000

# Immer fehlgeschlagen
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=20000000-ffff-ffff-ffff-000000000002
HCAPTCHA_SECRET_KEY=0x0000000000000000000000000000000000000000
```

### CAPTCHA-Logs prüfen

```typescript
// Backend-Logging
logger.info('CAPTCHA verification', {
  provider: process.env.CAPTCHA_PROVIDER,
  success: isValid,
  timestamp: new Date().toISOString()
})
```

---

## ✅ Checklist

### hCaptcha Setup
- [ ] Account erstellt auf hcaptcha.com
- [ ] Site hinzugefügt (zweitmeinu.ng + localhost)
- [ ] Site Key & Secret Key kopiert
- [ ] Environment Variables gesetzt (.env.local)
- [ ] Dependency installiert (`@hcaptcha/react-hcaptcha`)
- [ ] Frontend-Widget integriert
- [ ] Backend-Verification implementiert
- [ ] Accessibility-Features aktiviert
- [ ] DSGVO-Datenschutzerklärung aktualisiert
- [ ] Testing durchgeführt

### reCAPTCHA Setup (Alternative)
- [ ] Google Account vorhanden
- [ ] Site registriert (google.com/recaptcha/admin)
- [ ] Site Key & Secret Key kopiert
- [ ] Environment Variables gesetzt
- [ ] Dependency installiert (`react-google-recaptcha`)
- [ ] Frontend-Widget integriert
- [ ] Backend-Verification implementiert
- [ ] DSGVO Cookie-Banner angepasst
- [ ] Datenschutzerklärung aktualisiert
- [ ] Testing durchgeführt

---

## 🎯 Empfehlung

**Für zweitmeinung.ng Healthcare Platform:**

### **✅ hCaptcha (Empfohlen)**

**Gründe:**
1. **DSGVO-konform** ohne zusätzliche Anpassungen
2. **Privacy-First** (keine Google-Tracking)
3. **Healthcare-geeignet** (Patientendaten bleiben in EU)
4. **Kostenlos** ohne Limits
5. **Accessibility** (Audio-Alternative, Tastatur)
6. **Einfache Integration**

**Zeit:** ~30 Minuten Setup

---

## 📚 Weitere Ressourcen

### hCaptcha
- **Dokumentation:** https://docs.hcaptcha.com/
- **Dashboard:** https://dashboard.hcaptcha.com/
- **React Integration:** https://docs.hcaptcha.com/configuration#react
- **Privacy Policy:** https://www.hcaptcha.com/privacy

### reCAPTCHA
- **Dokumentation:** https://developers.google.com/recaptcha/docs/display
- **Admin Console:** https://www.google.com/recaptcha/admin
- **Best Practices:** https://developers.google.com/recaptcha/docs/faq

---

## 🚀 Nächste Schritte

1. **hCaptcha Account erstellen** (15 min)
2. **Site Key & Secret Key in .env.local eintragen** (5 min)
3. **Dependency installieren** (`npm install @hcaptcha/react-hcaptcha`)
4. **Kontaktformular-Implementierung starten**

---

**Erstellt:** 22.11.2025
**Plattform:** zweitmeinung.ng Healthcare Platform
**Empfehlung:** hCaptcha (DSGVO-konform, Privacy-First)
