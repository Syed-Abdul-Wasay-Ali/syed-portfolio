// ---------------------------------------------------------------------------
// Runtime content — the live, editable layer on top of the compiled data.
// The admin server (admin-server.mjs) serves content.json; the app fetches it
// relative to the page so it works locally AND on gh-pages (where the file is
// simply the last-published snapshot).
//   uploads         : media added in the admin panel, per brand + section
//   hiddenSections  : sections removed from a brand page (story/projects/stills/animatics/films)
//   removedItems    : individual media items removed (base items listed by src/label,
//                     uploaded items are deleted outright and leave only uploads)
//   pageSections    : site sections removed from the home page (kept for back-compat;
//                     sectionOrder supersedes it when present)
//   texts           : every editable word on the site — keyed strings (and string
//                     arrays for list fields). t()/tx() resolve override → fallback
//                     → registry default (src/data/text.ts)
//   removedMedia    : media srcs hidden everywhere they render (any page)
//   removedProjects : whole case studies hidden everywhere (home grid, their
//                     page, brand listings) — overlay only, projects.ts intact
//   additions       : media added through the admin, per collection key
//                     ("project:<slug>:results", "showcase", "workflows")
//   sectionOrder    : visible sections + their order per page ("home" | "brand" | "project")
//   stamp           : bumped by the admin server on every write (cache-bust marker)
// ---------------------------------------------------------------------------
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { MediaItem } from './projects'
import { DEF } from './text'

export type SectionName = 'story' | 'projects' | 'stills' | 'animatics' | 'films'

export type TextVal = string | string[]

export type SectionOrder = Partial<Record<'home' | 'brand' | 'project', string[]>>

export interface RunContent {
  conceptImages?: ConceptImage[]
  uploads?: Record<string, Partial<Record<SectionName, MediaItem[]>>>
  hiddenSections?: Record<string, SectionName[]>
  removedItems?: Record<string, Partial<Record<SectionName, string[]>>>
  pageSections?: string[]
  // ---- full content layer (admin v2) ----
  texts?: Record<string, TextVal>
  removedMedia?: string[]
  removedProjects?: string[]
  additions?: Record<string, MediaItem[]>
  sectionOrder?: SectionOrder
  stamp?: number
}

interface RuntimeValue {
  content: RunContent | null
  refresh: () => Promise<void>
}

const Ctx = createContext<RuntimeValue>({ content: null, refresh: async () => {} })

export function RuntimeProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<RunContent | null>(null)

  const refresh = useCallback(async () => {
    try {
      const r = await fetch('content.json', { cache: 'no-store' })
      if (r.ok) setContent((await r.json()) as RunContent)
    } catch {
      // no runtime file (pure static hosting) — compiled data still applies
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return <Ctx.Provider value={{ content, refresh }}>{children}</Ctx.Provider>
}

export const useRuntime = () => useContext(Ctx)

// ---------------------------------------------------------------------------
// Text resolution.
// Override (content.texts) wins; otherwise the explicit fallback (compiled
// data); otherwise the registry default for that key (static UI copy).
// An explicit empty-string override renders an empty string — components keep
// their `{x && ...}` guards so the element disappears.
// ---------------------------------------------------------------------------
export const tx = (
  texts: Record<string, TextVal> | undefined,
  key: string,
  fallback = '',
): string => {
  const v = texts?.[key]
  if (typeof v === 'string') return v
  return fallback !== '' ? fallback : (DEF.get(key) ?? '')
}

export const txl = (
  texts: Record<string, TextVal> | undefined,
  key: string,
  fallback: string[] = [],
): string[] => {
  const v = texts?.[key]
  if (Array.isArray(v)) return v.map(String)
  return fallback
}

export function useT() {
  const { content } = useRuntime()
  return (k: string, fb = '') => tx(content?.texts, k, fb)
}

export function useTL() {
  const { content } = useRuntime()
  return (k: string, fb: string[] = []) => txl(content?.texts, k, fb)
}

export interface ConceptImage {
  id: string
  src: string
  kind?: 'image' | 'video'
  caption?: string
  /** set to 'photos' to render in the AI Product Photoshoot Images sub-band */
  group?: 'photos'
}
