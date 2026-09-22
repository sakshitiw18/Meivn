import React, { useState } from 'react'
import ToggleSwitch from '../common/ToggleSwitch'

const AccessibilitySettings = () => {
  const [reduceAnimations, setReduceAnimations] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [largerText, setLargerText] = useState(false)
  const [keyboardNav, setKeyboardNav] = useState(true)
  const [screenReader, setScreenReader] = useState(true)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-subtle p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">♿ Accessibility</h3>
        <p className="text-sm text-gray-500 mb-6">Make the platform more accessible.</p>

        <div className="space-y-4">
          <ToggleSwitch 
            label="Reduce animations" 
            desc="Minimize motion and animations" 
            isActive={reduceAnimations}
            onChange={setReduceAnimations}
          />

          <ToggleSwitch 
            label="High contrast" 
            desc="Increase color contrast for better visibility" 
            isActive={highContrast}
            onChange={setHighContrast}
          />

          <ToggleSwitch 
            label="Larger text" 
            desc="Increase font size throughout the interface" 
            isActive={largerText}
            onChange={setLargerText}
          />

          <ToggleSwitch 
            label="Keyboard navigation" 
            desc="Optimize for keyboard-only navigation" 
            isActive={keyboardNav}
            onChange={setKeyboardNav}
          />

          <ToggleSwitch 
            label="Screen-reader compatibility" 
            desc="Improve compatibility with screen readers" 
            isActive={screenReader}
            onChange={setScreenReader}
          />
        </div>
      </div>
    </div>
  )
}

export default AccessibilitySettings