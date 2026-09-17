import type { Project } from '../data/projects'
import SpecStrip from './SpecStrip'
import NodeGraph from './NodeGraph'

// Image-forward card for the featured case studies at the top of the concept
// lane: large cover, the production line under the title, process chain as a
// chip row. Compact cards below stay for everything else.
export default function FeaturedCard({ project, num }: { project: Project; num: string }) {
  return (
    <a
      href={`#/project/${project.slug}`}
      className="panel disc-hover group block overflow-hidden hover:border-greenBright"
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-ink-600">
        {project.cover ? (
          <img
            src={project.cover}
            alt={project.title}
            loading="lazy"
            className="media-asset absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="node-grid flex h-full items-center justify-center bg-ink-800">
            <NodeGraph className="max-w-[250px] opacity-90" animated={false} />
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span className="bg-ink-950/90 px-2 py-1 font-mono text-[11px] uppercase tracking-wideish text-greenReadable">
            case study {num}
          </span>
          {project.status && (
            <span className="bg-ink-950/90 px-2 py-1 font-mono text-[11px] uppercase tracking-wideish text-muted">
              {project.status}
            </span>
          )}
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <p className="font-mono text-[11px] uppercase tracking-wideish text-slateAccent">
          <span className={project.company === 'Ogilvy' ? 'co-ogilvy' : 'co-cleandirty'}>
            {project.company}
          </span>{' '}
          · {project.year}
        </p>
        <h3 className="mt-1.5 font-display text-xl font-black uppercase leading-tight tracking-tight text-paper transition-colors group-hover:text-greenReadable sm:text-2xl">
          {project.title}
        </h3>
        {project.subtitle && (
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wideish text-greenReadable">
            {project.subtitle}
          </p>
        )}
        <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-muted">
          {project.excerpt}
        </p>
        {project.chain && (
          <p className="mt-3 border-t border-ink-600 pt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-paper/70">
            {project.chain}
          </p>
        )}
        <div className="mt-3">
          <SpecStrip spec={project.spec} className="line-clamp-2" />
        </div>
      </div>
    </a>
  )
}
