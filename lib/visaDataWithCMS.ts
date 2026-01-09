// Visa data with CMS integration
// This file provides visa data from CMS if available, otherwise falls back to default data

import { visaData as defaultVisaData, getVisaRequirements as getDefaultVisaRequirements, type VisaRequirement } from './visaData'

// Cache for CMS data (client-side only)
let cmsDataCache: any = null
let cmsDataLoaded = false

// Load CMS data (client-side)
export async function loadCMSVisaData() {
  if (typeof window === 'undefined') {
    // Server-side: return default data
    return defaultVisaData
  }

  if (cmsDataLoaded && cmsDataCache) {
    return cmsDataCache
  }

  try {
    const response = await fetch('/api/cms/visa')
    const data = await response.json()
    if (data.content && Object.keys(data.content).length > 0) {
      cmsDataCache = data.content
      cmsDataLoaded = true
      return cmsDataCache
    }
  } catch (error) {
    console.error('Failed to load CMS visa data:', error)
  }

  // Fallback to default data
  cmsDataCache = defaultVisaData
  cmsDataLoaded = true
  return cmsDataCache
}

// Get visa requirements (with CMS support)
export async function getVisaRequirements(nationality: string, destination: string): Promise<VisaRequirement | null> {
  const data = await loadCMSVisaData()
  return data[nationality]?.[destination] || null
}

// Get visa requirements synchronously (uses cache or default)
export function getVisaRequirementsSync(nationality: string, destination: string): VisaRequirement | null {
  if (typeof window !== 'undefined' && cmsDataCache) {
    return cmsDataCache[nationality]?.[destination] || null
  }
  // Fallback to default
  return getDefaultVisaRequirements(nationality, destination)
}

// Get all nationalities (with CMS support)
export async function getNationalities(): Promise<string[]> {
  const data = await loadCMSVisaData()
  return Object.keys(data)
}

// Get destinations for a nationality (with CMS support)
export async function getDestinations(nationality: string): Promise<string[]> {
  const data = await loadCMSVisaData()
  return Object.keys(data[nationality] || {})
}
