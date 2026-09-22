import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import { triggerGoogleSignIn } from '../../utils/googleAuth'

const SignIn = () => {
  const navigate = useNavigate()
  const { signIn, signInWithGoogle } = useAuthContext()

  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    const email = document.getElementById('signin-email')?.value?.trim()
    const password = document.getElementById('signin-password')?.value

    if (!email || !password) {
      setFormError('Enter your email and password.')
      return
    }

    setSubmitting(true)
    const result = await signIn(email, password)
    setSubmitting(false)

    if (result.ok) {
      navigate('/dashboard')
    } else {
      setFormError(result.error || 'Incorrect email or password.')
    }
  }

  const togglePassword = () => {
    const input = document.getElementById('signin-password')
    const button = document.getElementById('signin-password-toggle')
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
          setFormError(result.error || 'Could not sign in with Google.')
        }
      },
      (message) => setFormError(message)
    )
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
            Welcome back
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Sign in to continue to your account
          </p>

        </div>

        <form
          id="signin-form"
          onSubmit={handleSubmit}
        >

          {/* Email */}
          <div className="mb-4">

            <label
              className="auth-label"
              htmlFor="signin-email"
            >
              Email
            </label>

            <input
              id="signin-email"
              type="email"
              className="auth-input"
              placeholder="you@example.com"
            />

            <div
              id="signin-email-error"
              className="auth-error hidden"
            >
              <span></span>
            </div>

          </div>

          {/* Password */}
          <div className="mb-4">

            <label
              className="auth-label"
              htmlFor="signin-password"
            >
              Password
            </label>

            <div className="password-wrapper">

              <input
                id="signin-password"
                type="password"
                className="auth-input pr-10"
                placeholder="••••••••"
              />

              <button
                id="signin-password-toggle"
                type="button"
                className="password-toggle"
                onClick={togglePassword}
              >
                <i className="fas fa-eye"></i>
              </button>

            </div>

            <div
              id="signin-password-error"
              className="auth-error hidden"
            >
              <span></span>
            </div>

          </div>

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between mb-5">

            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">

              <input
                type="checkbox"
                id="remember-me"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />

              Remember me

            </label>

            <button
              type="button"
              onClick={() => navigate('/auth?mode=forgot')}
              className="auth-link text-sm bg-transparent border-0 p-0"
            >
              Forgot password?
            </button>

          </div>

          {formError && (
            <div className="auth-error mb-4">
              <i className="fas fa-circle-exclamation"></i>
              <span>{formError}</span>
            </div>
          )}

          {/* Sign In */}
          <button
            id="signin-btn"
            type="submit"
            disabled={submitting}
            className="btn-primary text-white w-full py-3 rounded-full text-sm font-semibold transition disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
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

          {/* Sign Up */}
          <p className="text-center text-sm text-gray-500 mt-4">

            Don't have an account?{' '}

            <button
              type="button"
              onClick={() => navigate('/auth?mode=signup')}
              className="auth-link bg-transparent border-0 p-0"
            >
              Sign up
            </button>

          </p>

        </form>

      </div>

    </div>
  )
}

export default SignIn