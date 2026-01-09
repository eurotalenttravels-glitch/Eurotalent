'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { createWhatsAppUrl } from '@/lib/whatsappConfig'

interface ContactInfo {
  email: string
  phone: string
  address: string
  whatsapp: string
}

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: 'info@eurotalenttravels.com',
    phone: '+1 234 567 8900',
    address: '123 Travel Street, City, Country',
    whatsapp: '+351920076707',
  })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    loadContactInfo()
  }, [])

  const loadContactInfo = async () => {
    try {
      const response = await fetch('/api/cms/content')
      const data = await response.json()
      if (data.content && data.content.contact) {
        setContactInfo(data.content.contact)
      }
    } catch (error) {
      console.error('Failed to load contact info:', error)
    }
  }

  const formatWhatsAppMessage = () => {
    let message = `📧 *Contact Form - Euro Talent Travels*\n\n`
    message += `*Personal Information:*\n`
    message += `👤 Name: ${formData.name}\n`
    message += `📧 Email: ${formData.email}\n`
    message += `📱 Phone: ${formData.phone}\n\n`
    message += `*Subject:* ${formData.subject || 'General Inquiry'}\n\n`
    message += `*Message:*\n${formData.message}\n\n`
    message += `_This message was sent from Euro Talent Travels website_`

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
        subject: '',
        message: ''
      })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      <Header />
      
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600">
              Get in touch with us. We're here to help with all your travel needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-apple p-6 sm:p-8 border border-gray-100/50">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">📧</div>
                  <div>
                    <h3 className="font-semibold text-[#1d1d1f] mb-1">Email</h3>
                    <a 
                      href={`mailto:${contactInfo.email}`} 
                      className="text-[#007aff] hover:underline"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-2xl">📱</div>
                  <div>
                    <h3 className="font-semibold text-[#1d1d1f] mb-1">Phone</h3>
                    <a 
                      href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} 
                      className="text-[#007aff] hover:underline"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-2xl">💬</div>
                  <div>
                    <h3 className="font-semibold text-[#1d1d1f] mb-1">WhatsApp</h3>
                    <a 
                      href={`https://wa.me/${contactInfo.whatsapp.replace(/[\s\+\-\(\)]/g, '')}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#007aff] hover:underline"
                    >
                      Chat with us on WhatsApp
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-2xl">📍</div>
                  <div>
                    <h3 className="font-semibold text-[#1d1d1f] mb-1">Address</h3>
                    <p className="text-gray-600 whitespace-pre-line">
                      {contactInfo.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-[#1d1d1f] mb-4">Business Hours</h3>
                <div className="space-y-2 text-gray-600">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-apple p-6 sm:p-8 border border-gray-100/50">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] mb-6">Send us a Message</h2>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-xl font-semibold text-[#1d1d1f] mb-2">Message Sent!</h3>
                  <p className="text-sm text-gray-600 mb-4">Your message has been formatted and is ready to send via WhatsApp.</p>
                  <p className="text-xs text-gray-500">If WhatsApp didn't open, please check your WhatsApp number configuration.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Full Name *
                    </label>
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
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Email Address *
                    </label>
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
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Phone Number *
                    </label>
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
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200/50 rounded-xl text-sm font-medium text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all"
                      placeholder="General Inquiry"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200/50 rounded-xl text-sm font-medium text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all resize-none"
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#007aff] text-white px-6 py-3.5 rounded-xl text-sm font-medium hover:bg-[#0051d5] transition-all shadow-apple-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Opening WhatsApp...
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
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
