import { useEffect, useState } from 'react'
import LinkedInIcon from './LinkedInIcon'
import GitHubIcon from './GitHubIcon'
import { LINKEDIN_URL, GITHUB_URL, RESUME_URL } from '../data/social'
import { useRuntime } from '../data/runtime'

// Nav order mirrors the home page section order (case studies first, brands last).
const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#showcase', label: 'Showcase' },
  { href: '#capabilities', label: 'Systems' },
  { href: '#brands', label: 'Brands' },
  { href: '#about', label: 'About' },
]

export default function Header() {
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState(false)
  const { content } = useRuntime()
  const hidden = content?.pageSections ?? []
  const links = LINKS.filter((l) => !hidden.includes(l.href.slice(1)))

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      setProgress(max > 0 ? Math.min(1, doc.scrollTop / max) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // close the mobile menu whenever the hash changes (link tapped)
  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('hashchange', close)
    return () => window.removeEventListener('hashchange', close)
  }, [])

  return (
    <header className="site-header fixed inset-x-0 top-0 z-40 border-b border-green/25 bg-ink-950/85 backdrop-blur">
      {/* magenta strip */}
      <div aria-hidden="true" className="header-strip absolute inset-x-0 top-0 h-[3px] bg-green" />
      <div className="container-site flex h-14 items-center justify-between">
        <a href="#/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span aria-hidden="true" className="disc h-2 w-2" />
          <span className="font-display text-base tracking-tight text-paper">
            SYED ABDUL WASAY ALI
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-wideish text-violet md:inline">
            ai · creative · technologist
          </span>
        </a>

        {/* desktop nav */}
        <nav className="hidden items-center gap-5 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="glitch-link font-mono text-[11px] uppercase tracking-wideish text-muted transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#/admin"
            className="rounded-md border border-ink-600 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wideish text-muted transition-colors hover:border-green hover:text-green"
          >
            admin
          </a>
          <a href={RESUME_URL} target="_blank" rel="noreferrer" className="btn-ghost !py-1.5">
            resume
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost !py-1.5"
            aria-label="View LinkedIn profile"
          >
            <LinkedInIcon className="h-3.5 w-3.5" />
            linkedin
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="text-muted transition-colors hover:text-green"
            aria-label="GitHub profile"
          >
            <GitHubIcon className="h-4 w-4" />
          </a>
        </nav>

        {/* mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-green/30 text-paper transition-colors hover:border-green hover:text-green md:hidden"
        >
          <span className="relative block h-3.5 w-5">
            <span
              className={`absolute left-0 top-0 h-[2px] w-full bg-current transition-transform duration-200 ${
                open ? 'translate-y-[6px] rotate-45' : ''
              }`}
            />
            <span
              className={`absolute left-0 top-[6px] h-[2px] w-full bg-current transition-opacity duration-200 ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`absolute left-0 top-[12px] h-[2px] w-full bg-current transition-transform duration-200 ${
                open ? '-translate-y-[6px] -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </div>

      {/* mobile dropdown panel */}
      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-green/20 bg-ink-950/95 backdrop-blur md:hidden"
        >
          <div className="container-site flex flex-col py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 font-mono text-sm uppercase tracking-wideish text-paper transition-colors hover:text-green"
              >
                {l.label}
              </a>
            ))}
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="btn-ghost mt-2 justify-center !py-2.5"
            >
              resume
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="btn-ghost mt-2 justify-center !py-2.5"
              aria-label="View LinkedIn profile"
            >
              <LinkedInIcon className="h-4 w-4" />
              linkedin
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="btn-ghost mt-2 justify-center !py-2.5"
              aria-label="GitHub profile"
            >
              <GitHubIcon className="h-4 w-4" />
              github
            </a>
            <a
              href="#/admin"
              onClick={() => setOpen(false)}
              className="mt-2 justify-center rounded-md border border-ink-600 px-4 py-1.5 font-mono text-[11px] uppercase tracking-wideish text-muted transition-colors hover:border-green hover:text-green"
            >
              admin
            </a>
          </div>
        </nav>
      )}

      {/* scroll progress */}
      <div
        aria-hidden="true"
        className="header-progress absolute bottom-0 left-0 h-[2px] bg-green transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </header>
  )
}
