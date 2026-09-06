import type { MediaItem } from '../data/projects'
import MediaPanel from './MediaPanel'
import Reveal from './Reveal'

// Staggered media grid, each cell opens the lightbox via onOpen(index)
export default function MediaGallery({
  items,
  onOpen,
  cols = 'sm:grid-cols-2',
}: {
  items: MediaItem[]
  onOpen: (i: number) => void
  cols?: string
}) {
  return (
    <div className={`grid gap-4 ${cols}`}>
      {items.map((m, i) => (
        <Reveal key={i} delay={(i % 3) * 80}>
          <button onClick={() => onOpen(i)} className="group w-full text-left">
            <MediaPanel item={m} className="aspect-video !object-cover" />
            {m.label && (
              <p className="gallery-label mt-2 font-mono text-[11px] text-muted transition-colors group-hover:text-green">
                {m.label}
              </p>
            )}
          </button>
        </Reveal>
      ))}
    </div>
  )
}
