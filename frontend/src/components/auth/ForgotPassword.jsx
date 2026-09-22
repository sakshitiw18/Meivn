import React from 'react'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    const success = document.getElementById('forgot-success')

    if (success) {
      success.classList.remove('hidden')
    }
  }

  return (
    <div className="auth-container py-8">

      <div className="auth-card">

        <div className="text-center mb-6">

          <div className="text-3xl font-bold tracking-tight logo-text">
            meɪvn
          </div>

          <h2 className="text-2xl font-bold mt-3">
            Reset your password
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Enter your email address and we'll send you a reset link
          </p>

        </div>

        <form
          id="forgot-form"
          onSubmit={handleSubmit}
        >

          <div className="mb-5">

            <label
              className="auth-label"
              htmlFor="forgot-email"
            >
              Email
            </label>

            <input
              id="forgot-email"
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              required
            />

            <div
              id="forgot-email-error"
              className="auth-error hidden"
            >
              <i className="fas fa-exclamation-circle text-xs"></i>
              <span></span>
            </div>

          </div>

          <button
            id="forgot-btn"
            type="submit"
            className="btn-primary text-white w-full py-3 rounded-full text-sm font-semibold transition"
          >
            Send reset link
          </button>

          <div
            id="forgot-success"
            className="mt-3 hidden auth-success"
          >
            <i className="fas fa-check-circle"></i>
            Reset request submitted
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">

            <button
              type="button"
              onClick={() => navigate('/auth?mode=signin')}
              className="auth-link bg-transparent border-0 p-0"
            >
              <i className="fas fa-arrow-left mr-1"></i>
              Back to sign in
            </button>

          </p>

        </form>

      </div>

    </div>
  )
}

export default ForgotPassword