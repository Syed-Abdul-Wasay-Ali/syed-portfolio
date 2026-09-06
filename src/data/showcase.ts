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
  { id: 'sa1', title: 'concept ad 01', tag: 'concept-ad', kind: 'video' },
  { id: 'sa2', title: 'concept ad 02', tag: 'concept-ad', kind: 'video' },
  { id: 'sa3', title: 'concept ad 03', tag: 'concept-ad', kind: 'image' },
  { id: 'img1', title: 'personal image 01', tag: 'image', kind: 'image' },
  { id: 'img2', title: 'personal image 02', tag: 'image', kind: 'image' },
  { id: 'img3', title: 'personal image 03', tag: 'image', kind: 'image' },
  { id: 'sa4', title: 'concept ad 04', tag: 'concept-ad', kind: 'video' },
  { id: 'img4', title: 'personal image 04', tag: 'image', kind: 'image' },
]

export const SHOWCASE_TAGS: { key: 'all' | ShowcaseTag; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'concept-ad', label: 'Concept ads' },
  { key: 'image', label: 'Images' },
]
