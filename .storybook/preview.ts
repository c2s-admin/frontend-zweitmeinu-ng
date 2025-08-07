import type { Preview } from '@storybook/nextjs'
import React from 'react';
import '../src/styles/tokens.css';
import '../src/app/globals.css';
import '../src/styles/accessibility.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    docs: {
      toc: true, // Enable table of contents
    },
    backgrounds: {
      default: 'healthcare-light',
      values: [
        {
          name: 'healthcare-light',
          value: '#ffffff',
        },
        {
          name: 'healthcare-background',
          value: '#f8fafc',
        },
        {
          name: 'healthcare-primary',
          value: '#004166',
        },
        {
          name: 'high-contrast',
          value: '#ffffff',
        },
      ],
    },
  },
  globalTypes: {
    accessibilityMode: {
      description: 'Healthcare Accessibility Mode',
      defaultValue: 'normal',
      toolbar: {
        title: 'Accessibility',
        icon: 'accessibility',
        items: [
          { value: 'normal', title: 'Normal Mode', right: '👁️' },
          { value: 'wcag-aa', title: 'WCAG AA Compliant', right: '♿' },
          { value: 'high-contrast', title: 'High Contrast', right: '⚫' },
          { value: 'reduced-motion', title: 'Reduced Motion', right: '🛑' },
          { value: 'large-text', title: 'Large Text', right: '🔍' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const accessibilityMode = context.globals.accessibilityMode || 'normal';
      
      // Apply CSS classes based on accessibility mode  
      const getAccessibilityClasses = (mode: string) => {
        switch (mode) {
          case 'wcag-aa':
            return 'healthcare-enhanced-focus';
          case 'high-contrast':
            return 'high-contrast healthcare-enhanced-focus';
          case 'reduced-motion':
            return 'reduced-motion';
          case 'large-text':
            return 'text-large healthcare-enhanced-focus';
          default:
            return '';
        }
      };

      const accessibilityClasses = getAccessibilityClasses(accessibilityMode);
      
      return React.createElement('div', 
        { className: accessibilityClasses },
        React.createElement(Story)
      );
    },
  ],
};

export default preview;