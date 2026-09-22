export const validateEmail = (email) => {
  if (!email) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address.'
  }
  return null
}

export const validatePassword = (password) => {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  return null
}

export const validateConfirmPassword = (password, confirm) => {
  if (!confirm) return 'Please confirm your password'
  if (password !== confirm) return 'Passwords do not match'
  return null
}

export const validateName = (name) => {
  if (!name || !name.trim()) return 'Name is required'
  return null
}

export const calculatePasswordStrength = (password) => {
  let score = 0
  if (password.length >= 8) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++
  return score
}

export const getStrengthInfo = (score) => {
  if (score <= 1) return { text: 'Weak', color: '#ef4444', pct: 25 }
  if (score === 2) return { text: 'Medium', color: '#f59e0b', pct: 50 }
  if (score >= 3) return { text: 'Strong', color: '#10b981', pct: 100 }
  return { text: '—', color: '#e5e7eb', pct: 0 }
}