import Reveal from './Reveal'

const CAPABILITIES: {
  tag: string
  title: string
  desc: string
  items: string[]
}[] = [
  {
    tag: 'img',
    title: 'Image systems',
    desc: 'Consistent visual output at campaign scale — not one-off generations.',
    items: [
      'ComfyUI graph design for production workflows',
      'Custom subject / character LoRAs (Ideogram 4, Flux)',
      'Krea 2 · Flux Klein · Z-Image Turbo — mixed in one graph, per-model strength tuning',
      'Dataset curation, JSON captions, trigger discipline',
      'Batch generation with locked seeds — A/B sweeps',
      'Upscale + composite chains (Topaz, latent pass)',
    ],
  },
  {
    tag: 'vid',
    title: 'Video pipelines',
    desc: 'Film-length clips from open-source models, tuned per shot — plus a closed-source tier when the brief demands it.',
    items: [
      'MiniMax H3 — ref2v / i2v ad films',
      'Seedance 2.5 — closed-source tier for briefs the open stack can\u2019t touch',
      'Sampler + scheduler tuning for motion vs sharpness',
      'Shot-to-shot continuity: extend, keyframe pass, LoRA-locked identity',
      '20s+ spots, batch queued, review-ready stills',
      'Video → mocap → rig pipelines (Rokoko → Blender)',
    ],
  },
  {
    tag: 'auto',
    title: 'Automation & integration',
    desc: 'The part clients never see: the pipeline runs itself.',
    items: [
      'Agent / API-driven ComfyUI control (MCP)',
      'Headless render queues with progress visibility',
      'Batch seed sweeps and parameter journals',
      'Asset cataloging — outputs land where the team expects them',
      'Working with devs to ship generation into products',
    ],
  },
]

export default function Capabilities() {
  return (
    <section id="capabilities" className="scroll-mt-16 border-y border-ink-950/10 bg-mist py-14 sm:py-20">
      <div className="container-site">
        <p className="eyebrow-green">03 / capabilities</p>
        <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
          What I actually do
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          The short version: brief goes in, finished frames and films come out — with the
          workflow documented, versioned, and reusable.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {CAPABILITIES.map((c, i) => (
            <Reveal key={c.tag} delay={i * 110} className="h-full">
              <div className="panel h-full p-6">
                <p className="font-mono text-[11px] uppercase tracking-wideish text-green">
                  [{c.tag}]
                </p>
                <h3 className="mt-3 font-display text-xl font-bold text-paper">{c.title}</h3>
                <p className="mt-2 text-sm text-muted">{c.desc}</p>
                <ul className="mt-5 space-y-2.5 border-t border-ink-600 pt-5">
                  {c.items.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-paper/90">
                      <span className="shrink-0 text-green">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Model stack */}
        <Reveal delay={140} className="mt-10">
          <div className="panel p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-mono text-[11px] uppercase tracking-wideish text-green">[models]</p>
              <p className="font-mono text-[10px] uppercase tracking-wideish text-muted">
                open-source first · closed-source when the brief demands it
              </p>
            </div>
            <div className="mt-5 grid gap-8 sm:grid-cols-2">
              <div>
                <p className="eyebrow">image generation</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    'Krea 2',
                    'Flux · Klein',
                    'Z-Image Turbo',
                    'Ideogram 4',
                    'Midjourney — aesthetic styles',
                    'SDXL / Illustrious family',
                    'Seedream 5 Pro (closed)',
                    'Nano Banana Pro (closed)',
                    'GPT-2 (closed)',
                  ].map((m) => (
                    <span
                      key={m}
                      className="border border-ink-600 px-3 py-1 font-mono text-[11px] text-paper/85"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="eyebrow">video generation</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    'MiniMax H3 (open)',
                    'LTX / Wan (open)',
                    'Seedance 2.5 (closed)',
                    'ref2v / i2v routes',
                    'LoRA-locked identity',
                  ].map((m) => (
                    <span
                      key={m}
                      className="border border-ink-600 px-3 py-1 font-mono text-[11px] text-paper/85"
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
