import { useState, useCallback, useEffect } from 'react'
import {
  signup as apiSignup,
  login as apiLogin,
  loginWithGoogle as apiLoginWithGoogle,
  logout as apiLogout,
  getCurrentUser,
  getToken,
} from '../services/api'

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // On first load, if a token is already saved (from a previous visit),
  // verify it against the backend and restore the session.
  useEffect(() => {
    if (!getToken()) {
      setLoading(false)
      return
    }

    getCurrentUser()
      .then((current) => {
        setUser(current)
        setIsAuthenticated(true)
      })
      .catch(() => {
        setUser(null)
        setIsAuthenticated(false)
      })
      .finally(() => setLoading(false))
  }, [])

  const signIn = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const loggedInUser = await apiLogin({ email, password })
      setUser(loggedInUser)
      setIsAuthenticated(true)
      return { ok: true }
    } catch (err) {
      const message = err.message || 'Could not sign in'
      setError(message)
      return { ok: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  const signUp = useCallback(async (name, email, password, username) => {
    setLoading(true)
    setError(null)
    try {
      const newUser = await apiSignup({ name, email, password, username })
      setUser(newUser)
      setIsAuthenticated(true)
      return { ok: true }
    } catch (err) {
      const message = err.message || 'Could not create your account'
      setError(message)
      return { ok: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  const signInWithGoogle = useCallback(async (credential) => {
    setLoading(true)
    setError(null)
    try {
      const loggedInUser = await apiLoginWithGoogle(credential)
      setUser(loggedInUser)
      setIsAuthenticated(true)
      return { ok: true }
    } catch (err) {
      const message = err.message || 'Could not sign in with Google'
      setError(message)
      return { ok: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    await apiLogout()
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  return {
    isAuthenticated,
    user,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  }
}