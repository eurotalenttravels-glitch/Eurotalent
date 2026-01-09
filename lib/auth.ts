// Simple session-based authentication using cookies
// In production, use a proper auth library like NextAuth.js

import { cookies } from 'next/headers'

export interface AdminSession {
  isAuthenticated: boolean
  username?: string
}

// Default admin credentials (CHANGE THESE IN PRODUCTION!)
const DEFAULT_ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123' // Change this!
}

// Get admin credentials (from file if exists, otherwise default)
function getAdminCredentials(): { username: string; password: string } {
  if (typeof window !== 'undefined') {
    // Client-side: return default (will be fetched via API)
    return DEFAULT_ADMIN_CREDENTIALS
  }

  try {
    const { readFileSync, existsSync } = require('fs')
    const { join } = require('path')
    const authFile = join(process.cwd(), 'data', 'auth.json')
    
    if (existsSync(authFile)) {
      const content = readFileSync(authFile, 'utf-8')
      return JSON.parse(content)
    }
  } catch (error) {
    console.error('Error reading auth config:', error)
  }
  
  return DEFAULT_ADMIN_CREDENTIALS
}

const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_SECRET = 'your-secret-key-change-in-production' // Change this in production!

// Simple token generation (in production, use proper JWT)
function generateToken(username: string): string {
  return Buffer.from(`${username}:${Date.now()}`).toString('base64')
}

function verifyToken(token: string): { valid: boolean; username?: string } {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [username] = decoded.split(':')
    const credentials = getAdminCredentials()
    if (username === credentials.username) {
      return { valid: true, username }
    }
  } catch (error) {
    // Invalid token
  }
  return { valid: false }
}

// Server-side functions
export async function loginServer(username: string, password: string): Promise<boolean> {
  const credentials = getAdminCredentials()
  if (username === credentials.username && password === credentials.password) {
    const token = generateToken(username)
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    return true
  }
  return false
}

export async function logoutServer(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function getSessionServer(): Promise<AdminSession> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
    
    if (token) {
      const verified = verifyToken(token)
      if (verified.valid) {
        return {
          isAuthenticated: true,
          username: verified.username
        }
      }
    }
  } catch (error) {
    // Error reading cookies
  }
  
  return {
    isAuthenticated: false
  }
}

export async function isAuthenticatedServer(): Promise<boolean> {
  const session = await getSessionServer()
  return session.isAuthenticated
}

// Client-side helper (for API routes that need to check auth)
export function getSessionFromRequest(request: Request): AdminSession {
  // This is a fallback for API routes that receive Request objects
  // The main implementation uses cookies() from next/headers
  return { isAuthenticated: false }
}
