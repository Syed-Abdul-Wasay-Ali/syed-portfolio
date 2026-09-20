import Reveal from './Reveal'
import { useRuntime, useT } from '../data/runtime'

// "From product to production-ready image" — the compact pipeline band that
// sits directly under the hero. Six stages, each with a small visual from a
// real production run; the chain line keeps the order readable when the tiles
// wrap on small screens.
const STAGES = [
  { num: '01', label: 'Product', src: 'media/image-system/pipeline/product.jpg', note: 'real product, isolated' },
  { num: '02', label: 'Reference', src: 'media/image-system/pipeline/reference.jpg', note: 'brief + reference pack' },
  { num: '03', label: 'AI Generation', src: 'media/image-system/pipeline/generation.jpg', note: 'environment generated' },
  { num: '04', label: 'Compositing', src: 'media/image-system/pipeline/compositing.jpg', note: 'product placed, scale matched' },
  { num: '05', label: 'Lighting', src: 'media/image-system/pipeline/lighting.jpg', note: 'light direction + contact shadow' },
  { num: '06', label: 'Final Asset', src: 'media/image-system/pipeline/final.jpg', note: 'ad-ready, format-cropped' },
]

export default function PipelineStrip() {
  const t = useT()
  const { content } = useRuntime()
  const removed = new Set(content?.removedMedia ?? [])
  const stages = STAGES.map((s, i) => ({ s, i })).filter(({ s }) => !removed.has(s.src))
  // every stage deleted → the strip disappears instead of rendering empty
  if (stages.length === 0) return null
  return (
    <section className="border-b border-ink-600 py-7 sm:py-9">
      <div className="container-site">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <div>
            <p className="eyebrow-green">{t('pipeline.tag')}</p>
            <h2 className="mt-2 font-display text-2xl font-black uppercase tracking-tight sm:text-3xl">
              {t('pipeline.title')}
            </h2>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-wideish text-muted">
            {t('pipeline.aside')}
          </p>
        </div>

        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-greenReadable">
          {t('pipeline.chain')}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stages.map(({ s, i }) => (
            <Reveal key={s.num} delay={i * 60} className="h-full">
              <figure className="panel group h-full overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={s.src}
                    alt={`${s.label} stage — ${s.note}`}
                    loading="lazy"
                    className="media-asset absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-2 top-2 bg-charcoal/85 px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wideish text-green">
                    {s.num}
                  </span>
                </div>
                <figcaption className="border-t border-ink-600 p-2.5">
                  <p className="font-mono text-[11px] uppercase tracking-wideish text-paper">
                    {t(`pipeline.${i + 1}.label`, s.label)}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted">
                    {t(`pipeline.${i + 1}.note`, s.note)}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
