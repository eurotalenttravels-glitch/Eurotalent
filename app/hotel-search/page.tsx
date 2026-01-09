'use client'

import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'

function HotelSearchContent() {
  const searchParams = useSearchParams()
  
  const destination = searchParams.get('destination') || ''
  const checkIn = searchParams.get('checkin') || ''
  const checkOut = searchParams.get('checkout') || ''
  const adults = searchParams.get('adults') || '1'
  const rooms = searchParams.get('rooms') || '1'

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Hotel Search</h1>
          <div className="text-gray-600 mb-6">
            <p>Destination: {destination}</p>
            <p>Check-in: {checkIn}</p>
            <p>Check-out: {checkOut}</p>
            <p>Guests: {adults}</p>
            <p>Rooms: {rooms}</p>
          </div>
          <p className="text-gray-500">Hotel search results page coming soon...</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default function HotelSearchPage() {
  return <HotelSearchContent />
}


