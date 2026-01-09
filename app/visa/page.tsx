'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { countriesWithFlags } from '@/lib/visaData'
import { getVisaRequirements, getNationalities } from '@/lib/visaDataWithCMS'
import { type VisaRequirement } from '@/lib/visaData'
import VisaRequirements from '@/components/VisaRequirements'
import VisaQueryForm from '@/components/VisaQueryForm'

export default function VisaPage() {
  const [selectedNationality, setSelectedNationality] = useState('')
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null)
  const [showRequirements, setShowRequirements] = useState(false)
  const [showQueryForm, setShowQueryForm] = useState(false)
  const [visaRequirements, setVisaRequirements] = useState<VisaRequirement | null>(null)
  const [nationalityOptions, setNationalityOptions] = useState<string[]>([])

  // Load nationalities from CMS only
  useEffect(() => {
    const loadNationalities = async () => {
      try {
        const response = await fetch('/api/cms/nationalities')
        const result = await response.json()
        if (result.data && result.data.nationalities) {
          // Get only enabled nationalities, sorted by order
          const enabled = result.data.nationalities
            .filter((n: any) => n.enabled)
            .sort((a: any, b: any) => a.order - b.order)
            .map((n: any) => n.name)
          
          setNationalityOptions(enabled)
          
          // Set default selection to first nationality if available
          if (enabled.length > 0 && !selectedNationality) {
            setSelectedNationality(enabled[0])
          }
        }
      } catch (error) {
        console.error('Failed to load nationalities:', error)
        // Fallback: try to get from visa data
        getNationalities().then(nationalities => {
          if (nationalities.length > 0) {
            setNationalityOptions(nationalities)
            if (!selectedNationality) {
              setSelectedNationality(nationalities[0])
            }
          }
        })
      }
    }
    
    loadNationalities()
  }, [])

  // Load visa requirements when destination changes
  useEffect(() => {
    if (selectedDestination && selectedNationality) {
      getVisaRequirements(selectedNationality, selectedDestination).then(requirements => {
        setVisaRequirements(requirements)
      }).catch(err => {
        console.error('Failed to load visa requirements:', err)
        setVisaRequirements(null)
      })
    } else {
      setVisaRequirements(null)
    }
  }, [selectedNationality, selectedDestination])

  const handleFlagClick = (countryCode: string, countryName: string) => {
    setSelectedDestination(countryName)
    setShowRequirements(true)
    setShowQueryForm(false)
    // Scroll to requirements section
    setTimeout(() => {
      document.getElementById('requirements-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  // Listen for query form show event
  useEffect(() => {
    const handleShowQuery = () => {
      setShowQueryForm(true)
      setTimeout(() => {
        document.getElementById('query-form-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
    window.addEventListener('showQueryForm', handleShowQuery as EventListener)
    return () => window.removeEventListener('showQueryForm', handleShowQuery as EventListener)
  }, [])

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#007aff]/10 via-white to-[#007aff]/5 border-b border-gray-200/50">
        <div className="container mx-auto px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-semibold text-[#1d1d1f] mb-4 tracking-tight">
              Visa Services
            </h1>
            <p className="text-lg text-gray-600 mb-8 font-medium">
              Select your nationality and destination country to view visa requirements
            </p>
          </div>
        </div>
      </div>

      {/* Nationality Selection */}
      <div className="container mx-auto px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-apple p-8 border border-gray-100/50 mb-8">
            <label className="block text-xs font-medium text-gray-600 mb-4">Select Your Nationality</label>
            {nationalityOptions.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-800">
                  No nationalities configured yet. Please add nationalities in the admin panel.
                </p>
              </div>
            ) : (
              <select
                value={selectedNationality}
                onChange={(e) => {
                  setSelectedNationality(e.target.value)
                  setSelectedDestination(null)
                  setShowRequirements(false)
                }}
                className="w-full md:w-auto px-5 py-3 bg-gray-50 border border-gray-200/50 rounded-xl text-sm font-medium text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all"
              >
                {nationalityOptions.map((nationality) => (
                  <option key={nationality} value={nationality}>{nationality}</option>
                ))}
              </select>
            )}
          </div>

          {/* Country Flags Grid */}
          <div className="bg-white rounded-2xl shadow-apple p-8 border border-gray-100/50 mb-8">
            <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-6 tracking-tight">
              Select Destination Country
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Click on a country flag to view visa requirements for {selectedNationality} nationals
            </p>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {countriesWithFlags.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleFlagClick(country.code, country.name)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all active:scale-95 hover:shadow-apple-sm ${
                    selectedDestination === country.name
                      ? 'bg-[#007aff]/10 border-[#007aff] shadow-apple-sm'
                      : 'bg-gray-50 border-gray-200/50 hover:border-[#007aff]/50'
                  }`}
                >
                  <div className="text-4xl mb-2">{country.flag}</div>
                  <div className="text-xs font-medium text-[#1d1d1f] text-center leading-tight">
                    {country.name.split(' ')[0]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Visa Requirements Section */}
          {showRequirements && visaRequirements && (
            <div id="requirements-section" className="mb-8">
              <VisaRequirements
                requirement={visaRequirements}
                nationality={selectedNationality}
                destination={selectedDestination!}
                onSendQuery={() => {
                  setShowQueryForm(true)
                  document.getElementById('query-form-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
              />
            </div>
          )}

          {/* Query Form Section */}
          <div id="query-form-section" className="mb-8">
            <VisaQueryForm
              nationality={selectedNationality}
              destination={selectedDestination || ''}
              isVisible={showQueryForm}
              onClose={() => setShowQueryForm(false)}
            />
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Fast Processing */}
            <div className="bg-white rounded-2xl shadow-apple p-6 border border-gray-100/50">
              <div className="w-12 h-12 rounded-full bg-[#007aff]/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#007aff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2 tracking-tight">Fast Processing</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Quick visa processing with expert assistance
              </p>
            </div>

            {/* Expert Guidance */}
            <div className="bg-white rounded-2xl shadow-apple p-6 border border-gray-100/50">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2 tracking-tight">Expert Guidance</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Professional support throughout your application
              </p>
            </div>

            {/* Secure & Reliable */}
            <div className="bg-white rounded-2xl shadow-apple p-6 border border-gray-100/50">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2 tracking-tight">Secure & Reliable</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Safe and secure visa application process
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

