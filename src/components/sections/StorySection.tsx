import Image from 'next/image'
import { Quote } from 'lucide-react'

// Interface that matches actual Strapi data structure
interface StorySectionProps {
  id: number
  __component: 'sections.story-section'
  heading: string
  content: string
  image?: {
    data: {
      attributes: {
        url: string
        alternativeText?: string
        width?: number
        height?: number
      }
    }
  }
  imagePosition: 'left' | 'right'
  quote?: string
  quotePosition?: 'above' | 'below'
  quoteHighlight?: boolean
  attribution?: string
  imageAlt?: string
  sectionTitle?: string
  description?: string
}

export default function StorySection({
  heading,
  content,
  image,
  imagePosition = 'left',
  quote,
  quotePosition = 'below',
  quoteHighlight = false,
  attribution,
}: StorySectionProps) {
  const isImageLeft = imagePosition === 'left'
  
  // Helper function to render quote
  const renderQuote = () => {
    if (!quote) return null
    
    const quoteElement = (
      <div className={`relative ${quoteHighlight ? 'bg-healthcare-primary/5' : 'bg-gray-50'} rounded-xl p-6 border-l-4 ${quoteHighlight ? 'border-healthcare-accent-green' : 'border-gray-300'}`}>
        <Quote className={`absolute top-4 left-4 w-6 h-6 ${quoteHighlight ? 'text-healthcare-accent-green/60' : 'text-gray-400'}`} />
        <blockquote className={`pl-8 text-lg italic ${quoteHighlight ? 'text-healthcare-primary font-medium' : 'text-gray-700'} leading-relaxed`}>
          "{quote}"
        </blockquote>
        {attribution && (
          <cite className="block mt-4 pl-8 text-sm text-healthcare-text-muted font-medium">
            {attribution}
          </cite>
        )}
      </div>
    )
    
    return quoteElement
  }
  
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${isImageLeft ? '' : 'lg:grid-flow-dense'}`}>
          
          {/* Image Column */}
          <div className={`${isImageLeft ? 'lg:order-1' : 'lg:order-2'} relative`}>
            {image?.data && (
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={image.data.attributes.url}
                  alt={image.data.attributes.alternativeText || heading}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Healthcare Accent Border */}
                <div className="absolute inset-0 border-4 border-healthcare-accent-green/20 rounded-2xl" />
              </div>
            )}
            
            {/* Decorative Element */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-healthcare-accent-green/10 rounded-full -z-10" />
          </div>

          {/* Content Column */}
          <div className={`${isImageLeft ? 'lg:order-2' : 'lg:order-1'} space-y-6`}>
            
            {/* Quote Above (if positioned above) */}
            {quote && quotePosition === 'above' && renderQuote()}
            
            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold text-healthcare-primary leading-tight">
              {heading}
            </h2>

            {/* Main Content */}
            <div 
              className="prose prose-lg max-w-none text-healthcare-text-muted leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Quote Below (if positioned below or default) */}
            {quote && quotePosition === 'below' && renderQuote()}
            
          </div>
          
        </div>
      </div>
    </section>
  )
}