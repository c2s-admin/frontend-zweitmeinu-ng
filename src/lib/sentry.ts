import * as Sentry from "@sentry/nextjs";
import React from "react";

// Healthcare Error Boundary Component (Sentry is initialized via sentry.client/server.config.ts)
export function HealthcareErrorBoundary({ children, fallback, onError }: { 
  children: React.ReactNode;
  fallback?: Sentry.FallbackRender | React.ReactElement;
  onError?: (error: Error, componentStack: string) => void;
}) {
  const fb = fallback || HealthcareErrorFallback;
  
  return React.createElement(
    Sentry.ErrorBoundary,
    {
      fallback: fb as Sentry.FallbackRender,
      beforeCapture: (scope, error: unknown, componentStack: string) => {
        scope.setTag('error_boundary', true);
        scope.setTag('component_crash', true);
        
        // Call custom error handler if provided
        if (onError && error instanceof Error) {
          onError(error, componentStack)
        }
      }
    },
    children
  );
}

// Healthcare Error Fallback UI
const HealthcareErrorFallback: Sentry.FallbackRender = ({ error: _error, componentStack: _componentStack, resetError }) => {
  return React.createElement(
    'div',
    { className: 'min-h-screen bg-healthcare-background flex items-center justify-center p-6' },
    React.createElement(
      'div',
      { className: 'bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg' },
      React.createElement(
        'div',
        { className: 'w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4' },
        React.createElement('span', { className: 'text-2xl' }, '⚠️')
      ),
      React.createElement(
        'h2',
        { className: 'text-xl font-semibold text-healthcare-primary mb-3' },
        'Technischer Fehler aufgetreten'
      ),
      React.createElement(
        'p',
        { className: 'text-healthcare-text-muted mb-6' },
        'Ein unerwarteter Fehler ist aufgetreten. Ihre medizinischen Daten sind sicher. Bitte versuchen Sie es erneut oder kontaktieren Sie unseren Support.'
      ),
      React.createElement(
        'div',
        { className: 'space-y-3' },
        React.createElement(
          'button',
          {
            onClick: resetError,
            className: 'w-full bg-healthcare-primary-light hover:bg-healthcare-primary text-white py-3 px-6 rounded-xl font-medium transition-colors'
          },
          'Erneut versuchen'
        ),
        React.createElement(
          'div',
          { className: 'text-sm text-healthcare-text-muted' },
          React.createElement('p', { className: 'mb-2' }, 'Bei kritischen medizinischen Fragen:'),
          React.createElement(
            'a',
            {
              href: 'tel:+4980080441100',
              className: 'text-red-600 font-semibold hover:underline'
            },
            '📞 Notfall-Hotline: +49 800 80 44 100'
          )
        )
      )
    )
  );
}

// Export enhanced Sentry with healthcare tracking
export { 
  Sentry
};
