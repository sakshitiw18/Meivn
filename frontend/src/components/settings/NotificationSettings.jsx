import React, { useState } from 'react'
import ToggleSwitch from '../common/ToggleSwitch'

const NotificationSettings = () => {
  const [emailProduct, setEmailProduct] = useState(true)
  const [emailSecurity, setEmailSecurity] = useState(true)
  const [emailFeatures, setEmailFeatures] = useState(true)
  const [emailMarketing, setEmailMarketing] = useState(false)
  const [inappAI, setInappAI] = useState(true)
  const [inappReports, setInappReports] = useState(true)
  const [inappSystem, setInappSystem] = useState(true)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-subtle p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">🔔 Notifications</h3>
        <p className="text-sm text-gray-500 mb-6">Manage your notification preferences.</p>

        <div className="space-y-4">
          <div className="pb-4 border-b border-subtle">
            <label className="text-sm font-medium text-gray-700">Email notifications</label>
            <div className="mt-2 space-y-2">
              <ToggleSwitch 
                label="Product updates" 
                desc="New features and improvements" 
                isActive={emailProduct}
                onChange={setEmailProduct}
              />
              <ToggleSwitch 
                label="Security alerts" 
                desc="Important security notifications" 
                isActive={emailSecurity}
                onChange={setEmailSecurity}
              />
              <ToggleSwitch 
                label="New features" 
                desc="Get notified about new capabilities" 
                isActive={emailFeatures}
                onChange={setEmailFeatures}
              />
              <ToggleSwitch 
                label="Marketing/promotional emails" 
                desc="Special offers and promotions" 
                isActive={emailMarketing}
                onChange={setEmailMarketing}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">In-app notifications</label>
            <div className="mt-2 space-y-2">
              <ToggleSwitch 
                label="AI task completed" 
                desc="Get notified when AI tasks finish" 
                isActive={inappAI}
                onChange={setInappAI}
              />
              <ToggleSwitch 
                label="Reports ready" 
                desc="Notifications when reports are generated" 
                isActive={inappReports}
                onChange={setInappReports}
              />
              <ToggleSwitch 
                label="System announcements" 
                desc="Important platform updates" 
                isActive={inappSystem}
                onChange={setInappSystem}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationSettings