import { useEffect, useRef } from 'react'
import NodeGraph from './NodeGraph'
import LinkedInIcon from './LinkedInIcon'
import { LINKEDIN_URL, EMAIL, RESUME_URL } from '../data/social'
import { projectsByDate } from '../data/projects'

export default function Hero() {
  const titleRef = useRef<HTMLDivElement | null>(null)

  // scroll push-in: the name scales toward the camera as you scroll (title-card move)
  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const onScroll = () => {
      const p = Math.min(1, window.scrollY / 640)
      el.style.setProperty('--push', p.toFixed(3))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const year = new Date().getFullYear()

  return (
    <section className="relative overflow-hidden border-b border-ink-600 pb-10 pt-28 sm:pb-14 sm:pt-36">
      {/* ambient orbs */}
      <div aria-hidden="true" className="orb left-[-12%] top-[-25%] h-80 w-80 bg-green/10" />
      <div
        aria-hidden="true"
        className="orb right-[-8%] top-[35%] h-96 w-96 bg-paper/[0.04]"
        style={{ animationDelay: '2.6s' }}
      />
      {/* soft light sweep */}
      <div aria-hidden="true" className="scanline" />

      {/* red disc + dashed construction ring — the title-card motif */}
      <div
        aria-hidden="true"
        className="spin-slow pointer-events-none absolute right-[3%] top-[12%] hidden lg:block"
        style={{ width: 320, height: 320 }}
      >
        <div className="absolute inset-0 rounded-full border border-dashed border-paper/20" />
        <div className="disc k-scale absolute inset-[24%]" style={{ animationDelay: '250ms' }} />
      </div>

      {/* HUD corner brackets */}
      <div aria-hidden="true" className="corner corner-bl" />
      <div aria-hidden="true" className="corner corner-br" />

      <div className="container-site relative grid items-end gap-10 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <p className="k-fade flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.24em] text-green">
            <span className="disc inline-block h-1.5 w-1.5" />
            AI Creative Technologist
          </p>

          <div
            ref={titleRef}
            className="mt-5"
            style={{
              transform: 'scale(calc(1 + var(--push, 0) * 0.42))',
              transformOrigin: '50% 62%',
              willChange: 'transform',
            }}
          >
            <h1 className="font-display uppercase leading-[0.9] tracking-tight text-paper text-[clamp(2.9rem,9.5vw,8rem)]">
              <span className="k-wipe">SYED ABDUL</span>
              <span className="k-wipe" style={{ animationDelay: '160ms' }}>
                WASAY ALI
              </span>
            </h1>
          </div>

          <p
            className="k-fade mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-greenBright"
            style={{ animationDelay: '320ms' }}
          >
            motion design · generative ai pipelines · comfyui · ai image &amp; video
          </p>

          <p
            className="k-fade mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
            style={{ animationDelay: '380ms' }}
          >
            I'm a motion designer who builds production-ready generative AI
            workflows, visual systems and automation pipelines for creative teams and brands. AI
            Creative Technologist at{' '}
            <span className="co-ogilvy">Ogilvy</span> · ex-AI Head Artist at{' '}
            <span className="co-cleandirty">cleanDirty.ai</span>. I design image and video
            generation pipelines in ComfyUI, train custom LoRAs for identity consistency, and
            automate the render queues so teams ship campaigns instead of babysitting them.
          </p>

          {/* log line — the site's signature flourish */}
          <p
            className="k-fade mt-8 font-mono text-xs text-muted"
            style={{ animationDelay: '480ms' }}
            aria-hidden="true"
          >
            <span className="text-green">&gt;</span> loading comfyui ... ok · 3 packs ·
            lora: locked · queue: ready
            <span className="ml-1 inline-block h-3.5 w-2 animate-blink bg-green align-middle" />
          </p>

          {/* CTA row */}
          <div
            className="k-fade mt-8 flex flex-wrap items-center gap-4"
            style={{ animationDelay: '560ms' }}
          >
            <a href="#work" className="btn-green">
              view work
            </a>
            <a href={RESUME_URL} target="_blank" rel="noreferrer" className="btn-ghost">
              resume
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
              aria-label="View LinkedIn profile"
            >
              <LinkedInIcon className="h-4 w-4" />
              connect on linkedin
            </a>
            <a href={`mailto:${EMAIL}`} className="btn-ghost">
              email me
            </a>
          </div>

          <div
            className="k-fade mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-ink-600 pt-6"
            style={{ animationDelay: '640ms' }}
          >
            {[
              ['2', 'companies shipped'],
              ['1y5m+', 'ai creative technologist · ogilvy'],
              ['1y5m+', 'ai head artist · cleandirty'],
              [
                String(projectsByDate.filter((p) => p.company !== 'Concept').length),
                'shipped brand campaigns',
              ],
              [String(projectsByDate.length), 'case studies below'],
              ['2y10m+', 'total ai experience'],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="font-display text-2xl text-paper">{v}</div>
                <div className="font-mono text-[10px] uppercase tracking-wideish text-muted">
                  {l}
                </div>
              </div>
            ))}
          </div>

          {/* HUD micro row */}
          <div
            className="k-fade mt-12 flex items-center justify-between border-t border-ink-600 pt-4 font-mono text-[10px] uppercase tracking-wideish text-muted"
            style={{ animationDelay: '720ms' }}
          >
            <span>Portfolio / {year}</span>
            <span className="flex items-center gap-2">
              Scroll for work
              <span className="text-green">↓</span>
            </span>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="panel k-fade p-4" style={{ animationDelay: '520ms' }}>
            <div className="limbo-float">
              <NodeGraph className="w-full" />
            </div>
          </div>
          <p className="mt-3 text-right font-mono text-[10px] uppercase tracking-wideish text-muted">
            fig. 01 · every project starts here
          </p>
        </div>
      </div>
    </section>
  )
}
