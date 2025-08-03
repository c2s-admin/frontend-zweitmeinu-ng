import type { TestimonialsSection as TestimonialsSectionType } from '@/types/strapi'

export default function Testimonials({
  title,
  subtitle,
  testimonials = [],
  layout = 'grid'
}: TestimonialsSectionType) {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <h2 className="text-healthcare-primary mb-6">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xl text-healthcare-text-muted max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="card">
              <div className="mb-4">
                {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>

              <blockquote className="text-healthcare-text-muted mb-6">
                "{testimonial.content}"
              </blockquote>

              <div className="flex items-center">
                <div>
                  <div className="font-semibold text-healthcare-primary">
                    {testimonial.author.name}
                  </div>
                  {testimonial.author.title && (
                    <div className="text-sm text-healthcare-text-muted">
                      {testimonial.author.title}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
