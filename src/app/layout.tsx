import type { Metadata } from "next";
import "./globals.css";
import { getCachedSiteConfig } from "@/lib/strapi/site-config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "";
const STRAPI_ORIGIN = STRAPI_URL.replace(/\/api$/, "");
const DEFAULT_FAVICON = STRAPI_ORIGIN
  ? new URL("uploads/favicon_af3459ec0b.ico", STRAPI_ORIGIN).toString()
  : "/favicon.ico";

export async function generateMetadata(): Promise<Metadata> {
  let siteConfig = null;

  try {
    siteConfig = await getCachedSiteConfig();
  } catch (error) {
    console.error("Error loading site config for metadata:", error);
  }

  const siteAttributes = siteConfig?.attributes;
  const iconUrl = siteAttributes?.favicon?.data?.attributes?.url
    ? new URL(
        siteAttributes.favicon.data.attributes.url,
        STRAPI_ORIGIN,
      ).toString()
    : DEFAULT_FAVICON;

  return {
    title: siteAttributes?.siteName
      ? `${siteAttributes.siteName} - Medizinische Zweitmeinung online`
      : "Zweitmeinung.ng - Medizinische Zweitmeinung online",
    description:
      "Erhalten Sie schnell und unkompliziert eine professionelle medizinische Zweitmeinung von Fachärzten.",
    icons: { icon: iconUrl },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Load site configuration from Strapi
  let siteConfig = null;

  try {
    siteConfig = await getCachedSiteConfig();
  } catch (error) {
    console.error("💥 Error loading site config in layout:", error);
  }

  // Fallback site config if Strapi fails
  const fallbackSiteConfig = {
    siteIdentifier: "zweitmeinung-fallback",
    domain: "zweitmein.ng",
    siteName: "Zweitmeinung.ng",
    brand: "portal" as const,
    navigation: {
      main: [
        { id: 1, label: "Home", href: "/" },
        { id: 2, label: "Zweitmeinung", href: "/zweitmeinung" },
        { id: 3, label: "Fachbereiche", href: "/fachbereiche" },
        { id: 4, label: "Kontakt", href: "/kontakt" },
      ],
      footer: [
        {
          id: 1,
          title: "Services",
          links: [
            {
              id: 1,
              label: "Medizinische Zweitmeinung",
              href: "/zweitmeinung",
            },
            { id: 2, label: "Online Beratung", href: "/beratung" },
            { id: 3, label: "Healthcare AI", href: "/ai-solutions" },
          ],
        },
        {
          id: 2,
          title: "Rechtliches",
          links: [
            { id: 1, label: "Impressum", href: "/impressum" },
            { id: 2, label: "Datenschutz", href: "/datenschutz" },
            { id: 3, label: "AGB", href: "/agb" },
          ],
        },
      ],
    },
    contact: {
      id: 1,
      email: "info@zweitmein.ng",
      phone: "+49 176 47870680",
      emergencyPhone: "+49 176 47870680",
    },
    topBar: {
      enabled: false,
    },
    ctaButton: {
      label: "Notfall-Zweitmeinung",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  };

  const siteAttributes = siteConfig?.attributes || fallbackSiteConfig;

  return (
    <html lang="de" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <meta name="theme-color" content="#004166" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        {/* Dynamic Header from Strapi */}
        <Header siteConfig={siteAttributes} />

        <main className="flex-grow">{children}</main>

        {/* Dynamic Footer from Strapi */}
        <Footer siteConfig={siteAttributes} />
      </body>
    </html>
  );
}
