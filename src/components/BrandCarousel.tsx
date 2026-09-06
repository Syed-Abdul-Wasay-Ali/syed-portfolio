import { useEffect, useRef, useState } from 'react'
import { BRANDS } from '../data/brands'
import BrandTile from './BrandTile'

// Phone-style 3D coverflow: swipe/drag horizontally, tiles tilt in 3D
// by distance from centre. Native scroll = momentum + snap on touch;
// pointer drag covers desktop mice; buttons jump one brand at a time.
export default function BrandCarousel() {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const activeRef = useRef(0)
  const [dragging, setDragging] = useState(false)

  const reduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let raf = 0
    const update = () => {
      raf = 0
      const rect = track.getBoundingClientRect()
      const center = rect.left + rect.width / 2
      let best = 0
      let bestDist = Infinity
      const items = track.querySelectorAll<HTMLElement>('.car-item')
      items.forEach((item, i) => {
        const r = item.getBoundingClientRect()
        const ic = r.left + r.width / 2
        const off = (ic - center) / Math.max(1, rect.width / 2)
        if (reduced()) {
          item.style.opacity = '1'
          item.style.zIndex = '5'
          item.style.setProperty('--ryc', '0deg')
          item.style.setProperty('--zc', '0px')
        } else {
          const rot = Math.max(-26, Math.min(26, off * -20))
          const z = -Math.min(120, Math.abs(off) * 90)
          item.style.setProperty('--ryc', `${rot.toFixed(2)}deg`)
          item.style.setProperty('--zc', `${z.toFixed(1)}px`)
          item.style.opacity = String(Math.max(0.35, 1 - Math.abs(off) * 0.5))
          item.style.zIndex = String(100 - Math.round(Math.abs(off) * 10))
        }
        const d = Math.abs(ic - center)
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      })
      activeRef.current = best
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    track.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      track.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const scrollToIndex = (i: number) => {
    const track = trackRef.current
    if (!track) return
    const idx = Math.max(0, Math.min(BRANDS.length - 1, i))
    const item = track.querySelectorAll<HTMLElement>('.car-item')[idx]
    if (item) {
      const tr = track.getBoundingClientRect()
      const ir = item.getBoundingClientRect()
      const left =
        track.scrollLeft + (ir.left - tr.left) - (track.clientWidth - item.clientWidth) / 2
      track.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
    }
  }

  // desktop mouse drag-to-scroll (touch gets native scroll)
  const drag = useRef<{ down: boolean; startX: number; startLeft: number } | null>(null)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') {
      drag.current = { down: true, startX: e.clientX, startLeft: trackRef.current?.scrollLeft ?? 0 }
      // flip the class synchronously so snap doesn't fight the first drag frames
      trackRef.current?.classList.add('dragging')
      setDragging(true)
    }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (drag.current?.down && trackRef.current) {
      trackRef.current.scrollLeft = drag.current.startLeft - (e.clientX - drag.current.startX)
    }
  }
  const endDrag = () => {
    if (!drag.current) return
    drag.current = null
    trackRef.current?.classList.remove('dragging')
    setDragging(false)
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className={`car-3d ${dragging ? 'dragging' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        role="region"
        aria-label="Brands carousel — swipe or drag to browse"
      >
        <div className="flex gap-5 px-[12vw] py-8">
          {BRANDS.map((b) => (
            <a
              key={b.slug}
              href={`#/brand/${b.slug}`}
              data-tilt
              data-tilt-max="6"
              className="car-item brand-tile panel group relative block w-60 overflow-hidden rounded-sm sm:w-64"
              style={{ ['--brand' as never]: b.accent }}
            >
              <span className="glare" aria-hidden="true" />
              <div className="tilt-depth border-b border-ink-600">
                <BrandTile logo={b.logo} name={b.name} className="aspect-[4/3] w-full" />
              </div>
              <div className="p-4">
                <h3 className="font-display text-base font-bold text-paper">{b.name}</h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wideish text-muted">
                  {b.note}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <button
          onClick={() => scrollToIndex(activeRef.current - 1)}
          className="btn-ghost !px-3 !py-1.5"
          aria-label="Previous brands"
        >
          ← prev
        </button>
        <p className="font-mono text-[10px] uppercase tracking-wideish text-muted">
          swipe · drag · hover a logo to float it · {BRANDS.length} brands
        </p>
        <button
          onClick={() => scrollToIndex(activeRef.current + 1)}
          className="btn-ghost !px-3 !py-1.5"
          aria-label="Next brands"
        >
          next →
        </button>
      </div>
    </div>
  )
}
