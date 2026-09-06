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
}

function stills(labels: string[]): MediaItem[] {
  return labels.map((label) => ({ kind: 'image', label }))
}

function spots(labels: string[]): MediaItem[] {
  return labels.map((label) => ({ kind: 'video', label }))
}

export const BRANDS: Brand[] = [
  {
    slug: 'cadbury-dairy-milk',
    name: 'Cadbury Dairy Milk',
    note: 'stills · animatics · final film',
    accent: '#7A4FBF',
    logo: 'media/brands/cadbury-dairy-milk/logo.png',
    images: stills(['key visual 01', 'key visual 02', 'key visual 03']),
    animatics: spots(['animatic — 15s cut', 'animatic — 30s cut']),
    films: spots(['final film — 20s']),
  },
  {
    slug: 'milka',
    name: 'Milka',
    note: 'stills · animatics · final film',
    accent: '#A77FD9',
    logo: 'media/brands/milka/logo.png',
    images: stills(['key visual 01', 'key visual 02', 'key visual 03']),
    animatics: spots(['animatic — 15s cut', 'animatic — 30s cut']),
    films: spots(['final film — 20s']),
  },
  {
    slug: 'maaza',
    name: 'Maaza',
    note: 'stills · animatics · final film',
    accent: '#E4442E',
    logo: 'media/brands/maaza/logo-v2.png',
    images: stills(['key visual 01', 'key visual 02', 'key visual 03']),
    animatics: spots(['animatic — 15s cut', 'animatic — 30s cut']),
    films: spots(['final film — 20s']),
  },
  {
    slug: 'sunsilk',
    name: 'Sunsilk',
    note: 'stills · animatics · final film',
    accent: '#EC2E9C',
    logo: 'media/brands/sunsilk/logo.png',
    images: stills(['key visual 01', 'key visual 02', 'key visual 03']),
    animatics: spots(['animatic — 15s cut', 'animatic — 30s cut']),
    films: spots(['final film — 20s']),
  },
  {
    slug: 'ponds',
    name: 'Ponds',
    note: 'stills · animatics · final film',
    accent: '#1F7FD4',
    logo: 'media/brands/ponds/logo.png',
    images: stills(['key visual 01', 'key visual 02', 'key visual 03']),
    animatics: spots(['animatic — 15s cut', 'animatic — 30s cut']),
    films: spots(['final film — 20s']),
  },
  {
    slug: 'vaseline',
    name: 'Vaseline',
    note: 'stills · animatics · final film',
    accent: '#3B72C6',
    logo: 'media/brands/vaseline/logo.png',
    images: stills(['key visual 01', 'key visual 02', 'key visual 03']),
    animatics: spots(['animatic — 15s cut', 'animatic — 30s cut']),
    films: spots(['final film — 20s']),
  },
  {
    slug: 'castrol',
    name: 'Castrol',
    note: 'stills · animatics · final film',
    accent: '#2EA44F',
    logo: 'media/brands/castrol/logo.png',
    images: stills(['key visual 01', 'key visual 02', 'key visual 03']),
    animatics: spots(['animatic — 15s cut', 'animatic — 30s cut']),
    films: spots(['final film — 20s']),
  },
  {
    slug: 'fevicol',
    name: 'Fevicol',
    note: 'stills · animatics · final film',
    accent: '#2878D0',
    logo: 'media/brands/fevicol/logo.png',
    images: stills(['key visual 01', 'key visual 02', 'key visual 03']),
    animatics: spots(['animatic — 15s cut', 'animatic — 30s cut']),
    films: spots(['final film — 20s']),
  },
  {
    slug: 'ifb',
    name: 'IFB',
    note: 'stills · animatics · final film',
    accent: '#E63946',
    logo: 'media/brands/ifb/logo.png',
    images: stills(['key visual 01', 'key visual 02', 'key visual 03']),
    animatics: spots(['animatic — 15s cut', 'animatic — 30s cut']),
    films: spots(['final film — 20s']),
  },
  {
    slug: 'tata-safari',
    name: 'Tata Safari',
    note: 'stills · animatics · final film',
    accent: '#2E7CD6',
    logo: 'media/brands/tata-safari/logo.png',
    images: stills(['key visual 01', 'key visual 02', 'key visual 03']),
    animatics: spots(['animatic — 15s cut', 'animatic — 30s cut']),
    films: spots(['final film — 20s']),
  },
  {
    slug: 'parachute',
    name: 'Parachute',
    note: 'stills · animatics · final film',
    accent: '#12A594',
    logo: 'media/brands/parachute/logo.jpg',
    images: stills(['key visual 01', 'key visual 02', 'key visual 03']),
    animatics: spots(['animatic — 15s cut', 'animatic — 30s cut']),
    films: spots(['final film — 20s']),
  },
  {
    slug: 'daawat',
    name: 'Daawat Basmati Rice',
    note: 'stills · animatics · final film',
    accent: '#D9A52E',
    logo: 'media/brands/daawat/logo.jpg',
    images: stills(['key visual 01', 'key visual 02', 'key visual 03']),
    animatics: spots(['animatic — 15s cut', 'animatic — 30s cut']),
    films: spots(['final film — 20s']),
  },
  {
    slug: 'tata-sky',
    name: 'Tata Sky',
    note: 'stills · animatics · final film',
    accent: '#29B6F6',
    logo: 'media/brands/tata-sky/logo.png',
    images: stills(['key visual 01', 'key visual 02', 'key visual 03']),
    animatics: spots(['animatic — 15s cut', 'animatic — 30s cut']),
    films: spots(['final film — 20s']),
  },
  {
    slug: 'venus',
    name: 'Venus',
    note: 'stills · animatics · final film',
    accent: '#00A98F',
    logo: 'media/brands/venus/logo.png',
    images: stills(['key visual 01', 'key visual 02', 'key visual 03']),
    animatics: spots(['animatic — 15s cut', 'animatic — 30s cut']),
    films: spots(['final film — 20s']),
  },
  {
    slug: 'dove',
    name: 'Dove',
    note: 'stills · animatics · final film',
    accent: '#2E82C1',
    logo: 'media/brands/dove/logo.png',
    images: stills(['key visual 01', 'key visual 02', 'key visual 03']),
    animatics: spots(['animatic — 15s cut', 'animatic — 30s cut']),
    films: spots(['final film — 20s']),
  },
  {
    slug: 'himalaya',
    name: 'Himalaya',
    note: 'stills · animatics · final film',
    accent: '#16A085',
    logo: 'media/brands/himalaya/logo.png',
    images: stills(['key visual 01', 'key visual 02', 'key visual 03']),
    animatics: spots(['animatic — 15s cut', 'animatic — 30s cut']),
    films: spots(['final film — 20s']),
  },
  {
    slug: 'nestle-ceregrow',
    name: 'Nestlé Ceregrow',
    note: 'stills · animatics · final film',
    accent: '#E5484D',
    logo: 'media/brands/nestle-ceregrow/logo.jpg',
    images: stills(['key visual 01', 'key visual 02', 'key visual 03']),
    animatics: spots(['animatic — 15s cut', 'animatic — 30s cut']),
    films: spots(['final film — 20s']),
  },
  {
    slug: 'colgate',
    name: 'Colgate',
    note: 'stills · animatics · final film',
    accent: '#E8503A',
    logo: 'media/brands/colgate/logo-v2.png',
    images: stills(['key visual 01', 'key visual 02', 'key visual 03']),
    animatics: spots(['animatic — 15s cut', 'animatic — 30s cut']),
    films: spots(['final film — 20s']),
  },
]

export const getBrand = (slug: string) => BRANDS.find((b) => b.slug === slug)

// Media combined in display order: stills → animatics → films
export const brandMedia = (b: Brand): MediaItem[] => [
  ...b.images,
  ...b.animatics,
  ...b.films,
]
