import type { MediaItem } from '../data/projects'
import Reveal from './Reveal'

// Before / after pair with annotation chips — product reference (or raw
// generation) next to the final commercial frame, with the fidelity checks
// called out. Side by side rather than a slider: the two frames are different
// compositions, so the pair reads as evidence, not an overlay.
export default function BeforeAfter({
  before,
  after,
  annotations,
}: {
  before: MediaItem
  after: MediaItem
  annotations?: string[]
}) {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { tag: 'before', item: before, accent: 'text-muted' },
          { tag: 'after', item: after, accent: 'text-greenBright' },
        ].map(({ tag, item, accent }, i) => (
          <Reveal key={tag} delay={i * 100}>
            <figure className="panel overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden border-b border-ink-600">
                <img
                  src={item.src}
                  alt={`${tag} — ${item.label ?? ''}`}
                  loading="lazy"
                  className="media-asset absolute inset-0 h-full w-full object-cover"
                />
                <span className="absolute left-2.5 top-2.5 bg-ink-950/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wideish text-paper">
                  {tag}
                </span>
              </div>
              <figcaption className={`px-3 py-2.5 font-mono text-[10px] uppercase tracking-wideish ${accent}`}>
                {item.label}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      {annotations && annotations.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {annotations.map((a) => (
            <span
              key={a}
              className="border border-ink-600 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wideish text-paper/80"
            >
              {a}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
