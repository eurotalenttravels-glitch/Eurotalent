'use client'

import { useState } from 'react'

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

interface FlightCardProps {
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
  if (duration.startsWith('PT')) {
    const hours = duration.match(/(\d+)H/)?.[1] || '0'
    const minutes = duration.match(/(\d+)M/)?.[1] || '0'
    return `${hours}h: ${minutes}m`
  }
  return duration
}

export default function FlightCard({
  airline,
  flightNumber,
  departure,
  arrival,
  duration,
  stops,
  stopsDetails = [],
  distance,
  price,
  baggage,
  seats,
  cabinClass,
  refundable,
  travelers,
  segments = []
}: FlightCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-apple p-6 mb-5 hover:shadow-apple-hover transition-all border border-gray-100/50">
      {/* Top Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div>
            <div className="font-semibold text-lg text-[#1d1d1f] tracking-tight">{airline}</div>
            <div className="text-xs text-gray-500 mt-0.5">{flightNumber}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button className="px-4 py-2 bg-gray-50 text-[#1d1d1f] rounded-xl hover:bg-gray-100 text-xs font-medium transition-all active:scale-95 border border-gray-200/50">
            Book & Hold
          </button>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span>{baggage}</span>
            <span>•</span>
            <span>{seats} Seat{seats > 1 ? 's' : ''}</span>
            <span>•</span>
            <span>{cabinClass}</span>
          </div>
          {refundable ? (
            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100">
              Refundable
            </span>
          ) : (
            <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium border border-red-100">
              Non Refundable
            </span>
          )}
          <button className="px-6 py-2.5 bg-[#34c759] text-white rounded-full hover:bg-[#28a745] font-medium text-xs shadow-apple-sm active:scale-95 transition-all">
            Issue Now
          </button>
        </div>
      </div>

      {/* Flight Details */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-5">
        {/* Departure */}
        <div className="flex-1">
          <div className="text-3xl font-semibold text-[#1d1d1f] mb-1 tracking-tight">{departure.time}</div>
          <div className="text-base font-medium text-[#1d1d1f] mb-1">{departure.code}</div>
          <div className="text-xs text-gray-500">{departure.date}</div>
        </div>

        {/* Route */}
        <div className="flex-1 relative px-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 bg-[#007aff] rounded-full"></div>
            <div className="flex-1 h-px bg-[#007aff]/30 relative">
              {stops > 0 && segments.length > 0 && segments.length > 1 && (
                <>
                  {segments.slice(0, -1).map((_, index) => (
                    <div
                      key={index}
                      className="absolute w-2 h-2 bg-orange-500 rounded-full border-2 border-white shadow-sm"
                      style={{ left: `${((index + 1) / segments.length) * 100}%`, top: '-4px' }}
                    />
                  ))}
                </>
              )}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-lg">✈️</div>
            </div>
            <div className="w-2.5 h-2.5 bg-[#007aff] rounded-full"></div>
          </div>
          <div className="text-xs text-gray-500">
            <div className="font-medium text-[#1d1d1f] mb-1">{duration}</div>
            {stops > 0 && (
              <div>
                {stops} Stop{stops > 1 ? 's' : ''}
                {stopsDetails.length > 0 && (
                  <span className="ml-1.5">
                    ({stopsDetails.join(', ')})
                  </span>
                )}
              </div>
            )}
            {distance && <div className="mt-1">{distance}</div>}
          </div>
        </div>

        {/* Arrival */}
        <div className="flex-1 text-right md:text-left">
          <div className="text-3xl font-semibold text-[#1d1d1f] mb-1 tracking-tight">{arrival.time}</div>
          <div className="text-base font-medium text-[#1d1d1f] mb-1">{arrival.code}</div>
          <div className="text-xs text-gray-500">{arrival.date}</div>
        </div>
      </div>

      {/* Details Toggle */}
      {segments.length > 0 && (
        <div className="mb-5">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-[#007aff] hover:text-[#0051d5] text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      {/* Detailed Segments */}
      {showDetails && segments.length > 0 && (
        <div className="mb-4 pt-4 border-t space-y-6">
          {segments.map((segment, index) => (
            <div key={index} className="space-y-4">
              {/* Segment */}
              <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="font-semibold text-lg">{segment.carrierCode}</div>
                    <div className="text-sm text-gray-600">{segment.flightNumber}</div>
                    {segment.aircraft && (
                      <div className="text-xs text-gray-500">Aircraft: {segment.aircraft}</div>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-gray-700">
                    {formatDuration(segment.duration)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Departure Details */}
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Departure</div>
                    <div className="text-lg font-bold">{segment.departure.time}</div>
                    <div className="font-semibold">
                      {segment.departure.airport} - {segment.departure.city}
                    </div>
                    <div className="text-sm text-gray-600">{segment.departure.date}</div>
                    {(segment.departure.terminal || segment.departure.gate) && (
                      <div className="text-xs text-gray-500 mt-1">
                        {segment.departure.terminal && `Terminal: ${segment.departure.terminal}`}
                        {segment.departure.terminal && segment.departure.gate && ' • '}
                        {segment.departure.gate && `Gate: ${segment.departure.gate}`}
                      </div>
                    )}
                  </div>

                  {/* Arrival Details */}
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Arrival</div>
                    <div className="text-lg font-bold">{segment.arrival.time}</div>
                    <div className="font-semibold">
                      {segment.arrival.airport} - {segment.arrival.city}
                    </div>
                    <div className="text-sm text-gray-600">{segment.arrival.date}</div>
                    {(segment.arrival.terminal || segment.arrival.gate) && (
                      <div className="text-xs text-gray-500 mt-1">
                        {segment.arrival.terminal && `Terminal: ${segment.arrival.terminal}`}
                        {segment.arrival.terminal && segment.arrival.gate && ' • '}
                        {segment.arrival.gate && `Gate: ${segment.arrival.gate}`}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Layover */}
              {segment.layoverDuration && index < segments.length - 1 && (
                <div className="flex items-center gap-4 py-3">
                  <div className="flex-1 border-t border-dashed border-gray-200"></div>
                  <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-full text-xs font-medium border border-orange-100">
                    Layover at {segment.arrival.airport}: {segment.layoverDuration}
                  </div>
                  <div className="flex-1 border-t border-dashed border-gray-200"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Bottom Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <div className="text-xs text-gray-500">
            {travelers} traveler{travelers > 1 ? 's' : ''}
          </div>
        </div>
        <div className="flex items-center gap-5">
          <button className="text-[#007aff] hover:text-[#0051d5] text-xs font-medium transition-colors">Price Breakdown</button>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">Total Price</div>
            <div className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
              € {price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
