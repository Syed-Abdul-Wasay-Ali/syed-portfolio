import type { Project } from '../data/projects'
import SpecStrip from './SpecStrip'
import NodeGraph from './NodeGraph'

// Compact index row: cover thumbnail on the left, meta on the right. Keeps the
// full case-study info (company, year, role, excerpt, spec) in ~170px of
// vertical space so the work section stays scannable without a long scroll.
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={`#/project/${project.slug}`}
      data-tilt
      data-tilt-max="8"
      className="tilt-3d panel disc-hover group block border-ink-600 hover:border-green"
    >
      <div className="flex items-stretch">
        <div className="relative min-h-[118px] w-[46%] shrink-0 overflow-hidden border-r border-ink-600">
          {project.cover ? (
            <img
              src={project.cover}
              alt={project.title}
              loading="lazy"
              className="media-asset absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="node-grid flex h-full items-center justify-center bg-ink-800 p-3">
              <NodeGraph className="max-w-[90px] opacity-90" animated={false} />
              <span className="absolute bottom-1.5 right-2 font-mono text-[9px] uppercase tracking-wideish text-muted">
                cover: pending
              </span>
            </div>
          )}
          {project.status && (
            <span className="absolute left-2 top-2 bg-ink-950/90 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wideish text-greenBright">
              {project.status}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 p-3.5 sm:p-4">
          <p className="font-mono text-[10px] uppercase tracking-wideish text-slateAccent">
            <span className={project.company === 'Ogilvy' ? 'co-ogilvy' : 'co-cleandirty'}>
              {project.company}
            </span>{' '}
            · {project.year}
          </p>
          <h3 className="mt-1.5 line-clamp-2 font-display text-[15px] leading-snug text-paper group-hover:text-green">
            {project.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted">
            {project.excerpt}
          </p>
          <div className="mt-2.5 border-t border-ink-600 pt-2">
            <SpecStrip spec={project.spec} className="truncate" />
          </div>
        </div>
      </div>
    </a>
  )
}
