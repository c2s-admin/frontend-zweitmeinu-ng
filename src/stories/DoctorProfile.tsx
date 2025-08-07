import React, { useState } from 'react'
import { Star, MapPin, Calendar, Clock, Phone, Mail, Shield, Award, BookOpen, Users, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import './DoctorProfile.css'

export interface DoctorCredential {
  /** Credential type */
  type: 'degree' | 'board-certification' | 'fellowship' | 'license' | 'award'
  /** Credential title */
  title: string
  /** Institution or organization */
  institution: string
  /** Year obtained */
  year?: number
  /** Verification status */
  verified?: boolean
}

export interface DoctorSpecialty {
  /** Specialty ID */
  id: string
  /** Specialty name */
  name: string
  /** Years of experience in this specialty */
  yearsOfExperience?: number
  /** Board certification status */
  boardCertified?: boolean
}

export interface DoctorLanguage {
  /** Language code */
  code: string
  /** Language name */
  name: string
  /** Proficiency level */
  proficiency: 'native' | 'fluent' | 'conversational' | 'basic'
}

export interface DoctorAvailability {
  /** Day of week */
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  /** Available time slots */
  slots: Array<{
    start: string
    end: string
    type?: 'consultation' | 'emergency' | 'follow-up'
  }>
  /** Emergency availability */
  emergencyAvailable?: boolean
}

export interface DoctorReview {
  /** Review ID */
  id: string
  /** Patient name (anonymized) */
  patientName: string
  /** Review rating (1-5 stars) */
  rating: number
  /** Review text */
  comment: string
  /** Review date */
  date: Date | string
  /** Medical specialty context */
  specialty?: string
  /** Verified review */
  verified?: boolean
}

export interface DoctorInsurance {
  /** Insurance provider name */
  name: string
  /** Coverage types accepted */
  types: string[]
  /** Direct billing available */
  directBilling?: boolean
}

export interface Doctor {
  /** Doctor ID */
  id: string
  /** Full name with title */
  fullName: string
  /** Professional title */
  title: string
  /** First name */
  firstName?: string
  /** Last name */
  lastName?: string
  /** Professional photo URL */
  photoUrl?: string
  /** Medical specialties */
  specialties: DoctorSpecialty[]
  /** Primary specialty for display */
  primarySpecialty?: string
  /** Years of total medical experience */
  yearsOfExperience: number
  /** Educational background and credentials */
  credentials: DoctorCredential[]
  /** Medical languages spoken */
  languages: DoctorLanguage[]
  /** Current practice location */
  location: {
    city: string
    country: string
    address?: string
    hospital?: string
    department?: string
  }
  /** Patient ratings and reviews */
  rating: {
    average: number
    count: number
    distribution?: {
      5: number
      4: number
      3: number
      2: number
      1: number
    }
  }
  /** Patient reviews */
  reviews?: DoctorReview[]
  /** Availability schedule */
  availability?: DoctorAvailability[]
  /** Accepted insurance providers */
  insurance?: DoctorInsurance[]
  /** Professional bio */
  bio?: string
  /** Research interests */
  researchInterests?: string[]
  /** Publications count */
  publicationsCount?: number
  /** Patient count treated */
  patientsCount?: number
  /** Contact information */
  contact?: {
    phone?: string
    email?: string
    website?: string
  }
  /** Emergency consultation available */
  emergencyAvailable?: boolean
  /** Online consultation available */
  onlineConsultationAvailable?: boolean
  /** Next available appointment */
  nextAvailableSlot?: Date | string
  /** Professional memberships */
  memberships?: string[]
  /** Medical license verification */
  licenseVerified?: boolean
  /** Privacy compliant photo */
  gdprCompliant?: boolean
}

export interface DoctorProfileProps {
  /** Doctor information */
  doctor: Doctor
  /** Display variant */
  variant?: 'card' | 'detailed' | 'compact' | 'list'
  /** Component size */
  size?: 'small' | 'medium' | 'large'
  /** Show patient reviews */
  showReviews?: boolean
  /** Show availability schedule */
  showAvailability?: boolean
  /** Show credentials */
  showCredentials?: boolean
  /** Show contact information */
  showContact?: boolean
  /** Show rating distribution */
  showRatingDistribution?: boolean
  /** Medical context styling */
  medicalContext?: boolean
  /** Emergency mode highlighting */
  emergencyMode?: boolean
  /** Privacy mode (hide sensitive info) */
  privacyMode?: boolean
  /** Interactive elements enabled */
  interactive?: boolean
  /** Loading state */
  loading?: boolean
  /** Custom class name */
  className?: string
  /** ARIA label */
  'aria-label'?: string
  /** Contact button click handler */
  onContactClick?: (doctor: Doctor, contactType: 'phone' | 'email' | 'booking') => void
  /** Review click handler */
  onReviewClick?: (review: DoctorReview) => void
  /** Profile click handler */
  onProfileClick?: (doctor: Doctor) => void
}

export const DoctorProfile = ({
  doctor,
  variant = 'card',
  size = 'medium',
  showReviews = false,
  showAvailability = false,
  showCredentials = true,
  showContact = true,
  showRatingDistribution = false,
  medicalContext = true,
  emergencyMode = false,
  privacyMode = false,
  interactive = true,
  loading = false,
  className = '',
  'aria-label': ariaLabel,
  onContactClick,
  onReviewClick,
  onProfileClick,
  ...props
}: DoctorProfileProps) => {
  const [showFullBio, setShowFullBio] = useState(false)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [showAllCredentials, setShowAllCredentials] = useState(false)

  const containerClasses = `
    doctor-profile-container
    doctor-profile-container--${variant}
    doctor-profile-container--${size}
    ${emergencyMode ? 'doctor-profile-container--emergency' : ''}
    ${medicalContext ? 'doctor-profile-container--medical' : ''}
    ${privacyMode ? 'doctor-profile-container--privacy' : ''}
    ${interactive ? 'doctor-profile-container--interactive' : ''}
    ${loading ? 'doctor-profile-container--loading' : ''}
    ${className}
  `.trim()

  // Get specialty color
  const getSpecialtyColor = (specialty?: string) => {
    const colors: Record<string, string> = {
      'kardiologie': '#dc2626',
      'onkologie': '#7c3aed',
      'gallenblase': '#f59e0b',
      'nephrologie': '#2563eb',
      'schilddruese': '#10b981',
      'intensivmedizin': '#ea580c'
    }
    return colors[specialty?.toLowerCase() || ''] || '#1278B3'
  }

  // Format rating
  const formatRating = (rating: number): string => {
    return rating.toFixed(1)
  }

  // Get language proficiency label
  const getLanguageProficiencyLabel = (proficiency: string): string => {
    const labels: Record<string, string> = {
      'native': 'Muttersprache',
      'fluent': 'Fließend',
      'conversational': 'Konversationsniveau',
      'basic': 'Grundkenntnisse'
    }
    return labels[proficiency] || proficiency
  }

  // Format years of experience
  const formatExperience = (years: number): string => {
    if (years === 1) return '1 Jahr Erfahrung'
    return `${years} Jahre Erfahrung`
  }

  // Handle contact click
  const handleContactClick = (contactType: 'phone' | 'email' | 'booking') => {
    if (onContactClick) {
      onContactClick(doctor, contactType)
    }
  }

  // Handle profile click
  const handleProfileClick = () => {
    if (interactive && onProfileClick) {
      onProfileClick(doctor)
    }
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className={containerClasses}>
        <div className="doctor-profile-skeleton">
          <div className="doctor-profile-skeleton-photo" />
          <div className="doctor-profile-skeleton-content">
            <div className="doctor-profile-skeleton-name" />
            <div className="doctor-profile-skeleton-specialty" />
            <div className="doctor-profile-skeleton-rating" />
            <div className="doctor-profile-skeleton-details" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={containerClasses} 
      aria-label={ariaLabel || `Dr. ${doctor.fullName} - ${doctor.primarySpecialty}`}
      onClick={variant === 'card' ? handleProfileClick : undefined}
      tabIndex={interactive && variant === 'card' ? 0 : undefined}
      role={interactive && variant === 'card' ? 'button' : undefined}
      onKeyDown={interactive && variant === 'card' ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleProfileClick()
        }
      } : undefined}
      {...props}
    >
      {/* Emergency Banner */}
      {emergencyMode && doctor.emergencyAvailable && (
        <div className="doctor-profile-emergency-banner">
          <Shield className="doctor-profile-emergency-icon" />
          <span>Notfall-Verfügbarkeit</span>
          <span className="doctor-profile-emergency-time">24/7</span>
        </div>
      )}

      {/* Header */}
      <div className="doctor-profile-header">
        {/* Photo */}
        <div className="doctor-profile-photo-container">
          {doctor.photoUrl ? (
            <img
              src={doctor.photoUrl}
              alt={`Dr. ${doctor.fullName}`}
              className="doctor-profile-photo"
              loading="lazy"
            />
          ) : (
            <div className="doctor-profile-photo-placeholder">
              <Users className="doctor-profile-photo-icon" />
            </div>
          )}
          
          {/* Verification Badge */}
          {doctor.licenseVerified && (
            <div className="doctor-profile-verification-badge">
              <Shield className="doctor-profile-verification-icon" />
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="doctor-profile-basic-info">
          <div className="doctor-profile-name-section">
            <h3 className="doctor-profile-name">
              {doctor.title} {doctor.fullName}
            </h3>
            
            {/* Primary Specialty */}
            <div 
              className="doctor-profile-specialty"
              style={{ color: getSpecialtyColor(doctor.primarySpecialty) }}
            >
              <div 
                className="doctor-profile-specialty-dot"
                style={{ backgroundColor: getSpecialtyColor(doctor.primarySpecialty) }}
              />
              {doctor.primarySpecialty || doctor.specialties[0]?.name}
            </div>
          </div>

          {/* Rating */}
          <div className="doctor-profile-rating-section">
            <div className="doctor-profile-rating">
              <div className="doctor-profile-stars">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`doctor-profile-star ${
                      index < Math.floor(doctor.rating.average) 
                        ? 'doctor-profile-star--filled' 
                        : index < doctor.rating.average 
                        ? 'doctor-profile-star--half'
                        : ''
                    }`}
                  />
                ))}
              </div>
              <span className="doctor-profile-rating-text">
                {formatRating(doctor.rating.average)}
                <span className="doctor-profile-rating-count">
                  ({doctor.rating.count} Bewertungen)
                </span>
              </span>
            </div>

            {/* Experience & Location */}
            <div className="doctor-profile-meta">
              <div className="doctor-profile-meta-item">
                <Clock className="doctor-profile-meta-icon" />
                <span>{formatExperience(doctor.yearsOfExperience)}</span>
              </div>
              <div className="doctor-profile-meta-item">
                <MapPin className="doctor-profile-meta-icon" />
                <span>{doctor.location.city}, {doctor.location.country}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extended Content (for detailed/large variants) */}
      {(variant === 'detailed' || size === 'large') && (
        <div className="doctor-profile-extended">
          {/* Bio */}
          {doctor.bio && (
            <div className="doctor-profile-bio-section">
              <h4 className="doctor-profile-section-title">
                <BookOpen className="doctor-profile-section-icon" />
                Beruflicher Werdegang
              </h4>
              <p className="doctor-profile-bio">
                {showFullBio || doctor.bio.length <= 200
                  ? doctor.bio
                  : `${doctor.bio.substring(0, 200)}...`}
                {doctor.bio.length > 200 && (
                  <button
                    className="doctor-profile-bio-toggle"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowFullBio(!showFullBio)
                    }}
                  >
                    {showFullBio ? (
                      <>
                        <ChevronUp className="doctor-profile-bio-toggle-icon" />
                        Weniger anzeigen
                      </>
                    ) : (
                      <>
                        <ChevronDown className="doctor-profile-bio-toggle-icon" />
                        Mehr anzeigen
                      </>
                    )}
                  </button>
                )}
              </p>
            </div>
          )}

          {/* Specialties */}
          {doctor.specialties.length > 1 && (
            <div className="doctor-profile-specialties-section">
              <h4 className="doctor-profile-section-title">
                <Award className="doctor-profile-section-icon" />
                Fachbereiche
              </h4>
              <div className="doctor-profile-specialties-list">
                {doctor.specialties.map((specialty) => (
                  <div key={specialty.id} className="doctor-profile-specialty-item">
                    <div 
                      className="doctor-profile-specialty-item-dot"
                      style={{ backgroundColor: getSpecialtyColor(specialty.name) }}
                    />
                    <span className="doctor-profile-specialty-item-name">
                      {specialty.name}
                    </span>
                    {specialty.yearsOfExperience && (
                      <span className="doctor-profile-specialty-item-experience">
                        {specialty.yearsOfExperience} Jahre
                      </span>
                    )}
                    {specialty.boardCertified && (
                      <div className="doctor-profile-specialty-certified">
                        <Shield className="doctor-profile-specialty-certified-icon" />
                        <span>Zertifiziert</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {doctor.languages.length > 0 && (
            <div className="doctor-profile-languages-section">
              <h4 className="doctor-profile-section-title">
                <MessageSquare className="doctor-profile-section-icon" />
                Sprachen
              </h4>
              <div className="doctor-profile-languages">
                {doctor.languages.map((language, index) => (
                  <div key={language.code} className="doctor-profile-language">
                    <span className="doctor-profile-language-name">{language.name}</span>
                    <span className="doctor-profile-language-level">
                      {getLanguageProficiencyLabel(language.proficiency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Credentials */}
      {showCredentials && doctor.credentials.length > 0 && (
        <div className="doctor-profile-credentials-section">
          <h4 className="doctor-profile-section-title">
            <Award className="doctor-profile-section-icon" />
            Qualifikationen
          </h4>
          <div className="doctor-profile-credentials">
            {(showAllCredentials ? doctor.credentials : doctor.credentials.slice(0, 3)).map((credential, index) => (
              <div key={index} className="doctor-profile-credential">
                <div className="doctor-profile-credential-main">
                  <span className="doctor-profile-credential-title">
                    {credential.title}
                  </span>
                  <span className="doctor-profile-credential-institution">
                    {credential.institution}
                  </span>
                </div>
                {credential.year && (
                  <span className="doctor-profile-credential-year">
                    {credential.year}
                  </span>
                )}
                {credential.verified && (
                  <div className="doctor-profile-credential-verified">
                    <Shield className="doctor-profile-credential-verified-icon" />
                  </div>
                )}
              </div>
            ))}
            {doctor.credentials.length > 3 && (
              <button
                className="doctor-profile-credentials-toggle"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowAllCredentials(!showAllCredentials)
                }}
              >
                {showAllCredentials ? (
                  <>
                    <ChevronUp className="doctor-profile-credentials-toggle-icon" />
                    Weniger anzeigen
                  </>
                ) : (
                  <>
                    <ChevronDown className="doctor-profile-credentials-toggle-icon" />
                    Alle {doctor.credentials.length} Qualifikationen anzeigen
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reviews */}
      {showReviews && doctor.reviews && doctor.reviews.length > 0 && (
        <div className="doctor-profile-reviews-section">
          <h4 className="doctor-profile-section-title">
            <Star className="doctor-profile-section-icon" />
            Patientenbewertungen
          </h4>
          
          {/* Rating Distribution */}
          {showRatingDistribution && doctor.rating.distribution && (
            <div className="doctor-profile-rating-distribution">
              {Object.entries(doctor.rating.distribution)
                .reverse()
                .map(([stars, count]) => (
                  <div key={stars} className="doctor-profile-rating-bar">
                    <span className="doctor-profile-rating-bar-stars">
                      {stars} <Star className="doctor-profile-rating-bar-star" />
                    </span>
                    <div className="doctor-profile-rating-bar-track">
                      <div 
                        className="doctor-profile-rating-bar-fill"
                        style={{ 
                          width: `${(count / doctor.rating.count) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="doctor-profile-rating-bar-count">
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          )}

          {/* Individual Reviews */}
          <div className="doctor-profile-reviews">
            {(showAllReviews ? doctor.reviews : doctor.reviews.slice(0, 2)).map((review) => (
              <div 
                key={review.id} 
                className="doctor-profile-review"
                onClick={() => onReviewClick?.(review)}
                role={onReviewClick ? 'button' : undefined}
                tabIndex={onReviewClick ? 0 : undefined}
              >
                <div className="doctor-profile-review-header">
                  <div className="doctor-profile-review-stars">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`doctor-profile-review-star ${
                          index < review.rating ? 'doctor-profile-review-star--filled' : ''
                        }`}
                      />
                    ))}
                  </div>
                  <span className="doctor-profile-review-date">
                    {typeof review.date === 'string' 
                      ? review.date 
                      : new Intl.DateTimeFormat('de-DE').format(new Date(review.date))
                    }
                  </span>
                  {review.verified && (
                    <div className="doctor-profile-review-verified">
                      <Shield className="doctor-profile-review-verified-icon" />
                      <span>Verifiziert</span>
                    </div>
                  )}
                </div>
                <p className="doctor-profile-review-comment">
                  {review.comment}
                </p>
                <div className="doctor-profile-review-footer">
                  <span className="doctor-profile-review-patient">
                    {review.patientName}
                  </span>
                  {review.specialty && (
                    <span className="doctor-profile-review-specialty">
                      {review.specialty}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {doctor.reviews.length > 2 && (
              <button
                className="doctor-profile-reviews-toggle"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowAllReviews(!showAllReviews)
                }}
              >
                {showAllReviews ? (
                  <>
                    <ChevronUp className="doctor-profile-reviews-toggle-icon" />
                    Weniger Bewertungen anzeigen
                  </>
                ) : (
                  <>
                    <ChevronDown className="doctor-profile-reviews-toggle-icon" />
                    Alle {doctor.reviews.length} Bewertungen anzeigen
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Contact Actions */}
      {showContact && interactive && (
        <div className="doctor-profile-actions">
          {doctor.contact?.phone && (
            <button
              className="doctor-profile-action doctor-profile-action--phone"
              onClick={(e) => {
                e.stopPropagation()
                handleContactClick('phone')
              }}
            >
              <Phone className="doctor-profile-action-icon" />
              <span>Anrufen</span>
            </button>
          )}
          
          {doctor.contact?.email && (
            <button
              className="doctor-profile-action doctor-profile-action--email"
              onClick={(e) => {
                e.stopPropagation()
                handleContactClick('email')
              }}
            >
              <Mail className="doctor-profile-action-icon" />
              <span>E-Mail</span>
            </button>
          )}
          
          <button
            className="doctor-profile-action doctor-profile-action--booking"
            onClick={(e) => {
              e.stopPropagation()
              handleContactClick('booking')
            }}
          >
            <Calendar className="doctor-profile-action-icon" />
            <span>Termin buchen</span>
          </button>
        </div>
      )}

      {/* Medical Context Footer */}
      {medicalContext && (
        <div className="doctor-profile-medical-footer">
          <Shield className="doctor-profile-medical-footer-icon" />
          <div className="doctor-profile-medical-footer-content">
            <span className="doctor-profile-medical-footer-title">
              Lizenzierter Arzt
            </span>
            <span className="doctor-profile-medical-footer-text">
              Alle Angaben wurden überprüft und entsprechen den medizinischen Standards.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

DoctorProfile.displayName = 'DoctorProfile'