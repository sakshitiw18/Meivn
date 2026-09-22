import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import { triggerGoogleSignIn } from '../../utils/googleAuth'

const SignUp = () => {
  const navigate = useNavigate()
  const { signUp, signInWithGoogle } = useAuthContext()

  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    const name = document.getElementById('signup-name')?.value?.trim()
    const email = document.getElementById('signup-email')?.value?.trim()
    const password = document.getElementById('signup-password')?.value
    const confirm = document.getElementById('signup-confirm')?.value

    if (!name || !email || !password) {
      setFormError('Fill in your name, email, and password.')
      return
    }

    if (password !== confirm) {
      setFormError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.')
      return
    }

    setSubmitting(true)
    const result = await signUp(name, email, password)
    setSubmitting(false)

    if (result.ok) {
      navigate('/dashboard')
    } else {
      setFormError(result.error || 'Could not create your account. Please try again.')
    }
  }

  const handleGoogle = () => {
    setFormError('')
    triggerGoogleSignIn(
      async (credential) => {
        setSubmitting(true)
        const result = await signInWithGoogle(credential)
        setSubmitting(false)
        if (result.ok) {
          navigate('/dashboard')
        } else {
          setFormError(result.error || 'Could not sign up with Google.')
        }
      },
      (message) => setFormError(message)
    )
  }

  const togglePassword = (inputId, buttonId) => {
    const input = document.getElementById(inputId)
    const button = document.getElementById(buttonId)
    const icon = button?.querySelector('i')

    if (!input) return

    if (input.type === 'password') {
      input.type = 'text'

      if (icon) {
        icon.className = 'fas fa-eye-slash'
      }
    } else {
      input.type = 'password'

      if (icon) {
        icon.className = 'fas fa-eye'
      }
    }
  }

  const updateStrength = (value) => {
    const fill = document.getElementById('strength-fill')
    const label = document.getElementById('strength-label')

    if (!fill || !label) return

    const hasAlpha = /[a-zA-Z]/.test(value)
    const hasNumber = /\d/.test(value)
    const hasSpecial = /[^a-zA-Z0-9]/.test(value)

    let pct = 0
    let text = '—'
    let color = '#e5e7eb'

    if (value.length === 0) {
      pct = 0
      text = '—'
      color = '#e5e7eb'
    } else if (hasAlpha && hasSpecial && hasNumber) {
      // Letters + special characters + numbers
      pct = 100
      text = 'Strong'
      color = '#22c55e'
    } else if (hasAlpha && hasSpecial) {
      // Letters + special characters
      pct = 75
      text = 'Good'
      color = '#eab308'
    } else if (hasAlpha && hasNumber) {
      // Letters + numbers (no special characters)
      pct = 50
      text = 'Fair'
      color = '#f59e0b'
    } else {
      // Letters only
      pct = 25
      text = 'Weak'
      color = '#ef4444'
    }

    fill.style.width = `${pct}%`
    fill.style.background = color

    label.textContent = `Password strength: ${text}`
  }

  return (
    <div className="auth-container py-8">

      <div className="auth-card">

        {/* Header */}
        <div className="text-center mb-6">

          <div className="text-3xl font-bold tracking-tight logo-text">
            meɪvn
          </div>

          <h2 className="text-2xl font-bold mt-3">
            Create your account
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Get started with your account
          </p>

        </div>

        <form
          id="signup-form"
          onSubmit={handleSubmit}
        >

          {/* Name */}
          <div className="mb-3">

            <label
              className="auth-label"
              htmlFor="signup-name"
            >
              Name
            </label>

            <input
              id="signup-name"
              type="text"
              className="auth-input"
              placeholder="John Doe"
            />

            <div
              id="signup-name-error"
              className="auth-error hidden"
            >
              <span></span>
            </div>

          </div>

          {/* Email */}
          <div className="mb-3">

            <label
              className="auth-label"
              htmlFor="signup-email"
            >
              Email
            </label>

            <input
              id="signup-email"
              type="email"
              className="auth-input"
              placeholder="you@example.com"
            />

            <div
              id="signup-email-error"
              className="auth-error hidden"
            >
              <span></span>
            </div>

          </div>

          {/* Password */}
          <div className="mb-3">

            <label
              className="auth-label"
              htmlFor="signup-password"
            >
              Password
            </label>

            <div className="password-wrapper">

              <input
                id="signup-password"
                type="password"
                className="auth-input pr-10"
                placeholder="••••••••"
                onInput={(e) => updateStrength(e.target.value)}
              />

              <button
                id="signup-password-toggle"
                type="button"
                className="password-toggle"
                onClick={() =>
                  togglePassword(
                    'signup-password',
                    'signup-password-toggle'
                  )
                }
              >
                <i className="fas fa-eye"></i>
              </button>

            </div>

            <div
              id="signup-password-error"
              className="auth-error hidden"
            >
              <span></span>
            </div>

            {/* Password Strength */}
            <div className="mt-1">

              <div className="strength-bar">
                <div
                  id="strength-fill"
                  className="fill"
                  style={{
                    width: '0%',
                    background: '#e5e7eb'
                  }}
                ></div>
              </div>

              <div
                id="strength-label"
                className="strength-label text-gray-400"
              >
                Password strength: —
              </div>

            </div>

          </div>

          {/* Confirm Password */}
          <div className="mb-4">

            <label
              className="auth-label"
              htmlFor="signup-confirm"
            >
              Confirm Password
            </label>

            <div className="password-wrapper">

              <input
                id="signup-confirm"
                type="password"
                className="auth-input pr-10"
                placeholder="••••••••"
              />

              <button
                id="signup-confirm-toggle"
                type="button"
                className="password-toggle"
                onClick={() =>
                  togglePassword(
                    'signup-confirm',
                    'signup-confirm-toggle'
                  )
                }
              >
                <i className="fas fa-eye"></i>
              </button>

            </div>

            <div
              id="signup-confirm-error"
              className="auth-error hidden"
            >
              <span></span>
            </div>

          </div>

          {formError && (
            <div className="auth-error mb-4">
              <i className="fas fa-circle-exclamation"></i>
              <span>{formError}</span>
            </div>
          )}

          {/* Sign Up */}
          <button
            id="signup-btn"
            type="submit"
            disabled={submitting}
            className="btn-primary text-white w-full py-3 rounded-full text-sm font-semibold transition disabled:opacity-60"
          >
            {submitting ? 'Creating account...' : 'Sign Up'}
          </button>

          {/* Divider */}
          <div className="auth-divider my-5">
            <hr />
            OR
            <hr />
          </div>

          {/* Google */}
          <button
            type="button"
            className="google-btn"
            onClick={handleGoogle}
            disabled={submitting}
          >

            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 48 48'%3E%3Cpath fill='%23EA4335' d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'/%3E%3Cpath fill='%234285F4' d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'/%3E%3Cpath fill='%23FBBC05' d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'/%3E%3Cpath fill='%2334A853' d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'/%3E%3C/svg%3E"
              alt="Google"
              className="w-5 h-5"
            />

            Continue with Google

          </button>

          {/* Sign In */}
          <p className="text-center text-sm text-gray-500 mt-4">

            Already have an account?{' '}

            <button
              type="button"
              onClick={() => navigate('/auth?mode=signin')}
              className="auth-link bg-transparent border-0 p-0"
            >
              Sign in
            </button>

          </p>

        </form>

      </div>

    </div>
  )
}

export default SignUp