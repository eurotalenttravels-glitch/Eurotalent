'use client'

import { useState, useEffect } from 'react'

interface SiteContent {
  header: {
    logo: string
    navigation: Array<{ label: string; href: string }>
  }
  footer: {
    text: string
    links: Array<{ label: string; href: string }>
  }
  contact: {
    email: string
    phone: string
    address: string
    whatsapp: string
  }
  social: {
    facebook: string
    instagram: string
    twitter: string
    linkedin: string
  }
}

export default function ContentManagerPage() {
  const [content, setContent] = useState<SiteContent>({
    header: {
      logo: '✈️ Euro Talent Travels',
      navigation: [
        { label: 'Flights', href: '/' },
        { label: 'Visa', href: '/visa' },
        { label: 'Contact Us', href: '#' },
      ],
    },
    footer: {
      text: '© 2024 Euro Talent Travels. All rights reserved.',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Contact', href: '#' },
      ],
    },
    contact: {
      email: 'info@eurotalenttravels.com',
      phone: '+1 234 567 8900',
      address: '123 Travel Street, City, Country',
      whatsapp: '+1234567890',
    },
    social: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
    },
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      // In a real implementation, save to API
      // For now, just show success
      await new Promise(resolve => setTimeout(resolve, 500))
      setMessage({ type: 'success', text: 'Content saved successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save content' })
    } finally {
      setSaving(false)
    }
  }

  const updateField = (section: keyof SiteContent, field: string, value: any) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const addNavItem = () => {
    setContent((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        navigation: [...prev.header.navigation, { label: '', href: '' }],
      },
    }))
  }

  const removeNavItem = (index: number) => {
    setContent((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        navigation: prev.header.navigation.filter((_, i) => i !== index),
      },
    }))
  }

  const updateNavItem = (index: number, field: 'label' | 'href', value: string) => {
    setContent((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        navigation: prev.header.navigation.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      },
    }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Site Content Manager</h1>
        <p className="text-gray-600">Manage all site-wide content and settings</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Header Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Header</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo Text
            </label>
            <input
              type="text"
              value={content.header.logo}
              onChange={(e) => updateField('header', 'logo', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Navigation Links
              </label>
              <button
                onClick={addNavItem}
                className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
              >
                + Add Link
              </button>
            </div>
            <div className="space-y-2">
              {content.header.navigation.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updateNavItem(index, 'label', e.target.value)}
                    placeholder="Label"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) => updateNavItem(index, 'href', e.target.value)}
                    placeholder="URL"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <button
                    onClick={() => removeNavItem(index)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={content.contact.email}
              onChange={(e) => updateField('contact', 'email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={content.contact.phone}
              onChange={(e) => updateField('contact', 'phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp
            </label>
            <input
              type="tel"
              value={content.contact.whatsapp}
              onChange={(e) => updateField('contact', 'whatsapp', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={content.contact.address}
              onChange={(e) => updateField('contact', 'address', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Media Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook URL
            </label>
            <input
              type="url"
              value={content.social.facebook}
              onChange={(e) => updateField('social', 'facebook', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram URL
            </label>
            <input
              type="url"
              value={content.social.instagram}
              onChange={(e) => updateField('social', 'instagram', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter URL
            </label>
            <input
              type="url"
              value={content.social.twitter}
              onChange={(e) => updateField('social', 'twitter', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={content.social.linkedin}
              onChange={(e) => updateField('social', 'linkedin', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Footer</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Footer Text
            </label>
            <input
              type="text"
              value={content.footer.text}
              onChange={(e) => updateField('footer', 'text', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {saving ? 'Saving...' : '💾 Save All Changes'}
        </button>
      </div>
    </div>
  )
}
