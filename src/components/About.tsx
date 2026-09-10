import Reveal from './Reveal'
import LinkedInIcon from './LinkedInIcon'
import GitHubIcon from './GitHubIcon'
import { LINKEDIN_URL, GITHUB_URL } from '../data/social'

const TIMELINE = [
  {
    role: 'AI Creative Technologist — Group Account',
    org: 'Ogilvy',
    location: 'Mumbai, India.',
    dates: 'Apr 2025 — Present',
    note: 'AI-native production for client campaigns: video pipelines, identity consistency, automation.',
    bullets: [
      'Generative AI visuals and video for brand campaigns (Cadbury, Lacta, IFB, NDPF).',
      'Built ComfyUI pipelines for controlled generation, identity consistency and scale.',
      'Took ideas from brief to production-ready AI content with the creative teams.',
      'Experimented with emerging image and video models, open-source first.',
    ],
  },
  {
    role: 'AI Head Artist',
    org: 'cleanDirty.ai',
    location: 'Delhi, India. (Remote)',
    dates: 'Sep 2023 — Feb 2025',
    note: 'Led AI art direction and production: custom LoRAs, image & video generation systems, mocap pipelines.',
    bullets: [
      'Led AI image production as head AI artist for client campaign work.',
      'Ran hands-on experiments across every major model wave since 2023.',
      'Built reusable generation workflows and trained early custom LoRAs.',
    ],
  },
]

// Skills grouped the way recruiters scan them: generative AI first, then the
// production and automation layers around it.
const SKILL_GROUPS = [
  {
    label: 'generative ai',
    items: [
      'ComfyUI',
      'Ideogram 4',
      'Krea 2',
      'Flux · Klein',
      'Z-Image Turbo',
      'Midjourney',
      'LoRA training',
      'DiffSynth',
    ],
  },
  {
    label: 'video',
    items: ['MiniMax H3', 'Seedance 2.5', 'LTX / Wan', 'Wan Animate motion transfer'],
  },
  {
    label: 'production',
    items: ['Blender', 'Rokoko mocap', 'Topaz upscale'],
  },
  {
    label: 'automation & agents',
    items: ['Python', 'API automation', 'Hermes agent', 'Codex CLI', 'Claude Code', 'MCP / agent workflows'],
  },
]

export default function About() {
  return (
    <section id="about" className="scroll-mt-16 py-14 sm:py-20">
      <div className="container-site grid gap-12 lg:grid-cols-2">
        <Reveal>
          <div>
          <p className="eyebrow-green">05 / about</p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
            The operator
            <br />
            behind the graph
          </h2>
          <p className="mt-6 leading-relaxed text-muted">
            I'm from Hyderabad, India, and I come from an art background. In 2023 I started
            learning generative AI, and I haven't stopped learning new models since.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            I'm a fast learner, and I'm creative at capturing an idea and portraying it as a film
            or a set of images. I religiously check the AI subreddits, X accounts, and Instagram
            pages that cover every new AI tool and breakthrough, so I know what's new the moment
            it lands. Most of my experiments happen in ComfyUI with image and video models, and I
            automate the workflows around them with AI agents like Hermes, Codex, and Claude Code.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            I spend my days on the other side of the screen: building the workflows, training the
            LoRAs, tuning the samplers, and then automating the whole thing so nobody has to sit
            through another render. My job is to know when the open-source stack does the job
            better than the paid one, and to make that choice invisible in the final frame.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Everything below is documented the way I work: real models, real parameters, real
            obstacles, and the ComfyUI graphs that got past them.
          </p>

          <div className="mt-8 space-y-5">
            {SKILL_GROUPS.map((g) => (
              <div key={g.label}>
                <p className="eyebrow">{g.label}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <span
                      key={s}
                      className="border border-ink-600 px-3 py-1 font-mono text-[11px] text-paper/85"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
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
                <p className={`font-mono text-xs ${t.org === 'Ogilvy' ? 'co-ogilvy' : 'co-cleandirty'}`}>
                  {t.org}
                  {t.location ? <span className="text-muted">, {t.location}</span> : null}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t.note}</p>
                <ul className="mt-3 space-y-1.5">
                  {t.bullets.map((b) => (
                    <li key={b} className="flex gap-2.5 text-sm leading-relaxed text-paper/80">
                      <span className="shrink-0 text-green">→</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <div className="panel-dark mt-10 p-6">
            <p className="font-mono text-[11px] uppercase tracking-wideish text-snow/60">currently</p>
            <p className="mt-3 text-sm leading-relaxed text-snow/90">
              Building AI-native production pipelines at <span className="co-ogilvy">Ogilvy</span>: open-source first, documented
              always. Open to talking workflow design, automation, and AI production systems.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-snow/40 px-4 py-2 font-mono text-xs uppercase tracking-wideish text-snow transition-colors hover:border-greenBright hover:text-greenBright"
              >
                <LinkedInIcon className="h-4 w-4" />
                connect on linkedin
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-snow/40 px-4 py-2 font-mono text-xs uppercase tracking-wideish text-snow transition-colors hover:border-greenBright hover:text-greenBright"
              >
                <GitHubIcon className="h-4 w-4" />
                github
              </a>
            </div>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  )
}
