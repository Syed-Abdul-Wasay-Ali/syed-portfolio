// ---------------------------------------------------------------------------
// Admin panel — content manager for the portfolio.
// Reachable at  #/admin  (discreet link in the footer). Requires the local
// admin server (node admin-server.mjs) for uploads; the passcode is a light
// client-side gate (change ADMIN_PASS below).
// ---------------------------------------------------------------------------
import { useEffect, useState } from 'react'
import { BRANDS, type Brand } from '../data/brands'
import { useRuntime, type SectionName } from '../data/runtime'
import type { MediaItem } from '../data/projects'

const ADMIN_PASS = 'wasay2026' // change me
const SESSION_KEY = 'portfolio-admin-unlocked'

type Tab = 'upload' | 'brand-sections' | 'site-sections'

const SECTIONS: { key: SectionName; hint: string }[] = [
  { key: 'stills', hint: 'campaign images' },
  { key: 'animatics', hint: 'animatic videos' },
  { key: 'films', hint: 'final film videos' },
]
const BRAND_SECTION_KEYS: SectionName[] = ['story', 'projects', 'stills', 'animatics', 'films']
const SITE_SECTIONS = ['showcase', 'capabilities', 'about']

async function api(path: string, body: unknown) {
  const r = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error((j as { error?: string }).error || `HTTP ${r.status}`)
  return j as { ok?: boolean; saved?: MediaItem[]; content?: unknown }
}

const fileToBase64 = (f: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).split(',')[1] ?? '')
    r.onerror = () => reject(new Error('read failed'))
    r.readAsDataURL(f)
  })

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-wideish text-slateAccent">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

const selectCls =
  'w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 font-mono text-[13px] text-paper outline-none focus:border-green'
const inputCls =
  'w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 font-mono text-[13px] text-paper outline-none focus:border-green'
const btnCls =
  'rounded-md border border-green/40 px-4 py-2 font-mono text-[11px] uppercase tracking-wideish text-green transition-colors hover:border-green hover:bg-green/10 disabled:cursor-not-allowed disabled:opacity-40'
const chipCls =
  'inline-block border border-ink-600 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wideish text-paper/80'

function baseItems(brand: Brand, section: SectionName): MediaItem[] {
  if (section === 'stills') return brand.images
  if (section === 'animatics') return brand.animatics
  if (section === 'films') return brand.films
  return []
}

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [tab, setTab] = useState<Tab>('upload')
  const { content, refresh } = useRuntime()

  // upload tab state
  const [brandSlug, setBrandSlug] = useState(BRANDS[0]?.slug ?? '')
  const [section, setSection] = useState<SectionName>('stills')
  const [label, setLabel] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  const brand = BRANDS.find((b) => b.slug === brandSlug)

  // brand sections tab state
  const [secBrandSlug, setSecBrandSlug] = useState(BRANDS[0]?.slug ?? '')
  const [itemSection, setItemSection] = useState<SectionName>('stills')

  // site sections tab state
  const [siteHidden, setSiteHidden] = useState<string[]>([])

  // is the local admin server reachable? (live gh-pages has no /api)
  const [serverOk, setServerOk] = useState<boolean | null>(null)
  useEffect(() => {
    fetch('/api/content', { cache: 'no-store' })
      .then((r) => setServerOk(r.ok))
      .catch(() => setServerOk(false))
  }, [])

  useEffect(() => {
    if (content?.pageSections) setSiteHidden(content.pageSections)
  }, [content])

  const hiddenFor = (slug: string) => content?.hiddenSections?.[slug] ?? []
  const uploadsFor = (slug: string, s: SectionName) => content?.uploads?.[slug]?.[s] ?? []
  const removedFor = (slug: string, s: SectionName) => new Set(content?.removedItems?.[slug]?.[s] ?? [])

  const effectiveItems = (b: Brand | undefined, s: SectionName): MediaItem[] => {
    if (!b) return []
    const removed = removedFor(b.slug, s)
    return [
      ...uploadsFor(b.slug, s),
      ...baseItems(b, s).filter((m) => !removed.has(m.src ?? m.label ?? '')),
    ]
  }

  const doApi = async (path: string, body: unknown, okMsg: string) => {
    setBusy(true)
    setStatus('')
    setErr('')
    try {
      await api(path, body)
      await refresh()
      setStatus(okMsg)
    } catch (e) {
      setErr(String((e as Error).message || e))
    } finally {
      setBusy(false)
    }
  }

  const onUpload = async () => {
    if (!brand || files.length === 0) {
      setErr('pick a brand and at least one file')
      return
    }
    setBusy(true)
    setStatus('')
    setErr('')
    try {
      const payload = []
      for (const f of files) payload.push({ name: f.name, data: await fileToBase64(f) })
      const r = await api('/api/upload', {
        brand: brand.slug,
        section,
        label,
        files: payload,
      })
      await refresh()
      setStatus(`uploaded ${r.saved?.length ?? payload.length} file(s) to ${brand.name} / ${section}`)
      setFiles([])
      setLabel('')
    } catch (e) {
      setErr(String((e as Error).message || e))
    } finally {
      setBusy(false)
    }
  }

  const onRemoveItem = async (s: SectionName, m: MediaItem) => {
    if (!brand) return
    await doApi(
      '/api/remove',
      { brand: brand.slug, section: s, src: m.src ?? m.label ?? '' },
      `removed item from ${brand.name} / ${s}`
    )
  }

  const toggleSiteSection = async (s: string) => {
    const next = siteHidden.includes(s) ? siteHidden.filter((x) => x !== s) : [...siteHidden, s]
    setSiteHidden(next)
    await doApi('/api/page', { hidden: next }, 'site sections updated')
  }

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
            Enter the admin passcode to upload media and manage sections.
          </p>
          <Field label="passcode">
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className={inputCls}
              placeholder="••••••••"
              autoFocus
            />
          </Field>
          {err && <p className="mt-2 font-mono text-[11px] text-red-400">{err}</p>}
          <button type="submit" className={`${btnCls} mt-4`}>
            unlock
          </button>
        </form>
      </main>
    )
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'upload', label: 'upload media' },
    { id: 'brand-sections', label: 'brand sections' },
    { id: 'site-sections', label: 'site sections' },
  ]

  return (
    <main className="container-site pb-16 pt-20">
      <p className="eyebrow-green">admin</p>
      <h1 className="mt-2 font-display text-3xl font-black uppercase">Content manager</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Changes apply instantly on this local site and are saved into the project.
        To publish them: <span className="font-mono text-[12px] text-paper">npm run build &amp;&amp; npx gh-pages -d dist</span>
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-md border px-4 py-1.5 font-mono text-[11px] uppercase tracking-wideish transition-colors ${
              tab === t.id
                ? 'border-green bg-green/10 text-green'
                : 'border-ink-600 text-muted hover:border-green/40 hover:text-paper'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {status && <p className="mt-4 font-mono text-[12px] text-greenBright">{status}</p>}
      {err && <p className="mt-4 font-mono text-[12px] text-red-400">error: {err}</p>}

      {serverOk === false && (
        <div className="mt-4 rounded-md border border-amber-400/40 bg-amber-400/10 p-4">
          <p className="font-mono text-[12px] uppercase tracking-wideish text-amber-300">
            local admin server offline
          </p>
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-paper/80">
            Uploads and removal need the local server. Run{' '}
            <span className="font-mono text-[12px] text-paper">
              node admin-server.mjs
            </span>{' '}
            in <span className="font-mono text-[12px] text-paper">syed-portfolio</span>{' '}
            and open{' '}
            <span className="font-mono text-[12px] text-paper">http://127.0.0.1:4173/#/admin</span>.
          </p>
        </div>
      )}

      {/* ------------------------------------------------ UPLOAD ----- */}
      {tab === 'upload' && (
        <div className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="panel space-y-4 p-5">
            <Field label="brand">
              <select value={brandSlug} onChange={(e) => setBrandSlug(e.target.value)} className={selectCls}>
                {BRANDS.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="section">
              <select value={section} onChange={(e) => setSection(e.target.value as SectionName)} className={selectCls}>
                {SECTIONS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.key} — {s.hint}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="label (optional caption)">
              <input value={label} onChange={(e) => setLabel(e.target.value)} className={inputCls} placeholder="e.g. story of us — valentine 10" />
            </Field>
            <Field label="files (images + videos, multi)">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                className="block w-full text-[12px] text-muted file:mr-3 file:rounded-md file:border file:border-ink-600 file:bg-ink-900 file:px-3 file:py-1.5 file:font-mono file:text-[11px] file:text-paper hover:file:border-green/40"
              />
            </Field>
            {files.length > 0 && (
              <p className="font-mono text-[11px] text-muted">
                {files.length} file(s): {files.map((f) => f.name).join(', ').slice(0, 120)}
              </p>
            )}
            <button onClick={onUpload} disabled={busy || serverOk === false} className={btnCls}>
              {busy ? 'uploading…' : 'upload'}
            </button>
          </div>

          <div className="panel p-5">
            <p className="eyebrow-green">
              {brand?.name ?? '—'} · {itemSection}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {SECTIONS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setItemSection(s.key)}
                  className={chipCls + (itemSection === s.key ? ' !border-green !text-green' : '')}
                >
                  {s.key} ({effectiveItems(brand, s.key).length})
                </button>
              ))}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {effectiveItems(brand, itemSection).map((m, i) => (
                <div key={(m.src ?? m.label ?? '') + i} className="relative rounded-md border border-ink-600 bg-ink-900 p-2">
                  {m.src ? (
                    m.kind === 'video' || /\.(mp4|webm|mov|mkv)$/i.test(m.src) ? (
                      <div className="flex aspect-video items-center justify-center bg-ink-950 text-lg text-muted">▶</div>
                    ) : (
                      <img src={m.src} alt={m.label ?? ''} loading="lazy" className="aspect-video w-full rounded-sm object-cover" />
                    )
                  ) : (
                    <div className="flex aspect-video items-center justify-center bg-ink-950 font-mono text-[10px] text-muted">pending</div>
                  )}
                  <p className="mt-1.5 line-clamp-1 font-mono text-[10px] text-paper/80">{m.label ?? m.src}</p>
                  <button
                    onClick={() => onRemoveItem(itemSection, m)}
                    className="absolute right-1.5 top-1.5 rounded-sm border border-red-400/40 bg-ink-950/90 px-1.5 py-0.5 font-mono text-[10px] text-red-400 hover:border-red-400"
                  >
                    ✕ remove
                  </button>
                </div>
              ))}
              {effectiveItems(brand, itemSection).length === 0 && (
                <p className="col-span-full font-mono text-[11px] text-muted">nothing here yet — upload something ☝</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------- BRAND SECTIONS ----- */}
      {tab === 'brand-sections' && (
        <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">
          <div className="panel p-5">
            <Field label="brand">
              <select value={secBrandSlug} onChange={(e) => setSecBrandSlug(e.target.value)} className={selectCls}>
                {BRANDS.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </Field>
            <p className="mt-3 text-[12px] leading-relaxed text-muted">
              Toggle a section off to remove it from this brand page. Nothing is
              deleted — flip it back on anytime.
            </p>
          </div>
          <div className="space-y-4">
            <div className="panel p-5">
              <p className="eyebrow-green">sections on: {BRANDS.find((b) => b.slug === secBrandSlug)?.name}</p>
              <div className="mt-3 space-y-2">
                {BRAND_SECTION_KEYS.map((s) => {
                  const off = hiddenFor(secBrandSlug).includes(s)
                  return (
                    <button
                      key={s}
                      onClick={() => {
                        const list = hiddenFor(secBrandSlug)
                        const next = off ? list.filter((x) => x !== s) : [...list, s]
                        void doApi('/api/sections', { brand: secBrandSlug, hidden: next }, 'sections updated')
                      }}
                      className={`flex w-full items-center justify-between rounded-md border px-4 py-2.5 font-mono text-[12px] uppercase tracking-wideish transition-colors ${
                        off
                          ? 'border-ink-600 text-muted line-through'
                          : 'border-green/40 text-paper hover:border-green'
                      }`}
                    >
                      <span>{s}</span>
                      <span className="text-[10px]">{off ? 'removed' : 'visible'}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="panel p-5">
              <p className="eyebrow-green">remove individual media items</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {SECTIONS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setItemSection(s.key)}
                    className={chipCls + (itemSection === s.key ? ' !border-green !text-green' : '')}
                  >
                    {s.key} ({effectiveItems(BRANDS.find((b) => b.slug === secBrandSlug), s.key).length})
                  </button>
                ))}
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {effectiveItems(BRANDS.find((b) => b.slug === secBrandSlug), itemSection).map((m, i) => (
                  <div key={(m.src ?? m.label ?? '') + i} className="relative rounded-md border border-ink-600 bg-ink-900 p-2">
                    <p className="line-clamp-1 font-mono text-[10px] text-paper/80">{m.label ?? m.src}</p>
                    <button
                      onClick={() => {
                        const b = BRANDS.find((x) => x.slug === secBrandSlug)
                        if (b) void onRemoveItemFor(b, itemSection, m)
                      }}
                      className="mt-1.5 w-full rounded-sm border border-red-400/40 px-1.5 py-0.5 font-mono text-[10px] text-red-400 hover:border-red-400"
                    >
                      ✕ remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------- SITE SECTIONS ----- */}
      {tab === 'site-sections' && (
        <div className="mt-8 max-w-xl">
          <div className="panel p-5">
            <p className="eyebrow-green">sections on the home page</p>
            <div className="mt-3 space-y-2">
              {SITE_SECTIONS.map((s) => {
                const off = siteHidden.includes(s)
                return (
                  <button
                    key={s}
                    onClick={() => void toggleSiteSection(s)}
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
            <p className="mt-4 text-[12px] leading-relaxed text-muted">
              Removing a section also hides its nav link. Hero, Brands and Work always stay.
            </p>
          </div>
        </div>
      )}
    </main>
  )
}

async function onRemoveItemFor(b: Brand, s: SectionName, m: MediaItem) {
  // helper bound to the sections tab brand (kept simple: direct api call)
  await fetch('/api/remove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brand: b.slug, section: s, src: m.src ?? m.label ?? '' }),
  })
}
