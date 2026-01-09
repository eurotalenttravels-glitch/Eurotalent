import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.AMADEUS_API_KEY;
  const secret = process.env.AMADEUS_API_SECRET;
  const base = process.env.AMADEUS_BASE_URL || "https://test.api.amadeus.com";

  if (!key || !secret) {
    return NextResponse.json({ error: "Missing API key/secret in .env.local" }, { status: 500 });
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: key,
    client_secret: secret,
  });

  const res = await fetch(`${base}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}


