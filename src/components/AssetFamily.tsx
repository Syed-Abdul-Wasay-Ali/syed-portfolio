import Reveal from './Reveal'
import { useRuntime, useT } from '../data/runtime'

// "One product, multiple production-ready assets", one system, seven
// deliverables, shown at their real aspect ratios so the format thinking is
// visible at a glance. Links into the commercial-system case study.
const ASSETS = [
  { label: 'Studio hero', ratio: '16:9', src: 'media/image-system/assets/studio-hero.jpg', cls: 'aspect-[16/9] sm:col-span-3' },
  { label: 'Bedroom lifestyle', ratio: '16:9', src: 'media/image-system/assets/bedroom-lifestyle.jpg', cls: 'aspect-[16/9] sm:col-span-3' },
  { label: 'Wide room', ratio: '16:9', src: 'media/image-system/assets/wide-room.jpg', cls: 'aspect-[16/9] sm:col-span-3' },
  { label: 'Product page', ratio: '16:9', src: 'media/image-system/assets/product-page.jpg', cls: 'aspect-[16/9] sm:col-span-3' },
  { label: 'Close-up detail', ratio: '4:3', src: 'media/image-system/assets/detail.jpg', cls: 'aspect-[4/3] sm:col-span-2' },
  { label: 'Mobile', ratio: '4:5', src: 'media/image-system/assets/mobile.jpg', cls: 'aspect-[4/5] sm:col-span-2' },
  { label: 'Social ad', ratio: '9:16', src: 'media/image-system/assets/social.jpg', cls: 'aspect-[9/16] sm:col-span-2' },
]

export default function AssetFamily() {
  const t = useT()
  const { content } = useRuntime()
  const removed = new Set(content?.removedMedia ?? [])
  const ccsRemoved = new Set(content?.removedProjects ?? []).has('commercial-creative-system')
  const assets = ASSETS.map((a, i) => ({ a, i })).filter(({ a }) => !removed.has(a.src))
  // nothing left to show → the section disappears instead of rendering empty
  if (assets.length === 0) return null
  return (
    <section className="border-b border-ink-600 py-9 sm:py-12">
      <div className="container-site">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <div className="max-w-2xl">
            <p className="eyebrow-green">{t('assets.tag')}</p>
            <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
              {t('assets.title')}
            </h2>
          </div>
          {!ccsRemoved && (
            <a
              href="#/project/commercial-creative-system"
              className="font-mono text-[11px] uppercase tracking-wideish text-greenBright underline-offset-4 hover:underline"
            >
              {t('assets.link')}
            </a>
          )}
        </div>
        <p className="mt-3 max-w-2xl text-muted">{t('assets.sub')}</p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-6">
          {assets.map(({ a, i }) => (
            <Reveal key={a.label} delay={i * 60} className={`${a.cls} !h-auto`}>
              <figure className="group h-full">
                <div className={`relative w-full overflow-hidden rounded-sm border border-ink-600 ${a.cls.split(' ')[0]}`}>
                  <img
                    src={a.src}
                    alt={`${a.label}, ${a.ratio}`}
                    loading="lazy"
                    className="media-asset absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="mt-1.5 flex items-baseline justify-between gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-wideish text-paper">
                    {t(`assets.${i + 1}.label`, a.label)}
                  </span>
                  <span className="font-mono text-[11px] text-muted">{a.ratio}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
