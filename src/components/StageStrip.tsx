import type { MediaItem } from '../data/projects'
import Reveal from './Reveal'

// Labeled production stages for a case study: each tile is one real stage of
// the pipeline (product, mask, environment, light, final…). The chain line on
// top keeps the order readable when tiles wrap.
export default function StageStrip({
  stages,
  chain,
}: {
  stages: MediaItem[]
  chain?: string
}) {
  if (!stages.length) return null
  return (
    <div>
      {chain && (
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-greenReadable">
          {chain}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stages.map((s, i) => (
          <Reveal key={i} delay={i * 60} className="h-full">
            <figure className="panel group h-full overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={s.src}
                  alt={s.label ?? `stage ${i + 1}`}
                  loading="lazy"
                  className="media-asset absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="absolute left-2 top-2 bg-ink-950/85 px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wideish text-greenReadable">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <figcaption className="border-t border-ink-600 p-2.5">
                <p className="font-mono text-[11px] uppercase tracking-wideish text-paper">
                  {s.label}
                </p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
