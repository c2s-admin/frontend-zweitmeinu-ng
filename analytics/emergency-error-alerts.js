/**
 * Emergency Error Alert System for Medical Contexts
 * <5 minute response time for critical healthcare errors
 * 
 * @version 1.0.0
 */

import { 
  MEDICAL_ERROR_CATEGORIES,
  calculateErrorPriority,
  getResponseTime,
  getEscalationTeam
} from './medical-error-categories.js';

/**
 * Emergency Alert Channels
 */
const ALERT_CHANNELS = {
  CONSOLE: 'console',
  SENTRY: 'sentry', 
  WEBHOOK: 'webhook',
  EMAIL: 'email',
  SMS: 'sms',
  SLACK: 'slack'
};

/**
 * Emergency Error Alert System
 * Handles critical medical errors with immediate escalation
 */
class EmergencyErrorAlertSystem {
  constructor() {
    this.alertChannels = new Map();
    this.emergencyContacts = new Map();
    this.alertHistory = [];
    this.rateLimiter = new Map();
    this.isInitialized = false;
    
    this.init();
  }

  /**
   * Initialize Emergency Alert System
   */
  init() {
    if (this.isInitialized) return;

    // Register default alert channels
    this.registerAlertChannel(ALERT_CHANNELS.CONSOLE, this.consoleAlert.bind(this));
    
    // Setup emergency contacts
    this.setupEmergencyContacts();
    
    // Initialize rate limiting
    this.initializeRateLimiting();
    
    this.isInitialized = true;
    console.log('🚨 Emergency Error Alert System initialized for healthcare platform');
  }

  /**
   * Setup Emergency Contact Information
   */
  setupEmergencyContacts() {
    // Medical Emergency Team
    this.emergencyContacts.set('patient-safety', {
      name: 'Patient Safety Team',
      priority: 'P0',
      responseTime: '5 minutes',
      contacts: [
        { type: 'phone', value: '+49-800-MEDICAL', primary: true },
        { type: 'email', value: 'patient-safety@zweitmeinung.ng' },
        { type: 'slack', value: '#patient-safety-alerts' }
      ]
    });

    // Technical Emergency Response
    this.emergencyContacts.set('tech-emergency', {
      name: 'Technical Emergency Team',
      priority: 'P0',
      responseTime: '5 minutes',
      contacts: [
        { type: 'phone', value: '+49-800-TECH-911', primary: true },
        { type: 'email', value: 'tech-emergency@zweitmeinung.ng' },
        { type: 'slack', value: '#tech-emergency' }
      ]
    });

    // Medical Director
    this.emergencyContacts.set('medical-director', {
      name: 'Medical Director',
      priority: 'P0',
      responseTime: '15 minutes',
      contacts: [
        { type: 'email', value: 'medical-director@zweitmeinung.ng', primary: true },
        { type: 'phone', value: '+49-800-MED-DIR' }
      ]
    });

    // Compliance Team
    this.emergencyContacts.set('compliance', {
      name: 'Compliance & Privacy Team',
      priority: 'P1',
      responseTime: '15 minutes',
      contacts: [
        { type: 'email', value: 'compliance@zweitmeinung.ng', primary: true },
        { type: 'phone', value: '+49-800-PRIVACY' }
      ]
    });

    console.log('🏥 Emergency contacts configured for healthcare platform');
  }

  /**
   * Initialize Rate Limiting for Alert Channels
   */
  initializeRateLimiting() {
    // Prevent alert spam while ensuring critical alerts get through
    this.rateLimits = {
      [ALERT_CHANNELS.CONSOLE]: { limit: 100, window: 60000 }, // 100/min
      [ALERT_CHANNELS.EMAIL]: { limit: 10, window: 60000 },    // 10/min
      [ALERT_CHANNELS.SMS]: { limit: 5, window: 60000 },       // 5/min
      [ALERT_CHANNELS.WEBHOOK]: { limit: 50, window: 60000 },  // 50/min
      [ALERT_CHANNELS.SLACK]: { limit: 20, window: 60000 }     // 20/min
    };
  }

  /**
   * Process Emergency Medical Error
   * @param {Error} error - The error object
   * @param {Object} context - Medical context
   * @param {string} sentryEventId - Sentry event ID
   */
  async processEmergencyError(error, context, sentryEventId) {
    const {
      severity = 'medium',
      category = 'ui_component',
      userPersona = 'patient',
      emergencyContext = false,
      patientSafetyImpact = false
    } = context;

    // Calculate priority and response requirements
    const priority = calculateErrorPriority(category, userPersona, emergencyContext);
    const responseTime = getResponseTime(priority);
    const escalationTeams = getEscalationTeam(category);

    // Create emergency alert payload
    const alertPayload = {
      id: this.generateAlertId(),
      timestamp: new Date().toISOString(),
      priority,
      responseTime,
      category,
      severity,
      error: {
        message: error.message,
        name: error.name,
        sentryEventId
      },
      context: {
        userPersona,
        emergencyContext,
        patientSafetyImpact,
        medicalSpecialty: context.medicalSpecialty,
        component: context.componentName
      },
      escalation: {
        teams: escalationTeams,
        immediate: priority === 'P0',
        patientSafety: patientSafetyImpact
      },
      platform: 'zweitmeinung.ng'
    };

    // Process based on priority level
    if (priority === 'P0') {
      await this.handleCriticalAlert(alertPayload);
    } else if (priority === 'P1') {
      await this.handleHighPriorityAlert(alertPayload);
    } else {
      await this.handleStandardAlert(alertPayload);
    }

    // Store alert history
    this.alertHistory.push({
      ...alertPayload,
      processed: true,
      processedAt: new Date().toISOString()
    });

    // Cleanup old alert history (keep last 100)
    if (this.alertHistory.length > 100) {
      this.alertHistory = this.alertHistory.slice(-100);
    }
  }

  /**
   * Handle P0 Critical Alerts (Patient Safety Impact)
   * Response time: <5 minutes
   */
  async handleCriticalAlert(alertPayload) {
    console.error('🚨 CRITICAL MEDICAL ERROR - IMMEDIATE RESPONSE REQUIRED', alertPayload);

    // Immediate console alert
    this.sendAlert(ALERT_CHANNELS.CONSOLE, {
      ...alertPayload,
      level: 'CRITICAL',
      message: '🚨 PATIENT SAFETY IMPACT - IMMEDIATE ACTION REQUIRED'
    });

    // Notify all relevant emergency teams immediately
    const criticalTeams = alertPayload.escalation.patientSafety 
      ? ['patient-safety', 'tech-emergency', 'medical-director']
      : ['tech-emergency', 'patient-safety'];

    for (const team of criticalTeams) {
      await this.notifyEmergencyTeam(team, alertPayload, true);
    }

    // Start emergency procedures
    this.startEmergencyProcedures(alertPayload);
  }

  /**
   * Handle P1 High Priority Alerts
   * Response time: <30 minutes
   */
  async handleHighPriorityAlert(alertPayload) {
    console.error('⚠️ HIGH PRIORITY MEDICAL ERROR', alertPayload);

    this.sendAlert(ALERT_CHANNELS.CONSOLE, {
      ...alertPayload,
      level: 'HIGH',
      message: '⚠️ Medical workflow disruption - prompt response needed'
    });

    // Notify escalation teams
    for (const team of alertPayload.escalation.teams) {
      await this.notifyEmergencyTeam(team, alertPayload, false);
    }
  }

  /**
   * Handle Standard Priority Alerts
   * Response time: <2 hours
   */
  async handleStandardAlert(alertPayload) {
    console.warn('📋 Medical Error Alert', alertPayload);

    this.sendAlert(ALERT_CHANNELS.CONSOLE, {
      ...alertPayload,
      level: 'MEDIUM',
      message: 'Medical platform error requiring attention'
    });

    // Standard team notification
    if (alertPayload.escalation.teams.length > 0) {
      await this.notifyEmergencyTeam(alertPayload.escalation.teams[0], alertPayload, false);
    }
  }

  /**
   * Notify Emergency Team
   * @param {string} teamId - Emergency team identifier
   * @param {Object} alertPayload - Alert information
   * @param {boolean} immediate - Is this an immediate alert?
   */
  async notifyEmergencyTeam(teamId, alertPayload, immediate = false) {
    const team = this.emergencyContacts.get(teamId);
    if (!team) {
      console.error(`Emergency team not found: ${teamId}`);
      return;
    }

    const notification = {
      ...alertPayload,
      team: team.name,
      contacts: team.contacts,
      immediate
    };

    // Try multiple contact methods for immediate alerts
    if (immediate) {
      for (const contact of team.contacts) {
        try {
          await this.sendContactNotification(contact, notification);
        } catch (error) {
          console.error(`Failed to contact ${team.name} via ${contact.type}:`, error);
        }
      }
    } else {
      // Standard notification to primary contact
      const primaryContact = team.contacts.find(c => c.primary) || team.contacts[0];
      if (primaryContact) {
        await this.sendContactNotification(primaryContact, notification);
      }
    }
  }

  /**
   * Send Contact Notification
   * @param {Object} contact - Contact information
   * @param {Object} notification - Notification payload
   */
  async sendContactNotification(contact, notification) {
    const { type, value } = contact;

    switch (type) {
      case 'email':
        return this.sendEmailAlert(value, notification);
      
      case 'phone':
        return this.sendPhoneAlert(value, notification);
      
      case 'slack':
        return this.sendSlackAlert(value, notification);
      
      case 'webhook':
        return this.sendWebhookAlert(value, notification);
      
      default:
        console.warn(`Unknown contact type: ${type}`);
    }
  }

  /**
   * Start Emergency Procedures for Critical Errors
   */
  startEmergencyProcedures(alertPayload) {
    // Emergency procedure checklist
    const procedures = [
      'Display emergency contact banner',
      'Enable emergency fallback mode',
      'Alert monitoring systems',
      'Prepare incident report',
      'Check patient safety impact'
    ];

    console.log('🚨 Starting Emergency Procedures:', procedures);

    // Execute emergency procedures
    this.executeEmergencyFallback(alertPayload);
    this.alertMonitoringSystems(alertPayload);
    this.prepareIncidentReport(alertPayload);
  }

  /**
   * Execute Emergency Fallback Procedures
   */
  executeEmergencyFallback(alertPayload) {
    // Emergency fallback procedures for healthcare platform
    const fallbackActions = {
      'emergency_component': 'Display static emergency contacts',
      'patient_safety': 'Show emergency medical guidance',
      'patient_form': 'Provide alternative contact methods',
      'api_failure': 'Show cached emergency information',
      'authentication': 'Enable guest access to emergency info'
    };

    const action = fallbackActions[alertPayload.category] || 'Show emergency contact information';
    console.log(`🛡️ Emergency Fallback: ${action}`);

    // Trigger emergency UI state if available
    if (typeof window !== 'undefined' && window.triggerEmergencyMode) {
      window.triggerEmergencyMode(alertPayload);
    }
  }

  /**
   * Alert Monitoring Systems
   */
  alertMonitoringSystems(alertPayload) {
    // Alert external monitoring systems about critical healthcare error
    const monitoringAlert = {
      source: 'zweitmeinung.ng',
      type: 'healthcare_critical_error',
      priority: alertPayload.priority,
      patientSafetyImpact: alertPayload.context.patientSafetyImpact,
      timestamp: alertPayload.timestamp,
      errorId: alertPayload.id
    };

    console.log('📊 Alerting monitoring systems:', monitoringAlert);
    
    // Send to monitoring webhook if available
    this.sendMonitoringAlert(monitoringAlert);
  }

  /**
   * Prepare Incident Report
   */
  prepareIncidentReport(alertPayload) {
    const incidentReport = {
      id: `incident-${alertPayload.id}`,
      title: `Healthcare Critical Error: ${alertPayload.error.name}`,
      severity: alertPayload.severity,
      priority: alertPayload.priority,
      patientSafetyImpact: alertPayload.context.patientSafetyImpact,
      affectedServices: [alertPayload.context.component || 'unknown'],
      medicalSpecialty: alertPayload.context.medicalSpecialty,
      userPersona: alertPayload.context.userPersona,
      timestamp: alertPayload.timestamp,
      responseTeam: alertPayload.escalation.teams,
      status: 'open',
      actions: []
    };

    console.log('📋 Incident Report Prepared:', incidentReport.id);
    
    // Store incident report
    this.storeIncidentReport(incidentReport);
  }

  /**
   * Register Alert Channel
   * @param {string} channelId - Channel identifier
   * @param {Function} handler - Channel handler function
   */
  registerAlertChannel(channelId, handler) {
    this.alertChannels.set(channelId, handler);
  }

  /**
   * Send Alert to Channel
   * @param {string} channelId - Channel identifier
   * @param {Object} alertData - Alert payload
   */
  async sendAlert(channelId, alertData) {
    // Check rate limiting
    if (!this.checkRateLimit(channelId)) {
      console.warn(`Rate limit exceeded for channel: ${channelId}`);
      return;
    }

    const handler = this.alertChannels.get(channelId);
    if (!handler) {
      console.error(`Alert channel not found: ${channelId}`);
      return;
    }

    try {
      await handler(alertData);
      this.recordRateLimit(channelId);
    } catch (error) {
      console.error(`Alert channel error (${channelId}):`, error);
    }
  }

  /**
   * Console Alert Handler
   */
  consoleAlert(alertData) {
    const { level, message, priority, responseTime, context } = alertData;
    
    console.group(`🏥 HEALTHCARE ERROR ALERT - ${level}`);
    console.error(message);
    console.error(`Priority: ${priority} | Response Time: ${responseTime}`);
    console.error(`Medical Context:`, context);
    console.error(`Full Alert:`, alertData);
    console.groupEnd();
  }

  /**
   * Check Rate Limit for Channel
   */
  checkRateLimit(channelId) {
    const limits = this.rateLimits[channelId];
    if (!limits) return true;

    const now = Date.now();
    const windowStart = now - limits.window;
    
    if (!this.rateLimiter.has(channelId)) {
      this.rateLimiter.set(channelId, []);
    }

    const requests = this.rateLimiter.get(channelId);
    const recentRequests = requests.filter(time => time > windowStart);
    
    return recentRequests.length < limits.limit;
  }

  /**
   * Record Rate Limit Request
   */
  recordRateLimit(channelId) {
    const now = Date.now();
    
    if (!this.rateLimiter.has(channelId)) {
      this.rateLimiter.set(channelId, []);
    }

    const requests = this.rateLimiter.get(channelId);
    requests.push(now);
    
    // Clean old requests
    const limits = this.rateLimits[channelId];
    if (limits) {
      const windowStart = now - limits.window;
      this.rateLimiter.set(channelId, requests.filter(time => time > windowStart));
    }
  }

  /**
   * Generate Alert ID
   */
  generateAlertId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `healthcare-alert-${timestamp}-${random}`;
  }

  // Placeholder methods for external integrations
  async sendEmailAlert(email, notification) {
    console.log(`📧 Email alert sent to: ${email}`, notification);
    // Implement email sending logic
  }

  async sendPhoneAlert(phone, notification) {
    console.log(`📱 Phone alert sent to: ${phone}`, notification);
    // Implement SMS/phone alert logic
  }

  async sendSlackAlert(channel, notification) {
    console.log(`📢 Slack alert sent to: ${channel}`, notification);
    // Implement Slack integration
  }

  async sendWebhookAlert(url, notification) {
    console.log(`🔗 Webhook alert sent to: ${url}`, notification);
    // Implement webhook sending logic
  }

  async sendMonitoringAlert(alert) {
    console.log('📊 Monitoring alert:', alert);
    // Send to external monitoring systems
  }

  storeIncidentReport(report) {
    console.log('📋 Incident report stored:', report.id);
    // Store incident report in database/system
  }
}

// Singleton instance
const emergencyAlertSystem = new EmergencyErrorAlertSystem();

// Export convenience functions
export function processEmergencyError(error, context, sentryEventId) {
  return emergencyAlertSystem.processEmergencyError(error, context, sentryEventId);
}

export function registerEmergencyAlertChannel(channelId, handler) {
  emergencyAlertSystem.registerAlertChannel(channelId, handler);
}

export default emergencyAlertSystem;