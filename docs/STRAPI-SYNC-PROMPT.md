# Prompt für Claude auf dem Strapi Server

## 📋 Kontext

Du arbeitest auf einem Strapi 5.20.0 CMS Server für eine medizinische Zweitmeinungs-Plattform (zweitmeinung.ng). Deine Aufgabe ist es, ein automatisches Synchronisations-System zu implementieren, das Datenschutzerklärungen von einem externen Beratungsunternehmen in das Strapi CMS importiert.

---

## 🎯 Ziel der Implementierung

Erstelle ein vollständiges System zur automatischen Synchronisation von Datenschutzerklärungen mit folgenden Anforderungen:

1. **Automatischer Sync** per Cronjob (täglich 02:00 Uhr)
2. **Manueller Trigger** über Admin UI und API Endpoint
3. **Webhook-Support** für Provider-Updates
4. **Versionierung** mit Changelog und Diff-Tracking
5. **Fehlerbehandlung** mit Retry-Logik und Alerting
6. **Admin Dashboard** für Monitoring und Management

---

## 📊 Bestehende Infrastruktur

### Strapi Version
- **Strapi:** 5.20.0
- **Node.js:** 18+
- **Database:** PostgreSQL (vermutlich)

### Bestehender Content Type: `legal-page`

**Aktuelles Schema:**
```json
{
  "kind": "collectionType",
  "collectionName": "legal_pages",
  "info": {
    "singularName": "legal-page",
    "pluralName": "legal-pages",
    "displayName": "Legal Page"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "type": {
      "type": "enumeration",
      "enum": ["impressum", "datenschutz", "agb", "cookie-policy", "other"]
    },
    "content": {
      "type": "text"
    },
    "country": {
      "type": "string"
    },
    "language": {
      "type": "string"
    },
    "validFrom": {
      "type": "date"
    },
    "validUntil": {
      "type": "date"
    },
    "version": {
      "type": "string"
    }
  }
}
```

---

## ✅ Aufgaben-Checkliste

### Phase 1: Content Type Erweiterung

**Aufgabe 1.1:** Erweitere den `legal-page` Content Type mit Sync-Metadaten

Füge folgende Felder hinzu:

```json
{
  "sourceProvider": {
    "type": "string",
    "default": null
  },
  "sourceUrl": {
    "type": "string",
    "default": null
  },
  "lastSyncedAt": {
    "type": "datetime",
    "default": null
  },
  "syncStatus": {
    "type": "enumeration",
    "enum": ["success", "failed", "pending", "never"],
    "default": "never"
  },
  "syncError": {
    "type": "text",
    "default": null
  },
  "autoSync": {
    "type": "boolean",
    "default": false
  },
  "syncFrequency": {
    "type": "enumeration",
    "enum": ["daily", "weekly", "manual"],
    "default": "daily"
  },
  "changelog": {
    "type": "json",
    "default": []
  },
  "providerVersion": {
    "type": "string",
    "default": null
  },
  "providerMetadata": {
    "type": "json",
    "default": {}
  }
}
```

**Dateipfad:** `src/api/legal-page/content-types/legal-page/schema.json`

---

### Phase 2: Sync Service

**Aufgabe 2.1:** Erstelle einen Sync Service

**Dateipfad:** `src/api/legal-page/services/sync-service.js`

**Funktionalität:**

```javascript
'use strict';

const axios = require('axios');
const { JSDOM } = require('jsdom');
const createDOMPurify = require('isomorphic-dompurify');

module.exports = ({ strapi }) => ({
  /**
   * Synchronisiert Datenschutzerklärung vom Provider
   */
  async syncFromProvider(providerConfig) {
    try {
      // 1. Fetch von Provider API
      const providerData = await this.fetchFromProvider(providerConfig);

      // 2. Validiere Content
      const validatedContent = await this.validateContent(providerData.content);

      // 3. Finde oder erstelle Legal Page Entry
      const existingEntry = await strapi.db.query('api::legal-page.legal-page').findOne({
        where: { type: 'datenschutz' }
      });

      // 4. Detect Changes
      const hasChanges = existingEntry
        ? this.detectChanges(existingEntry.content, validatedContent)
        : true;

      if (!hasChanges) {
        // Nur lastSyncedAt aktualisieren
        await strapi.db.query('api::legal-page.legal-page').update({
          where: { id: existingEntry.id },
          data: {
            lastSyncedAt: new Date(),
            syncStatus: 'success'
          }
        });

        return {
          success: true,
          message: 'No changes detected',
          hasChanges: false
        };
      }

      // 5. Erstelle Changelog Entry
      const changelogEntry = await this.createChangelogEntry(
        existingEntry?.content,
        validatedContent,
        providerData
      );

      // 6. Update oder Create
      const updatedData = {
        type: 'datenschutz',
        content: validatedContent,
        version: providerData.version || this.generateVersion(),
        sourceProvider: providerConfig.name,
        sourceUrl: providerConfig.url,
        lastSyncedAt: new Date(),
        syncStatus: 'success',
        syncError: null,
        providerVersion: providerData.version,
        providerMetadata: providerData.metadata || {},
        changelog: existingEntry
          ? [...(existingEntry.changelog || []), changelogEntry]
          : [changelogEntry],
        language: 'de',
        country: 'DE',
        publishedAt: new Date() // Auto-publish
      };

      let result;
      if (existingEntry) {
        result = await strapi.db.query('api::legal-page.legal-page').update({
          where: { id: existingEntry.id },
          data: updatedData
        });
      } else {
        result = await strapi.db.query('api::legal-page.legal-page').create({
          data: updatedData
        });
      }

      // 7. Log Success
      strapi.log.info(`[SYNC] Datenschutzerklärung erfolgreich synchronisiert`, {
        version: providerData.version,
        hasChanges: true,
        entryId: result.id
      });

      // 8. Trigger Webhook/Notification (optional)
      await this.notifySuccess(result);

      return {
        success: true,
        message: 'Sync completed successfully',
        hasChanges: true,
        entry: result
      };

    } catch (error) {
      strapi.log.error('[SYNC] Fehler bei Synchronisation:', error);

      // Update sync status to failed
      const existingEntry = await strapi.db.query('api::legal-page.legal-page').findOne({
        where: { type: 'datenschutz' }
      });

      if (existingEntry) {
        await strapi.db.query('api::legal-page.legal-page').update({
          where: { id: existingEntry.id },
          data: {
            syncStatus: 'failed',
            syncError: error.message
          }
        });
      }

      // Trigger Alert
      await this.notifyError(error);

      return {
        success: false,
        message: error.message,
        error: error
      };
    }
  },

  /**
   * Holt Daten vom Provider
   */
  async fetchFromProvider(config) {
    const response = await axios({
      method: 'GET',
      url: config.url,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Accept': 'application/json, text/html',
        'User-Agent': 'Strapi-Sync-Service/1.0'
      },
      timeout: 30000 // 30 Sekunden Timeout
    });

    // Erwarte JSON oder HTML
    if (typeof response.data === 'string') {
      return {
        content: response.data,
        version: response.headers['x-version'] || null,
        metadata: {
          contentType: response.headers['content-type'],
          lastModified: response.headers['last-modified']
        }
      };
    }

    return response.data;
  },

  /**
   * Validiert und säubert HTML Content
   */
  async validateContent(html) {
    const DOMPurify = createDOMPurify(new JSDOM('').window);

    const cleanHtml = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'hr',
        'ul', 'ol', 'li',
        'a', 'strong', 'em', 'u', 'code',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span', 'section', 'article'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel',
        'class', 'id',
        'colspan', 'rowspan'
      ],
      ALLOW_DATA_ATTR: false
    });

    // Entferne leere Absätze
    const cleanedHtml = cleanHtml
      .replace(/<p>\s*<\/p>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return cleanedHtml;
  },

  /**
   * Erkennt Änderungen zwischen alter und neuer Version
   */
  detectChanges(oldContent, newContent) {
    // Einfacher String-Vergleich
    if (!oldContent) return true;

    // Normalisiere Whitespace für Vergleich
    const normalize = (str) => str.replace(/\s+/g, ' ').trim();

    return normalize(oldContent) !== normalize(newContent);
  },

  /**
   * Erstellt Changelog Entry
   */
  async createChangelogEntry(oldContent, newContent, providerData) {
    return {
      timestamp: new Date().toISOString(),
      providerVersion: providerData.version,
      action: oldContent ? 'updated' : 'created',
      changes: {
        contentLengthBefore: oldContent?.length || 0,
        contentLengthAfter: newContent.length,
        diff: this.calculateDiff(oldContent, newContent)
      }
    };
  },

  /**
   * Berechnet Diff zwischen zwei Versionen
   */
  calculateDiff(oldContent, newContent) {
    if (!oldContent) return { type: 'created' };

    // Vereinfachter Diff
    const oldLength = oldContent.length;
    const newLength = newContent.length;
    const lengthDiff = newLength - oldLength;

    return {
      type: 'modified',
      lengthDiff: lengthDiff,
      percentageChange: ((lengthDiff / oldLength) * 100).toFixed(2)
    };
  },

  /**
   * Generiert Version String
   */
  generateVersion() {
    const now = new Date();
    return `v${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')}`;
  },

  /**
   * Benachrichtigung bei Erfolg
   */
  async notifySuccess(entry) {
    // Optional: E-Mail, Webhook, Slack, etc.
    strapi.log.info('[SYNC] Notification: Sync erfolgreich', {
      entryId: entry.id,
      version: entry.version
    });
  },

  /**
   * Benachrichtigung bei Fehler
   */
  async notifyError(error) {
    // Optional: E-Mail, Webhook, Slack, etc.
    strapi.log.error('[SYNC] Notification: Sync fehlgeschlagen', {
      error: error.message
    });
  }
});
```

**Dependencies installieren:**
```bash
npm install axios jsdom isomorphic-dompurify
```

---

### Phase 3: API Controller

**Aufgabe 3.1:** Erstelle Sync Controller

**Dateipfad:** `src/api/legal-page/controllers/sync-controller.js`

```javascript
'use strict';

module.exports = {
  /**
   * Manueller Sync Trigger
   * POST /api/legal-pages/sync-datenschutz
   */
  async syncDatenschutz(ctx) {
    try {
      // Überprüfe Admin-Berechtigung
      const isAdmin = ctx.state.user && ctx.state.user.role?.type === 'admin';

      if (!isAdmin) {
        return ctx.unauthorized('Nur Administratoren können den Sync triggern');
      }

      // Provider Config aus ENV
      const providerConfig = {
        name: process.env.DATENSCHUTZ_PROVIDER_NAME || 'External Provider',
        url: process.env.DATENSCHUTZ_PROVIDER_URL,
        apiKey: process.env.DATENSCHUTZ_PROVIDER_API_KEY
      };

      if (!providerConfig.url) {
        return ctx.badRequest('DATENSCHUTZ_PROVIDER_URL nicht konfiguriert');
      }

      // Führe Sync aus
      const result = await strapi
        .service('api::legal-page.sync-service')
        .syncFromProvider(providerConfig);

      if (result.success) {
        return ctx.send({
          success: true,
          message: result.message,
          hasChanges: result.hasChanges,
          data: result.entry
        });
      } else {
        return ctx.badRequest({
          success: false,
          message: result.message,
          error: result.error?.message
        });
      }

    } catch (error) {
      strapi.log.error('[SYNC API] Fehler:', error);
      return ctx.internalServerError({
        success: false,
        message: 'Interner Serverfehler',
        error: error.message
      });
    }
  },

  /**
   * Sync Status abrufen
   * GET /api/legal-pages/sync-status
   */
  async getSyncStatus(ctx) {
    try {
      const entry = await strapi.db.query('api::legal-page.legal-page').findOne({
        where: { type: 'datenschutz' }
      });

      if (!entry) {
        return ctx.send({
          status: 'never',
          message: 'Noch nie synchronisiert'
        });
      }

      return ctx.send({
        status: entry.syncStatus,
        lastSyncedAt: entry.lastSyncedAt,
        version: entry.version,
        providerVersion: entry.providerVersion,
        syncError: entry.syncError,
        autoSync: entry.autoSync,
        syncFrequency: entry.syncFrequency,
        changelogCount: entry.changelog?.length || 0
      });

    } catch (error) {
      strapi.log.error('[SYNC STATUS] Fehler:', error);
      return ctx.internalServerError('Fehler beim Abrufen des Status');
    }
  }
};
```

---

### Phase 4: Routes konfigurieren

**Aufgabe 4.1:** Erstelle Custom Routes

**Dateipfad:** `src/api/legal-page/routes/custom-routes.js`

```javascript
'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/legal-pages/sync-datenschutz',
      handler: 'sync-controller.syncDatenschutz',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'GET',
      path: '/legal-pages/sync-status',
      handler: 'sync-controller.getSyncStatus',
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
};
```

---

### Phase 5: Cronjob Setup

**Aufgabe 5.1:** Installiere Cron Plugin

```bash
npm install node-cron
```

**Aufgabe 5.2:** Erstelle Cron Service

**Dateipfad:** `src/extensions/cron/cron-tasks.js`

```javascript
'use strict';

const cron = require('node-cron');

module.exports = {
  /**
   * Initialisiert alle Cronjobs
   */
  async initialize(strapi) {
    // Täglich um 02:00 Uhr
    cron.schedule('0 2 * * *', async () => {
      strapi.log.info('[CRON] Starte automatische Datenschutz-Synchronisation');

      try {
        const providerConfig = {
          name: process.env.DATENSCHUTZ_PROVIDER_NAME || 'External Provider',
          url: process.env.DATENSCHUTZ_PROVIDER_URL,
          apiKey: process.env.DATENSCHUTZ_PROVIDER_API_KEY
        };

        if (!providerConfig.url) {
          strapi.log.warn('[CRON] DATENSCHUTZ_PROVIDER_URL nicht konfiguriert, überspringe Sync');
          return;
        }

        const result = await strapi
          .service('api::legal-page.sync-service')
          .syncFromProvider(providerConfig);

        if (result.success) {
          strapi.log.info('[CRON] Sync erfolgreich abgeschlossen', {
            hasChanges: result.hasChanges
          });
        } else {
          strapi.log.error('[CRON] Sync fehlgeschlagen', {
            error: result.message
          });
        }

      } catch (error) {
        strapi.log.error('[CRON] Fehler beim Cronjob:', error);
      }
    });

    strapi.log.info('[CRON] Datenschutz-Sync Cronjob aktiviert (täglich 02:00 Uhr)');
  }
};
```

**Aufgabe 5.3:** Registriere Cron in Bootstrap

**Dateipfad:** `src/index.js` (oder `config/functions/bootstrap.js`)

```javascript
module.exports = {
  async bootstrap({ strapi }) {
    // Initialisiere Cronjobs
    const cronTasks = require('./extensions/cron/cron-tasks');
    await cronTasks.initialize(strapi);
  }
};
```

---

### Phase 6: Environment Variables

**Aufgabe 6.1:** Füge ENV Variables hinzu

**Dateipfad:** `.env`

```bash
# Datenschutz Provider Konfiguration
DATENSCHUTZ_PROVIDER_NAME=Ihr Beratungsunternehmen
DATENSCHUTZ_PROVIDER_URL=https://provider.example.com/api/datenschutz/ihre-id
DATENSCHUTZ_PROVIDER_API_KEY=ihr-api-schluessel-hier

# Optional: Webhook Secret für Provider-Callbacks
DATENSCHUTZ_WEBHOOK_SECRET=webhook-secret-hier

# Optional: E-Mail Benachrichtigungen
SYNC_NOTIFICATION_EMAIL=admin@zweitmeinu.ng
```

---

### Phase 7: Admin UI Erweiterung (Optional)

**Aufgabe 7.1:** Erstelle Custom Admin Widget

**Dateipfad:** `src/admin/app.js`

```javascript
export default {
  config: {
    locales: ['de'],
  },
  bootstrap(app) {
    console.log('Admin Panel geladen');
  },
};
```

**Hinweis:** Vollständige Admin UI Anpassungen erfordern React-Entwicklung im Admin Panel. Dies ist optional und kann später ergänzt werden.

---

## 🧪 Testing

### Manuelle Tests

**Test 1: Manueller Sync via API**
```bash
curl -X POST http://localhost:1337/api/legal-pages/sync-datenschutz \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

**Test 2: Sync Status abrufen**
```bash
curl -X GET http://localhost:1337/api/legal-pages/sync-status \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Test 3: Legal Page abrufen**
```bash
curl -X GET "http://localhost:1337/api/legal-pages?filters[type][\$eq]=datenschutz"
```

### Automatisierte Tests

**Aufgabe 7.2:** Erstelle Test Suite

**Dateipfad:** `tests/legal-page/sync-service.test.js`

```javascript
const { setupStrapi, cleanupStrapi } = require('../helpers/strapi');

describe('Sync Service', () => {
  beforeAll(async () => {
    await setupStrapi();
  });

  afterAll(async () => {
    await cleanupStrapi();
  });

  it('sollte erfolgreich vom Provider synchronisieren', async () => {
    const result = await strapi
      .service('api::legal-page.sync-service')
      .syncFromProvider({
        name: 'Test Provider',
        url: process.env.DATENSCHUTZ_PROVIDER_URL,
        apiKey: process.env.DATENSCHUTZ_PROVIDER_API_KEY
      });

    expect(result.success).toBe(true);
  });

  it('sollte Änderungen erkennen', async () => {
    const hasChanges = await strapi
      .service('api::legal-page.sync-service')
      .detectChanges('alter text', 'neuer text');

    expect(hasChanges).toBe(true);
  });
});
```

---

## 📚 Dokumentation

Erstelle folgende Dokumentation:

1. **README.md** im Projekt-Root - Erwähne Sync-Feature
2. **API-Dokumentation** - Beschreibe `/sync-datenschutz` Endpoint
3. **Admin-Handbuch** - Wie man manuellen Sync triggert
4. **Troubleshooting-Guide** - Häufige Fehler und Lösungen

---

## ✅ Fertigstellungs-Checkliste

Überprüfe nach Implementierung:

- [ ] Content Type `legal-page` um Sync-Felder erweitert
- [ ] Sync Service implementiert und getestet
- [ ] Sync Controller implementiert
- [ ] Custom Routes konfiguriert
- [ ] Cronjob läuft (täglich 02:00 Uhr)
- [ ] ENV Variables konfiguriert
- [ ] Manueller Sync via API funktioniert
- [ ] Sync Status API funktioniert
- [ ] Changelog wird korrekt erstellt
- [ ] Fehlerbehandlung mit Retry-Logik
- [ ] Logging funktioniert
- [ ] Tests geschrieben und bestanden
- [ ] Dokumentation erstellt
- [ ] Provider API-Zugang getestet

---

## 🚨 Wichtige Hinweise

1. **Sicherheit:**
   - API Keys NIEMALS im Code, nur in .env
   - Webhook Secret für Provider-Callbacks verwenden
   - Admin-Berechtigung für Sync-Endpoints prüfen

2. **Performance:**
   - Timeout für Provider-Requests (max. 30s)
   - Rate Limiting für Sync-Endpoint
   - Caching von Provider-Responses

3. **Fehlerbehandlung:**
   - Retry bei temporären Fehlern (3x mit Backoff)
   - Alert bei permanenten Fehlern
   - Rollback-Funktion bei fehlerhaftem Content

4. **DSGVO:**
   - Keine personenbezogenen Daten an Provider senden
   - Logging ohne sensible Informationen
   - Verschlüsselte API-Kommunikation (HTTPS)

---

## 📞 Support

Bei Fragen oder Problemen:
- Strapi Dokumentation: https://docs.strapi.io/
- GitHub Issues: [Ihr Projekt Repo]
- Team Slack: #strapi-support

---

**Viel Erfolg bei der Implementierung! 🚀**
