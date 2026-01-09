import type { Metadata } from 'next'
import './globals.css'
import TestingBanner from '@/components/TestingBanner'

export const metadata: Metadata = {
  title: 'Euro Talent Travels - Flight Search',
  description: 'Book flights with Euro Talent Travels - Your trusted online travel partner',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Set to false when site is published/ready for production
  // To hide the banner, change SHOW_TESTING_BANNER to false
  const SHOW_TESTING_BANNER = true

  return (
    <html lang="en">
      <body className={SHOW_TESTING_BANNER ? 'pb-20' : ''}>
        {children}
        {SHOW_TESTING_BANNER && <TestingBanner />}
      </body>
    </html>
  )
}

