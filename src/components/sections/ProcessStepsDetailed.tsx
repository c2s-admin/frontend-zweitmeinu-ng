import React from 'react'
import { CheckCircle, ArrowRight } from 'lucide-react'

interface ProcessStep {
  id: number
  stepNumber: number
  title: string
  description: string
  details?: string
  icon?: string
  estimatedTime?: string
  requirements?: string[]
}

interface ProcessStepsDetailedProps {
  id: number
  __component: 'sections.process-steps-detailed'
  title?: string
  subtitle?: string
  description?: string
  steps: ProcessStep[]
  layout?: 'vertical' | 'horizontal' | 'grid'
  showTimeline?: boolean
  backgroundColor?: string
}

export default function ProcessStepsDetailed({
  title,
  subtitle,
  description,
  steps = [],
  layout = 'vertical',
  showTimeline = true,
  backgroundColor = 'bg-gray-50',
}: ProcessStepsDetailedProps) {
  const layoutClasses = {
    vertical: 'flex flex-col space-y-8',
    horizontal: 'flex flex-row overflow-x-auto space-x-6 pb-4',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
  }

  return (
    <section className={`py-16 lg:py-24 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {(title || subtitle || description) && (
          <div className="text-center mb-12 max-w-3xl mx-auto">
            {title && (
              <h2 className="text-3xl lg:text-4xl font-bold text-healthcare-primary mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xl text-gray-600 mb-4">{subtitle}</p>
            )}
            {description && (
              <p className="text-gray-600">{description}</p>
            )}
          </div>
        )}

        {/* Steps */}
        <div className={`relative ${layoutClasses[layout]}`}>
          {/* Timeline Line */}
          {showTimeline && layout === 'vertical' && (
            <div
              className="absolute left-8 top-0 bottom-0 w-0.5 bg-healthcare-primary/20 hidden lg:block"
              aria-hidden="true"
            />
          )}

          {steps.map((step, index) => (
            <div
              key={step.id || index}
              className={`relative ${
                layout === 'vertical' ? 'pl-0 lg:pl-24' : ''
              }`}
            >
              {/* Step Number Badge */}
              <div
                className={`${
                  layout === 'vertical'
                    ? 'absolute left-6 top-0 hidden lg:flex'
                    : 'inline-flex mb-4'
                } w-16 h-16 rounded-full bg-healthcare-primary-light text-white items-center justify-center text-2xl font-bold shadow-lg z-10`}
              >
                {step.stepNumber || index + 1}
              </div>

              {/* Step Card */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border-2 border-transparent hover:border-healthcare-primary-light">
                {/* Icon */}
                {step.icon && (
                  <div className="text-4xl mb-4" aria-hidden="true">
                    {step.icon}
                  </div>
                )}

                {/* Title & Time */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-healthcare-primary flex-1">
                    {step.title}
                  </h3>
                  {step.estimatedTime && (
                    <span className="ml-4 px-3 py-1 bg-healthcare-accent-green/10 text-healthcare-primary text-sm font-medium rounded-full whitespace-nowrap">
                      ⏱️ {step.estimatedTime}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-700 text-lg mb-4">{step.description}</p>

                {/* Details */}
                {step.details && (
                  <p className="text-gray-600 mb-6">{step.details}</p>
                )}

                {/* Requirements */}
                {step.requirements && step.requirements.length > 0 && (
                  <div className="bg-healthcare-background rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-healthcare-primary mb-3 flex items-center">
                      <CheckCircle
                        className="w-4 h-4 mr-2"
                        aria-hidden="true"
                      />
                      Benötigt:
                    </h4>
                    <ul className="space-y-2">
                      {step.requirements.map((req, idx) => (
                        <li
                          key={idx}
                          className="text-gray-700 flex items-start"
                        >
                          <span
                            className="text-healthcare-primary mr-2"
                            aria-hidden="true"
                          >
                            •
                          </span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Arrow between steps (vertical layout only) */}
              {layout === 'vertical' &&
                showTimeline &&
                index < steps.length - 1 && (
                  <div className="flex justify-center my-6 lg:ml-24">
                    <ArrowRight
                      className="w-8 h-8 text-healthcare-primary rotate-90 lg:rotate-0"
                      aria-hidden="true"
                    />
                  </div>
                )}
            </div>
          ))}
        </div>

        {/* Summary */}
        {steps.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-600 text-lg">
              Insgesamt <span className="font-semibold text-healthcare-primary">{steps.length} Schritte</span> zu Ihrer medizinischen Zweitmeinung
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
