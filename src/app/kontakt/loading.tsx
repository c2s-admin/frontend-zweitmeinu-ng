import { Loader2 } from 'lucide-react'

export default function KontaktLoading() {
  return (
    <div className="min-h-screen bg-healthcare-background">
      {/* Emergency Banner (static) */}
      <div className="bg-healthcare-primary text-white text-center py-3 px-4 text-sm md:text-base">
        <p className="font-medium">
          🚨 Medizinischer Notfall? Notruf: 112 | Ärztlicher Bereitschaftsdienst: 116 117
        </p>
      </div>

      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-br from-healthcare-primary via-healthcare-primary-light to-healthcare-primary py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-white/20 rounded-lg w-3/4 mx-auto"></div>
            <div className="h-6 bg-white/10 rounded-lg w-2/3 mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>

              <div className="bg-healthcare-background rounded-2xl p-6 border border-gray-200 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>

            {/* Form Skeleton */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200">
                <div className="animate-pulse space-y-6">
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-8"></div>
                  <div className="h-12 bg-gray-200 rounded w-full"></div>
                  <div className="h-12 bg-gray-200 rounded w-full"></div>
                  <div className="h-24 bg-gray-200 rounded w-full"></div>
                  <div className="h-12 bg-gray-200 rounded w-full"></div>
                </div>

                {/* Loading Indicator */}
                <div className="mt-12 flex flex-col items-center justify-center text-healthcare-primary">
                  <Loader2 className="w-12 h-12 animate-spin mb-4" />
                  <p className="text-lg font-medium">Kontaktformular wird geladen...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
