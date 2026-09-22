import React, { useState } from 'react'
import ToggleSwitch from '../common/ToggleSwitch'

const PrivacySettings = () => {
  const [chatHistory, setChatHistory] = useState(true)
  const [improveAI, setImproveAI] = useState(true)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-subtle p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">🔒 Privacy & Data</h3>
        <p className="text-sm text-gray-500 mb-6">Control your data and privacy settings.</p>

        <div className="space-y-4">
          <ToggleSwitch 
            label="Chat history" 
            desc="Save your conversation history" 
            isActive={chatHistory}
            onChange={setChatHistory}
          />

          <ToggleSwitch 
            label="Use conversations to improve AI" 
            desc="Help us train and improve our models" 
            isActive={improveAI}
            onChange={setImproveAI}
          />

          <div className="pt-4 border-t border-subtle">
            <label className="text-sm font-medium text-gray-700">Data export</label>
            <button className="mt-2 px-4 py-2 border border-subtle rounded-lg text-sm hover:bg-gray-50 transition">
              Export my data
            </button>
            <p className="text-xs text-gray-400 mt-1">Export all your data in JSON format</p>
          </div>

          <div className="pt-4 border-t border-subtle">
            <button className="text-sm text-red-600 hover:text-red-800 font-medium">
              Delete chat history
            </button>
            <p className="text-xs text-gray-400 mt-1">Permanently delete all your conversations</p>
          </div>

          <div className="pt-4 border-t border-subtle">
            <button className="text-sm text-red-600 hover:text-red-800 font-medium">
              Clear all conversations
            </button>
            <p className="text-xs text-gray-400 mt-1">Clear all chat history (cannot be undone)</p>
          </div>

          <div className="pt-4 border-t border-subtle">
            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">Privacy policy</a>
            <p className="text-xs text-gray-400 mt-1">
              Data retention: 30 days for free users, 90 days for Pro users
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacySettings