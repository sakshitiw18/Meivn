import React from 'react'

const HelpSettings = () => {
  const links = [
    { icon: 'fa-book', label: 'Help Center' },
    { icon: 'fa-envelope', label: 'Contact Support' },
    { icon: 'fa-exclamation-triangle', label: 'Report a problem' },
    { icon: 'fa-comment', label: 'Send feedback' },
    { icon: 'fa-question-circle', label: 'FAQs' },
    { icon: 'fa-server', label: 'System status' },
    { icon: 'fa-file-contract', label: 'Terms of Service' },
    { icon: 'fa-lock', label: 'Privacy Policy' },
    { icon: 'fa-info-circle', label: 'About' }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-subtle p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">🆘 Help & Support</h3>
        <p className="text-sm text-gray-500 mb-6">Get help and support.</p>

        <div className="space-y-3">
          {links.map((link, index) => (
            <a 
              key={index} 
              href="#" 
              className={`flex items-center gap-3 py-3 ${index < links.length - 1 ? 'border-b border-subtle' : ''} hover:text-indigo-600 transition`}
            >
              <i className={`fas ${link.icon} text-gray-400 w-5`}></i>
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HelpSettings