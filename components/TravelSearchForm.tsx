'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Airport } from '@/lib/airportApi'

interface TravelSearchFormProps {
  initialValues?: {
    serviceType?: 'flights' | 'visa'
    origin?: string
    destination?: string
    departureDate?: string
    returnDate?: string
    checkIn?: string
    checkOut?: string
    adults?: number
    rooms?: number
    cabinClass?: string
    tripType?: 'oneway' | 'roundtrip' | 'multicity'
  }
}

export default function TravelSearchForm({ initialValues }: TravelSearchFormProps) {
  const router = useRouter()
  const [serviceType, setServiceType] = useState<'flights' | 'visa'>(
    initialValues?.serviceType || 'flights'
  )

  // Flight states
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip' | 'multicity'>(
    initialValues?.tripType || 'oneway'
  )
  const [origin, setOrigin] = useState(initialValues?.origin || '')
  const [destination, setDestination] = useState(initialValues?.destination || '')
  const [departureDate, setDepartureDate] = useState(
    initialValues?.departureDate || new Date().toISOString().split('T')[0]
  )
  const [returnDate, setReturnDate] = useState(initialValues?.returnDate || '')
  const [adults, setAdults] = useState(initialValues?.adults || 1)
  const [cabinClass, setCabinClass] = useState(initialValues?.cabinClass || 'Economy')

  // Hotel states
  const [hotelDestination, setHotelDestination] = useState(initialValues?.destination || '')
  const [checkIn, setCheckIn] = useState(
    initialValues?.checkIn || new Date().toISOString().split('T')[0]
  )
  const [checkOut, setCheckOut] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    return initialValues?.checkOut || date.toISOString().split('T')[0]
  })
  const [hotelAdults, setHotelAdults] = useState(initialValues?.adults || 1)
  const [rooms, setRooms] = useState(initialValues?.rooms || 1)

  // Autocomplete states
  const [originSuggestions, setOriginSuggestions] = useState<Airport[]>([])
  const [destinationSuggestions, setDestinationSuggestions] = useState<Airport[]>([])
  const [hotelDestinationSuggestions, setHotelDestinationSuggestions] = useState<Airport[]>([])
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false)
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false)
  const [showHotelDestinationSuggestions, setShowHotelDestinationSuggestions] = useState(false)
  const originInputRef = useRef<HTMLInputElement>(null)
  const destinationInputRef = useRef<HTMLInputElement>(null)
  const hotelDestinationInputRef = useRef<HTMLInputElement>(null)

  // Fetch airport suggestions for flights
  useEffect(() => {
    const fetchOriginSuggestions = async () => {
      if (origin.length >= 2) {
        try {
          const response = await fetch(`/api/airports?q=${encodeURIComponent(origin)}`)
          const data = await response.json()
          setOriginSuggestions(data.airports || [])
          setShowOriginSuggestions(true)
        } catch (error) {
          console.error('Error fetching origin suggestions:', error)
        }
      } else {
        setOriginSuggestions([])
        setShowOriginSuggestions(false)
      }
    }

    const timeoutId = setTimeout(fetchOriginSuggestions, 300)
    return () => clearTimeout(timeoutId)
  }, [origin])

  useEffect(() => {
    const fetchDestinationSuggestions = async () => {
      if (destination.length >= 2) {
        try {
          const response = await fetch(`/api/airports?q=${encodeURIComponent(destination)}`)
          const data = await response.json()
          setDestinationSuggestions(data.airports || [])
          setShowDestinationSuggestions(true)
        } catch (error) {
          console.error('Error fetching destination suggestions:', error)
        }
      } else {
        setDestinationSuggestions([])
        setShowDestinationSuggestions(false)
      }
    }

    const timeoutId = setTimeout(fetchDestinationSuggestions, 300)
    return () => clearTimeout(timeoutId)
  }, [destination])

  // Fetch destination suggestions for hotels
  useEffect(() => {
    const fetchHotelDestinationSuggestions = async () => {
      if (hotelDestination.length >= 2) {
        try {
          const response = await fetch(`/api/airports?q=${encodeURIComponent(hotelDestination)}`)
          const data = await response.json()
          setHotelDestinationSuggestions(data.airports || [])
          setShowHotelDestinationSuggestions(true)
        } catch (error) {
          console.error('Error fetching hotel destination suggestions:', error)
        }
      } else {
        setHotelDestinationSuggestions([])
        setShowHotelDestinationSuggestions(false)
      }
    }

    const timeoutId = setTimeout(fetchHotelDestinationSuggestions, 300)
    return () => clearTimeout(timeoutId)
  }, [hotelDestination])

  const handleSwap = () => {
    const temp = origin
    setOrigin(destination)
    setDestination(temp)
  }

  const selectOrigin = (airport: Airport) => {
    setOrigin(airport.iataCode)
    setShowOriginSuggestions(false)
  }

  const selectDestination = (airport: Airport) => {
    setDestination(airport.iataCode)
    setShowDestinationSuggestions(false)
  }

  const selectHotelDestination = (airport: Airport) => {
    setHotelDestination(airport.iataCode)
    setShowHotelDestinationSuggestions(false)
  }

  const handleFlightSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams({
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      departuredate: departureDate,
      adults: adults.toString(),
      class: cabinClass,
      route: tripType === 'oneway' ? 'oneway' : 'roundtrip',
    })
    
    if (tripType === 'roundtrip' && returnDate) {
      params.append('returndate', returnDate)
    }
    
    router.push(`/flight-search?${params.toString()}`)
  }

  const handleHotelSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams({
      destination: hotelDestination.toUpperCase(),
      checkin: checkIn,
      checkout: checkOut,
      adults: hotelAdults.toString(),
      rooms: rooms.toString(),
    })
    
    router.push(`/hotel-search?${params.toString()}`)
  }

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  const getReturnMinDate = () => {
    return departureDate || getMinDate()
  }

  const getCheckOutMinDate = () => {
    const date = new Date(checkIn)
    date.setDate(date.getDate() + 1)
    return date.toISOString().split('T')[0]
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-6xl mx-auto">
      {/* Service Tabs */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-2">
          <button
            onClick={() => setServiceType('flights')}
            className={`flex items-center gap-1.5 sm:gap-2 pb-2 transition-colors ${
              serviceType === 'flights'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <span className="text-xl sm:text-2xl">✈️</span>
            <span className="text-base sm:text-lg font-semibold">Flights</span>
          </button>
          <button
            onClick={() => {
              router.push('/visa')
            }}
            className={`flex items-center gap-1.5 sm:gap-2 pb-2 transition-colors ${
              serviceType === 'visa'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <span className="text-xl sm:text-2xl">🛂</span>
            <span className="text-base sm:text-lg font-semibold">Visa</span>
          </button>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 text-center px-2">
          {serviceType === 'flights'
            ? 'Book International and Domestic Flights'
            : 'Check visa requirements and get expert guidance'}
        </p>
      </div>

      {/* Flight Search Form */}
      {serviceType === 'flights' && (
        <>
          {/* Trip Type Selection */}
          <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tripType"
                value="oneway"
                checked={tripType === 'oneway'}
                onChange={(e) => setTripType(e.target.value as 'oneway')}
                className="mr-2"
              />
              <span className="text-xs sm:text-sm font-medium">One Way</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tripType"
                value="roundtrip"
                checked={tripType === 'roundtrip'}
                onChange={(e) => setTripType(e.target.value as 'roundtrip')}
                className="mr-2"
              />
              <span className="text-xs sm:text-sm font-medium">Round Trip</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tripType"
                value="multicity"
                checked={tripType === 'multicity'}
                onChange={(e) => setTripType(e.target.value as 'multicity')}
                className="mr-2"
              />
              <span className="text-xs sm:text-sm font-medium">Multi City</span>
            </label>
          </div>

          <form onSubmit={handleFlightSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Origin */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <input
                  ref={originInputRef}
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  onFocus={() => origin.length >= 2 && setShowOriginSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowOriginSuggestions(false), 200)}
                  placeholder="City or Airport"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {showOriginSuggestions && originSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {originSuggestions.map((airport) => (
                      <div
                        key={airport.id}
                        onClick={() => selectOrigin(airport)}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-semibold text-gray-900">{airport.name}</div>
                        <div className="text-sm text-gray-600">
                          {airport.iataCode} - {airport.address.cityName}, {airport.address.countryName}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Swap Button */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="w-full h-12 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center transition-colors"
                  title="Swap origin and destination"
                >
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>

              {/* Destination */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input
                  ref={destinationInputRef}
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onFocus={() => destination.length >= 2 && setShowDestinationSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowDestinationSuggestions(false), 200)}
                  placeholder="City or Airport"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {destinationSuggestions.map((airport) => (
                      <div
                        key={airport.id}
                        onClick={() => selectDestination(airport)}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-semibold text-gray-900">{airport.name}</div>
                        <div className="text-sm text-gray-600">
                          {airport.iataCode} - {airport.address.cityName}, {airport.address.countryName}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Departure Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  min={getMinDate()}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base appearance-none [-webkit-appearance:none] [-moz-appearance:textfield]"
                  style={{
                    fontSize: '16px', // Prevents zoom on iOS
                    lineHeight: '1.5',
                    minHeight: '44px' // iOS touch target minimum
                  }}
                  required
                />
              </div>

              {/* Return Date - Only for Round Trip */}
              {tripType === 'roundtrip' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Return</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={getReturnMinDate()}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base appearance-none [-webkit-appearance:none] [-moz-appearance:textfield]"
                    style={{
                      fontSize: '16px', // Prevents zoom on iOS
                      lineHeight: '1.5',
                      minHeight: '44px' // iOS touch target minimum
                    }}
                    required
                  />
                </div>
              )}

              {/* Travellers & Class */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Travellers & Class</label>
                <div className="border border-gray-300 rounded-md px-4 py-3">
                  <div className="font-semibold text-gray-900">{adults} Traveller{adults > 1 ? 's' : ''}</div>
                  <div className="text-sm text-gray-600">{cabinClass}</div>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold text-base sm:text-lg"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            </div>
          </form>
        </>
      )}

    </div>
  )
}


