import Hero from '../components/Hero'
import BrandsSection from '../components/BrandsSection'
import WorkGrid from '../components/WorkGrid'
import ShowcaseSection from '../components/ShowcaseSection'
import Capabilities from '../components/Capabilities'
import About from '../components/About'

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandsSection />
      <WorkGrid />
      <ShowcaseSection />
      <Capabilities />
      <About />
    </>
  )
}
