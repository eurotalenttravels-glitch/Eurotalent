import { NextResponse } from 'next/server'
import { getSessionServer } from '@/lib/auth'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const AUTH_CONFIG_FILE = join(process.cwd(), 'data', 'auth.json')

// Default credentials (fallback)
const DEFAULT_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
}

interface AuthConfig {
  username: string
  password: string
}

function getAuthConfig(): AuthConfig {
  try {
    if (existsSync(AUTH_CONFIG_FILE)) {
      const content = readFileSync(AUTH_CONFIG_FILE, 'utf-8')
      return JSON.parse(content)
    }
  } catch (error) {
    console.error('Error reading auth config:', error)
  }
  
  return DEFAULT_CREDENTIALS
}

export async function GET() {
  try {
    // Check authentication
    const session = await getSessionServer()
    if (!session.isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const config = getAuthConfig()
    
    // Don't send password, only username
    return NextResponse.json({ 
      username: config.username,
      hasCustomPassword: existsSync(AUTH_CONFIG_FILE)
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get credentials' },
      { status: 500 }
    )
  }
}
