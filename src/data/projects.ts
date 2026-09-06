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

export type Company = 'cleanDirty.ai' | 'Ogilvy'

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

// Tab/filter order: Ogilvy first, cleanDirty.ai last (matches the grid order)
export const COMPANIES: Company[] = ['Ogilvy', 'cleanDirty.ai']

const ogilvyH3: Project = {
  slug: 'ogilvy-h3-ad-films',
  title: 'AI-native ad films — MiniMax H3 pipeline',
  company: 'Ogilvy',
  role: 'AI Creative Technologist (Group Account)',
  year: '2025',
  status: 'ongoing',
  excerpt:
    'Short-form ad films produced end-to-end on an open-source ComfyUI pipeline — no shoot days, consistent talent, batch-rendered and tuned per shot.',
  cover: '/media/ogilvy-h3-ad-films/cover.jpg',
  spec: [
    { label: 'base', value: 'minimax h3' },
    { label: 'route', value: 'ref2v · i2v' },
    { label: 'sampler', value: 'dpmpp_sde_gpu' },
    { label: 'steps', value: '20' },
    { label: 'res', value: '1024×576' },
    { label: 'clip', value: '~20s' },
  ],
  overview:
    'The campaign needed several short ad films with the same product and the same faces, on a timeline where conventional shoots were not an option. I built the production line instead: a ComfyUI graph that takes a brief, renders film-length clips, and keeps identity locked shot after shot.',
  challenge:
    'Every edit of the script meant re-shooting or re-cutting — days per cycle. Faces drifted between frames with off-the-shelf generation, and no model could hold a 20-second story arc with a consistent hero.',
  approach: [
    'Designed a ComfyUI pipeline around MiniMax H3 with a ref2v (reference-to-video) route so the first frame and brand references seed every clip.',
    'Locked character identity with a custom subject LoRA so the same face survives across shots, re-encodes and upscales.',
    'Split sampling strategy per shot: one sampler tuned for motion-per-minute, another for frame sharpness — each shot gets its own routing.',
    'Automated batch A/B sweeps over seeds and steps, and drove the queue programmatically so renders run while the team reviews stills.',
  ],
  stack: [
    'ComfyUI',
    'MiniMax H3 (ref2v / i2v)',
    'Subject LoRA',
    'Latent upscalers + Topaz',
    'Batch seed sweeps',
    'Queue automation',
  ],
  workflow: [
    { label: 'ref2v main graph' },
    { label: 'sampler A/B route — motion vs sharpness' },
    { label: 'extend · shot-to-shot continuity' },
    { label: 'upscale + keyframe pass' },
  ],
  results: [
    { kind: 'video', label: 'finished spot — hero shot' },
    { kind: 'video', label: 'finished spot — product macro' },
    { kind: 'image', label: 'identity check — frame grid' },
  ],
}

const cleanDirtyLora: Project = {
  slug: 'cleandirty-character-loras',
  title: 'Character identity system — custom subject LoRAs',
  company: 'cleanDirty.ai',
  role: 'AI Head Artist',
  year: '2024',
  excerpt:
    'Campaigns where the same face must appear in dozens of frames. I built the dataset-to-deploy LoRA pipeline that keeps identity consistent across an entire shoot.',
  cover: '/media/cleandirty-character-loras/cover.jpg',
  spec: [
    { label: 'base', value: 'ideogram 4' },
    { label: 'lora', value: 'rank 32' },
    { label: 'steps', value: '2000' },
    { label: 'captions', value: 'json' },
    { label: 'dataset', value: '~30 imgs' },
  ],
  overview:
    'Text-to-image alone drifts: the same person looks different every generation. For campaigns that needed one face across dozens of frames, I trained custom subject LoRAs and made the process repeatable enough for fast-changing briefs.',
  challenge:
    'No consistent identity across frames; short brief cycles meant retraining had to be cheap; caption quality decided everything but was slow and inconsistent by hand.',
  approach: [
    'Curated tight training datasets (10–30 varied images) with JSON captions that describe what changes between images while keeping the trigger word constant.',
    'Scrubbed dataset captions of celebrity/known identities so training runs cleared platform filters without masking the subject.',
    'Trained on Ideogram 4 with 2000-step runs — the sweet spot for identity without overfitting — and quantified before/after with 10 test images across varied seeds.',
    'Shipped a handoff ritual: LoRA to ComfyUI loras, to the training output folder, and to the project test folder, so any teammate can pull the same identity.',
  ],
  stack: [
    'Ideogram 4',
    'LoRA training',
    'Dataset curation',
    'JSON captioning',
    'A/B seed testing',
    'DiffSynth tooling',
  ],
  workflow: [
    { label: 'dataset prep — captions + trigger discipline' },
    { label: 'training config — 2000 steps, rank 32' },
    { label: 'test render — 10 images, varied seeds' },
    { label: 'deploy — loras folder + trained data folder' },
  ],
  results: [
    { kind: 'image', label: 'identity grid — trained output' },
    { kind: 'image', label: 'campaign frame set' },
    { kind: 'video', label: 'animated spot using the LoRA' },
  ],
}

const cleanDirtyMocap: Project = {
  slug: 'cleandirty-video-motion',
  title: 'Video-to-motion pipeline — footage to animate rigs',
  company: 'cleanDirty.ai',
  role: 'AI Head Artist',
  year: '2024',
  excerpt:
    'Recorded action footage turned into clean motion data: computer-vision mocap, cleaned in Studio, pushed straight into Blender rigs.',
  cover: '/media/cleandirty-video-motion/cover.jpg',
  spec: [
    { label: 'source', value: 'fight footage' },
    { label: 'tracking', value: 'rokoko vision (CV)' },
    { label: 'clean', value: 'rokoko studio' },
    { label: 'out', value: 'blender rigs' },
    { label: 'pipeline', value: 'video → mocap → rig' },
  ],
  overview:
    'A production needed believable action that no stock library had. Instead of motion capture hardware, I built a pipeline that lifts motion from existing footage using computer vision, then cleans and retargets it into Blender.',
  challenge:
    'No mocap hardware on site; raw CV output is jittery and unusable in a render; retargeting to rigs is usually a manual, per-shot chore.',
  approach: [
    'Used Rokoko Vision to extract motion from recorded fight footage into animation data.',
    'Cleaned and smoothed the captures in Rokoko Studio — joint offsets, drifting feet, clipped arcs.',
    'Pushed clean motion to Blender rigs via a scripted bridge, making the pipeline repeatable for new shots.',
  ],
  stack: [
    'Rokoko Vision',
    'Rokoko Studio',
    'Blender + rigs',
    'CV / pose extraction',
  ],
  workflow: [
    { label: 'footage → Rokoko Vision capture' },
    { label: 'Studio cleanup — jitter removal' },
    { label: 'Blender retarget bridge' },
  ],
  results: [
    { kind: 'video', label: 'animated result using extracted motion' },
    { kind: 'image', label: 'rig check — cleaned capture' },
  ],
}

// Grid order = array order. Keep Ogilvy projects first, cleanDirty.ai last.
export const projects: Project[] = [ogilvyH3, cleanDirtyLora, cleanDirtyMocap]

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug)

export const byCompany = (company: Company) =>
  projects.filter((p) => p.company === company)
