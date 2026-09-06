import LinkedInIcon from './LinkedInIcon'
import { LINKEDIN_URL, EMAIL } from '../data/social'

export default function Footer() {
  return (
    <footer className="site-footer border-t border-ink-950 bg-ink-950 py-10">
      <div className="container-site flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-sm font-extrabold uppercase tracking-tight text-snow">
            Syed Abdul Wasay Ali
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wideish text-snow/60">
            ai creative technologist · <span className="co-ogilvy">ogilvy</span> · ex-<span className="co-cleandirty">cleandirty.ai</span>
          </p>
        </div>
        <div className="flex gap-5">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wideish text-snow/60 transition-colors hover:text-neonBlue"
          >
            <LinkedInIcon className="h-3.5 w-3.5" />
            linkedin
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="font-mono text-[11px] uppercase tracking-wideish text-snow/60 transition-colors hover:text-neonBlue"
          >
            email
          </a>
        </div>
      </div>
      <p className="container-site mt-6 font-mono text-[10px] text-snow/40">
        rendered with open-source everything · {new Date().getFullYear()}
      </p>
    </footer>
  )
}
