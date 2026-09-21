// scan-data-strings.mjs: compile the site data and check every string value
// for dash-removal artifacts: unbalanced parens, stray ") word" patterns.
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const ROOT = 'C:/Users/syeda/syed-portfolio'
const OUT = path.join(ROOT, 'node_modules', '.cache', 'scan')
fs.rmSync(OUT, { recursive: true, force: true })
fs.mkdirSync(OUT, { recursive: true })
const tsc = spawnSync(
  process.execPath,
  [
    path.join(ROOT, 'node_modules', 'typescript', 'bin', 'tsc'),
    'src/data/projects.ts', 'src/data/showcase.ts', 'src/data/brands.ts', 'src/data/workflows.ts',
    'src/data/text.ts', 'src/data/social.ts',
    '--outDir', OUT, '--module', 'esnext', '--target', 'es2022', '--moduleResolution', 'bundler',
    '--jsx', 'preserve', '--skipLibCheck', '--noCheck', '--ignoreConfig',
  ],
  { cwd: ROOT, encoding: 'utf8' }
)
if (tsc.status !== 0) { console.error(tsc.stdout, tsc.stderr); process.exit(1) }

const mods = {}
for (const n of ['projects', 'showcase', 'brands', 'workflows', 'text', 'social']) {
  mods[n] = await import(pathToFileURL(path.join(OUT, n + '.js')).href)
}

let flagged = 0
const seen = new Set()
function scan(o, trail) {
  if (typeof o === 'string') {
    if (o.length < 2) return
    const issues = []
    if ((o.match(/\(/g) || []).length !== (o.match(/\)/g) || []).length) issues.push('unbalanced-parens')
    // stray ") word" where no "(" earlier in the same string
    const idx = o.indexOf(')')
    if (idx >= 0 && o.indexOf('(') === -1) issues.push('has-close-no-open')
    if (issues.length && !seen.has(o)) {
      seen.add(o)
      flagged++
      console.log(`[${trail}] ${issues.join(',')}: ${o.slice(0, 130).replace(/\n/g, ' ')}`)
    }
  } else if (Array.isArray(o)) {
    o.forEach((v, i) => scan(v, `${trail}[${i}]`))
  } else if (o instanceof Map) {
    for (const [k, v] of o) scan(v, `${trail}.${k}`)
  } else if (o && typeof o === 'object') {
    for (const [k, v] of Object.entries(o)) scan(v, `${trail}.${k}`)
  }
}
for (const [n, m] of Object.entries(mods)) scan(m, n)
console.log('flagged strings:', flagged)
