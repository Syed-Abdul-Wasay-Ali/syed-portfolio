// Vision Pro-style 3D interaction.
// [data-tilt] elements float toward the pointer with springy, damped easing
// (not instant snapping): rotation + slight translation + Z pop on hover,
// with inner [data-depth]/[data-depth-layer] layers parallaxing at different
// depths. Powered by a single rAF loop that lerps every tracked element
// toward its pointer-derived target. Honours prefers-reduced-motion.

const K = 0.11 // spring ease per frame (~visionOS slow-float feel)

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface Target {
  rx: number
  ry: number
  tx: number
  ty: number
  tz: number
  px: number
  py: number
  sc: number
}

interface State {
  el: HTMLElement
  t: Target
  rx: number
  ry: number
  tx: number
  ty: number
  tz: number
  px: number
  py: number
  sc: number
}

const states = new Map<HTMLElement, State>()
let raf = 0

const lerp = (a: number, b: number) => a + (b - a) * K

function apply(s: State) {
  const st = s.el.style
  st.setProperty('--rx', s.rx.toFixed(2) + 'deg')
  st.setProperty('--ry', s.ry.toFixed(2) + 'deg')
  st.setProperty('--tx', s.tx.toFixed(2) + 'px')
  st.setProperty('--ty', s.ty.toFixed(2) + 'px')
  st.setProperty('--tz', s.tz.toFixed(2) + 'px')
  st.setProperty('--px', s.px.toFixed(2) + 'px')
  st.setProperty('--py', s.py.toFixed(2) + 'px')
  st.setProperty('--sc', s.sc.toFixed(3))
}

function loop() {
  raf = 0
  let active = false
  for (const s of states.values()) {
    s.rx = lerp(s.rx, s.t.rx)
    s.ry = lerp(s.ry, s.t.ry)
    s.tx = lerp(s.tx, s.t.tx)
    s.ty = lerp(s.ty, s.t.ty)
    s.tz = lerp(s.tz, s.t.tz)
    s.px = lerp(s.px, s.t.px)
    s.py = lerp(s.py, s.t.py)
    s.sc = lerp(s.sc, s.t.sc)
    apply(s)
    const settled =
      Math.abs(s.t.rx - s.rx) < 0.03 &&
      Math.abs(s.t.ry - s.ry) < 0.03 &&
      Math.abs(s.t.tx - s.tx) < 0.1 &&
      Math.abs(s.t.ty - s.ty) < 0.1 &&
      Math.abs(s.t.tz - s.tz) < 0.05 &&
      Math.abs(s.t.px - s.px) < 0.1 &&
      Math.abs(s.t.py - s.py) < 0.1 &&
      Math.abs(s.t.sc - s.sc) < 0.001
    if (!settled) active = true
  }
  if (active) raf = requestAnimationFrame(loop)
}

function ensure() {
  if (!raf) raf = requestAnimationFrame(loop)
}

function targetFor(el: HTMLElement, px: number, py: number): Target {
  const max = Number(el.dataset.tiltMax ?? 10)
  const hovered = el.matches(':hover')
  return {
    rx: (0.5 - py) * max * 2,
    ry: (px - 0.5) * max * 2,
    tx: (px - 0.5) * 10,
    ty: (py - 0.5) * 8,
    tz: hovered ? 70 : 0, // hovered card flies to the front
    px: (px - 0.5) * 16,
    py: (py - 0.5) * 12,
    sc: hovered ? 1.08 : 1, // and swells slightly
  }
}

const zero: Target = { rx: 0, ry: 0, tx: 0, ty: 0, tz: 0, px: 0, py: 0, sc: 1 }

export function initTilt(): () => void {
  if (reduced()) return () => {}

  const onMove = (e: PointerEvent) => {
    const el = (e.target as Element | null)?.closest?.('[data-tilt]') as HTMLElement | null
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.width === 0) return
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    let s = states.get(el)
    if (!s) {
      s = { el, t: targetFor(el, px, py), rx: 0, ry: 0, tx: 0, ty: 0, tz: 0, px: 0, py: 0, sc: 1 }
      states.set(el, s)
    }
    s.t = targetFor(el, px, py)
    ensure()
  }

  const onOut = (e: PointerEvent) => {
    const el = (e.target as Element | null)?.closest?.('[data-tilt]') as HTMLElement | null
    if (!el) return
    const related = e.relatedTarget as Node | null
    if (!related || !el.contains(related)) {
      const s = states.get(el)
      if (s) {
        s.t = zero
        ensure()
      }
    }
  }

  document.addEventListener('pointermove', onMove, { passive: true })
  document.addEventListener('pointerout', onOut, { passive: true })
  return () => {
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerout', onOut)
  }
}

// Lean the page back as you scroll — reads like tilting a phone.
export function initPageTilt(): () => void {
  if (reduced()) return () => {}
  let rafScroll = 0
  const onScroll = () => {
    if (rafScroll) return
    rafScroll = requestAnimationFrame(() => {
      rafScroll = 0
      const page = document.querySelector('.page-tilt') as HTMLElement | null
      if (!page) return
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const t = max > 0 ? doc.scrollTop / max : 0
      page.style.setProperty('--page-rx', `${(t * -1.6).toFixed(2)}deg`)
    })
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  return () => {
    window.removeEventListener('scroll', onScroll)
    if (rafScroll) cancelAnimationFrame(rafScroll)
  }
}
