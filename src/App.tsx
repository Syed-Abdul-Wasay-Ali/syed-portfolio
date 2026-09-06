import { useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProjectPage from './pages/ProjectPage'
import BrandPage from './pages/BrandPage'
import { initTilt } from './lib/tilt'

function useHashRoute(): string {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

export default function App() {
  const hash = useHashRoute()
  const projectMatch = hash.match(/^#\/project\/([a-z0-9-]+)/)
  const brandMatch = hash.match(/^#\/brand\/([a-z0-9-]+)/)

  // 3D: pointer tilt on [data-tilt] cards
  useEffect(() => {
    const stopTilt = initTilt()
    return () => {
      stopTilt()
    }
  }, [hash])

  return (
    <div className="min-h-screen bg-ink">
      <div>
        <Header />
        {projectMatch ? (
          <ProjectPage slug={projectMatch[1]} />
        ) : brandMatch ? (
          <BrandPage slug={brandMatch[1]} />
        ) : (
          <HomePage />
        )}
        <Footer />
      </div>
      {/* global CRT overlay — scanlines, vignette, glitch band sweep */}
      <div className="crt-overlay" aria-hidden="true" />
    </div>
  )
}
