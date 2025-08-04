import Image from 'next/image'
import { Quote } from 'lucide-react'
import type { StorySection as StorySectionType } from '@/types/strapi'

export default function StorySection({
  heading,
  content,
  image,
  imagePosition = 'left',
  hasQuote = false,
  quote,
  quoteAuthor,
  highlightBoxes = []
}: StorySectionType) {
  const isImageLeft = imagePosition === 'left'
  
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
            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold text-healthcare-primary leading-tight">
              {heading}
            </h2>

            {/* Main Content */}
            <div 
              className="prose prose-lg max-w-none text-healthcare-text-muted leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Quote Section */}
            {hasQuote && quote && (
              <div className="relative bg-healthcare-primary/5 rounded-xl p-6 border-l-4 border-healthcare-accent-green">
                <Quote className="absolute top-4 left-4 w-6 h-6 text-healthcare-accent-green/60" />
                <blockquote className="pl-8 text-lg italic text-healthcare-primary font-medium leading-relaxed">
                  "{quote}"
                </blockquote>
                {quoteAuthor && (
                  <cite className="block mt-4 pl-8 text-sm text-healthcare-text-muted font-medium">
                    — {quoteAuthor}
                  </cite>
                )}
              </div>
            )}

            {/* Highlight Boxes */}
            {highlightBoxes.length > 0 && (
              <div className="space-y-4">
                {highlightBoxes.map((box) => (
                  <div 
                    key={box.id}
                    className="bg-red-50 border border-red-200 rounded-lg p-4"
                    style={{
                      backgroundColor: box.backgroundColor || '#fef2f2',
                      color: box.textColor || '#dc2626'
                    }}
                  >
                    <div 
                      className="text-sm font-medium leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: box.content }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </section>
  )
}