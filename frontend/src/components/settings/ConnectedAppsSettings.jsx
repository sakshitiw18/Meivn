import React from 'react'

const ConnectedAppsSettings = () => {
  const apps = [
    { name: 'Google', email: 'alex@gmail.com', connected: true },
    { name: 'Microsoft', email: 'Not connected', connected: false },
    { name: 'GitHub', email: 'alex-dev', connected: true },
    { name: 'Slack', email: 'Not connected', connected: false },
    { name: 'Google Drive', email: 'Not connected', connected: false },
    { name: 'Dropbox', email: 'Not connected', connected: false }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-subtle p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">🔗 Connected Apps</h3>
        <p className="text-sm text-gray-500 mb-6">Manage your connected accounts and integrations.</p>

        <div className="space-y-3">
          {apps.map((app, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-subtle last:border-0">
              <div>
                <span className="font-medium">{app.name}</span>
                <p className="text-sm text-gray-500">{app.email}</p>
              </div>
              {app.connected ? (
                <span className="text-sm text-green-600">Connected ✓</span>
              ) : (
                <button className="text-sm text-indigo-600 hover:text-indigo-800">Connect</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ConnectedAppsSettings