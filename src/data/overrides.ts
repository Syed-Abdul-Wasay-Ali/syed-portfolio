// ---------------------------------------------------------------------------
// Content override layer (admin v2).
//
// Pure functions that merge the runtime content.json layer onto the compiled
// data (projects / brands / showcase / workflows): every editable word
// resolves through text keys, every media list merges admin additions and
// honours removedMedia. Pages and components call the use* hooks; the admin
// panel uses the pure functions to show the same effective values.
// ---------------------------------------------------------------------------
import {
  getProject,
  projectsByDate,
  type MediaItem,
  type Project,
} from './projects'
import { orderedBrands, displayBrands, getBrand, type Brand } from './brands'
import { SHOWCASE, type ShowcaseItem } from './showcase'
import { WORKFLOWS, type WorkflowItem } from './workflows'
import { tx, txl, useRuntime, type RunContent } from './runtime'
import { pk, bk, sck, wfk, collKey } from './text'

type T = Record<string, string | string[]> | undefined

// ---------------------------------------------------------------------------
// option() — nullable field override: undefined (no override) keeps the
// compiled value (possibly undefined); a string override wins even when ''.
// ---------------------------------------------------------------------------
const opt = (texts: T, key: string, cur: string | undefined): string | undefined => {
  const v = texts?.[key]
  return typeof v === 'string' ? v : cur
}

const listOpt = (texts: T, key: string, cur: string[] | undefined): string[] | undefined => {
  const v = texts?.[key]
  return Array.isArray(v) ? v.map(String) : cur
}

// ---------------------------------------------------------------------------
// Media merge: additions lead, then base items minus removedMedia.
// ---------------------------------------------------------------------------
export function mediaFiltered(content: RunContent | null, items: MediaItem[]): MediaItem[] {
  const removed = new Set(content?.removedMedia ?? [])
  return items.filter((m) => !removed.has(m.src ?? m.label ?? ''))
}

export function additionsFor(content: RunContent | null, coll: string): MediaItem[] {
  return content?.additions?.[coll] ?? []
}

export function projectResults(content: RunContent | null, p: Project): MediaItem[] {
  const add = additionsFor(content, collKey.projectResults(p.slug))
  const removed = new Set(content?.removedMedia ?? [])
  const base = p.results.filter((m) => !removed.has(m.src ?? m.label ?? ''))
  return [...add, ...base]
}

// ---------------------------------------------------------------------------
// Project override
// ---------------------------------------------------------------------------
export function ovProject(content: RunContent | null, p: Project): Project {
  const texts = content?.texts as T
  const T = (f: string, fb = '') => tx(texts, pk(p.slug, f), fb)
  const s = p.slug
  const ov = (f: string) => texts?.[pk(s, f)]
  const removedSet = new Set(content?.removedMedia ?? [])

  const production = p.production
    ? {
        objective: T('production.objective', p.production.objective),
        input: T('production.input', p.production.input),
        process: T('production.process', p.production.process),
        control: T('production.control', p.production.control),
        refinement: T('production.refinement', p.production.refinement),
        output: T('production.output', p.production.output),
      }
    : undefined

  const results = [
    ...additionsFor(content, collKey.projectResults(s)),
    ...p.results.map((m, i) => ({
      ...m,
      label: opt(texts, pk(s, `res.${i}.label`), m.label),
    })),
  ].filter((m) => !new Set(content?.removedMedia ?? []).has(m.src ?? ''))

  const subOv = ov('subtitle')
  const stOv = ov('status')
  const chOv = ov('chain')

  return {
    ...p,
    title: T('title', p.title),
    subtitle: typeof subOv === 'string' ? subOv : p.subtitle,
    role: T('role', p.role),
    year: T('year', p.year),
    status: typeof stOv === 'string' ? stOv : p.status,
    excerpt: T('excerpt', p.excerpt),
    overview: T('overview', p.overview),
    challenge: T('challenge', p.challenge),
    chain: typeof chOv === 'string' ? chOv : p.chain,
    cover: removedSet.has(p.cover ?? '') ? undefined : p.cover,
    heroSrc: removedSet.has(p.heroSrc ?? '') ? undefined : p.heroSrc,
    contribution: listOpt(texts, pk(s, 'contribution'), p.contribution),
    campaign: p.campaign
      ? {
          label: T('campaign.label', p.campaign.label),
          url: T('campaign.url', p.campaign.url),
        }
      : p.campaign,
    spec: p.spec.map((row, i) => ({
      label: T(`spec.${i}.label`, row.label),
      value: T(`spec.${i}.value`, row.value),
    })),
    approach: txl(texts, pk(s, 'approach'), p.approach),
    stack: txl(texts, pk(s, 'stack'), p.stack),
    workflow: p.workflow.map((w, i) => ({
      ...w,
      label: opt(texts, pk(s, `workflow.${i}.label`), w.label),
    })),
    results,
    production,
    stages: p.stages
      ? p.stages
          .map((st, i) => ({
            ...st,
            label: opt(texts, pk(s, `stage.${i}.label`), st.label),
          }))
          .filter((st) => !removedSet.has(st.src ?? ''))
      : p.stages,
    beforeAfter: (() => {
      const ba = p.beforeAfter
      if (!ba) return undefined
      const beforeRemoved = removedSet.has(ba.before.src ?? '')
      const afterRemoved = removedSet.has(ba.after.src ?? '')
      if (beforeRemoved && afterRemoved) return undefined
      return {
        ...ba,
        annotations: listOpt(texts, pk(s, 'ba.annotations'), ba.annotations),
        before: {
          ...ba.before,
          label: opt(texts, pk(s, 'ba.before.label'), ba.before.label),
          src: beforeRemoved ? undefined : ba.before.src,
        },
        after: {
          ...ba.after,
          label: opt(texts, pk(s, 'ba.after.label'), ba.after.label),
          src: afterRemoved ? undefined : ba.after.src,
        },
      }
    })(),
    formats: p.formats
      ? p.formats
          .map((f, i) => ({
            ...f,
            label: T(`fmt.${i}.label`, f.label),
            note: opt(texts, pk(s, `fmt.${i}.note`), f.note),
          }))
          .filter((f) => !removedSet.has(f.src ?? ''))
      : p.formats,
    placements: p.placements
      ? p.placements
          .map((pl, i) => ({
            ...pl,
            label: T(`pl.${i}.label`, pl.label),
            note: opt(texts, pk(s, `pl.${i}.note`), pl.note),
          }))
          .filter((pl) => !removedSet.has(pl.src ?? ''))
      : p.placements,
  }
}

// ---------------------------------------------------------------------------
// Brand override
// ---------------------------------------------------------------------------
export function ovBrand(content: RunContent | null, b: Brand): Brand {
  const texts = content?.texts as T
  const removedSet = new Set(content?.removedMedia ?? [])
  return {
    ...b,
    name: tx(texts, bk(b.slug, 'name'), b.name),
    note: tx(texts, bk(b.slug, 'note'), b.note),
    story: opt(texts, bk(b.slug, 'story'), b.story),
    logo: removedSet.has(b.logo ?? '') ? undefined : b.logo,
  }
}

// brand galleries with runtime layer: uploads + additions lead, then base
// items minus removedItems (legacy per-brand hides) and removedMedia.
export function ovBrandItems(
  content: RunContent | null,
  slug: string,
  section: 'stills' | 'animatics' | 'films',
  items: MediaItem[],
): MediaItem[] {
  const removedLegacy = new Set(content?.removedItems?.[slug]?.[section] ?? [])
  const removed = new Set(content?.removedMedia ?? [])
  const keep = items.filter(
    (m) => !removedLegacy.has(m.src ?? m.label ?? '') && !removed.has(m.src ?? m.label ?? ''),
  )
  return [...(content?.uploads?.[slug]?.[section] ?? []), ...keep]
}

// ---------------------------------------------------------------------------
// Showcase / workflows overrides
// ---------------------------------------------------------------------------
export function ovShowcase(content: RunContent | null, items: ShowcaseItem[]): ShowcaseItem[] {
  const texts = content?.texts as T
  const removed = new Set(content?.removedMedia ?? [])
  const add = additionsFor(content, collKey.showcase)
  const merged: ShowcaseItem[] = [
    ...add.map((m, i) => ({
      id: `add-${i}`,
      title: m.label ?? 'new piece',
      tag: 'image' as const,
      ...m,
    })),
    ...items,
  ]
  return merged
    .filter((m) => !removed.has(m.src ?? ''))
    .map((s) => ({
      ...s,
      title: tx(texts, sck(s.id, 'title'), s.title),
      note: opt(texts, sck(s.id, 'note'), s.note),
      label: opt(texts, sck(s.id, 'label'), s.label),
    }))
}

export function ovWorkflows(content: RunContent | null, items: WorkflowItem[]): WorkflowItem[] {
  const texts = content?.texts as T
  const removed = new Set(content?.removedMedia ?? [])
  return items
    .filter((m) => !removed.has(m.src ?? ''))
    .map((w) => ({
      ...w,
      title: tx(texts, wfk(w.id, 'title'), w.title),
      note: opt(texts, wfk(w.id, 'note'), w.note),
      label: opt(texts, wfk(w.id, 'label'), w.label),
    }))
}

// ---------------------------------------------------------------------------
// Case-study level removal — whole projects taken off the site (overlay only:
// projects.ts keeps every entry, so nothing is ever lost and any study can
// come back with one click). Two stores are honoured so the panel works on
// every server build: content.removedProjects (canonical) and removedMedia
// entries prefixed "project:" (fallback used by servers without the route).
// ---------------------------------------------------------------------------
export function projectsKept(content: RunContent | null): Project[] {
  const removed = new Set([
    ...(content?.removedProjects ?? []),
    ...(content?.removedMedia ?? [])
      .filter((s) => s.startsWith('project:'))
      .map((s) => s.slice(8)),
  ])
  return projectsByDate.filter((p) => !removed.has(p.slug))
}

export function isProjectRemoved(content: RunContent | null, slug: string): boolean {
  return !projectsKept(content).some((p) => p.slug === slug)
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------
export function useProjectOV(slug: string): Project | undefined {
  const { content } = useRuntime()
  if (isProjectRemoved(content, slug)) return undefined
  const p = getProject(slug)
  return p ? ovProject(content, p) : undefined
}

export function useProjectsOV(): Project[] {
  const { content } = useRuntime()
  return projectsKept(content).map((p) => ovProject(content, p))
}

export function useProjectsKept(): Project[] {
  const { content } = useRuntime()
  return projectsKept(content)
}

export function useBrandOV(slug: string): Brand | undefined {
  const { content } = useRuntime()
  const b = getBrand(slug)
  return b ? ovBrand(content, b) : undefined
}

export function useBrandListOV(): Brand[] {
  const { content } = useRuntime()
  return orderedBrands(content).map((b) => ovBrand(content, b))
}

export function useDisplayBrandsOV(): Brand[] {
  const { content } = useRuntime()
  return displayBrands.map((b) => ovBrand(content, b))
}

export function useShowcaseOV(): ShowcaseItem[] {
  const { content } = useRuntime()
  return ovShowcase(content, SHOWCASE)
}

export function useWorkflowsOV(): WorkflowItem[] {
  const { content } = useRuntime()
  return ovWorkflows(content, WORKFLOWS)
}
