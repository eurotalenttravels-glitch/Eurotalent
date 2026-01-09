import { NextRequest, NextResponse } from "next/server";
import { transformAmadeusFlights, Flight } from "@/lib/flightApi";
import { getMockFlights, FlightSearchParams } from "@/lib/flightApi";

// Mark this route as dynamic since it uses searchParams
export const dynamic = 'force-dynamic';

async function getToken() {
  const base = process.env.AMADEUS_BASE_URL || "https://test.api.amadeus.com";
  const apiKey = process.env.AMADEUS_API_KEY || "";
  const apiSecret = process.env.AMADEUS_API_SECRET || "";
  
  if (!apiKey || !apiSecret) {
    throw new Error("Amadeus API credentials are missing");
  }

  console.log(`🔑 Requesting token from: ${base}/v1/security/oauth2/token`);
  
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: apiKey,
    client_secret: apiSecret,
  });

  const res = await fetch(`${base}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok) {
    console.error(`❌ Token request failed - Status: ${res.status}`);
    console.error(`❌ Token request error:`, JSON.stringify(json, null, 2));
    throw new Error(json?.error_description || json?.error || "Token request failed");
  }
  
  console.log("✅ Token obtained successfully");
  return json.access_token;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const params: FlightSearchParams = {
      origin: searchParams.get("origin") || "",
      destination: searchParams.get("destination") || "",
      departureDate: searchParams.get("departuredate") || "",
      returnDate: searchParams.get("returndate") || undefined,
      adults: parseInt(searchParams.get("adults") || "1"),
      cabinClass: searchParams.get("class") || "Economy",
      tripType: (searchParams.get("route") === "roundtrip" ? "roundtrip" : "oneway") as "oneway" | "roundtrip" | "multicity",
    };

    // Check if API credentials are configured
    if (!process.env.AMADEUS_API_KEY || !process.env.AMADEUS_API_SECRET) {
      console.warn("⚠️  Amadeus API not configured, returning MOCK DATA");
      const mockFlights = getMockFlights(params);
      return NextResponse.json({ flights: mockFlights });
    }

    const base = process.env.AMADEUS_BASE_URL || "https://test.api.amadeus.com";
    console.log("🌐 Using Amadeus API - Fetching REAL-TIME flight data from:", base);
    console.log("📋 Search params:", { origin: params.origin, destination: params.destination, departureDate: params.departureDate });
    
    let token;
    try {
      token = await getToken();
      console.log("✅ Successfully obtained Amadeus API token");
    } catch (tokenError: any) {
      console.error("❌ Failed to get Amadeus API token:", tokenError.message);
      console.warn("⚠️  Falling back to MOCK DATA - Token authentication failed");
      const mockFlights = getMockFlights(params);
      return NextResponse.json({ flights: mockFlights });
    }

    const url = new URL(`${base}/v2/shopping/flight-offers`);
    url.searchParams.set("originLocationCode", params.origin);
    url.searchParams.set("destinationLocationCode", params.destination);
    url.searchParams.set("departureDate", params.departureDate);
    url.searchParams.set("adults", String(params.adults));
    url.searchParams.set("currencyCode", "EUR");
    url.searchParams.set("max", "50");

    if (params.returnDate && params.tripType === "roundtrip") {
      url.searchParams.set("returnDate", params.returnDate);
    }

    // Map cabin class
    const cabinClassMap: Record<string, string> = {
      Economy: "ECONOMY",
      "Premium Economy": "PREMIUM_ECONOMY",
      Business: "BUSINESS",
      First: "FIRST",
    };
    url.searchParams.set("travelClass", cabinClassMap[params.cabinClass] || "ECONOMY");

    console.log("🔍 Calling Amadeus API:", url.toString());
    
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error("❌ Amadeus API error - Status:", res.status);
      console.error("❌ Amadeus API error - Response:", JSON.stringify(data, null, 2));
      console.warn("⚠️  Falling back to MOCK DATA - API request failed");
      // Fallback to mock data on error
      const mockFlights = getMockFlights(params);
      return NextResponse.json({ flights: mockFlights });
    }

    if (!data.data || data.data.length === 0) {
      console.warn("⚠️  Amadeus API returned no flights for this route");
      console.warn("⚠️  Falling back to MOCK DATA - No flights found");
      const mockFlights = getMockFlights(params);
      return NextResponse.json({ flights: mockFlights });
    }

    const flights = transformAmadeusFlights(data.data || []);
    console.log(`✅ Successfully retrieved ${flights.length} REAL-TIME flights from Amadeus API`);
    const airlines = Array.from(new Set(flights.map(f => f.segments[0]?.carrierCode).filter(Boolean)));
    console.log(`📊 Airlines found: ${airlines.join(', ')}`);
    return NextResponse.json({ flights });
  } catch (e: any) {
    console.error("❌ Error in flights API:", e);
    console.warn("⚠️  Falling back to MOCK DATA due to error");
    // Fallback to mock data on error
    const searchParams = request.nextUrl.searchParams;
    const params: FlightSearchParams = {
      origin: searchParams.get("origin") || "",
      destination: searchParams.get("destination") || "",
      departureDate: searchParams.get("departuredate") || "",
      returnDate: searchParams.get("returndate") || undefined,
      adults: parseInt(searchParams.get("adults") || "1"),
      cabinClass: searchParams.get("class") || "Economy",
      tripType: "oneway",
    };
    const mockFlights = getMockFlights(params);
    return NextResponse.json({ flights: mockFlights });
  }
}
