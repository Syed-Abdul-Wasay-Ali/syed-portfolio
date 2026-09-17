import Reveal from './Reveal'
import { useT } from '../data/runtime'

// The five-second pitch band: what an AI-image client should understand
// the profile to be. Sits right under the logo ticker, above the work.
const ITEMS = [
  {
    num: '01',
    title: 'Product Fidelity',
    desc: 'Maintaining recognizable product shape, proportions, materials and details.',
  },
  {
    num: '02',
    title: 'Photorealistic Environments',
    desc: 'Creating believable commercial environments around existing products.',
  },
  {
    num: '03',
    title: 'Lighting Matching',
    desc: 'Matching key light direction, softness, intensity and color temperature.',
  },
  {
    num: '04',
    title: 'Perspective Matching',
    desc: 'Aligning camera angle, scale and product placement with the environment.',
  },
  {
    num: '05',
    title: 'Controlled AI Generation',
    desc: 'Using references, prompting and workflow controls to produce consistent results.',
  },
  {
    num: '06',
    title: 'Production Variations',
    desc: 'Creating multiple useful assets from one visual system and adapting them across formats.',
  },
]

export default function WhatIBuild() {
  const t = useT()
  return (
    <section className="border-b border-ink-600 py-8 sm:py-11">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="eyebrow-green">{t('whatibuild.tag')}</p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
            {t('whatibuild.title')}
          </h2>
          <p className="mt-3 text-muted">{t('whatibuild.sub')}</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((it, i) => (
            <Reveal key={it.num} delay={i * 70} className="h-full">
              <div className="panel h-full p-4">
                <p className="font-mono text-[11px] uppercase tracking-wideish text-green">
                  {it.num}
                </p>
                <h3 className="mt-2 font-display text-base font-bold text-paper">
                  {t(`whatibuild.${i + 1}.title`, it.title)}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                  {t(`whatibuild.${i + 1}.desc`, it.desc)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
