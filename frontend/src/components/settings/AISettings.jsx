import React, { useState } from 'react'
import ToggleSwitch from '../common/ToggleSwitch'

const AISettings = () => {
  const [webSearch, setWebSearch] = useState(true)
  const [memory, setMemory] = useState(true)
  const [personalization, setPersonalization] = useState(true)
  const [model, setModel] = useState('gemini-ultra')
  const [temperature, setTemperature] = useState(0.7)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-subtle p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">🤖 AI / Model Settings</h3>
        <p className="text-sm text-gray-500 mb-6">Configure how the AI responds and behaves.</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Default AI model</label>
            <select 
              className="w-full mt-1 px-3 py-2 border border-subtle rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              <option value="gemini-pro">Gemini Pro</option>
              <option value="gemini-ultra">Gemini Ultra</option>
              <option value="claude-3.5">Claude 3.5</option>
              <option value="auto">Auto (recommended)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-subtle">
            <label className="text-sm font-medium text-gray-700">Response style</label>
            <div className="mt-2 flex gap-3">
              <button className="px-4 py-2 rounded-lg border border-subtle hover:border-indigo-300 hover:bg-indigo-50 transition text-sm">
                Concise
              </button>
              <button className="px-4 py-2 rounded-lg border-2 border-indigo-500 bg-indigo-50 text-indigo-600 text-sm font-medium">
                Balanced
              </button>
              <button className="px-4 py-2 rounded-lg border border-subtle hover:border-indigo-300 hover:bg-indigo-50 transition text-sm">
                Detailed
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-subtle">
            <label className="text-sm font-medium text-gray-700">Temperature / Creativity</label>
            <div className="mt-2 flex items-center gap-4">
              <input 
                type="range" 
                min="0" 
                max="2" 
                step="0.1" 
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full max-w-xs" 
              />
              <span className="text-sm font-medium">{temperature}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Higher values = more creative, lower = more focused
            </p>
          </div>

          <div className="pt-4 border-t border-subtle">
            <ToggleSwitch 
              label="Web search" 
              desc="Allow the AI to search the web for up-to-date information" 
              isActive={webSearch}
              onChange={setWebSearch}
            />
          </div>

          <div className="pt-4 border-t border-subtle">
            <ToggleSwitch 
              label="Memory" 
              desc="Allow the AI to remember useful information between conversations" 
              isActive={memory}
              onChange={setMemory}
            />
          </div>

          <div className="pt-4 border-t border-subtle">
            <ToggleSwitch 
              label="Personalization" 
              desc="Use your preferences to tailor responses" 
              isActive={personalization}
              onChange={setPersonalization}
            />
          </div>

          <div className="pt-4 border-t border-subtle">
            <label className="text-sm font-medium text-gray-700">Custom instructions</label>
            <p className="text-xs text-gray-400 mt-1">
              Tell the AI about your preferred response style, tone, level of detail, etc.
            </p>
            <textarea 
              rows="3" 
              className="w-full mt-2 px-3 py-2 border border-subtle rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
              placeholder="Example: Always respond in a professional tone, be concise, and provide code examples when relevant..."
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AISettings