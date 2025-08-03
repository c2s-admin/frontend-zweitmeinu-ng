import { notFound } from 'next/navigation'
import {
  getFAQPage,
  getFAQCategories,
  getFAQs
} from '@/lib/strapi/faq'
import { FAQPageWrapper } from '@/components/faq/FAQPageWrapper'

// Metadata for the page
export const metadata = {
  title: 'FAQ - Häufige Fragen | Zweitmeinung.ng',
  description: 'Antworten auf die wichtigsten Fragen zur medizinischen Zweitmeinung. Von Onkologie über Kardiologie bis Intensivmedizin. Jetzt durchsuchen!',
}

// Server Component - handles data fetching
export default async function FAQPage() {
  // Load data from Strapi API on server
  const [faqPage, categories, faqs] = await Promise.all([
    getFAQPage(),
    getFAQCategories(),
    getFAQs(50) // Load more FAQs for better search coverage
  ])

  if (!faqPage) {
    notFound()
  }

  return (
    <FAQPageWrapper
      initialData={{
        faqPage,
        categories,
        faqs
      }}
    />
  )
}

// Generate static params for better performance
export async function generateStaticParams() {
  return [{ slug: 'faq' }]
}
