# Syed Abdul Wasay Ali — Portfolio

A Behance-style portfolio for AI generation work: ComfyUI pipelines, custom LoRAs,
video workflows, and automation. Dark graphite + amber, monospaced workflow
metadata as the design signature.

**Stack:** Vite + React 19 + TypeScript + Tailwind CSS 3.4. Static output in `dist/`.

---

## Run locally

```bash
npm install
npm run dev        # dev server with HMR
npm run build      # production build -> dist/
npm run preview    # serve the production build
```

Deploy `dist/` anywhere static: **Netlify**, **Vercel**, **GitHub Pages** (it uses
hash routing, so no server rewrites are needed).

---

## How to add a project

### 1. Drop your media in

```
public/media/<slug>/
├── cover.jpg               # card thumbnail (landscape, ~1280x800)
├── video/
│   ├── hero.mp4            # hero video (also referenced in results)
│   └── spot-02.mp4
├── stills/
│   ├── frame-01.jpg
│   └── frame-02.jpg
└── workflow/
    ├── ref2v.png           # ComfyUI workflow screenshots
    └── sampler-ab.png
```

Keep filenames short and English. Videos: mp4/webm. Images: jpg/png.

### 2. Add an entry in `src/data/projects.ts`

Copy one existing object, change the fields:

- `slug` — url-safe name, matches the media folder
- `title`, `company` (`'cleanDirty.ai'` | `'Ogilvy'`), `role`, `year`
- `cover` — `/media/<slug>/cover.jpg`
- `spec` — the mono parameter strip (base model, sampler, steps, …). Real
  numbers sell the story — this is the site's signature element.
- `overview` / `challenge` / `approach` — the case-study narrative:
  what shipped, the obstacle, how you got past it (open-source first).
- `stack` — chips (models, nodes, tools).
- `workflow` — screenshots: `{ label: 'ref2v main graph', src: '/media/<slug>/workflow/ref2v.png' }`
- `results` — videos/images: `{ kind: 'video', label: '...', src: '...' }`

If you haven't added the media yet, leave `src` out — the site renders an
intentional node-graph placeholder with the label, so the layout always looks
finished.

### 3. Rebuild

```bash
npm run build
```

---

## How to add brand media

Brands live in `src/data/brands.ts` (16 brands pre-seeded). Each brand page
shows three galleries: **stills** (images), **animatics** (videos), **final
films** (videos).

### 1. Drop per-brand media in

```
public/media/brands/<slug>/
├── logo.png|svg|webp        # shown on a white tile (transparent bg ideal)
├── stills/
│   ├── kv-01.jpg
│   └── kv-02.jpg
├── animatic/
│   └── spot-15s.mp4
└── film/
    └── final-20s.mp4
```

Slugs: `cadbury-dairy-milk, milka, maaza, sunsilk, ponds, vaseline, castrol,
fevicol, ifb, tata-safari, parachute, daawat, tata-sky, venus, dove, himalaya,
nestle-ceregrow, colgate`.

### 2. Wire the media in `src/data/brands.ts`

For the matching brand, set `logo: '/media/brands/<slug>/logo.png'` and fill
`src` on the entries in `images` / `animatics` / `films` (keep the labels or
rename them). Unfilled entries show an intentional placeholder.

---

## How to add showcase media

Personal concept ads and images live in `src/data/showcase.ts` with a
filterable section on the home page (03 — showcase).

### 1. Drop media in

```
public/media/showcase/
├── ads/            # concept ad spots (.mp4/.webm videos or .jpg/.png stills)
└── images/         # personal / experiment images (.jpg/.png)
```

### 2. Wire items in `src/data/showcase.ts`

Each item: `{ id, title, tag: 'concept-ad' | 'image', kind, src, label }`.
Set `src` to `/media/showcase/ads/spot-01.mp4` or
`/media/showcase/images/experiment-01.jpg`. Empty `src` renders an
intentional placeholder. `title` shows under the card and in the lightbox.

---

## Things to customize

- Footer email: `src/components/Footer.tsx` (`hello@syedwasay.dev` is a placeholder)
- Bio copy: `src/components/About.tsx`, `src/components/Hero.tsx`
- Capabilities: `src/components/Capabilities.tsx`
- Demo case studies in `src/data/projects.ts` are sample text — replace with
  the real stories + real parameters for maximum credibility.

## Design notes

- Palette (cyberpunk Spider-Verse): deep indigo canvas `#0B0A1E` (surfaces
  `#171633`/`#131228`), cool white text `#F5F4FF` (muted `#9A98CF`), neon
  magenta accent `#FF36C8` (bright `#FF7DE0`, deep `#7A0F5C`), electric cyan
  `#00E5FF`, acid yellow `#FFE45C`. Header: indigo blur bar with a
  3px green top strip, green hairline border and green scroll-progress bar.
- Type: Archivo (display) / Instrument Sans (body) / IBM Plex Mono (metadata)
- Every card carries a mono "spec strip" with the real pipeline parameters —
  that's the signature. Keep it authentic: real model names, real samplers.
- Motion: hero scanline sweep + floating ambient orbs + staggered entrance,
  scroll-reveal (IntersectionObserver, `.reveal`), card hover glow + cover zoom,
  animated dashed node links + pulsing sockets, header scroll-progress bar,
  lightbox fade. All animations respect `prefers-reduced-motion`.
