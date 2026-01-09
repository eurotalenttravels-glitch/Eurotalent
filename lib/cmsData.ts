// CMS Data Storage
// This file manages the content that can be edited through the admin panel

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

// Use /tmp in serverless environments (Vercel, etc.) where filesystem is read-only
// Otherwise use data/ directory
function getDataDir() {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return '/tmp/data'
  }
  return join(process.cwd(), 'data')
}

const DATA_DIR = getDataDir()
const HOMEPAGE_DATA_FILE = join(DATA_DIR, 'homepage.json')
const VISA_DATA_FILE = join(DATA_DIR, 'visa.json')
const NATIONALITIES_FILE = join(DATA_DIR, 'nationalities.json')
const SITE_CONTENT_FILE = join(DATA_DIR, 'site-content.json')

// Default homepage content
export interface HomepageContent {
  heroTitle: string
  heroSubtitle: string
  heroBackgroundImage: string
  metaTitle: string
  metaDescription: string
}

const defaultHomepageContent: HomepageContent = {
  heroTitle: "Explore the World's With Euro Talent Travels",
  heroSubtitle: "Your Trusted Online Travel Partner",
  heroBackgroundImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
  metaTitle: "Euro Talent Travels - Flight Search",
  metaDescription: "Book flights with Euro Talent Travels - Your trusted online travel partner"
}

// Visa content structure
export interface VisaContent {
  [nationality: string]: {
    [destination: string]: {
      country: string
      countryCode: string
      flag: string
      visaTypes: {
        [visaType: string]: {
          required: boolean
          duration: string
          processingTime: string
          cost: string
          documents: string[]
          validity: string
          notes?: string
        }
      }
    }
  }
}

// Nationalities structure
export interface Nationality {
  name: string
  code?: string
  flag?: string
  enabled: boolean
  order: number
}

export interface NationalitiesData {
  nationalities: Nationality[]
}

// Site content structure
export interface SiteContent {
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

const defaultSiteContent: SiteContent = {
  header: {
    logo: '✈️ Euro Talent Travels',
    navigation: [
      { label: 'Flights', href: '/' },
      { label: 'Visa', href: '/visa' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  footer: {
    text: '© 2024 Euro Talent Travels. All rights reserved.',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  contact: {
    email: 'info@eurotalenttravels.com',
    phone: '+1 234 567 8900',
    address: '123 Travel Street, City, Country',
    whatsapp: '+351920076707',
  },
  social: {
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
  },
}

const defaultNationalities: Nationality[] = [
  { name: 'India', code: 'IN', flag: '🇮🇳', enabled: true, order: 1 },
  { name: 'United States', code: 'US', flag: '🇺🇸', enabled: true, order: 2 },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', enabled: true, order: 3 },
  { name: 'Canada', code: 'CA', flag: '🇨🇦', enabled: true, order: 4 },
  { name: 'Australia', code: 'AU', flag: '🇦🇺', enabled: true, order: 5 },
]

// Initialize data directory if it doesn't exist
function ensureDataDir() {
  if (typeof window === 'undefined') {
    try {
      if (!existsSync(DATA_DIR)) {
        mkdirSync(DATA_DIR, { recursive: true })
      }
    } catch (error: any) {
      // If we can't create the directory, it might be read-only filesystem
      if (error.code === 'EROFS' || error.code === 'EACCES') {
        console.error(`Cannot write to ${DATA_DIR}. Filesystem is read-only.`)
        console.error('This is expected in serverless environments like Vercel.')
        console.error('For production, consider using a database or external storage service.')
        throw new Error('File system is read-only. In serverless environments, data cannot be persisted to files. Consider using a database.')
      }
      throw error
    }
  }
}

// Read homepage content
export function getHomepageContent(): HomepageContent {
  if (typeof window !== 'undefined') {
    // Client-side: return default (will be fetched via API)
    return defaultHomepageContent
  }

  ensureDataDir()
  
  try {
    if (existsSync(HOMEPAGE_DATA_FILE)) {
      const content = readFileSync(HOMEPAGE_DATA_FILE, 'utf-8')
      return JSON.parse(content)
    }
  } catch (error) {
    console.error('Error reading homepage content:', error)
  }

  // Write default content if file doesn't exist
  saveHomepageContent(defaultHomepageContent)
  return defaultHomepageContent
}

// Save homepage content
export function saveHomepageContent(content: HomepageContent): void {
  if (typeof window !== 'undefined') {
    throw new Error('Cannot save content from client-side')
  }

  ensureDataDir()
  
  try {
    writeFileSync(HOMEPAGE_DATA_FILE, JSON.stringify(content, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error saving homepage content:', error)
    throw error
  }
}

// Read visa content
export function getVisaContent(): VisaContent {
  if (typeof window !== 'undefined') {
    return {}
  }

  ensureDataDir()
  
  try {
    if (existsSync(VISA_DATA_FILE)) {
      const content = readFileSync(VISA_DATA_FILE, 'utf-8')
      return JSON.parse(content)
    }
  } catch (error) {
    console.error('Error reading visa content:', error)
  }

  return {}
}

// Save visa content
export function saveVisaContent(content: VisaContent): void {
  if (typeof window !== 'undefined') {
    throw new Error('Cannot save content from client-side')
  }

  ensureDataDir()
  
  try {
    writeFileSync(VISA_DATA_FILE, JSON.stringify(content, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error saving visa content:', error)
    throw error
  }
}

// Read nationalities
export function getNationalitiesData(): NationalitiesData {
  if (typeof window !== 'undefined') {
    return { nationalities: [] }
  }

  ensureDataDir()
  
  try {
    if (existsSync(NATIONALITIES_FILE)) {
      const content = readFileSync(NATIONALITIES_FILE, 'utf-8')
      return JSON.parse(content)
    }
  } catch (error) {
    console.error('Error reading nationalities:', error)
  }

  // Return default if file doesn't exist
  const defaultData: NationalitiesData = { nationalities: defaultNationalities }
  saveNationalitiesData(defaultData)
  return defaultData
}

// Save nationalities
export function saveNationalitiesData(data: NationalitiesData): void {
  if (typeof window !== 'undefined') {
    throw new Error('Cannot save content from client-side')
  }

  ensureDataDir()
  
  try {
    writeFileSync(NATIONALITIES_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error saving nationalities:', error)
    throw error
  }
}

// Get enabled nationalities as simple string array
export function getEnabledNationalities(): string[] {
  const data = getNationalitiesData()
  return data.nationalities
    .filter(n => n.enabled)
    .sort((a, b) => a.order - b.order)
    .map(n => n.name)
}

// Read site content
export function getSiteContent(): SiteContent {
  if (typeof window !== 'undefined') {
    return defaultSiteContent
  }

  ensureDataDir()
  
  try {
    if (existsSync(SITE_CONTENT_FILE)) {
      const content = readFileSync(SITE_CONTENT_FILE, 'utf-8')
      return JSON.parse(content)
    }
  } catch (error) {
    console.error('Error reading site content:', error)
  }

  saveSiteContent(defaultSiteContent)
  return defaultSiteContent
}

// Save site content
export function saveSiteContent(content: SiteContent): void {
  if (typeof window !== 'undefined') {
    throw new Error('Cannot save content from client-side')
  }

  ensureDataDir()
  
  try {
    writeFileSync(SITE_CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error saving site content:', error)
    throw error
  }
}
