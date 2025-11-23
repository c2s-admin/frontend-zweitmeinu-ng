export default function DatenschutzLoading() {
  return (
    <div className="min-h-screen bg-healthcare-background">
      {/* Emergency Contact Banner */}
      <div className="bg-healthcare-primary text-white text-center py-3 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm">
            <span className="font-medium">Medizinischer Notfall?</span>
            <span className="mx-2">|</span>
            <a
              href="tel:112"
              className="hover:underline focus:underline focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-healthcare-primary rounded px-1"
              aria-label="Notruf wählen 112"
            >
              📞 Notruf: 112
            </a>
            <span className="mx-2">|</span>
            <a
              href="tel:116117"
              className="hover:underline focus:underline focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-healthcare-primary rounded px-1"
              aria-label="Ärztlicher Bereitschaftsdienst 116117"
            >
              📞 Ärztlicher Bereitschaftsdienst: 116 117
            </a>
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Content Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm p-12">
          <div className="flex flex-col items-center justify-center">
            {/* Spinner */}
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-healthcare-primary-light border-t-transparent rounded-full animate-spin" />
            </div>

            {/* Loading Text */}
            <p className="text-lg text-healthcare-primary font-medium mb-2">
              Datenschutzerklärung wird geladen...
            </p>
            <p className="text-sm text-gray-600">
              Einen Moment bitte
            </p>

            {/* Skeleton Lines */}
            <div className="mt-8 w-full max-w-md space-y-3 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>

        {/* Footer Info Skeleton */}
        <div className="mt-8 p-6 bg-healthcare-background rounded-2xl border border-gray-200 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-14 bg-gray-200 rounded"></div>
            <div className="h-14 bg-gray-200 rounded"></div>
            <div className="h-14 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
