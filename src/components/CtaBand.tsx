import LinkedInIcon from './LinkedInIcon'
import { LINKEDIN_URL, EMAIL } from '../data/social'
import { useT } from '../data/runtime'

// Contact close: one clear ask before the footer — the dark statement panel.
export default function CtaBand() {
  const t = useT()
  const linkedinUrl = t('social.linkedin', LINKEDIN_URL)
  const email = t('social.email', EMAIL)

  return (
    <section className="border-b border-ink-600 py-12 sm:py-16">
      <div className="container-site">
        <div className="panel-dark relative overflow-hidden p-6 sm:p-10">
          <div aria-hidden="true" className="orb left-[-10%] top-[-40%] h-64 w-64 bg-skyBlue/10" />
          <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow-green eyebrow-on-dark">{t('contact.tag')}</p>
              <h2 className="mt-2 font-display text-3xl font-black uppercase leading-tight tracking-tight text-snow sm:text-5xl">
                {t('contact.title')}
              </h2>
              <p className="mt-4 max-w-xl text-snow/70">{t('contact.sub')}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href={`mailto:${email}`} className="btn-green-dark">
                  {t('contact.email')}
                </a>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost-dark"
                  aria-label="View LinkedIn profile"
                >
                  <LinkedInIcon className="h-4 w-4" />
                  {t('contact.linkedin')}
                </a>
              </div>
            </div>
            <dl className="space-y-3 border-t border-snow/15 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div className="flex justify-between gap-4 border-b border-snow/10 pb-2.5">
                <dt className="font-mono text-[11px] text-snow/50">{t('contact.row1.label')}</dt>
                <dd className="font-mono text-[11px] text-snow">{email}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-snow/10 pb-2.5">
                <dt className="font-mono text-[11px] text-snow/50">{t('contact.row2.label')}</dt>
                <dd className="font-mono text-[11px] text-right text-snow">
                  {t('contact.row2.value')}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-mono text-[11px] text-snow/50">{t('contact.row3.label')}</dt>
                <dd className="font-mono text-[11px] text-snow">{t('contact.row3.value')}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
