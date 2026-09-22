import React, { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext(null)

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('landing')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false)
  const [authPage, setAuthPage] = useState('signin')

  const navigate = useCallback((page) => {
    setCurrentPage(page)
    setSidebarOpen(false)
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  const toggleAuthDropdown = useCallback(() => {
    setAuthDropdownOpen(prev => !prev)
  }, [])

  const closeAuthDropdown = useCallback(() => {
    setAuthDropdownOpen(false)
  }, [])

  const switchAuthPage = useCallback((page) => {
    setAuthPage(page)
    setAuthDropdownOpen(false)
  }, [])

  return (
    <AppContext.Provider value={{
      currentPage,
      navigate,
      sidebarOpen,
      toggleSidebar,
      closeSidebar,
      authDropdownOpen,
      toggleAuthDropdown,
      closeAuthDropdown,
      authPage,
      switchAuthPage
    }}>
      {children}
    </AppContext.Provider>
  )
}