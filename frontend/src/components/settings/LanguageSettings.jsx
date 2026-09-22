import React, { useState } from 'react'
import ToggleSwitch from '../common/ToggleSwitch'

const LanguageSettings = () => {
  const [clockFormat, setClockFormat] = useState(false)
  const [language, setLanguage] = useState('english')
  const [country, setCountry] = useState('india')
  const [timezone, setTimezone] = useState('asia/kolkata')
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY')

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-subtle p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">🌐 Language & Region</h3>
        <p className="text-sm text-gray-500 mb-6">Configure your language and regional preferences.</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Language</label>
            <select 
              className="w-full mt-1 px-3 py-2 border border-subtle rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
              <option value="chinese">Chinese</option>
              <option value="japanese">Japanese</option>
            </select>
          </div>

          <div className="pt-4 border-t border-subtle">
            <label className="text-sm font-medium text-gray-700">Country/Region</label>
            <select 
              className="w-full mt-1 px-3 py-2 border border-subtle rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="india">India</option>
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="canada">Canada</option>
              <option value="australia">Australia</option>
            </select>
          </div>

          <div className="pt-4 border-t border-subtle">
            <label className="text-sm font-medium text-gray-700">Time zone</label>
            <select 
              className="w-full mt-1 px-3 py-2 border border-subtle rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              <option value="asia/kolkata">Asia/Kolkata (UTC +5:30)</option>
              <option value="america/new_york">America/New_York (UTC -5:00)</option>
              <option value="europe/london">Europe/London (UTC +0:00)</option>
              <option value="asia/tokyo">Asia/Tokyo (UTC +9:00)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-subtle">
            <label className="text-sm font-medium text-gray-700">Date format</label>
            <div className="mt-2 flex gap-3">
              <button 
                className={`px-4 py-2 rounded-lg border ${dateFormat === 'DD/MM/YYYY' ? 'border-2 border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-subtle hover:border-indigo-300 hover:bg-indigo-50'} transition text-sm font-medium`}
                onClick={() => setDateFormat('DD/MM/YYYY')}
              >
                DD/MM/YYYY
              </button>
              <button 
                className={`px-4 py-2 rounded-lg border ${dateFormat === 'MM/DD/YYYY' ? 'border-2 border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-subtle hover:border-indigo-300 hover:bg-indigo-50'} transition text-sm`}
                onClick={() => setDateFormat('MM/DD/YYYY')}
              >
                MM/DD/YYYY
              </button>
              <button 
                className={`px-4 py-2 rounded-lg border ${dateFormat === 'YYYY-MM-DD' ? 'border-2 border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-subtle hover:border-indigo-300 hover:bg-indigo-50'} transition text-sm`}
                onClick={() => setDateFormat('YYYY-MM-DD')}
              >
                YYYY-MM-DD
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-subtle">
            <ToggleSwitch 
              label="24-hour / 12-hour clock" 
              desc="Display time in 24-hour format" 
              isActive={clockFormat}
              onChange={setClockFormat}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LanguageSettings