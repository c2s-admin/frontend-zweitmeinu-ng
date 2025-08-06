import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Healthcare/Accessibility Tests',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Accessibility validation stories for healthcare components. Use the A11y tab to run automated accessibility tests.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'focus-order-semantics',
            enabled: true,
          },
          {
            id: 'interactive-controls-name',
            enabled: true,
          },
        ],
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ContrastCompliant: Story = {
  args: {
    primary: true,
    label: 'WCAG AA Compliant Button',
  },
  parameters: {
    docs: {
      description: {
        story: 'This button meets WCAG 2.1 AA contrast requirements (4.5:1 ratio). Check the A11y tab for automated validation.',
      },
    },
  },
};

export const LargeTargetSize: Story = {
  args: {
    size: 'large',
    primary: true,
    label: 'Healthcare Touch Target',
  },
  parameters: {
    docs: {
      description: {
        story: 'Large button (64px) exceeds WCAG 2.1 AA minimum touch target size (44px) for healthcare accessibility.',
      },
    },
  },
};

export const WithProperARIA: Story = {
  args: {
    primary: true,
    label: 'Zweitmeinung anfordern',
    'aria-label': 'Jetzt kostenlose medizinische Zweitmeinung anfordern',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with descriptive ARIA label for screen readers. The A11y addon will validate proper labeling.',
      },
    },
  },
};

export const FocusIndicatorTest: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column', alignItems: 'center' }}>
      <p style={{ marginBottom: '16px', textAlign: 'center', maxWidth: '400px' }}>
        <strong>Focus Test:</strong> Use Tab key to navigate between buttons. 
        Each should show a clear focus indicator with 3px solid outline.
      </p>
      <Button primary label="First Button" />
      <Button label="Second Button" />
      <Button size="large" primary label="Large Button" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple buttons for focus indicator testing. All buttons should have visible 3px solid focus outlines.',
      },
    },
  },
};