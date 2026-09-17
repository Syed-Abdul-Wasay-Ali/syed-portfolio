import { useState } from 'react'
import { SHOWCASE_TAGS, type ShowcaseTag, type ShowcaseItem } from '../data/showcase'
import { useShowcaseOV } from '../data/overrides'
import { useT } from '../data/runtime'
import type { MediaItem } from '../data/projects'
import MediaPanel from './MediaPanel'
import Lightbox from './Lightbox'
import Reveal from './Reveal'

type Filter = 'all' | ShowcaseTag

export default function ShowcaseSection() {
  const items = useShowcaseOV()
  const t = useT()
  const [filter, setFilter] = useState<Filter>('all')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const shown: ShowcaseItem[] =
    filter === 'all' ? items : items.filter((s) => s.tag === filter)

  // Showcase renders nothing until there is real media — no empty grids.
  if (items.length === 0) return null

  const filterLabel = (key: 'all' | ShowcaseTag, fallback: string) => {
    if (key === 'all') return t('showcase.f.all', fallback)
    if (key === 'concept-ad') return t('showcase.f.concept', fallback)
    return t('showcase.f.image', fallback)
  }

  return (
    <section id="showcase" className="scroll-mt-16 py-10 sm:py-12">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="eyebrow-green">{t('showcase.tag')}</p>
            <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
              {t('showcase.title')}
            </h2>
            <p className="mt-3 text-muted">{t('showcase.sub')}</p>
          </div>
          <div className="flex gap-1 border border-ink-600 p-1" role="tablist" aria-label="Filter showcase">
            {SHOWCASE_TAGS.map((tag) => (
              <button
                key={tag.key}
                role="tab"
                aria-selected={filter === tag.key}
                onClick={() => {
                  setFilter(tag.key)
                  setLightbox(null)
                }}
                className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wideish transition-colors ${
                  filter === tag.key ? 'bg-green text-ink-950' : 'text-muted hover:text-paper'
                }`}
              >
                {filterLabel(tag.key, tag.label)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shown.length === 0 && (
            <p className="col-span-full text-sm text-muted">{t('showcase.empty')}</p>
          )}
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
                <div className="p-3.5">
                  <h3 className="font-display text-base text-paper transition-colors group-hover:text-green">
                    {item.title}
                  </h3>
                  {item.note && (
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">{item.note}</p>
                  )}
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
