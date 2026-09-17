// ---------------------------------------------------------------------------
// Admin panel — full content manager for the portfolio.
//
//   words     : every editable string on the site (registry groups + each case
//               study + each brand + showcase/workflow items)
//   pictures  : every picture/video slot — replace, delete/restore, add;
//               the deleted area lists removed items + a restorable trash
//   sections  : show/hide + reorder sections on home / brand / case-study pages
//   concept   : the concept-images gallery manager (upload, caption, reorder)
//
// Reachable at  #/admin  (discreet link in the footer + header).
// Requires the local admin server (node admin-server.mjs) for saves; the
// passcode is a light client-side gate (change ADMIN_PASS below).
// Publishing: npm run build && npx gh-pages -d dist
// ---------------------------------------------------------------------------
import { useEffect, useMemo, useState } from 'react'
import { BRANDS, type Brand } from '../data/brands'
import { projects, type MediaItem, type Project } from '../data/projects'
import { SHOWCASE } from '../data/showcase'
import { WORKFLOWS } from '../data/workflows'
import {
  UI_GROUPS,
  HOME_SECTIONS,
  BRAND_SECTIONS,
  PROJECT_SECTIONS,
  pk,
  bk,
  sck,
  wfk,
  collKey,
  type TextField,
} from '../data/text'
import { useRuntime, type ConceptImage, type SectionName, type TextVal } from '../data/runtime'

const ADMIN_PASS = 'Wasay710#' // change me
const SESSION_KEY = 'portfolio-admin-unlocked'

type Tab = 'words' | 'pictures' | 'sections' | 'concept'

// ---------------------------------------------------------------------------
// shared bits
// ---------------------------------------------------------------------------
async function api(path: string, body: unknown) {
  const r = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error((j as { error?: string }).error || `HTTP ${r.status}`)
  return j as { ok?: boolean; saved?: MediaItem[]; added?: MediaItem[]; content?: unknown }
}

const fileToBase64 = (f: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).split(',')[1] ?? '')
    r.onerror = () => reject(new Error('read failed'))
    r.readAsDataURL(f)
  })

const readFiles = async (files: File[]) => {
  const out: { name: string; data: string }[] = []
  for (const f of files) out.push({ name: f.name, data: await fileToBase64(f) })
  return out
}

const inputCls =
  'w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 font-mono text-[13px] text-paper outline-none focus:border-green'
const selectCls = inputCls
const btnCls =
  'rounded-md border border-green/40 px-4 py-2 font-mono text-[11px] uppercase tracking-wideish text-green transition-colors hover:border-green hover:bg-green/10 disabled:cursor-not-allowed disabled:opacity-40'
const smallBtn =
  'rounded-sm border border-ink-600 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wideish text-paper/80 hover:border-green disabled:opacity-40'
const badgeCls =
  'rounded-sm bg-green/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wideish text-greenBright'

function Notice({ msg, err }: { msg: string; err: string }) {
  return (
    <>
      {msg && <p className="mt-3 font-mono text-[12px] text-greenBright">{msg}</p>}
      {err && <p className="mt-3 font-mono text-[12px] text-red-400">error: {err}</p>}
    </>
  )
}

const isVideoSrc = (src: string) => /\.(mp4|webm|mov|mkv|m4v)$/i.test(src)

// ---------------------------------------------------------------------------
// pictures: one slot card (replace / hide-restore handler)
// ---------------------------------------------------------------------------
function SlotCard({
  label,
  src,
  sub,
  removed,
  busy,
  onReplace,
  onHide,
  onRestore,
  hideLabel = 'delete',
  extra,
}: {
  label: string
  src?: string
  sub?: string
  removed?: boolean
  busy?: boolean
  onReplace?: (f: File) => void
  onHide?: () => void
  onRestore?: () => void
  hideLabel?: string
  extra?: React.ReactNode
}) {
  return (
    <div className="rounded-md border border-ink-600 bg-ink-900 p-2">
      {src && !isVideoSrc(src) && (
        <img src={src} alt={label} loading="lazy" className="aspect-video w-full rounded-sm bg-ink-950 object-cover" />
      )}
      {src && isVideoSrc(src) && (
        <div className="flex aspect-video w-full items-center justify-center rounded-sm bg-ink-950 text-lg text-muted">
          ▶ video
        </div>
      )}
      {!src && (
        <div className="flex aspect-video w-full items-center justify-center rounded-sm bg-ink-950 font-mono text-[10px] text-muted">
          no file
        </div>
      )}
      <p className="mt-1.5 line-clamp-1 font-mono text-[10px] text-paper/85">{label}</p>
      {sub && <p className="line-clamp-1 font-mono text-[9px] text-muted">{sub}</p>}
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        {onReplace && src && (
          <label className={`${smallBtn} cursor-pointer`}>
            replace
            <input
              type="file"
              accept="image/*,video/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                e.target.value = ''
                if (f) onReplace(f)
              }}
            />
          </label>
        )}
        {onHide && !removed && (
          <button type="button" disabled={busy} className={`${smallBtn} !text-red-400 hover:!border-red-400`} onClick={onHide}>
            ✕ {hideLabel}
          </button>
        )}
        {onRestore && removed && (
          <button type="button" disabled={busy} className={smallBtn} onClick={onRestore}>
            ↺ restore
          </button>
        )}
        {removed && <span className="font-mono text-[9px] uppercase text-amber-300">removed from site</span>}
        {extra}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// WORDS tab
// ---------------------------------------------------------------------------
type WField = TextField

const buildProjectFields = (p: Project): WField[] => {
  const s = p.slug
  const f = (k: string, label: string, def: string, multi = false): WField => ({
    k: pk(s, k),
    label,
    def,
    multi,
  })
  const out: WField[] = [
    f('title', 'title', p.title),
    f('subtitle', 'subtitle (line under the title)', p.subtitle ?? ''),
    f('role', 'role', p.role),
    f('year', 'year', p.year),
    f('status', 'status chip', p.status ?? ''),
    f('chain', 'process chain line', p.chain ?? ''),
    f('excerpt', 'excerpt (cards)', p.excerpt, true),
    f('overview', 'overview', p.overview, true),
    f('challenge', 'challenge', p.challenge, true),
    f('campaign.label', 'public-release link label', p.campaign?.label ?? ''),
    f('campaign.url', 'public-release url', p.campaign?.url ?? ''),
    { k: pk(s, 'approach'), label: 'approach — steps', list: p.approach },
    { k: pk(s, 'stack'), label: 'stack — chips', list: p.stack },
    { k: pk(s, 'contribution'), label: 'my contribution — chips', list: p.contribution ?? [] },
  ]
  if (p.production) {
    const pr = p.production
    out.push(
      f('production.objective', 'production — objective', pr.objective, true),
      f('production.input', 'production — input', pr.input, true),
      f('production.process', 'production — process', pr.process, true),
      f('production.control', 'production — control', pr.control, true),
      f('production.refinement', 'production — refinement', pr.refinement, true),
      f('production.output', 'production — output', pr.output, true),
    )
  }
  p.workflow.forEach((w, i) => out.push(f(`workflow.${i}.label`, `process step ${i + 1}`, w.label ?? '')))
  p.spec.forEach((row, i) => {
    out.push(f(`spec.${i}.label`, `spec ${i + 1} — label`, row.label))
    out.push(f(`spec.${i}.value`, `spec ${i + 1} — value`, row.value))
  })
  p.results.forEach((m, i) => out.push(f(`res.${i}.label`, `result ${i + 1} — caption`, m.label ?? '')))
  ;(p.stages ?? []).forEach((st, i) => out.push(f(`stage.${i}.label`, `stage ${i + 1} — label`, st.label ?? '')))
  if (p.beforeAfter) {
    out.push(f('ba.before.label', 'before — caption', p.beforeAfter.before.label ?? ''))
    out.push(f('ba.after.label', 'after — caption', p.beforeAfter.after.label ?? ''))
    out.push({ k: pk(s, 'ba.annotations'), label: 'before/after — annotations', list: p.beforeAfter.annotations ?? [] })
  }
  ;(p.formats ?? []).forEach((row, i) => {
    out.push(f(`fmt.${i}.label`, `format ${i + 1} — label`, row.label))
    if (row.note !== undefined) out.push(f(`fmt.${i}.note`, `format ${i + 1} — note`, row.note))
  })
  ;(p.placements ?? []).forEach((row, i) => {
    out.push(f(`pl.${i}.label`, `placement ${i + 1} — label`, row.label))
    if (row.note !== undefined) out.push(f(`pl.${i}.note`, `placement ${i + 1} — note`, row.note))
  })
  return out
}

const buildBrandFields = (b: Brand): WField[] => [
  { k: bk(b.slug, 'name'), label: 'brand name', def: b.name },
  { k: bk(b.slug, 'note'), label: 'note line (under the name)', def: b.note },
  { k: bk(b.slug, 'story'), label: 'story', def: b.story ?? '', multi: true },
]

const itemFields: WField[] = [
  ...SHOWCASE.flatMap((s): WField[] => [
    { k: sck(s.id, 'title'), label: `showcase ${s.id} — title`, def: s.title },
    { k: sck(s.id, 'note'), label: `showcase ${s.id} — note`, def: s.note ?? '', multi: true },
  ]),
  ...WORKFLOWS.flatMap((w): WField[] => [
    { k: wfk(w.id, 'title'), label: `workflow ${w.id} — title`, def: w.title },
    { k: wfk(w.id, 'note'), label: `workflow ${w.id} — note`, def: w.note ?? '', multi: true },
  ]),
]

function WordsTab() {
  const { content, refresh } = useRuntime()
  const [work, setWork] = useState<Record<string, TextVal>>({})
  const [deleted, setDeleted] = useState<Set<string>>(new Set())
  const [cat, setCat] = useState('hero')
  const [q, setQ] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    setWork(content?.texts ? { ...content.texts } : {})
    setDeleted(new Set())
  }, [content])

  const fields: WField[] = useMemo(() => {
    if (cat.startsWith('P.')) {
      const slug = cat.slice(2)
      const p = projects.find((x) => x.slug === slug)
      return p ? buildProjectFields(p) : []
    }
    if (cat.startsWith('B.')) {
      const slug = cat.slice(2)
      const b = BRANDS.find((x) => x.slug === slug)
      return b ? buildBrandFields(b) : []
    }
    if (cat === 'items') return itemFields
    return UI_GROUPS.find((g) => g.id === cat)?.fields ?? []
  }, [cat])

  const shown = q.trim()
    ? fields.filter(
        (f) =>
          f.label.toLowerCase().includes(q.toLowerCase()) ||
          f.k.toLowerCase().includes(q.toLowerCase()),
      )
    : fields

  const valOf = (f: WField) => {
    if (deleted.has(f.k)) return f.list ? '' : (f.def ?? '')
    const v = work[f.k]
    if (typeof v === 'string') return v
    return f.def ?? ''
  }
  const listOf = (f: WField): string[] => {
    if (deleted.has(f.k)) return f.list ?? []
    const v = work[f.k]
    return Array.isArray(v) ? v : (f.list ?? [])
  }
  const edited = (k: string) => (content?.texts ? k in content.texts : false)

  const setVal = (k: string, v: TextVal) => {
    setWork((w) => ({ ...w, [k]: v }))
    setDeleted((d) => {
      if (!d.has(k)) return d
      const n = new Set(d)
      n.delete(k)
      return n
    })
  }
  const reset = (k: string) => {
    setWork((w) => {
      const n = { ...w }
      delete n[k]
      return n
    })
    setDeleted((d) => new Set(d).add(k))
  }

  const saveGroup = async () => {
    setBusy(true)
    setMsg('')
    setErr('')
    try {
      const updates: Record<string, TextVal | null> = {}
      for (const f of fields) {
        if (deleted.has(f.k)) updates[f.k] = null
        else if (work[f.k] !== undefined) updates[f.k] = work[f.k]
      }
      if (Object.keys(updates).length === 0) {
        setMsg('nothing changed yet')
        return
      }
      await api('/api/text', { updates })
      await refresh()
      setMsg(`saved ${fields.filter((f) => updates[f.k] !== undefined).length} field(s)`)
    } catch (e) {
      setErr(String((e as Error).message || e))
    } finally {
      setBusy(false)
    }
  }

  const options: { v: string; l: string }[] = [
    ...UI_GROUPS.map((g) => ({ v: g.id, l: g.label })),
    { v: 'items', l: 'Showcase & workflow items' },
    ...projects.map((p) => ({ v: 'P.' + p.slug, l: `Case study — ${p.title.slice(0, 58)}` })),
    ...BRANDS.map((b) => ({ v: 'B.' + b.slug, l: `Brand — ${b.name}` })),
  ]

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="panel h-fit p-5">
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-wideish text-slateAccent">group</span>
          <select className={`${selectCls} mt-1.5`} value={cat} onChange={(e) => setCat(e.target.value)}>
            {options.map((o) => (
              <option key={o.v} value={o.v}>
                {o.l}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-3 block">
          <span className="font-mono text-[11px] uppercase tracking-wideish text-slateAccent">search</span>
          <input className={`${inputCls} mt-1.5`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="filter fields…" />
        </label>
        <p className="mt-3 text-[12px] leading-relaxed text-muted">
          Every field saves as an override on top of the built-in copy. “reset” returns a field to the
          compiled default. Empty a field to hide that element on the site.
        </p>
        <button className={`${btnCls} mt-4 w-full`} onClick={() => void saveGroup()} disabled={busy}>
          {busy ? 'saving…' : `save ${fields.length} field(s)`}
        </button>
        <Notice msg={msg} err={err} />
      </div>

      <div className="grid gap-3">
        {shown.map((f) =>
          f.list ? (
            <ListInput
              key={f.k}
              field={f}
              items={listOf(f)}
              edited={edited(f.k)}
              onChange={(items) => setVal(f.k, items)}
              onReset={() => reset(f.k)}
            />
          ) : (
            <TextInput
              key={f.k}
              field={f}
              value={valOf(f)}
              edited={edited(f.k)}
              onChange={(v) => setVal(f.k, v)}
              onReset={() => reset(f.k)}
            />
          ),
        )}
        {shown.length === 0 && (
          <p className="font-mono text-[12px] text-muted">no fields match “{q}”.</p>
        )}
      </div>
    </div>
  )
}

function TextInput({
  field,
  value,
  edited,
  onChange,
  onReset,
}: {
  field: WField
  value: string
  edited: boolean
  onChange: (v: string) => void
  onReset: () => void
}) {
  return (
    <div className="rounded-md border border-ink-600/70 bg-ink-900/40 p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-wideish text-slateAccent">{field.label}</span>
        <span className="flex items-center gap-2">
          {edited && <span className={badgeCls}>edited</span>}
          {edited && (
            <button onClick={onReset} className="font-mono text-[9px] uppercase text-red-400 hover:underline">
              reset
            </button>
          )}
        </span>
      </div>
      {field.multi ? (
        <textarea
          rows={3}
          className={`${inputCls} mt-2`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input className={`${inputCls} mt-2`} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
      <p className="mt-1 font-mono text-[9px] text-muted/70">key: {field.k}</p>
    </div>
  )
}

function ListInput({
  field,
  items,
  edited,
  onChange,
  onReset,
}: {
  field: WField
  items: string[]
  edited: boolean
  onChange: (items: string[]) => void
  onReset: () => void
}) {
  return (
    <div className="rounded-md border border-ink-600/70 bg-ink-900/40 p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-wideish text-slateAccent">
          {field.label} — list ({items.length})
        </span>
        <span className="flex items-center gap-2">
          {edited && <span className={badgeCls}>edited</span>}
          {edited && (
            <button onClick={onReset} className="font-mono text-[9px] uppercase text-red-400 hover:underline">
              reset
            </button>
          )}
        </span>
      </div>
      <div className="mt-2 space-y-1.5">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className={inputCls}
              value={it}
              onChange={(e) => {
                const next = [...items]
                next[i] = e.target.value
                onChange(next)
              }}
            />
            <button
              className={smallBtn}
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              title="remove item"
            >
              ✕
            </button>
          </div>
        ))}
        <button className={smallBtn} onClick={() => onChange([...items, ''])}>
          + add item
        </button>
      </div>
      <p className="mt-1 font-mono text-[9px] text-muted/70">key: {field.k}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// PICTURES tab
// ---------------------------------------------------------------------------
type PicArea = 'home' | 'project' | 'brand' | 'showcase' | 'workflows' | 'deleted'

const HOME_EXTRAS: { group: string; items: [string, string][] }[] = [
  {
    group: 'Production pipeline strip (home)',
    items: [
      ['media/image-system/pipeline/product.jpg', 'stage 01 — product'],
      ['media/image-system/pipeline/reference.jpg', 'stage 02 — reference'],
      ['media/image-system/pipeline/generation.jpg', 'stage 03 — generation'],
      ['media/image-system/pipeline/compositing.jpg', 'stage 04 — compositing'],
      ['media/image-system/pipeline/lighting.jpg', 'stage 05 — lighting'],
      ['media/image-system/pipeline/final.jpg', 'stage 06 — final'],
    ],
  },
  {
    group: 'One product / many assets (home)',
    items: [
      ['media/image-system/assets/studio-hero.jpg', 'studio hero 16:9'],
      ['media/image-system/assets/bedroom-lifestyle.jpg', 'bedroom lifestyle 16:9'],
      ['media/image-system/assets/wide-room.jpg', 'wide room 16:9'],
      ['media/image-system/assets/product-page.jpg', 'product page 16:9'],
      ['media/image-system/assets/detail.jpg', 'close-up detail 4:3'],
      ['media/image-system/assets/mobile.jpg', 'mobile 4:5'],
      ['media/image-system/assets/social.jpg', 'social ad 9:16'],
    ],
  },
  {
    group: 'Showreel (home)',
    items: [
      ['media/reel/showreel-2026.mp4', 'showreel video (mp4)'],
      ['media/reel/showreel-2026-poster.jpg', 'showreel poster'],
    ],
  },
  {
    group: 'E-commerce concept page (ecommerce-image-system case study)',
    items: [
      ['media/ecommerce-image-system/desktop-hero.jpg', 'desktop hero'],
      ['media/ecommerce-image-system/desktop-lifestyle.jpg', 'desktop lifestyle'],
      ['media/ecommerce-image-system/desktop-detail.jpg', 'desktop detail'],
      ['media/ecommerce-image-system/thumb-01.jpg', 'thumb 01'],
      ['media/ecommerce-image-system/thumb-02.jpg', 'thumb 02'],
      ['media/ecommerce-image-system/thumb-03.jpg', 'thumb 03'],
      ['media/ecommerce-image-system/thumb-04.jpg', 'thumb 04'],
      ['media/ecommerce-image-system/mobile-hero.jpg', 'mobile hero'],
    ],
  },
  {
    group: 'Site files',
    items: [
      ['media/image-system/og.jpg', 'social share image (og.jpg)'],
      ['media/resume/Syed-Abdul-Wasay-Ali-Resume.pdf', 'resume PDF'],
    ],
  },
]

function PicturesTab() {
  const { content, refresh } = useRuntime()
  const [area, setArea] = useState<PicArea>('home')
  const [projSlug, setProjSlug] = useState(projects[0]?.slug ?? '')
  const [brandSlug, setBrandSlug] = useState(BRANDS[0]?.slug ?? '')
  const [brandSection, setBrandSection] = useState<SectionName>('stills')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const notice = async (fn: () => Promise<string | void>) => {
    setBusy(true)
    setMsg('')
    setErr('')
    try {
      const m = await fn()
      await refresh()
      if (typeof m === 'string') setMsg(m)
    } catch (e) {
      setErr(String((e as Error).message || e))
    } finally {
      setBusy(false)
    }
  }

  const replace = (src: string) => (f: File) =>
    void notice(async () => {
      const data = await fileToBase64(f)
      await api('/api/media/replace', { src, file: { name: f.name, data } })
      return `replaced ${src}`
    })

  const removedSet = new Set(content?.removedMedia ?? [])
  const hide = (src: string) => void notice(async () => {
    await api('/api/media/remove', { src })
    return 'removed from site — restore it any time from the deleted area'
  })
  const restore = (src: string) => void notice(async () => {
    await api('/api/media/remove', { src, restore: true })
    return 'restored'
  })

  const addFiles = (collection: string, label: string) => (files: File[]) =>
    void notice(async () => {
      const payload = await readFiles(files)
      const j = await api('/api/media/add', { collection, label, files: payload })
      return `added ${j.added?.length ?? payload.length} file(s)`
    })

  const renameAdded = (collection: string, src: string, label: string) =>
    void notice(async () => {
      await api('/api/media/edit', { collection, src, patch: { label } })
      return 'renamed'
    })
  const deleteAdded = (collection: string, src: string) =>
    void notice(async () => {
      await api('/api/media/edit', { collection, src, patch: { remove: true } })
      return 'moved to deleted — restore it any time'
    })

  const project = projects.find((p) => p.slug === projSlug)
  const brand = BRANDS.find((b) => b.slug === brandSlug)
  const brandBase =
    brandSection === 'stills' ? brand?.images : brandSection === 'animatics' ? brand?.animatics : brand?.films
  const brandUploads = content?.uploads?.[brandSlug]?.[brandSection] ?? []
  const brandRemoved = new Set(content?.removedItems?.[brandSlug]?.[brandSection] ?? [])
  const projColl = project ? collKey.projectResults(project.slug) : ''
  const projAdded = (content?.additions?.[projColl] ?? []) as MediaItem[]
  const showcaseAdded = (content?.additions?.[collKey.showcase] ?? []) as MediaItem[]

  const areaBtn = (k: PicArea, l: string) => (
    <button
      key={k}
      onClick={() => setArea(k)}
      className={`rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wideish transition-colors ${
        area === k ? 'border-green bg-green/10 text-green' : 'border-ink-600 text-muted hover:border-green/40 hover:text-paper'
      }`}
    >
      {l}
    </button>
  )

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2">
        {areaBtn('home', 'home page')}
        {areaBtn('project', 'case studies')}
        {areaBtn('brand', 'brands')}
        {areaBtn('showcase', 'showcase')}
        {areaBtn('workflows', 'workflows')}
        {areaBtn('deleted', 'deleted')}
      </div>
      <Notice msg={msg} err={err} />

      {area === 'home' && (
        <div className="mt-5 space-y-6">
          <p className="text-[12px] text-muted">
            Replace any home-page image or video file. Same file name, new bytes — everything else
            stays. (Handles large files: give it a second.)
          </p>
          {HOME_EXTRAS.map((g) => (
            <div key={g.group}>
              <p className="eyebrow-green">{g.group}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {g.items.map(([src, label]) => (
                  <SlotCard key={src} label={label} src={src} sub={src} busy={busy} onReplace={replace(src)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {area === 'project' && (
        <div className="mt-5 space-y-6">
          <label className="block max-w-xl">
            <span className="font-mono text-[11px] uppercase tracking-wideish text-slateAccent">case study</span>
            <select className={`${selectCls} mt-1.5`} value={projSlug} onChange={(e) => setProjSlug(e.target.value)}>
              {projects.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.title.slice(0, 70)}
                </option>
              ))}
            </select>
          </label>
          {project && (
            <>
              <div>
                <p className="eyebrow-green">cover & hero</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {project.cover && (
                    <SlotCard label="cover (cards)" src={project.cover} sub={project.cover} busy={busy} onReplace={replace(project.cover)} />
                  )}
                  {project.heroSrc && (
                    <SlotCard label="hero frame" src={project.heroSrc} sub={project.heroSrc} busy={busy} onReplace={replace(project.heroSrc)} />
                  )}
                </div>
              </div>

              <div>
                <p className="eyebrow-green">results gallery ({project.results.length} + {projAdded.length} added)</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {project.results.map((m, i) => {
                    const src = m.src ?? ''
                    const rem = removedSet.has(src)
                    return (
                      <SlotCard
                        key={src + i}
                        label={m.label ?? `result ${i + 1}`}
                        src={src}
                        sub={src}
                        removed={rem}
                        busy={busy}
                        onReplace={src ? replace(src) : undefined}
                        onHide={() => hide(src)}
                        onRestore={() => restore(src)}
                      />
                    )
                  })}
                  {projAdded.map((m) => (
                    <AddedCard
                      key={m.src}
                      item={m}
                      busy={busy}
                      onReplace={m.src ? replace(m.src) : undefined}
                      onRename={(label) => renameAdded(projColl, m.src ?? '', label)}
                      onDelete={() => deleteAdded(projColl, m.src ?? '')}
                    />
                  ))}
                </div>
                <AddFilesRow label="add pictures to this case study" onFiles={addFiles(projColl, '')} />
              </div>

              {(project.stages?.length ?? 0) > 0 && (
                <div>
                  <p className="eyebrow-green">stages</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                    {(project.stages ?? []).map((m, i) =>
                      m.src ? (
                        <SlotCard key={m.src + i} label={m.label ?? `stage ${i + 1}`} src={m.src} sub={m.src} busy={busy} onReplace={replace(m.src)} />
                      ) : null,
                    )}
                  </div>
                </div>
              )}

              {project.beforeAfter && (
                <div>
                  <p className="eyebrow-green">before / after</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                    {[project.beforeAfter.before, project.beforeAfter.after].map((m, i) =>
                      m.src ? (
                        <SlotCard key={m.src + i} label={i === 0 ? 'before' : 'after'} src={m.src} sub={m.src} busy={busy} onReplace={replace(m.src)} />
                      ) : null,
                    )}
                  </div>
                </div>
              )}

              {(project.formats?.length ?? 0) > 0 && (
                <div>
                  <p className="eyebrow-green">format frames</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                    {(project.formats ?? []).map((m, i) => (
                      <SlotCard key={m.src + i} label={`${m.label} (${m.ratio})`} src={m.src} sub={m.src} busy={busy} onReplace={replace(m.src)} />
                    ))}
                  </div>
                </div>
              )}

              {(project.placements?.length ?? 0) > 0 && (
                <div>
                  <p className="eyebrow-green">placements</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                    {(project.placements ?? []).map((m, i) => (
                      <SlotCard key={m.src + i} label={m.label} src={m.src} sub={m.src} busy={busy} onReplace={replace(m.src)} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {area === 'brand' && (
        <div className="mt-5 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="font-mono text-[11px] uppercase tracking-wideish text-slateAccent">brand</span>
              <select className={`${selectCls} mt-1.5`} value={brandSlug} onChange={(e) => setBrandSlug(e.target.value)}>
                {BRANDS.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="font-mono text-[11px] uppercase tracking-wideish text-slateAccent">section</span>
              <select className={`${selectCls} mt-1.5`} value={brandSection} onChange={(e) => setBrandSection(e.target.value as SectionName)}>
                <option value="stills">stills</option>
                <option value="animatics">animatics</option>
                <option value="films">films</option>
              </select>
            </label>
          </div>

          {brand && brand.logo && (
            <>
              <p className="eyebrow-green">logo</p>
              <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                <SlotCard label={`${brand.name} — logo`} src={brand.logo} sub={brand.logo} busy={busy} onReplace={replace(brand.logo)} />
              </div>
            </>
          )}

          <div>
            <p className="eyebrow-green">
              {brand?.name} · {brandSection} — {brandUploads.length} uploaded + {(brandBase ?? []).length} built-in
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {brandUploads.map((m) => (
                <SlotCard
                  key={m.src ?? m.label}
                  label={m.label ?? m.src ?? ''}
                  src={m.src}
                  sub={m.src}
                  busy={busy}
                  onReplace={m.src ? replace(m.src) : undefined}
                  onHide={() =>
                    void notice(async () => {
                      await api('/api/remove', { brand: brandSlug, section: brandSection, src: m.src ?? m.label ?? '' })
                      return 'moved to deleted — restore it any time'
                    })
                  }
                  hideLabel="delete"
                />
              ))}
              {(brandBase ?? []).map((m, i) => {
                const src = m.src ?? ''
                const rem = brandRemoved.has(src) || removedSet.has(src)
                return (
                  <SlotCard
                    key={src + i}
                    label={m.label ?? src}
                    src={src}
                    sub={src}
                    removed={rem}
                    busy={busy}
                    onReplace={src ? replace(src) : undefined}
                    onHide={() =>
                      void notice(async () => {
                        await api('/api/remove', { brand: brandSlug, section: brandSection, src })
                        return 'hidden'
                      })
                    }
                    onRestore={() =>
                      void notice(async () => {
                        await api('/api/remove', { brand: brandSlug, section: brandSection, src, restore: true })
                        await api('/api/media/remove', { src, restore: true })
                        return 'restored'
                      })
                    }
                  />
                )
              })}
            </div>
            <AddFilesRow
              label={`upload new ${brandSection} for ${brand?.name ?? ''}`}
              onFiles={(files) =>
                void notice(async () => {
                  const payload = await readFiles(files)
                  const j = await api('/api/upload', { brand: brandSlug, section: brandSection, files: payload })
                  return `uploaded ${j.saved?.length ?? payload.length} file(s)`
                })
              }
            />
          </div>
        </div>
      )}

      {area === 'showcase' && (
        <div className="mt-5 space-y-6">
          <div>
            <p className="eyebrow-green">showcase pieces ({SHOWCASE.length} + {showcaseAdded.length} added)</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {SHOWCASE.map((s) => {
                const rem = s.src ? removedSet.has(s.src) : false
                return (
                  <SlotCard
                    key={s.id}
                    label={`${s.id} — ${s.title}`}
                    src={s.poster ?? s.src}
                    sub={s.src}
                    removed={rem}
                    busy={busy}
                    onReplace={s.src ? replace(s.src) : undefined}
                    onHide={s.src ? () => hide(s.src!) : undefined}
                    onRestore={s.src ? () => restore(s.src!) : undefined}
                    extra={
                      s.poster && (
                        <label className={`${smallBtn} cursor-pointer`}>
                          poster
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0]
                              e.target.value = ''
                              if (f) replace(s.poster!)(f)
                            }}
                          />
                        </label>
                      )
                    }
                  />
                )
              })}
              {showcaseAdded.map((m) => (
                <AddedCard
                  key={m.src}
                  item={m}
                  busy={busy}
                  onReplace={m.src ? replace(m.src) : undefined}
                  onRename={(label) => renameAdded(collKey.showcase, m.src ?? '', label)}
                  onDelete={() => deleteAdded(collKey.showcase, m.src ?? '')}
                />
              ))}
            </div>
            <AddFilesRow label="add showcase pieces" onFiles={addFiles(collKey.showcase, '')} />
          </div>
        </div>
      )}

      {area === 'workflows' && (
        <div className="mt-5 space-y-6">
          <div>
            <p className="eyebrow-green">workflow runs ({WORKFLOWS.length})</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {WORKFLOWS.map((w) => {
                const rem = w.src ? removedSet.has(w.src) : false
                return (
                  <SlotCard
                    key={w.id}
                    label={`${w.id} — ${w.title}`}
                    src={w.poster ?? w.src}
                    sub={w.src}
                    removed={rem}
                    busy={busy}
                    onReplace={w.src ? replace(w.src) : undefined}
                    onHide={w.src ? () => hide(w.src!) : undefined}
                    onRestore={w.src ? () => restore(w.src!) : undefined}
                    extra={
                      <>
                        {w.poster && (
                          <label className={`${smallBtn} cursor-pointer`}>
                            poster
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0]
                                e.target.value = ''
                                if (f) replace(w.poster!)(f)
                              }}
                            />
                          </label>
                        )}
                        {w.output?.src && (
                          <label className={`${smallBtn} cursor-pointer`}>
                            output
                            <input
                              type="file"
                              accept={
                                /\.(mp4|webm|mov|mkv|m4v)$/i.test(w.output!.src) ? 'video/*' : 'image/*'
                              }
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0]
                                e.target.value = ''
                                if (f) replace(w.output!.src)(f)
                              }}
                            />
                          </label>
                        )}
                      </>
                    }
                  />
                )
              })}
            </div>
          </div>
        </div>
      )}

      {area === 'deleted' && <DeletedArea />}
    </div>
  )
}

function AddedCard({
  item,
  busy,
  onReplace,
  onRename,
  onDelete,
}: {
  item: MediaItem
  busy: boolean
  onReplace?: (f: File) => void
  onRename: (label: string) => void
  onDelete: () => void
}) {
  const [label, setLabel] = useState(item.label ?? '')
  useEffect(() => setLabel(item.label ?? ''), [item.label])
  return (
    <div className="rounded-md border border-green/30 bg-ink-900 p-2">
      {item.src && !isVideoSrc(item.src) && (
        <img src={item.src} alt={label} loading="lazy" className="aspect-video w-full rounded-sm bg-ink-950 object-cover" />
      )}
      {item.src && isVideoSrc(item.src) && (
        <div className="flex aspect-video w-full items-center justify-center rounded-sm bg-ink-950 text-lg text-muted">▶ video</div>
      )}
      <input className={`${inputCls} mt-1.5 !py-1 !text-[11px]`} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="caption" />
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        <button className={smallBtn} disabled={busy} onClick={() => onRename(label)}>
          save caption
        </button>
        {onReplace && (
          <label className={`${smallBtn} cursor-pointer`}>
            replace
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                e.target.value = ''
                if (f) onReplace(f)
              }}
            />
          </label>
        )}
        <button className={`${smallBtn} !text-red-400 hover:!border-red-400`} disabled={busy} onClick={onDelete}>
          ✕ delete
        </button>
        <span className={badgeCls}>added</span>
      </div>
    </div>
  )
}

function AddFilesRow({ label, onFiles }: { label: string; onFiles: (files: File[]) => void }) {
  return (
    <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-ink-600 p-3 font-mono text-[11px] uppercase tracking-wideish text-muted hover:border-green/40 hover:text-paper">
      + {label}
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? [])
          e.target.value = ''
          if (files.length) onFiles(files)
        }}
      />
    </label>
  )
}

// ---------------------------------------------------------------------------
// deleted area — removed-from-site items + the restorable trash
// ---------------------------------------------------------------------------
type TrashItem = {
  id: string
  file: string
  src: string
  name: string
  size: number
  kind: string
  at: number
  meta?: {
    type?: string
    brand?: string
    section?: string
    collection?: string
    item?: { label?: string; src?: string }
  }
}

function DeletedArea() {
  const { content, refresh } = useRuntime()
  const [items, setItems] = useState<TrashItem[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const load = async () => {
    try {
      const r = await fetch('/api/trash', { cache: 'no-store' })
      const j = await r.json()
      setItems(Array.isArray(j.items) ? (j.items as TrashItem[]) : [])
    } catch {
      setItems([])
    }
  }
  useEffect(() => {
    void load()
  }, [])

  const act = async (fn: () => Promise<unknown>, m: string) => {
    setBusy(true)
    setMsg('')
    setErr('')
    try {
      await fn()
      setMsg(m)
      await refresh()
      await load()
    } catch (e) {
      setErr(String((e as Error).message || e))
    } finally {
      setBusy(false)
    }
  }

  const restoreTrash = (id: string) =>
    void act(async () => {
      await api('/api/trash/restore', { id })
    }, 'restored — it is back on the site')
  const purgeTrash = (id: string) =>
    void act(async () => {
      await api('/api/trash/purge', { id })
    }, 'deleted forever')
  const emptyTrash = () =>
    void act(async () => {
      await api('/api/trash/purge', { all: true })
    }, 'trash emptied')
  const showAgainMedia = (src: string) =>
    void act(async () => {
      await api('/api/media/remove', { src, restore: true })
    }, 'back on the site')
  const showAgainBrand = (brand: string, section: string, id: string) =>
    void act(async () => {
      await api('/api/remove', { brand, section, src: id, restore: true })
      await api('/api/media/remove', { src: id, restore: true })
    }, 'back on the site')

  const fmtSize = (n: number) =>
    n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : n > 1024 ? Math.round(n / 1024) + ' KB' : n + ' B'
  const fmtDate = (t: number) => new Date(t).toLocaleString()
  const metaText = (it: TrashItem) => {
    const m = it.meta ?? {}
    if (m.type === 'upload') return `brand upload · ${m.brand ?? ''} ${m.section ?? ''}`
    if (m.type === 'addition') return `added media · ${m.collection ?? ''}`
    if (m.type === 'concept') return 'concept images band'
    return 'media file'
  }

  const hiddenMedia = content?.removedMedia ?? []
  const hiddenBrand = Object.entries(content?.removedItems ?? {}).flatMap(([brand, secs]) =>
    Object.entries(secs ?? {}).flatMap(([section, ids]) => (ids ?? []).map((id) => ({ brand, section, id }))),
  )
  const hiddenCount = hiddenMedia.length + hiddenBrand.length

  return (
    <div className="mt-5 space-y-8">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <p className="eyebrow-green">deleted files — {items === null ? '…' : items.length} in the trash</p>
          {(items?.length ?? 0) > 0 && (
            <button
              type="button"
              disabled={busy}
              className={`${smallBtn} !text-red-400 hover:!border-red-400`}
              onClick={() => {
                if (confirm('delete all trashed files forever?')) emptyTrash()
              }}
            >
              ✕ empty trash
            </button>
          )}
        </div>
        <p className="mt-2 text-[12px] text-muted">
          Deleting a file puts it here first. “restore” puts it back exactly where it was (with its
          caption / brand slot); “delete forever” removes it for good.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {(items ?? []).map((it) => (
            <div key={it.id} className="rounded-md border border-ink-600 bg-ink-900 p-2">
              {it.kind === 'video' ? (
                <video
                  src={`/__trash/${it.id}`}
                  controls
                  preload="metadata"
                  className="aspect-video w-full rounded-sm bg-ink-950 object-cover"
                />
              ) : (
                <img
                  src={`/__trash/${it.id}`}
                  alt={it.name}
                  loading="lazy"
                  className="aspect-video w-full rounded-sm bg-ink-950 object-cover"
                />
              )}
              <p className="mt-1.5 line-clamp-1 font-mono text-[10px] text-paper/85">{it.name}</p>
              <p className="line-clamp-1 font-mono text-[9px] text-muted">
                {metaText(it)} · {fmtSize(it.size)} · {fmtDate(it.at)}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <button type="button" disabled={busy} className={smallBtn} onClick={() => restoreTrash(it.id)}>
                  ↺ restore
                </button>
                <button
                  type="button"
                  disabled={busy}
                  className={`${smallBtn} !text-red-400 hover:!border-red-400`}
                  onClick={() => {
                    if (confirm('delete this file forever?')) purgeTrash(it.id)
                  }}
                >
                  ✕ delete forever
                </button>
              </div>
            </div>
          ))}
          {items !== null && items.length === 0 && (
            <p className="col-span-full font-mono text-[11px] text-muted">trash is empty.</p>
          )}
        </div>
      </div>

      <div>
        <p className="eyebrow-green">removed from site — {hiddenCount} item(s)</p>
        <p className="mt-2 text-[12px] text-muted">
          Hidden with the delete buttons elsewhere (their files are kept). “show again” puts them
          back on the site.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {hiddenMedia.map((src) => (
            <div key={src} className="rounded-md border border-ink-600 bg-ink-900 p-2">
              {isVideoSrc(src) ? (
                <div className="flex aspect-video w-full items-center justify-center rounded-sm bg-ink-950 text-lg text-muted">
                  ▶ video
                </div>
              ) : (
                <img
                  src={src}
                  alt={src}
                  loading="lazy"
                  className="aspect-video w-full rounded-sm bg-ink-950 object-cover"
                />
              )}
              <p className="mt-1.5 line-clamp-1 font-mono text-[10px] text-paper/85">{src}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <button type="button" disabled={busy} className={smallBtn} onClick={() => showAgainMedia(src)}>
                  ↺ show again
                </button>
              </div>
            </div>
          ))}
          {hiddenBrand.map((h) => (
            <div key={`${h.brand}-${h.section}-${h.id}`} className="rounded-md border border-ink-600 bg-ink-900 p-2">
              {isVideoSrc(h.id) ? (
                <div className="flex aspect-video w-full items-center justify-center rounded-sm bg-ink-950 text-lg text-muted">
                  ▶ video
                </div>
              ) : h.id.startsWith('media/') ? (
                <img
                  src={h.id}
                  alt={h.id}
                  loading="lazy"
                  className="aspect-video w-full rounded-sm bg-ink-950 object-cover"
                />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-sm bg-ink-950 px-2 text-center font-mono text-[10px] text-muted">
                  {h.id}
                </div>
              )}
              <p className="mt-1.5 line-clamp-1 font-mono text-[10px] text-paper/85">{h.id}</p>
              <p className="line-clamp-1 font-mono text-[9px] text-muted">
                brand · {h.brand} / {h.section}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  disabled={busy}
                  className={smallBtn}
                  onClick={() => showAgainBrand(h.brand, h.section, h.id)}
                >
                  ↺ show again
                </button>
              </div>
            </div>
          ))}
          {hiddenCount === 0 && (
            <p className="col-span-full font-mono text-[11px] text-muted">nothing is hidden right now.</p>
          )}
        </div>
      </div>

      <Notice msg={msg} err={err} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// SECTIONS tab
// ---------------------------------------------------------------------------
type Row = { k: string; label: string; on: boolean }

async function apiOrder(page: 'home' | 'brand' | 'project', order: string[]) {
  return api('/api/order', { page, order })
}

function SectionsPanel({
  page,
  defs,
  legacyHidden,
}: {
  page: 'home' | 'brand' | 'project'
  defs: { k: string; label: string }[]
  legacyHidden?: string[]
}) {
  const { content, refresh } = useRuntime()
  const [rows, setRows] = useState<Row[]>([])
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    const stored = content?.sectionOrder?.[page]
    if (stored) {
      const inStored = stored
        .map((k) => defs.find((d) => d.k === k))
        .filter((d): d is { k: string; label: string } => Boolean(d))
      const rest = defs.filter((d) => !stored.includes(d.k))
      setRows([
        ...inStored.map((d) => ({ ...d, on: true })),
        ...rest.map((d) => ({ ...d, on: false })),
      ])
    } else {
      const legacy = legacyHidden ?? []
      setRows(defs.map((d) => ({ ...d, on: !legacy.includes(d.k) })))
    }
  }, [content, page, defs, legacyHidden])

  const move = (i: number, dir: -1 | 1) => {
    setRows((r) => {
      const j = i + dir
      if (j < 0 || j >= r.length) return r
      const n = [...r]
      const [it] = n.splice(i, 1)
      n.splice(j, 0, it)
      return n
    })
  }
  const toggle = (i: number) =>
    setRows((r) => r.map((row, j) => (j === i ? { ...row, on: !row.on } : row)))
  const showAll = () => setRows((r) => r.map((row) => ({ ...row, on: true })))

  const save = async () => {
    setBusy(true)
    setMsg('')
    setErr('')
    try {
      await apiOrder(
        page,
        rows.filter((r) => r.on).map((r) => r.k),
      )
      await refresh()
      setMsg(`saved — ${rows.filter((r) => r.on).length} section(s) visible, in this order`)
    } catch (e) {
      setErr(String((e as Error).message || e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow-green">
          {page === 'home' ? 'home page' : page === 'brand' ? 'brand pages (shared)' : 'case-study pages (shared)'} —
          order & visibility
        </p>
        <div className="flex gap-2">
          <button className={smallBtn} onClick={showAll}>
            show all
          </button>
          <button className={btnCls} disabled={busy} onClick={() => void save()}>
            {busy ? 'saving…' : 'save order'}
          </button>
        </div>
      </div>
      <div className="mt-4 space-y-1.5">
        {rows.map((r, i) => (
          <div
            key={r.k}
            className={`flex items-center gap-2 rounded-md border px-3 py-2 ${
              r.on ? 'border-green/40' : 'border-ink-600 opacity-60'
            }`}
          >
            <button className={smallBtn} disabled={i === 0} onClick={() => move(i, -1)}>
              ↑
            </button>
            <button className={smallBtn} disabled={i === rows.length - 1} onClick={() => move(i, 1)}>
              ↓
            </button>
            <button
              className={smallBtn}
              onClick={() => toggle(i)}
              title={r.on ? 'hide section' : 'show section'}
            >
              {r.on ? '👁 visible' : '✕ hidden'}
            </button>
            <span className={`font-mono text-[12px] ${r.on ? 'text-paper' : 'text-muted line-through'}`}>
              {r.label}
            </span>
            <span className="ml-auto font-mono text-[9px] text-muted/70">{r.k}</span>
          </div>
        ))}
      </div>
      <Notice msg={msg} err={err} />
    </div>
  )
}

function BrandVisibilityPanel() {
  const { content, refresh } = useRuntime()
  const [slug, setSlug] = useState(BRANDS[0]?.slug ?? '')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const keys: SectionName[] = ['story', 'projects', 'stills', 'animatics', 'films']
  const hidden = content?.hiddenSections?.[slug] ?? []

  const toggle = async (s: SectionName) => {
    setBusy(true)
    setMsg('')
    setErr('')
    try {
      const next = hidden.includes(s) ? hidden.filter((x) => x !== s) : [...hidden, s]
      await api('/api/sections', { brand: slug, hidden: next })
      await refresh()
      setMsg('sections updated')
    } catch (e) {
      setErr(String((e as Error).message || e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="panel p-5">
      <p className="eyebrow-green">per-brand section visibility</p>
      <label className="mt-3 block max-w-sm">
        <span className="font-mono text-[11px] uppercase tracking-wideish text-slateAccent">brand</span>
        <select className={`${selectCls} mt-1.5`} value={slug} onChange={(e) => setSlug(e.target.value)}>
          {BRANDS.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
      </label>
      <div className="mt-4 space-y-2">
        {keys.map((s) => {
          const off = hidden.includes(s)
          return (
            <button
              key={s}
              disabled={busy}
              onClick={() => void toggle(s)}
              className={`flex w-full items-center justify-between rounded-md border px-4 py-2.5 font-mono text-[12px] uppercase tracking-wideish transition-colors ${
                off ? 'border-ink-600 text-muted line-through' : 'border-green/40 text-paper hover:border-green'
              }`}
            >
              <span>{s}</span>
              <span className="text-[10px]">{off ? 'removed' : 'visible'}</span>
            </button>
          )
        })}
      </div>
      <Notice msg={msg} err={err} />
    </div>
  )
}

function SectionsTab() {
  return (
    <div className="mt-6 space-y-6">
      <SectionsPanel page="home" defs={HOME_SECTIONS} legacyHidden={undefined} />
      <div className="grid gap-6 xl:grid-cols-2">
        <SectionsPanel page="brand" defs={BRAND_SECTIONS} />
        <BrandVisibilityPanel />
      </div>
      <SectionsPanel page="project" defs={PROJECT_SECTIONS} />
      <p className="max-w-3xl text-[12px] leading-relaxed text-muted">
        “Case-study pages (shared)” and “brand pages (shared)” apply to every case study / brand page.
        The per-brand toggles above switch individual brand sections back on or off (legacy layer,
        still respected alongside the order).
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// CONCEPT images tab (moved from v1 — unchanged behaviour)
// ---------------------------------------------------------------------------
function ConceptTab() {
  const { refresh } = useRuntime()
  const [cFiles, setCFiles] = useState<File[]>([])
  const [cCaption, setCCaption] = useState('')
  const [cDrafts, setCDrafts] = useState<Record<string, string>>({})
  const [cBusy, setCBusy] = useState(false)
  const [cMsg, setCMsg] = useState('')
  const [cErr, setCErr] = useState('')
  const [cItems, setCItems] = useState<ConceptImage[]>([])

  useEffect(() => {
    fetch('content.json', { cache: 'no-store' })
      .then((r) => r.json())
      .then((c) => setCItems(Array.isArray(c.conceptImages) ? c.conceptImages : []))
      .catch(() => {})
  }, [])

  const cPost = async (path: string, payload: unknown) => {
    const r = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) })
    const j = await r.json().catch(() => ({}))
    if (!r.ok) throw new Error(j && j.error ? j.error : 'request failed')
    if (j && j.content && Array.isArray(j.content.conceptImages)) setCItems(j.content.conceptImages)
    return j
  }
  const cUpload = async () => {
    if (!cFiles.length) {
      setCErr('pick at least one image')
      return
    }
    setCBusy(true)
    setCMsg('')
    setCErr('')
    try {
      const files = await readFiles(cFiles)
      const j = await cPost('/api/concept/upload', { caption: cCaption, files })
      setCMsg('uploaded ' + ((j.saved && j.saved.length) || 0) + ' image(s)')
      setCFiles([])
      setCCaption('')
      await refresh()
    } catch (e) {
      setCErr(String((e && (e as Error).message) || e))
    } finally {
      setCBusy(false)
    }
  }
  const cOp = async (path: string, payload: unknown, okMsg: string) => {
    setCBusy(true)
    setCMsg('')
    setCErr('')
    try {
      await cPost(path, payload)
      setCMsg(okMsg)
      await refresh()
    } catch (e) {
      setCErr(String((e && (e as Error).message) || e))
    } finally {
      setCBusy(false)
    }
  }
  const cReplace = async (id: string, f: File | undefined) => {
    if (!f) return
    setCBusy(true)
    setCMsg('')
    setCErr('')
    try {
      await cPost('/api/concept/replace', { id, file: { name: f.name, data: await fileToBase64(f) } })
      setCMsg('replaced image')
      await refresh()
    } catch (e) {
      setCErr(String((e && (e as Error).message) || e))
    } finally {
      setCBusy(false)
    }
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
      <div className="rounded-md border border-ink-600 bg-ink-900 p-5">
        <p className="eyebrow-green">add concept images</p>
        <p className="mt-2 font-mono text-[11px] text-muted">
          uploads land in the concept images band on the home page.
        </p>
        <label className="mt-4 block font-mono text-[11px] uppercase text-muted">
          caption (optional, applies to this batch)
          <input
            value={cCaption}
            onChange={(e) => setCCaption(e.target.value)}
            className="mt-1 w-full rounded-sm border border-ink-600 bg-transparent px-3 py-2 text-[13px] text-paper outline-none focus:border-green"
            placeholder="e.g. concept frame 01"
          />
        </label>
        <label className="mt-3 block font-mono text-[11px] uppercase text-muted">
          images (multi-select ok)
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setCFiles(Array.from(e.target.files || []))}
            className="mt-1 w-full text-[12px] text-muted"
          />
        </label>
        <button
          type="button"
          onClick={() => void cUpload()}
          disabled={cBusy}
          className="mt-4 rounded-sm border border-green bg-green px-4 py-2 font-mono text-[11px] uppercase tracking-wide text-snow disabled:opacity-50"
        >
          upload
        </button>
        <Notice msg={cMsg} err={cErr} />
      </div>
      <div className="rounded-md border border-ink-600 bg-ink-900 p-5">
        <p className="eyebrow-green">
          manage · {cItems.length} image{cItems.length === 1 ? '' : 's'}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {cItems.map((m, idx) => (
            <div key={m.id} className="rounded-sm border border-ink-600 p-2">
              <img src={m.src} alt={m.caption || ''} loading="lazy" className="aspect-video w-full rounded-sm object-cover" />
              <input
                value={cDrafts[m.id] ?? m.caption ?? ''}
                onChange={(e) => setCDrafts({ ...cDrafts, [m.id]: e.target.value })}
                className="mt-2 w-full rounded-sm border border-ink-600 bg-transparent px-2 py-1.5 text-[12px] text-paper outline-none focus:border-green"
                placeholder="caption / title"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  disabled={cBusy || idx === 0}
                  onClick={() => void cOp('/api/concept/reorder', { id: m.id, dir: 'up' }, 'moved up')}
                  className={smallBtn}
                >
                  up
                </button>
                <button
                  type="button"
                  disabled={cBusy || idx === cItems.length - 1}
                  onClick={() => void cOp('/api/concept/reorder', { id: m.id, dir: 'down' }, 'moved down')}
                  className={smallBtn}
                >
                  down
                </button>
                <button
                  type="button"
                  disabled={cBusy}
                  onClick={() => void cOp('/api/concept/edit', { id: m.id, caption: cDrafts[m.id] ?? m.caption ?? '' }, 'caption saved')}
                  className={smallBtn}
                >
                  save caption
                </button>
                <label className={`${smallBtn} cursor-pointer`}>
                  replace
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files && e.target.files[0]
                      e.target.value = ''
                      void cReplace(m.id, f || undefined)
                    }}
                  />
                </label>
                <button
                  type="button"
                  disabled={cBusy}
                  onClick={() => {
                    if (confirm('remove this image? this deletes the file.'))
                      void cOp('/api/concept/remove', { id: m.id }, 'image removed')
                  }}
                  className={`${smallBtn} !text-red-400 hover:!border-red-400`}
                >
                  remove
                </button>
              </div>
            </div>
          ))}
          {cItems.length === 0 && (
            <p className="col-span-full font-mono text-[11px] text-muted">
              no concept images yet — upload some on the left.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// page shell
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// save & publish — one button: build the site, push it to GitHub Pages
// ---------------------------------------------------------------------------
type PublishStatus = {
  missing?: boolean
  running: boolean
  phase: string
  ok: boolean | null
  error: string | null
  last: { at: number } | null
  dirty: boolean
  logTail: string[]
}

function PublishBar() {
  const [st, setSt] = useState<PublishStatus | null>(null)
  const [busy, setBusy] = useState(false)
  const [flash, setFlash] = useState('')

  useEffect(() => {
    let live = true
    const load = async () => {
      try {
        const r = await fetch('/api/publish/status', { cache: 'no-store' })
        if (r.status === 404) {
          if (live)
            setSt({ missing: true, running: false, phase: 'idle', ok: null, error: null, last: null, dirty: true, logTail: [] })
          return
        }
        if (!r.ok) return
        const j = (await r.json()) as PublishStatus
        if (live) setSt(j)
      } catch {
        /* server offline — the banner above already explains */
      }
    }
    load()
    const t = window.setInterval(load, 2500)
    return () => {
      live = false
      window.clearInterval(t)
    }
  }, [])

  const publish = async () => {
    if (busy || st?.running || st?.missing) return
    setBusy(true)
    setFlash('')
    try {
      await api('/api/publish', {})
    } catch (e) {
      setFlash('could not start publish: ' + (e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const running = !!st?.running
  const phase = st?.phase || 'idle'
  const lastAt = st?.last?.at ? new Date(st.last.at).toLocaleString() : null
  const upToDate = !!(st && !st.missing && !running && st.last && !st.dirty && !st.error)

  return (
    <div className="panel mt-6 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-wideish text-slateAccent">save &amp; publish</p>
          <p className="mt-1 text-[13px] leading-relaxed text-paper/85">
            {st?.missing ? (
              <>
                This server is outdated — restart it (<span className="font-mono text-[12px] text-paper">node admin-server.mjs</span>) to get the publish button.
              </>
            ) : running ? (
              phase === 'publishing' ? 'Uploading to GitHub…' : 'Building the site…'
            ) : upToDate ? (
              <>
                Live on GitHub since <span className="text-paper">{lastAt}</span> — you are up to date.
              </>
            ) : (
              'You have changes that are not on the GitHub site yet.'
            )}
          </p>
          {(flash || st?.error) && <p className="mt-1 font-mono text-[11px] text-red-400">{flash || st?.error}</p>}
        </div>
        <button
          type="button"
          onClick={publish}
          disabled={busy || running || !!st?.missing}
          className={`${btnCls} ${busy || running || st?.missing ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          {running ? (phase === 'publishing' ? 'publishing…' : 'building…') : busy ? 'starting…' : 'save & publish'}
        </button>
      </div>
      {running && (
        <p className="mt-3 border-t border-ink-600 pt-3 font-mono text-[11px] leading-relaxed text-muted">
          takes about a minute — keep the server window open. {(st?.logTail || []).slice(-1)[0] || ''}
        </p>
      )}
    </div>
  )
}

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [err, setErr] = useState('')
  const [tab, setTab] = useState<Tab>('words')

  // is the local admin server reachable? (live gh-pages has no /api)
  const [serverOk, setServerOk] = useState<boolean | null>(null)
  useEffect(() => {
    fetch('/api/content', { cache: 'no-store' })
      .then((r) => setServerOk(r.ok))
      .catch(() => setServerOk(false))
  }, [])

  if (!unlocked) {
    return (
      <main className="container-site flex min-h-[70vh] items-center justify-center pt-14">
        <form
          className="panel w-full max-w-md p-6"
          onSubmit={(e) => {
            e.preventDefault()
            if (pass === ADMIN_PASS) {
              sessionStorage.setItem(SESSION_KEY, '1')
              setUnlocked(true)
              setErr('')
            } else {
              setErr('wrong passcode')
            }
          }}
        >
          <p className="eyebrow-green">admin access</p>
          <h1 className="mt-2 font-display text-2xl font-black uppercase">Content manager</h1>
          <p className="mt-2 text-sm text-muted">
            Every word, every picture and every section of the portfolio — editable from here.
          </p>
          <label className="mt-4 block">
            <span className="font-mono text-[11px] uppercase tracking-wideish text-slateAccent">passcode</span>
            <div className="relative mt-1.5">
              <input
                type={showPass ? 'text' : 'password'}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className={`${inputCls} !pr-11`}
                placeholder="••••••••"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                aria-label={showPass ? 'hide passcode' : 'show passcode'}
                title={showPass ? 'hide passcode' : 'show passcode'}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted transition-colors hover:text-paper"
              >
                {showPass ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
          </label>
          {err && <p className="mt-2 font-mono text-[11px] text-red-400">{err}</p>}
          <button type="submit" className={`${btnCls} mt-4`}>
            unlock
          </button>
        </form>
      </main>
    )
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'words', label: 'words' },
    { id: 'pictures', label: 'pictures' },
    { id: 'sections', label: 'sections' },
    { id: 'concept', label: 'concept images' },
  ]

  return (
    <main className="container-site pb-16 pt-20">
      <p className="eyebrow-green">admin</p>
      <h1 className="mt-2 font-display text-3xl font-black uppercase">Content manager</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        Words · pictures · sections — everything on the portfolio edits from here and saves into{' '}
        <span className="font-mono text-[12px] text-paper">content.json</span> (plus media files).
        When you are done, hit <span className="font-mono text-[12px] text-paper">save &amp; publish</span> to push it
        to the live GitHub site.
      </p>

      {serverOk === true && <PublishBar />}

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`rounded-md border px-4 py-1.5 font-mono text-[11px] uppercase tracking-wideish transition-colors ${
              tab === tb.id
                ? 'border-green bg-green/10 text-green'
                : 'border-ink-600 text-muted hover:border-green/40 hover:text-paper'
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {serverOk === false && (
        <div className="mt-4 rounded-md border border-amber-400/40 bg-amber-400/10 p-4">
          <p className="font-mono text-[12px] uppercase tracking-wideish text-amber-300">
            local admin server offline
          </p>
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-paper/80">
            Saving needs the local server. Run{' '}
            <span className="font-mono text-[12px] text-paper">node admin-server.mjs</span> in{' '}
            <span className="font-mono text-[12px] text-paper">syed-portfolio</span> and open{' '}
            <span className="font-mono text-[12px] text-paper">http://127.0.0.1:4173/#/admin</span>.
          </p>
        </div>
      )}

      {tab === 'words' && <WordsTab />}
      {tab === 'pictures' && <PicturesTab />}
      {tab === 'sections' && <SectionsTab />}
      {tab === 'concept' && <ConceptTab />}
    </main>
  )
}
