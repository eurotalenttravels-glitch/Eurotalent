// Airline name mapping - maps IATA codes to full airline names
export const airlineNames: Record<string, string> = {
  'EK': 'Emirates',
  'LH': 'Lufthansa',
  'LX': 'Swiss International Air Lines',
  'AI': 'Air India',
  'KL': 'KLM Royal Dutch Airlines',
  'AF': 'Air France',
  'BA': 'British Airways',
  'VS': 'Virgin Atlantic',
  'QR': 'Qatar Airways',
  'EY': 'Etihad Airways',
  'TK': 'Turkish Airlines',
  'LO': 'LOT Polish Airlines',
  'TP': 'TAP Air Portugal',
  'AY': 'Finnair',
  'WY': 'Oman Air',
  'UA': 'United Airlines',
  'AA': 'American Airlines',
  'DL': 'Delta Air Lines',
  'AC': 'Air Canada',
  'QF': 'Qantas',
  'SQ': 'Singapore Airlines',
  'CX': 'Cathay Pacific',
  'NH': 'All Nippon Airways',
  'JL': 'Japan Airlines',
  'KE': 'Korean Air',
  'TG': 'Thai Airways',
  'VN': 'Vietnam Airlines',
  'GA': 'Garuda Indonesia',
  'MH': 'Malaysia Airlines',
  'PR': 'Philippine Airlines',
  'CA': 'Air China',
  'CZ': 'China Southern Airlines',
  'MU': 'China Eastern Airlines',
  'SU': 'Aeroflot',
  'FR': 'Ryanair',
  'U2': 'easyJet',
  'DY': 'Norwegian Air',
  'WN': 'Southwest Airlines',
  'B6': 'JetBlue Airways',
  'AS': 'Alaska Airlines',
  'F9': 'Frontier Airlines',
  'NK': 'Spirit Airlines',
}

export function getAirlineName(code: string): string {
  return airlineNames[code] || code
}

export function getAirlineCode(name: string): string {
  const entry = Object.entries(airlineNames).find(([_, fullName]) => 
    fullName.toLowerCase() === name.toLowerCase()
  )
  return entry ? entry[0] : name
}


