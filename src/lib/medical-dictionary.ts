// Medical dictionary with German healthcare terms and synonyms
// TODO: Replace with dynamic loading from Strapi in the future

export const MEDICAL_DICTIONARY = {
  // Zweitmeinung related
  zweitmeinung: {
    synonyms: [
      "zweit meinung",
      "zweite meinung",
      "fachliche einschätzung",
      "expert opinion",
    ],
    description:
      "Unabhängige medizinische Bewertung einer Diagnose oder Behandlung",
  },
  gutachten: {
    synonyms: ["medizinisches gutachten", "fachgutachten", "expertise"],
    description: "Professionelle medizinische Einschätzung",
  },

  // Kardiologie
  herz: {
    synonyms: ["kardio", "cardiac", "herzkrankheit", "herzerkrankung"],
    description: "Herzmedizin und Herz-Kreislauf-System",
  },
  herzinfarkt: {
    synonyms: ["myokardinfarkt", "heart attack", "herzanfall"],
    description: "Akuter Verschluss einer Herzkranzarterie",
  },
  bypass: {
    synonyms: ["herzbypass", "koronarer bypass", "cabg"],
    description: "Operative Umleitung bei Gefäßverengungen",
  },
  stent: {
    synonyms: ["gefäßstütze", "koronarstent", "herzkatheter"],
    description: "Medizinische Gefäßstütze zur Offenhaltung",
  },
  schrittmacher: {
    synonyms: ["herzschrittmacher", "pacemaker", "stimulator"],
    description: "Medizinisches Gerät zur Herzrhythmus-Regulierung",
  },

  // Onkologie
  krebs: {
    synonyms: ["karzinom", "tumor", "onkologie", "malignität"],
    description: "Krebserkrankungen und Tumormedizin",
  },
  chemotherapie: {
    synonyms: ["chemo", "zytostatika", "krebstherapie"],
    description: "Medikamentöse Krebsbehandlung",
  },
  bestrahlung: {
    synonyms: ["strahlentherapie", "radiotherapie", "radiation"],
    description: "Strahlenbehandlung bei Krebs",
  },
  metastasen: {
    synonyms: ["metastasierung", "streuung", "sekundärtumor"],
    description: "Tochtergeschwülste bei Krebserkrankungen",
  },

  // Intensivmedizin
  intensiv: {
    synonyms: ["intensivstation", "icu", "intensivbehandlung"],
    description: "Intensivmedizinische Betreuung",
  },
  beatmung: {
    synonyms: ["ventilation", "respirator", "intubation"],
    description: "Künstliche Beatmung bei kritischen Patienten",
  },
  reanimation: {
    synonyms: ["wiederbelebung", "cpr", "notfallmedizin"],
    description: "Lebensrettende Sofortmaßnahmen",
  },

  // Gallenblase
  gallenblase: {
    synonyms: ["galle", "cholezyst", "gallenstein"],
    description: "Gallenblase und Gallenwegerkrankungen",
  },
  gallenstein: {
    synonyms: ["gallensteine", "cholelithiasis", "gallenkolik"],
    description: "Steinbildung in der Gallenblase",
  },
  cholezystektomie: {
    synonyms: ["gallenblasenentfernung", "gallen op"],
    description: "Operative Entfernung der Gallenblase",
  },

  // Nephrologie
  niere: {
    synonyms: ["nieren", "nephro", "nierenerkrankung"],
    description: "Nierenmedizin und Nierenerkrankungen",
  },
  dialyse: {
    synonyms: ["hämodialyse", "peritonealdialyse", "blutwäsche"],
    description: "Nierenersatztherapie bei Nierenversagen",
  },
  niereninsuffizienz: {
    synonyms: ["nierenversagen", "nierenschwäche"],
    description: "Eingeschränkte Nierenfunktion",
  },

  // Schilddrüse
  schilddrüse: {
    synonyms: ["thyroid", "schild", "schilddrüsenerkrankung"],
    description: "Schilddrüsenmedizin und Hormonstörungen",
  },
  struma: {
    synonyms: ["kropf", "schilddrüsenvergrößerung"],
    description: "Vergrößerung der Schilddrüse",
  },
  thyreoidektomie: {
    synonyms: ["schilddrüsenentfernung", "schilddrüsen op"],
    description: "Operative Entfernung der Schilddrüse",
  },

  // Allgemeine Begriffe
  operation: {
    synonyms: ["op", "eingriff", "chirurgie", "surgery"],
    description: "Operative medizinische Behandlung",
  },
  diagnose: {
    synonyms: ["befund", "krankheitsbild", "diagnosis"],
    description: "Medizinische Krankheitsbestimmung",
  },
  therapie: {
    synonyms: ["behandlung", "therapy", "treatment"],
    description: "Medizinische Behandlungsverfahren",
  },
  kosten: {
    synonyms: ["preis", "gebühren", "erstattung", "kostenübernahme"],
    description: "Kosten und Kostenübernahme für medizinische Leistungen",
  },
} as const;

export type MedicalDictionary = typeof MEDICAL_DICTIONARY;

export async function getMedicalDictionary(): Promise<MedicalDictionary> {
  // In the future this will fetch data from Strapi
  return MEDICAL_DICTIONARY;
}
