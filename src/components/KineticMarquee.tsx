// Kinetic marquee band: a scrolling texture strip from the title-card look.
// variant 'red'   : the brand ticker under the Hero. NO stripe background
//                   (user-requested: "remove the orange background, just
//                   logos moving"): brand logos scroll as white chips (img) or,
//                   if a brand has no logo yet, its mono name, directly on the
//                   page canvas. Chips are spaced by plain margin only (the
//                   user removed the red dot separators). Each item is
//                   clickable to #/brand/<slug>. rows=2 splits the items
//                   across two lines that scroll in opposite directions (top
//                   left, bottom right). The band pauses on hover (see
//                   .marquee:hover in index.css).
// variant 'ghost' : giant outlined display words on black (footer band).
// Items are plain strings or { label, to, img? }.
type MarqueeItem = string | { label: string; to: string; img?: string }

// Deal items alternately across the rows so both lines get a similar mix of
// wide and narrow logos.
function splitRows(items: MarqueeItem[], rows: number): MarqueeItem[][] {
  return Array.from({ length: rows }, (_, r) => items.filter((_, i) => i % rows === r))
}

export default function KineticMarquee({
  items,
  variant = 'red',
  speed = 28,
  rows = 1,
}: {
  items: MarqueeItem[]
  variant?: 'red' | 'ghost'
  speed?: number
  rows?: 1 | 2
}) {
  const red = variant === 'red'
  const hasLinks = items.some((i) => typeof i !== 'string')
  const twoRows = red && rows === 2

  // `decorative` = the duplicate half of the track (loop filler): hidden from
  // assistive tech and skipped in tab order.
  const block = (list: MarqueeItem[], decorative: boolean) => (
    <div
      className="flex shrink-0 items-center"
      aria-hidden={decorative || !hasLinks ? true : undefined}
    >
      {list.map((item, idx) => {
        const obj = typeof item === 'string' ? null : item
        const label = typeof item === 'string' ? item : item.label
        const chip = red && obj ? obj.img : undefined
        return (
          <span key={`${label}-${idx}`} className="flex items-center">
            {chip && obj ? (
              <a
                href={obj.to}
                tabIndex={decorative ? -1 : undefined}
                title={label}
                className="mx-2 block shrink-0 bg-white px-3 py-1.5 transition-transform duration-200 hover:scale-105"
              >
                <img
                  src={chip}
                  alt={label}
                  loading="eager"
                  decoding="async"
                  className="h-6 w-auto"
                />
              </a>
            ) : obj ? (
              <a
                href={obj.to}
                tabIndex={decorative ? -1 : undefined}
                className={
                  red
                    ? 'whitespace-nowrap px-6 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition-colors hover:bg-paper hover:text-ink-950'
                    : 'text-outline whitespace-nowrap px-8 font-display text-[clamp(2.2rem,5vw,4rem)] uppercase leading-none tracking-tight transition-colors hover:text-paper'
                }
              >
                {label}
              </a>
            ) : red ? (
              <span className="whitespace-nowrap px-6 font-mono text-[11px] uppercase tracking-[0.18em] text-paper">
                {label}
              </span>
            ) : (
              <span className="text-outline whitespace-nowrap px-8 font-display text-[clamp(2.2rem,5vw,4rem)] uppercase leading-none tracking-tight">
                {label}
              </span>
            )}
            {!red && <span className="disc inline-block h-1.5 w-1.5 shrink-0" />}
          </span>
        )
      })}
    </div>
  )

  // One scrolling line: the list twice (seamless -50% loop). Line 2 of the
  // two-line ticker gets .marquee-track--reverse (opposite direction).
  const track = (list: MarqueeItem[], r: number) => (
    <div
      key={r}
      className={
        'marquee-track' + (twoRows && r % 2 === 1 ? ' marquee-track--reverse' : '')
      }
      style={{ '--mq': `${speed}s` } as React.CSSProperties}
    >
      {block(list, false)}
      {block(list, true)}
    </div>
  )

  return (
    <div className={red ? 'marquee py-2' : 'marquee border-b border-ink-600 bg-ink-950 py-6'}>
      {twoRows ? (
        <div className="flex flex-col gap-2">
          {splitRows(items, 2).map((list, r) => track(list, r))}
        </div>
      ) : (
        track(items, 0)
      )}
    </div>
  )
}
