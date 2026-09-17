// ---------------------------------------------------------------------------
// ComfyUI workflows — dedicated home section ("04 / workflows").
// Screen recordings of the pipelines I build and run locally, plus outputs.
//
// HOW TO ADD MEDIA:
//   1. Drop files into  public/media/workflows/  (see README.md):
//        *.mp4|webm                   — workflow screen recordings
//        *.jpg|png                    — outputs / stills
//   2. Fill `src` below. Empty src renders an intentional placeholder.
//
// OUTPUTS ARE ATTACHED, NEVER SEPARATE: a run's result image lives in the
// `output` field of its video item — small thumbnail on the tile, shown next
// to the video in the lightbox. Do NOT add output images as their own tiles
// (user requirement 2026-09-15).
// ---------------------------------------------------------------------------

import type { MediaItem } from './projects'

export interface WorkflowOutput {
  src: string
  label?: string
}

export interface WorkflowItem extends MediaItem {
  id: string // wfN — wf1, wf2, … (video or image)
  title: string
  note?: string
  /** Image produced by this run — attached to the video tile + lightbox. */
  output?: WorkflowOutput
}

export const WORKFLOWS: WorkflowItem[] = [
  {
    id: 'wf3',
    title: 'comfyui relight workflow · flux.2 klein',
    kind: 'video',
    poster: 'media/workflows/flux2-klein-relight-poster.jpg',
    label: 'comfyui relight workflow · screen recording + output (flux.2 klein)',
    note: "Screen recording of my ComfyUI relight workflow running FLUX.2 klein — drops a subject onto any background and generates matching shadows and lighting for it (example: a perfume bottle relit onto driftwood). Final still attached.",
    src: 'media/workflows/flux2-klein-relight.mp4',
    output: {
      src: 'media/workflows/flux2-klein-relight-output.jpg',
      label: 'final still · produced by this run',
    },
  },
  {
    id: 'wf2',
    title: 'comfyui image-edit workflow · qwen-image-edit 2511',
    kind: 'video',
    poster: 'media/workflows/qwen-image-edit-2511-poster.jpg',
    label: 'comfyui image-edit workflow · screen recording (qwen-image-edit 2511)',
    note: "Screen recording of my ComfyUI instruction-edit workflow running Qwen-Image-Edit 2511 — a multi-reference edit ('change image1 bed sheet color to navy blue'), 5-step euler at 2048x1536, then upscaled.",
    src: 'media/workflows/qwen-image-edit-2511.mp4',
  },
  {
    id: 'wf1',
    title: 'comfyui clothes-swap workflow · qwen-image-edit',
    kind: 'video',
    poster: 'media/workflows/comfyui-clothes-swap-poster.jpg',
    label: 'comfyui clothes-swap workflow · screen recording + output',
    note: 'Screen recording of my ComfyUI clothes-swap workflow, built on Qwen-Image-Edit with reference conditioning — with the lookbook it produced attached.',
    src: 'media/workflows/comfyui-clothes-swap.mp4',
    output: {
      src: 'media/workflows/comfyui-clothes-swap-output.jpg',
      label: 'lookbook output · produced by this run',
    },
  },
]

// Newest first — prepend new entries at the top.
