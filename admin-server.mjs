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
//
// Uploads land in public/media/brands/<slug>/<stills|animatic|film>/ AND in
// dist/media/... (so they show instantly). content.json is written to both
// public/ (survives npm run build) and dist/ (served immediately).
// Publishing your admin changes: npm run build && npx gh-pages -d dist
// ---------------------------------------------------------------------------
import http from 'node:http'
import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises'
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

const cache = {} // don't re-read body twice on dry-run flows

const onApi = async (req, res) => {
  const url = new URL(req.url, 'http://x')

  if (req.method === 'GET' && url.pathname === '/api/content') {
    return json(res, 200, await readContent())
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

      // uploaded item? parse its src and delete the files
      const m = id.match(/^media\/brands\/([a-z0-9-]+)\/(stills|animatic|film)\/(.+)$/)
      if (m && content.uploads?.[slug]?.[section]) {
        const list = content.uploads[slug][section] || []
        const before = list.length
        content.uploads[slug][section] = list.filter((x) => x.src !== id && (x.label || '') !== id)
        if (content.uploads[slug][section].length !== before) {
          await deleteMedia(m[1], m[2], m[3])
        }
      }
      // still present? treat as a base-item removal (no file delete)
      const elsewhere = m ? content.uploads?.[slug]?.[section]?.some((x) => x.src === id || x.label === id) : false
      if (!m || !elsewhere) {
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
  } catch (e) {
    return json(res, 500, { error: String(e && e.message || e) })
  }

  return json(res, 404, { error: 'unknown api: ' + url.pathname })
}

const serveStatic = async (req, res) => {
  const url = new URL(req.url, 'http://x')
  let p = decodeURIComponent(url.pathname)
  if (p === '/') p = '/index.html'
  const abs = path.normalize(path.join(DIST, p))
  if (!abs.startsWith(DIST)) {
    res.writeHead(403)
    return res.end('forbidden')
  }
  try {
    const buf = await readFile(abs)
    const type = MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream'
    res.writeHead(200, { 'Content-Type': type })
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

const server = http.createServer((req, res) => {
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
})

server.listen(PORT, HOST, () => {
  console.log('')
  console.log('  portfolio admin server')
  console.log(`  site   : http://${HOST}:${PORT}/`)
  console.log(`  admin  : http://${HOST}:${PORT}/#/admin`)
  console.log('  uploads -> public/media/brands/... (survives rebuild, ships on deploy)')
  console.log('  publish: npm run build && npx gh-pages -d dist')
  console.log('')
})
