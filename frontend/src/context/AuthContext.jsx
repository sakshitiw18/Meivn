import React, { createContext, useContext } from 'react'
import { useAuth } from '../hooks/useAuth'

const AuthContext = createContext(null)

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}

// Wraps the useAuth() hook in a single Context so every component (SignIn,
// SignUp, and the "Log out" button in Settings) shares the exact same auth
// state instead of each holding its own copy.
export const AuthProvider = ({ children }) => {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}