'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-200/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="text-lg sm:text-xl font-semibold text-[#1d1d1f] tracking-tight group-hover:opacity-70">
              ✈️ Euro Talent Travels
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link href="/" className="text-[#1d1d1f] hover:text-[#007aff] text-sm font-medium transition-colors">
              Flights
            </Link>
            <Link href="/visa" className="text-[#1d1d1f] hover:text-[#007aff] text-sm font-medium transition-colors">
              Visa
            </Link>
            <Link href="/contact" className="text-[#1d1d1f] hover:text-[#007aff] text-sm font-medium transition-colors">
              Contact Us
            </Link>
            <Link href="/admin/login" className="text-[#1d1d1f] hover:text-[#007aff] text-sm font-medium transition-colors">
              Admin
            </Link>
            <button className="bg-[#007aff] text-white px-4 lg:px-5 py-2 rounded-full text-sm font-medium hover:bg-[#0051d5] active:scale-95 transition-all shadow-apple-sm">
              Sign In
            </button>
          </nav>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#1d1d1f] p-2 -mr-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu Panel */}
            <nav className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 md:hidden">
              <div className="px-4 py-4 space-y-1">
                <Link 
                  href="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-[#1d1d1f] hover:bg-gray-50 rounded-lg text-base font-medium transition-colors"
                >
                  Flights
                </Link>
                <Link 
                  href="/visa" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-[#1d1d1f] hover:bg-gray-50 rounded-lg text-base font-medium transition-colors"
                >
                  Visa
                </Link>
                <Link 
                  href="/contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-[#1d1d1f] hover:bg-gray-50 rounded-lg text-base font-medium transition-colors"
                >
                  Contact Us
                </Link>
                <Link 
                  href="/admin/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-[#1d1d1f] hover:bg-gray-50 rounded-lg text-base font-medium transition-colors"
                >
                  Admin
                </Link>
                <button className="w-full mt-2 bg-[#007aff] text-white px-4 py-3 rounded-lg text-base font-medium hover:bg-[#0051d5] active:scale-95 transition-all shadow-apple-sm">
                  Sign In
                </button>
              </div>
            </nav>
          </>
        )}
      </div>
    </header>
  )
}

