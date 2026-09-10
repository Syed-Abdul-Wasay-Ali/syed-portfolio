import type { Project } from '../data/projects'
import SpecStrip from './SpecStrip'
import NodeGraph from './NodeGraph'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={`#/project/${project.slug}`}
      data-tilt
      data-tilt-max="8"
      className="tilt-3d panel disc-hover group block border-ink-600 hover:border-green"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-ink-600">
        {project.cover ? (
          <img
            src={project.cover}
            alt={project.title}
            loading="lazy"
            className="media-asset h-full w-full object-cover"
          />
        ) : (
          <div className="node-grid flex h-full items-center justify-center bg-ink-800 p-6">
            <NodeGraph className="max-w-xs opacity-90" animated={false} />
            <span className="absolute bottom-2 right-3 font-mono text-[10px] uppercase tracking-wideish text-muted">
              cover: pending
            </span>
          </div>
        )}
        {project.status && (
          <span className="absolute left-3 top-3 bg-ink-950/90 px-2 py-1 font-mono text-[10px] uppercase tracking-wideish text-greenBright">
            {project.status}
          </span>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <p className="font-mono text-[10px] uppercase tracking-wideish text-slateAccent">
          <span className={project.company === 'Ogilvy' ? 'co-ogilvy' : 'co-cleandirty'}>
            {project.company}
          </span>{' '}
          · {project.year} · {project.role}
        </p>
        <h3 className="mt-2 font-display text-lg leading-snug text-paper group-hover:text-green">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{project.excerpt}</p>
        <div className="mt-4 border-t border-ink-600 pt-3">
          <SpecStrip spec={project.spec} className="truncate" />
        </div>
      </div>
    </a>
  )
}
