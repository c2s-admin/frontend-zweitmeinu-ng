# Strapi KI Prompt: Motivation Hero-Section

## Auftrag
Erstelle eine Hero-Section für die Seite "Motivation" mit folgendem Content-Typ und Struktur:

## Content-Typ: Hero Section
**Component:** `sections.hero-section`

### Felder-Struktur:

#### Grundlegende Inhalte:
- **title** (Text, erforderlich): "Motivation & Geschichte"
- **subtitle** (Text, erforderlich): "Von der Aufdeckung des Bottroper Zytoskandals zur führenden Healthcare-Technologie für bessere Patientenversorgung."
- **description** (Richtext, optional): Längere Beschreibung über die Motivation und Geschichte des Unternehmens
- **backgroundType** (Auswahl): "gradient"
- **backgroundColor** (Text): "bg-healthcare-primary"

#### Badge/Tag:
- **showBadge** (Boolean): true
- **badgeText** (Text): "Patientenversorgung im Zentrum"
- **badgeIcon** (Text): "heart"
- **badgeColor** (Text): "healthcare-accent-green"

#### Call-to-Action Buttons:
- **primaryButton** (Component: ui.button):
  - text: "Unsere Geschichte"
  - url: "#geschichte"
  - variant: "secondary"
  - icon: "book-open"

- **secondaryButton** (Component: ui.button):
  - text: "Mission & Vision"
  - url: "#mission"
  - variant: "outline-white"
  - icon: "target"

#### Design & Layout:
- **textAlignment** (Auswahl): "center"
- **contentMaxWidth** (Text): "4xl"
- **minHeight** (Text): "lg" (entspricht etwa 512px)
- **showBackgroundPattern** (Boolean): true
- **patternType** (Auswahl): "medical-circles"

#### SEO & Accessibility:
- **seo** (Component: seo.meta-data):
  - metaTitle: "Motivation & Geschichte - Zweitmeinung.ng"
  - metaDescription: "Erfahren Sie mehr über unsere Motivation und Geschichte - vom Bottroper Zytoskandal zur führenden Healthcare-Technologie für bessere Patientenversorgung."
  - canonicalURL: "/motivation"

## Spezifische Anweisungen:

### Design-Vorgaben:
1. **Farbschema**: Verwende das Healthcare-Primary Blau als Haupthintergrund
2. **Typography**: Große, gut lesbare Schrift für maximale Wirkung
3. **Badge-Design**: Dezentes Badge oben mit Herz-Icon und grünem Akzent
4. **Responsive**: Mobile-first Design mit optimaler Darstellung auf allen Geräten

### Content-Richtlinien:
1. **Haupttitel**: Kurz und prägnant - "Motivation & Geschichte"
2. **Untertitel**: Erwähne den Bottroper Zytoskandal als Ausgangspunkt
3. **Tonalität**: Professionell, vertrauensvoll, aber auch persönlich und motivierend
4. **Keywords**: Healthcare-Technologie, Patientenversorgung, medizinische Expertise

### Technische Anforderungen:
1. **Performance**: Optimierte Bilder und effiziente CSS
2. **Accessibility**: Alt-Texte, ARIA-Labels, Keyboard-Navigation
3. **SEO**: Strukturierte Daten und Meta-Tags
4. **Loading**: Lazy Loading für Bilder und Animationen

## Beispiel-Content für weitere Abschnitte:

### Optionale zusätzliche Inhalte:
- **Gründungsjahr**: "Gegründet 2019"
- **Standort**: "Deutschland"
- **Expertise**: "Medizinische Zweitmeinungen"
- **Fokus**: "Patientensicherheit & Qualität"

### Hintergrund-Pattern:
- Medizinische Kreise und Formen
- Dezente geometrische Muster
- Transparente Overlay-Elemente
- Gradient von Healthcare-Primary zu Healthcare-Primary-Dark

## Ausgabe-Format:
Erstelle die Hero-Section als JSON-Struktur, die direkt in Strapi importiert werden kann, mit allen erforderlichen Feldern und korrekten Datentypen.

## Zusätzliche Hinweise:
- Berücksichtige die bestehende Design-Sprache der Website
- Stelle sicher, dass die Hero-Section mit anderen Komponenten harmoniert
- Verwende die definierten CSS-Klassen und Farben aus dem bestehenden Design-System
- Die Hero-Section sollte emotional ansprechen und Vertrauen aufbauen
