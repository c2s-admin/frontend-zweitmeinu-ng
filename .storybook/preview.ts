import type { Preview } from '@storybook/nextjs'
import '../src/styles/tokens.css';
import '../src/app/globals.css';

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
      ],
    },
  },
};

export default preview;