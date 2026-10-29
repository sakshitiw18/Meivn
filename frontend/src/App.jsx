import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import { AppProvider } from './context/AppContext'
import { AuthProvider, useAuthContext } from './context/AuthContext'
import { getAppearanceSettings } from './services/api'
import { applyAppearance } from './utils/appearance'

import Landing from './components/pages/Landing'
import Dashboard from './components/pages/Dashboard'
import NewProject from './components/pages/NewProject'
import Workflow from './components/pages/Workflow'
import Projects from './components/pages/Projects'
import Settings from './components/pages/Settings'

import AuthPage from './components/auth/AuthPage'

import Layout from './components/common/Layout'

// Guards the platform pages (Dashboard, New Project, Workflow, Projects,
// Settings): visitors who aren't signed in are sent to the Sign In / Sign Up
// page. We wait for the "is the saved session still valid?" check to finish
// first, so a signed-in user isn't bounced on a refresh.
const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Loading...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth?mode=signin" replace />
  }

  return children
}

function AppRoutes() {

  const { isAuthenticated } = useAuthContext()

  // Apply the signed-in user's saved theme / font size / accent color, so it's
  // consistent on every page, not just Settings. When signed out, ensure default light theme.
  useEffect(() => {
    if (!isAuthenticated) {
      applyAppearance({ theme: 'light', font_size: 'medium', accent_color: 'indigo', animations_enabled: true })
      return
    }
    getAppearanceSettings().then(applyAppearance).catch(() => {})
  }, [isAuthenticated])

  return (
    <Router>

      <Routes>

        {/* ================================
            LANDING PAGE
        ================================= */}

        <Route
          path="/"
          element={<Landing />}
        />

        {/* ================================
            AUTH (Sign In / Sign Up)
        ================================= */}

        <Route
          path="/auth"
          element={<AuthPage />}
        />

        {/* ================================
            PLATFORM (signed-in users only)
        ================================= */}

        <Route
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/newproject"
            element={<NewProject />}
          />

          <Route
            path="/workflow"
            element={<Workflow />}
          />

          <Route
            path="/projects"
            element={<Projects />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>

        {/* ================================
            FALLBACK
        ================================= */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </Router>
  )
}

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </AppProvider>
  )
}

export default App