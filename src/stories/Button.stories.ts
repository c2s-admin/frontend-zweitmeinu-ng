import type { Meta, StoryObj } from '@storybook/react';
// import { fn } from '@storybook/test';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Healthcare/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Healthcare-optimized button component following WCAG 2.1 AA standards with 56px touch targets and accessible focus indicators. Designed specifically for medical platforms where trust and accessibility are paramount.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: 'boolean',
    },
  },
  // args: { onClick: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Jetzt Zweitmeinung anfordern',
  },
  parameters: {
    docs: {
      description: {
        story: 'Primary button for main call-to-action elements. Uses healthcare-primary-light color (#1278B3) with proper hover states.',
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    label: 'Mehr erfahren',
  },
  parameters: {
    docs: {
      description: {
        story: 'Secondary button for less important actions. Uses outline style with healthcare colors.',
      },
    },
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    primary: true,
    label: 'Kostenlose Beratung starten',
  },
  parameters: {
    docs: {
      description: {
        story: 'Large button (64px min-height) for hero sections and key conversion points.',
      },
    },
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Details',
  },
  parameters: {
    docs: {
      description: {
        story: 'Small button (44px min-height) meets WCAG 2.1 AA minimum touch target requirements.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    primary: true,
    disabled: true,
    label: 'Button disabled',
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state with reduced opacity and no hover effects.',
      },
    },
  },
};

export const WithCustomColor: Story = {
  args: {
    primary: true,
    backgroundColor: '#B3AF09', // healthcare-accent-green
    label: 'Success Action',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with custom healthcare accent green color for success states.',
      },
    },
  },
};