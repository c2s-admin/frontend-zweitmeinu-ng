import type { Metadata } from "next";
import { getLegalPage } from "@/lib/strapi/legal-pages";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LegalIframe } from "@/components/legal/LegalIframe";

// Dynamic metadata from Strapi
export async function generateMetadata(): Promise<Metadata> {
  const datenschutzData = await getLegalPage("datenschutz");

  return {
    title: datenschutzData?.title || "Datenschutzerklärung | Zweitmeinung.ng",
    description:
      datenschutzData?.description ||
      "Datenschutzerklärung und Informationen zum Umgang mit personenbezogenen Daten gemäß DSGVO",
    robots: { index: true, follow: true },
  };
}

export default async function DatenschutzPage() {
  // Load datenschutz data from Strapi
  const datenschutzData = await getLegalPage("datenschutz");

  // If no data found in Strapi, show 404
  if (!datenschutzData) {
    notFound();
  }
  return (
    <div className="min-h-screen bg-healthcare-background">
      {/* Emergency Contact Banner */}
      <div className="bg-healthcare-primary text-white text-center py-3 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm">
            <span className="font-medium">Medizinischer Notfall?</span>
            <span className="mx-2">|</span>
            <a
              href="tel:112"
              className="hover:underline focus:underline focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-healthcare-primary rounded px-1"
              aria-label="Notruf wählen 112"
            >
              📞 Notruf: 112
            </a>
            <span className="mx-2">|</span>
            <a
              href="tel:116117"
              className="hover:underline focus:underline focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-healthcare-primary rounded px-1"
              aria-label="Ärztlicher Bereitschaftsdienst 116117"
            >
              📞 Ärztlicher Bereitschaftsdienst: 116 117
            </a>
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-healthcare-primary mb-4">
            Datenschutzerklärung
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Informationen zum Umgang mit personenbezogenen Daten gemäß DSGVO
          </p>
        </div>

        {/* Datenschutzerklärung Content - Dynamic Rendering */}
        {datenschutzData.embedType === "iframe" && datenschutzData.embedUrl ? (
          // iframe Integration with Error Handling & Loading State
          <LegalIframe
            src={datenschutzData.embedUrl}
            title={`Datenschutzerklärung${datenschutzData.provider ? ` - bereitgestellt von ${datenschutzData.provider}` : ""}`}
            provider={datenschutzData.provider || undefined}
            height="5000"
          />
        ) : datenschutzData.embedType === "javascript" && datenschutzData.embedUrl ? (
          // JavaScript Widget Integration
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div
              className="p-6"
              dangerouslySetInnerHTML={{
                __html: `<script src="${datenschutzData.embedUrl}"></script>`,
              }}
            />
          </div>
        ) : (
          // Static/Markdown Content Fallback
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div
              className="prose prose-lg max-w-none p-6 md:p-8"
              dangerouslySetInnerHTML={{ __html: datenschutzData.content }}
            />
          </div>
        )}

        {/* Healthcare Footer Info */}
        <div className="mt-8 p-6 bg-healthcare-background rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-healthcare-success rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm" aria-hidden="true">
                ✓
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-healthcare-primary">
              Medizinische Schweigepflicht
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">
            Als medizinische Plattform unterliegen alle unsere Ärzte und
            Mitarbeiter der ärztlichen Schweigepflicht. Ihre Gesundheitsdaten
            werden nach höchsten Standards geschützt und nur für Ihre
            medizinische Betreuung verwendet.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 min-h-[56px] p-3 bg-white rounded-lg">
              <span className="text-healthcare-success text-xl" aria-hidden="true">
                🛡️
              </span>
              <span className="font-medium">DSGVO-konform</span>
            </div>
            <div className="flex items-center gap-2 min-h-[56px] p-3 bg-white rounded-lg">
              <span className="text-healthcare-success text-xl" aria-hidden="true">
                🔒
              </span>
              <span className="font-medium">Ende-zu-Ende verschlüsselt</span>
            </div>
            <div className="flex items-center gap-2 min-h-[56px] p-3 bg-white rounded-lg">
              <span className="text-healthcare-success text-xl" aria-hidden="true">
                ⚕️
              </span>
              <span className="font-medium">Ärztliche Schweigepflicht</span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Fragen zum Datenschutz? Kontaktieren Sie unseren{" "}
            <a
              href="mailto:datenschutz@zweitmeinung.ng"
              className="text-healthcare-primary-light hover:underline focus:underline focus:ring-2 focus:ring-healthcare-primary-light focus:ring-offset-2 rounded px-1 min-h-[44px] inline-flex items-center"
            >
              Datenschutzbeauftragten
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
