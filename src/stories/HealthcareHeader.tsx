import React, { useState } from 'react'
import { Menu, X, Phone, Shield } from 'lucide-react'
import './HealthcareHeader.css'

export interface HealthcareHeaderProps {
  /** Logo text or component */
  logo?: React.ReactNode
  /** Navigation items */
  navigationItems?: Array<{
    label: string
    href: string
    isActive?: boolean
    children?: Array<{ label: string; href: string }>
  }>
  /** Emergency contact number */
  emergencyNumber?: string
  /** Show trust indicators (certifications) */
  showTrustIndicators?: boolean
  /** Current page path for active state */
  currentPath?: string
  /** Mobile menu open state (controlled) */
  isMobileMenuOpen?: boolean
  /** Mobile menu toggle handler */
  onMobileMenuToggle?: () => void
  /** Navigation item click handler */
  onNavigationClick?: (href: string) => void
}

export const HealthcareHeader = ({
  logo = 'zweitmeinung.ng',
  navigationItems = [
    { label: 'Kardiologie', href: '/kardiologie' },
    { label: 'Onkologie', href: '/onkologie' },
    { label: 'Gallenblase', href: '/gallenblase' },
    { label: 'Nephrologie', href: '/nephrologie' },
    { label: 'Schilddrüse', href: '/schilddruese' },
    { label: 'Intensivmedizin', href: '/intensivmedizin' },
    { label: 'Alle Fachbereiche', href: '/fachbereiche' }
  ],
  emergencyNumber = '+49 800 80 44 100',
  showTrustIndicators = true,
  currentPath = '/',
  isMobileMenuOpen: controlledMobileMenuOpen,
  onMobileMenuToggle,
  onNavigationClick
}: HealthcareHeaderProps) => {
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false)
  
  const isMobileMenuOpen = controlledMobileMenuOpen ?? internalMobileMenuOpen
  
  const handleMobileMenuToggle = () => {
    if (onMobileMenuToggle) {
      onMobileMenuToggle()
    } else {
      setInternalMobileMenuOpen(!internalMobileMenuOpen)
    }
  }

  const handleNavigationClick = (href: string) => {
    if (onNavigationClick) {
      onNavigationClick(href)
    }
    // Close mobile menu when navigating
    if (!onMobileMenuToggle) {
      setInternalMobileMenuOpen(false)
    }
  }

  return (
    <>
      {/* Emergency Banner - Always visible */}
      <div className="healthcare-emergency-banner">
        <div className="healthcare-emergency-content">
          <span className="healthcare-emergency-text">Medizinischer Notfall?</span>
          <a 
            href={`tel:${emergencyNumber}`}
            className="healthcare-emergency-link"
            aria-label={`Notfall-Hotline anrufen: ${emergencyNumber}`}
          >
            <Phone className="healthcare-emergency-icon" />
            {emergencyNumber}
          </a>
        </div>
      </div>

      {/* Main Header */}
      <header className="healthcare-header" role="banner">
        <div className="healthcare-header-container">
          {/* Logo Section */}
          <div className="healthcare-header-logo-section">
            <a 
              href="/" 
              className="healthcare-header-logo"
              aria-label="zweitmeinung.ng Startseite"
            >
              {typeof logo === 'string' ? (
                <span className="healthcare-header-logo-text">{logo}</span>
              ) : (
                logo
              )}
            </a>

            {showTrustIndicators && (
              <div className="healthcare-header-trust">
                <Shield className="healthcare-header-trust-icon" />
                <span className="healthcare-header-trust-text">DSGVO-konform</span>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav 
            className="healthcare-header-nav desktop"
            aria-label="Hauptnavigation medizinische Fachbereiche"
          >
            <ul className="healthcare-header-nav-list" role="list">
              {navigationItems.map((item) => (
                <li key={item.href} className="healthcare-header-nav-item" role="listitem">
                  <button
                    className={`healthcare-header-nav-link ${
                      currentPath === item.href ? 'active' : ''
                    }`}
                    onClick={() => handleNavigationClick(item.href)}
                    aria-current={currentPath === item.href ? 'page' : undefined}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="healthcare-header-mobile-toggle"
            onClick={handleMobileMenuToggle}
            aria-expanded={isMobileMenuOpen}
            aria-controls="healthcare-mobile-menu"
            aria-label="Hauptnavigation öffnen"
          >
            {isMobileMenuOpen ? (
              <X className="healthcare-header-mobile-icon" />
            ) : (
              <Menu className="healthcare-header-mobile-icon" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav 
            id="healthcare-mobile-menu"
            className="healthcare-header-nav mobile"
            aria-label="Mobile Navigation medizinische Fachbereiche"
          >
            <ul className="healthcare-header-mobile-list" role="list">
              {navigationItems.map((item) => (
                <li key={item.href} className="healthcare-header-mobile-item" role="listitem">
                  <button
                    className={`healthcare-header-mobile-link ${
                      currentPath === item.href ? 'active' : ''
                    }`}
                    onClick={() => handleNavigationClick(item.href)}
                    aria-current={currentPath === item.href ? 'page' : undefined}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Mobile Emergency Contact */}
            <div className="healthcare-header-mobile-emergency">
              <a 
                href={`tel:${emergencyNumber}`}
                className="healthcare-header-mobile-emergency-link"
                aria-label={`Notfall-Hotline anrufen: ${emergencyNumber}`}
              >
                <Phone className="healthcare-header-mobile-emergency-icon" />
                <span>Notfall: {emergencyNumber}</span>
              </a>
            </div>
          </nav>
        )}
      </header>
    </>
  )
}