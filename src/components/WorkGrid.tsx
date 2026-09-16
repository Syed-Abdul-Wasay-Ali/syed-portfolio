import { projectsByDate, type Project } from '../data/projects'
import type { ReactNode } from 'react'
import ProjectCard from './ProjectCard'
import FeaturedCard from './FeaturedCard'
import Reveal from './Reveal'
import Showreel from './Showreel'
import NodeGraph from './NodeGraph'

function Lane({
  title,
  blurb,
  projects,
  footer,
}: {
  title: string
  blurb: string
  projects: Project[]
  footer?: ReactNode
}) {
  // No empty lanes — a section with nothing to show should not render.
  if (projects.length === 0) return null

  // Featured case studies render as large image-forward cards; the rest stay
  // compact so the lanes remain scannable.
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  return (
    <section className="min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-ink-600 pb-2.5">
        <h3 className="font-display text-lg font-black uppercase tracking-tight sm:text-xl">
          {title}
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-wideish text-muted">
          {String(projects.length).padStart(2, '0')} projects
        </span>
      </div>
      <p className="mt-2.5 min-h-[2.75rem] text-[13px] leading-relaxed text-muted">{blurb}</p>
      {featured.length > 0 && (
        <div className="mt-2 grid gap-4">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 90}>
              <FeaturedCard project={p} num={String(i + 1).padStart(2, '0')} />
            </Reveal>
          ))}
        </div>
      )}
      <div className={featured.length > 0 ? 'mt-4 grid gap-3.5' : 'mt-4 grid gap-3.5'}>
        {rest.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 90}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
      {footer ? <div className="mt-3.5">{footer}</div> : null}
    </section>
  )
}

export default function WorkGrid() {
  const conceptLane = projectsByDate.filter((p) => p.company === 'Concept')
  const shippedLane = projectsByDate.filter((p) => p.company !== 'Concept')

  return (
    <section id="work" className="scroll-mt-16 py-10 sm:py-12">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="eyebrow-green">03 / case studies</p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
            Case studies
          </h2>
        </div>

        <Showreel />

        <div className="mt-7 grid gap-x-8 gap-y-10 lg:grid-cols-2">
          <Lane
            title="Concept case studies"
            blurb="Self-set briefs taken end-to-end — five production studies on the commercial imaging system, plus concept films — all on the same pipelines as client work."
            projects={conceptLane}
            footer={
              <div className="space-y-3.5">
                <div className="border border-dashed border-ink-600 p-4">
                <p className="font-mono text-[10px] uppercase tracking-wideish text-green">
                  concept lane
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                  Every file here started as a self-set brief and was taken to a final cut on the
                  same pipelines as client work. More experiments and stills live in the{' '}
                  <a href="#showcase" className="text-greenBright underline-offset-2 hover:underline">
                    showcase
                  </a>
                  .
                </p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-wideish text-muted">
                  tooling
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {['comfyui', 'seedance 2.5', 'blender + mcp', 'krea 2'].map((t) => (
                    <span
                      key={t}
                      className="border border-ink-600 px-2 py-0.5 font-mono text-[10px] text-paper/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                </div>
                <div className="panel p-4">
                  <NodeGraph className="mx-auto max-w-[240px] opacity-90" animated={false} />
                  <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-wideish text-muted">
                    fig. 02 · the same graphs as client work
                  </p>
                </div>
              </div>
            }
          />
          <Lane
            title="Shipped work"
            blurb="Client campaigns made at Ogilvy, shipped to real audiences."
            projects={shippedLane}
          />
        </div>
      </div>
    </section>
  )
}
