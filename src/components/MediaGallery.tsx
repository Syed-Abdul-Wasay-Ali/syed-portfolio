import type { MediaItem } from '../data/projects'
import MediaPanel from './MediaPanel'
import Reveal from './Reveal'
import { useHoverPreview } from './HoverPreview'

// Videos render with object-contain so wide masters (e.g. the side-by-side
// comparison videos) are never center-cropped in the grid; images fill.
const isVideoItem = (m: MediaItem) =>
  m.kind === 'video' || /\.(mp4|webm|mov|mkv)$/i.test(m.src ?? '')

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
  const { show, hide } = useHoverPreview()
  return (
    <div className={`grid gap-4 ${cols}`}>
      {items.map((m, i) => (
        <Reveal key={i} delay={(i % 3) * 80}>
          <button
            onClick={() => onOpen(i)}
            onMouseEnter={(e) => {
              if (!m.src) return
              show(
                {
                  title: m.label ?? 'media',
                  subtitle: m.kind === 'video' ? 'video · auto-playing' : 'image',
                  media: m,
                  badge: m.kind,
                },
                e.currentTarget.getBoundingClientRect()
              )
            }}
            onMouseLeave={hide}
            className="media-cell group w-full overflow-hidden rounded-md bg-mist/60 p-1.5 text-left"
          >
            <MediaPanel item={m} className={`aspect-video ${isVideoItem(m) ? '!object-contain' : '!object-cover'}`} />
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
