import { useEffect, useState } from 'react'
import { THEME_MODES, applyTheme, getStoredTheme, type ThemeId } from '../lib/theme'

// Reader-mode switcher (header, top-left): four preview dots —
// light / dark / sepia / night. The swatch colours are fixed previews of
// each mode (never themed), the active ring follows the current mode.
export default function ThemeSelect() {
  const [mode, setMode] = useState<ThemeId>(() => getStoredTheme())

  // keep in sync when another tab changes the stored mode
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'sp-theme') setMode(getStoredTheme())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const pick = (m: ThemeId) => {
    setMode(m)
    applyTheme(m)
  }

  return (
    <div
      role="radiogroup"
      aria-label="Colour mode"
      title="Colour mode"
      className="flex items-center gap-2 rounded-full border border-ink-500/70 bg-ink-700/70 px-2 py-[5px]"
    >
      {THEME_MODES.map((t) => {
        const active = t.id === mode
        return (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={active}
            title={`${t.label} — ${t.hint}`}
            aria-label={`Switch to ${t.label} mode`}
            onClick={() => pick(t.id)}
            className={`relative h-3.5 w-3.5 rounded-full border transition-transform duration-200 hover:scale-110 ${
              active
                ? 'scale-110 border-greenBright ring-2 ring-green/60 ring-offset-2 ring-offset-canvas'
                : 'border-ink-500/80'
            }`}
            style={{ background: t.canvas }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 m-auto h-1.5 w-1.5 rounded-full"
              style={{ background: t.accent }}
            />
          </button>
        )
      })}
    </div>
  )
}
