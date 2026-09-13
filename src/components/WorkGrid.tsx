import { projectsByDate, type Project } from '../data/projects'
import ProjectCard from './ProjectCard'
import Reveal from './Reveal'
import Showreel from './Showreel'

function Lane({
  title,
  blurb,
  projects,
}: {
  title: string
  blurb: string
  projects: Project[]
}) {
  // No empty lanes — a section with nothing to show should not render.
  if (projects.length === 0) return null

  return (
    <section className="min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-ink-600 pb-3">
        <h3 className="font-display text-xl font-black uppercase tracking-tight sm:text-2xl">
          {title}
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-wideish text-muted">
          {String(projects.length).padStart(2, '0')} projects
        </span>
      </div>
      <p className="mt-3 min-h-[2.9rem] text-sm leading-relaxed text-muted">{blurb}</p>
      <div className="mt-6 grid gap-6">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 90}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default function WorkGrid() {
  const conceptLane = projectsByDate.filter((p) => p.company === 'Concept')
  const shippedLane = projectsByDate.filter((p) => p.company !== 'Concept')

  return (
    <section id="work" className="scroll-mt-16 py-14 sm:py-20">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="eyebrow-green">01 / selected work</p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
            Case studies
          </h2>
        </div>

        <Showreel />

        <div className="mt-8 grid gap-x-8 gap-y-12 lg:grid-cols-2">
          <Lane
            title="Concept case studies"
            blurb="Self-set briefs taken from idea to final cut, using the same pipelines as client work."
            projects={conceptLane}
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
