/**
 * Applies the Appearance settings (theme / font size / accent color)
 * to the whole app by toggling a class + CSS variables on <html>.
 * Global CSS in index.css reacts to these (see the "APPEARANCE" section).
 */

const FONT_SCALE = {
  small: '87.5%',
  medium: '100%',
  large: '112.5%',
}

const ACCENT_HEX = {
  indigo: '#4f46e5',
  blue: '#2563eb',
  purple: '#9333ea',
  green: '#16a34a',
}

export function applyAppearance(settings) {
  if (!settings) return

  const root = document.documentElement

  root.classList.toggle('dark', settings.theme === 'dark')

  root.style.fontSize = FONT_SCALE[settings.font_size] || FONT_SCALE.medium

  root.style.setProperty(
    '--accent-color',
    ACCENT_HEX[settings.accent_color] || ACCENT_HEX.indigo
  )

  if (settings.animations_enabled === false) {
    root.classList.add('no-animations')
  } else {
    root.classList.remove('no-animations')
  }
}