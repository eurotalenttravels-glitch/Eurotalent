'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect, useMemo, useCallback, Suspense } from 'react'
import Header from '@/components/Header'
import SearchSummary from '@/components/SearchSummary'
import Filters from '@/components/Filters'
import AirlineFilter from '@/components/AirlineFilter'
import FlightCard from '@/components/FlightCard'
import { Flight } from '@/lib/flightApi'
import { getAirlineName } from '@/lib/airlineNames'
import { FilterState } from '@/components/Filters'

interface FlightSegment {
  departure: {
    airport: string
    city: string
    time: string
    date: string
    terminal?: string
    gate?: string
  }
  arrival: {
    airport: string
    city: string
    time: string
    date: string
    terminal?: string
    gate?: string
  }
  carrier: string
  carrierCode: string
  flightNumber: string
  duration: string
  aircraft?: string
  layoverDuration?: string
}

interface FlightCardData {
  airline: string
  flightNumber: string
  departure: {
    city: string
    code: string
    time: string
    date: string
  }
  arrival: {
    city: string
    code: string
    time: string
    date: string
  }
  duration: string
  stops: number
  stopsDetails?: string[]
  distance?: string
  price: number
  baggage: string
  seats: number
  cabinClass: string
  refundable: boolean
  travelers: number
  segments?: FlightSegment[]
}

function formatDuration(duration: string): string {
  // Handle ISO 8601 duration format (PT13H30M) or simple format
  if (duration.startsWith('PT')) {
    const hours = duration.match(/(\d+)H/)?.[1] || '0'
    const minutes = duration.match(/(\d+)M/)?.[1] || '0'
    return `${hours}h: ${minutes}m`
  }
  return duration
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${date.getDate()} ${months[date.getMonth()]}, ${days[date.getDay()]}`
}

function transformFlight(flight: Flight, travelers: number): FlightCardData {
  const firstSegment = flight.segments[0]
  const lastSegment = flight.segments[flight.segments.length - 1]
  const airlineCode = firstSegment.carrierCode || firstSegment.carrier
  const airlineName = getAirlineName(airlineCode) || firstSegment.carrier

  return {
    airline: airlineName,
    flightNumber: firstSegment.flightNumber,
    departure: {
      city: firstSegment.departure.city,
      code: firstSegment.departure.airport,
      time: firstSegment.departure.time,
      date: formatDate(firstSegment.departure.date),
    },
    arrival: {
      city: lastSegment.arrival.city,
      code: lastSegment.arrival.airport,
      time: lastSegment.arrival.time,
      date: formatDate(lastSegment.arrival.date),
    },
    duration: formatDuration(flight.totalDuration),
    stops: flight.stops,
    stopsDetails: flight.stopsDetails,
    price: Math.round(flight.price * 100) / 100, // Keep 2 decimal places
    baggage: flight.baggage,
    seats: 4, // Default, can be enhanced with real data
    cabinClass: flight.cabinClass,
    refundable: flight.refundable,
    travelers: travelers,
    segments: flight.segments.map(seg => ({
      ...seg,
      departure: {
        ...seg.departure,
        date: formatDate(seg.departure.date),
      },
      arrival: {
        ...seg.arrival,
        date: formatDate(seg.arrival.date),
      },
    })),
  }
}

function FlightSearchContent() {
  const searchParams = useSearchParams()
  const [selectedAirline, setSelectedAirline] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'cheapest' | 'fastest'>('cheapest')
  const [timer, setTimer] = useState(900) // 15 minutes in seconds
  const [flights, setFlights] = useState<FlightCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    selectedBaggage: '1',
    refundable: '',
    selectedStops: [],
    priceRange: [0, 1000],
    departureArrival: 'departure',
    selectedTimeSlots: [],
  })

  // Calculate min and max prices from flights
  const priceExtremes = useMemo(() => {
    if (flights.length > 0) {
      const prices = flights.map(f => f.price)
      return {
        min: Math.min(...prices),
        max: Math.max(...prices)
      }
    }
    return { min: 0, max: 1000 }
  }, [flights])
  
  // Calculate price range from flights (memoized to prevent infinite loops)
  const initialPriceRange = useMemo(() => {
    if (flights.length > 0) {
      return [
        Math.max(0, Math.floor(priceExtremes.min - 50)),
        Math.ceil(priceExtremes.max + 100)
      ] as [number, number]
    }
    return [0, 1000] as [number, number]
  }, [priceExtremes.min, priceExtremes.max, flights.length]) // Use stable values


  // Get search parameters
  const origin = searchParams.get('origin') || 'ATQ'
  const destination = searchParams.get('destination') || 'LIS'
  const departureDate = searchParams.get('departuredate') || '2026-01-01'
  const adults = parseInt(searchParams.get('adults') || '1')
  const cabinClass = searchParams.get('class') || 'Economy'

  // Fetch flights from API
  useEffect(() => {
    async function fetchFlights() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({
          origin,
          destination,
          departuredate: departureDate,
          adults: adults.toString(),
          class: cabinClass,
          route: 'oneway',
        })

        const response = await fetch(`/api/flights?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to fetch flights')
        }

        const data = await response.json()
        const transformedFlights = data.flights.map((f: Flight) => transformFlight(f, adults))
        setFlights(transformedFlights)
      } catch (err) {
        setError('Failed to load flights. Please try again.')
        console.error('Error fetching flights:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFlights()
  }, [origin, destination, departureDate, adults, cabinClass])

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins} min : ${secs} sec`
  }

  // Get unique airlines from flights with full names
  const airlines = Array.from(
    new Map(
      flights.map(f => {
        const code = f.flightNumber.split('-')[0]
        return [code, { code, name: f.airline, price: f.price }]
      })
    ).values()
  ).sort((a, b) => a.price - b.price)

  // Filter and sort flights
  let filteredFlights = [...flights]

  // Apply airline filter
  if (selectedAirline !== 'all') {
    filteredFlights = filteredFlights.filter(f => {
      const code = f.flightNumber.split('-')[0]
      return code === selectedAirline || f.airline.toLowerCase().includes(selectedAirline.toLowerCase())
    })
  }

  // Apply refundable filter
  if (filters.refundable) {
    filteredFlights = filteredFlights.filter(f => 
      filters.refundable === 'refundable' ? f.refundable : !f.refundable
    )
  }

  // Apply stops filter
  if (filters.selectedStops.length > 0) {
    filteredFlights = filteredFlights.filter(f => {
      if (filters.selectedStops.includes('Direct')) {
        if (f.stops === 0) return true
      }
      if (filters.selectedStops.includes('1 Stop')) {
        if (f.stops === 1) return true
      }
      if (filters.selectedStops.includes('1+ Stop')) {
        if (f.stops >= 1) return true
      }
      return false
    })
  }

  // Apply price range filter
  filteredFlights = filteredFlights.filter(f => 
    f.price >= filters.priceRange[0] && f.price <= filters.priceRange[1]
  )

  // Apply time slot filter
  if (filters.selectedTimeSlots.length > 0 && filteredFlights.length > 0) {
    filteredFlights = filteredFlights.filter(f => {
      const timeStr = filters.departureArrival === 'departure' ? f.departure.time : f.arrival.time
      const hour = parseInt(timeStr.split(':')[0])
      
      return filters.selectedTimeSlots.some(slot => {
        if (slot === '00-06 AM') return hour >= 0 && hour < 6
        if (slot === '06-12 PM') return hour >= 6 && hour < 12
        if (slot === '12-06 PM') return hour >= 12 && hour < 18
        if (slot === '06-12 AM') return hour >= 18 && hour < 24
        return false
      })
    })
  }

  // Sort flights
  if (sortBy === 'cheapest') {
    filteredFlights.sort((a, b) => a.price - b.price)
  } else {
    // Sort by duration (fastest)
    filteredFlights.sort((a, b) => {
      const aDuration = parseInt(a.duration.replace(/[^\d]/g, ''))
      const bDuration = parseInt(b.duration.replace(/[^\d]/g, ''))
      return aDuration - bDuration
    })
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      <Header />
      
      <SearchSummary
        origin={origin}
        destination={destination}
        originCity=""
        destinationCity=""
        departureDate={departureDate}
        adults={adults}
        cabinClass={cabinClass}
      />

      <div className="container mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1">
            {/* Timer */}
            <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-center border border-gray-100/50 shadow-apple-sm">
              <div className="text-xs text-gray-500 mb-2 font-medium">Session expires in</div>
              <div className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">{formatTimer(timer)}</div>
            </div>

            <Filters 
              onFilterChange={setFilters}
              initialPriceRange={initialPriceRange}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Airline Filter */}
            {airlines.length > 0 && (
              <AirlineFilter
                airlines={airlines}
                selectedAirline={selectedAirline}
                onSelectAirline={setSelectedAirline}
              />
            )}

            {/* Sort and Day Navigation */}
            <div className="bg-white rounded-2xl shadow-apple p-5 mb-6 border border-gray-100/50">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy('cheapest')}
                    className={`px-5 py-2.5 rounded-xl text-xs font-medium transition-all active:scale-95 ${
                      sortBy === 'cheapest'
                        ? 'bg-[#007aff] text-white shadow-apple-sm'
                        : 'bg-gray-50 text-[#1d1d1f] hover:bg-gray-100 border border-gray-200/50'
                    }`}
                  >
                    Cheapest
                  </button>
                  <button
                    onClick={() => setSortBy('fastest')}
                    className={`px-5 py-2.5 rounded-xl text-xs font-medium transition-all active:scale-95 ${
                      sortBy === 'fastest'
                        ? 'bg-[#007aff] text-white shadow-apple-sm'
                        : 'bg-gray-50 text-[#1d1d1f] hover:bg-gray-100 border border-gray-200/50'
                    }`}
                  >
                    Fastest
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 border border-gray-200/50 rounded-xl hover:bg-gray-50 text-xs font-medium text-[#1d1d1f] transition-all active:scale-95 bg-gray-50">
                    PREV. DAY
                  </button>
                  <span className="text-gray-400 text-xs">-</span>
                  <button className="px-4 py-2 border border-gray-200/50 rounded-xl hover:bg-gray-50 text-xs font-medium text-[#1d1d1f] transition-all active:scale-95 bg-gray-50">
                    NEXT. DAY
                  </button>
                </div>
              </div>
            </div>

            {/* Flight Results */}
            <div>
              {loading ? (
                <div className="bg-white rounded-2xl shadow-apple p-12 text-center border border-gray-100/50">
                  <div className="text-[#1d1d1f] text-base font-medium mb-2">Searching for flights...</div>
                  <div className="text-gray-500 text-xs">Please wait</div>
                </div>
              ) : error ? (
                <div className="bg-white rounded-2xl shadow-apple p-12 text-center border border-gray-100/50">
                  <div className="text-red-600 text-base font-medium">{error}</div>
                </div>
              ) : filteredFlights.length > 0 ? (
                filteredFlights.map((flight, index) => (
                  <FlightCard key={index} {...flight} />
                ))
              ) : (
                <div className="bg-white rounded-2xl shadow-apple p-12 text-center border border-gray-100/50">
                  <div className="text-[#1d1d1f] text-base font-medium mb-2">No flights found</div>
                  <div className="text-gray-500 text-xs">Try adjusting your filters</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-apple hover:shadow-apple-hover hover:bg-[#20ba5a] transition-all active:scale-95 z-40"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  )
}

export default function FlightSearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fbfbfd] flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <FlightSearchContent />
    </Suspense>
  )
}
