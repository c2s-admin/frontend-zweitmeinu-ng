"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { logger } from "@/lib/logger";

const STRAPI_ORIGIN = (process.env.NEXT_PUBLIC_STRAPI_URL || "").replace(
  /\/api$/,
  "",
);
import {
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Shield,
  Heart,
  ChevronRight,
  CheckCircle2,
  Award,
  Badge,
  Cookie,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SiteConfiguration } from "@/types/strapi";

interface FooterProps {
  siteConfig: SiteConfiguration["attributes"];
}

export function Footer({ siteConfig }: FooterProps) {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubscribing) return;

    setIsSubscribing(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubscribing(false);
      setSubscriptionStatus("success");
      setEmail("");
      setTimeout(() => setSubscriptionStatus("idle"), 5000);
    }, 1000);
  };

  // Helper function to get icon component by name
  const getIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case "heart":
        return <Heart className="w-4 h-4" />;
      case "ribbon":
        return <Award className="w-4 h-4" />;
      case "hospital":
        return <Shield className="w-4 h-4" />;
      case "scalpel":
        return <Badge className="w-4 h-4" />;
      case "x-ray":
        return <CheckCircle2 className="w-4 h-4" />;
      case "user-doctor":
        return <Shield className="w-4 h-4" />;
      case "cookie":
        return <Cookie className="w-4 h-4" />;
      case "facebook":
        return <Facebook className="w-5 h-5" />;
      case "linkedin":
        return <Linkedin className="w-5 h-5" />;
      case "twitter":
        return <Twitter className="w-5 h-5" />;
      case "youtube":
        return <Youtube className="w-5 h-5" />;
      default:
        return <ChevronRight className="w-4 h-4" />;
    }
  };

  // Use Strapi footer data or fallback
  const footerData = siteConfig.footer;
  const footerStyle = footerData?.style || {};

  if (!footerData) {
    // Fallback to simple footer if no Strapi data
    return (
      <footer className="bg-healthcare-primary-dark text-white py-8">
        <div className="container-custom text-center">
          <p>
            &copy; {currentYear} {siteConfig.siteName}. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer
      className="text-white relative"
      style={{
        backgroundColor: footerStyle.backgroundColor || "#004166",
        color: footerStyle.textColor || "#ffffff",
      }}
    >
      {/* Emergency Banner */}
      {footerData.emergencyBanner?.enabled && (
        <div
          className="w-full py-3 text-center"
          style={{
            backgroundColor: footerData.emergencyBanner.backgroundColor,
            color: footerData.emergencyBanner.textColor,
          }}
        >
          <div className="container-custom">
            <div className="flex items-center justify-center gap-4">
              <span className="font-medium">
                {footerData.emergencyBanner.text}
              </span>
              <a
                href={`tel:${footerData.emergencyBanner.phone}`}
                className="px-4 py-2 bg-white/20 rounded-lg font-semibold hover:bg-white/30 transition-colors"
              >
                {footerData.emergencyBanner.buttonText}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div
        className="relative"
        style={{
          paddingTop: footerStyle.padding?.top || "64px",
          paddingBottom: footerStyle.padding?.bottom || "32px",
        }}
      >
        <div className="container-custom">
          {/* Bottom Section (Brand + Description) */}
          {footerData.bottomSection && (
            <div className="mb-12 lg:mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Logo & Description */}
                <div className="lg:col-span-2">
                  {footerData.bottomSection.logo?.enabled && (
                    <div className="flex items-center gap-4 mb-6">
                      {siteConfig.logo?.data ? (
                        <Image
                          src={
                            siteConfig.logo.data.attributes.formats?.medium?.url
                              ? `${STRAPI_ORIGIN}${siteConfig.logo.data.attributes.formats.medium.url}`
                              : siteConfig.logo.data.attributes.url
                          }
                          alt={
                            siteConfig.logo.data.attributes.alternativeText ||
                            siteConfig.siteName
                          }
                          width={60}
                          height={60}
                          className="filter brightness-0 invert max-h-14 w-auto"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center">
                          <span className="text-healthcare-primary font-bold text-xl">
                            {siteConfig.siteName?.charAt(0) || "Z"}
                          </span>
                        </div>
                      )}

                      {/* Site Name and Tagline */}
                      <div className="flex flex-col">
                        <div className="text-white font-bold text-2xl leading-tight">
                          {siteConfig.siteName || "zweitmeinung.ng"}
                        </div>
                        {siteConfig.tagline && (
                          <div className="text-gray-300 text-base leading-tight">
                            {siteConfig.tagline}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {footerData.bottomSection.description?.enabled && (
                    <p className="text-gray-300 mb-6 leading-relaxed max-w-2xl">
                      {footerData.bottomSection.description.text}
                    </p>
                  )}

                  {/* Trust Badges */}
                  {footerData.bottomSection.trustBadges?.enabled && (
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {footerData.bottomSection.trustBadges.items.map(
                        (badge, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm text-gray-300"
                          >
                            <CheckCircle2 className="w-4 h-4 text-healthcare-accent-green flex-shrink-0" />
                            <span>{badge}</span>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>

                {/* Certifications */}
                {footerData.bottomSection.certifications?.enabled && (
                  <div className="lg:text-right">
                    <h4 className="text-lg font-semibold mb-4 text-healthcare-accent-green">
                      Zertifizierungen
                    </h4>
                    <div className="flex flex-wrap gap-4 lg:justify-end">
                      {footerData.bottomSection.certifications.items.map(
                        (cert, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm text-gray-300"
                          >
                            <Shield className="w-4 h-4 text-healthcare-accent-green" />
                            <span>{cert.name}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Columns */}
          {footerData.columns && footerData.columns.length > 0 && (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
              style={{ columnGap: footerStyle.columnGap || "48px" }}
            >
              {footerData.columns.map((column, index) => (
                <div key={column.id || index}>
                  <h4 className="text-lg font-semibold mb-6 text-healthcare-accent-green">
                    {column.title}
                  </h4>
                  <ul className="space-y-3">
                    {column.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        {link.type === "action" ? (
                          <button type="button"
                            className={cn(
                              "flex items-center gap-2 transition-colors duration-300 hover:translate-x-1 text-left w-full",
                              link.style === "link-primary"
                                ? "text-healthcare-accent-green font-medium"
                                : "text-gray-300 hover:text-white",
                            )}
                            style={{
                              color:
                                link.style === "link-primary"
                                  ? footerStyle.linkColor
                                  : undefined,
                            }}
                            onClick={() => {
                              if (link.action === "openCookieSettings") {
                                // Handle cookie settings
                                logger.info("Open cookie settings");
                              }
                            }}
                          >
                            {link.icon && getIcon(link.icon)}
                            <span>{link.label}</span>
                            {link.badge && (
                              <span
                                className="ml-auto px-2 py-1 text-xs rounded-full font-medium"
                                style={{
                                  backgroundColor: link.badgeColor || "#B3AF09",
                                  color: "#000",
                                }}
                              >
                                {link.badge}
                              </span>
                            )}
                          </button>
                        ) : (
                          <Link
                            href={link.url}
                            className={cn(
                              "flex items-center gap-2 transition-colors duration-300 hover:translate-x-1",
                              link.style === "link-primary"
                                ? "text-healthcare-accent-green font-medium"
                                : "text-gray-300 hover:text-white",
                            )}
                            style={{
                              color:
                                link.style === "link-primary"
                                  ? footerStyle.linkColor
                                  : undefined,
                            }}
                            target={
                              link.type === "external" || link.openInNewTab
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              link.type === "external" || link.openInNewTab
                                ? "noopener noreferrer"
                                : undefined
                            }
                          >
                            {link.icon && getIcon(link.icon)}
                            <span>{link.label}</span>
                            {link.badge && (
                              <span
                                className="ml-auto px-2 py-1 text-xs rounded-full font-medium"
                                style={{
                                  backgroundColor: link.badgeColor || "#B3AF09",
                                  color: "#000",
                                }}
                              >
                                {link.badge}
                              </span>
                            )}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Social Media & Newsletter */}
      {(footerData.socialMedia?.enabled || footerData.newsletter?.enabled) && (
        <div
          className="border-t py-8"
          style={{
            borderColor: footerStyle.borderColor || "rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Social Media */}
              {footerData.socialMedia?.enabled &&
                footerData.socialMedia.platforms.length > 0 && (
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 text-sm">
                      {footerData.socialMedia.title}:
                    </span>
                    <div className="flex items-center gap-3">
                      {footerData.socialMedia.platforms.map(
                        (platform, index) => (
                          <a
                            key={index}
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-healthcare-primary/50 rounded-full flex items-center justify-center hover:bg-healthcare-accent-green transition-colors duration-300"
                            style={
                              {
                                "--hover-color": platform.color,
                              } as React.CSSProperties
                            }
                            aria-label={platform.name}
                          >
                            {getIcon(platform.icon)}
                          </a>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Newsletter */}
              {footerData.newsletter?.enabled && (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="text-center sm:text-left">
                    <span className="text-gray-400 text-sm block sm:hidden md:block">
                      {footerData.newsletter.title}:
                    </span>
                    {footerData.newsletter.description && (
                      <span className="text-xs text-gray-500 hidden lg:block">
                        {footerData.newsletter.description}
                      </span>
                    )}
                  </div>
                  <form onSubmit={handleNewsletterSubmit} className="flex">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={footerData.newsletter.placeholder}
                      className="px-4 py-2 bg-healthcare-primary/50 border border-healthcare-primary/30 rounded-l-md focus:outline-none focus:ring-2 focus:ring-healthcare-accent-green text-white placeholder-gray-400"
                      disabled={isSubscribing}
                    />
                    <button
                      type="submit"
                      disabled={isSubscribing || !email}
                      className="px-4 py-2 bg-healthcare-accent-green hover:bg-healthcare-accent-hover disabled:opacity-50 text-white rounded-r-md transition-colors duration-300"
                    >
                      {isSubscribing ? "..." : footerData.newsletter.buttonText}
                    </button>
                  </form>

                  {subscriptionStatus === "success" && (
                    <div className="text-green-400 text-xs mt-1">
                      {footerData.newsletter.successMessage}
                    </div>
                  )}
                  {subscriptionStatus === "error" && (
                    <div className="text-red-400 text-xs mt-1">
                      {footerData.newsletter.errorMessage}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Copyright */}
      <div
        className="border-t py-6"
        style={{
          borderColor: footerStyle.borderColor || "rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <div>
              {footerData.copyright?.text ||
                `© ${currentYear} ${siteConfig.siteName}. Alle Rechte vorbehalten.`}
            </div>

            <div className="flex items-center gap-4">
              {footerData.copyright?.additionalLinks?.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  className="hover:text-white transition-colors"
                  target={link.type === "external" ? "_blank" : undefined}
                  rel={
                    link.type === "external" ? "noopener noreferrer" : undefined
                  }
                >
                  {link.label}
                </Link>
              ))}
              <span>🇩🇪 Datenschutz nach DSGVO</span>
              <span>•</span>
              <span>🔒 SSL-verschlüsselt</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
