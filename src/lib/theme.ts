// Reader modes: light (default), dark, sepia, night.
// The single source of truth for the palette itself is src/index.css
// (:root + [data-theme='...'] channel blocks); these entries drive the
// header switcher swatches and the <meta name="theme-color"> sync.

export const THEME_MODES = [
  { id: 'light', label: 'Light', hint: 'default', canvas: '#F5F4EF', accent: '#102A54', meta: '#F5F4EF' },
  { id: 'dark', label: 'Dark', hint: 'high contrast', canvas: '#0F0E0C', accent: '#9CC0F0', meta: '#0F0E0C' },
  { id: 'sepia', label: 'Sepia', hint: 'warm paper', canvas: '#EEE4CF', accent: '#6C4E26', meta: '#EEE4CF' },
  { id: 'night', label: 'Night', hint: 'dim, easy on the eyes', canvas: '#1B1916', accent: '#C29A5B', meta: '#1B1916' },
] as const

export type ThemeId = (typeof THEME_MODES)[number]['id']

const KEY = 'sp-theme'

export function getStoredTheme(): ThemeId {
  try {
    const m = localStorage.getItem(KEY)
    if (m === 'dark' || m === 'sepia' || m === 'night') return m
  } catch {
    /* storage blocked — fall through to light */
  }
  return 'light'
}

export function applyTheme(id: ThemeId) {
  const root = document.documentElement
  root.setAttribute('data-theme', id)
  try {
    localStorage.setItem(KEY, id)
  } catch {
    /* ignore */
  }
  const t = THEME_MODES.find((m) => m.id === id)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (t && meta) meta.setAttribute('content', t.meta)
}
