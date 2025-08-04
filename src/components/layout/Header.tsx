"use client";

import { useState, useEffect } from "react";

const STRAPI_ORIGIN = (process.env.NEXT_PUBLIC_STRAPI_URL || "").replace(
  /\/api$/,
  "",
);
import Link from "next/link";
import Image from "next/image";
import { logger } from "@/lib/logger";
import { Menu, X, Phone, ChevronDown, Mail, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteConfig } from "@/hooks/useSiteConfig";

interface TopBarContentItem {
  type: string;
  content: string;
  style?: string;
  icon?: string;
}

export function Header() {
  const { siteConfig } = useSiteConfig();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [logoError, setLogoError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Close mobile menu when clicking outside
    const handleClickOutside = () => {
      setIsMobileMenuOpen(false);
      setActiveDropdown(null);
    };

    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  if (!siteConfig) return null;

  // Helper function to get formatted opening hours with status
  const getOpeningHoursInfo = () => {
    if (!siteConfig.contact?.openingHours?.regular) return null;

    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const dayNamesGerman = [
      "Sonntag",
      "Montag",
      "Dienstag",
      "Mittwoch",
      "Donnerstag",
      "Freitag",
      "Samstag",
    ];
    const now = new Date();
    const currentDay = dayNames[now.getDay()];
    const tomorrow = dayNames[(now.getDay() + 1) % 7];

    const todayHours = siteConfig.contact.openingHours.regular[currentDay];
    const tomorrowHours = siteConfig.contact.openingHours.regular[tomorrow];

    // Check if currently open
    const isCurrentlyOpen = () => {
      if (!todayHours || todayHours === "geschlossen") return false;

      const currentTime = now.getHours() * 60 + now.getMinutes();
      const timeRange = todayHours.split("-");

      if (timeRange.length !== 2) return false;

      const [openTime, closeTime] = timeRange;
      const [openHour, openMin] = openTime.split(":").map(Number);
      const [closeHour, closeMin] = closeTime.split(":").map(Number);

      const openMinutes = openHour * 60 + (openMin || 0);
      const closeMinutes = closeHour * 60 + (closeMin || 0);

      return currentTime >= openMinutes && currentTime < closeMinutes;
    };

    const formatHours = (hours: string) => {
      if (hours === "geschlossen") return "geschlossen";
      return hours.replace("-", " - ");
    };

    return {
      isOpen: isCurrentlyOpen(),
      today: {
        day: dayNamesGerman[now.getDay()],
        hours: formatHours(todayHours || "geschlossen"),
      },
      tomorrow: {
        day: dayNamesGerman[(now.getDay() + 1) % 7],
        hours: formatHours(tomorrowHours || "geschlossen"),
      },
    };
  };

  const openingInfo = mounted ? getOpeningHoursInfo() : null;

  const emergencyPhone =
    siteConfig.contact?.emergencyHotline || siteConfig.contact?.phone;
  const emergencyText = siteConfig.ctaButton?.label || "Notfall-Zweitmeinung";

  return (
    <>
      {/* Top Bar */}
      {siteConfig.topBar?.enabled && (
        <div
          className="w-full py-3 px-4 text-sm z-50"
          style={{
            backgroundColor: siteConfig.topBar.backgroundColor || "#004166",
            color: siteConfig.topBar.textColor || "#ffffff",
          }}
          role="banner"
          aria-label="Kontakt-Informationen"
        >
          <div className="container-custom lg:px-[17px]">
            <div className="flex items-center justify-center md:justify-between">
              {/* Left Side - Contact Info */}
              <div className="flex items-center gap-6 flex-wrap justify-center md:justify-start">
                {siteConfig.topBar.content?.map(
                  (item: TopBarContentItem, index: number) => (
                  <div key={index}>
                    {item.type === "phone" && (
                      <a
                        href={`tel:${item.content}`}
                        className="flex items-center gap-2 hover:text-healthcare-accent-green transition-colors duration-300 group"
                        style={{
                          fontWeight: item.style === "bold" ? "600" : "normal",
                        }}
                        aria-label={`Telefon: ${item.content}`}
                      >
                        <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline">{item.content}</span>
                        <span className="sm:hidden font-semibold">Hotline</span>
                      </a>
                    )}
                    {item.type === "email" && (
                      <a
                        href={`mailto:${item.content}`}
                        className="flex items-center gap-2 hover:text-healthcare-accent-green transition-colors duration-300 group"
                        style={{
                          fontWeight: item.style === "bold" ? "600" : "normal",
                        }}
                        aria-label={`E-Mail: ${item.content}`}
                      >
                        <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="hidden md:inline">{item.content}</span>
                        <span className="md:hidden font-semibold">E-Mail</span>
                      </a>
                    )}
                    {item.type === "text" && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span
                          className="font-medium"
                          style={{
                            fontWeight:
                              item.style === "bold" ? "600" : "normal",
                          }}
                        >
                          {item.content}
                        </span>
                      </div>
                    )}
                    {item.type === "separator" && (
                      <span
                        className="text-white/40 mx-2 hidden lg:inline select-none"
                        aria-hidden="true"
                      >
                        {item.content}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Side - Enhanced Opening Hours & Info */}
              <div className="hidden lg:flex items-center gap-4 text-xs">
                {/* Enhanced Opening Hours from Strapi */}
                {mounted && openingInfo && (
                  <>
                    <div className="flex items-center gap-3">
                      {/* Status Indicator */}
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            openingInfo.isOpen
                              ? "bg-green-400 animate-pulse"
                              : "bg-orange-400"
                          }`}
                        ></div>
                        <span
                          className={`font-medium ${
                            openingInfo.isOpen
                              ? "text-green-200"
                              : "text-orange-200"
                          }`}
                        >
                          {openingInfo.isOpen ? "Geöffnet" : "Geschlossen"}
                        </span>
                      </div>

                      {/* Today's Hours */}
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 opacity-80" />
                        <span className="opacity-90">
                          Heute: {openingInfo.today.hours}
                        </span>
                      </div>

                      {/* Tomorrow's Hours (if different from today) */}
                      {openingInfo.tomorrow.hours !==
                        openingInfo.today.hours && (
                        <span className="opacity-70 text-xs">
                          {openingInfo.tomorrow.day}:{" "}
                          {openingInfo.tomorrow.hours}
                        </span>
                      )}
                    </div>
                    <div className="text-white/60">|</div>
                  </>
                )}

                {/* 24/7 Service Badge */}
                <div className="flex items-center gap-2 opacity-90">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">24/7 Notfall</span>
                </div>

                <div className="text-white/60">|</div>

                {/* Free Consultation Badge */}
                <span className="text-white/90 font-medium">
                  Kostenlose Beratung
                </span>

                {/* Debug Info */}
                {process.env.NODE_ENV === "development" && mounted && (
                  <>
                    <div className="text-white/60">|</div>
                    <span className="text-white/60 text-xs">
                      {siteConfig.openingHours
                        ? "✅ openingHours found"
                        : "❌ openingHours missing"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header
        className="w-full transition-all duration-300 shadow-lg"
        style={{ backgroundColor: "#004166" }}
      >
        <div className="container-custom">
          <nav className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="flex items-center gap-3">
                {siteConfig.logo?.data && !logoError ? (
                  <Image
                    src={
                      siteConfig.logo.data.attributes.formats?.medium?.url
                        ? `${STRAPI_ORIGIN}${siteConfig.logo.data.attributes.formats.medium.url}`
                        : siteConfig.logo.data.attributes.url
                    }
                    alt={
                      siteConfig.logo.data.attributes.alternativeText ||
                      `${siteConfig.siteName} Logo`
                    }
                    width={60}
                    height={60}
                    className="transition-transform duration-300 group-hover:scale-105 max-h-14 w-auto animate-pulse-slow"
                    priority
                    onError={() => {
                      logger.warn(
                        "Logo image failed to load, switching to text fallback",
                      );
                      setLogoError(true);
                    }}
                    onLoad={() => {
                      logger.info("Logo image loaded successfully");
                    }}
                  />
                ) : (
                  <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center animate-pulse-slow">
                    <span className="text-healthcare-primary font-bold text-xl">
                      {siteConfig.siteName?.charAt(0) || "Z"}
                    </span>
                  </div>
                )}

                {/* Site Name and Tagline */}
                <div className="flex flex-col">
                  <div className="text-white font-bold text-xl leading-tight group-hover:text-healthcare-accent-green transition-colors duration-300">
                    {siteConfig.siteName || "zweitmeinung.ng"}
                  </div>
                  {siteConfig.tagline && (
                    <div className="text-white/80 text-sm leading-tight hidden sm:block">
                      {siteConfig.tagline}
                    </div>
                  )}
                  {process.env.NODE_ENV === "development" && logoError && (
                    <span className="text-xs text-red-400">(img failed)</span>
                  )}
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {siteConfig.navigation?.main?.map((item) => (
                <div key={item.id} className="relative">
                  {item.children && item.children.length > 0 ? (
                    // Dropdown menu
                    <div
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(item.id)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button type="button" className="flex items-center gap-1 font-medium transition-colors duration-300 relative group text-white hover:text-healthcare-accent-green">
                        {item.label}
                        <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-healthcare-primary-light transition-all duration-300 group-hover:w-full" />
                      </button>

                      {activeDropdown === item.id && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-healthcare-border py-2 z-50">
                          {item.children.map((child) => (
                            <Link
                              key={child.id}
                              href={child.href}
                              className="block px-4 py-2 text-healthcare-primary hover:bg-healthcare-background hover:text-healthcare-primary-light transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // Regular link
                    <Link
                      href={item.href}
                      className="font-medium transition-colors duration-300 relative group text-white hover:text-healthcare-accent-green"
                      target={item.isExternal ? "_blank" : undefined}
                      rel={item.isExternal ? "noopener noreferrer" : undefined}
                    >
                      {item.label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-healthcare-primary-light transition-all duration-300 group-hover:w-full" />
                    </Link>
                  )}
                </div>
              ))}

              {/* Emergency CTA Button */}
              {emergencyPhone && (
                <a
                  href={`tel:${emergencyPhone}`}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 animate-pulse-slow",
                    "bg-healthcare-accent-green hover:bg-healthcare-accent-hover text-white",
                    "relative before:absolute before:inset-0 before:rounded-lg before:bg-healthcare-accent-green before:animate-ping-slow before:opacity-20",
                    "rounded-[10px]",
                  )}
                  style={{
                    backgroundColor:
                      siteConfig.ctaButton?.backgroundColor || undefined,
                    color: siteConfig.ctaButton?.textColor || undefined,
                  }}
                >
                  <Phone className="w-4 h-4 animate-pulse-slow" />
                  {emergencyText}
                </a>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="lg:hidden p-2 rounded-md transition-colors duration-300 text-white hover:bg-white/10"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-healthcare-border shadow-lg">
            <div className="container-custom py-4">
              <div className="space-y-1">
                {siteConfig.navigation?.main?.map((item) => (
                  <div key={item.id}>
                    {item.children && item.children.length > 0 ? (
                      <div>
                        <button type="button"
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === item.id ? null : item.id,
                            )
                          }
                          className="flex items-center justify-between w-full py-3 text-healthcare-primary hover:text-healthcare-primary-light font-medium"
                        >
                          {item.label}
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 transition-transform duration-300",
                              activeDropdown === item.id && "rotate-180",
                            )}
                          />
                        </button>
                        {activeDropdown === item.id && (
                          <div className="pl-4 space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.id}
                                href={child.href}
                                className="block py-2 text-healthcare-text-muted hover:text-healthcare-primary"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="block py-3 text-healthcare-primary hover:text-healthcare-primary-light font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                        target={item.isExternal ? "_blank" : undefined}
                        rel={
                          item.isExternal ? "noopener noreferrer" : undefined
                        }
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Emergency Button */}
              {emergencyPhone && (
                <div className="mt-4 pt-4 border-t border-healthcare-border">
                  <a
                    href={`tel:${emergencyPhone}`}
                    className={cn(
                      "flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg font-medium transition-all duration-300 animate-pulse-slow",
                      "bg-healthcare-accent-green hover:bg-healthcare-accent-hover text-white",
                      "relative before:absolute before:inset-0 before:rounded-lg before:bg-healthcare-accent-green before:animate-ping-slow before:opacity-20",
                    )}
                    style={{
                      backgroundColor:
                        siteConfig.ctaButton?.backgroundColor || undefined,
                      color: siteConfig.ctaButton?.textColor || undefined,
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Phone className="w-4 h-4 animate-pulse-slow" />
                    {emergencyText}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
