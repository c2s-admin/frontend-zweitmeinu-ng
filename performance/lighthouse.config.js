module.exports = {
  // Healthcare-specific Lighthouse configuration
  extends: 'lighthouse:default',
  
  // Healthcare Performance Settings
  settings: {
    // Slow 3G network simulation for healthcare users
    throttlingMethod: 'simulate',
    throttling: {
      rttMs: 300,      // Round trip time (3G network)
      throughputKbps: 1600,  // Bandwidth (3G network)
      cpuSlowdownMultiplier: 4,  // Slower CPU for older healthcare devices
    },
    
    // Healthcare user context
    formFactor: 'mobile',  // Most healthcare users on mobile
    screenEmulation: {
      mobile: true,
      width: 375,     // iPhone SE size - common healthcare device
      height: 667,
      deviceScaleFactor: 2,
    },
    
    // Accessibility focus for medical users
    onlyCategories: [
      'performance',
      'accessibility', 
      'best-practices',
      'seo'
    ],
    
    // Healthcare-specific audit configuration
    skipAudits: [
      'uses-webp-images',  // Allow for medical image compatibility
    ],
    
    // Extended timeout for healthcare content loading
    maxWaitForFcp: 15000,  // First Contentful Paint
    maxWaitForLoad: 45000, // Complete load time
  },
  
  // Healthcare Performance Budgets (Critical Thresholds)
  budgets: [
    {
      resourceType: 'document',
      budget: 300,  // 300KB for main HTML (medical content)
    },
    {
      resourceType: 'stylesheet',
      budget: 150,  // 150KB for CSS (healthcare styling)
    },
    {
      resourceType: 'script',
      budget: 800,  // 800KB for JavaScript (healthcare interactions)
    },
    {
      resourceType: 'image',
      budget: 2000, // 2MB for images (medical images allowed)
    },
    {
      resourceType: 'font',
      budget: 200,  // 200KB for fonts (Roboto Condensed)
    },
    {
      resourceType: 'total',
      budget: 5000, // 5MB total page size (healthcare maximum)
    },
  ],
  
  // Healthcare Audits Configuration
  audits: {
    // Critical Healthcare Performance Metrics
    'first-contentful-paint': {
      // Medical users need immediate visual feedback
      scoringOptions: {
        p10: 1200,  // Excellent: <1.2s
        median: 2400, // Good: <2.4s  
      },
    },
    
    'largest-contentful-paint': {
      // Main medical content must load quickly
      scoringOptions: {
        p10: 1800,  // Excellent: <1.8s
        median: 3600, // Good: <3.6s
      },
    },
    
    'interactive': {
      // Healthcare forms must be interactive quickly
      scoringOptions: {
        p10: 3000,  // Excellent: <3s (healthcare requirement)
        median: 6000, // Good: <6s
      },
    },
    
    'cumulative-layout-shift': {
      // Critical: Medical forms must not shift during completion
      scoringOptions: {
        p10: 0.05,  // Excellent: minimal shift
        median: 0.10, // Good: small shifts acceptable
      },
    },
    
    // Healthcare Accessibility Audits (Enhanced)
    'color-contrast': {
      // Medical content must meet WCAG 2.1 AA (4.5:1 ratio)
      options: {
        requiredAALargeTextContrastRatio: 3.0,
        requiredAATextContrastRatio: 4.5,
      },
    },
    
    'tap-targets': {
      // Healthcare users need 56px+ touch targets (vs 44px standard)
      options: {
        minTapTargetSize: 56,  // Healthcare minimum
      },
    },
  },
  
  // Healthcare Categories
  categories: {
    'healthcare-performance': {
      title: 'Healthcare Performance',
      description: 'Performance metrics optimized for medical users on mobile devices with slow connections.',
      auditRefs: [
        { id: 'first-contentful-paint', weight: 25 },
        { id: 'largest-contentful-paint', weight: 25 },
        { id: 'interactive', weight: 25 },
        { id: 'cumulative-layout-shift', weight: 25 },
      ],
    },
    
    'medical-accessibility': {
      title: 'Medical Accessibility',
      description: 'Accessibility compliance for healthcare users including screen readers and motor impairments.',
      auditRefs: [
        { id: 'color-contrast', weight: 30 },
        { id: 'tap-targets', weight: 20 },
        { id: 'aria-labels', weight: 15 },
        { id: 'keyboard-navigation', weight: 15 },
        { id: 'focus-indicators', weight: 10 },
        { id: 'heading-order', weight: 10 },
      ],
    },
  },
}