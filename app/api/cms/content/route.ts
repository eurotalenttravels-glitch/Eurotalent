import { NextRequest, NextResponse } from 'next/server'
import { getSiteContent, saveSiteContent } from '@/lib/cmsData'
import { getSessionServer } from '@/lib/auth'

export async function GET() {
  try {
    const content = getSiteContent()
    return NextResponse.json({ content })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load site content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionServer()
    if (!session.isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const content = await request.json()
    saveSiteContent(content)

    return NextResponse.json({ success: true, message: 'Site content saved successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save site content' },
      { status: 500 }
    )
  }
}
