'use client'

import { useState, useEffect } from 'react'

export default function SettingsPage() {
  const [username, setUsername] = useState('')
  const [hasCustomPassword, setHasCustomPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Password change form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadCredentials()
  }, [])

  const loadCredentials = async () => {
    try {
      const response = await fetch('/api/auth/get-credentials')
      const data = await response.json()
      if (response.ok) {
        setUsername(data.username || 'admin')
        setHasCustomPassword(data.hasCustomPassword || false)
      }
    } catch (error) {
      console.error('Failed to load credentials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setChangingPassword(true)
    setPasswordMessage(null)

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' })
      setChangingPassword(false)
      return
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters long' })
      setChangingPassword(false)
      return
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setPasswordMessage({ type: 'success', text: 'Password changed successfully!' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => {
          setPasswordMessage(null)
          setHasCustomPassword(true)
        }, 3000)
      } else {
        setPasswordMessage({ type: 'error', text: data.error || 'Failed to change password' })
      }
    } catch (error) {
      setPasswordMessage({ type: 'error', text: 'An error occurred while changing password' })
    } finally {
      setChangingPassword(false)
    }
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Configure your admin panel and website settings</p>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>
        
        {passwordMessage && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              passwordMessage.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {passwordMessage.text}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter new password (min 6 characters)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={changingPassword}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {changingPassword ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Current Credentials Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Admin Credentials</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-700">Username: </span>
              <code className="bg-white px-2 py-1 rounded text-sm">{username}</code>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Password Status: </span>
              <span className={`text-sm ${hasCustomPassword ? 'text-green-600' : 'text-amber-600'}`}>
                {hasCustomPassword ? '✓ Custom password set' : '⚠️ Using default password'}
              </span>
            </div>
            {!hasCustomPassword && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                <strong>⚠️ Security Notice:</strong> You're using the default password. Please change it using the form above.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Data Storage */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Storage</h2>
        <p className="text-gray-600 text-sm mb-4">
          All content is stored in JSON files in the <code className="bg-gray-100 px-2 py-1 rounded">data/</code> directory:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
          <li><code className="bg-gray-100 px-2 py-1 rounded">data/homepage.json</code> - Homepage content</li>
          <li><code className="bg-gray-100 px-2 py-1 rounded">data/visa.json</code> - Visa data</li>
          <li><code className="bg-gray-100 px-2 py-1 rounded">data/nationalities.json</code> - Nationalities list</li>
          <li><code className="bg-gray-100 px-2 py-1 rounded">data/auth.json</code> - Admin credentials (if changed)</li>
        </ul>
      </div>

      {/* Backup & Restore */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Backup & Restore</h2>
        <p className="text-gray-600 text-sm mb-4">
          To backup your content, simply copy the <code className="bg-gray-100 px-2 py-1 rounded">data/</code> directory.
          To restore, replace the files in that directory.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Regularly backup your <code className="bg-blue-100 px-2 py-1 rounded">data/</code> folder to prevent data loss.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/"
            target="_blank"
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all border border-blue-200"
          >
            <div className="text-sm text-blue-600 font-medium mb-1">🌐 View Homepage</div>
            <div className="text-xs text-blue-700">Open homepage in new tab</div>
          </a>
          <a
            href="/visa"
            target="_blank"
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-all border border-green-200"
          >
            <div className="text-sm text-green-600 font-medium mb-1">🛂 View Visa Page</div>
            <div className="text-xs text-green-700">Open visa page in new tab</div>
          </a>
        </div>
      </div>

      {/* Production Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Production Recommendations</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-2">
            <li>✅ Change default admin password (use form above)</li>
            <li>Consider using a proper database (PostgreSQL, MongoDB) instead of JSON files for production</li>
            <li>Implement proper session management with secure cookies</li>
            <li>Add rate limiting to API routes</li>
            <li>Set up proper image hosting (Cloudinary, AWS S3) for uploaded images</li>
            <li>Add user roles and permissions for multiple admins</li>
            <li>Enable HTTPS in production</li>
            <li>Set up automated backups</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
