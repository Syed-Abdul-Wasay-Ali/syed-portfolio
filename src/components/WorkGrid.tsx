import { useState } from 'react'
import { projectsByDate, COMPANIES, type Company } from '../data/projects'
import ProjectCard from './ProjectCard'
import Reveal from './Reveal'

type Filter = 'All' | Company

export default function WorkGrid() {
  const [filter, setFilter] = useState<Filter>('All')
  const shown = filter === 'All' ? projectsByDate : projectsByDate.filter((p) => p.company === filter)

  return (
    <section id="work" className="scroll-mt-16 py-14 sm:py-20">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow-green">01 / selected work</p>
            <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
              Case studies
            </h2>
          </div>
          <div className="flex gap-1 border border-ink-600 p-1" role="tablist" aria-label="Filter projects by company">
            {(['All', ...COMPANIES] as Filter[]).map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wideish transition-colors ${
                  filter === f
                    ? 'bg-green text-ink-950'
                    : 'text-muted hover:text-paper'
                }`}
              >
                {f === 'All'
                  ? 'All'
                  : filter !== f
                    ? (
                        <span className={f === 'Ogilvy' ? 'co-ogilvy' : 'co-cleandirty'}>{f}</span>
                      )
                    : (
                        f
                      )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 90}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
