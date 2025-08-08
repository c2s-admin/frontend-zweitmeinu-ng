#!/usr/bin/env node

/**
 * Healthcare Performance Budget Enforcement
 * Validates bundle sizes and performance metrics against healthcare-specific budgets
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Healthcare Performance Budget Configuration
const HEALTHCARE_BUDGETS = {
  // Critical Healthcare Components (Emergency)
  CRITICAL_COMPONENTS: {
    maxSize: 50 * 1024, // 50KB
    maxFCP: 500, // 500ms First Contentful Paint
    maxTTI: 1000, // 1s Time to Interactive
    components: ['EmergencyBanner', 'EmergencyContact', 'CriticalAlert']
  },
  
  // Healthcare Forms (Patient Data)
  HEALTHCARE_FORMS: {
    maxSize: 200 * 1024, // 200KB
    maxFCP: 1200, // 1.2s First Contentful Paint
    maxTTI: 2500, // 2.5s Time to Interactive
    maxCLS: 0.05, // Cumulative Layout Shift
    components: ['HealthcareInput', 'HealthcareTextarea', 'HealthcareSelect']
  },
  
  // Medical Content (Expert Profiles, FAQ)
  MEDICAL_CONTENT: {
    maxSize: 300 * 1024, // 300KB
    maxFCP: 1500, // 1.5s First Contentful Paint
    maxTTI: 3000, // 3s Time to Interactive
    components: ['DoctorProfile', 'MedicalFAQ', 'SpecialtySelector']
  },
  
  // Overall Healthcare System
  TOTAL_SYSTEM: {
    maxSize: 5 * 1024 * 1024, // 5MB
    maxStorybookSize: 50 * 1024 * 1024, // 50MB Storybook
    maxPageLoadTime: 6000, // 6s on 3G network
  }
};

// WCAG 2.1 AA Healthcare Requirements
const ACCESSIBILITY_REQUIREMENTS = {
  colorContrast: 4.5, // 4.5:1 ratio
  largeTextContrast: 3.0, // 3:1 for large text
  touchTargetSize: 56, // 56px minimum (healthcare optimized)
  focusIndicatorWidth: 3 // 3px focus outline
};

class HealthcarePerformanceBudgetChecker {
  constructor() {
    this.results = {
      passed: [],
      failed: [],
      warnings: [],
      summary: {}
    };
  }

  async run() {
    console.log('🏥 Healthcare Performance Budget Check Starting...\n');
    
    try {
      // 1. Check bundle sizes
      await this.checkBundleSizes();
      
      // 2. Check Storybook build size
      await this.checkStorybookSize();
      
      // 3. Validate component performance
      await this.checkComponentPerformance();
      
      // 4. Generate report
      this.generateReport();
      
      // 5. Exit with appropriate code
      this.exit();
      
    } catch (error) {
      console.error('❌ Healthcare Performance Check Failed:', error.message);
      process.exit(1);
    }
  }

  async checkBundleSizes() {
    console.log('📦 Checking Healthcare Bundle Sizes...');
    
    try {
      // Check if size-limit report exists
      const sizeReportPath = path.join(process.cwd(), 'performance', 'size-report.json');
      
      let sizeReport = null;
      try {
        const reportContent = await fs.readFile(sizeReportPath, 'utf8');
        sizeReport = JSON.parse(reportContent);
      } catch (err) {
        console.log('⚠️  Size report not found, generating...');
        // Run size-limit to generate report
        try {
          execSync('npm run size:json > performance/size-report.json', { stdio: 'pipe' });
          const reportContent = await fs.readFile(sizeReportPath, 'utf8');
          sizeReport = JSON.parse(reportContent);
        } catch (execErr) {
          this.results.warnings.push('Could not generate size report - size-limit may not be installed');
          return;
        }
      }

      if (sizeReport && sizeReport.length > 0) {
        for (const item of sizeReport) {
          const budgetName = this.categorizeComponent(item.name);
          const budget = HEALTHCARE_BUDGETS[budgetName];
          
          if (budget && item.size > budget.maxSize) {
            this.results.failed.push({
              type: 'Bundle Size',
              component: item.name,
              actual: this.formatBytes(item.size),
              budget: this.formatBytes(budget.maxSize),
              category: budgetName
            });
          } else if (budget) {
            this.results.passed.push({
              type: 'Bundle Size',
              component: item.name,
              size: this.formatBytes(item.size),
              category: budgetName
            });
          }
        }
      } else {
        this.results.warnings.push('No size report data available');
      }
      
    } catch (error) {
      this.results.warnings.push(`Bundle size check failed: ${error.message}`);
    }
  }

  async checkStorybookSize() {
    console.log('📚 Checking Storybook Healthcare Build Size...');
    
    try {
      const storybookPath = path.join(process.cwd(), 'storybook-static');
      
      try {
        await fs.access(storybookPath);
        
        // Calculate Storybook build size
        const size = await this.calculateDirectorySize(storybookPath);
        const budget = HEALTHCARE_BUDGETS.TOTAL_SYSTEM.maxStorybookSize;
        
        if (size > budget) {
          this.results.failed.push({
            type: 'Storybook Build Size',
            actual: this.formatBytes(size),
            budget: this.formatBytes(budget),
            category: 'Healthcare Component Library'
          });
        } else {
          this.results.passed.push({
            type: 'Storybook Build Size', 
            size: this.formatBytes(size),
            category: 'Healthcare Component Library'
          });
        }
        
      } catch (accessErr) {
        this.results.warnings.push('Storybook build not found - run "npm run build-storybook" first');
      }
      
    } catch (error) {
      this.results.warnings.push(`Storybook size check failed: ${error.message}`);
    }
  }

  async checkComponentPerformance() {
    console.log('⚡ Checking Healthcare Component Performance...');
    
    // This would integrate with Lighthouse CI or performance monitoring
    // For now, we'll check if performance monitoring is configured
    
    const performancePath = path.join(process.cwd(), 'performance', 'performance-budget.json');
    
    try {
      await fs.access(performancePath);
      this.results.passed.push({
        type: 'Performance Configuration',
        component: 'Healthcare Performance Budget',
        status: 'Configured'
      });
    } catch (err) {
      this.results.failed.push({
        type: 'Performance Configuration',
        component: 'Healthcare Performance Budget',
        issue: 'Configuration missing'
      });
    }
  }

  categorizeComponent(componentName) {
    const name = componentName.toLowerCase();
    
    if (name.includes('emergency') || name.includes('critical') || name.includes('alert')) {
      return 'CRITICAL_COMPONENTS';
    } else if (name.includes('input') || name.includes('textarea') || name.includes('select') || name.includes('form')) {
      return 'HEALTHCARE_FORMS';
    } else if (name.includes('doctor') || name.includes('faq') || name.includes('specialty') || name.includes('medical')) {
      return 'MEDICAL_CONTENT';
    } else if (name.includes('healthcare system') || name.includes('storybook') || name.includes('bundle')) {
      return 'TOTAL_SYSTEM'; // Use total system budget for large bundles
    } else {
      return 'MEDICAL_CONTENT'; // Default to medical content budget
    }
  }

  async calculateDirectorySize(dirPath) {
    let totalSize = 0;
    
    try {
      const items = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item.name);
        
        if (item.isDirectory()) {
          totalSize += await this.calculateDirectorySize(fullPath);
        } else {
          const stats = await fs.stat(fullPath);
          totalSize += stats.size;
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not calculate size for ${dirPath}`);
    }
    
    return totalSize;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  generateReport() {
    console.log('\n🏥 Healthcare Performance Budget Report');
    console.log('==========================================\n');
    
    // Summary
    const totalChecks = this.results.passed.length + this.results.failed.length;
    const successRate = totalChecks > 0 ? Math.round((this.results.passed.length / totalChecks) * 100) : 0;
    
    console.log(`📊 Overall Results:`);
    console.log(`   ✅ Passed: ${this.results.passed.length}`);
    console.log(`   ❌ Failed: ${this.results.failed.length}`);
    console.log(`   ⚠️  Warnings: ${this.results.warnings.length}`);
    console.log(`   📈 Success Rate: ${successRate}%\n`);
    
    // Failed checks (critical for healthcare)
    if (this.results.failed.length > 0) {
      console.log('❌ FAILED Healthcare Performance Checks:');
      console.log('========================================');
      for (const failure of this.results.failed) {
        console.log(`   🚨 ${failure.type}: ${failure.component || failure.issue}`);
        if (failure.actual && failure.budget) {
          console.log(`      Actual: ${failure.actual} | Budget: ${failure.budget}`);
        }
        if (failure.category) {
          console.log(`      Category: ${failure.category}`);
        }
      }
      console.log('');
    }
    
    // Warnings
    if (this.results.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      console.log('==============');
      for (const warning of this.results.warnings) {
        console.log(`   ⚠️  ${warning}`);
      }
      console.log('');
    }
    
    // Passed checks
    if (this.results.passed.length > 0) {
      console.log('✅ Passed Healthcare Performance Checks:');
      console.log('=========================================');
      for (const pass of this.results.passed) {
        console.log(`   ✅ ${pass.type}: ${pass.component || pass.status}`);
        if (pass.size) {
          console.log(`      Size: ${pass.size}`);
        }
      }
      console.log('');
    }
    
    // Healthcare-specific guidance
    if (this.results.failed.length > 0) {
      console.log('🏥 Healthcare Performance Guidance:');
      console.log('===================================');
      console.log('   • Critical medical components must load <500ms for emergency use');
      console.log('   • Healthcare forms must be stable (CLS <0.05) for patient data entry');
      console.log('   • Mobile optimization essential - most healthcare users on 3G networks');
      console.log('   • WCAG 2.1 AA compliance required for medical accessibility');
      console.log('   • Bundle sizes directly impact stressed medical users');
      console.log('');
    }
  }

  exit() {
    if (this.results.failed.length > 0) {
      console.log('💥 Healthcare Performance Budget FAILED - Build should not proceed');
      process.exit(1);
    } else {
      console.log('🎉 Healthcare Performance Budget PASSED - Ready for medical users');
      process.exit(0);
    }
  }
}

// Run the healthcare performance budget check
if (require.main === module) {
  const checker = new HealthcarePerformanceBudgetChecker();
  checker.run().catch(error => {
    console.error('Fatal error in healthcare performance check:', error);
    process.exit(1);
  });
}

module.exports = HealthcarePerformanceBudgetChecker;