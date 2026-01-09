import { NextResponse } from 'next/server'
import { logoutServer } from '@/lib/auth'

export async function POST() {
  await logoutServer()
  return NextResponse.json({ success: true, message: 'Logged out successfully' })
}
