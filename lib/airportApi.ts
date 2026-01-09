// Airport & City Search API for autocomplete
// Get your API key from: https://developers.amadeus.com/
// API calls are now handled server-side in app/api/airports/route.ts

export interface Airport {
  type: string
  subType: string
  name: string
  detailedName: string
  id: string
  self: {
    href: string
    methods: string[]
  }
  timeZoneOffset: string
  iataCode: string
  geoCode: {
    latitude: number
    longitude: number
  }
  address: {
    cityName: string
    cityCode: string
    countryName: string
    countryCode: string
    regionCode: string
  }
  analytics?: {
    travelers: {
      score: number
    }
  }
}

// Mock airports for demonstration
export function getMockAirports(query: string): Airport[] {
  const mockAirports: Airport[] = [
    {
      type: 'location',
      subType: 'AIRPORT',
      name: 'Indira Gandhi International Airport',
      detailedName: 'DELHI (DEL)',
      id: 'DEL',
      self: {
        href: '',
        methods: [],
      },
      timeZoneOffset: '+05:30',
      iataCode: 'DEL',
      geoCode: {
        latitude: 28.5567,
        longitude: 77.1000,
      },
      address: {
        cityName: 'Delhi',
        cityCode: 'DEL',
        countryName: 'India',
        countryCode: 'IN',
        regionCode: 'AS',
      },
    },
    {
      type: 'location',
      subType: 'AIRPORT',
      name: 'Sri Guru Ram Dass Jee International Airport',
      detailedName: 'AMRITSAR (ATQ)',
      id: 'ATQ',
      self: {
        href: '',
        methods: [],
      },
      timeZoneOffset: '+05:30',
      iataCode: 'ATQ',
      geoCode: {
        latitude: 31.7096,
        longitude: 74.7973,
      },
      address: {
        cityName: 'Amritsar',
        cityCode: 'ATQ',
        countryName: 'India',
        countryCode: 'IN',
        regionCode: 'AS',
      },
    },
    {
      type: 'location',
      subType: 'AIRPORT',
      name: 'Lisbon Airport',
      detailedName: 'LISBON (LIS)',
      id: 'LIS',
      self: {
        href: '',
        methods: [],
      },
      timeZoneOffset: '+00:00',
      iataCode: 'LIS',
      geoCode: {
        latitude: 38.7813,
        longitude: -9.1359,
      },
      address: {
        cityName: 'Lisbon',
        cityCode: 'LIS',
        countryName: 'Portugal',
        countryCode: 'PT',
        regionCode: 'EU',
      },
    },
  ]

  if (!query) return mockAirports

  const lowerQuery = query.toLowerCase()
  return mockAirports.filter(
    (airport) =>
      airport.name.toLowerCase().includes(lowerQuery) ||
      airport.iataCode.toLowerCase().includes(lowerQuery) ||
      airport.address.cityName.toLowerCase().includes(lowerQuery)
  )
}

