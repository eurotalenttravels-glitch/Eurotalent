import { NextRequest, NextResponse } from 'next/server'
import { getNationalitiesData, saveNationalitiesData } from '@/lib/cmsData'
import { getSessionServer } from '@/lib/auth'

export async function GET() {
  try {
    const data = getNationalitiesData()
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load nationalities' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSessionServer()
    if (!session.isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    saveNationalitiesData(data)

    return NextResponse.json({ success: true, message: 'Nationalities saved successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save nationalities' },
      { status: 500 }
    )
  }
}
