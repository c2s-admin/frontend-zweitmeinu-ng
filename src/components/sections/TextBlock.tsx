import type { TextBlock as TextBlockType } from '@/types/strapi'

export default function TextBlock({
  title,
  content,
  alignment = 'left',
  backgroundColor,
  textColor
}: TextBlockType) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  return (
    <section
      className="section-padding"
      style={{
        backgroundColor: backgroundColor || 'transparent',
        color: textColor || 'inherit'
      }}
    >
      <div className="container-custom">
        <div className={`max-w-4xl ${alignment === 'center' ? 'mx-auto' : ''} ${alignmentClasses[alignment]}`}>
          {title && (
            <h2 className="mb-8 text-healthcare-primary">
              {title}
            </h2>
          )}

          <div
            className="prose prose-lg max-w-none text-healthcare-text-muted"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </section>
  )
}
