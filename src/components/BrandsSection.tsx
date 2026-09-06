import { BRANDS } from '../data/brands'
import BrandTile from './BrandTile'
import Reveal from './Reveal'

export default function BrandsSection() {
  return (
    <section id="brands" className="scroll-mt-16 py-14 sm:py-20">
      <div className="container-site">
        <div className="max-w-3xl">
          <p className="eyebrow-green">01 — brands</p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
            18 brands I&apos;ve worked within Ogilvy
          </h2>
          <p className="mt-4 text-muted">
            Click a brand to see the stills, animatics and final films behind the work —
            {BRANDS.length} brands and counting.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BRANDS.map((b, i) => (
            <Reveal key={b.slug} delay={(i % 4) * 70}>
              <a
                href={`#/brand/${b.slug}`}
                className="brand-tile card-lift panel group relative z-[1] block overflow-hidden hover:border-green"
                style={{ ['--brand' as never]: b.accent }}
              >
                <div className="border-b border-ink-600">
                  <BrandTile logo={b.logo} name={b.name} className="aspect-[4/3] w-full" />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base font-bold text-paper transition-colors group-hover:text-neonBlue">
                    {b.name}
                  </h3>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wideish text-muted">
                    {b.note}
                  </p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
