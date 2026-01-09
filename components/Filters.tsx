'use client'

import { useState, useEffect, useRef } from 'react'

export interface FilterState {
  selectedBaggage: string
  refundable: string
  selectedStops: string[]
  priceRange: [number, number]
  departureArrival: 'departure' | 'arrival'
  selectedTimeSlots: string[]
}

interface FiltersProps {
  onFilterChange?: (filters: FilterState) => void
  initialPriceRange?: [number, number]
}

export default function Filters({ onFilterChange, initialPriceRange = [0, 1000] }: FiltersProps) {
  const [selectedBaggage, setSelectedBaggage] = useState('1')
  const [refundable, setRefundable] = useState<string>('')
  const [selectedStops, setSelectedStops] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>(initialPriceRange)
  const [departureArrival, setDepartureArrival] = useState<'departure' | 'arrival'>('departure')
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([])

  // Track previous initial price range to detect changes
  const prevInitialRangeRef = useRef<[number, number]>(initialPriceRange)
  const isUserModifiedRef = useRef(false)
  
  // Update price range when initialPriceRange changes (only if it's a meaningful change)
  useEffect(() => {
    const newMin = initialPriceRange[0]
    const newMax = initialPriceRange[1]
    const prevMin = prevInitialRangeRef.current[0]
    const prevMax = prevInitialRangeRef.current[1]
    
    // Only update if initial range actually changed and user hasn't manually modified it
    if ((prevMin !== newMin || prevMax !== newMax) && !isUserModifiedRef.current) {
      prevInitialRangeRef.current = initialPriceRange
      setPriceRange(initialPriceRange)
    }
  }, [initialPriceRange[0], initialPriceRange[1]]) // Don't include priceRange to avoid circular updates
  
  // Track when user manually modifies price range
  const handlePriceRangeChange = (newRange: [number, number]) => {
    isUserModifiedRef.current = true
    setPriceRange(newRange)
  }

  // Notify parent of filter changes
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        selectedBaggage,
        refundable,
        selectedStops,
        priceRange,
        departureArrival,
        selectedTimeSlots,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBaggage, refundable, selectedStops, priceRange, departureArrival, selectedTimeSlots]) // Remove onFilterChange from deps

  const handleStopToggle = (stop: string) => {
    setSelectedStops(prev => 
      prev.includes(stop) 
        ? prev.filter(s => s !== stop)
        : [...prev, stop]
    )
  }

  const handleTimeSlotToggle = (slot: string) => {
    setSelectedTimeSlots(prev =>
      prev.includes(slot)
        ? prev.filter(s => s !== slot)
        : [...prev, slot]
    )
  }

  const handleReset = () => {
    setSelectedBaggage('1')
    setRefundable('')
    setSelectedStops([])
    isUserModifiedRef.current = false // Reset modification flag
    setPriceRange(initialPriceRange)
    setDepartureArrival('departure')
    setSelectedTimeSlots([])
  }

  return (
    <div className="bg-white rounded-2xl shadow-apple p-6 mb-6 border border-gray-100/50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-semibold text-[#1d1d1f] tracking-tight">FILTER</h3>
        <button 
          onClick={handleReset}
          className="text-[#007aff] hover:text-[#0051d5] text-xs font-medium transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Baggage Filter */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-gray-600 mb-3">Baggage</label>
        <div className="flex gap-2">
          {['1', '0', 'kg'].map((option) => (
            <button
              key={option}
              onClick={() => setSelectedBaggage(option)}
              className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all active:scale-95 ${
                selectedBaggage === option
                  ? 'bg-[#007aff] text-white border-[#007aff] shadow-apple-sm'
                  : 'bg-gray-50 text-[#1d1d1f] border-gray-200/50 hover:bg-gray-100'
              }`}
            >
              {option === 'kg' ? 'kg' : `${option} pieces`}
            </button>
          ))}
        </div>
      </div>

      {/* Refundable / Non Refundable */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-gray-600 mb-3">Refundable / Non Refundable</label>
        <div className="space-y-2.5">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="refundable"
              value="refundable"
              checked={refundable === 'refundable'}
              onChange={(e) => setRefundable(e.target.value)}
              className="mr-3 w-4 h-4 text-[#007aff] focus:ring-[#007aff] focus:ring-2 border-gray-300"
            />
            <span className="text-xs font-medium text-[#1d1d1f]">Refundable</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="refundable"
              value="non-refundable"
              checked={refundable === 'non-refundable'}
              onChange={(e) => setRefundable(e.target.value)}
              className="mr-3 w-4 h-4 text-[#007aff] focus:ring-[#007aff] focus:ring-2 border-gray-300"
            />
            <span className="text-xs font-medium text-[#1d1d1f]">Non Refundable</span>
          </label>
        </div>
      </div>

      {/* Stops */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-gray-600 mb-3">Stops</label>
        <div className="flex gap-2 flex-wrap">
          {['Direct', '1 Stop', '1+ Stop'].map((stop) => (
            <button
              key={stop}
              onClick={() => handleStopToggle(stop)}
              className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all active:scale-95 ${
                selectedStops.includes(stop)
                  ? 'bg-[#007aff] text-white border-[#007aff] shadow-apple-sm'
                  : 'bg-gray-50 text-[#1d1d1f] border-gray-200/50 hover:bg-gray-100'
              }`}
            >
              {stop}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-gray-600 mb-3">
          Price Range: € {priceRange[0].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - € {priceRange[1].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </label>
        <div className="space-y-3">
          <input
            type="range"
            min={initialPriceRange[0]}
            max={initialPriceRange[1]}
            step="10"
            value={priceRange[1]}
            onChange={(e) => handlePriceRangeChange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#007aff]"
            style={{
              background: `linear-gradient(to right, #007aff 0%, #007aff ${((priceRange[1] - initialPriceRange[0]) / (initialPriceRange[1] - initialPriceRange[0])) * 100}%, #e5e7eb ${((priceRange[1] - initialPriceRange[0]) / (initialPriceRange[1] - initialPriceRange[0])) * 100}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>€ {initialPriceRange[0]}</span>
            <span>€ {initialPriceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Departure / Arrival */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-gray-600 mb-3">Departure/Arrival</label>
        <div className="flex gap-2">
          <button
            onClick={() => setDepartureArrival('departure')}
            className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-medium border transition-all active:scale-95 ${
              departureArrival === 'departure'
                ? 'bg-[#007aff] text-white border-[#007aff] shadow-apple-sm'
                : 'bg-gray-50 text-[#1d1d1f] border-gray-200/50 hover:bg-gray-100'
            }`}
          >
            Departure
          </button>
          <button
            onClick={() => setDepartureArrival('arrival')}
            className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-medium border transition-all active:scale-95 ${
              departureArrival === 'arrival'
                ? 'bg-[#007aff] text-white border-[#007aff] shadow-apple-sm'
                : 'bg-gray-50 text-[#1d1d1f] border-gray-200/50 hover:bg-gray-100'
            }`}
          >
            Arrival
          </button>
        </div>
      </div>

      {/* Departure Time */}
      <div className="mb-0">
        <label className="block text-xs font-medium text-gray-600 mb-3">Departure Time</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: '00-06 AM', icon: '🌅', start: 0, end: 6 },
            { label: '06-12 PM', icon: '☀️', start: 6, end: 12 },
            { label: '12-06 PM', icon: '☀️', start: 12, end: 18 },
            { label: '06-12 AM', icon: '🌙', start: 18, end: 24 },
          ].map((slot) => (
            <button
              key={slot.label}
              onClick={() => handleTimeSlotToggle(slot.label)}
              className={`px-3 py-2.5 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition-all active:scale-95 ${
                selectedTimeSlots.includes(slot.label)
                  ? 'bg-[#007aff] text-white border-[#007aff] shadow-apple-sm'
                  : 'bg-gray-50 text-[#1d1d1f] border-gray-200/50 hover:bg-gray-100'
              }`}
            >
              <span>{slot.icon}</span>
              <span>{slot.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
