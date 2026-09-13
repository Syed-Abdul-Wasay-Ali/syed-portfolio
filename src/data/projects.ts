// ---------------------------------------------------------------------------
// Portfolio data model — one entry per project.
//
// HOW TO ADD A PROJECT:
//   1. Drop your media into  public/media/<slug>/  (see README.md):
//        cover.jpg            — card thumbnail (landscape, ~1280x800)
//        video/*.mp4|.webm    — hero / result videos
//        stills/*.jpg|.png    — result images
//        workflow/*.jpg|.png  — ComfyUI workflow screenshots
//   2. Add an entry below. For media you haven't added yet, leave `src`
//      empty — the site renders an intentional node-graph placeholder with
//      the label you write in `label`, so the layout stays complete.
// ---------------------------------------------------------------------------

export type Company = 'Concept' | 'Ogilvy'

export interface MediaItem {
  src?: string // e.g. '/media/<slug>/workflow/ref2v.png'
  poster?: string
  kind?: 'image' | 'video'
  label?: string // shown as caption / placeholder label
}

export interface Project {
  slug: string
  title: string
  company: Company
  role: string
  year: string
  /** ISO date the work was done — drives newest-first case-study order. */
  date?: string
  /** "My contribution" chips — what I did on the project, not ownership. */
  contribution?: string[]
  /** Public release link (campaign/ad on YouTube, Instagram or the client site). */
  campaign?: { label: string; url: string }
  status?: string
  excerpt: string
  cover?: string
  spec: { label: string; value: string }[]
  overview: string
  challenge: string
  approach: string[]
  stack: string[]
  workflow: MediaItem[]
  results: MediaItem[]
}

// Tab/filter order: Ogilvy first (matches the grid order)
export const COMPANIES: Company[] = ['Ogilvy', 'Concept']

// "The Story of Us" is ONE campaign: the Cadbury Silk film plus the
// Zoya Akhtar-directed Disney-style 3D conversion app (ControlNet + style
// LoRA). Both deliverables live under this single project.
const ogilvyStoryOfUs: Project = {
  slug: 'ogilvy-cadbury-silk-story-of-us',
  title: 'Cadbury "The Story of Us" (Disney+ Hotstar · directed by Zoya Akhtar)',
  company: 'Ogilvy',
  role: 'AI Creative Technologist, Ogilvy',
  year: '2024',
  date: '2024-02-14',
  status: 'shipped',
  contribution: [
    'style lora training — sd 1.5 stack',
    'character consistency across cuts',
    'controlnet-guided conversion app',
    'shot iteration & refinement',
    'identity locks frame by frame',
  ],
  excerpt:
    'An animated brand film built frame-by-frame from open-source models: style LoRAs on the SD 1.5 stack, trained and re-trained until the story held. No Nano Banana. No Seedance. Just the GPU and the graph. The Zoya Akhtar-directed cuts also turned real couples into Disney-style 3D cartoon characters through a ControlNet-guided app, telecast on Disney+ Hotstar.',
  cover: 'media/ogilvy-cadbury-silk-story-of-us/cover.jpg',
  spec: [
    { label: 'client', value: 'disney+ hotstar (now jiohotstar)' },
    { label: 'director', value: 'zoya akhtar' },
    { label: 'base', value: 'sd 1.5 (open-source)' },
    { label: 'lora', value: 'style lora · own GPU' },
    { label: 'guide', value: 'controlnet image → disney 3d' },
    { label: 'year', value: '2024' },
    { label: 'engagement', value: 'ogilvy' },
  ],
  overview:
    'In 2024 the closed-source image and video models that make this kind of work look easy today did not exist. The Cadbury "The Story of Us" campaign for Disney+ Hotstar (now JioHotstar), directed by Zoya Akhtar, had to be made with open-source image models, an SD 1.5 stack running on my own GPU. My job was twofold: make a 20-second animated love story feel like one continuous reality instead of a thousand separate pictures, and turn a series of real love stories into a Disney-style 3D cartoon film with no shoot days and no animation studio. The way in was an app: style LoRA models on the SD 1.5 checkpoint with ControlNet models steering the generation, so an input image (a couple, a street, a kitchen) went through the app and came out as the same hand, same look, same world in Disney-style 3D. The film ran on Disney+ Hotstar.',
  challenge:
    'No model could hold a consistent look, palette or characters across scene after scene. Every frame was a fresh generation, so the story drifted by default. There was no repeatable "make it look the same" button. It had to be trained into the stack: style LoRA models that locked the film\u2019s visual language, tuned and re-tuned until the scenes held together. The 3D cartoon look also had to stay identical across every couple and every shot, and the app had to do the conversion without hand-tweaking each frame. Consistency here is a trained property, not a prompt. Every stylistic drift meant retraining or re-guiding, and the structure of the source image (who is where, what is held, how they look at each other) had to survive the style transfer, or the love story stopped reading.',
  approach: [
    'Trained style LoRA models on the SD 1.5 stack to lock the look, palette, character design and lighting, so generations stayed inside the story world.',
    'Built ControlNet-guided paths into the app so each source image kept its composition and gesture while the style LoRA redrew it as Disney-style 3D cartoon animation.',
    'Re-trained whenever a frame drifted: the LoRA is a moving target, not a one-shot fix; consistency is maintained, not applied.',
    'Swept frame sets across seeds and parameters until the sequence read as one film, and swept ControlNet weights across the campaign imagery (valentine frames included) until every conversion stayed inside the same story world.',
    'Assembled the shots into the final film and delivered the cut that went on air as part of the Disney+ Hotstar telecast.',
  ],
  stack: [
    'SD 1.5 (open-source)',
    'Style LoRA training',
    'ControlNet (composition + gesture guide)',
    'Image → Disney-style 3D conversion app',
    'Own local GPU',
    'Frame sweeps / parameter tuning',
    'Sequence assembly',
    'Disney+ Hotstar deliverable',
  ],
  workflow: [
    { label: 'style lora training runs' },
    { label: 'frame sweep, seeds × params' },
    { label: 'controlnet-guided app path' },
    { label: 'consistency check grids' },
    { label: 'shot assembly → final film' },
  ],
  results: [
    { kind: 'video', label: 'final film, the story of us (hotstar promo)', src: 'media/brands/cadbury-dairy-milk/film/story-of-us-cadbury-silk.mp4' },
    { kind: 'video', label: 'final film, "now" cut (1080p master)', src: 'media/brands/cadbury-dairy-milk/film/story-of-us-cadbury-silk-now.mp4' },
    { kind: 'video', label: 'story of us — valentine reel (sd 1.5 · controlnet)', src: 'media/ogilvy-cadbury-story-of-us-zoya-akhtar/story-of-us-valentines-reel.mp4' },
    { kind: 'image', label: 'story of us — valentine still 01', src: 'media/ogilvy-cadbury-story-of-us-zoya-akhtar/stills/vday_f1063.png' },
    { kind: 'image', label: 'story of us — valentine still 02', src: 'media/ogilvy-cadbury-story-of-us-zoya-akhtar/stills/vday_f1136.png' },
    { kind: 'image', label: 'story of us — valentine still 03', src: 'media/ogilvy-cadbury-story-of-us-zoya-akhtar/stills/vday_f1966.png' },
    { kind: 'image', label: 'story of us — valentine still 04', src: 'media/ogilvy-cadbury-story-of-us-zoya-akhtar/stills/vday_f2088.png' },
    { kind: 'image', label: 'story of us — valentine still 05', src: 'media/ogilvy-cadbury-story-of-us-zoya-akhtar/stills/vday_f2108.png' },
    { kind: 'image', label: 'story of us — valentine still 06', src: 'media/ogilvy-cadbury-story-of-us-zoya-akhtar/stills/vday_f2398.png' },
    { kind: 'image', label: 'story of us — valentine still 07', src: 'media/ogilvy-cadbury-story-of-us-zoya-akhtar/stills/vday_f2856.png' },
    { kind: 'image', label: 'story of us — valentine still 08', src: 'media/ogilvy-cadbury-story-of-us-zoya-akhtar/stills/vday_f3013.png' },
    { kind: 'image', label: 'story of us — valentine still 09', src: 'media/ogilvy-cadbury-story-of-us-zoya-akhtar/stills/vday_f3016.png' },
  ],
}

// Cadbury Celebrations "Creating Memories Never Clicked" — de-aging the
// grown-up characters through a ComfyUI image workflow (SDXL + de-aged LoRA
// + face swap). 60s Hindi film, uploaded 2024-08-05. YouTube-embedded.
const ogilvyCelebrations: Project = {
  slug: 'ogilvy-cadbury-celebrations-memories',
  title: 'Cadbury Celebrations, "Creating Memories Never Clicked"',
  company: 'Ogilvy',
  role: 'AI Creative Technologist, Ogilvy',
  year: '2024',
  date: '2024-08-05',
  status: 'shipped',
  contribution: [
    'ai image generation',
    'de-aged lora training',
    'face swap workflows',
    'identity drift checks',
    'shot iteration & refinement',
    'comfyui workflow development',
  ],
  campaign: { label: 'watch the public release — youtube', url: 'https://www.youtube.com/watch?v=-3d3akxcGKA' },
  excerpt:
    'The film is about the memories that were never clicked: the grown-up characters in the Cadbury Celebrations campaign were de-aged back to their younger selves. I built the image workflow in ComfyUI that did the de-aging, using SDXL checkpoints with a de-aged LoRA plus face swap workflows.',
  cover: 'media/ogilvy-cadbury-celebrations-memories/stills/cadbury-creating-memories-frame.png',
  spec: [
    { label: 'client', value: 'cadbury celebrations' },
    { label: 'base', value: 'sdxl (open-source)' },
    { label: 'lora', value: 'de-aged lora' },
    { label: 'route', value: 'face swap workflows' },
    { label: 'engine', value: 'comfyui image workflow' },
    { label: 'film', value: '60s · hindi' },
    { label: 'year', value: '2024' },
    { label: 'engagement', value: 'ogilvy' },
  ],
  overview:
    'Cadbury Celebrations ran the "Creating Memories Never Clicked" campaign: the kind of childhood moments that were never photographed, and the grown-up characters in the film were de-aged back to their younger selves. My part was the image workflow in ComfyUI that made those de-ages real: SDXL checkpoints with a de-aged LoRA, and face swap workflows that keep the adult\u2019s features recognizable in the child\u2019s face. The 60-second Hindi film ran with the campaign, and the character frames exist turn for turn as image workflow output.',
  challenge:
    'A de-aged face is only convincing if the identity survives the age shift. The same person has to read as the child and the grown-up, or the memory stops meaning anything. Off-the-shelf generations drift, so the de-aging had to be a trained and guided workflow: an SDXL checkpoint set the base look, a de-aged LoRA pulled the face younger, and face swap workflows re-fitted the original features onto the younger face, frame by frame, with every run checked for identity drift.',
  approach: [
    'Built the image workflow in ComfyUI around SDXL checkpoints so the base renders held a consistent, film-like look.',
    'Trained and applied a de-aged LoRA that shifts adult faces to their younger selves without losing the underlying identity.',
    'Wired face swap workflows into the graph so the de-aged face keeps the grown-up character\u2019s recognizable features.',
    'Swept seeds and workflow weights across the campaign frames until the de-aged characters held together across the film.',
    'Delivered the de-aged character imagery that went into the 60-second Cadbury Celebrations film on YouTube.',
  ],
  stack: [
    'ComfyUI',
    'SDXL checkpoints (open-source)',
    'De-aged LoRA',
    'Face swap workflows',
    'Image de-age pipeline',
    'Own local GPU',
    'Cadbury Celebrations deliverable',
  ],
  workflow: [
    { label: 'sdxl checkpoint base' },
    { label: 'de-aged lora' },
    { label: 'face swap workflow' },
    { label: 'image workflow in comfyui' },
    { label: 'identity check passes' },
  ],
  results: [
    {
      kind: 'video',
      label: 'cadbury celebrations — creating memories never clicked (60s · youtube)',
      src: 'https://youtu.be/-3d3akxcGKA',
    },
    {
      kind: 'image',
      label: 'de-aged frame — schoolyard scene',
      src: 'media/ogilvy-cadbury-celebrations-memories/stills/cadbury-creating-memories-frame.png',
    },
  ],
}

// Lacta Christmas AI — "Compartilhe o seu Natal": consumer uploads a photo
// and it becomes an AI avatar inside a shareable Christmas story. The
// campaign ran on Instagram (reel DDkB4SyxF5k, @ingridguimaraes, 2024-12-14).
const lactaChristmasAi: Project = {
  slug: 'lacta-christmas-ai-app',
  title: 'Lacta Christmas AI app — photo to avatar "Compartilhe o seu Natal"',
  company: 'Ogilvy',
  role: 'AI Creative Technologist, Ogilvy',
  year: '2024',
  date: '2024-12-14',
  status: 'shipped',
  contribution: [
    'ai image generation',
    'photo → ai avatar conversion',
    'identity-safe renders across faces',
    'seasonal look lock',
    'batch iteration & cleanup',
  ],
  campaign: { label: 'view the campaign reel — instagram', url: 'https://www.instagram.com/reel/DDkB4SyxF5k/' },
  excerpt:
    'For Lacta\u2019s Christmas campaign I created the images that drive the AI app: a consumer uploads a photo and it comes back as an AI avatar inside a personalised Christmas story, ready to share. The campaign itself ran as an Instagram reel and the app segment was the heart of it.',
  cover: 'media/lacta-christmas-ai-app/stills/lacta-christmas-ai-avatar.png',
  spec: [
    { label: 'client', value: 'lacta (mondelez)' },
    { label: 'campaign', value: 'compartilhe o seu natal' },
    { label: 'feature', value: 'photo → ai avatar + christmas story' },
    { label: 'engine', value: 'ai image workflow' },
    { label: 'season', value: 'christmas 2024' },
    { label: 'year', value: '2024' },
    { label: 'engagement', value: 'ogilvy' },
  ],
  overview:
    'Lacta wanted a Christmas experience people could make their own: upload a photo, and suddenly you are an AI avatar inside a Christmas story, shareable with friends and family. I created the images for the AI app behind it. Every upload had to come out as the same person inside the same warm Christmas world, and the app had to hold the look across hundreds of different faces.',
  challenge:
    'A stranger\u2019s photo lands in the app and has to become a believable avatar without any hand-tuning per user. The identity has to survive the avatar redraw, and the style has to feel like Lacta\u2019s Christmas: warm, festive, instantly shareable. Drift here is the failure mode, so the image workflow had to be repeatable and identity-safe by construction.',
  approach: [
    'Built the image workflow that converts a consumer photo into an AI avatar inside the Christmas story setting.',
    'Locked the seasonal look so every avatar sits in the same warm Christmas world, no matter who uploads.',
    'Kept the identity of the uploader: the avatar reads as the same person, not a generic face.',
    'Generated the campaign imagery for the app and the reel (the blue Lacta box, the festive studio and the "Compartilhe o seu Natal" app screens).',
    'Shipped the images that let the campaign run: upload the photo, get your avatar and your Christmas story, share it.',
  ],
  stack: [
    'AI image generation',
    'Avatar + identity workflow',
    'Seasonal style consistency',
    'Lacta Christmas campaign',
    'Instagram reel delivery',
  ],
  workflow: [
    { label: 'photo → ai avatar conversion' },
    { label: 'christmas story wrap' },
    { label: 'seasonal look lock' },
    { label: 'identity-safe renders' },
  ],
  results: [
    {
      kind: 'video',
      label: 'lacta christmas app — campaign reel (instagram)',
      src: 'https://www.instagram.com/reel/DDkB4SyxF5k/',
    },
    {
      kind: 'image',
      label: 'ai avatar frame — christmas moment',
      src: 'media/lacta-christmas-ai-app/stills/lacta-christmas-ai-avatar.png',
    },
  ],
}

// Natural Diamond Promotion Foundation — "History of Diamonds in India"
// timeline imagery: period scenes (1900 Surat workshop, 1950s-60s factory)
// generated with CLOSED-SOURCE image models for the ndpf.in timeline.
const ndpfHistoryOfDiamonds: Project = {
  slug: 'ndpf-history-of-diamonds',
  title: 'History of Diamonds in India — timeline imagery (NDPF)',
  company: 'Ogilvy',
  role: 'AI Creative Technologist, Ogilvy',
  year: '2026',
  date: '2026-07-30',
  status: 'shipped',
  contribution: [
    'historical photo prompting',
    'closed-source image models',
    'era look tuning',
    'timeline asset delivery',
  ],
  campaign: { label: 'see the timeline live — ndpf.in', url: 'https://ndpf.in' },
  excerpt:
    'For the Natural Diamond Promotion Foundation I created the visual world of the "History of Diamonds in India" timeline: the Golconda diamond at twilight, diamonds resting on the old trade map, river panning for alluvial stones, plus the 1900 Surat workshop and 1950s-60s factory scenes — generated with closed-source image models so the timeline reads like real archival photography.',
  cover: 'media/ndpf-history-of-diamonds/stills/ndpf-golconda-diamond-twilight.webp',
  spec: [
    { label: 'client', value: 'natural diamond promotion foundation' },
    { label: 'feature', value: 'history of diamonds in india timeline' },
    { label: 'engine', value: 'closed-source image models' },
    { label: 'route', value: 'era-correct historical imagery' },
    { label: 'year', value: '2026' },
    { label: 'engagement', value: 'ogilvy' },
  ],
  overview:
    'The NDPF website tells the story of how India became the diamond capital of the world. The timeline needed period pictures that do not exist in archives: two Patidar brothers cutting and polishing in 1900 Surat, then the first formal workshops of the 1950s-60s. I generated that imagery with closed-source image models, tuned until each frame reads like an authentic photograph from its era.',
  challenge:
    'Archival photos do not exist for these moments, and AI images of historical scenes tend to look modern or generic. Each frame had to stay inside its period: tools, clothing, workers, lighting and all, plus the right mood so the timeline feels like a real journey through India\u2019s diamond history.',
  approach: [
    'Created the timeline key visuals: a faceted diamond on black rock above the still water of Golconda, diamonds scattered across the old trade map, and a hand panning river gravel for alluvial diamonds.',
    'Used closed-source image models to produce the historical scenes for the timeline.',
    'Built the 1900 frame: two brothers from the Patidar community cutting and polishing diamonds in a Surat workshop after returning from South Africa.',
    'Built the 1950s-60s frame: the first formal diamond workshops, the factory rows that made Surat the world\u2019s largest cutting centre.',
    'Tuned era cues (wardrobe, workbenches, tone, grain) until each scene read as period photography, then delivered the timeline imagery shown on ndpf.in.',
  ],
  stack: [
    'Closed-source image models',
    'Era-correct historical styling',
    'Timeline asset production',
    'Natural Diamond Promotion Foundation deliverable',
  ],
  workflow: [
    { label: 'historical photo prompting' },
    { label: 'closed-source image models' },
    { label: 'era look tuning' },
    { label: 'timeline asset delivery' },
  ],
  results: [
    {
      kind: 'image',
      label: 'golconda era — diamond at twilight (key visual)',
      src: 'media/ndpf-history-of-diamonds/stills/ndpf-golconda-diamond-twilight.webp',
    },
    {
      kind: 'image',
      label: 'diamonds on the old trade map (key visual)',
      src: 'media/ndpf-history-of-diamonds/stills/ndpf-diamonds-old-trade-map.webp',
    },
    {
      kind: 'image',
      label: 'river panning for alluvial diamonds (key visual)',
      src: 'media/ndpf-history-of-diamonds/stills/ndpf-river-panning-alluvial.webp',
    },
    {
      kind: 'image',
      label: 'history of diamonds in india — timeline section (ndpf.in)',
      src: 'media/ndpf-history-of-diamonds/stills/ndpf-history-timeline.jpg',
    },
    {
      kind: 'image',
      label: 'history of diamonds — first discovery & ancient trade (ndpf.in)',
      src: 'media/ndpf-history-of-diamonds/stills/ndpf-timeline-first-discovery-trade.jpg',
    },
    {
      kind: 'image',
      label: 'history of diamonds — golconda era & 1665 (ndpf.in)',
      src: 'media/ndpf-history-of-diamonds/stills/ndpf-timeline-golconda-world-notices.jpg',
    },
  ],
}

// IFB Christmas 2025 — "Because some miracles do happen overnight": the
// Santa finger snap, generated open-source. The motion came from a capture
// of my own hand, driven through Wan Animate with a Santa hand reference.
const ogilvyIfbChristmas: Project = {
  slug: 'ogilvy-ifb-christmas-2025',
  title: 'IFB Christmas 2025 · the Santa finger snap (Wan Animate)',
  company: 'Ogilvy',
  role: 'AI Creative Technologist, Ogilvy',
  year: '2025',
  date: '2025-12-12',
  status: 'shipped',
  contribution: [
    'wan animate motion transfer',
    'own hand capture as the motion source',
    'santa hand reference setup',
    'finger snap generation + iteration',
    'closed-source model tests (veo 3 · kling 2)',
  ],
  campaign: { label: 'watch the film, ifb christmas 2025 (youtube)', url: 'https://youtu.be/ZmPFjsUXuCQ' },
  excerpt:
    'The IFB Christmas film "Because some miracles do happen overnight" is built around one tiny gesture: a finger snap. It was also the hardest shot to make. The top closed-source video models of the time, Google Veo 3 and Kling 2 among them, could not generate a natural snap. So I recorded my own hand performing the snap and drove it through Wan Animate with a Santa hand reference image, until the gesture read real. The side-by-side shows the hand capture against the generated Santa hand.',
  cover: 'media/ogilvy-ifb-christmas-2025/cover.jpg',
  spec: [
    { label: 'client', value: 'ifb appliances' },
    { label: 'film', value: 'because some miracles do happen overnight' },
    { label: 'moment', value: 'the santa finger snap' },
    { label: 'engine', value: 'wan animate · open-source' },
    { label: 'motion source', value: 'own hand capture' },
    { label: 'failed first', value: 'veo 3 · kling 2' },
    { label: 'engagement', value: 'ogilvy' },
  ],
  overview:
    'Every IFB Christmas film is built on a small piece of magic, and in "Because some miracles do happen overnight" that magic is a finger snap: the gesture that brings the house to life and sets the appliances working while everyone sleeps. The shot is a few seconds of screen time, but it had to read as a real hand doing a real snap, with the release landing exactly on the beat. I built it open-source end to end: my own hand performed the gesture on camera, Wan Animate carried that motion onto a Santa hand, and the snap that landed in the film came out of this pipeline.',
  challenge:
    'A finger snap is one of the hardest micro-actions to get right. It lives in a fraction of a second: the press, the slip, the release, and a sound that has to line up with what the eye sees. The top closed-source video models of the moment, Google Veo 3 and Kling 2 among them, all failed to produce a natural snap. It was also the era before Seedream 2.5 and MiniMax H3. The gesture had to come from somewhere real, and the route that delivered was open-source with a real reference motion.',
  approach: [
    'Recorded my own hand performing the finger snap, so the tension and timing of the gesture were real.',
    'Took that capture into Wan Animate as the motion source and used a Santa hand as the reference image.',
    'Ran the shot through the top closed-source video models first, Google Veo 3 and Kling 2 among them, and none of them gave a natural snap.',
    'Iterated the generation until the Santa hand pressed, released and settled like a real snap, with the release landing where the film needed it.',
    'The generated snap landed in the IFB Christmas 2025 film, with the pipeline staying open-source from capture to delivery.',
  ],
  stack: [
    'Wan Animate (open-source)',
    'Own hand capture (motion source)',
    'Santa hand reference image',
    'Finger snap generation',
    'Open-source-first pipeline',
    'IFB Christmas 2025 film deliverable',
  ],
  workflow: [
    { label: 'own hand capture · the snap performed for real' },
    { label: 'santa hand reference image' },
    { label: 'wan animate · motion transfer' },
    { label: 'snap iteration until natural' },
    { label: 'snap lands in the ifb christmas film' },
  ],
  results: [
    { kind: 'video', label: 'ifb christmas 2025 · "because some miracles do happen overnight" (youtube)', src: 'https://youtu.be/ZmPFjsUXuCQ', poster: 'media/ogilvy-ifb-christmas-2025/video/ad-poster.jpg' },
    { kind: 'video', label: 'finger snap · hand capture vs wan animate (side by side)', src: 'media/ogilvy-ifb-christmas-2025/video/finger-snap-comparison.mp4', poster: 'media/ogilvy-ifb-christmas-2025/video/finger-snap-comparison-poster.jpg' },
    { kind: 'video', label: 'hand capture · full clip', src: 'media/ogilvy-ifb-christmas-2025/video/hand-capture.mp4', poster: 'media/ogilvy-ifb-christmas-2025/video/hand-capture-poster.jpg' },
    { kind: 'video', label: 'wan animate · full clip', src: 'media/ogilvy-ifb-christmas-2025/video/wan-animate-santa.mp4', poster: 'media/ogilvy-ifb-christmas-2025/video/wan-animate-santa-poster.jpg' },
  ],
}

// "Futuristic Neon Chase" — self-directed concept: environment and camera
// built in Blender with the agent driving it over MCP, clay render pass as
// the motion guide, then a Seedance 2.5 motion-to-video render on top.
const conceptNeonChase: Project = {
  slug: 'futuristic-neon-chase',
  title: 'Futuristic Neon Chase · MCP Blender env → Seedance 2.5',
  company: 'Concept',
  role: 'AI Creative Technologist',
  year: '2026',
  date: '2026-09-09',
  status: 'concept',
  contribution: [
    'environment + camera built in Blender via MCP',
    'clay render pass as the motion guide',
    'seedance 2.5 motion-to-video render',
    'side-by-side comparison master',
    'timing + framing checks across both passes',
  ],
  excerpt:
    'A neon chase built in two passes: the environment, rider and camera path were made in Blender with the agent driving it over MCP and baked to a clean clay render, then Seedance 2.5 turned that pass into the final cinematic motion picture. The two videos sit side by side so the geometry work and the generated film can be judged against each other.',
  cover: 'media/futuristic-neon-chase/cover.jpg',
  spec: [
    { label: 'environment', value: 'blender · built via MCP' },
    { label: 'guide', value: 'clay render pass · 1280×720' },
    { label: 'engine', value: 'seedance 2.5 · motion to video' },
    { label: 'output', value: '1280×720 · 30s' },
    { label: 'comparison', value: 'side-by-side master · 30s' },
    { label: 'year', value: '2026' },
  ],
  overview:
    'A self-directed experiment in the open-source-first, closed-source-when-it-fits lane: build the whole chase in Blender (city street, rider, bike, camera path) with the agent driving Blender over MCP, render a clean clay geometry pass, then let Seedance 2.5 re-imagine that pass as the final film: neon-lit night city, wet asphalt, bloom, depth of field. Since the clay pass has no materials or atmosphere, the generated video has to invent the entire look while keeping the camera motion and composition of the render.',
  challenge:
    'The clay pass is flat and untextured: no lights, no reflections, no atmosphere. Seedance 2.5 has to hallucinate all of it from a gray geometry reference, and the result has to stay true to the chase: same direction, same speed, same framing. Both passes run 30 seconds, so the side-by-side comparison had to be synced start to end and checked for timing and framing drift.',
  approach: [
    'Built the environment (street, buildings, rider and bike) and the camera path in Blender with the agent driving it over MCP, iterating until the composition read as a chase.',
    'Rendered a clean clay geometry pass as the motion guide, so the generated film had a stable reference for speed, direction and framing.',
    'Pushed the clay pass into Seedance 2.5 motion-to-video and steered the look to a neon night city: wet asphalt, bloom, shallow depth of field.',
    'Rendered the side-by-side comparison master so the input pass and the generated film can be watched against each other.',
  ],
  stack: [
    'Blender (driven over MCP)',
    'Clay render pass',
    'Seedance 2.5 (motion-to-video, closed-source)',
    'Side-by-side comparison master',
  ],
  workflow: [
    { label: 'blender env + camera path · MCP' },
    { label: 'clay render pass' },
    { label: 'seedance 2.5 motion to video' },
    { label: 'comparison master + timing checks' },
  ],
  results: [
    { kind: 'video', label: 'side-by-side comparison · clay vs seedance 2.5', src: 'media/futuristic-neon-chase/video/side-by-side-comparison.mp4', poster: 'media/futuristic-neon-chase/video/side-by-side-comparison-poster.jpg' },
    { kind: 'video', label: 'blender clay pass · mcp environment', src: 'media/futuristic-neon-chase/video/blender-clay-motion.mp4' },
    { kind: 'video', label: 'seedance 2.5 · final neon chase', src: 'media/futuristic-neon-chase/video/seedance-25-neon-chase.mp4' },
    { kind: 'image', label: 'neon chase · key frame', src: 'media/futuristic-neon-chase/stills/neon-chase-frame.jpg' },
    { kind: 'image', label: 'blender clay · key frame', src: 'media/futuristic-neon-chase/stills/blender-clay-frame.jpg' },
  ],
}

// Happydent White gum concept ad: my own concept + ad idea, generated with
// Seedance 2.5, directed and edited by me. Ends on the lights-out line and
// the packshot.
const conceptHappydentWhiteGum: Project = {
  slug: 'concept-happydent-white-gum',
  title: 'Happydent White gum · concept ad (Seedance 2.5)',
  company: 'Concept',
  role: 'AI Creative Technologist',
  year: '2026',
  date: '2026-08-16',
  status: 'concept',
  contribution: [
    'original concept + ad idea',
    'direction',
    'seedance 2.5 generation',
    'edit + 32s cut',
    'packshots + taglines',
  ],
  excerpt:
    'My own concept and ad idea for Happydent White: a school annual-day performance where the lights go out and the smiles stay on. The imagery is generated with Seedance 2.5, and the film is directed and edited by me, down to the final packshot and its line: bright white. bright moments.',
  cover: 'media/concept-happydent-white-gum/cover.jpg',
  spec: [
    { label: 'brand', value: 'happydent white · mint flavour' },
    { label: 'idea', value: 'own concept + ad idea' },
    { label: 'engine', value: 'seedance 2.5' },
    { label: 'craft', value: 'directed + edited by me' },
    { label: 'output', value: '1920×1080 · 32s' },
    { label: 'year', value: '2026' },
  ],
  overview:
    'A concept ad for Happydent White built on the simplest promise of a white gum: brightness, made literal. The film runs through one evening at a school annual-day show: a forest-set stage play, the audience watching, a young man and his packet of Happydent White, and the moment the lights go out. The film does not go dark with them: a smile turns into a blinding white light and carries the show to its close, then the pack lands twice. "When the lights go out, keep your smile on." "Bright white. Bright moments."',
  challenge:
    'Two things make or break a 32 second film like this. Continuity: the stage, the audience and the hero all have to feel like one venue on one evening, even though every shot is generated separately. And the signature: a smile becoming an actual light source. That single frame is the whole ad, and it has to read instantly, in the dark, before the pack arrives to explain it.',
  approach: [
    'Wrote the concept and the ad idea: an annual-day show where the lights go out and the gum keeps the smiles bright.',
    'Directed the film as one continuous evening: the stage play, the audience, the young man and his gum, and the dark passage where the lights drop.',
    'Generated all the imagery with Seedance 2.5, steering the look somewhere between real venue footage and stage light.',
    'Landed the signature shot: the smile that goes blinding white, turning the product promise into the light source of the film.',
    'Edited the 32 second cut to finish on the two packshots: the lights-out line, then bright white. bright moments.',
  ],
  stack: [
    'Own concept + ad idea',
    'Seedance 2.5 (text-to-video, closed-source)',
    'Edit + 32s cut (own work)',
    '1920×1080 master',
  ],
  workflow: [
    { label: 'own concept + ad idea' },
    { label: 'seedance 2.5 generation' },
    { label: 'direction · one venue, one evening' },
    { label: 'edit + 32s cut' },
    { label: 'packshots + taglines' },
  ],
  results: [
    { kind: 'video', label: 'happydent white gum · concept film (32s)', src: 'media/showcase/ads/happydent-white-gum-concept.mp4', poster: 'media/showcase/ads/happydent-white-gum-concept-poster.jpg' },
    { kind: 'image', label: 'the signature · a smile that lights the dark', src: 'media/concept-happydent-white-gum/stills/the-glow.jpg' },
    { kind: 'image', label: 'the unwrap · happydent white packet', src: 'media/concept-happydent-white-gum/stills/the-gum-moment.jpg' },
    { kind: 'image', label: 'the audience · one evening at the show', src: 'media/concept-happydent-white-gum/stills/audience-reaction.jpg' },
    { kind: 'image', label: 'the dark passage · mid-film', src: 'media/concept-happydent-white-gum/stills/the-dark-beat.jpg' },
    { kind: 'image', label: 'the stage · annual-day performance', src: 'media/concept-happydent-white-gum/stills/the-stage-show.jpg' },
    { kind: 'image', label: 'end card · when the lights go out... keep your smile on', src: 'media/concept-happydent-white-gum/stills/end-card.jpg' },
    { kind: 'image', label: 'final packshot · bright white. bright moments.', src: 'media/concept-happydent-white-gum/stills/final-packshot.jpg' },
  ],
}

// 7up concept ad: my own original idea, generated with Seedance 2.5. A
// colour-drained wasteland flips to a bright future city after one sip.
const concept7up: Project = {
  slug: 'concept-7up',
  title: '7up · concept ad (Seedance 2.5)',
  company: 'Concept',
  role: 'AI Creative Technologist',
  year: '2026',
  date: '2026-09-13',
  status: 'concept',
  contribution: [
    'original concept + ad idea',
    'seedance 2.5 generation',
    'dull-world → bright-city turn',
  ],
  excerpt:
    'My own original idea for a 7up concept ad: a colour-drained wasteland under a weathered 7up billboard that promises no more dull moments, one bottle, one first sip, and the whole world snaps into colour. Generated with Seedance 2.5.',
  cover: 'media/concept-7up/cover.jpg',
  spec: [
    { label: 'brand', value: '7up' },
    { label: 'idea', value: 'own original concept' },
    { label: 'engine', value: 'seedance 2.5' },
    { label: 'output', value: '1280×720 · 30s' },
    { label: 'year', value: '2026' },
  ],
  overview:
    'A concept ad for 7up built on the brand promise of brightness. The film opens in a colour-drained wasteland: dust, ruins, a world of dull moments. A weathered 7up billboard stands over it, promising "no more dull moments", and the story is the simplest possible arc from there: a bottle of 7up, one first sip, and the world snapping into colour. By the close, the ruins have become a bright, optimistic future city, and the 7up mascot is waiting at the end of the street.',
  challenge:
    'The whole film hangs on one turn: sepia to colour. The wasteland has to feel genuinely dead, drained and lived-in, and the transformation has to land as pure refreshment in a single beat, or the ad does not work. Every frame was generated, so the wasteland, the billboard, the drink and the future city all had to read as one world on either side of that turn: same places, same faces, one sip apart.',
  approach: [
    'Wrote the concept around the billboard line: a world of dull moments that 7up turns bright.',
    'Built the wasteland look first: desaturated sepia, dust, ruins, a figure walking through it, so the billboard reads as a promise.',
    'Generated the film with Seedance 2.5: the discovery of the billboard, the bottle in the dust, the first sip, and the world switching to colour.',
    'Staged the new world as an optimistic future city: glass towers, greenery, and the 7up mascot waiting at the end.',
  ],
  stack: [
    'Own original concept + ad idea',
    'Seedance 2.5 (text-to-video, closed-source)',
    '1280×720 · 30s master',
  ],
  workflow: [
    { label: 'own original idea' },
    { label: 'seedance 2.5 generation' },
    { label: 'wasteland → bright future city' },
    { label: 'billboard + tagline · no more dull moments' },
    { label: '30s concept film' },
  ],
  results: [
    { kind: 'video', label: '7up · concept film (30s)', src: 'media/showcase/ads/7up-concept.mp4', poster: 'media/showcase/ads/7up-concept-poster.jpg' },
    { kind: 'image', label: 'the dull world · opening', src: 'media/concept-7up/stills/the-dull-world.jpg' },
    { kind: 'image', label: 'the discovery · under the billboard', src: 'media/concept-7up/stills/the-discovery.jpg' },
    { kind: 'image', label: 'the bottle · in the dust', src: 'media/concept-7up/stills/the-bottle.jpg' },
    { kind: 'image', label: 'the first sip', src: 'media/concept-7up/stills/the-first-sip.jpg' },
    { kind: 'image', label: 'the turn · the world goes bright', src: 'media/concept-7up/stills/the-turn.jpg' },
    { kind: 'image', label: 'the city · 7up-bright future', src: 'media/concept-7up/stills/the-city.jpg' },
    { kind: 'image', label: 'sign-off · with the 7up mascot', src: 'media/concept-7up/stills/the-sign-off.jpg' },
  ],
}

// Grid order = array order. Keep Ogilvy projects first.
export const projects: Project[] = [ogilvyStoryOfUs, ogilvyCelebrations, lactaChristmasAi, ndpfHistoryOfDiamonds, ogilvyIfbChristmas, conceptHappydentWhiteGum, concept7up, conceptNeonChase]

// Case-study display order: NEWEST FIRST by `date` (exact when known, else
// the year). Ties keep the original array order, so same-date entries slot
// in without jumps. Any new project added with a `date` sorts itself in.
export const projectsByDate: Project[] = [...projects].sort(
  (a, b) => {
    const ka = a.date ?? `${a.year}-01-01`
    const kb = b.date ?? `${b.year}-01-01`
    if (ka === kb) return projects.indexOf(a) - projects.indexOf(b)
    return ka < kb ? 1 : -1
  }
)

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug)

export const byCompany = (company: Company) =>
  projects.filter((p) => p.company === company)
