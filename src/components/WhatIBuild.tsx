import Reveal from './Reveal'

// The five-second pitch band: what a recruiter or client should understand
// the profile to be. Sits right under the logo ticker, above the work.
const ITEMS = [
  {
    num: '01',
    title: 'Product Accuracy',
    desc: 'Products stay identical frame to frame — commercial fidelity, not one-off luck.',
  },
  {
    num: '02',
    title: 'Product → Environment',
    desc: 'Studio product, generated environment, composited final — scale, perspective and light matched.',
  },
  {
    num: '03',
    title: 'Repeatable Workflows',
    desc: 'ComfyUI pipelines, reference workflows and trained LoRAs — a production route, not trial-and-error prompting.',
  },
  {
    num: '04',
    title: 'Advertising & E-commerce',
    desc: 'Hero, lifestyle, macro and e-commerce frames — the whole campaign surface from one system.',
  },
]

export default function WhatIBuild() {
  return (
    <section className="border-b border-ink-600 py-8 sm:py-11">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="eyebrow-green">what i build</p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
            Systems, not one-off renders
          </h2>
          <p className="mt-3 text-muted">
            I build production-ready AI image systems for commercial product and lifestyle
            advertising — product accuracy, compositing, and repeatable workflows.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((it, i) => (
            <Reveal key={it.num} delay={i * 90} className="h-full">
              <div className="panel h-full p-4">
                <p className="font-mono text-[11px] uppercase tracking-wideish text-green">
                  {it.num}
                </p>
                <h3 className="mt-2 font-display text-base font-bold text-paper">{it.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{it.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
