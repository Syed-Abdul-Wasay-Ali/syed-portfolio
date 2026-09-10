// ---------------------------------------------------------------------------
// Brand data — one entry per client brand.
//
// HOW TO ADD BRAND MEDIA:
//   1. Drop files into  public/media/brands/<slug>/  (see README.md):
//        logo.png|svg|webp        — brand logo (on transparent/white bg)
//        stills/*.jpg|png         — campaign images
//        animatic/*.mp4|webm      — animatic videos
//        film/*.mp4|webm          — final films
//   2. Fill `src` on the matching MediaItem below. Leave `src` empty while
//      media is pending — the site renders an intentional placeholder.
// ---------------------------------------------------------------------------

import type { MediaItem } from './projects'

export interface Brand {
  slug: string
  name: string
  note: string
  accent: string
  logo?: string
  images: MediaItem[]
  animatics: MediaItem[]
  films: MediaItem[]
  story?: string
  // case study slugs under this brand — rendered as Project 1, 2, 3...
  // (grows automatically as more project entries are added below)
  projects?: string[]
}

export const BRANDS: Brand[] = [
  {
    slug: 'cadbury-dairy-milk',
    name: 'Cadbury Dairy Milk',
    note: 'stills · animatics · final film',
    accent: '#7A4FBF',
    projects: ['ogilvy-cadbury-silk-story-of-us', 'ogilvy-cadbury-celebrations-memories'],
    story:
      'Cadbury Silk, "The Story of Us", for Disney+ Hotstar (now JioHotstar). Made in 2024, when there was no Nano Banana Pro, no Seedream 5, no model that could hand you a clean, artifact-free frame on request. The whole film came out of open-source image models on the SD 1.5 stack, running on my own GPU. And let\u2019s be honest: look closely at these frames. Soft edges, melted hands, drifting shapes, glitches where the model lost the plot. The artifacts are right there, in nearly every shot. But imperfect as they are, this was the ceiling of what an open-source stack could do in 2024, and back then it was acceptable, because nothing better existed. Making it work was its own craft: style LoRA models trained to hold the look and the characters from scene to scene, re-trained whenever a frame drifted, sweeps of seeds and parameters until the story held together across hundreds of imperfect frames. Long nights, failed runs, plenty of sampling math, and the film shipped.',
    logo: 'media/brands/cadbury-dairy-milk/logo.png',
    images: [
      { kind: 'image', label: 'key visual 01', src: 'media/brands/cadbury-dairy-milk/stills/keyvisual-01.JPG' },
      { kind: 'image', label: 'key visual 02', src: 'media/brands/cadbury-dairy-milk/stills/keyvisual-02.jpeg' },
      { kind: 'image', label: 'key visual 03', src: 'media/brands/cadbury-dairy-milk/stills/keyvisual-03.PNG' },
      { kind: 'image', label: 'key visual 04', src: 'media/brands/cadbury-dairy-milk/stills/keyvisual-04.JPG' },
      { kind: 'image', label: 'key visual 05', src: 'media/brands/cadbury-dairy-milk/stills/keyvisual-05.JPG' },
      { kind: 'image', label: 'key visual 06', src: 'media/brands/cadbury-dairy-milk/stills/keyvisual-06.jpeg' },
      { kind: 'image', label: 'key visual 07', src: 'media/brands/cadbury-dairy-milk/stills/keyvisual-07.JPG' },
      { kind: 'image', label: 'story of us — valentine 01', src: 'media/ogilvy-cadbury-story-of-us-zoya-akhtar/stills/vday_f3016.png' },
      { kind: 'image', label: 'story of us — valentine 02', src: 'media/ogilvy-cadbury-story-of-us-zoya-akhtar/stills/vday_f1136.png' },
      { kind: 'image', label: 'story of us — valentine 03', src: 'media/ogilvy-cadbury-story-of-us-zoya-akhtar/stills/vday_f2108.png' },
    ],
    animatics: [],
    films: [
      {
        kind: 'video',
        label: 'cadbury silk — the story of us (sd 1.5 · 2024)',
        src: 'media/brands/cadbury-dairy-milk/film/story-of-us-cadbury-silk.mp4',
      },
      {
        kind: 'video',
        label: 'cadbury silk — the story of us "now" cut (sd 1.5 · 2024)',
        src: 'media/brands/cadbury-dairy-milk/film/story-of-us-cadbury-silk-now.mp4',
      },
    ],
  },
  {
    slug: 'milka',
    name: 'Milka',
    note: 'stills · animatics · final film',
    accent: '#A77FD9',
    logo: 'media/brands/milka/logo.png',
    images: [],
    animatics: [],
    films: [],
  },
  {
    slug: 'maaza',
    name: 'Maaza',
    note: 'stills · animatics · final film',
    accent: '#E4442E',
    logo: 'media/brands/maaza/logo-v2.png',
    images: [],
    animatics: [],
    films: [],
  },
  {
    slug: 'sunsilk',
    name: 'Sunsilk',
    note: 'stills · animatics · final film',
    accent: '#EC2E9C',
    logo: 'media/brands/sunsilk/logo.png',
    images: [],
    animatics: [],
    films: [],
  },
  {
    slug: 'ponds',
    name: 'Ponds',
    note: 'stills · animatics · final film',
    accent: '#1F7FD4',
    logo: 'media/brands/ponds/logo.png',
    images: [],
    animatics: [],
    films: [],
  },
  {
    slug: 'vaseline',
    name: 'Vaseline',
    note: 'stills · animatics · final film',
    accent: '#3B72C6',
    logo: 'media/brands/vaseline/logo.png',
    images: [],
    animatics: [],
    films: [],
  },
  {
    slug: 'castrol',
    name: 'Castrol',
    note: 'stills · animatics · final film',
    accent: '#2EA44F',
    logo: 'media/brands/castrol/logo.png',
    images: [],
    animatics: [],
    films: [],
  },
  {
    slug: 'fevicol',
    name: 'Fevicol',
    note: 'stills · animatics · final film',
    accent: '#2878D0',
    logo: 'media/brands/fevicol/logo.png',
    images: [],
    animatics: [],
    films: [],
  },
  {
    slug: 'ifb',
    name: 'IFB',
    note: 'stills · animatics · final film',
    accent: '#E63946',
    logo: 'media/brands/ifb/logo.png',
    story:
      'The IFB Christmas 2025 film turns on a finger snap, the tiny gesture that brings the house to life while everyone sleeps. It was also the hardest shot in the film. Even the top closed-source video models of the time, Google Veo 3 and Kling 2 among them, could not generate a natural snap. So the shot was solved open-source: I recorded my own hand performing the snap, then drove a Santa hand reference image with that motion in Wan Animate until the gesture felt real. This was before Seedream 2.5 and MiniMax H3 existed, and open-source was the route that delivered.',
    images: [],
    animatics: [],
    films: [
      {
        kind: 'video',
        label: 'ifb christmas 2025 — because some miracles do happen overnight (youtube)',
        src: 'https://youtu.be/ZmPFjsUXuCQ',
      },
      {
        kind: 'video',
        label: 'finger snap breakdown · hand capture vs wan animate (side by side)',
        src: 'media/ogilvy-ifb-christmas-2025/video/finger-snap-comparison.mp4',
        poster: 'media/ogilvy-ifb-christmas-2025/video/finger-snap-comparison-poster.jpg',
      },
      {
        kind: 'video',
        label: 'hand capture · full clip',
        src: 'media/ogilvy-ifb-christmas-2025/video/hand-capture.mp4',
        poster: 'media/ogilvy-ifb-christmas-2025/video/hand-capture-poster.jpg',
      },
      {
        kind: 'video',
        label: 'wan animate · full clip',
        src: 'media/ogilvy-ifb-christmas-2025/video/wan-animate-santa.mp4',
        poster: 'media/ogilvy-ifb-christmas-2025/video/wan-animate-santa-poster.jpg',
      },
    ],
    projects: ['ogilvy-ifb-christmas-2025'],
  },
  {
    slug: 'tata-safari',
    name: 'Tata Safari',
    note: 'stills · animatics · final film',
    accent: '#2E7CD6',
    logo: 'media/brands/tata-safari/logo.png',
    images: [],
    animatics: [],
    films: [],
  },
  {
    slug: 'parachute',
    name: 'Parachute',
    note: 'stills · animatics · final film',
    accent: '#12A594',
    logo: 'media/brands/parachute/logo.jpg',
    images: [],
    animatics: [],
    films: [],
  },
  {
    slug: 'daawat',
    name: 'Daawat Basmati Rice',
    note: 'stills · animatics · final film',
    accent: '#D9A52E',
    logo: 'media/brands/daawat/logo.jpg',
    images: [],
    animatics: [],
    films: [],
  },
  {
    slug: 'tata-sky',
    name: 'Tata Sky',
    note: 'stills · animatics · final film',
    accent: '#29B6F6',
    logo: 'media/brands/tata-sky/logo.png',
    images: [],
    animatics: [],
    films: [],
  },
  {
    slug: 'venus',
    name: 'Venus',
    note: 'stills · animatics · final film',
    accent: '#00A98F',
    logo: 'media/brands/venus/logo.png',
    images: [],
    animatics: [],
    films: [],
  },
  {
    slug: 'dove',
    name: 'Dove',
    note: 'stills · animatics · final film',
    accent: '#2E82C1',
    logo: 'media/brands/dove/logo.png',
    images: [],
    animatics: [],
    films: [],
  },
  {
    slug: 'himalaya',
    name: 'Himalaya',
    note: 'stills · animatics · final film',
    accent: '#16A085',
    logo: 'media/brands/himalaya/logo.png',
    images: [],
    animatics: [],
    films: [],
  },
  {
    slug: 'nestle-ceregrow',
    name: 'Nestlé Ceregrow',
    note: 'stills · animatics · final film',
    accent: '#E5484D',
    logo: 'media/brands/nestle-ceregrow/logo.jpg',
    images: [],
    animatics: [],
    films: [],
  },
  {
    slug: 'colgate',
    name: 'Colgate',
    note: 'stills · animatics · final film',
    accent: '#E8503A',
    logo: 'media/brands/colgate/logo-v2.png',
    images: [],
    animatics: [],
    films: [],
  },
  {
    slug: 'vi',
    name: 'Vi',
    note: 'stills · animatics · final film',
    accent: '#EE2737',
    logo: 'media/brands/vi/logo.jpg',
    images: [],
    animatics: [],
    films: [],
  },
  {
    slug: 'lacta',
    name: 'Lacta',
    note: 'stills · animatics · final film',
    accent: '#003399',
    logo: 'media/brands/lacta/logo.png',
    images: [
      { kind: 'image', label: 'christmas tree — 3d scene', src: 'media/brands/lacta/stills/lacta-christmas-tree.JPG' },
      { kind: 'image', label: 'ai avatar — festive friends (reindeer)', src: 'media/brands/lacta/stills/lacta-avatar-reindeer.png' },
    ],
    animatics: [],
    films: [],
    projects: ['lacta-christmas-ai-app'],
  },
  {
    slug: 'natural-diamond-promotion-foundation',
    name: 'Natural Diamond Promotion Foundation',
    note: 'stills · animatics · final film',
    accent: '#C9A227',
    logo: 'media/brands/natural-diamond-promotion-foundation/logo.png',
    images: [
      { kind: 'image', label: 'golconda era — diamond at twilight', src: 'media/ndpf-history-of-diamonds/stills/ndpf-golconda-diamond-twilight.webp' },
      { kind: 'image', label: 'diamonds on the old trade map', src: 'media/ndpf-history-of-diamonds/stills/ndpf-diamonds-old-trade-map.webp' },
      { kind: 'image', label: 'river panning for alluvial diamonds', src: 'media/ndpf-history-of-diamonds/stills/ndpf-river-panning-alluvial.webp' },
      { kind: 'image', label: 'history of diamonds in india — timeline section', src: 'media/ndpf-history-of-diamonds/stills/ndpf-history-timeline.jpg' },
      { kind: 'image', label: 'first discovery & ancient trade — timeline', src: 'media/ndpf-history-of-diamonds/stills/ndpf-timeline-first-discovery-trade.jpg' },
      { kind: 'image', label: 'golconda era & 1665 — timeline', src: 'media/ndpf-history-of-diamonds/stills/ndpf-timeline-golconda-world-notices.jpg' },
    ],
    animatics: [],
    films: [],
    projects: ['ndpf-history-of-diamonds'],
  },
]

// Display order: newest-added first. BRANDS grows by appending new brands;
// every public surface (grid, carousel, next-brand link) uses this reversed
// view so a newly added brand always shows FIRST in line.
export const displayBrands: Brand[] = [...BRANDS].reverse()

export const getBrand = (slug: string) => BRANDS.find((b) => b.slug === slug)

// Media combined in display order: stills → animatics → films
export const brandMedia = (b: Brand): MediaItem[] => [
  ...b.images,
  ...b.animatics,
  ...b.films,
]
