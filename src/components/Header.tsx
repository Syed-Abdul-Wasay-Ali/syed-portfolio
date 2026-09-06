import { useEffect, useState } from 'react'
import LinkedInIcon from './LinkedInIcon'
import { LINKEDIN_URL } from '../data/social'

const LINKS = [
  { href: '#brands', label: 'Brands' },
  { href: '#work', label: 'Work' },
  { href: '#showcase', label: 'Showcase' },
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#about', label: 'About' },
]

export default function Header() {
  const [progress, setProgress] = useState(0)

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

  return (
    <header className="site-header fixed inset-x-0 top-0 z-40 border-b border-green/25 bg-ink-950/85 backdrop-blur">
      {/* green top strip */}
      <div aria-hidden="true" className="header-strip absolute inset-x-0 top-0 h-[3px] bg-green" />
      <div className="container-site flex h-14 items-center justify-between">
        <a href="#/" className="flex items-baseline gap-2">
          <span className="font-display text-base font-extrabold tracking-tight text-paper">
            SYED ABDUL WASAY ALI
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-wideish text-violet md:inline">
            ai · creative · technologist
          </span>
        </a>
        <nav className="flex items-center gap-5">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="glitch-link font-mono text-[11px] uppercase tracking-wideish text-muted transition-colors hover:text-neonBlue"
            >
              {l.label}
            </a>
          ))}
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
        </nav>
      </div>
      {/* scroll progress */}
      <div
        aria-hidden="true"
        className="header-progress absolute bottom-0 left-0 h-[2px] bg-green transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </header>
  )
}
