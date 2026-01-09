import { NextRequest, NextResponse } from 'next/server'
import { getSessionServer } from '@/lib/auth'
import { readFileSync, writeFileSync, existsSync } from 'fs'
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
  
  // Return default and save it
  const defaultConfig = DEFAULT_CREDENTIALS
  saveAuthConfig(defaultConfig)
  return defaultConfig
}

function saveAuthConfig(config: AuthConfig): void {
  try {
    const fs = require('fs')
    const path = require('path')
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    writeFileSync(AUTH_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error saving auth config:', error)
    throw error
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

    const { currentPassword, newPassword, confirmPassword } = await request.json()

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'New passwords do not match' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Get current auth config
    const authConfig = getAuthConfig()

    // Verify current password
    if (authConfig.password !== currentPassword) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Update password
    authConfig.password = newPassword
    saveAuthConfig(authConfig)

    return NextResponse.json({ 
      success: true, 
      message: 'Password changed successfully' 
    })
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    )
  }
}
