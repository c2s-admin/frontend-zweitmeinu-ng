#!/usr/bin/env node

/**
 * Healthcare Accessibility Test Automation
 * Automated WCAG 2.1 AA Testing for Medical Applications
 * 
 * @healthcare-compliance WCAG 2.1 AA + Healthcare Extensions
 * @emergency-ready Emergency component accessibility validation
 * @german-medical German medical terminology support
 */

const axeCore = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const { healthcare: healthcareConfig } = require('./axe-config.js');

// Healthcare Test Configuration
const HEALTHCARE_TEST_CONFIG = {
  // Test environments
  environments: {
    storybook: 'http://localhost:6006',
    development: 'http://localhost:3000',
    staging: process.env.STAGING_URL || 'https://staging.zweitmeinung.ng',
    production: process.env.PRODUCTION_URL || 'https://zweitmeinung.ng'
  },
  
  // Healthcare component patterns to test
  healthcareComponents: [
    // Emergency Components (Critical Priority)
    '/iframe.html?id=healthcare-emergencybanner--default',
    '/iframe.html?id=healthcare-emergencybanner--emergency-active',
    
    // Medical Forms (High Priority)
    '/iframe.html?id=healthcare-healthcareinput--medical-concern',
    '/iframe.html?id=healthcare-healthcaretextarea--patient-history',
    '/iframe.html?id=healthcare-healthcareselect--medical-specialty',
    
    // Healthcare Navigation (High Priority)
    '/iframe.html?id=healthcare-healthcareheader--with-emergency-contacts',
    '/iframe.html?id=healthcare-healthcareheader--medical-specialties',
    
    // Doctor/Trust Elements (Medium Priority)
    '/iframe.html?id=healthcare-doctorprofile--default',
    '/iframe.html?id=healthcare-doctorprofile--with-credentials',
    
    // Patient CTAs (Medium Priority)
    '/iframe.html?id=healthcare-button--primary-consultation',
    '/iframe.html?id=healthcare-button--emergency-contact',
    
    // Medical Information (Medium Priority)
    '/iframe.html?id=healthcare-medicalfaq--default',
    '/iframe.html?id=healthcare-specialtyselector--cardiology'
  ],
  
  // Healthcare-specific test scenarios
  testScenarios: [
    {
      name: 'Emergency Accessibility',
      priority: 'critical',
      components: ['emergencybanner', 'emergency-contact'],
      requiredScore: 100, // Perfect score required for emergency
      wcagLevel: 'AAA'    // Emergency requires AAA level
    },
    {
      name: 'Medical Form Accessibility',
      priority: 'high',
      components: ['healthcareinput', 'healthcaretextarea', 'healthcareselect'],
      requiredScore: 95,  // Near perfect for patient data
      wcagLevel: 'AA',
      additionalChecks: ['gdpr-compliance', 'privacy-indicators']
    },
    {
      name: 'Healthcare Navigation',
      priority: 'high',
      components: ['healthcareheader', 'navigation'],
      requiredScore: 90,
      wcagLevel: 'AA',
      additionalChecks: ['medical-specialty-navigation', 'emergency-bypass']
    },
    {
      name: 'Trust & Credibility',
      priority: 'medium',
      components: ['doctorprofile', 'credentials', 'trust-indicators'],
      requiredScore: 85,
      wcagLevel: 'AA'
    }
  ],
  
  // Healthcare user simulation
  userProfiles: [
    {
      name: 'Stressed Patient',
      viewport: { width: 375, height: 667 }, // Mobile
      accessibility: {
        reducedMotion: true,
        highContrast: false,
        largeText: false
      }
    },
    {
      name: 'Elderly Patient',
      viewport: { width: 1024, height: 768 }, // Tablet
      accessibility: {
        reducedMotion: true,
        highContrast: true,
        largeText: true
      }
    },
    {
      name: 'Screen Reader User',
      viewport: { width: 1280, height: 720 }, // Desktop
      accessibility: {
        screenReader: true,
        keyboardOnly: true
      }
    },
    {
      name: 'Motor Impairment User',
      viewport: { width: 375, height: 812 }, // Mobile
      accessibility: {
        largeTouch: true,
        voiceInput: true
      }
    }
  ]
};

class HealthcareAccessibilityTester {
  constructor(options = {}) {
    this.config = { ...HEALTHCARE_TEST_CONFIG, ...options };
    this.results = {
      summary: {},
      detailed: [],
      errors: [],
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    };
  }

  async initialize() {
    console.log('🏥 Initializing Healthcare Accessibility Testing...');
    
    // Launch browser with healthcare-optimized settings
    this.browser = await puppeteer.launch({
      headless: process.env.CI ? true : 'new', // Show browser in local development
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security', // For cross-origin testing
        '--disable-features=TranslateUI', // Avoid translation interference
        '--lang=de-DE' // German language for medical context
      ]
    });
    
    console.log('✅ Browser launched with healthcare settings');
  }

  async testHealthcareComponent(componentUrl, userProfile, testScenario) {
    const page = await this.browser.newPage();
    
    try {
      // Configure page for healthcare user profile
      await this.setupHealthcareUserProfile(page, userProfile);
      
      // Navigate to component
      const fullUrl = `${this.config.environments.storybook}${componentUrl}`;
      console.log(`🔍 Testing: ${componentUrl} for ${userProfile.name}`);
      
      await page.goto(fullUrl, { 
        waitUntil: 'networkidle0',
        timeout: 30000 // Healthcare components must load quickly
      });
      
      // Wait for healthcare components to fully render
      await page.waitForTimeout(2000);
      
      // Run axe-core accessibility tests with healthcare config
      const results = await axeCore.run(page, {
        ...healthcareConfig,
        // Override for specific test scenario
        tags: testScenario ? [testScenario.wcagLevel.toLowerCase(), 'healthcare'] : ['wcag21aa', 'healthcare']
      });
      
      // Analyze results with healthcare context
      const analysis = this.analyzeHealthcareResults(results, testScenario, userProfile);
      
      // Healthcare-specific additional checks
      const additionalChecks = await this.runHealthcareSpecificChecks(page, testScenario);
      
      return {
        component: componentUrl,
        userProfile: userProfile.name,
        scenario: testScenario?.name || 'General',
        axeResults: results,
        analysis,
        additionalChecks,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error(`❌ Error testing ${componentUrl}:`, error.message);
      this.results.errors.push({
        component: componentUrl,
        userProfile: userProfile.name,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return null;
    } finally {
      await page.close();
    }
  }

  async setupHealthcareUserProfile(page, userProfile) {
    // Set viewport for healthcare user
    await page.setViewport(userProfile.viewport);
    
    // Simulate accessibility preferences
    if (userProfile.accessibility) {
      const { reducedMotion, highContrast, largeText, screenReader } = userProfile.accessibility;
      
      // Reduced motion for stressed/elderly users
      if (reducedMotion) {
        await page.emulateMediaFeatures([
          { name: 'prefers-reduced-motion', value: 'reduce' }
        ]);
      }
      
      // High contrast for vision impaired users
      if (highContrast) {
        await page.emulateMediaFeatures([
          { name: 'prefers-contrast', value: 'high' }
        ]);
      }
      
      // Large text simulation
      if (largeText) {
        await page.addStyleTag({
          content: `
            * { font-size: 120% !important; }
            .healthcare-button { min-height: 64px !important; }
          `
        });
      }
    }
  }

  analyzeHealthcareResults(axeResults, testScenario, userProfile) {
    const violations = axeResults.violations || [];
    const passes = axeResults.passes || [];
    
    // Calculate healthcare-specific scoring
    const totalChecks = violations.length + passes.length;
    const score = totalChecks > 0 ? Math.round((passes.length / totalChecks) * 100) : 0;
    
    // Determine if meets healthcare requirements
    const requiredScore = testScenario?.requiredScore || 85;
    const meetsRequirement = score >= requiredScore;
    
    // Categorize violations by healthcare impact
    const categorizedViolations = this.categorizeHealthcareViolations(violations);
    
    return {
      score,
      requiredScore,
      meetsRequirement,
      totalChecks,
      passedChecks: passes.length,
      violationCount: violations.length,
      categorizedViolations,
      healthcareImpact: this.assessHealthcareImpact(violations),
      recommendations: this.generateHealthcareRecommendations(violations, testScenario)
    };
  }

  categorizeHealthcareViolations(violations) {
    const categories = {
      emergency: [],      // Emergency component issues (Critical)
      medical: [],        // Medical form/data issues (High)
      navigation: [],     // Healthcare navigation issues (High)
      trust: [],          // Trust/credibility issues (Medium)
      general: []         // General accessibility issues (Low)
    };
    
    violations.forEach(violation => {
      const { id, impact, nodes } = violation;
      
      // Categorize by healthcare context
      if (this.isEmergencyViolation(violation)) {
        categories.emergency.push(violation);
      } else if (this.isMedicalFormViolation(violation)) {
        categories.medical.push(violation);
      } else if (this.isNavigationViolation(violation)) {
        categories.navigation.push(violation);
      } else if (this.isTrustViolation(violation)) {
        categories.trust.push(violation);
      } else {
        categories.general.push(violation);
      }
    });
    
    return categories;
  }

  isEmergencyViolation(violation) {
    const emergencyKeywords = ['emergency', 'notfall', 'urgent', 'kritisch'];
    const violationText = JSON.stringify(violation).toLowerCase();
    return emergencyKeywords.some(keyword => violationText.includes(keyword));
  }

  isMedicalFormViolation(violation) {
    const medicalKeywords = ['form', 'input', 'label', 'medical', 'patient', 'health'];
    const violationText = JSON.stringify(violation).toLowerCase();
    return medicalKeywords.some(keyword => violationText.includes(keyword));
  }

  isNavigationViolation(violation) {
    const navKeywords = ['navigation', 'menu', 'header', 'link', 'button'];
    const violationText = JSON.stringify(violation).toLowerCase();
    return navKeywords.some(keyword => violationText.includes(keyword));
  }

  isTrustViolation(violation) {
    const trustKeywords = ['credential', 'certificate', 'trust', 'doctor', 'expert'];
    const violationText = JSON.stringify(violation).toLowerCase();
    return trustKeywords.some(keyword => violationText.includes(keyword));
  }

  assessHealthcareImpact(violations) {
    let impact = {
      emergency: 0,    // Critical - blocks emergency access
      medical: 0,      // High - affects medical data/forms
      navigation: 0,   // High - blocks healthcare navigation
      trust: 0,        // Medium - affects trust/credibility
      general: 0       // Low - general accessibility
    };
    
    violations.forEach(violation => {
      if (this.isEmergencyViolation(violation)) impact.emergency++;
      else if (this.isMedicalFormViolation(violation)) impact.medical++;
      else if (this.isNavigationViolation(violation)) impact.navigation++;
      else if (this.isTrustViolation(violation)) impact.trust++;
      else impact.general++;
    });
    
    // Calculate overall healthcare impact score
    const totalImpact = impact.emergency * 10 + impact.medical * 5 + impact.navigation * 5 + impact.trust * 2 + impact.general * 1;
    
    return {
      ...impact,
      totalScore: totalImpact,
      severity: totalImpact > 20 ? 'critical' : totalImpact > 10 ? 'high' : totalImpact > 5 ? 'medium' : 'low'
    };
  }

  generateHealthcareRecommendations(violations, testScenario) {
    const recommendations = [];
    
    violations.forEach(violation => {
      const { id, description, help, helpUrl } = violation;
      
      // Generate healthcare-specific fix recommendations
      let healthcareFix = '';
      
      switch (id) {
        case 'color-contrast':
          healthcareFix = 'Healthcare Empfehlung: Verwenden Sie die healthcare-primary (#004166) oder healthcare-primary-light (#1278B3) Farben für besseren Kontrast in medizinischen Anwendungen.';
          break;
        case 'target-size':
          healthcareFix = 'Healthcare Empfehlung: Erhöhen Sie Touch-Targets auf mindestens 56px für gestresste Patienten oder 72px für Notfall-Buttons.';
          break;
        case 'aria-label':
          healthcareFix = 'Healthcare Empfehlung: Fügen Sie medizinisch kontextualisierte ARIA-Labels hinzu, z.B. "Medizinische Zweitmeinung anfordern" statt nur "Anfragen".';
          break;
        case 'label':
          healthcareFix = 'Healthcare Empfehlung: Alle Patientendaten-Felder benötigen explizite Labels mit Datenschutzhinweisen.';
          break;
        default:
          healthcareFix = 'Healthcare Empfehlung: Beheben Sie diese Accessibility-Probleme um die medizinische Benutzerfreundlichkeit zu gewährleisten.';
      }
      
      recommendations.push({
        rule: id,
        description,
        help,
        helpUrl,
        healthcareFix,
        priority: this.getHealthcarePriority(violation),
        affectedUsers: this.getAffectedHealthcareUsers(violation)
      });
    });
    
    return recommendations;
  }

  getHealthcarePriority(violation) {
    if (this.isEmergencyViolation(violation)) return 'critical';
    if (this.isMedicalFormViolation(violation) || this.isNavigationViolation(violation)) return 'high';
    if (this.isTrustViolation(violation)) return 'medium';
    return 'low';
  }

  getAffectedHealthcareUsers(violation) {
    const users = [];
    const violationText = JSON.stringify(violation).toLowerCase();
    
    if (violationText.includes('contrast') || violationText.includes('color')) {
      users.push('Sehbehinderte Patienten', 'Ältere Patienten');
    }
    if (violationText.includes('target') || violationText.includes('size')) {
      users.push('Motorisch eingeschränkte Patienten', 'Gestresste Patienten');
    }
    if (violationText.includes('aria') || violationText.includes('label')) {
      users.push('Screen-Reader Nutzer', 'Blinde Patienten');
    }
    if (violationText.includes('keyboard') || violationText.includes('focus')) {
      users.push('Keyboard-only Nutzer', 'Spracheingabe Nutzer');
    }
    
    return users.length > 0 ? users : ['Alle Healthcare Nutzer'];
  }

  async runHealthcareSpecificChecks(page, testScenario) {
    const checks = {};
    
    try {
      // Check for emergency contact visibility
      checks.emergencyContactVisible = await page.evaluate(() => {
        const emergencyElements = document.querySelectorAll('[data-healthcare="emergency"], .emergency-banner, [aria-label*="Notfall"]');
        return emergencyElements.length > 0 && Array.from(emergencyElements).some(el => el.offsetParent !== null);
      });
      
      // Check for privacy indicators in forms
      checks.privacyIndicatorsPresent = await page.evaluate(() => {
        const forms = document.querySelectorAll('form, [data-healthcare="form"]');
        if (forms.length === 0) return true; // No forms to check
        
        return Array.from(forms).some(form => {
          const privacyIndicators = form.querySelectorAll('[data-privacy], .privacy-indicator, [aria-label*="DSGVO"], [aria-label*="Datenschutz"]');
          return privacyIndicators.length > 0;
        });
      });
      
      // Check for medical specialty navigation
      checks.medicalSpecialtyNavigation = await page.evaluate(() => {
        const specialtyNav = document.querySelectorAll('[data-healthcare="navigation"], .medical-specialty-nav, [aria-label*="Fachbereich"], [aria-label*="Spezialist"]');
        return specialtyNav.length > 0;
      });
      
      // Check for touch target sizes
      checks.healthcareTouchTargets = await page.evaluate(() => {
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [tabindex]');
        let validTargets = 0;
        let totalTargets = 0;
        
        interactiveElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const size = Math.min(rect.width, rect.height);
          totalTargets++;
          
          // Healthcare standard: 56px minimum
          if (size >= 56) validTargets++;
        });
        
        return {
          totalTargets,
          validTargets,
          percentage: totalTargets > 0 ? Math.round((validTargets / totalTargets) * 100) : 100
        };
      });
      
    } catch (error) {
      console.warn('⚠️ Healthcare-specific check failed:', error.message);
      checks.error = error.message;
    }
    
    return checks;
  }

  async runFullHealthcareSuite() {
    console.log('🏥 Starting comprehensive healthcare accessibility testing...');
    
    await this.initialize();
    
    try {
      // Test all healthcare components with all user profiles
      for (const componentUrl of this.config.healthcareComponents) {
        for (const userProfile of this.config.userProfiles) {
          // Find matching test scenario
          const scenario = this.config.testScenarios.find(s => 
            componentUrl.toLowerCase().includes(s.components.find(c => componentUrl.includes(c)))
          );
          
          const result = await this.testHealthcareComponent(componentUrl, userProfile, scenario);
          if (result) {
            this.results.detailed.push(result);
          }
        }
      }
      
      // Generate summary
      this.results.summary = this.generateHealthcareSummary();
      
      // Save results
      await this.saveHealthcareResults();
      
      console.log('✅ Healthcare accessibility testing completed');
      console.log(`📊 Overall Score: ${this.results.summary.overallScore}%`);
      console.log(`🏥 Healthcare Compliance: ${this.results.summary.healthcareCompliance ? 'PASSED' : 'FAILED'}`);
      
      return this.results;
      
    } finally {
      await this.browser.close();
    }
  }

  generateHealthcareSummary() {
    const detailed = this.results.detailed.filter(r => r !== null);
    
    if (detailed.length === 0) {
      return { error: 'No test results available' };
    }
    
    const totalTests = detailed.length;
    const totalScore = detailed.reduce((sum, result) => sum + result.analysis.score, 0);
    const overallScore = Math.round(totalScore / totalTests);
    
    // Healthcare compliance thresholds
    const healthcareCompliance = overallScore >= 85; // Minimum for healthcare
    const emergencyCompliance = detailed.filter(r => r.scenario === 'Emergency Accessibility').every(r => r.analysis.score >= 100);
    const medicalFormCompliance = detailed.filter(r => r.scenario === 'Medical Form Accessibility').every(r => r.analysis.score >= 95);
    
    // Violation analysis
    const allViolations = detailed.flatMap(r => r.axeResults.violations || []);
    const criticalViolations = allViolations.filter(v => this.isEmergencyViolation(v)).length;
    const highViolations = allViolations.filter(v => this.isMedicalFormViolation(v) || this.isNavigationViolation(v)).length;
    
    return {
      totalTests,
      overallScore,
      healthcareCompliance,
      emergencyCompliance,
      medicalFormCompliance,
      violations: {
        critical: criticalViolations,
        high: highViolations,
        total: allViolations.length
      },
      testsByScenario: this.groupResultsByScenario(detailed),
      recommendations: this.generateTopHealthcareRecommendations(detailed)
    };
  }

  groupResultsByScenario(detailed) {
    const scenarios = {};
    
    detailed.forEach(result => {
      const scenario = result.scenario || 'General';
      if (!scenarios[scenario]) {
        scenarios[scenario] = {
          tests: 0,
          averageScore: 0,
          violations: 0
        };
      }
      
      scenarios[scenario].tests++;
      scenarios[scenario].averageScore = Math.round(
        (scenarios[scenario].averageScore * (scenarios[scenario].tests - 1) + result.analysis.score) / scenarios[scenario].tests
      );
      scenarios[scenario].violations += (result.axeResults.violations || []).length;
    });
    
    return scenarios;
  }

  generateTopHealthcareRecommendations(detailed) {
    const allRecommendations = detailed.flatMap(r => r.analysis.recommendations || []);
    
    // Group by rule and count frequency
    const ruleFrequency = {};
    allRecommendations.forEach(rec => {
      if (!ruleFrequency[rec.rule]) {
        ruleFrequency[rec.rule] = { ...rec, count: 0 };
      }
      ruleFrequency[rec.rule].count++;
    });
    
    // Sort by frequency and healthcare priority
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    
    return Object.values(ruleFrequency)
      .sort((a, b) => {
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        return priorityDiff !== 0 ? priorityDiff : b.count - a.count;
      })
      .slice(0, 10); // Top 10 recommendations
  }

  async saveHealthcareResults() {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const resultsDir = path.join(process.cwd(), 'accessibility', 'reports');
    
    // Ensure reports directory exists
    await fs.mkdir(resultsDir, { recursive: true });
    
    // Save detailed JSON report
    const jsonPath = path.join(resultsDir, `healthcare-accessibility-${timestamp}.json`);
    await fs.writeFile(jsonPath, JSON.stringify(this.results, null, 2));
    
    // Save HTML report
    const htmlReport = this.generateHealthcareHTMLReport();
    const htmlPath = path.join(resultsDir, `healthcare-accessibility-${timestamp}.html`);
    await fs.writeFile(htmlPath, htmlReport);
    
    // Save latest report (for CI/CD)
    const latestJsonPath = path.join(resultsDir, 'latest-healthcare-accessibility.json');
    await fs.writeFile(latestJsonPath, JSON.stringify(this.results, null, 2));
    
    console.log(`📋 Healthcare accessibility reports saved:`);
    console.log(`   JSON: ${jsonPath}`);
    console.log(`   HTML: ${htmlPath}`);
    console.log(`   Latest: ${latestJsonPath}`);
  }

  generateHealthcareHTMLReport() {
    const { summary, detailed, timestamp } = this.results;
    
    return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Healthcare Accessibility Report - zweitmeinung.ng</title>
  <style>
    :root {
      --healthcare-primary: #004166;
      --healthcare-primary-light: #1278B3;
      --healthcare-accent-green: #B3AF09;
      --healthcare-error: #dc2626;
      --healthcare-warning: #f59e0b;
      --healthcare-success: #10b981;
    }
    
    body {
      font-family: 'Roboto Condensed', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui;
      margin: 0;
      padding: 20px;
      background: #f8fafc;
      color: #333;
    }
    
    .header {
      background: var(--healthcare-primary);
      color: white;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 20px;
    }
    
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .score {
      font-size: 2rem;
      font-weight: bold;
      margin: 10px 0;
    }
    
    .score.excellent { color: var(--healthcare-success); }
    .score.good { color: var(--healthcare-accent-green); }
    .score.warning { color: var(--healthcare-warning); }
    .score.critical { color: var(--healthcare-error); }
    
    .compliance {
      display: inline-block;
      padding: 5px 12px;
      border-radius: 20px;
      font-weight: bold;
      margin: 5px;
    }
    
    .compliance.passed {
      background: var(--healthcare-success);
      color: white;
    }
    
    .compliance.failed {
      background: var(--healthcare-error);
      color: white;
    }
    
    .recommendations {
      margin-top: 30px;
    }
    
    .recommendation {
      background: white;
      padding: 15px;
      margin: 10px 0;
      border-radius: 8px;
      border-left: 4px solid var(--healthcare-primary-light);
    }
    
    .priority-critical { border-left-color: var(--healthcare-error); }
    .priority-high { border-left-color: var(--healthcare-warning); }
    .priority-medium { border-left-color: var(--healthcare-accent-green); }
    .priority-low { border-left-color: var(--healthcare-primary); }
    
    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      margin: 20px 0;
    }
    
    th, td {
      text-align: left;
      padding: 12px;
      border-bottom: 1px solid #eee;
    }
    
    th {
      background: var(--healthcare-primary);
      color: white;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏥 Healthcare Accessibility Report</h1>
    <p>WCAG 2.1 AA Compliance für zweitmeinung.ng</p>
    <p><strong>Zeitpunkt:</strong> ${new Date(timestamp).toLocaleString('de-DE')}</p>
  </div>

  <div class="summary">
    <div class="card">
      <h3>Overall Score</h3>
      <div class="score ${this.getScoreClass(summary.overallScore)}">${summary.overallScore}%</div>
      <p>Durchschnittliche Accessibility-Bewertung aller Healthcare-Komponenten</p>
    </div>

    <div class="card">
      <h3>Healthcare Compliance</h3>
      <div class="compliance ${summary.healthcareCompliance ? 'passed' : 'failed'}">
        ${summary.healthcareCompliance ? 'BESTANDEN' : 'FEHLGESCHLAGEN'}
      </div>
      <p>Erfüllung der Healthcare-spezifischen WCAG 2.1 AA Standards</p>
    </div>

    <div class="card">
      <h3>Emergency Compliance</h3>
      <div class="compliance ${summary.emergencyCompliance ? 'passed' : 'failed'}">
        ${summary.emergencyCompliance ? 'BESTANDEN' : 'FEHLGESCHLAGEN'}
      </div>
      <p>Notfall-Komponenten müssen 100% Accessibility erreichen</p>
    </div>

    <div class="card">
      <h3>Tests Durchgeführt</h3>
      <div class="score">${summary.totalTests}</div>
      <p>Anzahl der getesteten Komponenten und Nutzerprofile</p>
    </div>
  </div>

  <div class="card">
    <h3>Violations by Priority</h3>
    <p><strong>Critical:</strong> ${summary.violations.critical} (Emergency/Notfall-Probleme)</p>
    <p><strong>High:</strong> ${summary.violations.high} (Medizinische Formulare/Navigation)</p>
    <p><strong>Total:</strong> ${summary.violations.total} Accessibility-Probleme gefunden</p>
  </div>

  <div class="recommendations">
    <h3>🎯 Top Healthcare Recommendations</h3>
    ${(summary.recommendations || []).map(rec => `
      <div class="recommendation priority-${rec.priority}">
        <h4>${rec.rule}</h4>
        <p><strong>Healthcare Fix:</strong> ${rec.healthcareFix}</p>
        <p><strong>Betroffene Nutzer:</strong> ${rec.affectedUsers.join(', ')}</p>
        <p><strong>Häufigkeit:</strong> ${rec.count} Komponenten betroffen</p>
      </div>
    `).join('')}
  </div>

  <div class="card">
    <h3>📊 Test Results by Scenario</h3>
    <table>
      <thead>
        <tr>
          <th>Scenario</th>
          <th>Tests</th>
          <th>Average Score</th>
          <th>Violations</th>
        </tr>
      </thead>
      <tbody>
        ${Object.entries(summary.testsByScenario || {}).map(([scenario, data]) => `
          <tr>
            <td>${scenario}</td>
            <td>${data.tests}</td>
            <td class="score ${this.getScoreClass(data.averageScore)}">${data.averageScore}%</td>
            <td>${data.violations}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <footer style="text-align: center; margin-top: 40px; padding: 20px; color: #666;">
    <p>🏥 Healthcare Accessibility Report generiert für zweitmeinung.ng</p>
    <p>WCAG 2.1 AA Standards + Healthcare Extensions</p>
  </footer>
</body>
</html>`;
  }

  getScoreClass(score) {
    if (score >= 95) return 'excellent';
    if (score >= 85) return 'good';
    if (score >= 70) return 'warning';
    return 'critical';
  }
}

// CLI Interface
async function runHealthcareAccessibilityTests() {
  const tester = new HealthcareAccessibilityTester();
  
  try {
    const results = await tester.runFullHealthcareSuite();
    
    // Exit with error code if healthcare compliance failed
    if (!results.summary.healthcareCompliance) {
      console.error('❌ Healthcare accessibility compliance failed');
      process.exit(1);
    }
    
    // Exit with error code if emergency compliance failed (critical)
    if (!results.summary.emergencyCompliance) {
      console.error('🚨 Emergency accessibility compliance failed - CRITICAL');
      process.exit(1);
    }
    
    console.log('✅ All healthcare accessibility tests passed');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Healthcare accessibility testing failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runHealthcareAccessibilityTests();
}

module.exports = {
  HealthcareAccessibilityTester,
  HEALTHCARE_TEST_CONFIG,
  runHealthcareAccessibilityTests
};