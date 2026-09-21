import { useCallback, useEffect, useRef, useState } from 'react'
import NodeGraph from './NodeGraph'
import LinkedInIcon from './LinkedInIcon'
import { LINKEDIN_URL, EMAIL, RESUME_URL } from '../data/social'
import { useProjectsKept } from '../data/overrides'
import { useT } from '../data/runtime'

// hero disc playlist, all concept-ad videos, one by one, looping (square 780 encodes)
const HERO_VIDEOS = [
  'media/reel/hero-disc.mp4', // happydent white gum
  'media/reel/hero-disc-lipgloss.mp4', // lip gloss concept ad
  'media/reel/hero-disc-7up.mp4', // 7up concept ad
  'media/reel/hero-disc-bedroom.mp4', // bedroom, blender via mcp vs seedance 2.5
  'media/reel/hero-disc-neon.mp4', // neon chase, blender clay vs seedance 2.5
]

export default function Hero() {
  const titleRef = useRef<HTMLDivElement | null>(null)
  const t = useT()
  const kept = useProjectsKept()

  // hero disc playlist, every concept-ad video glides through the circle, one after another, then loops
  const [disc, setDisc] = useState(0)
  const discVideos = useRef<(HTMLVideoElement | null)[]>([])
  const nextDisc = useCallback(() => {
    setDisc((i) => (i + 1) % HERO_VIDEOS.length)
  }, [])

  // exactly one disc video active: play the current, pause the rest (swaps cross-fade via CSS)
  useEffect(() => {
    discVideos.current.forEach((v, i) => {
      if (!v) return
      if (i === disc) {
        try {
          if (v.ended) v.currentTime = 0
        } catch {
          /* not seekable yet, play() restarts ended media anyway */
        }
        void v.play().catch(() => {})
      } else {
        v.pause()
      }
    })
  }, [disc])

  // iOS low-power mode / autoplay policies can leave the muted disc paused,
  // retry once on the first user gesture (no UI, silent).
  useEffect(() => {
    const retry = () => {
      const v = discVideos.current[disc]
      if (v && v.paused) void v.play().catch(() => {})
    }
    window.addEventListener('pointerdown', retry, { once: true, passive: true })
    window.addEventListener('touchstart', retry, { once: true, passive: true })
    return () => {
      window.removeEventListener('pointerdown', retry)
      window.removeEventListener('touchstart', retry)
    }
  }, [disc])

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
  const resumeUrl = t('social.resume', RESUME_URL)
  const linkedinUrl = t('social.linkedin', LINKEDIN_URL)
  const email = t('social.email', EMAIL)

  const stats: [string, string][] = [
    [t('hero.stat1.v'), t('hero.stat1.l')],
    [t('hero.stat2.v'), t('hero.stat2.l')],
    [t('hero.stat3.v'), t('hero.stat3.l')],
    [
      t('hero.stat4.v') || String(kept.filter((p) => p.company !== 'Concept').length),
      t('hero.stat4.l'),
    ],
    [t('hero.stat5.v') || String(kept.length), t('hero.stat5.l')],
    [t('hero.stat6.v'), t('hero.stat6.l')],
  ]

  return (
    <section className="relative overflow-hidden border-b border-ink-600 pb-8 pt-20 sm:pb-10 sm:pt-28">
      {/* ambient orbs */}
      <div aria-hidden="true" className="orb left-[-12%] top-[-25%] h-80 w-80 bg-green/10" />
      <div
        aria-hidden="true"
        className="orb right-[-8%] top-[35%] h-96 w-96 bg-green/[0.07]"
        style={{ animationDelay: '2.6s' }}
      />
      {/* soft light sweep */}
      <div aria-hidden="true" className="scanline" />

      {/* HUD corner brackets */}
      <div aria-hidden="true" className="corner corner-bl" />
      <div aria-hidden="true" className="corner corner-br" />

      <div className="container-site relative grid items-end gap-8 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <p className="k-fade flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.24em] text-greenReadable">
            <span className="disc inline-block h-1.5 w-1.5" />
            {t('hero.eyebrow')}
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
            <h1 className="font-display uppercase leading-[0.9] tracking-tight text-paper text-[clamp(2.7rem,8.5vw,7rem)]">
              <span className="k-wipe">{t('hero.first')}</span>
              <span className="k-wipe" style={{ animationDelay: '160ms' }}>
                {t('hero.last')}
              </span>
            </h1>
          </div>

          <p
            className="k-fade mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-greenReadable"
            style={{ animationDelay: '320ms' }}
          >
            {t('hero.keywords')}
          </p>

          <p
            className="k-fade mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
            style={{ animationDelay: '380ms' }}
          >
            {t('hero.introLead')}{' '}
            <span className="co-ogilvy">Ogilvy</span> {t('hero.introMid')}{' '}
            <span className="co-cleandirty">cleanDirty.ai</span>
            {t('hero.introTail')}
          </p>

          {/* log line, the site's signature flourish */}
          <p
            className="k-fade mt-5 font-mono text-xs text-muted"
            style={{ animationDelay: '480ms' }}
            aria-hidden="true"
          >
            <span className="text-greenReadable">&gt;</span> {t('hero.log')}
            <span className="ml-1 inline-block h-3.5 w-2 animate-blink bg-green align-middle" />
          </p>

          {/* CTA row */}
          <div
            className="k-fade mt-6 flex flex-wrap items-center gap-4"
            style={{ animationDelay: '560ms' }}
          >
            <a href="#work" className="btn-green">
              {t('hero.ctaWork')}
            </a>
            <a href={resumeUrl} target="_blank" rel="noreferrer" className="btn-ghost">
              {t('hero.ctaResume')}
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
              aria-label="View LinkedIn profile"
            >
              <LinkedInIcon className="h-4 w-4" />
              {t('hero.ctaLinkedin')}
            </a>
            <a href={`mailto:${email}`} className="btn-ghost">
              {t('hero.ctaEmail')}
            </a>
          </div>

          <div
            className="k-fade mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-ink-600 pt-5"
            style={{ animationDelay: '640ms' }}
          >
            {stats.map(([v, l]) => (
              <div key={l}>
                <div className="font-display text-2xl text-paper">{v}</div>
                <div className="font-mono text-[11px] uppercase tracking-wideish text-muted">
                  {l}
                </div>
              </div>
            ))}
          </div>

          {/* HUD micro row */}
          <div
            className="k-fade mt-8 flex items-center justify-between border-t border-ink-600 pt-4 font-mono text-[11px] uppercase tracking-wideish text-muted"
            style={{ animationDelay: '720ms' }}
          >
            <span>
              {t('hero.hudLeft')} / {year}
            </span>
            <span className="flex items-center gap-2">
              {t('hero.hudScroll')}
              <span className="text-greenReadable">↓</span>
            </span>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="panel k-fade p-4" style={{ animationDelay: '520ms' }}>
            <div className="limbo-float">
              <NodeGraph className="w-full" />
            </div>
          </div>
          <p className="mt-3 text-right font-mono text-[11px] uppercase tracking-wideish text-muted">
            {t('hero.fig')}
          </p>
        </div>
      </div>
      {/* circular video + dashed construction ring, the title-card motif */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative mx-auto mt-10 aspect-square w-[min(78vw,340px)] lg:absolute lg:right-[3%] lg:top-[12%] lg:mx-0 lg:mt-0 lg:w-[clamp(340px,34vw,500px)]"
      >
        <div className="spin-slow absolute inset-0 rounded-full border border-dashed border-paper/20" />
        <div
          className="k-scale absolute inset-[5%] overflow-hidden rounded-full bg-ink-600"
          style={{ animationDelay: '250ms' }}
        >
          {HERO_VIDEOS.map((src, i) => (
            <video
              key={src}
              ref={(el) => {
                discVideos.current[i] = el
              }}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out motion-reduce:hidden ${
                i === disc ? 'opacity-100' : 'opacity-0'
              }`}
              src={src}
              poster={i === 0 ? 'media/reel/hero-disc-poster.jpg' : undefined}
              autoPlay={i === 0}
              muted
              playsInline
              preload={i === disc || i === (disc + 1) % HERO_VIDEOS.length ? 'auto' : 'metadata'}
              onEnded={nextDisc}
              onError={i === disc ? nextDisc : undefined}
            />
          ))}
          <div className="disc absolute inset-0 hidden motion-reduce:block" />
        </div>
      </div>

    </section>
  )
}
