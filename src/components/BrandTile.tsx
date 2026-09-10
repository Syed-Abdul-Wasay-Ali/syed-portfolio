// Brand tile: white logo tile with the brand's logo image, or a styled
// monogram fallback while the logo file is pending.
// size="sm" is the compact variant used by the home page's small brands strip.
export default function BrandTile({
  logo,
  name,
  className = '',
  size = 'lg',
}: {
  logo?: string
  name: string
  className?: string
  size?: 'lg' | 'sm'
}) {
  const pad = size === 'sm' ? 'p-2' : 'p-4'

  if (logo) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden bg-white ${pad} ${className}`}
      >
        <img
          src={logo}
          alt={`${name} logo`}
          loading="lazy"
          className="max-h-full max-w-full object-contain"
        />
      </div>
    )
  }

  const monogram = name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <div
      className={`node-grid relative flex items-center justify-center overflow-hidden border border-dashed border-ink-500 bg-ink-800 ${className}`}
    >
      <span
        className={`font-display font-black text-greenBright ${
          size === 'sm' ? 'text-xl' : 'text-4xl'
        }`}
      >
        {monogram}
      </span>
      {size === 'lg' && (
        <span className="absolute bottom-2 right-3 font-mono text-[10px] uppercase tracking-wideish text-muted">
          logo: pending
        </span>
      )}
    </div>
  )
}
