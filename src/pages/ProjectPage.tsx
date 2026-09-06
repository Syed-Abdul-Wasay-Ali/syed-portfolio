import { useState, useEffect } from 'react'
import { getProject, projects } from '../data/projects'
import SpecStrip from '../components/SpecStrip'
import MediaPanel from '../components/MediaPanel'
import Lightbox from '../components/Lightbox'
import NodeGraph from '../components/NodeGraph'
import Reveal from '../components/Reveal'
import MediaGallery from '../components/MediaGallery'

function Section({
  tag,
  title,
  delay = 0,
  children,
}: {
  tag: string
  title: string
  delay?: number
  children: React.ReactNode
}) {
  return (
    <Reveal as="section" delay={delay} className="border-t border-ink-600 py-12 first:border-t-0">
      <p className="eyebrow">{tag}</p>
      <h2 className="mt-2 font-display text-2xl font-black uppercase tracking-tight text-paper">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </Reveal>
  )
}

export default function ProjectPage({ slug }: { slug: string }) {
  const project = getProject(slug)
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!project) {
    return (
      <div className="container-site py-32 text-center">
        <p className="eyebrow-green">404 — node not found</p>
        <h1 className="mt-3 font-display text-3xl font-black uppercase">Project missing</h1>
        <a href="#/" className="btn-ghost mt-6">
          ← back to work
        </a>
      </div>
    )
  }

  const allMedia = [...project.workflow, ...project.results]
  const hero: (typeof allMedia)[number] | undefined =
    project.results.find((m) => m.kind === 'video') ?? allMedia[0]

  const nextProject = projects[(projects.findIndex((p) => p.slug === slug) + 1) % projects.length]

  return (
    <main className="pt-14">
      {/* Project header */}
      <div className="container-site pb-10 pt-10">
        <a href="#/" className="font-mono text-[11px] uppercase tracking-wideish text-muted hover:text-green">
          ← all work
        </a>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span
            className={`border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wideish ${
              project.company === 'Ogilvy'
                ? 'co-ogilvy border-[#ff3b4e]'
                : 'co-cleandirty border-[#a78bfa]'
            }`}
          >
            {project.company}
          </span>
          <span className="font-mono text-[11px] text-muted">
            {project.role} · {project.year}
            {project.status ? ` · ${project.status}` : ''}
          </span>
        </div>
        <h1 className="mt-4 max-w-4xl font-display text-3xl font-black uppercase leading-tight tracking-tight sm:text-5xl">
          {project.title}
        </h1>
        <div className="panel mt-6 p-4">
          <SpecStrip spec={project.spec} className="flex flex-wrap gap-x-6 gap-y-1" />
        </div>
      </div>

      {/* Hero media */}
      <div className="container-site">
        {hero ? (
          <MediaPanel item={hero} className="max-h-[70vh]" />
        ) : (
          <div className="node-grid flex aspect-video items-center justify-center">
            <NodeGraph />
          </div>
        )}
      </div>

      {/* Story */}
      <div className="container-site grid gap-10 pb-4 pt-12 lg:grid-cols-[1fr_340px]">
        <div>
          <Section tag="01 — overview" title="What shipped">
            <p className="max-w-3xl leading-relaxed text-paper/90">{project.overview}</p>
          </Section>

          <Section tag="02 — the obstacle" title="The problem">
            <p className="max-w-3xl leading-relaxed text-paper/90">{project.challenge}</p>
          </Section>

          <Section tag="03 — the approach" title="How I got past it">
            <ol className="max-w-3xl space-y-4">
              {project.approach.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="mt-0.5 font-mono text-xs text-green">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="leading-relaxed text-paper/90">{step}</p>
                </li>
              ))}
            </ol>
          </Section>

          <Section tag="04 — stack" title="Tools & models">
            <div className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span key={s} className="border border-ink-600 px-3 py-1.5 font-mono text-[11px] text-paper/85">
                  {s}
                </span>
              ))}
            </div>
          </Section>

          <Section tag="05 — receipts" title="The workflow">
            <p className="mb-5 max-w-3xl text-sm text-muted">
              Actual ComfyUI graphs from the project. Click any frame to inspect.
            </p>
            <MediaGallery items={project.workflow} onOpen={(i) => setLightbox(i)} cols="sm:grid-cols-2" />
          </Section>

          <Section tag="06 — results" title="What came out">
            <MediaGallery
              items={project.results}
              onOpen={(i) => setLightbox(project.workflow.length + i)}
            />
          </Section>
        </div>

        <aside className="space-y-6 lg:pt-2">
          <div className="panel p-5">
            <p className="eyebrow">project spec</p>
            <dl className="mt-4 space-y-2.5">
              {project.spec.map((s) => (
                <div key={s.label} className="flex justify-between gap-4 border-b border-ink-700 pb-2 last:border-0">
                  <dt className="font-mono text-[11px] text-slateAccent">{s.label}</dt>
                  <dd className="font-mono text-[11px] text-right text-paper">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="panel p-5">
            <p className="eyebrow">role</p>
            <p className="mt-2 text-sm text-paper/90">{project.role}</p>
            <p className="mt-1 font-mono text-[11px] text-muted">
              <span className={project.company === 'Ogilvy' ? 'co-ogilvy' : 'co-cleandirty'}>
                {project.company}
              </span>{' '}
              · {project.year}
            </p>
          </div>

          <a
            href={`#/project/${nextProject.slug}`}
            className="panel-dark card-lift group block p-5 hover:border-greenBright"
          >
            <p className="font-mono text-[11px] uppercase tracking-wideish text-snow/60">
              next case study
            </p>
            <p className="mt-2 font-display text-lg font-bold text-snow">
              {nextProject.title}{' '}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </p>
            <p className="mt-1 font-mono text-[11px] text-snow/60">
              {nextProject.company} · {nextProject.year}
            </p>
          </a>
        </aside>
      </div>

      {lightbox !== null && (
        <Lightbox
          items={allMedia}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onNav={(i) => setLightbox(i)}
        />
      )}
    </main>
  )
}
