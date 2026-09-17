// Concept e-commerce page for the e-commerce image-system case study.
// Clearly labelled as a design study: the layout idea is the point — how the
// generated imagery behaves in a product page and on a phone. Imagery comes
// from the same pipeline as the rest of the study.
import { useRuntime, useT } from '../data/runtime'

const DESKTOP_HERO = 'media/ecommerce-image-system/desktop-hero.jpg'
const DESKTOP_LIFESTYLE = 'media/ecommerce-image-system/desktop-lifestyle.jpg'
const DESKTOP_DETAIL = 'media/ecommerce-image-system/desktop-detail.jpg'
const THUMB_1 = 'media/ecommerce-image-system/thumb-01.jpg'
const THUMB_2 = 'media/ecommerce-image-system/thumb-02.jpg'
const THUMB_3 = 'media/ecommerce-image-system/thumb-03.jpg'
const THUMB_4 = 'media/ecommerce-image-system/thumb-04.jpg'
const MOBILE_HERO = 'media/ecommerce-image-system/mobile-hero.jpg'

const NOTES = [
  { term: 'Focal point', line: 'One decision per frame: where the eye lands first is built into the composition, not left to the crop.' },
  { term: 'Product visibility', line: 'The mattress line stays fully readable at every size the page renders it.' },
  { term: 'Image hierarchy', line: 'Hero sets the world, lifestyle sells the life, detail proves the make.' },
  { term: 'Aspect ratio', line: 'Each slot gets its native ratio — 16:9 for the banner, 4:5 for mobile, 1:1 for thumbnails.' },
  { term: 'Mobile crop', line: 'The vertical frame is recomposed, not sliced from the desktop composition.' },
  { term: 'Thumbnail readability', line: 'At 64px the frame still says "mattress in a room" — that is what the crop is tuned for.' },
]

function Bar({ w }: { w: string }) {
  return <span className={`block h-1.5 rounded-full bg-ink-700 ${w}`} />
}

export default function EcomConcept() {
  const t = useT()
  const { content } = useRuntime()
  const removed = new Set(content?.removedMedia ?? [])
  const show = (src: string) => !removed.has(src)
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="bg-green px-2 py-1 font-mono text-[10px] uppercase tracking-wideish text-snow">
          {t('ecom.badge')}
        </span>
        <p className="font-mono text-[10px] uppercase tracking-wideish text-muted">
          {t('ecom.note')}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        {/* desktop product page */}
        <div>
          <div className="overflow-hidden rounded-md border border-ink-600 bg-ink-900">
            {/* browser bar */}
            <div className="flex items-center gap-1.5 border-b border-ink-600 px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-ink-500" />
              <span className="h-2 w-2 rounded-full bg-ink-500" />
              <span className="h-2 w-2 rounded-full bg-ink-500" />
              <span className="ml-3 h-2 w-40 rounded-full bg-ink-700" />
            </div>
            {/* store header */}
            <div className="flex items-center justify-between border-b border-ink-600 px-4 py-2.5">
              <span className="h-2.5 w-20 rounded-sm bg-paper/70" />
              <div className="hidden gap-3 sm:flex">
                <span className="h-1.5 w-10 rounded-full bg-ink-700" />
                <span className="h-1.5 w-10 rounded-full bg-ink-700" />
                <span className="h-1.5 w-10 rounded-full bg-ink-700" />
              </div>
              <span className="h-1.5 w-6 rounded-full bg-ink-700" />
            </div>
            {/* hero */}
            <div className="relative aspect-[16/9] overflow-hidden border-b border-ink-600">
              {show(DESKTOP_HERO) && (
                <img src={DESKTOP_HERO} alt="concept product page hero" loading="lazy" className="media-asset absolute inset-0 h-full w-full object-cover" />
              )}
              <div className="absolute left-[6%] top-1/2 hidden w-[30%] -translate-y-1/2 space-y-2 sm:block">
                <Bar w="w-4/5" />
                <Bar w="w-3/5" />
                <span className="mt-2 block h-5 w-24 rounded-sm bg-paper/80" />
              </div>
            </div>
            {/* product row: info + gallery */}
            <div className="grid gap-4 border-b border-ink-600 p-4 sm:grid-cols-[1fr_1.2fr]">
              <div className="space-y-2.5">
                <Bar w="w-2/3" />
                <Bar w="w-1/2" />
                <span className="block h-5 w-20 rounded-sm bg-ink-700" />
                <div className="flex gap-2 pt-1">
                  <span className="h-6 w-24 rounded-sm bg-paper/80" />
                  <span className="h-6 w-16 rounded-sm border border-ink-600" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[THUMB_1, THUMB_2, THUMB_3, THUMB_4].filter(show).map((th, i) => (
                  <span key={th} className={`relative block aspect-square overflow-hidden rounded-sm border ${i === 0 ? 'border-greenBright' : 'border-ink-600'}`}>
                    <img src={th} alt={`thumbnail ${i + 1}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  </span>
                ))}
              </div>
            </div>
            {/* lifestyle + detail band */}
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <span className="relative block aspect-[16/10] overflow-hidden rounded-sm border border-ink-600">
                {show(DESKTOP_LIFESTYLE) && (
                  <img src={DESKTOP_LIFESTYLE} alt="lifestyle section" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                )}
              </span>
              <span className="relative block aspect-[16/10] overflow-hidden rounded-sm border border-ink-600">
                {show(DESKTOP_DETAIL) && (
                  <img src={DESKTOP_DETAIL} alt="detail section" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                )}
              </span>
            </div>
          </div>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-wideish text-muted">
            {t('ecom.desktop')}
          </p>
        </div>

        {/* mobile product page */}
        <div className="mx-auto w-full max-w-[280px]">
          <div className="rounded-[20px] border border-ink-600 bg-ink-900 p-2">
            <div className="overflow-hidden rounded-[13px] border border-ink-700 bg-ink-950">
              <div className="flex items-center justify-between px-3 py-1.5">
                <span className="h-1.5 w-8 rounded-full bg-ink-700" />
                <span className="h-1.5 w-3 rounded-full bg-ink-700" />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden border-y border-ink-700">
                {show(MOBILE_HERO) && (
                  <img src={MOBILE_HERO} alt="concept mobile product image" loading="lazy" className="media-asset absolute inset-0 h-full w-full object-cover" />
                )}
              </div>
              <div className="space-y-2 p-3">
                <Bar w="w-3/4" />
                <Bar w="w-1/2" />
                <span className="block h-4 w-16 rounded-sm bg-ink-700" />
                <span className="block h-7 w-full rounded-sm bg-paper/80" />
                <div className="flex gap-1.5 pt-1">
                  {[THUMB_1, THUMB_2, THUMB_3].filter(show).map((th) => (
                    <span key={th} className="relative block h-9 w-9 overflow-hidden rounded-sm border border-ink-700">
                      <img src={th} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-wideish text-muted">
            {t('ecom.mobile')}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-x-8 gap-y-0 sm:grid-cols-2">
        {NOTES.map((n, i) => (
          <div key={n.term} className="flex gap-4 border-b border-ink-600 py-3">
            <p className="w-36 shrink-0 font-mono text-[10px] uppercase tracking-wideish text-green">
              {t(`ecom.n${i + 1}.term`, n.term)}
            </p>
            <p className="text-[13px] leading-relaxed text-muted">{t(`ecom.n${i + 1}.line`, n.line)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
