import { NextRequest, NextResponse } from 'next/server'
import { getVisaContent, saveVisaContent } from '@/lib/cmsData'
import { getSessionServer } from '@/lib/auth'

export async function GET() {
  try {
    const content = getVisaContent()
    return NextResponse.json({ content })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load visa content' },
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

    const content = await request.json()
    saveVisaContent(content)

    return NextResponse.json({ success: true, message: 'Visa content saved' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save visa content' },
      { status: 500 }
    )
  }
}
