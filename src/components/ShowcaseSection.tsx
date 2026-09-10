import { useState } from 'react'
import { SHOWCASE, SHOWCASE_TAGS, type ShowcaseTag, type ShowcaseItem } from '../data/showcase'
import type { MediaItem } from '../data/projects'
import MediaPanel from './MediaPanel'
import Lightbox from './Lightbox'
import Reveal from './Reveal'

type Filter = 'all' | ShowcaseTag

export default function ShowcaseSection() {
  const [filter, setFilter] = useState<Filter>('all')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const shown: ShowcaseItem[] =
    filter === 'all' ? SHOWCASE : SHOWCASE.filter((s) => s.tag === filter)

  // Showcase renders nothing until there is real media — no empty grids.
  if (shown.length === 0) return null

  return (
    <section id="showcase" className="scroll-mt-16 py-14 sm:py-20">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="eyebrow-green">02 / showcase</p>
            <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
              Concept ads &amp; personal work
            </h2>
            <p className="mt-4 text-muted">
              Spec work, campaign concepts and experiments — AI-made, no client brief required.
              Click any piece to inspect.
            </p>
          </div>
          <div className="flex gap-1 border border-ink-600 p-1" role="tablist" aria-label="Filter showcase">
            {SHOWCASE_TAGS.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={filter === t.key}
                onClick={() => {
                  setFilter(t.key)
                  setLightbox(null)
                }}
                className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wideish transition-colors ${
                  filter === t.key ? 'bg-green text-ink-950' : 'text-muted hover:text-paper'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((item, i) => (
            <Reveal key={item.id} delay={(i % 4) * 70}>
              <button
                onClick={() => setLightbox(i)}
                className="tilt-3d panel disc-hover group block w-full text-left hover:border-green"
                data-tilt
                data-tilt-max="8"
              >
                <div className="relative border-b border-ink-600">
                  <MediaPanel item={item} className="aspect-[4/3] !object-cover" />
                  <span className="absolute left-3 top-3 bg-ink-950/90 px-2 py-1 font-mono text-[10px] uppercase tracking-wideish text-greenBright">
                    {item.tag === 'concept-ad' ? 'concept ad' : 'image'}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base text-paper transition-colors group-hover:text-green">
                    {item.title}
                  </h3>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <Lightbox
          items={shown as MediaItem[]}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onNav={(i) => setLightbox(i)}
        />
      )}
    </section>
  )
}
