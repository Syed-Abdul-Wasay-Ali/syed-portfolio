// ---------------------------------------------------------------------------
// Personal showcase — concept ads and personal images.
//
// HOW TO ADD MEDIA:
//   1. Drop files into  public/media/showcase/  (see README.md):
//        ads/*.mp4|webm|jpg|png       — concept ad spots (video or still)
//        images/*.jpg|png             — personal / experiment images
//   2. Fill `src` below. Empty src renders an intentional placeholder.
// ---------------------------------------------------------------------------

import type { MediaItem } from './projects'

export type ShowcaseTag = 'concept-ad' | 'image'

export interface ShowcaseItem extends MediaItem {
  id: string
  title: string
  tag: ShowcaseTag
}

export const SHOWCASE: ShowcaseItem[] = [
  {
    id: 'sa5',
    title: 'futuristic neon chase · blender clay vs seedance 2.5',
    tag: 'concept-ad',
    kind: 'video',
    poster: 'media/futuristic-neon-chase/video/side-by-side-comparison-poster.jpg',
    label: 'futuristic neon chase · blender clay vs seedance 2.5',
    src: 'media/futuristic-neon-chase/video/side-by-side-comparison.mp4',
  },
]

export const SHOWCASE_TAGS: { key: 'all' | ShowcaseTag; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'concept-ad', label: 'Concept ads' },
  { key: 'image', label: 'Images' },
]
