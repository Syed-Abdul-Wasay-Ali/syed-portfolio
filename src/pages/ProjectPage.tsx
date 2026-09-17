import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useProjectOV, ovProject, projectsKept } from '../data/overrides'
import { useRuntime, useT } from '../data/runtime'
import SpecStrip from '../components/SpecStrip'
import MediaPanel from '../components/MediaPanel'
import Lightbox from '../components/Lightbox'
import NodeGraph from '../components/NodeGraph'
import Reveal from '../components/Reveal'
import MediaGallery from '../components/MediaGallery'
import StageStrip from '../components/StageStrip'
import BeforeAfter from '../components/BeforeAfter'
import FormatsSection from '../components/FormatsSection'
import EcomConcept from '../components/EcomConcept'

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
  const project = useProjectOV(slug)
  const { content } = useRuntime()
  const t = useT()
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!project) {
    return (
      <div className="container-site py-32 text-center">
        <p className="eyebrow-green">{t('pui.404.tag')}</p>
        <h1 className="mt-3 font-display text-3xl font-black uppercase">{t('pui.404.title')}</h1>
        <a href="#/" className="btn-ghost mt-6">
          {t('pui.404.back')}
        </a>
      </div>
    )
  }

  const allMedia = project.results
  const hero: (typeof allMedia)[number] | undefined = project.heroSrc
    ? { kind: 'image', src: project.heroSrc, label: `${project.title} — final frame` }
    : project.results.find((m) => m.kind === 'video') ?? allMedia[0]

  const kept = projectsKept(content)
  const nextRaw = kept.length ? kept[(kept.findIndex((p) => p.slug === slug) + 1) % kept.length] : project
  const nextProject = ovProject(content, nextRaw)

  // ---- story sections (orderable from the admin) --------------------------
  const order = content?.sectionOrder?.project
  const secs: [string, ReactNode][] = []

  if (project.production) {
    const rows: [string, string][] = [
      ['objective', project.production.objective],
      ['input', project.production.input],
      ['process', project.production.process],
      ['control', project.production.control],
      ['refinement', project.production.refinement],
      ['output', project.production.output],
    ]
    for (const [k, body] of rows) {
      if (!body) continue
      secs.push([
        k,
        <Section key={k} tag={t(`pui.row.${k}.tag`)} title={t(`pui.row.${k}.title`)}>
          <p className="max-w-[64ch] leading-relaxed text-paper/90">{body}</p>
        </Section>,
      ])
    }

    if (project.stages && project.stages.length > 0) {
      secs.push([
        'stages',
        <Section key="stages" tag={t('pui.stages.tag')} title={t('pui.stages.title')}>
          <StageStrip stages={project.stages} chain={project.chain} />
        </Section>,
      ])
    }

    if (project.beforeAfter) {
      secs.push([
        'beforeafter',
        <Section key="beforeafter" tag={t('pui.ba.tag')} title={t('pui.ba.title')}>
          <BeforeAfter
            before={project.beforeAfter.before}
            after={project.beforeAfter.after}
            annotations={project.beforeAfter.annotations}
          />
        </Section>,
      ])
    }

    if ((project.formats?.length ?? 0) > 0 || (project.placements?.length ?? 0) > 0) {
      secs.push([
        'formats',
        <Section key="formats" tag={t('pui.formats.tag')} title={t('pui.formats.title')}>
          <FormatsSection formats={project.formats ?? []} placements={project.placements} />
        </Section>,
      ])
    }

    if (project.ecom) {
      secs.push([
        'ecom',
        <Section key="ecom" tag={t('pui.ecom.tag')} title={t('pui.ecom.title')}>
          <EcomConcept />
        </Section>,
      ])
    }

    secs.push([
      'results',
      <Section key="results" tag={t('pui.results.tag')} title={t('pui.results.title')}>
        <MediaGallery items={project.results} onOpen={(i) => setLightbox(i)} />
      </Section>,
    ])

    secs.push([
      'stack',
      <Section key="stack" tag={t('pui.stack.tag')} title={t('pui.stack.title')}>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span key={s} className="border border-ink-600 px-3 py-1.5 font-mono text-[11px] text-paper/85">
              {s}
            </span>
          ))}
        </div>
      </Section>,
    ])

    if (project.contribution && project.contribution.length > 0) {
      secs.push([
        'contribution',
        <Section key="contribution" tag={t('pui.contrib.tag')} title={t('pui.contrib.title')}>
          <div className="flex max-w-3xl flex-wrap gap-2">
            {project.contribution.map((c) => (
              <span key={c} className="border border-ink-600 px-3 py-1.5 font-mono text-[11px] text-paper/85">
                {c}
              </span>
            ))}
          </div>
        </Section>,
      ])
    }
  } else {
    secs.push([
      'overview',
      <Section key="overview" tag={t('pui.ov.tag')} title={t('pui.ov.title')}>
        <p className="max-w-[64ch] leading-relaxed text-paper/90">{project.overview}</p>
      </Section>,
    ])

    if (project.contribution && project.contribution.length > 0) {
      secs.push([
        'contribution',
        <Section key="contribution" tag={t('pui.lc.tag')} title={t('pui.lc.title')}>
          <p className="mb-5 max-w-3xl text-sm text-muted">{t('pui.lc.note')}</p>
          <div className="flex max-w-3xl flex-wrap gap-2">
            {project.contribution.map((c) => (
              <span key={c} className="border border-ink-600 px-3 py-1.5 font-mono text-[11px] text-paper/85">
                {c}
              </span>
            ))}
          </div>
        </Section>,
      ])
    }

    secs.push([
      'challenge',
      <Section key="challenge" tag={t('pui.ch.tag')} title={t('pui.ch.title')}>
        <p className="max-w-[64ch] leading-relaxed text-paper/90">{project.challenge}</p>
      </Section>,
    ])

    secs.push([
      'approach',
      <Section key="approach" tag={t('pui.ap.tag')} title={t('pui.ap.title')}>
        <ol className="max-w-[64ch] space-y-4">
          {project.approach.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="mt-0.5 font-mono text-xs text-greenReadable">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="leading-relaxed text-paper/90">{step}</p>
            </li>
          ))}
        </ol>
      </Section>,
    ])

    secs.push([
      'stack',
      <Section key="stack" tag={t('pui.ls.tag')} title={t('pui.ls.title')}>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span key={s} className="border border-ink-600 px-3 py-1.5 font-mono text-[11px] text-paper/85">
              {s}
            </span>
          ))}
        </div>
      </Section>,
    ])

    secs.push([
      'workflow',
      <Section key="workflow" tag={t('pui.pr.tag')} title={t('pui.pr.title')}>
        <p className="mb-5 max-w-3xl text-sm text-muted">{t('pui.pr.note')}</p>
        <ol className="max-w-[64ch] space-y-3">
          {project.workflow.map((w, i) => (
            <li key={i} className="flex gap-4">
              <span className="mt-0.5 font-mono text-xs text-greenReadable">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="leading-relaxed text-paper/90">{w.label ?? 'step'}</p>
            </li>
          ))}
        </ol>
      </Section>,
    ])

    secs.push([
      'results',
      <Section key="results" tag={t('pui.lr.tag')} title={t('pui.lr.title')}>
        <MediaGallery items={project.results} onOpen={(i) => setLightbox(i)} />
      </Section>,
    ])
  }

  const shown = order
    ? [...secs]
        .filter(([k]) => order.includes(k))
        .sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
    : secs

  return (
    <main className="pt-14">
      {/* Project header */}
      <div className="container-site pb-10 pt-10">
        <a href="#/" className="font-mono text-[11px] uppercase tracking-wideish text-slateAccent hover:text-greenReadable">
          {t('pui.back')}
        </a>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span
            className={`border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wideish ${
              project.company === 'Ogilvy'
                ? 'co-ogilvy border-[#ff3b4e]'
                : 'co-cleandirty border-[#C9C2B6]'
            }`}
          >
            {project.company}
          </span>
          <span className="font-mono text-[11px] text-muted">
            {project.role} · {project.year}
            {project.status && project.status.toLowerCase() !== project.company.toLowerCase() ? ` · ${project.status}` : ''}
          </span>
        </div>
        <h1 className="mt-4 max-w-4xl font-display text-3xl font-black uppercase leading-tight tracking-tight sm:text-5xl">
          {project.title}
        </h1>
        {project.subtitle && (
          <p className="mt-3 font-mono text-[12px] uppercase tracking-wideish text-greenReadable">
            {project.subtitle}
          </p>
        )}
        <div className="panel mt-6 p-4">
          <SpecStrip spec={project.spec} className="flex flex-wrap gap-x-6 gap-y-1" />
        </div>
      </div>

      {/* Hero media */}
      <div className="container-site">
        {hero ? (
          <MediaPanel item={hero} className="max-h-[70vh]" />
        ) : (
          <div className="node-grid flex min-h-[280px] flex-col items-center justify-center gap-5 py-10">
            <p className="eyebrow">fig. — the production route</p>
            <NodeGraph />
          </div>
        )}
      </div>

      {/* Story */}
      <div className="container-site grid gap-10 pb-4 pt-12 lg:grid-cols-[1fr_340px]">
        <div>{shown.map(([, node]) => node)}</div>

        <aside className="space-y-6 lg:pt-2">
          <div className="panel p-5">
            <p className="eyebrow">{t('pui.spec')}</p>
            <dl className="mt-4 space-y-2.5">
              {project.spec.map((s) => (
                <div key={s.label} className="flex justify-between gap-4 border-b border-ink-700 pb-2 last:border-0">
                  <dt className="font-mono text-[11px] uppercase text-slateAccent">{s.label}</dt>
                  <dd className="font-mono text-[11px] text-right text-paper">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="panel p-5">
            <p className="eyebrow">{t('pui.role')}</p>
            <p className="mt-2 text-sm text-paper/90">{project.role}</p>
            <p className="mt-1 font-mono text-[11px] text-muted">
              <span className={project.company === 'Ogilvy' ? 'co-ogilvy' : 'co-cleandirty'}>
                {project.company}
              </span>{' '}
              · {project.year}
            </p>
          </div>

          {project.campaign && (
            <a
              href={project.campaign.url}
              target="_blank"
              rel="noreferrer"
              className="panel card-lift block p-5 hover:border-greenBright"
            >
              <p className="eyebrow">{t('pui.release')}</p>
              <p className="mt-2 text-sm font-bold text-paper/90">{project.campaign.label} ↗</p>
            </a>
          )}

          <a
            href={`#/project/${nextProject.slug}`}
            className="panel-dark card-lift group block p-5 hover:border-greenBright"
          >
            <p className="font-mono text-[11px] uppercase tracking-wideish text-snow/60">
              {t('pui.next')}
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
