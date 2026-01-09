'use client'

interface Airline {
  code: string
  name: string
  price: number
}

interface AirlineFilterProps {
  airlines: Airline[]
  selectedAirline: string
  onSelectAirline: (code: string) => void
}

export default function AirlineFilter({ airlines, selectedAirline, onSelectAirline }: AirlineFilterProps) {
  return (
    <div className="bg-white rounded-2xl shadow-apple p-4 mb-6 overflow-hidden">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {airlines.map((airline) => (
          <button
            key={airline.code}
            onClick={() => onSelectAirline(airline.code)}
            className={`flex-shrink-0 px-5 py-3 rounded-xl whitespace-nowrap transition-all active:scale-95 ${
              selectedAirline === airline.code
                ? 'bg-[#007aff] text-white shadow-apple-sm'
                : 'bg-gray-50 text-[#1d1d1f] hover:bg-gray-100 border border-gray-200/50'
            }`}
          >
            <div className="font-medium text-xs mb-0.5">{airline.name}</div>
            <div className={`text-xs mb-1 ${selectedAirline === airline.code ? 'text-white/80' : 'text-gray-500'}`}>({airline.code})</div>
            <div className={`text-sm font-semibold ${selectedAirline === airline.code ? 'text-white' : 'text-[#1d1d1f]'}`}>€ {airline.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

