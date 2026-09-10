import { useState, useEffect } from 'react'
import { getBrand, displayBrands, type Brand } from '../data/brands'
import { getProject, type Project, type MediaItem } from '../data/projects'
import { useRuntime, type SectionName } from '../data/runtime'
import MediaGallery from '../components/MediaGallery'
import Lightbox from '../components/Lightbox'
import BrandTile from '../components/BrandTile'
import Reveal from '../components/Reveal'
import NodeGraph from '../components/NodeGraph'

function hexToRgba(hex: string, a: number) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

// linear mix: t = fraction of `other` (0..1)
function mix(hex: string, other: string, t: number) {
  const p = (h: string) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ]
  const [r1, g1, b1] = p(hex)
  const [r2, g2, b2] = p(other)
  const m = (a: number, b: number) => Math.round(a + (b - a) * t)
  return `rgb(${m(r1, r2)}, ${m(g1, g2)}, ${m(b1, b2)})`
}

// FULL brand skin: page background, text, header, footer, lightbox — everything
// is derived from the brand's accent color so the page reads AS the brand.
function BrandSkin({ brand }: { brand: Brand }) {
  const c = brand.accent
  const bg = mix(c, '#0A0A0A', 0.3) // brand-drenched page background
  const panel = mix(c, '#101010', 0.42) // card / placeholder surface
  const head = mix(c, '#FFFFFF', 0.38) // bright brand heading
  const text = mix(c, '#F2EFE8', 0.86) // near-white, brand-tinted
  const muted = mix(c, '#96918A', 0.5) // secondary text
  const line = hexToRgba(c, 0.35)
  const soft = hexToRgba(c, 0.16)
  const faint = hexToRgba(c, 0.08)

  const css = `
  /* ---- page chrome flips to brand ---- */
  body.brand-mode {
    background: ${bg};
    color: ${text};
    transition: background-color 0.5s ease, color 0.5s ease;
  }
  body.brand-mode .site-header {
    background: ${mix(c, '#070707', 0.78)};
    border-color: ${line};
  }
  body.brand-mode .site-header .header-strip { background: ${c}; }
  body.brand-mode .site-header .header-progress { background: ${c}; }
  body.brand-mode .site-header .text-paper { color: ${text}; }
  body.brand-mode .site-header .text-greenBright { color: ${c}; }
  body.brand-mode .site-header nav a[href^="#"]:hover { color: ${c}; }
  body.brand-mode .site-header .btn-ghost { border-color: ${hexToRgba(c, 0.4)}; color: ${text}; }
  body.brand-mode .site-header .btn-ghost:hover { border-color: ${c}; color: ${c}; }
  body.brand-mode .site-footer {
    background: ${panel};
    border-color: ${line};
  }
  body.brand-mode .site-footer .text-snow,
  body.brand-mode .site-footer .text-snow\\/60,
  body.brand-mode .site-footer .text-snow\\/40 { color: ${text}; }
  body.brand-mode .site-footer a { color: ${muted}; }
  body.brand-mode .site-footer a:hover { color: ${c}; }

  /* ---- in-page: every token re-tinted ---- */
  .brand-page h1, .brand-page h2 { color: ${head} !important; }
  .brand-page .text-paper, .brand-page .text-snow, .brand-page .text-snow\\/90 { color: ${text}; }
  .brand-page .text-muted, .brand-page .text-snow\\/60, .brand-page .text-snow\\/40 { color: ${muted}; }
  .brand-page .border-ink-600, .brand-page .border-ink-500 { border-color: ${line}; }
  .brand-page .bg-mist, .brand-page .bg-ink-950 { background-color: ${panel}; }
  .brand-page .text-green { color: ${c}; }
  .brand-page .border-green { border-color: ${c}; }
  .brand-page svg path[fill="#1F3A93"], svg path[fill="#94A8EE"] { fill: ${c}; }
  .brand-page .gallery-label { color: ${muted}; }
  .brand-page .group:hover .gallery-label { color: ${c}; }
  .brand-page .hover\\:border-greenBright:hover { border-color: ${c}; }
  .brand-page .hover\\:text-greenBright:hover { color: ${c}; }
  .brand-page .bg-ink-950\\/97 { background: ${mix(c, '#070707', 0.85)}; }

  /* ---- brand fixtures ---- */
  .brand-page .brand-wash {
    background:
      radial-gradient(60% 45% at 30% 0%, ${soft}, transparent 70%),
      linear-gradient(180deg, ${faint}, transparent 55%);
  }
  .brand-page .brand-overline { color: ${c}; }
  .brand-page .brand-chip { border-color: ${c}; color: ${c}; background: ${hexToRgba(c, 0.1)}; }
  .brand-page .brand-reel {
    border-color: ${line};
    background:
      radial-gradient(80% 90% at 50% 10%, ${soft}, transparent 75%),
      ${mix(c, '#101010', 0.32)};
    box-shadow: 0 0 0 1px ${faint}, 0 18px 60px rgba(0, 0, 0, 0.5);
  }
  .brand-page .brand-link {
    border-color: ${line};
    background: linear-gradient(160deg, ${soft}, transparent 60%);
  }
  .brand-page .brand-link:hover { border-color: ${c}; box-shadow: 0 0 26px ${soft}; }
  .brand-page .brand-link-arrow { color: ${c}; transition: transform 0.3s ease; }
  .brand-page .brand-link:hover .brand-link-arrow { transform: translateX(6px); }
  .brand-page .brand-back:hover { color: ${head}; }
  `
  return <style>{css}</style>
}

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
    <Reveal as="section" delay={delay} className="brand-hairline border-t py-12 first:border-t-0">
      <p className="eyebrow brand-overline">{tag}</p>
      <h2 className="mt-2 font-display text-2xl font-black uppercase tracking-tight">{title}</h2>
      <div className="mt-5">{children}</div>
    </Reveal>
  )
}

const isVideoMedia = (m: MediaItem) =>
  m.kind === 'video' || /\.(mp4|webm|mov|mkv)$/i.test(m.src ?? '')

// A project case study pinned onto the brand page: cover, workflow chips and
// a strip of the actual outputs (stills / films). Click -> full case study.
function BrandProjectCard({
  project,
  index,
  story,
}: {
  project: Project
  index: number
  story?: string
}) {
  const results = project.results.slice(0, 5)
  return (
    <div className="brand-link card-lift group relative block overflow-hidden rounded-md border p-5">
      <a
        href={`#/project/${project.slug}`}
        aria-label={`open case study: ${project.title}`}
        className="absolute inset-0 z-10"
      />
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-sm bg-ink-950 sm:w-60">
          {project.cover ? (
            <img
              src={project.cover}
              alt={project.title}
              loading="lazy"
              className="media-asset h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="node-grid flex h-full items-center justify-center p-6">
              <NodeGraph className="max-w-[8rem] opacity-80" animated={false} />
            </div>
          )}
          {project.status && (
            <span className="absolute left-2 top-2 bg-ink-950/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wideish text-greenBright">
              {project.status}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="brand-overline font-mono text-[11px] uppercase tracking-wideish">
            project {String(index + 1).padStart(2, '0')}
          </p>
          <h3 className="mt-1.5 font-display text-xl font-bold leading-snug text-snow group-hover:text-greenBright">
            {project.title}
          </h3>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wideish text-muted">
            {project.role} · {project.year}
          </p>
          {story && (
            <p className="mt-4 max-w-3xl border-l-2 border-green/50 pl-4 text-[13px] font-bold leading-relaxed text-[#94A8EE]">
              {story}
            </p>
          )}
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{project.excerpt}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.workflow.map((w) => (
              <span
                key={w.label}
                className="brand-chip border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wideish"
              >
                {w.label}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            {results.map((m, j) =>
              isVideoMedia(m) ? (
                <a
                  key={j}
                  href={m.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={m.label ?? 'watch the full video'}
                  className="relative z-20 block h-12 w-[4.5rem] shrink-0 overflow-hidden rounded-sm border border-ink-600 bg-ink-950 transition-transform duration-300 hover:scale-[1.06]"
                >
                  {m.poster && (
                    <img
                      src={m.poster}
                      alt={m.label ?? ''}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-ink-950/30 text-xs text-snow">
                    ▶
                  </span>
                </a>
              ) : (
                <img
                  key={j}
                  src={m.src}
                  alt={m.label ?? ''}
                  loading="lazy"
                  className="h-12 w-[4.5rem] shrink-0 rounded-sm object-cover"
                />
              )
            )}
            <span className="font-mono text-[10px] uppercase tracking-wideish text-muted">
              {project.results.length} {project.results.length === 1 ? 'output' : 'outputs'}
            </span>
            <span className="brand-link-arrow ml-auto font-display text-xl">→</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BrandPage({ slug }: { slug: string }) {
  const brand = getBrand(slug)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const { content } = useRuntime()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  // full brand mode: body-level skin while a brand page is mounted
  useEffect(() => {
    document.body.classList.add('brand-mode')
    return () => document.body.classList.remove('brand-mode')
  }, [slug])

  if (!brand) {
    return (
      <div className="container-site py-32 text-center">
        <p className="eyebrow-green">404 / brand not found</p>
        <h1 className="mt-3 font-display text-3xl font-black uppercase">Brand missing</h1>
        <a href="#/" className="btn-ghost mt-6">
          ← back home
        </a>
      </div>
    )
  }

  // runtime layer: admin uploads, removed items, hidden sections
  const hidden = (s: SectionName) => (content?.hiddenSections?.[brand.slug] ?? []).includes(s)
  const eff = (items: MediaItem[], s: SectionName): MediaItem[] => {
    const removed = new Set(content?.removedItems?.[brand.slug]?.[s] ?? [])
    const keep = items.filter((m) => !removed.has(m.src ?? m.label ?? ''))
    return [...(content?.uploads?.[brand.slug]?.[s] ?? []), ...keep]
  }
  const stillsItems = eff(brand.images, 'stills')
  const animaticsItems = eff(brand.animatics, 'animatics')
  const filmsItems = eff(brand.films, 'films')
  const all = [...stillsItems, ...animaticsItems, ...filmsItems]
  const imagesEnd = stillsItems.length
  const animaticsEnd = imagesEnd + animaticsItems.length
  const next = displayBrands[(displayBrands.findIndex((b) => b.slug === slug) + 1) % displayBrands.length]

  // case studies pinned to this brand (newest FIRST: last added shows on top,
  // older projects go down). NUMBERING is by addition order: the slug list
  // order is the project's fixed number (project 1, 2, ...) and never changes
  // when the display order flips.
  const rawBrandProjects = (brand.projects ?? [])
    .map((s) => getProject(s))
    .filter((p): p is Project => Boolean(p))
  const brandProjects = [...rawBrandProjects].reverse()
  const projectNumber = (slug: string) => brand.projects!.indexOf(slug) + 1
  const hasProjects = brandProjects.length > 0

  // the brand story belongs to ONE project only (the FIRST entry in the
  // slug list — the original one, e.g. Cadbury Silk's story) — not every
  // card on the page. New slugs are appended, so never take [length-1].
  const storyOwner = brand.projects?.[0]

  // section numbers are sequential per rendered section (story = 00)
  const pad = (n: number) => String(n).padStart(2, '0')
  let sec = 0
  const take = () => pad(++sec)

  return (
    <main className="brand-page pt-14">
      <BrandSkin brand={brand} />

      {/* Brand header — washed in the brand color */}
      <div className="brand-wash border-b border-ink-600 pb-8 pt-10">
        <div className="container-site">
          <a
            href="#brands"
            className="brand-back font-mono text-[11px] uppercase tracking-wideish text-muted transition-colors"
          >
            ← all brands
          </a>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <div className="brand-reel compact">
              <BrandTile
                logo={brand.logo}
                name={brand.name}
                className="h-24 w-32 shrink-0 rounded-sm"
              />
            </div>
            <div>
              <span className="brand-chip border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wideish">
                {brand.name}
              </span>
              <h1 className="mt-3 font-display text-3xl font-black uppercase leading-tight tracking-tight sm:text-5xl">
                {brand.name}
              </h1>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-wideish text-muted">
                {brand.note} · click any frame to inspect
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Galleries */}
      <div className="container-site pb-4 pt-8">
        {hasProjects && !hidden('projects') && (
          <Section tag={`${take()} / projects`} title="Projects on this brand" delay={0}>
            <div className="space-y-5">
              {brandProjects.map((p) => (
                <BrandProjectCard
                  key={p.slug}
                  project={p}
                  index={projectNumber(p.slug) - 1}
                  story={p.slug === storyOwner ? brand.story : undefined}
                />
              ))}
            </div>
            <p className="mt-5 max-w-3xl text-sm text-muted">
              Every project opens its full case study: the process, the
              models and the frames that shipped. Click any project above, or
              use the outputs strip to jump straight in.
            </p>
          </Section>
        )}

        {!hidden('stills') && stillsItems.length > 0 && (
          <Section tag={`${take()} / stills`} title="Campaign images" delay={60}>
            <MediaGallery
              items={stillsItems}
              onOpen={(i) => setLightbox(i)}
              cols="sm:grid-cols-3"
            />
          </Section>
        )}

        {!hidden('animatics') && animaticsItems.length > 0 && (
          <Section tag={`${take()} / animatics`} title="Animatics" delay={60}>
            <MediaGallery
              items={animaticsItems}
              onOpen={(i) => setLightbox(imagesEnd + i)}
            />
          </Section>
        )}

        {!hidden('films') && filmsItems.length > 0 && (
          <Section tag={`${take()} / final film`} title="Final films" delay={120}>
            <MediaGallery
              items={filmsItems}
              onOpen={(i) => setLightbox(animaticsEnd + i)}
            />
          </Section>
        )}

        <Reveal delay={120} className="pb-8 pt-2">
          <a
            href={`#/brand/${next.slug}`}
            className="brand-link card-lift group flex items-center justify-between rounded-md p-5"
          >
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wideish text-snow/60">
                next brand
              </p>
              <p className="mt-2 font-display text-lg font-bold text-snow">{next.name}</p>
            </div>
            <span className="brand-link-arrow font-display text-2xl">→</span>
          </a>
        </Reveal>
      </div>

      {lightbox !== null && (
        <Lightbox
          items={all}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onNav={(i) => setLightbox(i)}
        />
      )}
    </main>
  )
}
