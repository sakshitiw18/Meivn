import React, { useState } from 'react'
import ToggleSwitch from '../common/ToggleSwitch'

const MemorySettings = () => {
  const [memoryEnabled, setMemoryEnabled] = useState(true)
  const [chatHistory, setChatHistory] = useState(true)
  const [personalizedResponses, setPersonalizedResponses] = useState(true)

  const memories = [
    { id: 1, text: 'User prefers Python for backend' },
    { id: 2, text: 'Working on e-commerce project' }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-subtle p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">🧠 Memory & Personalization</h3>
        <p className="text-sm text-gray-500 mb-6">
          Memory helps the AI provide more relevant responses based on information you've chosen to save.
        </p>

        <div className="space-y-4">
          <ToggleSwitch 
            label="Memory" 
            desc="Allow the AI to remember information between conversations" 
            isActive={memoryEnabled}
            onChange={setMemoryEnabled}
          />

          <div className="pt-4 border-t border-subtle">
            <label className="text-sm font-medium text-gray-700">Manage memories</label>
            <div className="mt-2 space-y-2">
              {memories.map(memory => (
                <div key={memory.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">{memory.text}</span>
                  <button className="text-sm text-red-500 hover:text-red-700">Delete</button>
                </div>
              ))}
              <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium mt-2">
                + Add memory
              </button>
              <button className="text-sm text-red-600 hover:text-red-800 font-medium mt-2 block">
                Delete all memories
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-subtle">
            <ToggleSwitch 
              label="Use chat history for personalization" 
              desc="Analyze past conversations to improve responses" 
              isActive={chatHistory}
              onChange={setChatHistory}
            />
          </div>

          <div className="pt-4 border-t border-subtle">
            <ToggleSwitch 
              label="Personalized responses" 
              desc="Tailor responses based on your preferences" 
              isActive={personalizedResponses}
              onChange={setPersonalizedResponses}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemorySettings