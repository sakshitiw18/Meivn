import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
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

function AppRoutes() {

  // Apply the saved theme / font size / accent color on load, for everyone —
  // signed in or not — so it's consistent on every page, not just Settings.
  useEffect(() => {
    getAppearanceSettings().then(applyAppearance).catch(() => {})
  }, [])

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
            AUTH (available to anyone who wants
            to sign in / sign up — never required)
        ================================= */}

        <Route
          path="/auth"
          element={<AuthPage />}
        />

        {/* ================================
            PLATFORM (open to everyone — signing
            in is optional, not a requirement)
        ================================= */}

        <Route
          element={<Layout />}
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