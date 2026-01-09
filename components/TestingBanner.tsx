'use client'

import { useState } from 'react'

export default function TestingBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-white shadow-apple-hover border-t border-orange-600/30 backdrop-blur-sm animate-slide-up">
      <div className="container mx-auto px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-semibold text-sm tracking-tight whitespace-nowrap">Testing Environment</span>
            </div>
            <div className="hidden lg:block text-xs text-white/95 font-medium truncate">
              This site is currently under development and not published. Data shown may not be accurate.
            </div>
            <div className="lg:hidden text-xs text-white/95 font-medium truncate">
              Under development - Data may not be accurate
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-1.5 hover:bg-white/20 rounded-xl transition-all active:scale-95"
            aria-label="Dismiss banner"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

