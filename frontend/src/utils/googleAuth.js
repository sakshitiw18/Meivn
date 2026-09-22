/**
 * Triggers Google Sign-In from our own custom-styled "Continue with Google"
 * button, using Google Identity Services (loaded via the <script> tag in
 * index.html). Requires VITE_GOOGLE_CLIENT_ID in the frontend's .env.
 *
 * Design notes (both of these caused real bugs before):
 *
 * 1. We do NOT use google.accounts.id.prompt() ("One Tap"). One Tap is meant
 *    to appear automatically once per session and Google deliberately cools
 *    it down after it's dismissed, so it can't drive a manual button. Instead
 *    we render Google's own real button off-screen and forward clicks to it,
 *    which opens the real account picker every time.
 *
 * 2. google.accounts.id.initialize() binds its callback into the button at
 *    render time. Because this module (and the rendered button) outlive any
 *    single React page, re-initializing later does NOT rebind an
 *    already-rendered button — it would keep calling the FIRST page's
 *    callback, which by then is unmounted, so a successful Google sign-in
 *    would appear to do nothing. To avoid that, we initialize exactly once
 *    with a permanent callback that delegates to `currentHandler`, and each
 *    caller just swaps `currentHandler` before clicking.
 */

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

let initialized = false
let hiddenButtonContainer = null

// Always points at the handler for whichever page requested sign-in last.
let currentHandler = null

function setupOnce() {
  if (initialized) return

  window.google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: (response) => {
      // Delegate to whoever asked most recently, so the live component
      // handles the credential rather than a stale one.
      if (currentHandler && response && response.credential) {
        currentHandler(response.credential)
      }
    },
  })

  hiddenButtonContainer = document.createElement('div')
  hiddenButtonContainer.setAttribute('aria-hidden', 'true')
  hiddenButtonContainer.style.position = 'fixed'
  hiddenButtonContainer.style.top = '-9999px'
  hiddenButtonContainer.style.left = '-9999px'
  document.body.appendChild(hiddenButtonContainer)

  window.google.accounts.id.renderButton(hiddenButtonContainer, {
    type: 'standard',
    theme: 'outline',
    size: 'large',
  })

  initialized = true
}

export function triggerGoogleSignIn(onCredential, onError) {
  if (!CLIENT_ID) {
    onError && onError(
      'Google Sign-In is not configured yet — set VITE_GOOGLE_CLIENT_ID (frontend .env) ' +
      'and GOOGLE_CLIENT_ID (backend .env) to the same OAuth Client ID, then restart both servers.'
    )
    return
  }

  if (!window.google || !window.google.accounts || !window.google.accounts.id) {
    onError && onError('Google Sign-In script has not loaded yet — check your connection and try again.')
    return
  }

  currentHandler = onCredential

  try {
    setupOnce()
  } catch (err) {
    console.error('Google Sign-In setup failed:', err)
    onError && onError('Could not start Google sign-in. Check that your OAuth Client ID is correct.')
    return
  }

  const clickTarget = hiddenButtonContainer.querySelector('div[role="button"]')

  if (clickTarget) {
    clickTarget.click()
    return
  }

  // Rare: Google's button hadn't finished rendering on the very first click.
  setTimeout(() => {
    const retryTarget = hiddenButtonContainer.querySelector('div[role="button"]')
    if (retryTarget) {
      retryTarget.click()
    } else {
      onError && onError('Could not open Google sign-in. Please try again.')
    }
  }, 300)
}