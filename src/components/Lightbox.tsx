import { useEffect, useCallback } from 'react'
import type { MediaItem } from '../data/projects'
import MediaPanel from './MediaPanel'

export default function Lightbox({
  items,
  index,
  onClose,
  onNav,
}: {
  items: MediaItem[]
  index: number
  onClose: () => void
  onNav: (i: number) => void
}) {
  const item = items[index]

  const prev = useCallback(
    () => onNav((index - 1 + items.length) % items.length),
    [index, items.length, onNav],
  )
  const next = useCallback(() => onNav((index + 1) % items.length), [index, items.length, onNav])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, prev, next])

  if (!item) return null

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fadeIn flex-col bg-ink-950/97"
      role="dialog"
      aria-modal="true"
      aria-label={item.label ?? 'Media viewer'}
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 py-3">
        <p className="truncate font-mono text-[11px] text-snow/60">
          {item.label ?? 'asset'} — {index + 1}/{items.length}
        </p>
        <button
          onClick={onClose}
          className="border border-snow/30 px-3 py-1 font-mono text-[11px] text-snow transition-colors hover:border-greenBright hover:text-greenBright"
        >
          esc / close
        </button>
      </div>

      <div
        className="flex min-h-0 flex-1 items-center justify-center px-4 pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <MediaPanel item={item} className="max-h-full max-w-6xl" />
      </div>

      <div className="flex items-center justify-between px-5 py-3">
        <button
          onClick={prev}
          className="border border-snow/30 px-4 py-1.5 font-mono text-[11px] text-snow transition-colors hover:border-greenBright hover:text-greenBright"
        >
          ← prev
        </button>
        <span className="font-mono text-[11px] text-snow/60">arrow keys to browse</span>
        <button
          onClick={next}
          className="border border-snow/30 px-4 py-1.5 font-mono text-[11px] text-snow transition-colors hover:border-greenBright hover:text-greenBright"
        >
          next →
        </button>
      </div>
    </div>
  )
}
