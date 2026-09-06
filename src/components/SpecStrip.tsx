// Mono metadata line — the "workflow header" of a project.
// Renders like:  base minimax h3 · route ref2v · sampler dpmpp_sde_gpu

export type Spec = { label: string; value: string }

export default function SpecStrip({
  spec,
  className = '',
}: {
  spec: Spec[]
  className?: string
}) {
  return (
    <p className={`spec-strip ${className}`} aria-label="Pipeline parameters">
      {spec.map((s, i) => (
        <span key={s.label}>
          {i > 0 && <span className="text-ink-500"> · </span>}
          <span className="k">{s.label} </span>
          <span className="v">{s.value}</span>
        </span>
      ))}
    </p>
  )
}
