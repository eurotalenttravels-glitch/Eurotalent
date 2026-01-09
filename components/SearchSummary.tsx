'use client'

interface SearchSummaryProps {
  origin: string
  destination: string
  originCity?: string
  destinationCity?: string
  departureDate: string
  adults: number
  cabinClass: string
}

export default function SearchSummary({
  origin,
  destination,
  originCity,
  destinationCity,
  departureDate,
  adults,
  cabinClass
}: SearchSummaryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${date.getDate()} ${months[date.getMonth()]}, ${days[date.getDay()]}`
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm py-5 border-b border-gray-200/50">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-5 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xl">✈️</span>
              <span className="font-medium text-[#1d1d1f] text-sm tracking-tight">Available Flights</span>
            </div>
            <div className="text-xs text-gray-500">Price includes VAT & Tax</div>
          </div>

          <div className="flex items-center gap-5 text-xs flex-wrap">
            <div className="text-gray-600">
              <span className="text-gray-500">Route: </span>
              <span className="font-medium text-[#1d1d1f]">{origin}</span>
              <span className="mx-1.5 text-gray-400">→</span>
              <span className="font-medium text-[#1d1d1f]">{destination}</span>
            </div>
            <div className="text-gray-600">
              <span className="text-gray-500">Departure: </span>
              <span className="font-medium text-[#1d1d1f]">{formatDate(departureDate)}</span>
            </div>
            <div className="text-gray-600">
              <span className="text-gray-500">Passengers: </span>
              <span className="font-medium text-[#1d1d1f]">{adults}</span>
            </div>
            <div className="text-gray-600">
              <span className="text-gray-500">Class: </span>
              <span className="font-medium text-[#1d1d1f]">{cabinClass}</span>
            </div>
            <button className="bg-[#007aff] text-white px-5 py-2 rounded-full text-xs font-medium hover:bg-[#0051d5] active:scale-95 transition-all shadow-apple-sm">
              Modify Search
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


