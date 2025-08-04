"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Heart,
  Activity,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { RealHeroCarousel } from "@/types/strapi-real";

// Icon mapping for badges
const iconMap = {
  Heart: Heart,
  Activity: Activity,
  Stethoscope: Stethoscope,
  // Add more icons as needed
} as const;

// Type for background image
interface BackgroundImageType {
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

export default function HeroCarousel({
  slides = [],
  autoplay = true,
  autoplayInterval = 6000,
  showDots = true,
  showArrows = true,
  pauseOnHover = true,
}: RealHeroCarousel) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || isPaused || slides.length <= 1) return;

    const interval = setInterval(nextSlide, autoplayInterval);
    return () => clearInterval(interval);
  }, [isPlaying, isPaused, autoplayInterval, nextSlide, slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        prevSlide();
      } else if (event.key === "ArrowRight") {
        nextSlide();
      } else if (event.key === " ") {
        event.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Handle empty slides
  if (!slides || slides.length === 0) {
    return (
      <section className="relative h-screen overflow-hidden bg-healthcare-medical-green">
        <div className="absolute inset-0 bg-gradient-to-br from-healthcare-medical-green via-healthcare-medical-mid to-healthcare-medical-yellow opacity-90" />
        <div className="relative h-full flex items-center justify-center">
          <div className="container-custom text-center text-white">
            <h1 className="mb-6">Willkommen bei Zweitmeinung.ng</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Ihre Gesundheit verdient eine zweite Meinung. Vertrauen Sie auf
              unsere medizinische Expertise.
            </p>
            <Link href="/kontakt" className="btn-primary">
              Beratung anfragen
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];

  // Helper function to get gradient classes
  const getGradientClass = (gradient?: string) => {
    switch (gradient) {
      case "green-to-blue":
        return "from-healthcare-medical-green via-healthcare-medical-mid to-healthcare-accent-blue";
      case "blue-to-purple":
        return "from-healthcare-accent-blue via-healthcare-primary-light to-healthcare-primary";
      case "primary-to-secondary":
        return "from-healthcare-primary via-healthcare-primary-light to-healthcare-accent-green";
      default:
        return "from-healthcare-medical-green via-healthcare-medical-mid to-healthcare-medical-yellow";
    }
  };

  // Helper function to check if background image is valid
  const isValidBackgroundImage = (img: unknown): img is BackgroundImageType => {
    return (
      img !== null &&
      typeof img === "object" &&
      img !== undefined &&
      "url" in img &&
      typeof (img as Record<string, unknown>).url === "string"
    );
  };

  return (
    <section
      className="relative h-screen overflow-hidden"
      role="region"
      aria-label="Hero Carousel"
    >
      {/* Background Gradient */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-90 z-10",
          getGradientClass(currentSlideData.backgroundGradient),
        )}
      />

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === currentSlide ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={index !== currentSlide}
        >
          {/* Background Image if available */}
          {isValidBackgroundImage(slide.backgroundImage) && (
            <div className="absolute inset-0">
              <Image
                src={slide.backgroundImage.url}
                alt={slide.backgroundImage.alternativeText || ""}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
              <div
                className="absolute inset-0 bg-black"
                style={{
                  opacity: (slide.overlayOpacity || 60) / 100,
                }}
              />
            </div>
          )}
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container-custom">
          <div className="max-w-4xl">
            {/* Badge */}
            {currentSlideData.badge && (
              <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 mb-8 animate-fade-in">
                {currentSlideData.badge.icon &&
                  iconMap[
                    currentSlideData.badge.icon as keyof typeof iconMap
                  ] &&
                  (() => {
                    const IconComponent =
                      iconMap[
                        currentSlideData.badge.icon as keyof typeof iconMap
                      ];
                    return <IconComponent className="w-6 h-6 text-white" />;
                  })()}
                <span className="text-white font-medium text-lg">
                  {currentSlideData.badge.text}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="mb-8 animate-slide-up">
              {currentSlideData.titleLines?.map((line) => (
                <span
                  key={line.id}
                  className={cn(
                    "block text-white leading-tight",
                    line.isHighlighted &&
                      "text-healthcare-accent-green font-bold",
                  )}
                >
                  {line.text}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            {currentSlideData.subtitle && (
              <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl leading-relaxed animate-slide-up animation-delay-400">
                {currentSlideData.subtitle}
              </p>
            )}

            {/* Description */}
            {currentSlideData.description && (
              <p className="text-lg text-white/80 mb-10 max-w-3xl leading-relaxed animate-slide-up animation-delay-600">
                {currentSlideData.description}
              </p>
            )}

            {/* CTA Buttons */}
            {currentSlideData.ctaButtons &&
              currentSlideData.ctaButtons.length > 0 && (
                <div className="flex flex-wrap gap-4 animate-slide-up animation-delay-800">
                  {currentSlideData.ctaButtons.map((button, idx) => (
                    <Link
                      key={button.id || idx}
                      href={button.href}
                      className={cn(
                        "px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4",
                        button.variant === "secondary"
                          ? "bg-white text-healthcare-primary hover:bg-gray-100 focus:ring-white/50"
                          : button.variant === "ghost"
                            ? "bg-transparent border-2 border-white text-white hover:bg-white hover:text-healthcare-primary focus:ring-white/50"
                            : "bg-healthcare-primary-light text-white hover:bg-healthcare-accent-hover focus:ring-healthcare-primary-light/50",
                      )}
                      target={button.isExternal ? "_blank" : undefined}
                      rel={
                        button.isExternal ? "noopener noreferrer" : undefined
                      }
                    >
                      {button.icon && (
                        <span className="mr-2">{button.icon}</span>
                      )}
                      {button.text}
                    </Link>
                  ))}
                </div>
              )}

            {/* Default CTA if no buttons provided - Contextual per slide */}
            {(!currentSlideData.ctaButtons ||
              currentSlideData.ctaButtons.length === 0) && (
              <div className="flex flex-wrap gap-4 animate-slide-up animation-delay-800">
                {currentSlide === 0 && (
                  <>
                    <Link
                      href="/kontakt"
                      className="bg-healthcare-primary-light text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:bg-healthcare-accent-hover focus:outline-none focus:ring-4 focus:ring-healthcare-primary-light/50"
                    >
                      Zweitmeinung anfragen
                    </Link>
                    <Link
                      href="/fachbereiche"
                      className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-healthcare-primary focus:outline-none focus:ring-4 focus:ring-white/50"
                    >
                      Fachbereiche
                    </Link>
                  </>
                )}
                {currentSlide === 1 && (
                  <>
                    <Link
                      href="/beratung"
                      className="bg-healthcare-primary-light text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:bg-healthcare-accent-hover focus:outline-none focus:ring-4 focus:ring-healthcare-primary-light/50"
                    >
                      Jetzt beraten lassen
                    </Link>
                    <Link
                      href="/ueber-uns"
                      className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-healthcare-primary focus:outline-none focus:ring-4 focus:ring-white/50"
                    >
                      Mehr über uns
                    </Link>
                  </>
                )}
                {currentSlide === 2 && (
                  <>
                    <Link
                      href="/ai-solutions"
                      className="bg-healthcare-primary-light text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:bg-healthcare-accent-hover focus:outline-none focus:ring-4 focus:ring-healthcare-primary-light/50"
                    >
                      AI-Lösungen entdecken
                    </Link>
                    <Link
                      href="/kontakt"
                      className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-healthcare-primary focus:outline-none focus:ring-4 focus:ring-white/50"
                    >
                      Kontakt aufnehmen
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <>
          {/* Navigation Arrows */}
          {showArrows && (
            <>
              <button type="button"
                onClick={prevSlide}
                onMouseEnter={() => pauseOnHover && setIsPaused(true)}
                onMouseLeave={() => pauseOnHover && setIsPaused(false)}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-md p-4 rounded-full hover:bg-white/30 transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-white/50"
                aria-label="Vorheriger Slide"
              >
                <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>

              <button type="button"
                onClick={nextSlide}
                onMouseEnter={() => pauseOnHover && setIsPaused(true)}
                onMouseLeave={() => pauseOnHover && setIsPaused(false)}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-md p-4 rounded-full hover:bg-white/30 transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-white/50"
                aria-label="Nächster Slide"
              >
                <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
            </>
          )}

          {/* Play/Pause Button */}
          <button type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute top-4 right-4 md:top-8 md:right-8 z-30 bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/30 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50"
            aria-label={isPlaying ? "Autoplay pausieren" : "Autoplay starten"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white" />
            )}
          </button>

          {/* Dots Indicator */}
          {showDots && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
              {slides.map((_, index) => (
                <button type="button"
                  key={index}
                  onClick={() => goToSlide(index)}
                  onMouseEnter={() => pauseOnHover && setIsPaused(true)}
                  onMouseLeave={() => pauseOnHover && setIsPaused(false)}
                  className={cn(
                    "h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50",
                    index === currentSlide
                      ? "bg-white w-12"
                      : "bg-white/50 hover:bg-white/70 w-3",
                  )}
                  aria-label={`Zu Slide ${index + 1} wechseln`}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Progress Bar */}
      {slides.length > 1 && isPlaying && !isPaused && (
        <div className="absolute bottom-0 left-0 right-0 z-30 h-1 bg-white/20">
          <div
            className="h-full bg-healthcare-accent-green transition-all duration-100 ease-linear"
            style={{
              width: `${((currentSlide + 1) / slides.length) * 100}%`,
            }}
          />
        </div>
      )}

      {/* Accessibility: Screen reader content */}
      <div className="sr-only">
        <p>
          Slide {currentSlide + 1} von {slides.length}
        </p>
        {currentSlideData.titleLines && (
          <h1>
            {currentSlideData.titleLines.map((line) => line.text).join(" ")}
          </h1>
        )}
        {currentSlideData.subtitle && <p>{currentSlideData.subtitle}</p>}
      </div>
    </section>
  );
}
