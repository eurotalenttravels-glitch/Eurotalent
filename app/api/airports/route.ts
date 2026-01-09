import { NextRequest, NextResponse } from "next/server";
import { getMockAirports } from "@/lib/airportApi";

async function getToken() {
  const base = process.env.AMADEUS_BASE_URL || "https://test.api.amadeus.com";
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.AMADEUS_API_KEY || "",
    client_secret: process.env.AMADEUS_API_SECRET || "",
  });

  const res = await fetch(`${base}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json?.error_description || "Token request failed");
  return json.access_token;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";

  if (!query || query.length < 2) {
    return NextResponse.json({ airports: [] });
  }

  // Check if API credentials are configured
  if (!process.env.AMADEUS_API_KEY || !process.env.AMADEUS_API_SECRET) {
    const mockAirports = getMockAirports(query);
    return NextResponse.json({ airports: mockAirports });
  }

  try {
    const base = process.env.AMADEUS_BASE_URL || "https://test.api.amadeus.com";
    const token = await getToken();

    const url = new URL(`${base}/v1/reference-data/locations`);
    url.searchParams.set("subType", "AIRPORT,CITY");
    url.searchParams.set("keyword", query);
    url.searchParams.set("max", "10");

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Amadeus API error:", data);
      const mockAirports = getMockAirports(query);
      return NextResponse.json({ airports: mockAirports });
    }

    return NextResponse.json({ airports: data.data || [] });
  } catch (e: any) {
    console.error("Error in airports API:", e);
    const mockAirports = getMockAirports(query);
    return NextResponse.json({ airports: mockAirports });
  }
}
