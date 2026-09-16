import LinkedInIcon from './LinkedInIcon'
import { LINKEDIN_URL, EMAIL } from '../data/social'

// Contact close: one clear ask before the footer.
export default function CtaBand() {
  return (
    <section className="border-b border-ink-600 py-12 sm:py-16">
      <div className="container-site">
        <div className="panel relative overflow-hidden p-6 sm:p-10">
          <div aria-hidden="true" className="orb left-[-10%] top-[-40%] h-64 w-64 bg-green/10" />
          <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow-green">11 / contact</p>
              <h2 className="mt-2 font-display text-3xl font-black uppercase leading-tight tracking-tight sm:text-5xl">
                Let&rsquo;s build the next visual system.
              </h2>
              <p className="mt-4 max-w-xl text-muted">
                Available for AI image generation, product visualization, commercial creative and
                AI production workflow projects.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href={`mailto:${EMAIL}`} className="btn-green">
                  email me
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost"
                  aria-label="View LinkedIn profile"
                >
                  <LinkedInIcon className="h-4 w-4" />
                  connect on linkedin
                </a>
              </div>
            </div>
            <dl className="space-y-3 border-t border-ink-600 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div className="flex justify-between gap-4 border-b border-ink-700 pb-2.5">
                <dt className="font-mono text-[11px] text-slateAccent">email</dt>
                <dd className="font-mono text-[11px] text-paper">{EMAIL}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-ink-700 pb-2.5">
                <dt className="font-mono text-[11px] text-slateAccent">linkedin</dt>
                <dd className="font-mono text-[11px] text-right text-paper">
                  in/syed-abdul-wasay-ali
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-mono text-[11px] text-slateAccent">based in</dt>
                <dd className="font-mono text-[11px] text-paper">hyderabad, india · remote-ready</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
