// Flight API Integration
// Supports multiple API providers

export interface FlightSearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  adults: number
  cabinClass: string
  tripType: 'oneway' | 'roundtrip' | 'multicity'
}

export interface FlightSegment {
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

export interface Flight {
  id: string
  price: number
  currency: string
  segments: FlightSegment[]
  totalDuration: string
  stops: number
  stopsDetails?: string[]
  baggage: string
  cabinClass: string
  refundable: boolean
  bookingUrl?: string
}

// Flight API transformation functions
// API calls are now handled server-side in app/api/flights/route.ts

export function calculateLayoverDuration(previousArrival: string, nextDeparture: string): string {
  const prev = new Date(previousArrival)
  const next = new Date(nextDeparture)
  const diffMs = next.getTime() - prev.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const hours = Math.floor(diffMins / 60)
  const mins = diffMins % 60
  return `${hours}h: ${mins}m`
}

export function transformAmadeusFlights(amadeusFlights: any[]): Flight[] {
  return amadeusFlights.map((offer: any, index: number) => {
    const firstSegment = offer.itineraries[0].segments[0]
    const lastSegment = offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1]
    const segments = offer.itineraries[0].segments

    const transformedSegments = segments.map((seg: any, segIndex: number) => {
      const segment: any = {
        departure: {
          airport: seg.departure.iataCode,
          city: seg.departure.iataCode,
          time: seg.departure.at.split('T')[1].substring(0, 5),
          date: seg.departure.at.split('T')[0],
        },
        arrival: {
          airport: seg.arrival.iataCode,
          city: seg.arrival.iataCode,
          time: seg.arrival.at.split('T')[1].substring(0, 5),
          date: seg.arrival.at.split('T')[0],
        },
        carrier: seg.carrierCode, // Will be converted to full name in transformFlight
        carrierCode: seg.carrierCode,
        flightNumber: `${seg.carrierCode}-${seg.number}`,
        duration: seg.duration,
      }

      // Add terminal/gate if available
      if (seg.departure.terminal) segment.departure.terminal = seg.departure.terminal
      if (seg.departure.gate) segment.departure.gate = seg.departure.gate
      if (seg.arrival.terminal) segment.arrival.terminal = seg.arrival.terminal
      if (seg.arrival.gate) segment.arrival.gate = seg.arrival.gate

      // Add aircraft type if available
      if (seg.aircraft?.code) segment.aircraft = seg.aircraft.code

      // Calculate layover duration (except for last segment)
      if (segIndex < segments.length - 1) {
        const nextSegment = segments[segIndex + 1]
        segment.layoverDuration = calculateLayoverDuration(
          seg.arrival.at,
          nextSegment.departure.at
        )
      }

      return segment
    })

    // Calculate stops details
    const stopsDetails: string[] = []
    for (let i = 0; i < segments.length - 1; i++) {
      const seg = segments[i]
      const nextSeg = segments[i + 1]
      const layover = calculateLayoverDuration(seg.arrival.at, nextSeg.departure.at)
      stopsDetails.push(`${seg.arrival.iataCode} ${layover}`)
    }

    return {
      id: offer.id || `flight-${index}`,
      price: parseFloat(offer.price.total),
      currency: offer.price.currency,
      segments: transformedSegments,
      totalDuration: offer.itineraries[0].duration,
      stops: segments.length - 1,
      stopsDetails: stopsDetails,
      baggage: '1 Pieces', // Default, can be enhanced
      cabinClass: offer.travelerPricings[0].fareDetailsBySegment[0].cabin || 'Economy',
      refundable: offer.refundable || false,
    }
  })
}

// Mock data fallback
export function getMockFlights(params: FlightSearchParams): Flight[] {
  return [
    {
      id: 'mock-1',
      price: 508.00,
      currency: 'EUR',
      segments: [
        {
          departure: {
            airport: params.origin,
            city: params.origin,
            time: '10:35',
            date: params.departureDate,
            terminal: '3',
            gate: 'A12',
          },
          arrival: {
            airport: 'DXB',
            city: 'Dubai',
            time: '14:20',
            date: params.departureDate,
            terminal: '3',
            gate: 'B5',
          },
          carrier: 'EK',
          carrierCode: 'EK',
          flightNumber: 'EK-511',
          duration: 'PT5H45M',
          aircraft: 'B777',
          layoverDuration: '2h: 15m',
        },
        {
          departure: {
            airport: 'DXB',
            city: 'Dubai',
            time: '16:35',
            date: params.departureDate,
            terminal: '3',
            gate: 'A8',
          },
          arrival: {
            airport: params.destination,
            city: params.destination,
            time: '19:10',
            date: params.departureDate,
            terminal: '1',
            gate: 'C3',
          },
          carrier: 'EK',
          carrierCode: 'EK',
          flightNumber: 'EK-191',
          duration: 'PT8H35M',
          aircraft: 'A380',
        },
      ],
      totalDuration: 'PT14H35M',
      stops: 1,
      stopsDetails: ['DXB 2h: 15m'],
      baggage: '1 Pieces',
      cabinClass: params.cabinClass,
      refundable: false,
    },
    {
      id: 'mock-2',
      price: 344.00,
      currency: 'EUR',
      segments: [
        {
          departure: {
            airport: params.origin,
            city: params.origin,
            time: '04:00',
            date: params.departureDate,
            terminal: '3',
          },
          arrival: {
            airport: 'LHR',
            city: 'London',
            time: '08:30',
            date: params.departureDate,
            terminal: '5',
          },
          carrier: 'AI',
          carrierCode: 'AI',
          flightNumber: 'AI-147',
          duration: 'PT9H30M',
          aircraft: 'B787',
          layoverDuration: '5h: 30m',
        },
        {
          departure: {
            airport: 'LHR',
            city: 'London',
            time: '14:00',
            date: params.departureDate,
            terminal: '5',
          },
          arrival: {
            airport: params.destination,
            city: params.destination,
            time: '17:30',
            date: params.departureDate,
            terminal: '1',
          },
          carrier: 'AI',
          carrierCode: 'AI',
          flightNumber: 'AI-1435',
          duration: 'PT2H30M',
          aircraft: 'A320',
        },
      ],
      totalDuration: 'PT19H0M',
      stops: 1,
      stopsDetails: ['LHR 5h: 30m'],
      baggage: '1 Pieces',
      cabinClass: params.cabinClass,
      refundable: false,
    },
    {
      id: 'mock-3',
      price: 678.66,
      currency: 'EUR',
      segments: [
        {
          departure: {
            airport: params.origin,
            city: params.origin,
            time: '18:45',
            date: params.departureDate,
            terminal: '1',
          },
          arrival: {
            airport: 'ZRH',
            city: 'Zurich',
            time: '22:30',
            date: params.departureDate,
            terminal: '1',
          },
          carrier: 'LX',
          carrierCode: 'LX',
          flightNumber: 'LX-4583',
          duration: 'PT3H45M',
          aircraft: 'A320',
          layoverDuration: '13h: 25m',
        },
        {
          departure: {
            airport: 'ZRH',
            city: 'Zurich',
            time: '11:55',
            date: params.departureDate,
            terminal: '1',
          },
          arrival: {
            airport: params.destination,
            city: params.destination,
            time: '00:15',
            date: params.departureDate,
            terminal: '3',
          },
          carrier: 'LX',
          carrierCode: 'LX',
          flightNumber: 'LX-152',
          duration: 'PT8H20M',
          aircraft: 'A340',
        },
      ],
      totalDuration: 'PT24H0M',
      stops: 1,
      stopsDetails: ['ZRH 13h: 25m'],
      baggage: '1 Pieces',
      cabinClass: params.cabinClass,
      refundable: true,
    },
    {
      id: 'mock-4',
      price: 705.10,
      currency: 'EUR',
      segments: [
        {
          departure: {
            airport: params.origin,
            city: params.origin,
            time: '14:30',
            date: params.departureDate,
            terminal: '1',
          },
          arrival: {
            airport: 'FRA',
            city: 'Frankfurt',
            time: '17:15',
            date: params.departureDate,
            terminal: '1',
          },
          carrier: 'LH',
          carrierCode: 'LH',
          flightNumber: 'LH-761',
          duration: 'PT2H45M',
          aircraft: 'A320',
          layoverDuration: '2h: 30m',
        },
        {
          departure: {
            airport: 'FRA',
            city: 'Frankfurt',
            time: '19:45',
            date: params.departureDate,
            terminal: '1',
          },
          arrival: {
            airport: params.destination,
            city: params.destination,
            time: '22:30',
            date: params.departureDate,
            terminal: '2',
          },
          carrier: 'LH',
          carrierCode: 'LH',
          flightNumber: 'LH-456',
          duration: 'PT2H45M',
          aircraft: 'A321',
        },
      ],
      totalDuration: 'PT8H0M',
      stops: 1,
      stopsDetails: ['FRA 2h: 30m'],
      baggage: '1 Pieces',
      cabinClass: params.cabinClass,
      refundable: false,
    },
    {
      id: 'mock-5',
      price: 947.25,
      currency: 'EUR',
      segments: [
        {
          departure: {
            airport: params.origin,
            city: params.origin,
            time: '06:00',
            date: params.departureDate,
            terminal: '2F',
          },
          arrival: {
            airport: 'CDG',
            city: 'Paris',
            time: '09:15',
            date: params.departureDate,
            terminal: '2E',
          },
          carrier: 'AF',
          carrierCode: 'AF',
          flightNumber: 'AF-1665',
          duration: 'PT3H15M',
          aircraft: 'A320',
          layoverDuration: '1h: 45m',
        },
        {
          departure: {
            airport: 'CDG',
            city: 'Paris',
            time: '11:00',
            date: params.departureDate,
            terminal: '2E',
          },
          arrival: {
            airport: params.destination,
            city: params.destination,
            time: '15:30',
            date: params.departureDate,
            terminal: '1',
          },
          carrier: 'AF',
          carrierCode: 'AF',
          flightNumber: 'AF-1024',
          duration: 'PT4H30M',
          aircraft: 'B777',
        },
      ],
      totalDuration: 'PT9H30M',
      stops: 1,
      stopsDetails: ['CDG 1h: 45m'],
      baggage: '1 Pieces',
      cabinClass: params.cabinClass,
      refundable: true,
    },
    {
      id: 'mock-6',
      price: 749.58,
      currency: 'EUR',
      segments: [
        {
          departure: {
            airport: params.origin,
            city: params.origin,
            time: '12:00',
            date: params.departureDate,
            terminal: 'A',
          },
          arrival: {
            airport: 'WAW',
            city: 'Warsaw',
            time: '14:30',
            date: params.departureDate,
            terminal: 'A',
          },
          carrier: 'LO',
          carrierCode: 'LO',
          flightNumber: 'LO-364',
          duration: 'PT2H30M',
          aircraft: 'E175',
          layoverDuration: '3h: 00m',
        },
        {
          departure: {
            airport: 'WAW',
            city: 'Warsaw',
            time: '17:30',
            date: params.departureDate,
            terminal: 'A',
          },
          arrival: {
            airport: params.destination,
            city: params.destination,
            time: '21:00',
            date: params.departureDate,
            terminal: '1',
          },
          carrier: 'LO',
          carrierCode: 'LO',
          flightNumber: 'LO-458',
          duration: 'PT3H30M',
          aircraft: 'B787',
        },
      ],
      totalDuration: 'PT9H0M',
      stops: 1,
      stopsDetails: ['WAW 3h: 00m'],
      baggage: '1 Pieces',
      cabinClass: params.cabinClass,
      refundable: false,
    },
  ]
}

