import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default function FlightSearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fbfbfd] flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      {children}
    </Suspense>
  )
}
