// ---------------------------------------------------------------------------
// Netflix-style hover preview for the whole site.
// Any element can call useHoverPreview().show(item, rect) on hover:
//   - brand logos  -> popup with the brand film auto-playing (if any),
//                     else the first still, else the logo
//   - images/videos -> popup enlarges the media, videos auto-play muted
// The popup appears ABOVE the hovered element (below if no space), clamped
// to the viewport, after a short hover delay, and closes on leave/scroll.
// ---------------------------------------------------------------------------
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { MediaItem } from '../data/projects'

export interface HoverItem {
  title: string
  subtitle?: string
  media?: MediaItem
  badge?: string
  link?: string
}

interface HoverCtx {
  show: (item: HoverItem, rect: DOMRect) => void
  hide: () => void
}

const Ctx = createContext<HoverCtx>({ show: () => {}, hide: () => {} })
export const useHoverPreview = () => useContext(Ctx)

const isVideo = (m?: MediaItem) =>
  m?.kind === 'video' || /\.(mp4|webm|mov|mkv|m4v)$/i.test(m?.src ?? '')

export function HoverPreviewProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<HoverItem | null>(null)
  const [pos, setPos] = useState({ left: 0, top: 0 })
  const timer = useRef<number | null>(null)

  const hide = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
    setItem(null)
  }, [])

  const show = useCallback((it: HoverItem, rect: DOMRect) => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      const w = Math.min(420, window.innerWidth - 24)
      // horizontal: centered over the hovered element, clamped
      let left = rect.left + rect.width / 2 - w / 2
      left = Math.max(12, Math.min(window.innerWidth - w - 12, left))
      // vertical: CENTERED on the element (popup ~300px tall), clamped so it
      // never goes under the header or off the bottom
      const popH = 300
      let top = rect.top + rect.height / 2 - popH / 2
      top = Math.max(72, Math.min(window.innerHeight - popH - 16, top))
      setItem(it)
      setPos({ left, top })
    }, 200)
  }, [])

  // close the popup when the page scrolls (fixed positioning would drift)
  useEffect(() => {
    const onScroll = () => hide()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [hide])

  return (
    <Ctx.Provider value={{ show, hide }}>
      {children}
      {item && (
        <div
          className="hover-pop pointer-events-none fixed z-50 w-[min(420px,calc(100vw-24px))] overflow-hidden rounded-lg border border-ink-500 bg-ink-950/95 shadow-[0_24px_70px_rgba(0,0,0,0.65)] backdrop-blur"
          style={{ left: pos.left, top: pos.top }}
          aria-hidden="true"
        >
          <div className="relative aspect-video overflow-hidden bg-ink-900">
            {isVideo(item.media) && item.media?.src ? (
              <video
                src={item.media.src}
                poster={item.media.poster}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-contain"
              />
            ) : item.media?.src ? (
              <img src={item.media.src} alt={item.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center font-mono text-[11px] uppercase tracking-wideish text-muted">
                preview pending
              </div>
            )}
            {item.badge && (
              <span className="absolute left-3 top-3 bg-ink-950/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wideish text-greenBright">
                {item.badge}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-3 p-3.5">
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold text-paper">{item.title}</p>
              {item.subtitle && (
                <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-wideish text-muted">
                  {item.subtitle}
                </p>
              )}
            </div>
            <span className="shrink-0 font-display text-xl text-green">→</span>
          </div>
        </div>
      )}
    </Ctx.Provider>
  )
}
