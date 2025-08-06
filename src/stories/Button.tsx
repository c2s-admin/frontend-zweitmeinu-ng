import './Button.css';

export interface ButtonProps {
  /** Is this the primary action button? */
  primary?: boolean;
  /** What background color to use (optional override) */
  backgroundColor?: string;
  /** How large should the button be? */
  size?: 'small' | 'medium' | 'large';
  /** Button contents */
  label: string;
  /** Optional click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** ARIA label for accessibility */
  'aria-label'?: string;
}

/** 
 * Healthcare Button component optimized for medical platforms
 * - WCAG 2.1 AA compliant with proper contrast ratios
 * - Touch-optimized with minimum 56px targets for healthcare use
 * - Supports reduced motion and high contrast preferences
 */
export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  disabled = false,
  ...props
}: ButtonProps) => {
  const mode = primary ? 'healthcare-button--primary' : 'healthcare-button--secondary';
  
  return (
    <button
      type="button"
      className={['healthcare-button', `healthcare-button--${size}`, mode].join(' ')}
      disabled={disabled}
      style={backgroundColor ? { backgroundColor } : {}}
      aria-label={props['aria-label'] || label}
      {...props}
    >
      {label}
    </button>
  );
};