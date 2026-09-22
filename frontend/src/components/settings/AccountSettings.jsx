import React, { useState } from 'react'
import ToggleSwitch from '../common/ToggleSwitch'

const AccountSettings = () => {
  const [emailUpdates, setEmailUpdates] = useState(true)
  const [securityAlerts, setSecurityAlerts] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-subtle p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">👤 Account</h3>
        <p className="text-sm text-gray-500 mb-6">Basic account and profile management.</p>

        <div className="space-y-4">
          <div className="flex items-center gap-6 pb-4 border-b border-subtle">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl">
              <i className="fas fa-user"></i>
            </div>
            <div>
              <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">
                Change photo
              </button>
              <p className="text-xs text-gray-400">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input 
                type="text" 
                value="Alex Johnson" 
                className="w-full mt-1 px-3 py-2 border border-subtle rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none" 
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Username</label>
              <input 
                type="text" 
                value="alexj" 
                className="w-full mt-1 px-3 py-2 border border-subtle rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                value="alex@example.com" 
                className="w-full mt-1 px-3 py-2 border border-subtle rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none" 
              />
            </div>
          </div>

          <div className="pt-4 border-t border-subtle">
            <label className="text-sm font-medium text-gray-700">Account Type</label>
            <div className="mt-2 flex items-center gap-4">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium">
                Pro Plan
              </span>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">Upgrade</button>
            </div>
          </div>

          <div className="pt-4 border-t border-subtle">
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              Change password
            </button>
          </div>

          <div className="pt-4 border-t border-subtle">
            <label className="text-sm font-medium text-gray-700">Email preferences</label>
            <div className="mt-2 space-y-2">
              <ToggleSwitch 
                label="Product updates" 
                desc="Receive emails about new features and improvements" 
                isActive={emailUpdates}
                onChange={setEmailUpdates}
              />
              <ToggleSwitch 
                label="Security alerts" 
                desc="Get notified about security events" 
                isActive={securityAlerts}
                onChange={setSecurityAlerts}
              />
              <ToggleSwitch 
                label="Marketing emails" 
                desc="Promotional content and offers" 
                isActive={marketingEmails}
                onChange={setMarketingEmails}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-subtle">
            <label className="text-sm font-medium text-gray-700">Connected accounts</label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Google</span>
                <span className="text-sm text-green-600">Connected ✓</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Microsoft</span>
                <span className="text-sm text-gray-400">Not connected</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">GitHub</span>
                <span className="text-sm text-green-600">Connected ✓</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-subtle">
            <button className="text-sm text-red-600 hover:text-red-800 font-medium">
              Delete account
            </button>
            <p className="text-xs text-gray-400 mt-1">
              Permanently delete your account and all associated data.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountSettings