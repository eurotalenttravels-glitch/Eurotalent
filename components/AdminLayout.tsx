'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [pathname])

  const checkAuth = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/check', {
        cache: 'no-store',
        credentials: 'include'
      })
      const data = await response.json()
      const authenticated = data.session?.isAuthenticated || false
      setIsAuthenticated(authenticated)
      
      if (!authenticated && pathname !== '/admin/login') {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsAuthenticated(false)
      if (pathname !== '/admin/login') {
        router.push('/admin/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return null
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/homepage', label: 'Homepage', icon: '🏠' },
    { href: '/admin/nationalities', label: 'Nationalities', icon: '🌍' },
    { href: '/admin/visa', label: 'Visa Data', icon: '🛂' },
    { href: '/admin/content', label: 'Site Content', icon: '📝' },
    { href: 'https://www.dailysalesrecordapp.com/online/login.php', label: 'Daily Sale', icon: '💰', external: true },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-40">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
            >
              <span>🌐</span>
              <span>View Site</span>
              <span className="text-xs text-gray-400">↗</span>
            </Link>
            <Link
              href="/visa"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
            >
              <span>🛂</span>
              <span>Visa Page</span>
              <span className="text-xs text-gray-400">↗</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              href="/admin/settings"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
            >
              <span>⚙️</span>
              <span>Settings</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">Euro Talent Travels</p>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const isExternal = item.external || item.href.startsWith('http')
            
            if (isExternal) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-gray-700 hover:bg-gray-50"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                  <span className="ml-auto text-xs text-gray-400">↗</span>
                </a>
              )
            }
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 pt-16">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
