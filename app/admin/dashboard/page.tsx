'use client'

import Link from 'next/link'

export default function AdminDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage your website content and settings</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Homepage Card */}
        <Link
          href="/admin/homepage"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all group"
        >
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🏠</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            Homepage Editor
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm">
            Edit hero section, titles, subtitles, and background images
          </p>
        </Link>

        {/* Nationalities Card */}
        <Link
          href="/admin/nationalities"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group"
        >
          <div className="text-4xl mb-4">🌍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            Nationality Manager
          </h3>
          <p className="text-gray-600 text-sm">
            Add, edit, and manage all nationalities shown on visa page
          </p>
        </Link>

        {/* Visa Data Card */}
        <Link
          href="/admin/visa"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group"
        >
          <div className="text-4xl mb-4">🛂</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            Visa Data Manager
          </h3>
          <p className="text-gray-600 text-sm">
            Manage visa requirements, prices, costs, and documents
          </p>
        </Link>

        {/* Site Content Card */}
        <Link
          href="/admin/content"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group"
        >
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            Site Content
          </h3>
          <p className="text-gray-600 text-sm">
            Manage header, footer, contact info, and social media links
          </p>
        </Link>

        {/* Settings Card */}
        <Link
          href="/admin/settings"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group"
        >
          <div className="text-4xl mb-4">⚙️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            Settings
          </h3>
          <p className="text-gray-600 text-sm">
            Configure admin credentials and site settings
          </p>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 sm:mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600 font-medium mb-1">View Website</div>
            <Link href="/" target="_blank" className="text-blue-700 hover:underline">
              Open homepage in new tab →
            </Link>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600 font-medium mb-1">Visa Page</div>
            <Link href="/visa" target="_blank" className="text-green-700 hover:underline">
              Open visa page in new tab →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
