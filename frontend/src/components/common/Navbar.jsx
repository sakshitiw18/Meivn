import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false)

  const platformPages = [
    '/dashboard',
    '/newproject',
    '/workflow',
    '/projects',
    '/settings'
  ]

  const isPlatformPage = platformPages.includes(location.pathname)

  useEffect(() => {
    setAuthDropdownOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        authDropdownOpen &&
        !event.target.closest('.auth-dropdown-wrapper')
      ) {
        setAuthDropdownOpen(false)
      }
    }

    document.addEventListener('click', handleOutsideClick)

    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [authDropdownOpen])

  const handleAuth = (type) => {
    setAuthDropdownOpen(false)

    if (type === 'signin') {
      navigate('/auth?mode=signin')
    }

    if (type === 'signup') {
      navigate('/auth?mode=signup')
    }
  }

  return (
    <nav className="flex items-center justify-between w-full px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-subtle sticky top-0 z-30">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-3 flex-shrink-0">

        {/* Hamburger */}
        {isPlatformPage && (
          <button
            type="button"
            className="mobile-menu-btn text-xl"
            onClick={() => window.toggleSidebar?.()}
            aria-label="Toggle sidebar"
          >
            <i className="fas fa-bars"></i>
          </button>
        )}

        {/* Logo */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-2xl font-bold tracking-tight bg-transparent border-0 p-0 cursor-pointer"
        >
          meɪvn
        </button>

        {/* Subtitle */}
        <span className="text-sm font-medium text-gray-400 whitespace-nowrap">
          Multi-Agent Dev Platform
        </span>
      </div>

      {/* RIGHT SIDE */}
      <div className="desktop-nav flex items-center gap-6 flex-shrink-0">

        {/* Platform */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className={`text-sm font-medium transition whitespace-nowrap ${
            location.pathname === '/'
              ? 'text-indigo-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Platform
        </button>

        {/* Sign In / Sign Up */}
        <div className="auth-dropdown-wrapper relative inline-block text-left">

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              setAuthDropdownOpen((previous) => !previous)
            }}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition px-3 py-2 rounded-full hover:bg-gray-50 whitespace-nowrap"
          >
            <i className="fas fa-user-circle text-lg"></i>
            Sign In / Sign Up
          </button>

          {/* Dropdown */}
          <div
            className={`original-auth-dropdown ${
              authDropdownOpen
                ? 'original-auth-dropdown-show'
                : ''
            }`}
          >
            <button
              type="button"
              onClick={() => handleAuth('signin')}
              className="original-auth-dropdown-item"
            >
              <i className="fas fa-sign-in-alt"></i>
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => handleAuth('signup')}
              className="original-auth-dropdown-item"
            >
              <i className="fas fa-user-plus"></i>
              <span>Sign Up</span>
            </button>
          </div>
        </div>

        {/* Launch Platform */}
        <button
          type="button"
          className="btn-primary text-white px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap"
          onClick={() => navigate('/dashboard')}
        >
          Launch Platform
          <i className="fas fa-arrow-right ml-2"></i>
        </button>

      </div>
    </nav>
  )
}

export default Navbar