#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Local admin server for the portfolio site.
//
//   node admin-server.mjs          ->  http://127.0.0.1:4173
//
// Serves the built site from dist/ and backs the #/admin panel:
//   GET  /api/content              current runtime content (content.json)
//   POST /api/upload               { brand, section, label, files:[{name,data(base64)}] }
//   POST /api/remove               { brand, section, src | label }
//   POST /api/sections             { brand, hidden: [sectionName] }
//   POST /api/page                 { hidden: [siteSection] }
//   POST /api/project/remove       { slug, restore? } — take a whole case study
//                                  off the site / put it back (data kept)
//   GET  /api/trash                deleted-media trash (restorable files)
//   POST /api/trash/restore|purge  { id } | purge { all: true }
//   GET  /api/publish/status       save & publish progress (for the UI)
//   POST /api/publish              build the site and push it to GitHub Pages
//
// Uploads land in public/media/brands/<slug>/<stills|animatic|film>/ AND in
// dist/media/... (so they show instantly). content.json is written to both
// public/ (survives npm run build) and dist/ (served immediately).
// Publishing: hit "save & publish" in #/admin (build + gh-pages) — or manually: npm run build && npx gh-pages -d dist
// ---------------------------------------------------------------------------
import http from 'node:http'
import { readFile, writeFile, mkdir, unlink, readdir, stat } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(ROOT, 'dist')
const PUBLIC = path.join(ROOT, 'public')
const PORT = Number(process.env.PORT || 4173)
const HOST = '127.0.0.1'

const SECTION_DIRS = { stills: 'stills', animatics: 'animatic', films: 'film' }
const VIDEO_EXT = /\.(mp4|webm|mov|mkv|m4v)$/i

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
}

const json = (res, code, obj) => {
  const body = JSON.stringify(obj)
  res.writeHead(code, { 'Content-Type': 'application/json' })
  res.end(body)
}

const readBody = (req, limit = 1024 * 1024 * 1024) =>
  new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (c) => {
      size += c.length
      if (size > limit) {
        reject(new Error('payload too large'))
        req.destroy()
        return
      }
      chunks.push(c)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })

const readContent = async () => {
  try {
    return JSON.parse(await readFile(path.join(PUBLIC, 'content.json'), 'utf8'))
  } catch {
    return {}
  }
}

const writeContent = async (c) => {
  c.stamp = Date.now() // cache-bust marker — bumped on every admin write
  const s = JSON.stringify(c, null, 2)
  await writeFile(path.join(PUBLIC, 'content.json'), s)
  await writeFile(path.join(DIST, 'content.json'), s)
}

const safeName = (name) =>
  String(name || 'file')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 180)

const safeSlug = (s) => String(s || '').replace(/[^a-z0-9-]/g, '').slice(0, 80)

// writes a media file into BOTH public/ and dist/, returns its site src
const putMedia = async (slug, dir, file, buf) => {
  const rel = path.join('media', 'brands', slug, dir, file)
  if (rel.includes('..')) throw new Error('bad path')
  for (const root of [PUBLIC, DIST]) {
    const abs = path.join(root, rel)
    if (!abs.startsWith(path.join(root, 'media'))) throw new Error('bad path')
    await mkdir(path.dirname(abs), { recursive: true })
    await writeFile(abs, buf)
  }
  return 'media/brands/' + slug + '/' + dir + '/' + file
}

const deleteMedia = async (slug, dir, file) => {
  const rel = path.join('media', 'brands', slug, dir, file)
  for (const root of [PUBLIC, DIST]) {
    const abs = path.join(root, rel)
    if (!abs.startsWith(path.join(root, 'media'))) continue
    try {
      await unlink(abs)
    } catch {
      /* already gone */
    }
  }
}

// ---- deleted-media trash: every delete is recoverable ---------------------
const TRASH_DIR = path.join(ROOT, '.admin-backups', 'trash')
const TRASH_INDEX = path.join(ROOT, '.admin-backups', 'trash.json')

const readTrash = async () => {
  try {
    return JSON.parse(await readFile(TRASH_INDEX, 'utf8'))
  } catch {
    return []
  }
}

const writeTrash = async (list) => {
  await mkdir(path.dirname(TRASH_INDEX), { recursive: true })
  await writeFile(TRASH_INDEX, JSON.stringify(list, null, 2))
}

// move a media file (by site src) out of both roots and into the trash dir.
// meta records how to put the content.json entry back on restore.
const trashFile = async (relSrc, meta) => {
  const src = String(relSrc || '').replace(/\\/g, '/')
  if (!src.startsWith('media/') || src.includes('..')) return null
  const name = path.basename(src)
  let buf = null
  for (const root of [PUBLIC, DIST]) {
    try {
      buf = await readFile(path.join(root, src))
      break
    } catch {
      /* try the other root */
    }
  }
  if (!buf) return null
  const id = 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  const file = id + '--' + name
  await mkdir(TRASH_DIR, { recursive: true })
  await writeFile(path.join(TRASH_DIR, file), buf)
  for (const root of [PUBLIC, DIST]) {
    try {
      await unlink(path.join(root, src))
    } catch {
      /* already gone in this root */
    }
  }
  const entry = {
    id,
    file,
    src,
    name,
    size: buf.length,
    kind: VIDEO_EXT.test(name) ? 'video' : 'image',
    at: Date.now(),
    meta: meta && typeof meta === 'object' ? meta : {},
  }
  const list = await readTrash()
  list.unshift(entry)
  await writeTrash(list)
  return entry
}

const trashDrop = async (id) => {
  const list = await readTrash()
  const e = list.find((x) => x.id === id)
  if (!e) return false
  try {
    await unlink(path.join(TRASH_DIR, e.file))
  } catch {
    /* already gone */
  }
  await writeTrash(list.filter((x) => x.id !== id))
  return true
}

// restore = file goes back to its src, content.json entry goes back in
const trashRestore = async (id) => {
  const list = await readTrash()
  const e = list.find((x) => x.id === id)
  if (!e) return null
  const buf = await readFile(path.join(TRASH_DIR, e.file))
  for (const root of [PUBLIC, DIST]) {
    const abs = path.normalize(path.join(root, e.src))
    await mkdir(path.dirname(abs), { recursive: true })
    await writeFile(abs, buf)
  }
  const content = await readContent()
  const m = e.meta || {}
  if (m.type === 'upload' && m.brand && m.section && m.item) {
    content.uploads = content.uploads || {}
    content.uploads[m.brand] = content.uploads[m.brand] || {}
    const arr = (content.uploads[m.brand][m.section] = content.uploads[m.brand][m.section] || [])
    if (!arr.some((x) => x && x.src === m.item.src)) arr.push(m.item)
  } else if (m.type === 'addition' && m.collection && m.item) {
    content.additions = content.additions || {}
    const arr = (content.additions[m.collection] = content.additions[m.collection] || [])
    if (!arr.some((x) => x && x.src === m.item.src)) arr.push(m.item)
  } else if (m.type === 'concept' && m.item) {
    const arr = (content.conceptImages = content.conceptImages || [])
    if (!arr.some((x) => x && x.id === m.item.id)) {
      const at = Math.min(Math.max(0, Number(m.index) || 0), arr.length)
      arr.splice(at, 0, m.item)
    }
  }
  await writeContent(content)
  await trashDrop(id)
  return content
}

// ---------------------------------------------------------------------------
// save & publish — build the site and push it to GitHub Pages
// ---------------------------------------------------------------------------
const PUBLISH_STATE = path.join(ROOT, '.admin-backups', 'publish.json')

let publishRun = null // { running, phase, startedAt, endedAt, ok, error, log: string[] }

const readPublishState = async () => {
  try {
    return JSON.parse(await readFile(PUBLISH_STATE, 'utf8'))
  } catch {
    return null
  }
}

// newest mtime across everything the admin panel edits (content + media)
const latestContentMtime = async () => {
  let newest = 0
  const touch = async (p) => {
    try {
      const stt = await stat(p)
      if (stt.isDirectory()) {
        for (const e of await readdir(p)) await touch(path.join(p, e))
      } else if (stt.mtimeMs > newest) newest = stt.mtimeMs
    } catch {}
  }
  await touch(path.join(PUBLIC, 'content.json'))
  await touch(path.join(PUBLIC, 'media'))
  return newest
}

const runShell = (cmd, onLine) =>
  new Promise((resolve) => {
    const child = spawn(cmd, { cwd: ROOT, shell: true })
    child.stdout.on('data', (d) => onLine(String(d)))
    child.stderr.on('data', (d) => onLine(String(d)))
    child.on('error', () => resolve(1))
    child.on('close', (code) => resolve(code ?? 1))
  })

const startPublish = () => {
  if (publishRun && publishRun.running) return false
  const run = { running: true, phase: 'building', startedAt: Date.now(), endedAt: null, ok: null, error: null, log: [] }
  publishRun = run
  const log = (s) => {
    for (const line of s.replace(/\x1b\[[0-9;]*m/g, '').split('\n')) {
      if (!line.trim()) continue
      run.log.push(line.trimEnd())
    }
    if (run.log.length > 160) run.log.splice(0, run.log.length - 160)
  }
  ;(async () => {
    try {
      log('> npm run build')
      let code = await runShell('npm run build', log)
      if (code !== 0) throw new Error('build failed (exit ' + code + ') — nothing was published')
      run.phase = 'publishing'
      const msg = 'Admin publish ' + new Date().toISOString().slice(0, 16).replace('T', ' ')
      code = await runShell('npx gh-pages -d dist -m "' + msg + '"', log)
      if (code !== 0) throw new Error('push to GitHub failed (exit ' + code + ')')
      run.phase = 'done'
      run.ok = true
      await mkdir(path.dirname(PUBLISH_STATE), { recursive: true })
      await writeFile(PUBLISH_STATE, JSON.stringify({ at: Date.now(), mtime: await latestContentMtime() }))
    } catch (e) {
      run.ok = false
      run.error = String((e && e.message) || e)
      run.phase = 'error'
    } finally {
      run.running = false
      run.endedAt = Date.now()
    }
  })()
  return true
}

const cache = {} // don't re-read body twice on dry-run flows

const onApi = async (req, res) => {
  const url = new URL(req.url, 'http://x')

  if (req.method === 'GET' && url.pathname === '/api/content') {
    return json(res, 200, await readContent())
  }

  if (req.method === 'GET' && url.pathname === '/api/trash') {
    return json(res, 200, { items: await readTrash() })
  }

  if (req.method === 'GET' && url.pathname === '/api/publish/status') {
    const last = await readPublishState()
    const dirty = last ? (await latestContentMtime()) > Number(last.mtime) + 500 : true
    return json(res, 200, {
      running: !!(publishRun && publishRun.running),
      phase: (publishRun && publishRun.phase) || 'idle',
      ok: publishRun ? publishRun.ok : null,
      error: (publishRun && publishRun.error) || null,
      startedAt: (publishRun && publishRun.startedAt) || null,
      endedAt: (publishRun && publishRun.endedAt) || null,
      logTail: publishRun ? publishRun.log.slice(-40) : [],
      last,
      dirty,
    })
  }

  if (req.method !== 'POST') return json(res, 405, { error: 'method not allowed' })

  let body
  try {
    body = JSON.parse(await readBody(req))
  } catch (e) {
    return json(res, 400, { error: 'bad json: ' + e.message })
  }
  const content = await readContent()
  const slug = safeSlug(body.brand)

  try {
    if (url.pathname === '/api/publish') {
      if (!startPublish()) return json(res, 200, { ok: true, alreadyRunning: true })
      return json(res, 200, { ok: true, started: true })
    }

    if (url.pathname === '/api/upload') {
      const section = body.section in SECTION_DIRS ? body.section : 'stills'
      const dir = SECTION_DIRS[section]
      const files = Array.isArray(body.files) ? body.files : []
      if (!slug) return json(res, 400, { error: 'brand is required' })
      if (files.length === 0) return json(res, 400, { error: 'no files' })
      const saved = []
      for (const f of files) {
        const name = safeName(f.name || 'file')
        const buf = Buffer.from(String(f.data || ''), 'base64')
        if (buf.length === 0) return json(res, 400, { error: 'empty file: ' + name })
        const src = await putMedia(slug, dir, name, buf)
        const kind = VIDEO_EXT.test(name) ? 'video' : 'image'
        const label = String(body.label || '').trim() || name.replace(/\.[^.]+$/, '').replace(/_/g, ' ')
        saved.push({ kind, label, src })
      }
      content.uploads = content.uploads || {}
      content.uploads[slug] = content.uploads[slug] || {}
      content.uploads[slug][section] = [
        ...(content.uploads[slug][section] || []),
        ...saved,
      ]
      await writeContent(content)
      return json(res, 200, { ok: true, saved, content })
    }

    if (url.pathname === '/api/remove') {
      const section = body.section in SECTION_DIRS ? body.section : body.section
      const id = String(body.src || body.label || '')
      if (!slug || !id) return json(res, 400, { error: 'brand and item are required' })

      // restore = put a previously removed base item back
      if (body.restore) {
        content.removedItems = content.removedItems || {}
        content.removedItems[slug] = content.removedItems[slug] || {}
        const list = content.removedItems[slug][section] || []
        content.removedItems[slug][section] = list.filter((x) => x !== id)
        await writeContent(content)
        return json(res, 200, { ok: true, content })
      }

      // uploaded item? parse its src and move the file to the trash (restorable)
      const m = id.match(/^media\/brands\/([a-z0-9-]+)\/(stills|animatic|film)\/(.+)$/)
      let trashed = false
      if (m && content.uploads?.[slug]?.[section]) {
        const list = content.uploads[slug][section] || []
        const hit = list.find((x) => x && (x.src === id || (x.label || '') === id))
        if (hit) {
          content.uploads[slug][section] = list.filter((x) => x !== hit)
          await trashFile(hit.src || id, { type: 'upload', brand: slug, section, item: hit })
          trashed = true
        }
      }
      // not an uploaded file? treat as a base-item removal (file kept)
      if (!trashed) {
        content.removedItems = content.removedItems || {}
        content.removedItems[slug] = content.removedItems[slug] || {}
        const list = content.removedItems[slug][section] || []
        if (!list.includes(id)) list.push(id)
        content.removedItems[slug][section] = list
      }
      await writeContent(content)
      return json(res, 200, { ok: true, content })
    }

    if (url.pathname === '/api/sections') {
      content.hiddenSections = content.hiddenSections || {}
      content.hiddenSections[slug] = Array.isArray(body.hidden) ? body.hidden : []
      await writeContent(content)
      return json(res, 200, { ok: true, content })
    }

    if (url.pathname === '/api/page') {
      content.pageSections = Array.isArray(body.hidden) ? body.hidden : []
      await writeContent(content)
      return json(res, 200, { ok: true, content })
    }

    // ---- admin v2: words / pictures / sections --------------------------

    // texts — every editable word. { updates: { key: string | string[] | null } }
    // null deletes the key (revert to the compiled default).
    if (url.pathname === '/api/text') {
      const updates = body.updates && typeof body.updates === 'object' ? body.updates : null
      if (!updates) return json(res, 400, { error: 'updates object is required' })
      content.texts = content.texts || {}
      for (const [k, v] of Object.entries(updates)) {
        const key = String(k).slice(0, 200)
        if (v === null || v === undefined) {
          delete content.texts[key]
          continue
        }
        if (typeof v === 'string') {
          content.texts[key] = v.slice(0, 20000)
          continue
        }
        if (Array.isArray(v)) {
          content.texts[key] = v.map((x) => String(x).slice(0, 5000)).slice(0, 200)
          continue
        }
        return json(res, 400, { error: 'bad value for ' + key })
      }
      await writeContent(content)
      return json(res, 200, { ok: true, content })
    }

    // sectionOrder — visible sections + order per page: 'home' | 'brand' | 'project'
    if (url.pathname === '/api/order') {
      const page = ['home', 'brand', 'project'].includes(String(body.page))
        ? String(body.page)
        : null
      const order = Array.isArray(body.order)
        ? body.order.map((x) => String(x).slice(0, 60)).slice(0, 100)
        : null
      if (!page || !order) return json(res, 400, { error: 'page + order are required' })
      content.sectionOrder = content.sectionOrder || {}
      content.sectionOrder[page] = order
      await writeContent(content)
      return json(res, 200, { ok: true, content })
    }

    // trash — restore or permanently drop deleted media files
    if (url.pathname === '/api/trash/restore') {
      const id = String(body.id || '')
      const c = await trashRestore(id)
      if (!c) return json(res, 404, { error: 'trash item not found' })
      return json(res, 200, { ok: true, content: c })
    }

    if (url.pathname === '/api/trash/purge') {
      if (body.all === true) {
        const list = await readTrash()
        for (const e of list) await trashDrop(e.id)
        return json(res, 200, { ok: true, purged: list.length })
      }
      const gone = await trashDrop(String(body.id || ''))
      return json(res, gone ? 200 : 404, { ok: gone })
    }

    // media/replace — overwrite one media file IN PLACE (compiled srcs stay
    // valid). Keeps the original filename; backs up the previous file once
    // per replace under .admin-backups/.
    if (url.pathname === '/api/media/replace') {
      const src = String(body.src || '').replace(/\\/g, '/')
      const f = body.file || {}
      const buf = Buffer.from(String(f.data || ''), 'base64')
      if (!buf.length) return json(res, 400, { error: 'empty file' })
      if (!src.startsWith('media/') || src.includes('..')) return json(res, 400, { error: 'bad src' })
      for (const root of [PUBLIC, DIST]) {
        const abs = path.normalize(path.join(root, src))
        if (!abs.startsWith(path.join(root, 'media') + path.sep)) return json(res, 400, { error: 'bad path' })
        try {
          const prev = await readFile(abs)
          const bak = path.join(root, '.admin-backups', src.split('/').join('__') + '.' + Date.now())
          await mkdir(path.dirname(bak), { recursive: true })
          await writeFile(bak, prev)
        } catch {
          /* no previous file — nothing to back up */
        }
        await mkdir(path.dirname(abs), { recursive: true })
        await writeFile(abs, buf)
      }
      return json(res, 200, { ok: true, src, bytes: buf.length })
    }

    // media/remove — hide a media item everywhere it renders (by src).
    // { restore: true } puts it back. No files are deleted.
    if (url.pathname === '/api/media/remove') {
      const src = String(body.src || '')
      if (!src) return json(res, 400, { error: 'src is required' })
      const set = new Set(Array.isArray(content.removedMedia) ? content.removedMedia : [])
      if (body.restore) set.delete(src)
      else set.add(src)
      content.removedMedia = [...set]
      await writeContent(content)
      return json(res, 200, { ok: true, content })
    }

    // project/remove — take a WHOLE case study off the site (its home card,
    // its page, brand listings). { restore: true } puts it back. Data is kept:
    // this only writes an overlay list, projects.ts is never touched.
    if (url.pathname === '/api/project/remove') {
      const ps = safeSlug(body.slug)
      if (!ps) return json(res, 400, { error: 'slug is required' })
      const set = new Set(Array.isArray(content.removedProjects) ? content.removedProjects : [])
      if (body.restore) set.delete(ps)
      else set.add(ps)
      content.removedProjects = [...set]
      await writeContent(content)
      return json(res, 200, { ok: true, content })
    }

    // media/add — add new pictures to a collection:
    //   "project:<slug>:results" | "showcase" | "workflows"
    if (url.pathname === '/api/media/add') {
      const coll = String(body.collection || '')
      if (!/^(project:[a-z0-9-]+:results|showcase|workflows)$/.test(coll)) {
        return json(res, 400, { error: 'bad collection' })
      }
      const files = Array.isArray(body.files) ? body.files : []
      if (!files.length) return json(res, 400, { error: 'no files' })
      const dirName = coll.replace(/[^a-z0-9-]+/gi, '-').toLowerCase()
      const saved = []
      for (const f of files) {
        const name = 'a' + Date.now().toString(36) + '-' + safeName(f.name || 'file')
        const buf = Buffer.from(String(f.data || ''), 'base64')
        if (!buf.length) return json(res, 400, { error: 'empty file: ' + name })
        const rel = 'media/added/' + dirName + '/' + name
        for (const root of [PUBLIC, DIST]) {
          const abs = path.normalize(path.join(root, rel))
          await mkdir(path.dirname(abs), { recursive: true })
          await writeFile(abs, buf)
        }
        const label =
          String(body.label || '').trim() ||
          name.replace(/^a[a-z0-9]+-/, '').replace(/\.[^.]+$/, '').replace(/_/g, ' ')
        const item = { kind: VIDEO_EXT.test(name) ? 'video' : 'image', label, src: rel }
        saved.push(item)
      }
      content.additions = content.additions || {}
      content.additions[coll] = [...(content.additions[coll] || []), ...saved]
      await writeContent(content)
      return json(res, 200, { ok: true, added: saved, content })
    }

    // media/edit — rename an added item's label, or remove it entirely
    if (url.pathname === '/api/media/edit') {
      const coll = String(body.collection || '')
      const src = String(body.src || '')
      const patch = body.patch && typeof body.patch === 'object' ? body.patch : {}
      const list = content.additions?.[coll]
      if (!Array.isArray(list)) return json(res, 404, { error: 'collection not found' })
      const item = list.find((m) => m && m.src === src)
      if (!item) return json(res, 404, { error: 'item not found' })
      if (typeof patch.label === 'string') item.label = patch.label.slice(0, 300)
      if (patch.remove === true) {
        if (String(item.src || '').startsWith('media/added/')) {
          await trashFile(item.src, { type: 'addition', collection: coll, item })
        }
        content.additions[coll] = list.filter((x) => x !== item)
      }
      await writeContent(content)
      return json(res, 200, { ok: true, content })
    }
  } catch (e) {
    return json(res, 500, { error: String(e && e.message || e) })
  }

  return json(res, 404, { error: 'unknown api: ' + url.pathname })
}

const serveStatic = async (req, res) => {
  const url = new URL(req.url, 'http://x')
  let p = decodeURIComponent(url.pathname)
  if (p === '/') p = '/index.html'
  if (p.startsWith('/__trash/')) {
    const id = p.slice('/__trash/'.length)
    const list = await readTrash()
    const e = list.find((x) => x.id === id)
    if (!e) {
      res.writeHead(404)
      return res.end('gone')
    }
    try {
      const buf = await readFile(path.join(TRASH_DIR, e.file))
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(e.file).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      })
      return res.end(buf)
    } catch {
      res.writeHead(404)
      return res.end('gone')
    }
  }
  const abs = path.normalize(path.join(DIST, p))
  if (!abs.startsWith(DIST)) {
    res.writeHead(403)
    return res.end('forbidden')
  }
  try {
    const buf = await readFile(abs)
    const type = MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream'
    // no-store locally: replaced media files keep their names, so the browser
    // must revalidate every request while the admin is working on the site
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' })
    res.end(buf)
  } catch {
    // SPA fallback
    try {
      const buf = await readFile(path.join(DIST, 'index.html'))
      res.writeHead(200, { 'Content-Type': MIME['.html'] })
      res.end(buf)
    } catch {
      res.writeHead(503, { 'Content-Type': 'text/plain' })
      res.end('dist/ not found. Run: npm run build')
    }
  }
}

const server = http.createServer(__withConceptRoutes((req, res) => {
  const url = new URL(req.url, 'http://x')
  if (url.pathname.startsWith('/api/')) {
    onApi(req, res).catch((e) => {
      try {
        json(res, 500, { error: String(e && e.message || e) })
      } catch {}
    })
  } else {
    serveStatic(req, res).catch((e) => {
      try {
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end('server error: ' + String(e && e.message || e))
      } catch {}
    })
  }
}))

server.listen(PORT, HOST, () => {
  console.log('')
  console.log('  portfolio admin server')
  console.log(`  site   : http://${HOST}:${PORT}/`)
  console.log(`  admin  : http://${HOST}:${PORT}/#/admin`)
  console.log('  uploads -> public/media/brands/... (survives rebuild, ships on deploy)')
  console.log('  publish: npm run build && npx gh-pages -d dist')
  console.log('')
})

// =================== concept images API (added for the Concept images section) ===================
function __conceptRoutes(req, res) {
  return (async () => {
    const p = String((req.url || '').split('?')[0]);
    if (!p.startsWith('/api/concept/')) return false;
    const fs = await import('node:fs/promises');
    const path = (await import('node:path')).default;
    const { fileURLToPath } = await import('node:url');
    const HERE = path.dirname(fileURLToPath(import.meta.url));
    const PUB = path.join(HERE, 'public');
    const DIST = path.join(HERE, 'dist');
    const send = (code, obj) => {
      res.writeHead(code, { 'content-type': 'application/json' });
      res.end(JSON.stringify(obj));
    };
    const readBody = async () => {
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const raw = Buffer.concat(chunks).toString('utf8');
      try { return JSON.parse(raw || '{}'); } catch { return {}; }
    };
    const safeName = (n) => {
      let s = String(n || 'file').split(/[\\/]/).pop() || 'file';
      s = s.replace(/[^a-zA-Z0-9._-]+/g, '_').replace(/_+/g, '_');
      if (!s || /^\.+$/.test(s) || s.startsWith('.')) s = 'img' + Date.now() + '-' + s;
      return s.slice(-120);
    };
    const makeId = () => 'c_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    const isVideo = (n) => /\.(mp4|webm|mov|m4v)$/i.test(String(n));
    const putMedia = async (rel, buf) => {
      for (const root of [PUB, DIST]) {
        const abs = path.normalize(path.join(root, 'media', rel));
        if (!abs.startsWith(path.join(root, 'media') + path.sep)) throw new Error('bad path');
        await fs.mkdir(path.dirname(abs), { recursive: true });
        await fs.writeFile(abs, buf);
      }
      return 'media/' + rel.split(path.sep).join('/');
    };
    const delMedia = async (rel) => {
      for (const root of [PUB, DIST]) {
        const abs = path.normalize(path.join(root, 'media', rel));
        if (!abs.startsWith(path.join(root, 'media') + path.sep)) continue;
        try { await fs.unlink(abs); } catch {}
      }
    };
    // deleted concept files go to the shared trash (restorable from the panel)
    const TRASH_DIR = path.join(HERE, '.admin-backups', 'trash');
    const TRASH_INDEX = path.join(HERE, '.admin-backups', 'trash.json');
    const readTrash = async () => {
      try { return JSON.parse(await fs.readFile(TRASH_INDEX, 'utf8')); } catch { return []; }
    };
    const writeTrash = async (list) => {
      await fs.mkdir(path.dirname(TRASH_INDEX), { recursive: true });
      await fs.writeFile(TRASH_INDEX, JSON.stringify(list, null, 2));
    };
    const trashOld = async (relSrc, meta) => {
      if (!relSrc) return null;
      let buf = null;
      for (const root of [PUB, DIST]) {
        try { buf = await fs.readFile(path.join(root, relSrc)); break; } catch {}
      }
      if (!buf) return null;
      const name = path.basename(relSrc);
      const id = 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      const file = id + '--' + name;
      await fs.mkdir(TRASH_DIR, { recursive: true });
      await fs.writeFile(path.join(TRASH_DIR, file), buf);
      for (const root of [PUB, DIST]) { try { await fs.unlink(path.join(root, relSrc)); } catch {} }
      const entry = { id, file, src: relSrc, name, size: buf.length, kind: isVideo(name) ? 'video' : 'image', at: Date.now(), meta: meta || {} };
      const list = await readTrash(); list.unshift(entry); await writeTrash(list);
      return entry;
    };
    const readContent = async () => {
      for (const f of [path.join(PUB, 'content.json'), path.join(DIST, 'content.json')]) {
        try { return JSON.parse(await fs.readFile(f, 'utf8')); } catch {}
      }
      return {};
    };
    const writeContent = async (obj) => {
      obj.stamp = Date.now()
      const s = JSON.stringify(obj, null, 2)
      try { await fs.writeFile(path.join(PUB, 'content.json'), s); } catch {}
      try { await fs.writeFile(path.join(DIST, 'content.json'), s); } catch {}
    };

    if (req.method !== 'POST') { send(405, { error: 'POST only' }); return true; }
    const body = await readBody();
    const content = await readContent();
    if (!Array.isArray(content.conceptImages)) content.conceptImages = [];

    if (p === '/api/concept/upload') {
      const caption = String(body.caption || '').trim().slice(0, 300);
      const group = body.group === 'photos' ? 'photos' : undefined;
      const files = Array.isArray(body.files) ? body.files : [];
      if (!files.length) { send(400, { error: 'no files' }); return true; }
      const used = new Set(content.conceptImages.map((x) => x && x.src));
      const saved = [];
      for (const f of files) {
        let name = safeName(f && f.name);
        const buf = Buffer.from(String((f && f.data) || ''), 'base64');
        if (!buf.length) { send(400, { error: 'empty file: ' + name }); return true; }
        let src = 'media/concept/' + name;
        if (used.has(src)) { name = makeId() + '-' + name; src = 'media/concept/' + name; }
        await putMedia(path.join('concept', name), buf);
        const item = { id: makeId(), kind: isVideo(name) ? 'video' : 'image', src, caption, ...(group ? { group } : {}) };
        used.add(src);
        content.conceptImages.push(item);
        saved.push(item);
      }
      await writeContent(content);
      send(200, { ok: true, saved, count: content.conceptImages.length, content });
      return true;
    }

    const findItem = (id) => content.conceptImages.find((x) => x && x.id === id);

    if (p === '/api/concept/edit') {
      const item = findItem(String(body.id || ''));
      if (!item) { send(400, { error: 'item not found' }); return true; }
      item.caption = String(body.caption == null ? '' : body.caption).trim().slice(0, 300);
      await writeContent(content);
      send(200, { ok: true, content });
      return true;
    }

    if (p === '/api/concept/reorder') {
      const id = String(body.id || '');
      const dir = String(body.dir || '');
      const list = content.conceptImages;
      const i = list.findIndex((x) => x && x.id === id);
      if (i < 0) { send(400, { error: 'item not found' }); return true; }
      const j = dir === 'up' ? i - 1 : dir === 'down' ? i + 1 : i;
      if (j >= 0 && j < list.length && j !== i) {
        const it = list.splice(i, 1)[0];
        list.splice(j, 0, it);
        await writeContent(content);
      }
      send(200, { ok: true, content });
      return true;
    }

    if (p === '/api/concept/replace') {
      const item = findItem(String(body.id || ''));
      if (!item) { send(400, { error: 'item not found' }); return true; }
      const f = body.file || {};
      const name = safeName(f.name);
      const buf = Buffer.from(String(f.data || ''), 'base64');
      if (!buf.length) { send(400, { error: 'empty file' }); return true; }
      if (String(item.src || '').startsWith('media/concept/')) {
        await trashOld(item.src, { type: 'file', note: 'previous image replaced by ' + name });
      }
      let finalName = name;
      let src = 'media/concept/' + finalName;
      const usedElsewhere = content.conceptImages.some((x) => x !== item && x && x.src === src);
      if (usedElsewhere) { finalName = makeId() + '-' + finalName; src = 'media/concept/' + finalName; }
      await putMedia(path.join('concept', finalName), buf);
      item.src = src;
      item.kind = isVideo(finalName) ? 'video' : 'image';
      await writeContent(content);
      send(200, { ok: true, content });
      return true;
    }

    if (p === '/api/concept/remove') {
      const item = findItem(String(body.id || ''));
      if (!item) { send(400, { error: 'item not found' }); return true; }
      if (String(item.src || '').startsWith('media/concept/')) {
        await trashOld(item.src, { type: 'concept', item, index: content.conceptImages.indexOf(item) });
      }
      content.conceptImages = content.conceptImages.filter((x) => x !== item);
      await writeContent(content);
      send(200, { ok: true, content });
      return true;
    }

    send(404, { error: 'unknown concept route' });
    return true;
  })();
}

function __withConceptRoutes(next) {
  return async function conceptWrapped(req, res) {
    try {
      if (await __conceptRoutes(req, res)) return;
    } catch (e) {
      try {
        res.writeHead(500, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ error: String((e && e.message) || e) }));
      } catch {}
      return;
    }
    return next(req, res);
  };
}
// ================= end concept images API =================

