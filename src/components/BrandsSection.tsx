import { BRANDS, displayBrands } from '../data/brands'
import BrandTile from './BrandTile'
import Reveal from './Reveal'
import { useHoverPreview } from './HoverPreview'

// `compact` = the small brand strip at the end of the home page (tiny logo
// tiles, name only). The full-size variant is kept for reuse elsewhere.
export default function BrandsSection({ compact = false }: { compact?: boolean }) {
  const { show, hide } = useHoverPreview()
  return (
    <section
      id="brands"
      className={compact ? 'scroll-mt-16 py-10 sm:py-14' : 'scroll-mt-16 py-14 sm:py-20'}
    >
      <div className="container-site">
        <div className="max-w-3xl">
          <p className="eyebrow-green">04 / brands</p>
          <h2
            className={
              compact
                ? 'mt-2 font-display text-xl font-black uppercase tracking-tight sm:text-2xl'
                : 'mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl'
            }
          >
            21 brands I&apos;ve worked within Ogilvy
          </h2>
          <p className={compact ? 'mt-2 text-sm text-muted' : 'mt-4 text-muted'}>
            Click any logo for the stills, animatics and final films. {BRANDS.length} brands and
            counting.
          </p>
        </div>

        <div
          className={
            compact
              ? 'mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-6'
              : 'mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4'
          }
        >
          {displayBrands.map((b, i) => (
            <Reveal key={b.slug} delay={(i % (compact ? 6 : 4)) * (compact ? 40 : 70)}>
              <a
                href={`#/brand/${b.slug}`}
                onMouseEnter={(e) => {
                  const media =
                    b.films[0] ?? b.images[0] ?? (b.logo ? { kind: 'image' as const, src: b.logo } : undefined)
                  show(
                    {
                      title: b.name,
                      subtitle: b.note,
                      media,
                      badge: 'brand',
                      link: `#/brand/${b.slug}`,
                    },
                    e.currentTarget.getBoundingClientRect()
                  )
                }}
                onMouseLeave={hide}
                className="brand-tile card-lift panel group relative z-[1] block overflow-hidden hover:border-green"
                style={{ ['--brand' as never]: b.accent }}
              >
                <div className="border-b border-ink-600">
                  <BrandTile
                    logo={b.logo}
                    name={b.name}
                    size={compact ? 'sm' : 'lg'}
                    className={compact ? 'aspect-[3/2] w-full' : 'aspect-[4/3] w-full'}
                  />
                </div>
                <div className={compact ? 'px-2 py-1.5' : 'p-3 sm:p-4'}>
                  <h3
                    className={
                      compact
                        ? 'truncate font-display text-[11px] leading-tight text-paper transition-colors group-hover:text-green sm:text-xs'
                        : 'font-display text-sm text-paper transition-colors group-hover:text-green sm:text-base'
                    }
                  >
                    {b.name}
                  </h3>
                  {!compact && (
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-wideish text-muted sm:text-[10px]">
                      {b.note}
                    </p>
                  )}
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
