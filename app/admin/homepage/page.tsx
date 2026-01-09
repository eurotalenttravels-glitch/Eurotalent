'use client'

import { useState, useEffect } from 'react'

interface HomepageContent {
  heroTitle: string
  heroSubtitle: string
  heroBackgroundImage: string
  metaTitle: string
  metaDescription: string
}

export default function HomepageEditorPage() {
  const [content, setContent] = useState<HomepageContent>({
    heroTitle: '',
    heroSubtitle: '',
    heroBackgroundImage: '',
    metaTitle: '',
    metaDescription: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const response = await fetch('/api/cms/homepage')
      const data = await response.json()
      if (data.content) {
        setContent(data.content)
      }
    } catch (error) {
      console.error('Failed to load content:', error)
      setMessage({ type: 'error', text: 'Failed to load content' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/cms/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Content saved successfully!' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save content' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while saving' })
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof HomepageContent, value: string) => {
    setContent((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Homepage Editor</h1>
        <p className="text-gray-600">Edit your homepage content and appearance</p>
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Hero Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hero Title
          </label>
          <input
            type="text"
            value={content.heroTitle}
            onChange={(e) => handleChange('heroTitle', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Enter hero title"
          />
        </div>

        {/* Hero Subtitle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hero Subtitle
          </label>
          <input
            type="text"
            value={content.heroSubtitle}
            onChange={(e) => handleChange('heroSubtitle', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Enter hero subtitle"
          />
        </div>

        {/* Background Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Image URL
          </label>
          <input
            type="url"
            value={content.heroBackgroundImage}
            onChange={(e) => handleChange('heroBackgroundImage', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="https://example.com/image.jpg"
          />
          <p className="mt-2 text-sm text-gray-500">
            Enter a full URL to an image. You can use Unsplash, your own hosting, or any image URL.
          </p>
          {content.heroBackgroundImage && (
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">Preview:</div>
              <div
                className="w-full h-48 rounded-lg bg-cover bg-center border border-gray-200"
                style={{ backgroundImage: `url(${content.heroBackgroundImage})` }}
              />
            </div>
          )}
        </div>

        {/* Meta Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Page Title (SEO)
          </label>
          <input
            type="text"
            value={content.metaTitle}
            onChange={(e) => handleChange('metaTitle', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Enter page title for SEO"
          />
        </div>

        {/* Meta Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description (SEO)
          </label>
          <textarea
            value={content.metaDescription}
            onChange={(e) => handleChange('metaDescription', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Enter meta description for SEO"
          />
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Live Preview</h2>
        <div
          className="relative bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden"
          style={{
            backgroundImage: `url(${content.heroBackgroundImage || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80'})`,
            minHeight: '400px',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative z-10 p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {content.heroTitle || 'Your Title Here'}
            </h1>
            <p className="text-xl text-white/90">
              {content.heroSubtitle || 'Your Subtitle Here'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
