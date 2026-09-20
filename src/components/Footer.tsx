import LinkedInIcon from './LinkedInIcon'
import GitHubIcon from './GitHubIcon'
import KineticMarquee from './KineticMarquee'
import { LINKEDIN_URL, GITHUB_URL, EMAIL, RESUME_URL } from '../data/social'
import { useT } from '../data/runtime'

export default function Footer() {
  const t = useT()
  const year = new Date().getFullYear()
  const resumeUrl = t('social.resume', RESUME_URL)
  const linkedinUrl = t('social.linkedin', LINKEDIN_URL)
  const githubUrl = t('social.github', GITHUB_URL)
  const email = t('social.email', EMAIL)

  return (
    <footer className="site-footer bg-charcoal">
      <KineticMarquee
        variant="ghost"
        speed={44}
        items={[t('footer.m1'), t('footer.m2'), t('footer.m3')]}
      />
      {/* the end card — charcoal block, warm light type, light blue hovers (dark section) */}
      <div className="border-t border-snow/10 bg-charcoal text-snow">
        <div className="container-site flex flex-col items-start justify-between gap-6 pt-10 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-sm uppercase tracking-tight text-snow">
              {t('footer.name')}
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wideish text-snow/70">
              {t('footer.tagline')}
            </p>
          </div>
          <div className="flex flex-wrap gap-5">
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wideish text-snow/70 transition-colors hover:text-skyBlue"
            >
              <LinkedInIcon className="h-3.5 w-3.5" />
              {t('footer.linkedin')}
            </a>
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wideish text-snow/70 transition-colors hover:text-skyBlue"
            >
              <GitHubIcon className="h-3.5 w-3.5" />
              {t('footer.github')}
            </a>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[11px] uppercase tracking-wideish text-snow/70 transition-colors hover:text-skyBlue"
            >
              {t('footer.resume')}
            </a>
            <a
              href={`mailto:${email}`}
              className="font-mono text-[11px] uppercase tracking-wideish text-snow/70 transition-colors hover:text-skyBlue"
            >
              {t('footer.email')}
            </a>
            <a
              href="#/admin"
              className="rounded-md border border-snow/20 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wideish text-snow/70 transition-colors hover:border-skyBlue hover:text-skyBlue"
            >
              {t('footer.admin')}
            </a>
          </div>
        </div>
        <p className="container-site pb-8 pt-6 font-mono text-[11px] text-snow/75">
          {t('footer.credits').replace('{year}', String(year))}
        </p>
      </div>
    </footer>
  )
}
