import { useState, useEffect } from 'react'
import { getBrand, brandMedia, BRANDS, type Brand } from '../data/brands'
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
  const bg = mix(c, '#0B0A1E', 0.3) // brand-drenched page background
  const panel = mix(c, '#100F26', 0.42) // card / placeholder surface
  const head = mix(c, '#FFFFFF', 0.38) // bright brand heading
  const text = mix(c, '#F5F4FF', 0.86) // near-white, brand-tinted
  const muted = mix(c, '#9A98CF', 0.5) // secondary text
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
    background: ${mix(c, '#070614', 0.78)};
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
  .brand-page .node-grid {
    background-image:
      linear-gradient(${hexToRgba(c, 0.05)} 1px, transparent 1px),
      linear-gradient(90deg, ${hexToRgba(c, 0.04)} 1px, transparent 1px);
  }
  .brand-page svg path[fill="#FF36C8"] { fill: ${c}; }
  .brand-page .gallery-label { color: ${muted}; }
  .brand-page .group:hover .gallery-label { color: ${c}; }
  .brand-page .hover\\:border-greenBright:hover { border-color: ${c}; }
  .brand-page .hover\\:text-greenBright:hover { color: ${c}; }
  .brand-page .bg-ink-950\\/97 { background: ${mix(c, '#070614', 0.85)}; }

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
      ${mix(c, '#100F26', 0.32)};
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

export default function BrandPage({ slug }: { slug: string }) {
  const brand = getBrand(slug)
  const [lightbox, setLightbox] = useState<number | null>(null)

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
        <p className="eyebrow-green">404 — brand not found</p>
        <h1 className="mt-3 font-display text-3xl font-black uppercase">Brand missing</h1>
        <a href="#/" className="btn-ghost mt-6">
          ← back home
        </a>
      </div>
    )
  }

  const all = brandMedia(brand)
  const imagesEnd = brand.images.length
  const animaticsEnd = imagesEnd + brand.animatics.length
  const next = BRANDS[(BRANDS.findIndex((b) => b.slug === slug) + 1) % BRANDS.length]

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

      {/* Reel banner */}
      <div className="container-site pb-4 pt-8">
        <div className="brand-reel relative flex aspect-[21/9] items-center justify-center overflow-hidden rounded-md">
          <NodeGraph className="max-w-lg opacity-80" />
          <p className="absolute bottom-3 right-4 font-mono text-[10px] uppercase tracking-wideish text-muted">
            brand reel — media being added
          </p>
        </div>
      </div>

      {/* Galleries */}
      <div className="container-site pb-4 pt-8">
        <Section tag="01 — stills" title="Campaign images">
          <MediaGallery
            items={brand.images}
            onOpen={(i) => setLightbox(i)}
            cols="sm:grid-cols-3"
          />
        </Section>

        <Section tag="02 — animatics" title="Animatics" delay={60}>
          <MediaGallery
            items={brand.animatics}
            onOpen={(i) => setLightbox(imagesEnd + i)}
          />
        </Section>

        <Section tag="03 — final film" title="Final films" delay={120}>
          <MediaGallery
            items={brand.films}
            onOpen={(i) => setLightbox(animaticsEnd + i)}
          />
        </Section>

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
