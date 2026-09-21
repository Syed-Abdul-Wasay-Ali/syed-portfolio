import Reveal from './Reveal'

// Format grid (same master across 16:9 / 4:5 / 1:1 / 9:16) + placement row
// (website hero, product page, social, paid ad, mobile) for the commercial
// system case study. Frames are minimal CSS mockups, no fake chrome beyond
// the bare layout idea.
export interface FormatTile {
  label: string
  ratio: string
  src: string
  note?: string
  box: string // tailwind aspect class
}

export default function FormatsSection({
  formats,
  placements,
}: {
  formats: FormatTile[]
  placements?: { label: string; src: string; frame: 'browser' | 'square' | 'phone'; note?: string }[]
}) {
  return (
    <div>
      {formats.length > 0 && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {formats.map((f, i) => (
            <Reveal key={f.label} delay={i * 70}>
              <figure className="panel h-full overflow-hidden">
                <div className={`relative ${f.box} overflow-hidden border-b border-ink-600`}>
                  <img
                    src={f.src}
                    alt={`${f.label}, ${f.ratio}`}
                    loading="lazy"
                    className="media-asset absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <figcaption className="p-3">
                  <p className="flex items-baseline justify-between gap-2 font-mono text-[11px] uppercase tracking-wideish text-paper">
                    {f.label} <span className="text-greenReadable">{f.ratio}</span>
                  </p>
                  {f.note && <p className="mt-1 text-[11px] leading-snug text-muted">{f.note}</p>}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      )}

      {placements && placements.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {placements.map((p, i) => (
            <Reveal key={p.label} delay={i * 70}>
              <figure className="group h-full">
                <div className="overflow-hidden rounded-md border border-ink-600 bg-ink-900">
                  {p.frame === 'browser' && (
                    <div className="flex items-center gap-1.5 border-b border-ink-600 px-2.5 py-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-ink-500" />
                      <span className="h-1.5 w-1.5 rounded-full bg-ink-500" />
                      <span className="h-1.5 w-1.5 rounded-full bg-ink-500" />
                      <span className="ml-2 h-1.5 w-16 rounded-full bg-ink-700" />
                    </div>
                  )}
                  {p.frame === 'phone' && (
                    <div className="flex items-center justify-between border-b border-ink-600 px-2.5 py-1.5">
                      <span className="h-1.5 w-6 rounded-full bg-ink-700" />
                      <span className="h-1.5 w-2 rounded-full bg-ink-700" />
                    </div>
                  )}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={p.src}
                      alt={p.label}
                      loading="lazy"
                      className="media-asset absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  {p.frame === 'square' && (
                    <div className="flex items-center gap-2 border-t border-ink-600 px-2.5 py-1.5">
                      <span className="h-3.5 w-3.5 rounded-full bg-ink-700" />
                      <span className="h-1.5 flex-1 rounded-full bg-ink-700" />
                    </div>
                  )}
                </div>
                <figcaption className="mt-1.5">
                  <p className="font-mono text-[11px] uppercase tracking-wideish text-paper">{p.label}</p>
                  {p.note && <p className="mt-0.5 text-[11px] leading-snug text-muted">{p.note}</p>}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}
