import React, { useState } from 'react'
import ToggleSwitch from '../common/ToggleSwitch'

const AppearanceSettings = () => {
  const [animations, setAnimations] = useState(true)
  const [theme, setTheme] = useState('dark')
  const [fontSize, setFontSize] = useState('medium')

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-subtle p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">🎨 Appearance</h3>
        <p className="text-sm text-gray-500 mb-6">Controls how the website looks.</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Theme</label>
            <div className="mt-2 flex gap-3">
              <button 
                className={`px-4 py-2 rounded-lg border ${theme === 'light' ? 'border-2 border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-subtle hover:border-indigo-300 hover:bg-indigo-50'} transition text-sm`}
                onClick={() => setTheme('light')}
              >
                Light
              </button>
              <button 
                className={`px-4 py-2 rounded-lg border ${theme === 'dark' ? 'border-2 border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-subtle hover:border-indigo-300 hover:bg-indigo-50'} transition text-sm`}
                onClick={() => setTheme('dark')}
              >
                Dark
              </button>
              <button 
                className={`px-4 py-2 rounded-lg border ${theme === 'system' ? 'border-2 border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-subtle hover:border-indigo-300 hover:bg-indigo-50'} transition text-sm`}
                onClick={() => setTheme('system')}
              >
                System
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-subtle">
            <label className="text-sm font-medium text-gray-700">Accent color</label>
            <div className="mt-2 flex gap-3">
              <button className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-indigo-500 ring-2 ring-indigo-200"></button>
              <button className="w-8 h-8 rounded-full bg-blue-500 border-2 border-transparent hover:border-gray-300"></button>
              <button className="w-8 h-8 rounded-full bg-purple-500 border-2 border-transparent hover:border-gray-300"></button>
              <button className="w-8 h-8 rounded-full bg-green-500 border-2 border-transparent hover:border-gray-300"></button>
            </div>
          </div>

          <div className="pt-4 border-t border-subtle">
            <label className="text-sm font-medium text-gray-700">Font size</label>
            <div className="mt-2 flex gap-3">
              <button 
                className={`px-4 py-2 rounded-lg border ${fontSize === 'small' ? 'border-2 border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-subtle hover:border-indigo-300 hover:bg-indigo-50'} transition text-sm`}
                onClick={() => setFontSize('small')}
              >
                Small
              </button>
              <button 
                className={`px-4 py-2 rounded-lg border ${fontSize === 'medium' ? 'border-2 border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-subtle hover:border-indigo-300 hover:bg-indigo-50'} transition text-sm`}
                onClick={() => setFontSize('medium')}
              >
                Medium
              </button>
              <button 
                className={`px-4 py-2 rounded-lg border ${fontSize === 'large' ? 'border-2 border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-subtle hover:border-indigo-300 hover:bg-indigo-50'} transition text-sm`}
                onClick={() => setFontSize('large')}
              >
                Large
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-subtle">
            <ToggleSwitch 
              label="Animations" 
              desc="Enable smooth animations throughout the interface" 
              isActive={animations}
              onChange={setAnimations}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppearanceSettings