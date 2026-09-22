import React, { useState } from 'react'
import ToggleSwitch from '../common/ToggleSwitch'

const SecuritySettings = () => {
  const [twoFA, setTwoFA] = useState(false)
  const [passkeys, setPasskeys] = useState(false)
  const [securityAlerts, setSecurityAlerts] = useState(true)

  const sessions = [
    { id: 1, device: 'Chrome — Windows', lastActive: '2 minutes ago' },
    { id: 2, device: 'Safari — iPhone', lastActive: '3 hours ago' }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-subtle p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">🛡️ Security</h3>
        <p className="text-sm text-gray-500 mb-6">Secure your account.</p>

        <div className="space-y-4">
          <div>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              Change password
            </button>
          </div>

          <div className="pt-4 border-t border-subtle">
            <ToggleSwitch 
              label="Two-factor authentication (2FA)" 
              desc="Add an extra layer of security" 
              isActive={twoFA}
              onChange={setTwoFA}
            />
          </div>

          <div className="pt-4 border-t border-subtle">
            <ToggleSwitch 
              label="Passkeys" 
              desc="Use biometric authentication" 
              isActive={passkeys}
              onChange={setPasskeys}
            />
          </div>

          <div className="pt-4 border-t border-subtle">
            <label className="text-sm font-medium text-gray-700">Active sessions</label>
            <div className="mt-2 space-y-2">
              {sessions.map(session => (
                <div key={session.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium">{session.device}</span>
                    <p className="text-xs text-gray-400">Last active: {session.lastActive}</p>
                  </div>
                  <button className="text-sm text-red-500 hover:text-red-700">Revoke</button>
                </div>
              ))}
            </div>
            <button className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium">
              Log out of all devices
            </button>
          </div>

          <div className="pt-4 border-t border-subtle">
            <label className="text-sm font-medium text-gray-700">Login history</label>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <div>Today, 10:30 AM — Chrome, Windows</div>
              <div>Yesterday, 8:45 PM — Safari, iPhone</div>
              <div>Yesterday, 9:15 AM — Chrome, Windows</div>
            </div>
          </div>

          <div className="pt-4 border-t border-subtle">
            <ToggleSwitch 
              label="Security alerts" 
              desc="Get notified about suspicious activity" 
              isActive={securityAlerts}
              onChange={setSecurityAlerts}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecuritySettings