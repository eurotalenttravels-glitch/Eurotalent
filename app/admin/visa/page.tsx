'use client'

import { useState, useEffect } from 'react'
import { countriesWithFlags } from '@/lib/visaData'

interface VisaType {
  required: boolean
  duration: string
  processingTime: string
  cost: string
  documents: string[]
  validity: string
  notes?: string
}

interface VisaRequirement {
  country: string
  countryCode: string
  flag: string
  visaTypes: {
    [key: string]: VisaType
  }
}

interface VisaContent {
  [nationality: string]: {
    [destination: string]: VisaRequirement
  }
}

export default function VisaEditorPage() {
  const [content, setContent] = useState<VisaContent>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  // Form state
  const [selectedNationality, setSelectedNationality] = useState('')
  const [selectedDestination, setSelectedDestination] = useState('')
  const [editingVisa, setEditingVisa] = useState<VisaRequirement | null>(null)
  const [newNationality, setNewNationality] = useState('')
  const [newDestination, setNewDestination] = useState('')
  const [newVisaTypeName, setNewVisaTypeName] = useState('')
  const [editingVisaTypeName, setEditingVisaTypeName] = useState<{ [key: string]: string }>({})
  
  // UI State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: 'nationality' | 'entry' | 'visaType'; name: string } | null>(null)
  const [availableNationalities, setAvailableNationalities] = useState<Array<{ name: string; flag?: string }>>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadContent()
    loadNationalities()
  }, [])

  const loadNationalities = async () => {
    try {
      const response = await fetch('/api/cms/nationalities')
      const result = await response.json()
      if (result.data && result.data.nationalities) {
        const enabled = result.data.nationalities
          .filter((n: any) => n.enabled)
          .sort((a: any, b: any) => a.order - b.order)
          .map((n: any) => ({ name: n.name, flag: n.flag }))
        setAvailableNationalities(enabled)
      }
    } catch (error) {
      console.error('Failed to load nationalities:', error)
    }
  }

  const loadContent = async () => {
    try {
      const response = await fetch('/api/cms/visa')
      const data = await response.json()
      if (data.content && Object.keys(data.content).length > 0) {
        setContent(data.content)
        // Set initial destination
        const nationalities = Object.keys(data.content)
        if (nationalities.length > 0) {
          setSelectedNationality(nationalities[0])
          const destinations = Object.keys(data.content[nationalities[0]] || {})
          if (destinations.length > 0) {
            setSelectedDestination(destinations[0])
            setEditingVisa(data.content[nationalities[0]][destinations[0]])
          }
        }
      }
    } catch (error) {
      console.error('Failed to load content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/cms/visa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Visa data saved successfully!' })
        setTimeout(() => setMessage(null), 5000)
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save content' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while saving' })
    } finally {
      setSaving(false)
    }
  }

  const handleNationalityChange = (nationality: string) => {
    setSelectedNationality(nationality)
    const destinations = Object.keys(content[nationality] || {})
    if (destinations.length > 0) {
      setSelectedDestination(destinations[0])
      setEditingVisa(content[nationality][destinations[0]])
    } else {
      setSelectedDestination('')
      setEditingVisa(null)
    }
  }

  const handleDestinationChange = (destination: string) => {
    setSelectedDestination(destination)
    setEditingVisa(content[selectedNationality]?.[destination] || null)
  }

  const updateVisaField = (field: keyof VisaRequirement, value: any) => {
    if (!selectedNationality || !selectedDestination) return

    setContent((prev) => {
      const updated = { ...prev }
      if (!updated[selectedNationality]) {
        updated[selectedNationality] = {}
      }
      if (!updated[selectedNationality][selectedDestination]) {
        updated[selectedNationality][selectedDestination] = {
          country: selectedDestination,
          countryCode: '',
          flag: '🇺🇳',
          visaTypes: {},
        }
      }
      updated[selectedNationality][selectedDestination] = {
        ...updated[selectedNationality][selectedDestination],
        [field]: value,
      }
      setEditingVisa(updated[selectedNationality][selectedDestination])
      return updated
    })
  }

  const updateVisaType = (visaTypeName: string, field: keyof VisaType, value: any) => {
    if (!selectedNationality || !selectedDestination) return

    setContent((prev) => {
      const updated = { ...prev }
      if (!updated[selectedNationality][selectedDestination].visaTypes[visaTypeName]) {
        updated[selectedNationality][selectedDestination].visaTypes[visaTypeName] = {
          required: true,
          duration: '',
          processingTime: '',
          cost: '',
          documents: [],
          validity: '',
        }
      }
      updated[selectedNationality][selectedDestination].visaTypes[visaTypeName] = {
        ...updated[selectedNationality][selectedDestination].visaTypes[visaTypeName],
        [field]: value,
      }
      setEditingVisa(updated[selectedNationality][selectedDestination])
      return updated
    })
  }

  const addDocument = (visaTypeName: string, document: string) => {
    if (!document.trim()) return
    const currentDocs = editingVisa?.visaTypes[visaTypeName]?.documents || []
    updateVisaType(visaTypeName, 'documents', [...currentDocs, document])
  }

  const removeDocument = (visaTypeName: string, index: number) => {
    const currentDocs = editingVisa?.visaTypes[visaTypeName]?.documents || []
    updateVisaType(visaTypeName, 'documents', currentDocs.filter((_, i) => i !== index))
  }

  const addNewVisaEntry = () => {
    if (!newNationality || !newDestination) {
      setMessage({ type: 'error', text: 'Please enter both nationality and destination' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    const countryInfo = countriesWithFlags.find((c) => c.name === newDestination)
    
    setContent((prev) => {
      const updated = { ...prev }
      if (!updated[newNationality]) {
        updated[newNationality] = {}
      }
      updated[newNationality][newDestination] = {
        country: newDestination,
        countryCode: countryInfo?.code || '',
        flag: countryInfo?.flag || '🇺🇳',
        visaTypes: {
          'Tourist Visa': {
            required: true,
            duration: '',
            processingTime: '',
            cost: '',
            documents: [],
            validity: '',
          },
        },
      }
      return updated
    })

    setSelectedNationality(newNationality)
    setSelectedDestination(newDestination)
    setEditingVisa(content[newNationality]?.[newDestination] || null)
    setNewNationality('')
    setNewDestination('')
    setMessage({ type: 'success', text: `✅ Added new visa entry: ${newNationality} → ${newDestination}` })
    setTimeout(() => setMessage(null), 3000)
  }

  const confirmDelete = (type: 'nationality' | 'entry' | 'visaType', name: string) => {
    setShowDeleteConfirm({ type, name })
  }

  const executeDelete = () => {
    if (!showDeleteConfirm) return

    const { type, name } = showDeleteConfirm

    if (type === 'nationality') {
      deleteNationality()
    } else if (type === 'entry') {
      deleteVisaEntry()
    } else if (type === 'visaType') {
      deleteVisaType(name)
    }

    setShowDeleteConfirm(null)
  }

  const deleteVisaEntry = () => {
    if (!selectedNationality || !selectedDestination) return
    
    setContent((prev) => {
      const updated = { ...prev }
      if (updated[selectedNationality] && updated[selectedNationality][selectedDestination]) {
        delete updated[selectedNationality][selectedDestination]
        
        if (Object.keys(updated[selectedNationality]).length === 0) {
          delete updated[selectedNationality]
          const nationalities = Object.keys(updated)
          if (nationalities.length > 0) {
            setSelectedNationality(nationalities[0])
            const destinations = Object.keys(updated[nationalities[0]] || {})
            if (destinations.length > 0) {
              setSelectedDestination(destinations[0])
              setEditingVisa(updated[nationalities[0]][destinations[0]])
            } else {
              setSelectedDestination('')
              setEditingVisa(null)
            }
          } else {
            setSelectedNationality('')
            setSelectedDestination('')
            setEditingVisa(null)
          }
        } else {
          const destinations = Object.keys(updated[selectedNationality] || {})
          if (destinations.length > 0) {
            setSelectedDestination(destinations[0])
            setEditingVisa(updated[selectedNationality][destinations[0]])
          } else {
            setSelectedDestination('')
            setEditingVisa(null)
          }
        }
      }
      return updated
    })
    setMessage({ type: 'success', text: '✅ Visa entry deleted successfully' })
    setTimeout(() => setMessage(null), 3000)
  }

  const deleteNationality = () => {
    if (!selectedNationality) return
    
    setContent((prev) => {
      const updated = { ...prev }
      delete updated[selectedNationality]
      
      const nationalities = Object.keys(updated)
      if (nationalities.length > 0) {
        setSelectedNationality(nationalities[0])
        const destinations = Object.keys(updated[nationalities[0]] || {})
        if (destinations.length > 0) {
          setSelectedDestination(destinations[0])
          setEditingVisa(updated[nationalities[0]][destinations[0]])
        } else {
          setSelectedDestination('')
          setEditingVisa(null)
        }
      } else {
        setSelectedNationality('')
        setSelectedDestination('')
        setEditingVisa(null)
      }
      return updated
    })
    setMessage({ type: 'success', text: `✅ Deleted all visa entries for ${selectedNationality}` })
    setTimeout(() => setMessage(null), 3000)
  }

  const addVisaType = () => {
    if (!newVisaTypeName.trim()) {
      setMessage({ type: 'error', text: 'Please enter a visa type name' })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    
    if (!selectedNationality || !selectedDestination) {
      setMessage({ type: 'error', text: 'Please select a nationality and destination first' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    setContent((prev) => {
      const updated = { ...prev }
      if (!updated[selectedNationality][selectedDestination].visaTypes[newVisaTypeName]) {
        updated[selectedNationality][selectedDestination].visaTypes[newVisaTypeName] = {
          required: true,
          duration: '',
          processingTime: '',
          cost: '',
          documents: [],
          validity: '',
        }
      }
      setEditingVisa(updated[selectedNationality][selectedDestination])
      setNewVisaTypeName('')
      setMessage({ type: 'success', text: `✅ Added visa type: ${newVisaTypeName}` })
      setTimeout(() => setMessage(null), 3000)
      return updated
    })
  }

  const deleteVisaType = (visaTypeName: string) => {
    if (!selectedNationality || !selectedDestination) return
    
    setContent((prev) => {
      const updated = { ...prev }
      if (updated[selectedNationality][selectedDestination].visaTypes[visaTypeName]) {
        delete updated[selectedNationality][selectedDestination].visaTypes[visaTypeName]
      }
      setEditingVisa(updated[selectedNationality][selectedDestination])
      return updated
    })
    setMessage({ type: 'success', text: `✅ Deleted visa type: ${visaTypeName}` })
    setTimeout(() => setMessage(null), 3000)
  }

  const renameVisaType = (oldName: string, newName: string) => {
    if (!newName.trim() || newName === oldName) return
    
    if (!selectedNationality || !selectedDestination) return

    setContent((prev) => {
      const updated = { ...prev }
      const visaType = updated[selectedNationality][selectedDestination].visaTypes[oldName]
      if (visaType) {
        updated[selectedNationality][selectedDestination].visaTypes[newName] = visaType
        delete updated[selectedNationality][selectedDestination].visaTypes[oldName]
      }
      setEditingVisa(updated[selectedNationality][selectedDestination])
      setEditingVisaTypeName({})
      return updated
    })
    setMessage({ type: 'success', text: `✅ Renamed visa type: ${oldName} → ${newName}` })
    setTimeout(() => setMessage(null), 3000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  const nationalities = Object.keys(content)
  const filteredNationalities = searchTerm 
    ? nationalities.filter(nat => nat.toLowerCase().includes(searchTerm.toLowerCase()))
    : nationalities
  const destinations = Object.keys(content[selectedNationality] || {})
  const visaTypes = editingVisa ? Object.keys(editingVisa.visaTypes) : []

  // Get statistics
  const totalEntries = nationalities.reduce((sum, nat) => sum + Object.keys(content[nat] || {}).length, 0)
  const totalVisaTypes = nationalities.reduce((sum, nat) => {
    return sum + Object.values(content[nat] || {}).reduce((s, entry) => s + Object.keys(entry.visaTypes || {}).length, 0)
  }, 0)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with Stats */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Visa Data Manager</h1>
            <p className="text-gray-600">Complete control: Add, Edit, Delete visa data, types, and entries</p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
              <div className="text-blue-600 font-medium">{nationalities.length}</div>
              <div className="text-blue-700 text-xs">Nationalities</div>
            </div>
            <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              <div className="text-green-600 font-medium">{totalEntries}</div>
              <div className="text-green-700 text-xs">Visa Entries</div>
            </div>
            <div className="bg-purple-50 px-4 py-2 rounded-lg border border-purple-200">
              <div className="text-purple-600 font-medium">{totalVisaTypes}</div>
              <div className="text-purple-700 text-xs">Visa Types</div>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span className="text-xl">{message.type === 'success' ? '✅' : '❌'}</span>
          <span>{message.text}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {showDeleteConfirm.type === 'nationality' 
                ? `ALL visa entries for "${showDeleteConfirm.name}"?` 
                : showDeleteConfirm.type === 'entry'
                ? `the visa entry "${showDeleteConfirm.name}"?`
                : `the visa type "${showDeleteConfirm.name}"?`
              }
            </p>
            <p className="text-sm text-red-600 mb-6">This action cannot be undone!</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>➕</span>
          <span>Quick Add New Visa Entry</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Select Nationality
            </label>
            <select
              value={newNationality}
              onChange={(e) => setNewNationality(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">Choose Nationality</option>
              {availableNationalities.map((nat) => (
                <option key={nat.name} value={nat.name}>
                  {nat.flag || '🏳️'} {nat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Or Type New
            </label>
            <input
              type="text"
              value={newNationality}
              onChange={(e) => setNewNationality(e.target.value)}
              placeholder="Type nationality name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Destination Country
            </label>
            <select
              value={newDestination}
              onChange={(e) => setNewDestination(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">Select Destination</option>
              {countriesWithFlags.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={addNewVisaEntry}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium shadow-md hover:shadow-lg"
            >
              ➕ Add Entry
            </button>
          </div>
        </div>
      </div>

      {/* Selection & Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Select Entry to Edit</h2>
          {nationalities.length > 5 && (
            <div className="w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 Search nationalities..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Nationality
              </label>
              {selectedNationality && (
                <button
                  onClick={() => confirmDelete('nationality', selectedNationality)}
                  className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all font-medium"
                  title="Delete this nationality and all its entries"
                >
                  🗑️ Delete
                </button>
              )}
            </div>
            <select
              value={selectedNationality}
              onChange={(e) => handleNationalityChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50"
            >
              {filteredNationalities.length === 0 ? (
                <option value="">{searchTerm ? 'No matches found' : 'No nationalities available'}</option>
              ) : (
                <>
                  <option value="">-- Select Nationality --</option>
                  {filteredNationalities.map((nat) => (
                    <option key={nat} value={nat}>
                      {nat} ({Object.keys(content[nat] || {}).length} entries)
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Destination Country
              </label>
              {selectedDestination && (
                <button
                  onClick={() => confirmDelete('entry', `${selectedNationality} → ${selectedDestination}`)}
                  className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all font-medium"
                  title="Delete this visa entry"
                >
                  🗑️ Delete
                </button>
              )}
            </div>
            <select
              value={selectedDestination}
              onChange={(e) => handleDestinationChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50"
            >
              {destinations.length === 0 ? (
                <option value="">No destinations available</option>
              ) : (
                <>
                  <option value="">-- Select Destination --</option>
                  {destinations.map((dest) => {
                    const visaCount = Object.keys(content[selectedNationality]?.[dest]?.visaTypes || {}).length
                    return (
                      <option key={dest} value={dest}>
                        {dest} ({visaCount} visa types)
                      </option>
                    )
                  })}
                </>
              )}
            </select>
          </div>
        </div>

        {selectedNationality && selectedDestination && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <span>📝</span>
              <span>Editing: <strong>{selectedNationality}</strong> → <strong>{selectedDestination}</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Editor */}
      {editingVisa && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Country Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country Flag (Emoji)
              </label>
              <input
                type="text"
                value={editingVisa.flag}
                onChange={(e) => updateVisaField('flag', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-2xl text-center"
                placeholder="🇺🇸"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country Code
              </label>
              <input
                type="text"
                value={editingVisa.countryCode}
                onChange={(e) => updateVisaField('countryCode', e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none uppercase"
                placeholder="US"
                maxLength={2}
              />
            </div>
          </div>

          {/* Add New Visa Type */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span>➕</span>
              <span>Add New Visa Type</span>
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newVisaTypeName}
                onChange={(e) => setNewVisaTypeName(e.target.value)}
                placeholder="Visa Type Name (e.g., Student Visa, Work Visa)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                onKeyPress={(e) => e.key === 'Enter' && addVisaType()}
              />
              <button
                onClick={addVisaType}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
              >
                Add Type
              </button>
            </div>
          </div>

          {/* Visa Types */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Visa Types ({visaTypes.length})</h3>
              {visaTypes.length > 0 && (
                <span className="text-sm text-gray-500">Click on visa type name to rename</span>
              )}
            </div>
            {visaTypes.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-4xl mb-4">📋</div>
                <p className="text-gray-600 mb-2">No visa types yet</p>
                <p className="text-sm text-gray-500">Add your first visa type above to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {visaTypes.map((visaTypeName) => {
                  const visaType = editingVisa.visaTypes[visaTypeName]
                  const isEditingName = editingVisaTypeName[visaTypeName] !== undefined
                  const displayName = isEditingName ? editingVisaTypeName[visaTypeName] : visaTypeName

                  return (
                    <div key={visaTypeName} className="border-2 border-gray-200 rounded-xl p-5 bg-gray-50 hover:border-blue-300 transition-all">
                      {/* Visa Type Header */}
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-300">
                        {isEditingName ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={displayName}
                              onChange={(e) => setEditingVisaTypeName({ ...editingVisaTypeName, [visaTypeName]: e.target.value })}
                              className="flex-1 px-3 py-2 border-2 border-blue-500 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  renameVisaType(visaTypeName, displayName)
                                } else if (e.key === 'Escape') {
                                  setEditingVisaTypeName({})
                                }
                              }}
                              autoFocus
                            />
                            <button
                              onClick={() => renameVisaType(visaTypeName, displayName)}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 font-medium"
                            >
                              ✓ Save
                            </button>
                            <button
                              onClick={() => setEditingVisaTypeName({})}
                              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                            >
                              ✕ Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <h4 
                              className="font-semibold text-lg text-gray-900 cursor-pointer hover:text-blue-600 transition-colors flex items-center gap-2"
                              onClick={() => setEditingVisaTypeName({ [visaTypeName]: visaTypeName })}
                              title="Click to rename"
                            >
                              <span>{visaTypeName}</span>
                              <span className="text-sm text-gray-400">✏️</span>
                            </h4>
                            <button
                              onClick={() => confirmDelete('visaType', visaTypeName)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 font-medium transition-all"
                              title="Delete this visa type"
                            >
                              🗑️ Delete
                            </button>
                          </>
                        )}
                      </div>
                      
                      {/* Visa Type Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-2">
                            ⏱️ Duration
                          </label>
                          <input
                            type="text"
                            value={visaType.duration}
                            onChange={(e) => updateVisaType(visaTypeName, 'duration', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                            placeholder="e.g., 30 days"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-2">
                            ⚡ Processing Time
                          </label>
                          <input
                            type="text"
                            value={visaType.processingTime}
                            onChange={(e) => updateVisaType(visaTypeName, 'processingTime', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                            placeholder="e.g., 1-2 weeks"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-2">
                            💰 Cost
                          </label>
                          <input
                            type="text"
                            value={visaType.cost}
                            onChange={(e) => updateVisaType(visaTypeName, 'cost', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                            placeholder="e.g., €100"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-2">
                            📅 Validity
                          </label>
                          <input
                            type="text"
                            value={visaType.validity}
                            onChange={(e) => updateVisaType(visaTypeName, 'validity', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                            placeholder="e.g., 6 months"
                          />
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="mb-4">
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                          📝 Notes (Optional)
                        </label>
                        <textarea
                          value={visaType.notes || ''}
                          onChange={(e) => updateVisaType(visaTypeName, 'notes', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                          placeholder="Additional notes or important information..."
                        />
                      </div>

                      {/* Documents */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-xs font-semibold text-gray-700">
                            📄 Required Documents ({visaType.documents.length})
                          </label>
                          <button
                            onClick={() => addDocument(visaTypeName, '')}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-xs font-medium transition-all"
                          >
                            + Add Document
                          </button>
                        </div>
                        <div className="space-y-2">
                          {visaType.documents.length === 0 ? (
                            <div className="text-center py-4 text-gray-400 text-sm">
                              No documents added yet. Click "+ Add Document" to add one.
                            </div>
                          ) : (
                            visaType.documents.map((doc, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <span className="text-gray-400 text-sm w-6">{index + 1}.</span>
                                <input
                                  type="text"
                                  value={doc}
                                  onChange={(e) => {
                                    const newDocs = [...visaType.documents]
                                    newDocs[index] = e.target.value
                                    updateVisaType(visaTypeName, 'documents', newDocs)
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                                  placeholder="Document name"
                                />
                                <button
                                  onClick={() => removeDocument(visaTypeName, index)}
                                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium transition-all"
                                  title="Remove document"
                                >
                                  Remove
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t-2 border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                💡 All changes are saved locally. Click "Save All Changes" to persist to server.
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  '💾 Save All Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {!editingVisa && nationalities.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🛂</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Visa Data Yet</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first visa entry above!</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Make sure you've added nationalities in the <strong>Nationalities</strong> section first.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
