import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: 'fa-th-large'
    },
    {
      path: '/newproject',
      label: 'New Project',
      icon: 'fa-plus-circle'
    },
    {
      path: '/projects',
      label: 'Projects',
      icon: 'fa-folder'
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: 'fa-sliders-h'
    }
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="
          sidebar
          fixed
          left-0
          top-[73px]
          z-20
          hidden
          md:block
          w-64
          h-[calc(100vh-73px)]
          bg-white
          border-r
          border-subtle
          p-4
          overflow-y-auto
        "
      >

        <div className="space-y-1">

          {navItems.map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className={`
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                text-sm
                font-medium
                transition
                text-left
                ${
                  isActive(item.path)
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <i
                className={`fas ${item.icon} w-5`}
              ></i>

              <span>
                {item.label}
              </span>
            </button>
          ))}

        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div
        className="
          sidebar-mobile
          md:hidden
        "
      >
        <div className="space-y-1">

          {navItems.map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => {
                navigate(item.path)
                window.closeSidebar?.()
              }}
              className={`
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                text-sm
                font-medium
                transition
                text-left
                ${
                  isActive(item.path)
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <i
                className={`fas ${item.icon} w-5`}
              ></i>

              <span>
                {item.label}
              </span>
            </button>
          ))}

        </div>
      </div>
    </>
  )
}

export default Sidebar