import React, { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

import { useAuthContext } from '../../context/AuthContext'

import SignIn from './SignIn'
import SignUp from './SignUp'
import ForgotPassword from './ForgotPassword'

const AuthPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const { isAuthenticated, loading } = useAuthContext()

  const mode = searchParams.get('mode') || 'signin'

  // Close this page as soon as sign-in/sign-up succeeds, by whatever route:
  // the email/password form, "Continue with Google", or a session that was
  // already valid when the page opened. Watching the shared auth state here
  // means the redirect happens even if a child form component forgets to
  // navigate itself, so the auth page never sits open after a success.
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, loading, navigate])

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#fafbff]">

      {mode === 'signup' ? (
        <SignUp />
      ) : mode === 'forgot' ? (
        <ForgotPassword />
      ) : (
        <SignIn />
      )}

    </div>
  )
}

export default AuthPage