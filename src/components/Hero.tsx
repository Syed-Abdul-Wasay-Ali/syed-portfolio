import NodeGraph from './NodeGraph'
import LinkedInIcon from './LinkedInIcon'
import { LINKEDIN_URL, EMAIL } from '../data/social'

export default function Hero() {
  return (
    <section className="node-grid relative overflow-hidden border-b border-ink-600 pb-14 pt-28 sm:pb-20 sm:pt-36">
      {/* ambient orbs */}
      <div
        aria-hidden="true"
        className="orb left-[-10%] top-[-20%] h-72 w-72 bg-green/15"
        style={{ animationDelay: '0s' }}
      />
      <div
        aria-hidden="true"
        className="orb right-[-5%] top-[30%] h-80 w-80 bg-neonBlue/10"
        style={{ animationDelay: '2.2s' }}
      />
      {/* scanline sweep */}
      <div aria-hidden="true" className="scanline" />

      <div className="container-site relative grid items-end gap-10 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <p className="eyebrow-green mb-6 animate-fadeUp">
            syed abdul wasay ali — ai creative technologist
          </p>
          <h1
            className="animate-fadeUp font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-paper sm:text-6xl lg:text-7xl"
            style={{ animationDelay: '100ms' }}
          >
            <span className="glitch-line" data-text="I BUILD THE">I BUILD THE</span>
            <br />
            <span className="glitch-line" data-text="WORKFLOWS THAT">WORKFLOWS THAT</span>
            <br />
            <span className="glitch-line" data-text="MAKE THE WORK">MAKE THE WORK</span>
            <br />
            <span className="glitch-line text-grad" data-text="OUTSTANDING.">OUTSTANDING.</span>
          </h1>
          <p
            className="mt-6 max-w-xl animate-fadeUp text-base leading-relaxed text-muted sm:text-lg"
            style={{ animationDelay: '200ms' }}
          >
            AI Creative Technologist at <span className="co-ogilvy">Ogilvy</span> · ex-AI Head
            Artist at <span className="co-cleandirty">cleanDirty.ai</span>. I design image and video
            generation pipelines in ComfyUI, train custom LoRAs for identity consistency, and
            automate the render queues so teams ship campaigns instead of babysitting them.
          </p>

          {/* log line — the site's signature flourish */}
          <p
            className="mt-8 animate-fadeUp font-mono text-xs text-muted"
            style={{ animationDelay: '300ms' }}
            aria-hidden="true"
          >
            <span className="text-slateAccent">&gt;</span> loading comfyui … ok · 3 packs ·
            lora: locked · queue: ready
            <span className="ml-1 inline-block h-3.5 w-2 animate-blink bg-green align-middle" />
          </p>

          {/* CTA row */}
          <div
            className="mt-8 flex animate-fadeUp flex-wrap items-center gap-4"
            style={{ animationDelay: '350ms' }}
          >
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-green"
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
            className="mt-10 flex animate-fadeUp flex-wrap gap-x-8 gap-y-4 border-t border-ink-600 pt-6"
            style={{ animationDelay: '400ms' }}
          >
            {[
              ['2', 'companies shipped'],
              ['1y5m+', 'ai creative technologist · ogilvy'],
              ['1y5m+', 'ai head artist · cleandirty'],
              ['3', 'case studies below'],
              ['2y10m+', 'total ai experience'],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="font-display text-2xl font-bold text-paper">{v}</div>
                <div className="font-mono text-[10px] uppercase tracking-wideish text-muted">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="limbo-float limbo-halo" style={{ animationDelay: '-2.5s' }}>
            <NodeGraph className="w-full" />
          </div>
          <p className="mt-3 text-right font-mono text-[10px] uppercase tracking-wideish text-muted">
            fig. 01 — every project starts here
          </p>
        </div>
      </div>
    </section>
  )
}
