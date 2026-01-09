'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import TravelSearchForm from '@/components/TravelSearchForm'

interface HomepageContent {
  heroTitle: string
  heroSubtitle: string
  heroBackgroundImage: string
  metaTitle: string
  metaDescription: string
}

export default function Home() {
  const [content, setContent] = useState<HomepageContent>({
    heroTitle: "Explore the World's With Euro Talent Travels",
    heroSubtitle: "Your Trusted Online Travel Partner",
    heroBackgroundImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
    metaTitle: "Euro Talent Travels - Flight Search",
    metaDescription: "Book flights with Euro Talent Travels - Your trusted online travel partner"
  })

  useEffect(() => {
    // Load content from CMS
    fetch('/api/cms/homepage')
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          setContent(data.content)
        }
      })
      .catch(err => {
        console.error('Failed to load homepage content:', err)
        // Use default content on error
      })
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <div 
        className="flex-1 relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${content.heroBackgroundImage})`
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 flex flex-col items-center justify-center min-h-[500px] sm:min-h-[600px]">
          {/* Title */}
          <div className="text-center mb-8 sm:mb-12 px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              {content.heroTitle}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90">
              {content.heroSubtitle}
            </p>
          </div>

          {/* Travel Search Form */}
          <div className="w-full max-w-6xl px-4">
            <TravelSearchForm />
          </div>
        </div>
      </div>
    </div>
  )
}
