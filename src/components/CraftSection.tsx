import Reveal from './Reveal'
import { useT } from '../data/runtime'

// "Where AI meets image craft", the six controls that turn a generation into
// a deliverable. One line each, no essay.
const PRINCIPLES = [
  { term: 'Product Fidelity', line: 'Keeping the physical characteristics of the source product intact through generation and compositing.' },
  { term: 'Lighting', line: 'Matching key light direction, softness, intensity and color temperature to the world around the product.' },
  { term: 'Perspective', line: 'Aligning camera height, angle and scale so the product sits in the room instead of on top of it.' },
  { term: 'Materials', line: 'Reading fabric, wood, stone and glass as physical materials, texture, sheen and micro-detail intact.' },
  { term: 'Composition', line: 'Framing every asset for where it will live: hero, feed, banner, product page, mobile.' },
  { term: 'Consistency', line: 'Holding one product, one look and one grade across an entire set, not just one hero frame.' },
]

export default function CraftSection() {
  const t = useT()
  return (
    <section className="border-b border-ink-600 py-9 sm:py-12">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="eyebrow-green">{t('craft.tag')}</p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
            {t('craft.title')}
          </h2>
          <p className="mt-3 text-muted">{t('craft.sub')}</p>
        </div>

        <div className="mt-6 grid gap-x-10 gap-y-0 sm:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.term} delay={(i % 2) * 80}>
              <div className="flex gap-4 border-b border-ink-600 py-3.5">
                <p className="w-36 shrink-0 font-mono text-[11px] uppercase tracking-wideish text-greenReadable">
                  {t(`craft.p${i + 1}.term`, p.term)}
                </p>
                <p className="text-[13px] leading-relaxed text-muted">
                  {t(`craft.p${i + 1}.line`, p.line)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
