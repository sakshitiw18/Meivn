import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import {
  getAccountSettings, updateAccountSettings, changePassword, deleteAccount,
  getAppearanceSettings, updateAppearanceSettings,
  getPrivacySettings, updatePrivacySettings, exportMyData, clearAllConversations,
  getSecuritySettings, updateSecuritySettings,
  getSessions, getLoginHistory, revokeSession, revokeAllSessions,
} from '../../services/api'
import { applyAppearance } from '../../utils/appearance'

/* ============================================================
   SETTINGS NAVIGATION
============================================================ */

const SETTINGS_NAV = [
  { id: 'account', icon: 'fa-user', label: 'Account' },
  { id: 'appearance', icon: 'fa-palette', label: 'Appearance' },
  { id: 'privacy', icon: 'fa-lock', label: 'Privacy & Data' },
  { id: 'security', icon: 'fa-shield-alt', label: 'Security' }
]


/* ============================================================
   MAIN SETTINGS PAGE
============================================================ */

const Settings = () => {
  const [activeSection, setActiveSection] = useState('account')

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#fafbff]">

      <div className="flex min-h-[calc(100vh-80px)] w-full">

        <aside
          className="
            hidden md:block w-64 min-w-[16rem] flex-shrink-0 bg-white
            border-r border-gray-100 p-4 sticky top-0
            h-[calc(100vh-80px)] overflow-y-auto
          "
        >

          <div className="mb-6 pt-2 px-1">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Settings
            </h3>
          </div>

          <div className="space-y-1">
            {SETTINGS_NAV.map((item) => {
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                    text-sm transition text-left
                    ${isActive ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}
                  `}
                >
                  <i className={`fas ${item.icon} w-5 text-sm flex-shrink-0`}></i>
                  <span className="leading-5">{item.label}</span>
                </button>
              )
            })}
          </div>

        </aside>


        <main className="flex-1 min-w-0 w-full bg-[#fafbff]">

          <div
            className="
              md:hidden w-full bg-white border-b border-gray-100 p-4
              sticky top-0 z-10 overflow-x-auto
            "
          >
            <div className="flex gap-2 whitespace-nowrap">
              {SETTINGS_NAV.map((item) => {
                const isActive = activeSection === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm transition
                      ${isActive ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}
                    `}
                  >
                    <i className={`fas ${item.icon} mr-1.5`}></i>
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="w-full max-w-none px-6 py-6 lg:px-8 lg:py-8">

            {activeSection === 'account' && <AccountSettings />}
            {activeSection === 'appearance' && <AppearanceSettings />}
            {activeSection === 'privacy' && <PrivacySettings />}
            {activeSection === 'security' && <SecuritySettings />}

          </div>

        </main>

      </div>

    </div>
  )
}


/* ============================================================
   REUSABLE SETTINGS CARD
============================================================ */

const SettingsCard = ({ title, icon, description, children }) => {
  return (
    <div className="w-full max-w-none bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
        <i className={`fas ${icon} text-indigo-600`}></i>
        {title}
      </h3>
      <p className="text-sm text-gray-500 mb-6">{description}</p>
      {children}
    </div>
  )
}

const LoadingCard = ({ title, icon, description }) => (
  <SettingsCard title={title} icon={icon} description={description}>
    <div className="text-sm text-gray-400">Loading...</div>
  </SettingsCard>
)

const LoadErrorCard = ({ title, icon, description }) => (
  <SettingsCard title={title} icon={icon} description={description}>
    <div className="text-sm text-red-500">
      Could not load this section. Make sure the backend server is running
      (and was restarted after the latest code update), then refresh the page.
    </div>
  </SettingsCard>
)


/* ============================================================
   SAVE BAR — every settings section with editable fields gets one.
   Buttons stay disabled until something actually changed, so it's
   obvious when a change hasn't been saved yet.
============================================================ */

const SaveBar = ({ isDirty, status, onSave }) => {
  return (
    <div className="flex items-center justify-between gap-4 pt-6 mt-6 border-t border-gray-100">

      <span className="text-xs">
        {status === 'saving' && <span className="text-gray-400">Saving...</span>}
        {status === 'error' && <span className="text-red-500">Could not save — is the backend running?</span>}
        {status !== 'saving' && status !== 'error' && isDirty && (
          <span className="text-amber-600">You have unsaved changes</span>
        )}
        {status !== 'saving' && status !== 'error' && !isDirty && (
          <span className="text-green-600">
            <i className="fas fa-check-circle mr-1"></i>
            All changes saved
          </span>
        )}
      </span>

      <button
        type="button"
        onClick={onSave}
        disabled={!isDirty || status === 'saving'}
        className={`
          px-5 py-2 rounded-full text-sm font-semibold transition
          ${
            isDirty && status !== 'saving'
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        Save changes
      </button>

    </div>
  )
}


/* ============================================================
   TOGGLE (controlled)
============================================================ */

const Toggle = ({ checked = false, onChange }) => {
  return (
    <button
      type="button"
      onClick={() => onChange && onChange(!checked)}
      className={`
        relative w-11 h-6 rounded-full flex-shrink-0 transition-colors duration-200
        ${checked ? 'bg-indigo-600' : 'bg-gray-300'}
      `}
      aria-pressed={checked}
    >
      <span
        className={`
          absolute top-1 w-4 h-4 bg-white rounded-full shadow
          transition-transform duration-200
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  )
}

const ToggleRow = ({ title, description, checked = false, onChange }) => {
  return (
    <div className="flex items-center justify-between gap-6 py-3 border-b border-gray-100 last:border-0">
      <div className="min-w-0">
        <div className="font-medium text-sm text-gray-800">{title}</div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}


/* ============================================================
   ACCOUNT SETTINGS
============================================================ */

const AccountSettings = () => {

  const navigate = useNavigate()
  const { signOut } = useAuthContext()

  const [saved, setSaved] = useState(null)
  const [draft, setDraft] = useState(null)
  const [loadError, setLoadError] = useState(false)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    getAccountSettings()
      .then((data) => { setSaved(data); setDraft(data) })
      .catch((err) => { console.error(err); setLoadError(true) })
  }, [])

  const isDirty = saved && draft && JSON.stringify(saved) !== JSON.stringify(draft)

  const handleSave = async () => {
    setStatus('saving')
    try {
      const updated = await updateAccountSettings(draft)
      setSaved(updated)
      setDraft(updated)
      setStatus('idle')
    } catch (err) {
      console.error('Failed to save account settings:', err)
      setStatus('error')
    }
  }

  const handleChangePassword = async () => {
    const newPassword = window.prompt('Enter a new password (min 6 characters):')
    if (!newPassword) return

    try {
      await changePassword(newPassword)
      alert('Password updated.')
    } catch (err) {
      console.error(err)
      alert('Could not update password. Make sure it is at least 6 characters.')
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'This will permanently delete your account and ALL data — projects, memories, and settings. This cannot be undone. Continue?'
    )
    if (!confirmed) return

    try {
      await deleteAccount()
      window.location.reload()
    } catch (err) {
      console.error(err)
      alert('Could not delete account.')
    }
  }

  if (loadError) {
    return <div className="w-full"><LoadErrorCard title="Account" icon="fa-user" description="Basic account and profile management." /></div>
  }

  if (!draft) {
    return <div className="w-full"><LoadingCard title="Account" icon="fa-user" description="Basic account and profile management." /></div>
  }

  return (
    <div className="w-full">
      <SettingsCard title="Account" icon="fa-user" description="Basic account and profile management.">

        <div className="space-y-4">

          <div className="flex items-center gap-6 pb-4 border-b border-gray-100">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl flex-shrink-0">
              <i className="fas fa-user"></i>
            </div>
            <div>
              <button type="button" className="text-sm text-indigo-600 font-medium hover:text-indigo-800">
                Change photo
              </button>
              <p className="text-xs text-gray-400">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Input label="Name" value={draft.name} onChange={(value) => setDraft({ ...draft, name: value })} />
            <Input label="Username" value={draft.username} onChange={(value) => setDraft({ ...draft, username: value })} />
            <div className="lg:col-span-2">
              <Input label="Email" type="email" value={draft.email} onChange={(value) => setDraft({ ...draft, email: value })} />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="text-sm font-medium text-gray-700">Account Type</label>
            <div className="mt-2 flex items-center gap-4">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium">
                {draft.account_type}
              </span>
              <button type="button" className="text-sm text-indigo-600 hover:text-indigo-800">
                Upgrade
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button type="button" onClick={handleChangePassword} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              Change password
            </button>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="text-sm font-medium text-gray-700">Email preferences</label>
            <div className="mt-2">
              <ToggleRow
                title="Product updates"
                description="Receive emails about new features and improvements"
                checked={draft.email_product_updates}
                onChange={(value) => setDraft({ ...draft, email_product_updates: value })}
              />
              <ToggleRow
                title="Security alerts"
                description="Get notified about security events"
                checked={draft.email_security_alerts}
                onChange={(value) => setDraft({ ...draft, email_security_alerts: value })}
              />
              <ToggleRow
                title="Marketing emails"
                description="Promotional content and offers"
                checked={draft.email_marketing}
                onChange={(value) => setDraft({ ...draft, email_marketing: value })}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button type="button" onClick={handleDeleteAccount} className="text-sm text-red-600 hover:text-red-800 font-medium">
              Delete account
            </button>
            <p className="text-xs text-gray-400 mt-1">Permanently delete your account and all associated data.</p>
          </div>

        </div>

        <SaveBar isDirty={isDirty} status={status} onSave={handleSave} />

      </SettingsCard>
    </div>
  )
}


/* ============================================================
   APPEARANCE
============================================================ */

const AppearanceSettings = () => {

  const [saved, setSaved] = useState(null)
  const [draft, setDraft] = useState(null)
  const [loadError, setLoadError] = useState(false)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    getAppearanceSettings()
      .then((data) => { setSaved(data); setDraft(data); applyAppearance(data) })
      .catch((err) => { console.error(err); setLoadError(true) })
  }, [])

  const isDirty = saved && draft && JSON.stringify(saved) !== JSON.stringify(draft)

  // Updates the local draft AND previews it live across the app immediately —
  // it's only persisted to the backend (and safe from a refresh) once "Save
  // changes" is clicked below.
  const updateDraft = (changes) => {
    const next = { ...draft, ...changes }
    setDraft(next)
    applyAppearance(next)
  }

  const handleSave = async () => {
    setStatus('saving')
    try {
      const updated = await updateAppearanceSettings(draft)
      setSaved(updated)
      setDraft(updated)
      applyAppearance(updated)
      setStatus('idle')
    } catch (err) {
      console.error('Failed to save appearance settings:', err)
      setStatus('error')
      alert('Could not save appearance settings. Make sure the backend is running and was restarted after the latest update.')
    }
  }

  const accentColors = [
    { id: 'indigo', className: 'bg-indigo-500' },
    { id: 'blue', className: 'bg-blue-500' },
    { id: 'purple', className: 'bg-purple-500' },
    { id: 'green', className: 'bg-green-500' }
  ]

  if (loadError) {
    return <LoadErrorCard title="Appearance" icon="fa-palette" description="Controls how the website looks." />
  }

  if (!draft) {
    return <LoadingCard title="Appearance" icon="fa-palette" description="Controls how the website looks." />
  }

  return (
    <SettingsCard title="Appearance" icon="fa-palette" description="Controls how the website looks.">

      <div className="space-y-4">

        <div>
          <label className="text-sm font-medium text-gray-700">Theme</label>
          <div className="mt-2 flex gap-3 flex-wrap">
            {['light', 'dark'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => updateDraft({ theme: item })}
                className={`
                  px-4 py-2 rounded-lg text-sm transition capitalize
                  ${
                    draft.theme === item
                      ? 'border-2 border-indigo-500 bg-indigo-50 text-indigo-600 font-medium'
                      : 'border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                  }
                `}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <label className="text-sm font-medium text-gray-700">Accent color</label>
          <div className="mt-2 flex gap-3">
            {accentColors.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => updateDraft({ accent_color: color.id })}
                className={`
                  w-8 h-8 rounded-full ${color.className}
                  ${draft.accent_color === color.id ? 'border-2 border-indigo-500 ring-2 ring-indigo-200' : 'border-2 border-transparent'}
                `}
                aria-label={`${color.id} accent`}
              />
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <label className="text-sm font-medium text-gray-700">Font size</label>
          <div className="mt-2 flex gap-3 flex-wrap">
            {['small', 'medium', 'large'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => updateDraft({ font_size: item })}
                className={`
                  px-4 py-2 rounded-lg text-sm capitalize transition
                  ${
                    draft.font_size === item
                      ? 'border-2 border-indigo-500 bg-indigo-50 text-indigo-600 font-medium'
                      : 'border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                  }
                `}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <ToggleRow
            title="Animations"
            description="Enable smooth animations throughout the interface"
            checked={draft.animations_enabled}
            onChange={(value) => updateDraft({ animations_enabled: value })}
          />
        </div>

      </div>

      <SaveBar isDirty={isDirty} status={status} onSave={handleSave} />

    </SettingsCard>
  )
}



/* ============================================================
   PRIVACY
============================================================ */

const PrivacySettings = () => {

  const [saved, setSaved] = useState(null)
  const [draft, setDraft] = useState(null)
  const [loadError, setLoadError] = useState(false)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    getPrivacySettings()
      .then((data) => { setSaved(data); setDraft(data) })
      .catch((err) => { console.error(err); setLoadError(true) })
  }, [])

  const isDirty = saved && draft && JSON.stringify(saved) !== JSON.stringify(draft)

  const handleSave = async () => {
    setStatus('saving')
    try {
      const updated = await updatePrivacySettings(draft)
      setSaved(updated)
      setDraft(updated)
      setStatus('idle')
    } catch (err) {
      console.error('Failed to save privacy settings:', err)
      setStatus('error')
    }
  }

  const handleExport = async () => {
    try {
      const data = await exportMyData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'my-data-export.json'
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to export data:', err)
      alert('Could not export your data.')
    }
  }

  const handleDeleteChatHistory = async () => {
    const confirmed = window.confirm('Permanently delete all your conversations? This cannot be undone.')
    if (!confirmed) return
    try {
      await clearAllConversations()
      alert('Chat history deleted.')
    } catch (err) {
      console.error('Failed to delete chat history:', err)
      alert('Could not delete chat history.')
    }
  }

  const handleClearAll = async () => {
    const confirmed = window.confirm('Clear all conversations? This cannot be undone.')
    if (!confirmed) return
    try {
      await clearAllConversations()
      alert('All conversations cleared.')
    } catch (err) {
      console.error('Failed to clear conversations:', err)
      alert('Could not clear conversations.')
    }
  }

  if (loadError) {
    return <LoadErrorCard title="Privacy & Data" icon="fa-lock" description="Control your data and privacy settings." />
  }

  if (!draft) {
    return <LoadingCard title="Privacy & Data" icon="fa-lock" description="Control your data and privacy settings." />
  }

  return (
    <SettingsCard title="Privacy & Data" icon="fa-lock" description="Control your data and privacy settings.">

      <div className="space-y-4">

        <ToggleRow
          title="Chat history"
          description="Save your conversation history"
          checked={draft.save_chat_history}
          onChange={(value) => setDraft({ ...draft, save_chat_history: value })}
        />

        <ToggleRow
          title="Use conversations to improve AI"
          description="Help us train and improve our models"
          checked={draft.improve_ai_with_conversations}
          onChange={(value) => setDraft({ ...draft, improve_ai_with_conversations: value })}
        />

        <div className="pt-4 border-t border-gray-100">
          <label className="text-sm font-medium text-gray-700">Data export</label>
          <button type="button" onClick={handleExport} className="mt-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition">
            Export my data
          </button>
          <p className="text-xs text-gray-400 mt-1">Export all your data in JSON format</p>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button type="button" onClick={handleDeleteChatHistory} className="text-sm text-red-600 hover:text-red-800 font-medium">
            Delete chat history
          </button>
          <p className="text-xs text-gray-400 mt-1">Permanently delete all your conversations</p>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button type="button" onClick={handleClearAll} className="text-sm text-red-600 hover:text-red-800 font-medium">
            Clear all conversations
          </button>
          <p className="text-xs text-gray-400 mt-1">Clear all chat history (cannot be undone)</p>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-indigo-600 hover:text-indigo-800">
            Privacy policy
          </a>
          <p className="text-xs text-gray-400 mt-1">Data retention: 30 days for free users, 90 days for Pro users</p>
        </div>

      </div>

      <SaveBar isDirty={isDirty} status={status} onSave={handleSave} />

    </SettingsCard>
  )
}


/* ============================================================
   SECURITY
============================================================ */

const formatTimeAgo = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000))
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

const SecuritySettings = () => {

  const [saved, setSaved] = useState(null)
  const [draft, setDraft] = useState(null)
  const [loadError, setLoadError] = useState(false)
  const [status, setStatus] = useState('idle')
  const [sessions, setSessions] = useState([])
  const [history, setHistory] = useState([])

  useEffect(() => {
    getSecuritySettings()
      .then((data) => { setSaved(data); setDraft(data) })
      .catch((err) => { console.error(err); setLoadError(true) })

    getSessions().then(setSessions).catch(console.error)
    getLoginHistory().then(setHistory).catch(console.error)
  }, [])

  const isDirty = saved && draft && JSON.stringify(saved) !== JSON.stringify(draft)

  const handleSave = async () => {
    setStatus('saving')
    try {
      const updated = await updateSecuritySettings(draft)
      setSaved(updated)
      setDraft(updated)
      setStatus('idle')
    } catch (err) {
      console.error('Failed to save security settings:', err)
      setStatus('error')
    }
  }

  const handleChangePassword = async () => {
    const newPassword = window.prompt('Enter a new password (min 6 characters):')
    if (!newPassword) return
    try {
      await changePassword(newPassword)
      alert('Password updated.')
    } catch (err) {
      console.error(err)
      alert('Could not update password. Make sure it is at least 6 characters.')
    }
  }

  const handleRevoke = async (sessionId) => {
    try {
      await revokeSession(sessionId)
      setSessions((prev) => prev.filter((session) => session.id !== sessionId))
    } catch (err) {
      console.error('Failed to revoke session:', err)
    }
  }

  const handleLogoutAll = async () => {
    const confirmed = window.confirm('Log out of all devices?')
    if (!confirmed) return
    try {
      await revokeAllSessions()
      setSessions([])
    } catch (err) {
      console.error('Failed to log out of all devices:', err)
    }
  }

  if (loadError) {
    return <LoadErrorCard title="Security" icon="fa-shield-alt" description="Secure your account." />
  }

  if (!draft) {
    return <LoadingCard title="Security" icon="fa-shield-alt" description="Secure your account." />
  }

  return (
    <SettingsCard title="Security" icon="fa-shield-alt" description="Secure your account.">

      <div className="space-y-4">

        <div>
          <button type="button" onClick={handleChangePassword} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            Change password
          </button>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <ToggleRow
            title="Two-factor authentication (2FA)"
            description="Add an extra layer of security"
            checked={draft.twofa_enabled}
            onChange={(value) => setDraft({ ...draft, twofa_enabled: value })}
          />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <ToggleRow
            title="Passkeys"
            description="Use biometric authentication"
            checked={draft.passkeys_enabled}
            onChange={(value) => setDraft({ ...draft, passkeys_enabled: value })}
          />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <label className="text-sm font-medium text-gray-700">Active sessions</label>
          <div className="mt-2 space-y-2">
            {sessions.length === 0 && <p className="text-sm text-gray-400">No active sessions.</p>}
            {sessions.map((session) => (
              <SessionRow
                key={session.id}
                device={session.is_current ? `${session.device} (this device)` : session.device}
                time={`Last active: ${formatTimeAgo(session.last_active_at)}`}
                onRevoke={session.is_current ? null : () => handleRevoke(session.id)}
              />
            ))}
          </div>
          <button type="button" onClick={handleLogoutAll} className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium">
            Log out of all devices
          </button>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <label className="text-sm font-medium text-gray-700">Login history</label>
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            {history.length === 0 && <p className="text-sm text-gray-400">No login history yet.</p>}
            {history.map((item) => (
              <div key={item.id}>{new Date(item.created_at).toLocaleString()} — {item.device}</div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <ToggleRow
            title="Security alerts"
            description="Get notified about suspicious activity"
            checked={draft.security_alerts_enabled}
            onChange={(value) => setDraft({ ...draft, security_alerts_enabled: value })}
          />
        </div>

      </div>

      <SaveBar isDirty={isDirty} status={status} onSave={handleSave} />

    </SettingsCard>
  )
}


/* ============================================================
   INPUT (controlled)
============================================================ */

const Input = ({ label, value, type = 'text', onChange }) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="
          w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg
          focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none
        "
      />
    </div>
  )
}


/* ============================================================
   SESSION ROW
============================================================ */

const SessionRow = ({ device, time, onRevoke }) => {
  return (
    <div className="flex items-center justify-between gap-4 py-2 px-3 bg-gray-50 rounded-lg">
      <div>
        <span className="text-sm font-medium">{device}</span>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
      {onRevoke && (
        <button type="button" onClick={onRevoke} className="text-sm text-red-500 hover:text-red-700">
          Revoke
        </button>
      )}
    </div>
  )
}


export default Settings