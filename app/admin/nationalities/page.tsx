'use client'

import { useState, useEffect } from 'react'
import { type Nationality } from '@/lib/cmsData'

interface NationalitiesData {
  nationalities: Nationality[]
}

export default function NationalitiesManagerPage() {
  const [data, setData] = useState<NationalitiesData>({ nationalities: [] })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [newNationality, setNewNationality] = useState<Partial<Nationality>>({
    name: '',
    code: '',
    flag: '',
    enabled: true,
    order: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const response = await fetch('/api/cms/nationalities')
      const result = await response.json()
      if (result.data) {
        // Sort by order
        result.data.nationalities = result.data.nationalities.sort((a: Nationality, b: Nationality) => a.order - b.order)
        setData(result.data)
      }
    } catch (error) {
      console.error('Failed to load nationalities:', error)
      setMessage({ type: 'error', text: 'Failed to load nationalities' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/cms/nationalities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Nationalities saved successfully!' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save nationalities' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while saving' })
    } finally {
      setSaving(false)
    }
  }

  const addNationality = () => {
    if (!newNationality.name?.trim()) {
      alert('Please enter a nationality name')
      return
    }

    const maxOrder = data.nationalities.length > 0 
      ? Math.max(...data.nationalities.map(n => n.order))
      : 0

    const nationality: Nationality = {
      name: newNationality.name.trim(),
      code: newNationality.code?.trim() || '',
      flag: newNationality.flag?.trim() || '',
      enabled: newNationality.enabled !== false,
      order: maxOrder + 1
    }

    setData({
      nationalities: [...data.nationalities, nationality]
    })

    setNewNationality({
      name: '',
      code: '',
      flag: '',
      enabled: true,
      order: 0
    })
  }

  const updateNationality = (index: number, field: keyof Nationality, value: any) => {
    const updated = { ...data }
    updated.nationalities[index] = {
      ...updated.nationalities[index],
      [field]: value
    }
    setData(updated)
  }

  const deleteNationality = (index: number) => {
    if (confirm(`Are you sure you want to delete "${data.nationalities[index].name}"?`)) {
      const updated = { ...data }
      updated.nationalities.splice(index, 1)
      setData(updated)
    }
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const updated = { ...data }
    const temp = updated.nationalities[index].order
    updated.nationalities[index].order = updated.nationalities[index - 1].order
    updated.nationalities[index - 1].order = temp
    updated.nationalities.sort((a, b) => a.order - b.order)
    setData(updated)
  }

  const moveDown = (index: number) => {
    if (index === data.nationalities.length - 1) return
    const updated = { ...data }
    const temp = updated.nationalities[index].order
    updated.nationalities[index].order = updated.nationalities[index + 1].order
    updated.nationalities[index + 1].order = temp
    updated.nationalities.sort((a, b) => a.order - b.order)
    setData(updated)
  }

  const toggleEnabled = (index: number) => {
    updateNationality(index, 'enabled', !data.nationalities[index].enabled)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  const enabledCount = data.nationalities.filter(n => n.enabled).length
  const disabledCount = data.nationalities.filter(n => !n.enabled).length

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nationality Manager</h1>
        <p className="text-gray-600">Manage all nationalities available on the visa page</p>
        <div className="mt-4 flex gap-4 text-sm">
          <span className="text-green-600">✓ Enabled: {enabledCount}</span>
          <span className="text-gray-400">✗ Disabled: {disabledCount}</span>
          <span className="text-blue-600">Total: {data.nationalities.length}</span>
        </div>
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

      {/* Add New Nationality */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">➕ Add New Nationality</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Nationality Name *
            </label>
            <input
              type="text"
              value={newNationality.name || ''}
              onChange={(e) => setNewNationality({ ...newNationality, name: e.target.value })}
              placeholder="e.g., India, United States"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              onKeyPress={(e) => e.key === 'Enter' && addNationality()}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Country Code
            </label>
            <input
              type="text"
              value={newNationality.code || ''}
              onChange={(e) => setNewNationality({ ...newNationality, code: e.target.value.toUpperCase() })}
              placeholder="IN, US, GB"
              maxLength={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Flag Emoji
            </label>
            <input
              type="text"
              value={newNationality.flag || ''}
              onChange={(e) => setNewNationality({ ...newNationality, flag: e.target.value })}
              placeholder="🇮🇳, 🇺🇸"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newNationality.enabled !== false}
                onChange={(e) => setNewNationality({ ...newNationality, enabled: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Enabled</span>
            </label>
          </div>
          <div className="flex items-end">
            <button
              onClick={addNationality}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium"
            >
              Add Nationality
            </button>
          </div>
        </div>
      </div>

      {/* Nationalities List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Nationalities</h2>
        
        {data.nationalities.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">No nationalities added yet.</p>
            <p className="text-sm">Add your first nationality above to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.nationalities.map((nationality, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                  nationality.enabled
                    ? 'bg-white border-gray-200'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                {/* Order Controls */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === data.nationalities.length - 1}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    ↓
                  </button>
                </div>

                {/* Flag */}
                <div className="text-2xl w-10 text-center">
                  {nationality.flag || '🏳️'}
                </div>

                {/* Name */}
                <div className="flex-1">
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={nationality.name}
                      onChange={(e) => updateNationality(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      onBlur={() => setEditingIndex(null)}
                      onKeyPress={(e) => e.key === 'Enter' && setEditingIndex(null)}
                      autoFocus
                    />
                  ) : (
                    <div
                      onClick={() => setEditingIndex(index)}
                      className="font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                      title="Click to edit"
                    >
                      {nationality.name}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    Code: {nationality.code || 'N/A'} | Order: {nationality.order}
                  </div>
                </div>

                {/* Code */}
                <div className="w-20">
                  <input
                    type="text"
                    value={nationality.code || ''}
                    onChange={(e) => updateNationality(index, 'code', e.target.value.toUpperCase())}
                    placeholder="Code"
                    maxLength={2}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Flag Input */}
                <div className="w-20">
                  <input
                    type="text"
                    value={nationality.flag || ''}
                    onChange={(e) => updateNationality(index, 'flag', e.target.value)}
                    placeholder="Flag"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Enabled Toggle */}
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={nationality.enabled}
                      onChange={() => toggleEnabled(index)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className={`text-sm ${nationality.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                      {nationality.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>

                {/* Delete */}
                <button
                  onClick={() => deleteNationality(index)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-all"
                  title="Delete nationality"
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {data.nationalities.length} nationality{data.nationalities.length !== 1 ? 'ies' : ''} configured
            {enabledCount > 0 && ` • ${enabledCount} enabled`}
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {saving ? 'Saving...' : '💾 Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
