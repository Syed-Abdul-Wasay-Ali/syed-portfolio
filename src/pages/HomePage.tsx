import Hero from '../components/Hero'
import KineticMarquee from '../components/KineticMarquee'
import BrandsSection from '../components/BrandsSection'
import WorkGrid from '../components/WorkGrid'
import ShowcaseSection from '../components/ShowcaseSection'
import Capabilities from '../components/Capabilities'
import About from '../components/About'
import { useRuntime } from '../data/runtime'
import { displayBrands } from '../data/brands'

// Home order (user-set): case studies first, then concepts, then what I
// actually do, then the small brands strip, then about.
export default function HomePage() {
  const { content } = useRuntime()
  const hidden = content?.pageSections ?? []
  return (
    <>
      <Hero />
      {/* red logo ticker: brand logos as clickable white chips on two lines
          moving in opposite directions (hover pauses the scroll, see
          .marquee:hover). Brands without a logo fall back to the name. */}
      <KineticMarquee
        variant="red"
        rows={2}
        speed={26}
        items={displayBrands.map((b) => ({ label: b.name, to: `#/brand/${b.slug}`, img: b.logo }))}
      />
      <WorkGrid />
      {!hidden.includes('showcase') && <ShowcaseSection />}
      {!hidden.includes('capabilities') && <Capabilities />}
      {!hidden.includes('brands') && <BrandsSection compact />}
      {!hidden.includes('about') && <About />}
    </>
  )
}
