import { NextRequest, NextResponse } from 'next/server'
import { getHomepageContent, saveHomepageContent } from '@/lib/cmsData'
import { getSessionServer } from '@/lib/auth'

export async function GET() {
  try {
    const content = getHomepageContent()
    return NextResponse.json({ content })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load homepage content' },
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
    saveHomepageContent(content)

    return NextResponse.json({ success: true, message: 'Homepage content saved' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save homepage content' },
      { status: 500 }
    )
  }
}
