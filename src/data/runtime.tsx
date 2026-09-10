// ---------------------------------------------------------------------------
// Runtime content — the live, editable layer on top of the compiled data.
// The admin server (admin-server.mjs) serves content.json; the app fetches it
// relative to the page so it works locally AND on gh-pages (where the file is
// simply the last-published snapshot).
//   uploads         : media added in the admin panel, per brand + section
//   hiddenSections  : sections removed from a brand page (story/projects/stills/animatics/films)
//   removedItems    : individual media items removed (base items listed by src/label,
//                     uploaded items are deleted outright and leave only uploads)
//   pageSections    : site sections removed from the home page (showcase/capabilities/about)
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

export type SectionName = 'story' | 'projects' | 'stills' | 'animatics' | 'films'

export interface RunContent {
  uploads?: Record<string, Partial<Record<SectionName, MediaItem[]>>>
  hiddenSections?: Record<string, SectionName[]>
  removedItems?: Record<string, Partial<Record<SectionName, string[]>>>
  pageSections?: string[]
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
