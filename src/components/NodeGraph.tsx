// Decorative ComfyUI-style mini node graph — the site's signature motif.
// Nodes have a title bar and sockets, connected by animated bezier links.
// Dark-theme edition: black nodes, green accents.

interface NodeSpec {
  x: number
  y: number
  title: string
  lines: number
  accent?: boolean
}

const NODES: NodeSpec[] = [
  { x: 10, y: 30, title: 'load lora', lines: 1, accent: true },
  { x: 150, y: 8, title: 'ref2v', lines: 2 },
  { x: 150, y: 96, title: 'sampler', lines: 2 },
  { x: 300, y: 52, title: 'save mp4', lines: 1, accent: true },
]

function link(from: NodeSpec, to: NodeSpec) {
  const x1 = from.x + 118
  const y1 = from.y + 34
  const x2 = to.x
  const y2 = to.y + 34
  const mx = (x1 + x2) / 2
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
}

export default function NodeGraph({
  className = 'w-full h-auto',
  animated = true,
}: {
  className?: string
  animated?: boolean
}) {
  return (
    <svg
      viewBox="0 0 400 170"
      className={className}
      role="img"
      aria-label="Illustration of a ComfyUI workflow node graph"
    >
      {/* links */}
      <g fill="none" strokeWidth="1.4">
        {NODES.slice(0, -1).map((n, i) => (
          <path
            key={i}
            d={link(n, NODES[i + 1])}
            stroke={n.accent ? '#FF36C8' : '#00B2FF'}
            strokeDasharray="4 5"
            className={animated ? 'animate-dash' : undefined}
            opacity="0.85"
          />
        ))}
      </g>
      {/* nodes */}
      {NODES.map((n) => (
        <g key={n.title} transform={`translate(${n.x} ${n.y})`}>
          <rect
            width="118"
            height={26 + n.lines * 12}
            rx="4"
            fill="#171633"
            stroke={n.accent ? '#FF36C8' : '#333168'}
            strokeWidth="1.1"
          />
          <rect width="118" height="14" rx="4" fill={n.accent ? '#7A0F5C' : '#282659'} />
          <rect y="7" width="118" height="7" fill={n.accent ? '#7A0F5C' : '#282659'} />
          <text
            x="6"
            y="10"
            fontSize="7.5"
            fontFamily="IBM Plex Mono, monospace"
            fill={n.accent ? '#FF7DE0' : '#F5F4FF'}
          >
            {n.title}
          </text>
          {Array.from({ length: n.lines }).map((_, i) => (
            <rect
              key={i}
              x="6"
              y={20 + i * 12}
              width={60 + (i % 2) * 24}
              height="5"
              rx="2"
              fill="#1F1E41"
            />
          ))}
          {/* sockets — pulsing */}
          {[n].map((nn) => (
            <>
              <circle
                cx="118"
                cy={16 + nn.lines * 6}
                r="3.5"
                fill="#0B0A1E"
                stroke="#FF36C8"
                strokeWidth="1.2"
                className={animated ? 'animate-pulseSoft' : undefined}
              />
              <circle
                cx="0"
                cy={16 + nn.lines * 6}
                r="3.5"
                fill="#0B0A1E"
                stroke="#00B2FF"
                strokeWidth="1.2"
                className={animated ? 'animate-pulseSoft' : undefined}
              />
            </>
          ))}
        </g>
      ))}
    </svg>
  )
}
