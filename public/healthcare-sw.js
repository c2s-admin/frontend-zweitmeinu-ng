/**
 * Healthcare Service Worker
 * 
 * Optimized for medical applications:
 * - Emergency content always available offline
 * - Medical data cached securely
 * - Critical healthcare resources prioritized
 * - HIPAA-compliant caching strategies
 */

const HEALTHCARE_CACHE_VERSION = 'healthcare-v1.0.0'
const EMERGENCY_CACHE = 'emergency-cache'
const MEDICAL_STATIC_CACHE = 'medical-static-cache'
const MEDICAL_API_CACHE = 'medical-api-cache'

// Critical healthcare resources that must be available offline
const EMERGENCY_RESOURCES = [
  '/',
  '/emergency',
  '/contact',
  '/_next/static/css/',
  '/_next/static/js/emergency',
  '/emergency-contacts.json'
]

// Static medical resources
const MEDICAL_STATIC_RESOURCES = [
  '/favicon.ico',
  '/manifest.json',
  '/medical-icons/',
  '/_next/static/css/',
  '/_next/static/js/',
  '/fonts/'
]

// Medical API endpoints for offline access
const MEDICAL_API_PATTERNS = [
  /\/api\/medical-faq/,
  /\/api\/emergency-contacts/,
  /\/api\/specialists/
]

// Healthcare-specific caching strategies
const CACHE_STRATEGIES = {
  emergency: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    strategy: 'cache-first' // Always serve from cache for emergency content
  },
  medical: {
    maxAge: 4 * 60 * 60 * 1000, // 4 hours 
    strategy: 'stale-while-revalidate' // Serve fast, update in background
  },
  api: {
    maxAge: 2 * 60 * 60 * 1000, // 2 hours
    strategy: 'network-first' // Try network first for fresh data
  },
  images: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    strategy: 'cache-first' // Doctor photos, medical images
  }
}

// Install event - cache critical healthcare resources
self.addEventListener('install', event => {
  console.log('Healthcare service worker installing...')
  
  event.waitUntil(
    Promise.all([
      // Cache emergency resources immediately
      caches.open(EMERGENCY_CACHE).then(cache => {
        console.log('Caching emergency healthcare resources')
        return cache.addAll(EMERGENCY_RESOURCES.filter(url => 
          !url.includes('_next') // Skip Next.js chunks that might not exist yet
        ))
      }),
      
      // Cache medical static resources
      caches.open(MEDICAL_STATIC_CACHE).then(cache => {
        console.log('Caching medical static resources')
        return cache.addAll(MEDICAL_STATIC_RESOURCES.filter(url => 
          !url.includes('_next') // Skip Next.js chunks that might not exist yet
        ))
      })
    ]).then(() => {
      console.log('Healthcare service worker installed successfully')
      // Skip waiting to activate immediately for medical applications
      self.skipWaiting()
    })
  )
})

// Activate event - clean up old healthcare caches
self.addEventListener('activate', event => {
  console.log('Healthcare service worker activating...')
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete old healthcare cache versions
          if (cacheName.includes('healthcare-') && cacheName !== HEALTHCARE_CACHE_VERSION) {
            console.log('Deleting old healthcare cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('Healthcare service worker activated')
      // Take control immediately for medical applications
      return self.clients.claim()
    })
  )
})

// Fetch event - healthcare-optimized request handling
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return
  }
  
  // Emergency resource handling - always cache first
  if (isEmergencyResource(request.url)) {
    event.respondWith(handleEmergencyRequest(request))
    return
  }
  
  // Medical API handling
  if (isMedicalApiRequest(request.url)) {
    event.respondWith(handleMedicalApiRequest(request))
    return
  }
  
  // Medical images and static resources
  if (isMedicalImageRequest(request.url)) {
    event.respondWith(handleMedicalImageRequest(request))
    return
  }
  
  // Default healthcare strategy - stale while revalidate
  event.respondWith(handleDefaultHealthcareRequest(request))
})

// Emergency resource handler - cache first for reliability
async function handleEmergencyRequest(request) {
  try {
    const cache = await caches.open(EMERGENCY_CACHE)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      console.log('Serving emergency resource from cache:', request.url)
      return cachedResponse
    }
    
    // If not in cache, fetch and cache
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.error('Emergency resource failed:', request.url, error)
    
    // Return emergency fallback page
    return new Response(
      '<h1>Medizinischer Notfall</h1><p>Bitte wählen Sie 112 für den Notdienst</p>',
      { 
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
        status: 503 
      }
    )
  }
}

// Medical API handler - network first for fresh data
async function handleMedicalApiRequest(request) {
  try {
    const cache = await caches.open(MEDICAL_API_CACHE)
    
    // Try network first for fresh medical data
    try {
      const response = await fetch(request)
      if (response.ok) {
        // Cache successful responses (avoid caching errors)
        cache.put(request, response.clone())
        return response
      }
    } catch (networkError) {
      console.log('Medical API network failed, trying cache:', request.url)
    }
    
    // Fallback to cache
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      console.log('Serving medical API from cache:', request.url)
      return cachedResponse
    }
    
    // Return medical error response
    return new Response(
      JSON.stringify({
        error: 'Medical service temporarily unavailable',
        emergencyContact: '+49 112'
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 503 
      }
    )
  } catch (error) {
    console.error('Medical API request failed:', request.url, error)
    throw error
  }
}

// Medical image handler - cache first for performance
async function handleMedicalImageRequest(request) {
  try {
    const cache = await caches.open(MEDICAL_STATIC_CACHE)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Fetch and cache medical images
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.error('Medical image request failed:', request.url, error)
    
    // Return placeholder medical image
    return new Response(
      '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" fill="#6b7280">Medical Image</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    )
  }
}

// Default healthcare request handler
async function handleDefaultHealthcareRequest(request) {
  try {
    const cache = await caches.open(MEDICAL_STATIC_CACHE)
    const cachedResponse = await cache.match(request)
    
    // Serve from cache while fetching fresh version
    if (cachedResponse) {
      // Don't await - let it update in background
      fetch(request).then(response => {
        if (response.ok) {
          cache.put(request, response.clone())
        }
      }).catch(error => {
        console.log('Background update failed for:', request.url)
      })
      
      return cachedResponse
    }
    
    // Not in cache - fetch from network
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.error('Default healthcare request failed:', request.url, error)
    throw error
  }
}

// Helper functions
function isEmergencyResource(url) {
  return EMERGENCY_RESOURCES.some(pattern => {
    if (typeof pattern === 'string') {
      return url.includes(pattern)
    }
    return pattern.test(url)
  }) || url.includes('/emergency') || url.includes('/notfall')
}

function isMedicalApiRequest(url) {
  return MEDICAL_API_PATTERNS.some(pattern => pattern.test(url))
}

function isMedicalImageRequest(url) {
  return (url.includes('/uploads/') && (
    url.includes('.jpg') || 
    url.includes('.png') || 
    url.includes('.webp') ||
    url.includes('.svg')
  )) || url.includes('/medical-icons/') || url.includes('/doctor-photos/')
}

// Healthcare-specific message handling
self.addEventListener('message', event => {
  const { type, payload } = event.data
  
  switch (type) {
    case 'HEALTHCARE_CACHE_URGENT':
      // Cache urgent medical resources immediately
      event.waitUntil(cacheUrgentResources(payload.urls))
      break
      
    case 'HEALTHCARE_CLEAR_SENSITIVE':
      // Clear potentially sensitive medical data
      event.waitUntil(clearSensitiveData())
      break
      
    case 'HEALTHCARE_UPDATE_EMERGENCY':
      // Update emergency contact information
      event.waitUntil(updateEmergencyData(payload))
      break
      
    default:
      console.log('Unknown healthcare message:', type)
  }
})

// Cache urgent medical resources
async function cacheUrgentResources(urls) {
  try {
    const cache = await caches.open(EMERGENCY_CACHE)
    await cache.addAll(urls)
    console.log('Urgent medical resources cached:', urls)
  } catch (error) {
    console.error('Failed to cache urgent resources:', error)
  }
}

// Clear sensitive medical data from caches
async function clearSensitiveData() {
  try {
    const cacheNames = await caches.keys()
    await Promise.all(
      cacheNames.map(cacheName => {
        if (cacheName.includes('medical-api') || cacheName.includes('patient-data')) {
          console.log('Clearing sensitive medical cache:', cacheName)
          return caches.delete(cacheName)
        }
      })
    )
    console.log('Sensitive medical data cleared')
  } catch (error) {
    console.error('Failed to clear sensitive data:', error)
  }
}

// Update emergency contact data
async function updateEmergencyData(data) {
  try {
    const cache = await caches.open(EMERGENCY_CACHE)
    const response = new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    })
    await cache.put('/emergency-contacts.json', response)
    console.log('Emergency contacts updated')
  } catch (error) {
    console.error('Failed to update emergency data:', error)
  }
}

// Background sync for healthcare data
self.addEventListener('sync', event => {
  if (event.tag === 'healthcare-data-sync') {
    event.waitUntil(syncHealthcareData())
  }
})

async function syncHealthcareData() {
  try {
    // Sync critical healthcare data when connectivity is restored
    const urgentEndpoints = [
      '/api/emergency-contacts',
      '/api/medical-faq',
      '/api/specialists'
    ]
    
    const cache = await caches.open(MEDICAL_API_CACHE)
    
    await Promise.all(
      urgentEndpoints.map(async endpoint => {
        try {
          const response = await fetch(endpoint)
          if (response.ok) {
            await cache.put(endpoint, response.clone())
            console.log('Synced healthcare data:', endpoint)
          }
        } catch (error) {
          console.error('Failed to sync:', endpoint, error)
        }
      })
    )
  } catch (error) {
    console.error('Healthcare data sync failed:', error)
  }
}

console.log('Healthcare Service Worker loaded successfully')