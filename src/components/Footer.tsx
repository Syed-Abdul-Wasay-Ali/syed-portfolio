import LinkedInIcon from './LinkedInIcon'
import KineticMarquee from './KineticMarquee'
import { LINKEDIN_URL, EMAIL } from '../data/social'

export default function Footer() {
  return (
    <footer className="site-footer bg-ink-950">
      <KineticMarquee
        variant="ghost"
        speed={44}
        items={['Syed Abdul Wasay Ali', 'AI Creative Technologist', 'Open Source First']}
      />
      {/* polarity flip — the white end card */}
      <div className="bg-paper text-ink-950">
        <div className="container-site flex flex-col items-start justify-between gap-6 pt-10 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-sm uppercase tracking-tight text-ink-950">
              Syed Abdul Wasay Ali
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wideish text-ink-950/60">
              ai creative technologist · ogilvy · ex-cleandirty.ai
            </p>
          </div>
          <div className="flex gap-5">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wideish text-ink-950/60 transition-colors hover:text-green"
            >
              <LinkedInIcon className="h-3.5 w-3.5" />
              linkedin
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="font-mono text-[11px] uppercase tracking-wideish text-ink-950/60 transition-colors hover:text-green"
            >
              email
            </a>
            <a
              href="#/admin"
              className="rounded-md border border-ink-950/20 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wideish text-ink-950/60 transition-colors hover:border-green hover:text-green"
            >
              admin
            </a>
          </div>
        </div>
        <p className="container-site pb-8 pt-6 font-mono text-[10px] text-ink-950/50">
          rendered with open-source everything · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
