'use client'

import { useState, useEffect } from 'react'
import { createWhatsAppUrl } from '@/lib/whatsappConfig'
import { getVisaRequirements } from '@/lib/visaDataWithCMS'

interface VisaQueryFormProps {
  nationality: string
  destination: string
  isVisible: boolean
  onClose: () => void
}

export default function VisaQueryForm({ nationality, destination, isVisible, onClose }: VisaQueryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    visaType: '',
    travelDate: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [availableVisaTypes, setAvailableVisaTypes] = useState<string[]>([])

  // Load visa types from data
  useEffect(() => {
    if (nationality && destination && isVisible) {
      getVisaRequirements(nationality, destination).then(requirements => {
        if (requirements && requirements.visaTypes) {
          setAvailableVisaTypes(Object.keys(requirements.visaTypes))
        } else {
          // Fallback to default types
          setAvailableVisaTypes([
            'Tourist Visa',
            'Business Visa',
            'Student Visa',
            'Work Visa',
            'Transit Visa',
            'Medical Visa',
            'Family Visa',
            'Diplomatic Visa',
            'Other'
          ])
        }
      }).catch(() => {
        // Fallback to default types
        setAvailableVisaTypes([
          'Tourist Visa',
          'Business Visa',
          'Student Visa',
          'Work Visa',
          'Transit Visa',
          'Medical Visa',
          'Family Visa',
          'Diplomatic Visa',
          'Other'
        ])
      })
    }
  }, [nationality, destination, isVisible])

  const formatWhatsAppMessage = () => {
    const travelDateFormatted = formData.travelDate 
      ? new Date(formData.travelDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      : 'Not specified'

    let message = `🛂 *Visa Query - Euro Talent Travels*\n\n`
    message += `*Route:* ${nationality} → ${destination}\n\n`
    message += `*Personal Information:*\n`
    message += `👤 Name: ${formData.name}\n`
    message += `📧 Email: ${formData.email}\n`
    message += `📱 Phone: ${formData.phone}\n\n`
    
    if (formData.visaType) {
      message += `*Visa Type:* ${formData.visaType}\n`
    }
    
    message += `*Expected Travel Date:* ${travelDateFormatted}\n\n`
    message += `*Message/Questions:*\n${formData.message}\n\n`
    message += `_This query was sent from Euro Talent Travels website_`

    return message
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Format the message
    const message = formatWhatsAppMessage()
    
    // Create WhatsApp URL
    const whatsappUrl = createWhatsAppUrl(message)
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank')
    
    // Show success message
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        visaType: '',
        travelDate: '',
        message: ''
      })
      onClose()
    }, 3000)
  }

  if (!isVisible && !destination) {
    return (
      <div className="bg-white rounded-2xl shadow-apple p-8 border border-gray-100/50">
        <div className="text-center py-8">
          <p className="text-gray-600 text-sm mb-4">Have questions about visa requirements?</p>
          <p className="text-xs text-gray-500 mb-4">Select a destination country first to view requirements and send queries</p>
        </div>
      </div>
    )
  }

  if (!isVisible && destination) {
    return (
      <div className="bg-white rounded-2xl shadow-apple p-8 border border-gray-100/50">
        <div className="text-center py-8">
          <p className="text-gray-600 text-sm mb-4">Have questions about visa requirements for {destination}?</p>
          <button
            onClick={() => {
              const event = new CustomEvent('showQueryForm', { detail: { show: true } })
              window.dispatchEvent(event)
            }}
            className="bg-[#007aff] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-[#0051d5] transition-all shadow-apple-sm active:scale-95"
          >
            Send a Query
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-apple border border-gray-100/50 overflow-hidden">
      <div className="bg-gradient-to-r from-[#007aff]/10 to-[#007aff]/5 p-6 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
              Send Visa Query
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {nationality} → {destination}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors active:scale-95"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {isSubmitted ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#1d1d1f] mb-2">Opening WhatsApp...</h3>
            <p className="text-sm text-gray-600 mb-4">Your query has been formatted and is ready to send via WhatsApp.</p>
            <p className="text-xs text-gray-500">If WhatsApp didn't open, please check your WhatsApp number configuration.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200/50 rounded-xl text-sm font-medium text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200/50 rounded-xl text-sm font-medium text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200/50 rounded-xl text-sm font-medium text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Visa Type</label>
                <select
                  value={formData.visaType}
                  onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200/50 rounded-xl text-sm font-medium text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all"
                >
                  <option value="">Select Visa Type</option>
                  {availableVisaTypes.length > 0 ? (
                    availableVisaTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))
                  ) : (
                    <>
                      <option value="Tourist Visa">Tourist Visa</option>
                      <option value="Business Visa">Business Visa</option>
                      <option value="Student Visa">Student Visa</option>
                      <option value="Work Visa">Work Visa</option>
                      <option value="Transit Visa">Transit Visa</option>
                      <option value="Medical Visa">Medical Visa</option>
                      <option value="Family Visa">Family Visa</option>
                      <option value="Diplomatic Visa">Diplomatic Visa</option>
                      <option value="Other">Other</option>
                    </>
                  )}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-2">Expected Travel Date</label>
                <input
                  type="date"
                  value={formData.travelDate}
                  onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200/50 rounded-xl text-sm sm:text-base font-medium text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all appearance-none [-webkit-appearance:none] [-moz-appearance:textfield]"
                  style={{
                    fontSize: '16px', // Prevents zoom on iOS
                    lineHeight: '1.5',
                    minHeight: '44px' // iOS touch target minimum
                  }}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-2">Message / Additional Questions *</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200/50 rounded-xl text-sm font-medium text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all resize-none"
                  placeholder="Please provide any additional information or questions about your visa application..."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#007aff] text-white px-6 py-3.5 rounded-xl text-sm font-medium hover:bg-[#0051d5] transition-all shadow-apple-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Send via WhatsApp
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3.5 bg-gray-50 text-[#1d1d1f] rounded-xl text-sm font-medium hover:bg-gray-100 transition-all border border-gray-200/50 active:scale-95"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  )
}

