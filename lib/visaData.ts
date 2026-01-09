// Visa Information Data Structure
// Easy to add/edit visa requirements

export interface VisaRequirement {
  country: string
  countryCode: string
  flag: string
  visaTypes: {
    [key: string]: {
      required: boolean
      duration: string
      processingTime: string
      cost: string
      documents: string[]
      validity: string
      notes?: string
    }
  }
}

export const visaData: { [nationality: string]: { [destination: string]: VisaRequirement } } = {
  // Example: Indian nationals applying for different countries
  'India': {
    'United States': {
      country: 'United States',
      countryCode: 'US',
      flag: '🇺🇸',
      visaTypes: {
        'Tourist Visa': {
          required: true,
          duration: '10 years (multiple entry)',
          processingTime: '2-3 weeks',
          cost: '€170',
          documents: ['Valid passport', 'Visa application form', 'Passport photos', 'Travel itinerary', 'Bank statements', 'Hotel bookings'],
          validity: '10 years',
          notes: 'Interview required at US Embassy or Consulate'
        },
        'Business Visa': {
          required: true,
          duration: '10 years (multiple entry)',
          processingTime: '2-3 weeks',
          cost: '€170',
          documents: ['Valid passport', 'Business invitation letter', 'Company documents', 'Travel itinerary'],
          validity: '10 years'
        }
      }
    },
    'United Kingdom': {
      country: 'United Kingdom',
      countryCode: 'GB',
      flag: '🇬🇧',
      visaTypes: {
        'Tourist Visa': {
          required: true,
          duration: '6 months',
          processingTime: '3 weeks',
          cost: '€115',
          documents: ['Valid passport', 'Visa application form', 'Passport photos', 'Travel itinerary', 'Bank statements', 'Accommodation proof'],
          validity: '6 months',
          notes: 'Biometric appointment required'
        }
      }
    },
    'Canada': {
      country: 'Canada',
      countryCode: 'CA',
      flag: '🇨🇦',
      visaTypes: {
        'Tourist Visa': {
          required: true,
          duration: 'Up to 6 months',
          processingTime: '2-4 weeks',
          cost: '€68',
          documents: ['Valid passport', 'Visa application form', 'Passport photos', 'Travel itinerary', 'Bank statements', 'Invitation letter (if applicable)'],
          validity: 'Up to 10 years (multiple entry)'
        }
      }
    },
    'Australia': {
      country: 'Australia',
      countryCode: 'AU',
      flag: '🇦🇺',
      visaTypes: {
        'Tourist Visa': {
          required: true,
          duration: '3-12 months',
          processingTime: '2-4 weeks',
          cost: '€92',
          documents: ['Valid passport', 'Visa application form', 'Passport photos', 'Travel itinerary', 'Bank statements', 'Health insurance'],
          validity: '1-10 years (multiple entry)'
        }
      }
    },
    'France': {
      country: 'France',
      countryCode: 'FR',
      flag: '🇫🇷',
      visaTypes: {
        'Tourist Visa': {
          required: true,
          duration: 'Up to 90 days',
          processingTime: '2 weeks',
          cost: '€80',
          documents: ['Valid passport', 'Schengen visa application', 'Passport photos', 'Travel itinerary', 'Bank statements', 'Travel insurance', 'Hotel bookings'],
          validity: 'As per Schengen visa',
          notes: 'Schengen visa allows travel to 26 European countries'
        }
      }
    },
    'Germany': {
      country: 'Germany',
      countryCode: 'DE',
      flag: '🇩🇪',
      visaTypes: {
        'Tourist Visa': {
          required: true,
          duration: 'Up to 90 days',
          processingTime: '2 weeks',
          cost: '€80',
          documents: ['Valid passport', 'Schengen visa application', 'Passport photos', 'Travel itinerary', 'Bank statements', 'Travel insurance'],
          validity: 'As per Schengen visa',
          notes: 'Schengen visa allows travel to 26 European countries'
        }
      }
    },
    'Turkey': {
      country: 'Turkey',
      countryCode: 'TR',
      flag: '🇹🇷',
      visaTypes: {
        'Tourist Visa': {
          required: true,
          duration: '30 days',
          processingTime: '3-5 days',
          cost: '€18',
          documents: ['Valid passport', 'Visa application form', 'Passport photo', 'Travel itinerary'],
          validity: 'Single entry',
          notes: 'E-visa available online'
        }
      }
    },
    'Thailand': {
      country: 'Thailand',
      countryCode: 'TH',
      flag: '🇹🇭',
      visaTypes: {
        'Tourist Visa': {
          required: true,
          duration: '60 days',
          processingTime: '3-5 days',
          cost: '€22',
          documents: ['Valid passport', 'Visa application form', 'Passport photos', 'Travel itinerary', 'Bank statements'],
          validity: '60 days',
          notes: 'Can be extended for additional 30 days'
        }
      }
    },
    'Singapore': {
      country: 'Singapore',
      countryCode: 'SG',
      flag: '🇸🇬',
      visaTypes: {
        'Tourist Visa': {
          required: true,
          duration: '30 days',
          processingTime: '3-5 working days',
          cost: '€15',
          documents: ['Valid passport', 'Visa application form', 'Passport photos', 'Travel itinerary', 'Bank statements', 'Hotel bookings'],
          validity: '30 days',
          notes: 'E-visa available'
        }
      }
    },
    'United Arab Emirates': {
      country: 'United Arab Emirates',
      countryCode: 'AE',
      flag: '🇦🇪',
      visaTypes: {
        'Tourist Visa': {
          required: true,
          duration: '30 days',
          processingTime: '3-5 days',
          cost: '€38',
          documents: ['Valid passport', 'Visa application form', 'Passport photos', 'Travel itinerary', 'Hotel booking confirmation'],
          validity: '30 days',
          notes: 'Visa on arrival available for some passports'
        }
      }
    },
    'Italy': {
      country: 'Italy',
      countryCode: 'IT',
      flag: '🇮🇹',
      visaTypes: {
        'Tourist Visa': {
          required: true,
          duration: 'Up to 90 days',
          processingTime: '2 weeks',
          cost: '€80',
          documents: ['Valid passport', 'Schengen visa application', 'Passport photos', 'Travel itinerary', 'Bank statements', 'Travel insurance', 'Hotel bookings'],
          validity: 'As per Schengen visa',
          notes: 'Schengen visa allows travel to 26 European countries'
        }
      }
    },
    'Spain': {
      country: 'Spain',
      countryCode: 'ES',
      flag: '🇪🇸',
      visaTypes: {
        'Tourist Visa': {
          required: true,
          duration: 'Up to 90 days',
          processingTime: '2 weeks',
          cost: '€80',
          documents: ['Valid passport', 'Schengen visa application', 'Passport photos', 'Travel itinerary', 'Bank statements', 'Travel insurance', 'Hotel bookings'],
          validity: 'As per Schengen visa',
          notes: 'Schengen visa allows travel to 26 European countries'
        }
      }
    },
    'Switzerland': {
      country: 'Switzerland',
      countryCode: 'CH',
      flag: '🇨🇭',
      visaTypes: {
        'Tourist Visa': {
          required: true,
          duration: 'Up to 90 days',
          processingTime: '2 weeks',
          cost: '€80',
          documents: ['Valid passport', 'Schengen visa application', 'Passport photos', 'Travel itinerary', 'Bank statements', 'Travel insurance'],
          validity: 'As per Schengen visa',
          notes: 'Schengen visa allows travel to 26 European countries'
        }
      }
    },
    'Netherlands': {
      country: 'Netherlands',
      countryCode: 'NL',
      flag: '🇳🇱',
      visaTypes: {
        'Tourist Visa': {
          required: true,
          duration: 'Up to 90 days',
          processingTime: '2 weeks',
          cost: '€80',
          documents: ['Valid passport', 'Schengen visa application', 'Passport photos', 'Travel itinerary', 'Bank statements', 'Travel insurance', 'Hotel bookings'],
          validity: 'As per Schengen visa',
          notes: 'Schengen visa allows travel to 26 European countries'
        }
      }
    },
    'Belgium': {
      country: 'Belgium',
      countryCode: 'BE',
      flag: '🇧🇪',
      visaTypes: {
        'Tourist Visa': {
          required: true,
          duration: 'Up to 90 days',
          processingTime: '2 weeks',
          cost: '€80',
          documents: ['Valid passport', 'Schengen visa application', 'Passport photos', 'Travel itinerary', 'Bank statements', 'Travel insurance', 'Hotel bookings'],
          validity: 'As per Schengen visa',
          notes: 'Schengen visa allows travel to 26 European countries'
        }
      }
    },
    'Portugal': {
      country: 'Portugal',
      countryCode: 'PT',
      flag: '🇵🇹',
      visaTypes: {
        'Tourist Visa': {
          required: true,
          duration: 'Up to 90 days',
          processingTime: '2 weeks',
          cost: '€80',
          documents: ['Valid passport', 'Schengen visa application', 'Passport photos', 'Travel itinerary', 'Bank statements', 'Travel insurance', 'Hotel bookings'],
          validity: 'As per Schengen visa',
          notes: 'Schengen visa allows travel to 26 European countries'
        }
      }
    },
    'Greece': {
      country: 'Greece',
      countryCode: 'GR',
      flag: '🇬🇷',
      visaTypes: {
        'Tourist Visa': {
          required: true,
          duration: 'Up to 90 days',
          processingTime: '2 weeks',
          cost: '€80',
          documents: ['Valid passport', 'Schengen visa application', 'Passport photos', 'Travel itinerary', 'Bank statements', 'Travel insurance', 'Hotel bookings'],
          validity: 'As per Schengen visa',
          notes: 'Schengen visa allows travel to 26 European countries'
        }
      }
    },
    'Japan': {
      country: 'Japan',
      countryCode: 'JP',
      flag: '🇯🇵',
      visaTypes: {
        'Tourist Visa': {
          required: true,
          duration: '90 days',
          processingTime: '1-2 weeks',
          cost: '€25',
          documents: ['Valid passport', 'Visa application form', 'Passport photos', 'Travel itinerary', 'Bank statements', 'Flight bookings', 'Hotel confirmations'],
          validity: '90 days',
          notes: 'Multiple entry visa available'
        }
      }
    },
    'China': {
      country: 'China',
      countryCode: 'CN',
      flag: '🇨🇳',
      visaTypes: {
        'Tourist Visa': {
          required: true,
          duration: '30-90 days',
          processingTime: '1-2 weeks',
          cost: '€35',
          documents: ['Valid passport', 'Visa application form', 'Passport photos', 'Travel itinerary', 'Bank statements', 'Hotel bookings', 'Invitation letter (if applicable)'],
          validity: '30-90 days',
          notes: 'Single or multiple entry available'
        }
      }
    },
    'Malaysia': {
      country: 'Malaysia',
      countryCode: 'MY',
      flag: '🇲🇾',
      visaTypes: {
        'Tourist Visa': {
          required: true,
          duration: '30 days',
          processingTime: '3-5 working days',
          cost: '€15',
          documents: ['Valid passport', 'Visa application form', 'Passport photos', 'Travel itinerary', 'Bank statements', 'Hotel bookings'],
          validity: '30 days',
          notes: 'E-visa available online'
        }
      }
    },
    'Saudi Arabia': {
      country: 'Saudi Arabia',
      countryCode: 'SA',
      flag: '🇸🇦',
      visaTypes: {
        'Tourist Visa': {
          required: true,
          duration: '90 days',
          processingTime: '5-7 working days',
          cost: '€45',
          documents: ['Valid passport', 'Visa application form', 'Passport photos', 'Travel itinerary', 'Bank statements', 'Hotel bookings', 'Travel insurance'],
          validity: '90 days',
          notes: 'E-visa available for eligible nationals'
        }
      }
    },
    'South Korea': {
      country: 'South Korea',
      countryCode: 'KR',
      flag: '🇰🇷',
      visaTypes: {
        'Tourist Visa': {
          required: true,
          duration: '90 days',
          processingTime: '1-2 weeks',
          cost: '€30',
          documents: ['Valid passport', 'Visa application form', 'Passport photos', 'Travel itinerary', 'Bank statements', 'Hotel bookings'],
          validity: '90 days',
          notes: 'Multiple entry visa available for frequent travelers'
        }
      }
    }
  }
}

// List of countries with flags for selection
export const countriesWithFlags = [
  { name: 'United States', code: 'US', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺' },
  { name: 'France', code: 'FR', flag: '🇫🇷' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪' },
  { name: 'Italy', code: 'IT', flag: '🇮🇹' },
  { name: 'Spain', code: 'ES', flag: '🇪🇸' },
  { name: 'Switzerland', code: 'CH', flag: '🇨🇭' },
  { name: 'Netherlands', code: 'NL', flag: '🇳🇱' },
  { name: 'Belgium', code: 'BE', flag: '🇧🇪' },
  { name: 'Portugal', code: 'PT', flag: '🇵🇹' },
  { name: 'Greece', code: 'GR', flag: '🇬🇷' },
  { name: 'Turkey', code: 'TR', flag: '🇹🇷' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵' },
  { name: 'China', code: 'CN', flag: '🇨🇳' },
  { name: 'Thailand', code: 'TH', flag: '🇹🇭' },
  { name: 'Singapore', code: 'SG', flag: '🇸🇬' },
  { name: 'Malaysia', code: 'MY', flag: '🇲🇾' },
  { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪' },
  { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦' },
  { name: 'South Korea', code: 'KR', flag: '🇰🇷' }
]

// Get visa requirements for a nationality and destination
export function getVisaRequirements(nationality: string, destination: string): VisaRequirement | null {
  return visaData[nationality]?.[destination] || null
}

