# Euro Talent Travels - Flight Search Website

A modern flight search front-end built with Next.js, React, and Tailwind CSS.

## Features

- ✈️ Real-time flight search with API integration
- 🏠 Beautiful home page with hero section and search form
- 🔍 Advanced filtering (baggage, stops, price, time)
- 📊 Sort by cheapest/fastest
- 💳 Flight cards with detailed information
- ⏱️ Session timer
- 📱 Responsive design
- 💬 WhatsApp integration button

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Amadeus API credentials (optional - uses mock data if not configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. (Optional) Set up Amadeus API for real flight data:
   - Sign up at https://developers.amadeus.com/
   - Get your API Key and API Secret
   - Copy `.env.local.example` to `.env.local`
   - Add your credentials:
   ```
   AMADEUS_API_KEY=your_api_key
   AMADEUS_API_SECRET=your_api_secret
   AMADEUS_BASE_URL=https://test.api.amadeus.com
   ```
   
   **Note:** 
   - Do NOT use `NEXT_PUBLIC_` prefix - these are server-side only!
   - Restart dev server after adding credentials: `npm run dev`
   - Test token endpoint: http://localhost:3000/api/amadeus/token
   - Without API credentials, the app will use mock data for demonstration.

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── api/
│   │   └── flights/          # API route for flight search
│   ├── flight-search/        # Flight search results page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page with search form
│   └── globals.css           # Global styles
├── components/
│   ├── Header.tsx            # Site header with navigation
│   ├── FlightSearchForm.tsx  # Flight search form component
│   ├── SearchSummary.tsx     # Search criteria summary
│   ├── Filters.tsx           # Filter sidebar
│   ├── AirlineFilter.tsx     # Airline selection bar
│   └── FlightCard.tsx        # Individual flight card
├── lib/
│   └── flightApi.ts          # Flight API integration
└── package.json
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Amadeus API** - Flight search API (optional)

## Flight API Integration

The app uses Amadeus API for real-time flight search. If API credentials are not provided, it falls back to mock data.

### Alternative API Providers

You can easily switch to other flight APIs by modifying `lib/flightApi.ts`:
- Skyscanner API
- FlightAPI.io
- Aviationstack
- Or any other flight search API

## Customization

- Update brand name in `components/Header.tsx`
- Modify colors in `tailwind.config.js`
- Customize API integration in `lib/flightApi.ts`
- Update filters in `components/Filters.tsx`
- Change hero background image in `app/page.tsx`

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## License

MIT
