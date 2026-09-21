import Reveal from './Reveal'
import { useT, useTL } from '../data/runtime'

// The AI systems section: each card is a pipeline that solves a production
// problem, not a capability list. Written for technical recruiters.
const SYSTEMS: {
  num: string
  title: string
  solves: string
  items: string[]
}[] = [
  {
    num: '01',
    title: 'Character Consistency Pipeline',
    solves: 'the same face, wardrobe and look carried across every scene, pose and lighting setup.',
    items: [
      'ComfyUI graphs with reference conditioning for identity',
      'Subject / character LoRA training (dataset curation, JSON captions, trigger discipline)',
      'Krea 2 · Flux Klein · Z-Image Turbo mixed in one graph, per-model strength tuning',
      'Batch generation with locked seeds and A/B sweeps',
      'Upscale + composite chains (Topaz, latent pass)',
    ],
  },
  {
    num: '02',
    title: 'Product Consistency Pipeline',
    solves: 'product shape, label and branding held exact across every generated environment.',
    items: [
      'Reference conditioning so the physical product stays exact',
      'Campaign-scale still production: key visuals + lifestyle environments',
      'Packaging, label and branding locked across outputs',
      'Compositing and retouch passes for delivery',
    ],
  },
  {
    num: '03',
    title: 'AI Video Pipeline',
    solves: 'still concepts turned into finished motion, shot by shot.',
    items: [
      'MiniMax H3: ref2v / i2v ad films',
      'Seedance 2.5 closed-source tier when a brief demands it',
      'Wan Animate motion transfer from real capture',
      'Sampler + scheduler tuning for motion vs sharpness',
      'Shot-to-shot continuity: extend, keyframe pass, LoRA-locked identity',
      '20s+ spots, batch queued, review-ready stills',
      'Video → mocap → rig pipelines (Rokoko → Blender)',
    ],
  },
  {
    num: '04',
    title: 'Automated Generation Pipeline',
    solves: 'dozens of variants generated, queued and cataloged without babysitting every run.',
    items: [
      'Agent / API-driven ComfyUI control (MCP)',
      'Headless render queues with progress visibility',
      'Batch seed sweeps and parameter journals',
      'Asset cataloging so outputs land where the team expects them',
      'Working with devs to ship generation into products',
    ],
  },
]

export default function Capabilities() {
  const t = useT()
  const tl = useTL()
  return (
    <section id="capabilities" className="scroll-mt-16 border-y border-ink-950/10 bg-mist py-10 sm:py-12">
      <div className="container-site">
        <p className="eyebrow-green">{t('cap.tag')}</p>
        <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
          {t('cap.title')}
        </h2>
        <p className="mt-3 max-w-2xl text-muted">{t('cap.sub')}</p>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          {SYSTEMS.map((c, i) => (
            <Reveal key={c.num} delay={i * 110} className="h-full">
              <div className="panel h-full p-5">
                <p className="font-mono text-[11px] uppercase tracking-wideish text-greenReadable">
                  {c.num} / system
                </p>
                <h3 className="mt-2 font-display text-lg font-bold text-paper">
                  {t(`cap.${i + 1}.title`, c.title)}
                </h3>
                <p className="mt-2 text-sm text-muted">
                  <span className="text-paper/90">solves: </span>
                  {t(`cap.${i + 1}.solves`, c.solves)}
                </p>
                <ul className="mt-4 space-y-2 border-t border-ink-600 pt-4">
                  {tl(`cap.${i + 1}.items`, c.items).map((item) => (
                    <li key={item} className="flex gap-2 text-[13px] leading-snug text-paper/90">
                      <span className="shrink-0 text-greenReadable">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Model stack */}
        <Reveal delay={140} className="mt-7">
          <div className="panel p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-mono text-[11px] uppercase tracking-wideish text-greenReadable">{t('cap.m.tag')}</p>
              <p className="font-mono text-[11px] uppercase tracking-wideish text-muted">
                {t('cap.m.note')}
              </p>
            </div>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="eyebrow">{t('cap.m.img')}</p>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-wideish text-greenReadable">
                  {t('cap.m.most')}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tl('cap.m.mostList', [
                    'GPT Image 2.5 (closed)',
                    'Nano Banana Pro (closed)',
                    'Seedream 5 Pro (closed)',
                  ]).map((m) => (
                    <span
                      key={m}
                      className="border border-green bg-green px-2.5 py-0.5 font-mono text-[11px] text-snow"
                    >
                      {m}
                    </span>
                  ))}
                </div>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-wideish text-muted">
                  {t('cap.m.also')}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tl('cap.m.alsoList', [
                    'Krea 2',
                    'Flux · Klein',
                    'Z-Image Turbo',
                    'Ideogram 4',
                    'Midjourney, aesthetic styles',
                    'SDXL / Illustrious family',
                  ]).map((m) => (
                    <span
                      key={m}
                      className="border border-ink-600 px-2.5 py-0.5 font-mono text-[11px] text-paper/85"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="eyebrow">{t('cap.m.vid')}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tl('cap.m.vidList', [
                    'MiniMax H3 (open)',
                    'LTX / Wan (open)',
                    'Seedance 2.5 (closed)',
                    'ref2v / i2v routes',
                    'LoRA-locked identity',
                  ]).map((m) => (
                    <span
                      key={m}
                      className="border border-ink-600 px-2.5 py-0.5 font-mono text-[11px] text-paper/85"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
