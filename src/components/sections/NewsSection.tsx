import type { NewsSection as NewsSectionType } from '@/types/strapi'

export default function NewsSection({
  title,
  subtitle,
  articles = [],
  showMore = false,
  moreButtonText = 'Alle News anzeigen',
  moreButtonHref = '/news'
}: NewsSectionType) {
  return (
    <section className="section-padding bg-healthcare-background">
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
          {articles.map((article) => (
            <article key={article.id} className="card group hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-healthcare-primary mb-4 group-hover:text-healthcare-primary-light transition-colors">
                {article.attributes.title}
              </h3>

              {article.attributes.excerpt && (
                <p className="text-healthcare-text-muted mb-4">
                  {article.attributes.excerpt}
                </p>
              )}

              <div className="text-sm text-healthcare-text-muted">
                {new Date(article.attributes.publishedAt).toLocaleDateString('de-DE')}
              </div>
            </article>
          ))}
        </div>

        {showMore && (
          <div className="text-center mt-12">
            <a href={moreButtonHref} className="btn-primary">
              {moreButtonText}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
