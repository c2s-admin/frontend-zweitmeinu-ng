'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FAQSection as FAQSectionType } from '@/types/strapi'

export default function FAQSection({
  title,
  subtitle,
  faqs = []
}: FAQSectionType) {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (id: number) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

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

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq) => {
            const isOpen = openItems.includes(faq.id)

            return (
              <div key={faq.id} className="border border-healthcare-border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-4 text-left bg-healthcare-background hover:bg-healthcare-primary hover:text-white transition-colors duration-300 flex items-center justify-between"
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 transition-transform duration-300",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 py-4 bg-white border-t border-healthcare-border">
                    <p className="text-healthcare-text-muted">{faq.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
