# Amadeus API Setup Guide

## Required APIs

For the Euro Talent Travels flight search website, you need the following Amadeus APIs:

### 1. **Flight Offers Search** ✅ (Already Implemented)
   - **API Endpoint**: `v2/shopping/flight-offers`
   - **Purpose**: Search for flight offers from 400+ airlines
   - **Status**: Already integrated in `lib/flightApi.ts`
   - **Used for**: Getting flight search results with prices, schedules, and availability

### 2. **Airport & City Search** ✅ (Now Implemented)
   - **API Endpoint**: `v1/reference-data/locations`
   - **Purpose**: Autocomplete search for airports and cities
   - **Status**: Now integrated in `lib/airportApi.ts`
   - **Used for**: Airport/city autocomplete in search form

## How to Get API Credentials

1. **Sign Up**
   - Go to https://developers.amadeus.com/
   - Click "Sign Up" and create a free account
   - Verify your email

2. **Create App**
   - Go to "My Self-Service" → "My Apps"
   - Click "Create New App"
   - Fill in:
     - App Name: "Euro Talent Travels"
     - Description: "Flight search website"
     - Category: "Flight"
   - You'll get:
     - **API Key** (Client ID)
     - **API Secret** (Client Secret)

3. **Get Free Credits**
   - Amadeus offers free test credits for development
   - Test environment: `https://test.api.amadeus.com`
   - Production environment: `https://api.amadeus.com` (requires approval)

## Setup in Project

1. Create `.env.local` file in the root directory:
```env
AMADEUS_API_KEY=your_api_key_here
AMADEUS_API_SECRET=your_api_secret_here
AMADEUS_BASE_URL=https://test.api.amadeus.com
```

**IMPORTANT:** Do NOT use `NEXT_PUBLIC_` prefix! These keys are server-side only and must remain secret.

2. Restart your development server:
   ```bash
   npm run dev
   ```

## API Endpoints Used

### Flight Offers Search
```
GET https://test.api.amadeus.com/v2/shopping/flight-offers
```
**Parameters:**
- `originLocationCode` - IATA airport code (e.g., "ATQ")
- `destinationLocationCode` - IATA airport code (e.g., "LIS")
- `departureDate` - Date in YYYY-MM-DD format
- `returnDate` - (Optional) For round trips
- `adults` - Number of adult passengers
- `travelClass` - ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
- `currencyCode` - Currency (e.g., "EUR")
- `max` - Maximum number of results (default: 50)

### Airport & City Search
```
GET https://test.api.amadeus.com/v1/reference-data/locations
```
**Parameters:**
- `subType` - AIRPORT, CITY (or both: AIRPORT,CITY)
- `keyword` - Search query (minimum 2 characters)
- `max` - Maximum results (default: 10)

## Test vs Production

- **Test Environment**: Free, good for development, limited data
- **Production Environment**: Requires approval, real-time data, paid usage

Start with the test environment for development!

## Rate Limits

- Free tier has rate limits
- Be mindful of API calls
- Implement caching if needed

## Documentation

Full documentation available at:
- Flight Offers: https://developers.amadeus.com/self-service/category/flights/api-doc/flight-offers-search
- Airport Search: https://developers.amadeus.com/self-service/category/flights/api-doc/airport-and-city-search

