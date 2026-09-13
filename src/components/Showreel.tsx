import { useEffect, useRef } from 'react'

// Sound-off showreel cut (2026): concept films + selected client work.
// Plays only while in view so it does not burn cycles off-screen.
export default function Showreel() {
  const ref = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      void el.play().catch(() => {})
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <figure className="mt-10">
      <div className="panel overflow-hidden">
        <video
          ref={ref}
          className="aspect-video w-full bg-black"
          src="media/reel/showreel-2026.mp4"
          poster="media/reel/showreel-2026-poster.jpg"
          muted
          loop
          playsInline
          preload="metadata"
          onClick={() => {
            const el = ref.current
            if (!el) return
            if (el.paused) void el.play().catch(() => {})
            else el.pause()
          }}
          aria-label="Showreel 2026: concept films and selected client work, 26 seconds, sound off"
        />
      </div>
      <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-wideish text-muted">
        <span>showreel / 2026 · concept films + selected client work</span>
        <span>26s · sound off</span>
      </figcaption>
    </figure>
  )
}
