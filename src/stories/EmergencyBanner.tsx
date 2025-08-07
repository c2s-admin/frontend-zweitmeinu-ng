import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { 
  Phone, AlertTriangle, Heart, MapPin, Clock, X, 
  ChevronDown, ChevronUp, Volume2, VolumeX, 
  Smartphone, HeartHandshake, Stethoscope, Zap,
  ExternalLink, Info, Shield
} from 'lucide-react'
import './EmergencyBanner.css'

export interface EmergencyContact {
  /** Contact identifier */
  id: string
  /** Contact name */
  name: string
  /** Phone number */
  phone: string
  /** Contact type */
  type: 'emergency' | 'poison' | 'crisis' | 'medical' | 'telehealth'
  /** Availability */
  availability: '24/7' | 'business_hours' | 'limited'
  /** Geographic coverage */
  coverage: 'national' | 'regional' | 'international'
  /** Description */
  description?: string
  /** Website URL */
  website?: string
  /** Languages supported */
  languages?: string[]
  /** Special notes */
  notes?: string
}

export interface EmergencyNotification {
  /** Notification identifier */
  id: string
  /** Notification type */
  type: 'critical' | 'warning' | 'info' | 'maintenance'
  /** Title */
  title: string
  /** Message */
  message: string
  /** Priority level */
  priority: 'low' | 'medium' | 'high' | 'critical'
  /** Show timestamp */
  timestamp?: Date
  /** Auto dismiss after seconds */
  autoDismiss?: number
  /** Actions */
  actions?: Array<{
    label: string
    url?: string
    onClick?: () => void
    primary?: boolean
  }>
}

export interface EmergencyBannerProps {
  /** Emergency contacts */
  contacts?: EmergencyContact[]
  /** Current notifications */
  notifications?: EmergencyNotification[]
  /** Banner position */
  position?: 'top' | 'bottom' | 'floating'
  /** Component size */
  size?: 'small' | 'medium' | 'large'
  /** Layout variant */
  variant?: 'minimal' | 'standard' | 'expanded' | 'floating'
  /** Show emergency contacts */
  showContacts?: boolean
  /** Show notifications */
  showNotifications?: boolean
  /** Allow user to minimize */
  allowMinimize?: boolean
  /** Show audio alerts */
  enableAudioAlerts?: boolean
  /** Show geographic info */
  showLocation?: boolean
  /** Current user location */
  userLocation?: string
  /** Emergency mode */
  emergencyMode?: boolean
  /** Medical context */
  medicalContext?: boolean
  /** Auto-expand on critical */
  autoExpandCritical?: boolean
  /** Sticky behavior */
  sticky?: boolean
  /** Loading state */
  loading?: boolean
  /** Custom class name */
  className?: string
  /** ARIA label */
  'aria-label'?: string
  /** Contact click handler */
  onContactClick?: (contact: EmergencyContact) => void
  /** Emergency call handler */
  onEmergencyCall?: (contact: EmergencyContact) => void
  /** Notification dismiss handler */
  onNotificationDismiss?: (notificationId: string) => void
  /** Banner minimize handler */
  onMinimize?: (minimized: boolean) => void
  /** Location change handler */
  onLocationChange?: (location: string) => void
  /** Audio toggle handler */
  onAudioToggle?: (enabled: boolean) => void
}

// Default German emergency contacts
const defaultEmergencyContacts: EmergencyContact[] = [
  {
    id: 'emergency-112',
    name: 'Notruf',
    phone: '112',
    type: 'emergency',
    availability: '24/7',
    coverage: 'national',
    description: 'Feuerwehr, Rettungsdienst, Notarzt',
    languages: ['Deutsch', 'Englisch'],
    notes: 'Für akute medizinische Notfälle'
  },
  {
    id: 'police-110',
    name: 'Polizei',
    phone: '110',
    type: 'emergency',
    availability: '24/7',
    coverage: 'national',
    description: 'Polizeilicher Notruf',
    languages: ['Deutsch', 'Englisch']
  },
  {
    id: 'poison-center',
    name: 'Giftnotruf',
    phone: '+49 30 19240',
    type: 'poison',
    availability: '24/7',
    coverage: 'national',
    description: 'Vergiftungsnotfälle und Giftinformationen',
    website: 'https://www.giz-nord.de',
    languages: ['Deutsch', 'Englisch']
  },
  {
    id: 'telehealth-116117',
    name: 'Ärztlicher Bereitschaftsdienst',
    phone: '116117',
    type: 'medical',
    availability: '24/7',
    coverage: 'national',
    description: 'Nicht-lebensbedrohliche medizinische Probleme',
    website: 'https://www.116117.de',
    languages: ['Deutsch'],
    notes: 'Kostenlos aus allen deutschen Netzen'
  },
  {
    id: 'crisis-helpline',
    name: 'Telefonseelsorge',
    phone: '0800 111 0 111',
    type: 'crisis',
    availability: '24/7',
    coverage: 'national',
    description: 'Psychische Krisen und seelische Notlagen',
    website: 'https://www.telefonseelsorge.de',
    languages: ['Deutsch'],
    notes: 'Kostenfrei und anonym'
  }
]

// Sample emergency notifications
const sampleNotifications: EmergencyNotification[] = [
  {
    id: 'service-maintenance',
    type: 'warning',
    title: 'Geplante Wartungsarbeiten',
    message: 'Am 10.08.2024 zwischen 02:00-04:00 Uhr stehen einige Dienste nicht zur Verfügung. Notfallkontakte bleiben erreichbar.',
    priority: 'medium',
    timestamp: new Date()
  }
]

// Get contact type icon
const getContactTypeIcon = (type: EmergencyContact['type']) => {
  switch (type) {
    case 'emergency':
      return AlertTriangle
    case 'poison':
      return Heart
    case 'crisis':
      return HeartHandshake
    case 'medical':
      return Stethoscope
    case 'telehealth':
      return Smartphone
    default:
      return Phone
  }
}

// Get contact type color
const getContactTypeColor = (type: EmergencyContact['type']): string => {
  switch (type) {
    case 'emergency':
      return '#dc2626'
    case 'poison':
      return '#7c2d12'
    case 'crisis':
      return '#1d4ed8'
    case 'medical':
      return '#059669'
    case 'telehealth':
      return '#1278B3'
    default:
      return '#6b7280'
  }
}

// Get notification type color
const getNotificationTypeColor = (type: EmergencyNotification['type']): string => {
  switch (type) {
    case 'critical':
      return '#dc2626'
    case 'warning':
      return '#d97706'
    case 'info':
      return '#1278B3'
    case 'maintenance':
      return '#6b7280'
    default:
      return '#6b7280'
  }
}

// Format phone number for display
const formatPhoneNumber = (phone: string): string => {
  // Handle different phone number formats
  if (phone.startsWith('+49')) {
    return phone.replace('+49', '+49 ').replace(/(\d{2,4})(\d{3,4})(\d{4})/, '$1 $2 $3')
  }
  if (phone.match(/^\d{3}$/)) {
    return phone // Keep emergency numbers like 112, 110
  }
  if (phone.match(/^\d{6}$/)) {
    return phone.replace(/(\d{3})(\d{3})/, '$1 $2') // 116117 format
  }
  return phone
}

export const EmergencyBanner = ({
  contacts = defaultEmergencyContacts,
  notifications = sampleNotifications,
  position = 'top',
  size = 'medium',
  variant = 'standard',
  showContacts = true,
  showNotifications = true,
  allowMinimize = true,
  enableAudioAlerts = false,
  showLocation = true,
  userLocation = 'Deutschland',
  emergencyMode = false,
  medicalContext = true,
  autoExpandCritical = true,
  sticky = true,
  loading = false,
  className = '',
  'aria-label': ariaLabel,
  onContactClick,
  onEmergencyCall,
  onNotificationDismiss,
  onMinimize,
  onLocationChange,
  onAudioToggle,
  ...props
}: EmergencyBannerProps) => {
  const [isMinimized, setIsMinimized] = useState(!emergencyMode && !autoExpandCritical)
  const [isExpanded, setIsExpanded] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(enableAudioAlerts)
  const [activeNotifications, setActiveNotifications] = useState(notifications)

  // Auto-expand for critical notifications
  useEffect(() => {
    if (autoExpandCritical) {
      const hasCritical = notifications.some(n => n.priority === 'critical')
      if (hasCritical) {
        setIsMinimized(false)
        setIsExpanded(true)
      }
    }
  }, [notifications, autoExpandCritical])

  // Auto-dismiss notifications
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    
    notifications.forEach(notification => {
      if (notification.autoDismiss && notification.autoDismiss > 0) {
        const timer = setTimeout(() => {
          handleNotificationDismiss(notification.id)
        }, notification.autoDismiss * 1000)
        timers.push(timer)
      }
    })

    return () => timers.forEach(timer => clearTimeout(timer))
  }, [notifications])

  const containerClasses = `
    healthcare-emergency-banner
    healthcare-emergency-banner--${position}
    healthcare-emergency-banner--${size}
    healthcare-emergency-banner--${variant}
    ${emergencyMode ? 'healthcare-emergency-banner--emergency' : ''}
    ${medicalContext ? 'healthcare-emergency-banner--medical' : ''}
    ${isMinimized ? 'healthcare-emergency-banner--minimized' : ''}
    ${isExpanded ? 'healthcare-emergency-banner--expanded' : ''}
    ${sticky ? 'healthcare-emergency-banner--sticky' : ''}
    ${loading ? 'healthcare-emergency-banner--loading' : ''}
    ${className}
  `.trim()

  // Handle minimize toggle
  const handleMinimizeToggle = useCallback(() => {
    const newMinimized = !isMinimized
    setIsMinimized(newMinimized)
    onMinimize?.(newMinimized)
  }, [isMinimized, onMinimize])

  // Handle expand toggle
  const handleExpandToggle = useCallback(() => {
    setIsExpanded(!isExpanded)
  }, [isExpanded])

  // Handle audio toggle
  const handleAudioToggle = useCallback(() => {
    const newAudioEnabled = !audioEnabled
    setAudioEnabled(newAudioEnabled)
    onAudioToggle?.(newAudioEnabled)
  }, [audioEnabled, onAudioToggle])

  // Handle notification dismiss
  const handleNotificationDismiss = useCallback((notificationId: string) => {
    setActiveNotifications(prev => prev.filter(n => n.id !== notificationId))
    onNotificationDismiss?.(notificationId)
  }, [onNotificationDismiss])

  // Handle emergency call
  const handleEmergencyCall = useCallback((contact: EmergencyContact) => {
    if (audioEnabled) {
      // Play audio alert (would need actual audio implementation)
      console.log('🔊 Audio alert for emergency call')
    }
    
    onEmergencyCall?.(contact)
    onContactClick?.(contact)
    
    // Open phone dialer
    window.location.href = `tel:${contact.phone}`
  }, [audioEnabled, onEmergencyCall, onContactClick])

  // Get priority contacts (emergency first)
  const priorityContacts = useMemo(() => {
    const emergency = contacts.filter(c => c.type === 'emergency')
    const medical = contacts.filter(c => c.type === 'medical' || c.type === 'telehealth')
    const others = contacts.filter(c => !['emergency', 'medical', 'telehealth'].includes(c.type))
    
    return [...emergency, ...medical, ...others]
  }, [contacts])

  // Get critical notifications
  const criticalNotifications = useMemo(() => {
    return activeNotifications.filter(n => n.priority === 'critical')
  }, [activeNotifications])

  // Loading skeleton
  if (loading) {
    return (
      <div className={containerClasses}>
        <div className="healthcare-emergency-banner-skeleton">
          <div className="healthcare-emergency-banner-skeleton-content" />
        </div>
      </div>
    )
  }

  return (
    <div 
      className={containerClasses}
      aria-label={ariaLabel || 'Notfall-Banner mit wichtigen Kontakten'}
      role="banner"
      {...props}
    >
      {/* Critical Notifications */}
      {criticalNotifications.length > 0 && (
        <div className="healthcare-emergency-banner-critical">
          {criticalNotifications.map(notification => (
            <div 
              key={notification.id}
              className="healthcare-emergency-banner-critical-notification"
              role="alert"
              aria-live="assertive"
            >
              <div className="healthcare-emergency-banner-critical-content">
                <Zap className="healthcare-emergency-banner-critical-icon" />
                <div>
                  <strong>{notification.title}</strong>
                  <p>{notification.message}</p>
                </div>
              </div>
              <button
                className="healthcare-emergency-banner-critical-close"
                onClick={() => handleNotificationDismiss(notification.id)}
                aria-label={`${notification.title} schließen`}
              >
                <X />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Banner Content */}
      <div className="healthcare-emergency-banner-main">
        {/* Header */}
        <div className="healthcare-emergency-banner-header">
          <div className="healthcare-emergency-banner-title-container">
            <AlertTriangle className="healthcare-emergency-banner-title-icon" />
            <div>
              <h2 className="healthcare-emergency-banner-title">
                {emergencyMode ? '🚨 Notfall-Kontakte' : 'Notfall & Hilfe'}
              </h2>
              {showLocation && userLocation && (
                <p className="healthcare-emergency-banner-location">
                  <MapPin className="healthcare-emergency-banner-location-icon" />
                  <span>{userLocation}</span>
                </p>
              )}
            </div>
          </div>

          <div className="healthcare-emergency-banner-controls">
            {enableAudioAlerts && (
              <button
                className={`healthcare-emergency-banner-control ${audioEnabled ? 'healthcare-emergency-banner-control--active' : ''}`}
                onClick={handleAudioToggle}
                aria-label={`Audio-Alarme ${audioEnabled ? 'deaktivieren' : 'aktivieren'}`}
              >
                {audioEnabled ? <Volume2 /> : <VolumeX />}
              </button>
            )}

            {variant === 'expandable' && (
              <button
                className="healthcare-emergency-banner-control"
                onClick={handleExpandToggle}
                aria-expanded={isExpanded}
                aria-label={`Details ${isExpanded ? 'zuklappen' : 'aufklappen'}`}
              >
                {isExpanded ? <ChevronUp /> : <ChevronDown />}
              </button>
            )}

            {allowMinimize && (
              <button
                className="healthcare-emergency-banner-control"
                onClick={handleMinimizeToggle}
                aria-label={`Banner ${isMinimized ? 'einblenden' : 'minimieren'}`}
              >
                {isMinimized ? <ChevronDown /> : <ChevronUp />}
              </button>
            )}
          </div>
        </div>

        {/* Emergency Contacts */}
        {showContacts && !isMinimized && (
          <div className="healthcare-emergency-banner-contacts">
            <div className="healthcare-emergency-banner-contacts-grid">
              {priorityContacts.slice(0, variant === 'minimal' ? 2 : undefined).map(contact => {
                const ContactIcon = getContactTypeIcon(contact.type)
                const typeColor = getContactTypeColor(contact.type)
                
                return (
                  <button
                    key={contact.id}
                    className={`healthcare-emergency-banner-contact healthcare-emergency-banner-contact--${contact.type}`}
                    onClick={() => handleEmergencyCall(contact)}
                    style={{ borderColor: typeColor }}
                    aria-label={`${contact.name} anrufen: ${formatPhoneNumber(contact.phone)}`}
                  >
                    <div className="healthcare-emergency-banner-contact-icon-container">
                      <ContactIcon 
                        className="healthcare-emergency-banner-contact-icon"
                        style={{ color: typeColor }}
                      />
                      {contact.availability === '24/7' && (
                        <div className="healthcare-emergency-banner-contact-24-7">24/7</div>
                      )}
                    </div>
                    
                    <div className="healthcare-emergency-banner-contact-info">
                      <div className="healthcare-emergency-banner-contact-name">
                        {contact.name}
                      </div>
                      <div className="healthcare-emergency-banner-contact-phone">
                        <Phone className="healthcare-emergency-banner-contact-phone-icon" />
                        {formatPhoneNumber(contact.phone)}
                      </div>
                      {contact.description && (
                        <div className="healthcare-emergency-banner-contact-description">
                          {contact.description}
                        </div>
                      )}
                    </div>

                    {contact.type === 'emergency' && (
                      <div className="healthcare-emergency-banner-contact-emergency-badge">
                        <Zap className="healthcare-emergency-banner-contact-emergency-icon" />
                        NOTFALL
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Additional Contact Info */}
            {(isExpanded || variant === 'expanded') && (
              <div className="healthcare-emergency-banner-contact-details">
                {priorityContacts.map(contact => (
                  <div key={`${contact.id}-details`} className="healthcare-emergency-banner-contact-detail">
                    <div className="healthcare-emergency-banner-contact-detail-header">
                      <strong>{contact.name}</strong>
                      <span className="healthcare-emergency-banner-contact-detail-availability">
                        <Clock className="healthcare-emergency-banner-contact-detail-icon" />
                        {contact.availability === '24/7' ? '24 Stunden' : 
                         contact.availability === 'business_hours' ? 'Geschäftszeiten' : 'Eingeschränkt'}
                      </span>
                    </div>
                    
                    {contact.languages && (
                      <div className="healthcare-emergency-banner-contact-detail-languages">
                        <span>Sprachen: {contact.languages.join(', ')}</span>
                      </div>
                    )}
                    
                    {contact.website && (
                      <div className="healthcare-emergency-banner-contact-detail-website">
                        <a 
                          href={contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="healthcare-emergency-banner-contact-detail-link"
                        >
                          <ExternalLink className="healthcare-emergency-banner-contact-detail-link-icon" />
                          Website besuchen
                        </a>
                      </div>
                    )}
                    
                    {contact.notes && (
                      <div className="healthcare-emergency-banner-contact-detail-notes">
                        <Info className="healthcare-emergency-banner-contact-detail-icon" />
                        {contact.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Regular Notifications */}
        {showNotifications && !isMinimized && activeNotifications.filter(n => n.priority !== 'critical').length > 0 && (
          <div className="healthcare-emergency-banner-notifications">
            {activeNotifications.filter(n => n.priority !== 'critical').map(notification => (
              <div 
                key={notification.id}
                className={`healthcare-emergency-banner-notification healthcare-emergency-banner-notification--${notification.type}`}
                style={{ borderColor: getNotificationTypeColor(notification.type) }}
              >
                <div className="healthcare-emergency-banner-notification-content">
                  <div className="healthcare-emergency-banner-notification-header">
                    <strong>{notification.title}</strong>
                    {notification.timestamp && (
                      <time className="healthcare-emergency-banner-notification-timestamp">
                        {notification.timestamp.toLocaleTimeString('de-DE', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </time>
                    )}
                  </div>
                  <p>{notification.message}</p>
                  
                  {notification.actions && (
                    <div className="healthcare-emergency-banner-notification-actions">
                      {notification.actions.map((action, index) => (
                        <button
                          key={index}
                          className={`healthcare-emergency-banner-notification-action ${action.primary ? 'healthcare-emergency-banner-notification-action--primary' : ''}`}
                          onClick={action.onClick}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <button
                  className="healthcare-emergency-banner-notification-close"
                  onClick={() => handleNotificationDismiss(notification.id)}
                  aria-label={`${notification.title} schließen`}
                >
                  <X />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Medical Disclaimer */}
        {medicalContext && !isMinimized && (
          <div className="healthcare-emergency-banner-disclaimer">
            <Shield className="healthcare-emergency-banner-disclaimer-icon" />
            <p>
              <strong>Medizinischer Hinweis:</strong> Bei akuten lebensbedrohlichen Notfällen 
              rufen Sie sofort den Notruf <strong>112</strong>. Diese Plattform ersetzt 
              keine professionelle medizinische Beratung oder Notfallbehandlung.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

EmergencyBanner.displayName = 'EmergencyBanner'