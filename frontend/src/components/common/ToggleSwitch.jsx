import React from 'react'

const ToggleSwitch = ({ label, desc, isActive = false, onChange }) => {
  const handleToggle = () => {
    if (onChange) {
      onChange(!isActive)
    }
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-subtle last:border-0">
      <div>
        <div className="font-medium text-sm">{label}</div>
        <div className="text-sm text-gray-500">{desc}</div>
      </div>
      <div 
        className={`toggle-switch ${isActive ? 'active' : ''}`} 
        onClick={handleToggle}
      >
        <div className="toggle-knob"></div>
      </div>
    </div>
  )
}

export default ToggleSwitch