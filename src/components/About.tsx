import Reveal from './Reveal'
import LinkedInIcon from './LinkedInIcon'
import { LINKEDIN_URL } from '../data/social'

const TIMELINE = [
  {
    role: 'AI Creative Technologist — Group Account',
    org: 'Ogilvy',
    dates: 'Apr 2025 — Present',
    note: 'AI-native production for client campaigns: video pipelines, identity consistency, automation.',
  },
  {
    role: 'AI Head Artist',
    org: 'cleanDirty.ai',
    dates: 'Sep 2023 — Feb 2025',
    note: 'Led AI art direction and production: custom LoRAs, image & video generation systems, mocap pipelines.',
  },
]

const SKILLS = [
  'ComfyUI',
  'MiniMax H3',
  'Seedance 2.5',
  'Ideogram 4',
  'Krea 2',
  'Flux · Klein',
  'Z-Image Turbo',
  'Midjourney',
  'LTX / Wan',
  'LoRA training',
  'DiffSynth',
  'Python',
  'Blender',
  'Rokoko mocap',
  'Topaz upscale',
  'API automation',
  'MCP / agent workflows',
]

export default function About() {
  return (
    <section id="about" className="scroll-mt-16 py-14 sm:py-20">
      <div className="container-site grid gap-12 lg:grid-cols-2">
        <Reveal>
          <div>
          <p className="eyebrow-green">05 — about</p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
            The operator
            <br />
            behind the graph
          </h2>
          <p className="mt-6 leading-relaxed text-muted">
            I spend my days on the other side of the screen — building the workflows, training the
            LoRAs, tuning the samplers, and then automating the whole thing so nobody has to sit
            through another render. My job is to know when the open-source stack does the job
            better than the paid one, and to make that choice invisible in the final frame.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Everything below is documented the way I work: real models, real parameters, real
            obstacles — and the ComfyUI graphs that got past them.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {SKILLS.map((s) => (
              <span
                key={s}
                className="border border-ink-600 px-3 py-1 font-mono text-[11px] text-paper/85"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        </Reveal>

        <Reveal delay={140}>
        <div>
          <h3 className="eyebrow">Experience</h3>
          <ol className="mt-5 space-y-0">
            {TIMELINE.map((t) => (
              <li key={t.role} className="relative border-l border-ink-600 pb-8 pl-6 last:pb-0">
                <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-green" />
                <p className="font-mono text-[11px] uppercase tracking-wideish text-slateAccent">
                  {t.dates}
                </p>
                <h4 className="mt-1 font-display text-lg font-bold text-paper">{t.role}</h4>
                <p className={`font-mono text-xs ${t.org === 'Ogilvy' ? 'co-ogilvy' : 'co-cleandirty'}`}>{t.org}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t.note}</p>
              </li>
            ))}
          </ol>

          <div className="panel-dark mt-10 p-6">
            <p className="font-mono text-[11px] uppercase tracking-wideish text-snow/60">currently</p>
            <p className="mt-3 text-sm leading-relaxed text-snow/90">
              Building AI-native production pipelines at <span className="co-ogilvy">Ogilvy</span> — open-source first, documented
              always. Open to talking workflow design, automation, and AI production systems.
            </p>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 border border-snow/40 px-4 py-2 font-mono text-xs uppercase tracking-wideish text-snow transition-colors hover:border-greenBright hover:text-greenBright"
            >
              <LinkedInIcon className="h-4 w-4" />
              connect on linkedin
            </a>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  )
}
