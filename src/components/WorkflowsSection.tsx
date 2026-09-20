import { useState } from 'react'
import { useWorkflowsOV } from '../data/overrides'
import { useT, useTL } from '../data/runtime'
import type { MediaItem } from '../data/projects'
import MediaPanel from './MediaPanel'
import Lightbox from './Lightbox'
import Reveal from './Reveal'

// The production route, stage by stage — then the stack that runs it, grouped
// by what each layer enables. Screen recordings of real runs sit underneath.
const PIPELINE = [
  'reference images',
  'image preparation',
  'comfyui',
  'model / lora',
  'control / guidance',
  'ai generation',
  'image editing',
  'compositing',
  'final asset',
]

const STACK = [
  {
    label: 'generation',
    enables: 'photoreal bases and range — open-source first, closed-source when the brief demands it.',
    items: ['Midjourney', 'Stable Diffusion (SDXL / Illustrious)', 'FLUX · Klein', 'Freepik AI', 'Leonardo AI', 'Krea 2'],
  },
  {
    label: 'workflow',
    enables: 'the controls: consistency, product lock and repeatability across a whole set.',
    items: ['ComfyUI', 'Automatic1111', 'ControlNet', 'LoRA training', 'Reference-based generation'],
  },
  {
    label: 'video',
    enables: 'motion when the brief needs it — stills that become spots.',
    items: ['Runway', 'Kling', 'Dream Machine', 'LTX / Wan', 'MiniMax H3 · Seedance 2.5'],
  },
  {
    label: 'creative & editing',
    enables: 'where a generation becomes a commercial deliverable.',
    items: ['AI image editing', 'Compositing', 'Prompt engineering', 'Retouch + grade'],
  },
]

export default function WorkflowsSection() {
  const items = useWorkflowsOV()
  const t = useT()
  const tl = useTL()
  const [lightbox, setLightbox] = useState<number | null>(null)

  // Renders nothing until there is real media — no empty grids.
  if (items.length === 0) return null

  const active = lightbox !== null ? items[lightbox] : null
  const activeOutput = active?.output

  return (
    <section id="workflows" className="scroll-mt-16 py-10 sm:py-12">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="eyebrow-green">{t('wf.tag')}</p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
            {t('wf.title')}
          </h2>
          <p className="mt-3 text-muted">{t('wf.sub')}</p>
        </div>

        {/* pipeline chain */}
        <Reveal delay={80} className="mt-6">
          <div className="panel p-4 sm:p-5">
            <p className="eyebrow">{t('wf.routeLabel')}</p>
            <div className="mt-3.5 flex flex-wrap items-center gap-y-2">
              {tl('wf.route', PIPELINE).map((step, i, arr) => (
                <span key={step + i} className="flex items-center">
                  <span className="border border-ink-600 bg-ink-900 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wideish text-paper/90">
                    {step}
                  </span>
                  {i < arr.length - 1 && (
                    <span aria-hidden="true" className="px-1.5 font-mono text-[11px] text-greenReadable">
                      →
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* functional stack */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STACK.map((g, i) => (
            <Reveal key={g.label} delay={i * 80} className="h-full">
              <div className="panel h-full p-4">
                <p className="eyebrow">{t(`wf.g${i + 1}.label`, g.label)}</p>
                <p className="mt-2 text-[12px] leading-snug text-muted">
                  {t(`wf.g${i + 1}.enables`, g.enables)}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-ink-600 pt-3">
                  {tl(`wf.g${i + 1}.items`, g.items).map((chip) => (
                    <span
                      key={chip}
                      className="border border-ink-600 px-2 py-0.5 font-mono text-[11px] text-paper/85"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* real runs */}
        <div className="mt-9 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-ink-600 pb-2.5">
          <h3 className="font-display text-lg font-black uppercase tracking-tight sm:text-xl">
            {t('wf.runs.title')}
          </h3>
          <span className="font-mono text-[11px] uppercase tracking-wideish text-muted">
            {t('wf.runs.sub')}
          </span>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={(i % 4) * 70}>
              <button
                onClick={() => setLightbox(i)}
                className="tilt-3d panel disc-hover group block w-full text-left hover:border-greenBright"
                data-tilt
                data-tilt-max="8"
              >
                <div className="relative border-b border-ink-600">
                  <MediaPanel item={item} className="aspect-[16/10] !object-cover" />
                  <span className="absolute left-3 top-3 bg-charcoal/90 px-2 py-1 font-mono text-[11px] uppercase tracking-wideish text-green">
                    {item.kind === 'video'
                      ? item.output
                        ? t('wf.badge.runOutput')
                        : t('wf.badge.run')
                      : t('wf.badge.still')}
                  </span>
                  {item.output && (
                    <span
                      title={item.output.label ?? 'output'}
                      className="absolute bottom-3 right-3 block h-14 w-14 overflow-hidden border border-snow/40 bg-charcoal shadow-lg sm:h-16 sm:w-16"
                    >
                      <img src={item.output.src} alt="" className="h-full w-full object-cover" />
                      <span className="absolute inset-x-0 bottom-0 bg-charcoal/85 text-center font-mono text-[10px] uppercase tracking-wideish text-green">
                        output
                      </span>
                    </span>
                  )}
                </div>
                <div className="p-3.5">
                  <h3 className="font-display text-base text-paper transition-colors group-hover:text-greenReadable">
                    {item.title}
                  </h3>
                  {item.note && (
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">{item.note}</p>
                  )}
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <Lightbox
          items={items as MediaItem[]}
          index={lightbox}
          extra={
            activeOutput
              ? {
                  kind: 'image',
                  src: activeOutput.src,
                  label: activeOutput.label ?? `${active?.title ?? 'workflow'} · output`,
                }
              : null
          }
          onClose={() => setLightbox(null)}
          onNav={(i) => setLightbox(i)}
        />
      )}
    </section>
  )
}
