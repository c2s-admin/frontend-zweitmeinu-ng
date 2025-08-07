import React, { useState, useCallback, useMemo } from 'react'
import { 
  User, Heart, Star, Play, Pause, Volume2, VolumeX,
  Calendar, MapPin, Award, CheckCircle, ArrowLeft, ArrowRight,
  Search, Filter, Tag, Video, Mic, ExternalLink
} from 'lucide-react'
import './StorySection.css'

export interface PatientStory {
  /** Story identifier */
  id: string
  /** Patient name (anonymized) */
  patientName: string
  /** Medical condition */
  condition: string
  /** Story title */
  title: string
  /** Story content */
  story: string
  /** Treatment outcome */
  outcome?: 'positive' | 'improved' | 'ongoing' | 'resolved'
  /** Patient age range */
  ageRange?: string
  /** Treatment duration */
  treatmentDuration?: string
  /** Hospital/clinic name */
  hospital?: string
  /** Medical specialty */
  specialty?: string
  /** Patient rating */
  rating?: number
  /** Story date */
  date?: Date
  /** Avatar image */
  avatar?: string
  /** Video testimonial URL */
  videoUrl?: string
  /** Audio testimonial URL */
  audioUrl?: string
  /** Medical images/documents */
  medicalImages?: string[]
  /** Verification status */
  verified?: boolean
  /** Tags */
  tags?: string[]
  /** Location (anonymized) */
  location?: string
}

export interface StorySectionProps {
  /** Section title */
  title?: string
  /** Section subtitle */
  subtitle?: string
  /** Section description */
  description?: string
  /** Patient stories */
  stories?: PatientStory[]
  /** Layout variant */
  variant?: 'grid' | 'carousel' | 'list' | 'featured' | 'modal'
  /** Component size */
  size?: 'small' | 'medium' | 'large'
  /** Stories per page */
  storiesPerPage?: number
  /** Show search functionality */
  showSearch?: boolean
  /** Show filter options */
  showFilters?: boolean
  /** Show video controls */
  showVideoControls?: boolean
  /** Show verification badges */
  showVerification?: boolean
  /** Show medical details */
  showMedicalDetails?: boolean
  /** Show patient ratings */
  showRatings?: boolean
  /** Enable audio playback */
  enableAudio?: boolean
  /** Medical context */
  medicalContext?: boolean
  /** Auto-play videos */
  autoPlayVideo?: boolean
  /** Loading state */
  loading?: boolean
  /** Custom class name */
  className?: string
  /** ARIA label */
  'aria-label'?: string
  /** Story click handler */
  onStoryClick?: (story: PatientStory) => void
  /** Video play handler */
  onVideoPlay?: (story: PatientStory) => void
  /** Video pause handler */
  onVideoPause?: (story: PatientStory) => void
  /** Audio toggle handler */
  onAudioToggle?: (story: PatientStory, enabled: boolean) => void
  /** Search handler */
  onSearch?: (query: string) => void
  /** Filter handler */
  onFilter?: (filters: string[]) => void
  /** Load more handler */
  onLoadMore?: () => void
}

// Default patient stories
const defaultPatientStories: PatientStory[] = [
  {
    id: 'story-cardiac-1',
    patientName: 'Maria S.',
    condition: 'Herzklappenfehler',
    title: 'Dank Zweitmeinung Operation vermieden',
    story: 'Nach der Diagnose eines Herzklappenfehlers war ich verzweifelt. Mein Arzt riet zu einer sofortigen Operation. Die Zweitmeinung zeigte jedoch, dass eine medikamentöse Behandlung ausreichend war. Heute, zwei Jahre später, geht es mir ausgezeichnet.',
    outcome: 'positive',
    ageRange: '55-65',
    treatmentDuration: '6 Monate',
    hospital: 'Universitätsklinikum Hamburg',
    specialty: 'Kardiologie',
    rating: 5,
    date: new Date('2024-07-15'),
    tags: ['Kardiologie', 'Operation vermieden', 'Medikamentöse Therapie'],
    location: 'Hamburg',
    verified: true
  },
  {
    id: 'story-oncology-1',
    patientName: 'Thomas M.',
    condition: 'Prostatakrebs',
    title: 'Schonendere Therapie dank Expertenrat',
    story: 'Bei der Diagnose Prostatakrebs wollte ich sicher sein, die richtige Behandlung zu wählen. Die Zweitmeinung bestätigte eine weniger aggressive Therapieform. Meine Lebensqualität blieb erhalten und der Krebs ist vollständig geheilt.',
    outcome: 'resolved',
    ageRange: '60-70',
    treatmentDuration: '12 Monate',
    hospital: 'Charité Berlin',
    specialty: 'Onkologie',
    rating: 5,
    date: new Date('2024-06-20'),
    videoUrl: '/testimonials/thomas-m-prostate.mp4',
    tags: ['Onkologie', 'Prostatakrebs', 'Schonende Therapie'],
    location: 'Berlin',
    verified: true
  },
  {
    id: 'story-orthopedics-1',
    patientName: 'Anna K.',
    condition: 'Bandscheibenvorfall',
    title: 'Alternative zu Rücken-OP gefunden',
    story: 'Monatelange Rückenschmerzen führten zur Empfehlung einer Bandscheiben-OP. Die Zweitmeinung schlug eine Kombination aus Physiotherapie und gezielten Injektionen vor. Nach 4 Monaten bin ich schmerzfrei - ohne Operation.',
    outcome: 'positive',
    ageRange: '40-50',
    treatmentDuration: '4 Monate',
    hospital: 'Orthopädische Klinik München',
    specialty: 'Orthopädie',
    rating: 5,
    date: new Date('2024-07-01'),
    tags: ['Orthopädie', 'Bandscheibenvorfall', 'Konservative Therapie'],
    location: 'München',
    verified: true
  },
  {
    id: 'story-neurology-1',
    patientName: 'Dr. Michael R.',
    condition: 'Multiple Sklerose',
    title: 'Frühe Diagnose rettete meine Karriere',
    story: 'Als Arzt ignorierte ich anfangs meine Symptome. Die Zweitmeinung führte zu einer frühen MS-Diagnose und sofortigen Therapie. Heute arbeite ich weiter als Chirurg und die Krankheit ist stabil.',
    outcome: 'improved',
    ageRange: '45-55',
    treatmentDuration: 'Ongoing',
    hospital: 'Universitätsklinikum Köln',
    specialty: 'Neurologie',
    rating: 5,
    date: new Date('2024-05-10'),
    audioUrl: '/testimonials/michael-r-ms.mp3',
    tags: ['Neurologie', 'Multiple Sklerose', 'Frühe Diagnose'],
    location: 'Köln',
    verified: true
  },
  {
    id: 'story-pediatrics-1',
    patientName: 'Familie Weber',
    condition: 'Seltene Krankheit (Kinderonkologie)',
    title: 'Hoffnung für unseren Sohn',
    story: 'Die Diagnose einer seltenen Krebserkrankung bei unserem 8-jährigen Sohn war ein Schock. Die Zweitmeinung eröffnete uns Behandlungsoptionen, an die wir nie gedacht hätten. Heute ist unser Sohn in Remission.',
    outcome: 'improved',
    ageRange: '0-10',
    treatmentDuration: '18 Monate',
    hospital: 'Kinderklinik Essen',
    specialty: 'Kinderonkologie',
    rating: 5,
    date: new Date('2024-04-15'),
    tags: ['Kinderonkologie', 'Seltene Krankheit', 'Spezialtherapie'],
    location: 'Essen',
    verified: true
  },
  {
    id: 'story-emergency-1',
    patientName: 'Robert H.',
    condition: 'Schlaganfall-Rehabilitation',
    title: 'Optimale Reha nach Schlaganfall',
    story: 'Nach meinem Schlaganfall war ich unsicher über die vorgeschlagene Rehabilitation. Die Zweitmeinung half mir, ein spezialisiertes Zentrum zu finden. Heute habe ich 90% meiner Beweglichkeit zurückerlangt.',
    outcome: 'improved',
    ageRange: '70+',
    treatmentDuration: '8 Monate',
    hospital: 'Reha-Zentrum Bad Aibling',
    specialty: 'Neurologie/Rehabilitation',
    rating: 5,
    date: new Date('2024-03-20'),
    tags: ['Schlaganfall', 'Rehabilitation', 'Spezialzentrum'],
    location: 'Bayern',
    verified: true
  }
]

export const StorySection = ({
  title = 'Patientengeschichten',
  subtitle = 'Echte Erfahrungen, echte Erfolge',
  description = 'Lesen Sie, wie unsere medizinischen Experten bereits tausenden Patienten zu besseren Behandlungsentscheidungen verholfen haben.',
  stories = defaultPatientStories,
  variant = 'grid',
  size = 'medium',
  storiesPerPage = 6,
  showSearch = true,
  showFilters = true,
  showVideoControls = true,
  showVerification = true,
  showMedicalDetails = true,
  showRatings = true,
  enableAudio = false,
  medicalContext = true,
  autoPlayVideo = false,
  loading = false,
  className = '',
  'aria-label': ariaLabel,
  onStoryClick,
  onVideoPlay,
  onVideoPause,
  onAudioToggle,
  onSearch,
  onFilter,
  onLoadMore,
  ...props
}: StorySectionProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const [audioEnabled, setAudioEnabled] = useState<Record<string, boolean>>({})

  const containerClasses = `
    healthcare-story-section
    healthcare-story-section--${variant}
    healthcare-story-section--${size}
    ${medicalContext ? 'healthcare-story-section--medical' : ''}
    ${loading ? 'healthcare-story-section--loading' : ''}
    ${className}
  `.trim()

  // Filter stories based on search and filters
  const filteredStories = useMemo(() => {
    let filtered = stories

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(story => 
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.story.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply category filters
    if (selectedFilters.length > 0) {
      filtered = filtered.filter(story =>
        selectedFilters.some(filter =>
          story.specialty?.toLowerCase().includes(filter.toLowerCase()) ||
          story.tags?.some(tag => tag.toLowerCase().includes(filter.toLowerCase())) ||
          story.outcome?.toLowerCase().includes(filter.toLowerCase())
        )
      )
    }

    return filtered
  }, [stories, searchQuery, selectedFilters])

  // Get paginated stories
  const paginatedStories = useMemo(() => {
    const start = currentPage * storiesPerPage
    return filteredStories.slice(start, start + storiesPerPage)
  }, [filteredStories, currentPage, storiesPerPage])

  // Get available filters
  const availableFilters = useMemo(() => {
    const filters = new Set<string>()
    stories.forEach(story => {
      if (story.specialty) filters.add(story.specialty)
      if (story.outcome) filters.add(story.outcome)
      story.tags?.forEach(tag => filters.add(tag))
    })
    return Array.from(filters)
  }, [stories])

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setCurrentPage(0)
    onSearch?.(query)
  }, [onSearch])

  // Handle filter toggle
  const handleFilterToggle = useCallback((filter: string) => {
    const newFilters = selectedFilters.includes(filter)
      ? selectedFilters.filter(f => f !== filter)
      : [...selectedFilters, filter]
    
    setSelectedFilters(newFilters)
    setCurrentPage(0)
    onFilter?.(newFilters)
  }, [selectedFilters, onFilter])

  // Handle video play/pause
  const handleVideoToggle = useCallback((story: PatientStory) => {
    const isPlaying = playingVideo === story.id
    
    if (isPlaying) {
      setPlayingVideo(null)
      onVideoPause?.(story)
    } else {
      setPlayingVideo(story.id)
      onVideoPlay?.(story)
    }
  }, [playingVideo, onVideoPlay, onVideoPause])

  // Handle audio toggle
  const handleAudioToggle = useCallback((story: PatientStory) => {
    const enabled = !audioEnabled[story.id]
    setAudioEnabled(prev => ({ ...prev, [story.id]: enabled }))
    onAudioToggle?.(story, enabled)
  }, [audioEnabled, onAudioToggle])

  // Get outcome icon and color
  const getOutcomeDisplay = (outcome?: string) => {
    switch (outcome) {
      case 'positive':
        return { icon: CheckCircle, color: '#10b981', text: 'Positiv' }
      case 'improved':
        return { icon: Heart, color: '#0ea5e9', text: 'Verbessert' }
      case 'ongoing':
        return { icon: Calendar, color: '#f59e0b', text: 'Laufend' }
      case 'resolved':
        return { icon: Award, color: '#8b5cf6', text: 'Geheilt' }
      default:
        return { icon: CheckCircle, color: '#6b7280', text: 'Behandelt' }
    }
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className={containerClasses}>
        <div className="healthcare-story-section-skeleton">
          <div className="healthcare-story-section-skeleton-header" />
          <div className="healthcare-story-section-skeleton-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="healthcare-story-section-skeleton-card" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={containerClasses}
      aria-label={ariaLabel || 'Patientengeschichten und Erfahrungsberichte'}
      {...props}
    >
      {/* Header */}
      <div className="healthcare-story-section-header">
        <div className="healthcare-story-section-title-container">
          <h2 className="healthcare-story-section-title">{title}</h2>
          <p className="healthcare-story-section-subtitle">{subtitle}</p>
          {description && (
            <p className="healthcare-story-section-description">{description}</p>
          )}
        </div>

        {/* Search and Filters */}
        {(showSearch || showFilters) && (
          <div className="healthcare-story-section-controls">
            {showSearch && (
              <div className="healthcare-story-section-search">
                <Search className="healthcare-story-section-search-icon" />
                <input
                  type="text"
                  className="healthcare-story-section-search-input"
                  placeholder="Geschichten durchsuchen..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  aria-label="Patientengeschichten durchsuchen"
                />
              </div>
            )}

            {showFilters && (
              <div className="healthcare-story-section-filters">
                <Filter className="healthcare-story-section-filters-icon" />
                <div className="healthcare-story-section-filters-list">
                  {availableFilters.slice(0, 8).map(filter => (
                    <button
                      key={filter}
                      className={`healthcare-story-section-filter ${
                        selectedFilters.includes(filter) ? 'healthcare-story-section-filter--active' : ''
                      }`}
                      onClick={() => handleFilterToggle(filter)}
                      aria-pressed={selectedFilters.includes(filter)}
                    >
                      <Tag className="healthcare-story-section-filter-icon" />
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stories Content */}
      <div className="healthcare-story-section-content">
        {filteredStories.length === 0 ? (
          <div className="healthcare-story-section-empty">
            <Search className="healthcare-story-section-empty-icon" />
            <h3>Keine Geschichten gefunden</h3>
            <p>Versuchen Sie andere Suchbegriffe oder Filter.</p>
          </div>
        ) : (
          <div className={`healthcare-story-section-stories healthcare-story-section-stories--${variant}`}>
            {paginatedStories.map((story) => {
              const outcomeDisplay = getOutcomeDisplay(story.outcome)
              const OutcomeIcon = outcomeDisplay.icon
              const isVideoPlaying = playingVideo === story.id
              const hasAudio = audioEnabled[story.id]

              return (
                <article 
                  key={story.id}
                  className="healthcare-story-section-story"
                  onClick={() => onStoryClick?.(story)}
                >
                  {/* Story Header */}
                  <div className="healthcare-story-section-story-header">
                    <div className="healthcare-story-section-story-patient">
                      <div className="healthcare-story-section-story-avatar">
                        {story.avatar ? (
                          <img 
                            src={story.avatar} 
                            alt={`${story.patientName} Avatar`}
                            className="healthcare-story-section-story-avatar-img"
                          />
                        ) : (
                          <User className="healthcare-story-section-story-avatar-icon" />
                        )}
                      </div>
                      <div className="healthcare-story-section-story-patient-info">
                        <div className="healthcare-story-section-story-patient-name">
                          {story.patientName}
                          {story.verified && showVerification && (
                            <CheckCircle className="healthcare-story-section-story-verified" />
                          )}
                        </div>
                        <div className="healthcare-story-section-story-patient-meta">
                          {story.ageRange && (
                            <span className="healthcare-story-section-story-meta-item">
                              {story.ageRange} Jahre
                            </span>
                          )}
                          {story.location && (
                            <span className="healthcare-story-section-story-meta-item">
                              <MapPin className="healthcare-story-section-story-meta-icon" />
                              {story.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="healthcare-story-section-story-outcome">
                      <OutcomeIcon 
                        className="healthcare-story-section-story-outcome-icon"
                        style={{ color: outcomeDisplay.color }}
                      />
                      <span className="healthcare-story-section-story-outcome-text">
                        {outcomeDisplay.text}
                      </span>
                    </div>
                  </div>

                  {/* Medical Details */}
                  {showMedicalDetails && (
                    <div className="healthcare-story-section-story-medical">
                      <div className="healthcare-story-section-story-condition">
                        <strong>Diagnose:</strong> {story.condition}
                      </div>
                      {story.specialty && (
                        <div className="healthcare-story-section-story-specialty">
                          <strong>Fachrichtung:</strong> {story.specialty}
                        </div>
                      )}
                      {story.hospital && (
                        <div className="healthcare-story-section-story-hospital">
                          <strong>Behandlung:</strong> {story.hospital}
                        </div>
                      )}
                      {story.treatmentDuration && (
                        <div className="healthcare-story-section-story-duration">
                          <strong>Dauer:</strong> {story.treatmentDuration}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Story Content */}
                  <div className="healthcare-story-section-story-content">
                    <h3 className="healthcare-story-section-story-title">
                      {story.title}
                    </h3>
                    <p className="healthcare-story-section-story-text">
                      {story.story}
                    </p>
                  </div>

                  {/* Media Controls */}
                  {(story.videoUrl || story.audioUrl) && (
                    <div className="healthcare-story-section-story-media">
                      {story.videoUrl && showVideoControls && (
                        <button
                          className="healthcare-story-section-story-media-control"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleVideoToggle(story)
                          }}
                          aria-label={isVideoPlaying ? 'Video pausieren' : 'Video abspielen'}
                        >
                          <Video className="healthcare-story-section-story-media-icon" />
                          {isVideoPlaying ? <Pause /> : <Play />}
                          <span>Video-Testimonial</span>
                        </button>
                      )}
                      
                      {story.audioUrl && enableAudio && (
                        <button
                          className="healthcare-story-section-story-media-control"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAudioToggle(story)
                          }}
                          aria-label={hasAudio ? 'Audio ausschalten' : 'Audio einschalten'}
                        >
                          <Mic className="healthcare-story-section-story-media-icon" />
                          {hasAudio ? <VolumeX /> : <Volume2 />}
                          <span>Audio-Bericht</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Story Footer */}
                  <div className="healthcare-story-section-story-footer">
                    {/* Rating */}
                    {showRatings && story.rating && (
                      <div className="healthcare-story-section-story-rating">
                        {Array.from({ length: story.rating }).map((_, i) => (
                          <Star key={i} className="healthcare-story-section-story-star" />
                        ))}
                        <span className="healthcare-story-section-story-rating-text">
                          {story.rating}/5 Sterne
                        </span>
                      </div>
                    )}

                    {/* Date */}
                    {story.date && (
                      <div className="healthcare-story-section-story-date">
                        <Calendar className="healthcare-story-section-story-date-icon" />
                        {story.date.toLocaleDateString('de-DE')}
                      </div>
                    )}

                    {/* Tags */}
                    {story.tags && story.tags.length > 0 && (
                      <div className="healthcare-story-section-story-tags">
                        {story.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="healthcare-story-section-story-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {filteredStories.length > storiesPerPage && (
          <div className="healthcare-story-section-pagination">
            <button
              className="healthcare-story-section-pagination-button"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              aria-label="Vorherige Seite"
            >
              <ArrowLeft />
              Zurück
            </button>

            <div className="healthcare-story-section-pagination-info">
              Seite {currentPage + 1} von {Math.ceil(filteredStories.length / storiesPerPage)}
              <br />
              {filteredStories.length} Geschichten
            </div>

            <button
              className="healthcare-story-section-pagination-button"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={(currentPage + 1) * storiesPerPage >= filteredStories.length}
              aria-label="Nächste Seite"
            >
              Weiter
              <ArrowRight />
            </button>
          </div>
        )}

        {/* Load More */}
        {onLoadMore && filteredStories.length === stories.length && (
          <div className="healthcare-story-section-load-more">
            <button
              className="healthcare-story-section-load-more-button"
              onClick={onLoadMore}
            >
              <ExternalLink className="healthcare-story-section-load-more-icon" />
              Weitere Geschichten laden
            </button>
          </div>
        )}
      </div>

      {/* Medical Disclaimer */}
      {medicalContext && (
        <div className="healthcare-story-section-disclaimer">
          <CheckCircle className="healthcare-story-section-disclaimer-icon" />
          <p>
            <strong>Wichtiger Hinweis:</strong> Die dargestellten Patientengeschichten sind authentische 
            Erfahrungsberichte. Einzelne Behandlungsergebnisse können variieren und sind nicht 
            als Heilungsversprechen zu verstehen.
          </p>
        </div>
      )}
    </div>
  )
}

StorySection.displayName = 'StorySection'