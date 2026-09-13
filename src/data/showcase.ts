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
  note?: string
}

export const SHOWCASE: ShowcaseItem[] = [
  {
    id: 'sa8',
    title: '7up · concept ad',
    tag: 'concept-ad',
    kind: 'video',
    poster: 'media/showcase/ads/7up-concept-poster.jpg',
    label: '7up · concept ad · seedance 2.5 + original concept',
    note: 'My own original concept and ad idea for 7up, generated with Seedance 2.5.',
    src: 'media/showcase/ads/7up-concept.mp4',
  },
  {
    id: 'sa7',
    title: 'happydent white gum · concept ad',
    tag: 'concept-ad',
    kind: 'video',
    poster: 'media/showcase/ads/happydent-white-gum-concept-poster.jpg',
    label: 'happydent white gum · concept ad · seedance 2.5 + original concept',
    note: 'My own original concept and ad idea for Happydent White gum, generated with Seedance 2.5, then directed and edited by me.',
    src: 'media/showcase/ads/happydent-white-gum-concept.mp4',
  },
  {
    id: 'sa6',
    title: 'bedroom concept · mcp blender via gpt astra vs seedance 2.5',
    tag: 'concept-ad',
    kind: 'video',
    poster: 'media/showcase/ads/bedroom-mcp-astra-seedance25-poster.jpg',
    label: 'bedroom concept · mcp blender via gpt astra vs seedance 2.5',
    note: 'I modeled the bedroom in Blender over MCP, with GPT Astra scripting the scene, and then rendered the video with Seedance 2.5. Top: the raw MCP Blender output. Bottom: the Seedance 2.5 render.',
    src: 'media/showcase/ads/bedroom-mcp-astra-seedance25.mp4',
  },
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
