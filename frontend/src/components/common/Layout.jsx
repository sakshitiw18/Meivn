import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

function Layout() {
  const location = useLocation()

  const platformPages = [
    '/dashboard',
    '/newproject',
    '/workflow',
    '/projects'
  ]

  const isPlatformPage = platformPages.includes(location.pathname)

  return (
    <div className="min-h-screen bg-[#fafbff]">

      {/* Top Navbar */}
      <Navbar />

      {/* Platform pages */}
      {isPlatformPage ? (
        <div className="relative min-h-[calc(100vh-73px)]">

          {/* Sidebar */}
          <Sidebar />

          {/* Main Content
              IMPORTANT:
              md:ml-64 gives the content 256px of space
              so it never goes underneath the sidebar.
          */}
          <main className="flex-1 min-w-0 md:ml-64">
            <Outlet />
          </main>

        </div>
      ) : (
        /* Landing / Auth / Other pages */
        <main className="min-w-0">
          <Outlet />
        </main>
      )}

    </div>
  )
}

export default Layout