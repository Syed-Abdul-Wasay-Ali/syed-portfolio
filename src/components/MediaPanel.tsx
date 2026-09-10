import type { MediaItem } from '../data/projects'
import NodeGraph from './NodeGraph'

// YouTube URLs are embedded as iframes so the video plays straight from
// YouTube on the site (local dev AND gh-pages — no files needed). Same for
// Instagram reels/posts via the official /embed/ endpoint.
const YT_RE = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
const ytId = (s: string) => s.match(YT_RE)?.[1]
const IG_RE = /instagram\.com\/(reel|p|tv)\/([A-Za-z0-9_-]+)/
const igMatch = (s: string) => s.match(IG_RE)

// Renders a media item as video, image, YouTube embed, or an intentional
// placeholder when the real asset hasn't been dropped into /public/media yet.
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
                <path d="M3 1.5 L10 6 L3 10.5 Z" fill="#1F3A93" />
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

  const yt = ytId(item.src)
  if (yt) {
    return (
      <div
        className={`media-asset relative aspect-video w-full overflow-hidden bg-ink-950 ${className}`}
      >
        <iframe
          src={`https://www.youtube.com/embed/${yt}?rel=0&modestbranding=1`}
          title={item.label ?? 'YouTube video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    )
  }

  const ig = item.src ? igMatch(item.src) : undefined
  if (ig) {
    return (
      <div
        className={`media-asset relative mx-auto w-full max-w-[420px] overflow-hidden bg-ink-950 ${className}`}
        style={{ aspectRatio: '9 / 16' }}
      >
        <iframe
          src={`https://www.instagram.com/${ig[1]}/${ig[2]}/embed/`}
          title={item.label ?? 'Instagram reel'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
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
      className={`media-asset w-full max-w-full object-contain ${className}`}
    />
  )
}
