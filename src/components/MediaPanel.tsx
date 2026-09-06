import type { MediaItem } from '../data/projects'
import NodeGraph from './NodeGraph'

// Renders a media item as video, image, or an intentional placeholder
// when the real asset hasn't been dropped into /public/media yet.
export default function MediaPanel({
  item,
  className = '',
}: {
  item: MediaItem
  className?: string
}) {
  if (!item.src) {
    const isVideo = item.kind === 'video'
    return (
      <div
        className={`node-grid media-asset relative flex aspect-video max-h-full w-full flex-col items-center justify-center gap-4 border border-dashed border-ink-500 bg-mist p-6 ${className}`}
      >
        <NodeGraph className="max-w-md opacity-95" animated={false} />
        <div className="flex items-center gap-3">
          {isVideo && (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-green bg-ink-950">
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M3 1.5 L10 6 L3 10.5 Z" fill="#FF36C8" />
              </svg>
            </span>
          )}
          <p className="font-mono text-sm uppercase tracking-wideish text-green">
            {item.label ?? 'media pending'}
          </p>
        </div>
        <p className="font-mono text-[10px] text-muted/70">
          drop file into public/media — src: pending
        </p>
      </div>
    )
  }

  const isVideo = item.kind === 'video' || /\.(mp4|webm|mov|mkv)$/i.test(item.src)

  if (isVideo) {
    return (
      <video
        src={item.src}
        poster={item.poster}
        controls
        playsInline
        className={`media-asset w-full bg-ink-950 ${className}`}
      />
    )
  }

  return (
    <img
      src={item.src}
      alt={item.label ?? ''}
      loading="lazy"
      className={`media-asset w-full object-contain ${className}`}
    />
  )
}
