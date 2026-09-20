import { useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProjectPage from './pages/ProjectPage'
import BrandPage from './pages/BrandPage'
import AdminPage from './pages/AdminPage'
import { RuntimeProvider, useRuntime, tx } from './data/runtime'
import { HoverPreviewProvider } from './components/HoverPreview'
import { initTilt } from './lib/tilt'

const DEFAULT_TITLE = 'Syed Abdul Wasay Ali — AI Creative Manager & AI Image Specialist'

// keeps the browser/tab title in sync with the admin "site title" text key
function TitleSync() {
  const { content } = useRuntime()
  useEffect(() => {
    document.title = tx(content?.texts, 'site.title', DEFAULT_TITLE)
  }, [content])
  return null
}

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
  const isAdmin = hash.startsWith('#/admin')

  // 3D: pointer tilt on [data-tilt] cards
  useEffect(() => {
    const stopTilt = initTilt()
    return () => {
      stopTilt()
    }
  }, [hash])

  return (
    <RuntimeProvider>
      <HoverPreviewProvider>
        <TitleSync />
        <div className="min-h-screen bg-canvas">
          <div>
            <Header />
            {isAdmin ? (
              <AdminPage />
            ) : projectMatch ? (
              <ProjectPage slug={projectMatch[1]} />
            ) : brandMatch ? (
              <BrandPage slug={brandMatch[1]} />
            ) : (
              <HomePage />
            )}
            <Footer />
          </div>
          {/* global film finish — grain + vignette (title-card look) */}
          <div aria-hidden="true" className="film-grain" />
          <div aria-hidden="true" className="vignette" />
        </div>
      </HoverPreviewProvider>
    </RuntimeProvider>
  )
}
