import Hero from '../components/Hero'
import KineticMarquee from '../components/KineticMarquee'
import PipelineStrip from '../components/PipelineStrip'
import WhatIBuild from '../components/WhatIBuild'
import BrandsSection from '../components/BrandsSection'
import WorkGrid from '../components/WorkGrid'
import AssetFamily from '../components/AssetFamily'
import ShowcaseSection from '../components/ShowcaseSection'
import ConceptImagesSection from '../components/ConceptImagesSection'
import Capabilities from '../components/Capabilities'
import WorkflowsSection from '../components/WorkflowsSection'
import CraftSection from '../components/CraftSection'
import About from '../components/About'
import CtaBand from '../components/CtaBand'
import { useRuntime } from '../data/runtime'
import { brandHasContent, orderedBrands } from '../data/brands'

// Home order (user-set): hero → the production pipeline strip → logo ticker →
// what-i-solve → concept images → case studies → one product / many assets →
// showcase → systems → workflow + stack → craft → brands → about → contact.
export default function HomePage() {
  const { content } = useRuntime()
  const hidden = content?.pageSections ?? []
  return (
    <>
      <Hero />
      {/* the production route, straight under the hero */}
      <PipelineStrip />
      {/* red logo ticker: brand logos as white chips on two lines moving in
          opposite directions (hover pauses the scroll, see .marquee:hover).
          Brands with media lead the line and open on click; the rest stay as
          texture. Brands without a logo fall back to the name. */}
      <KineticMarquee
        variant="red"
        rows={2}
        speed={26}
        items={orderedBrands(content).map((b) => ({
          label: b.name,
          img: b.logo,
          ...(brandHasContent(b, content) ? { to: `#/brand/${b.slug}` } : {}),
        }))}
      />
      <WhatIBuild />
      {!hidden.includes('concept-images') && <ConceptImagesSection />}
      <WorkGrid />
      {!hidden.includes('assets') && <AssetFamily />}
      {!hidden.includes('showcase') && <ShowcaseSection />}
      {!hidden.includes('capabilities') && <Capabilities />}
      {!hidden.includes('workflows') && <WorkflowsSection />}
      {!hidden.includes('craft') && <CraftSection />}
      {!hidden.includes('brands') && <BrandsSection compact />}
      {!hidden.includes('about') && <About />}
      {!hidden.includes('contact') && <CtaBand />}
    </>
  )
}
