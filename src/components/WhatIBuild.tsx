import Reveal from './Reveal'

// The five-second pitch band: what a recruiter or client should understand
// the profile to be. Sits right under the logo ticker, above the work.
const ITEMS = [
  {
    num: '01',
    title: 'AI Creative Systems',
    desc: 'Production-ready generative workflows for image and video.',
  },
  {
    num: '02',
    title: 'ComfyUI Pipelines',
    desc: 'Modular workflows for consistency, control and scale.',
  },
  {
    num: '03',
    title: 'AI Automation',
    desc: 'Systems that remove repetitive creative production tasks.',
  },
  {
    num: '04',
    title: 'AI Films & Campaigns',
    desc: 'Concept → generation → iteration → final production.',
  },
]

export default function WhatIBuild() {
  return (
    <section className="border-b border-ink-600 py-12 sm:py-16">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="eyebrow-green">what i build</p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
            Systems, not one-off renders
          </h2>
          <p className="mt-4 text-muted">
            I build production-ready generative AI workflows, visual systems and automation
            pipelines for creative teams and brands.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((it, i) => (
            <Reveal key={it.num} delay={i * 90} className="h-full">
              <div className="panel h-full p-5">
                <p className="font-mono text-[11px] uppercase tracking-wideish text-green">
                  {it.num}
                </p>
                <h3 className="mt-3 font-display text-lg font-bold text-paper">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{it.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
