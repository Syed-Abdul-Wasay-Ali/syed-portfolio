import { useState } from 'react'
import { useRuntime, useT } from '../data/runtime'
import type { MediaItem } from '../data/projects'
import MediaPanel from './MediaPanel'
import Lightbox from './Lightbox'
import Reveal from './Reveal'

// Concept images, a user-managed gallery band on the home page.
// Images are uploaded and arranged from the admin panel (#/admin, tab
// "concept images"); they live in content.json under `conceptImages`
// (files under public/media/concept/). Entries tagged `group: 'photos'`
// render in the "AI Product Photoshoot Images" sub-band underneath.
export default function ConceptImagesSection() {
  const { content } = useRuntime()
  const t = useT()
  const all = content?.conceptImages ?? []
  const myItems = all.filter((m) => m.group !== 'photos')
  const photoItems = all.filter((m) => m.group === 'photos')

  const [lightbox, setLightbox] = useState<number | null>(null)
  const [lightboxP, setLightboxP] = useState<number | null>(null)

  // Renders nothing until there is real media, no empty grids.
  if (all.length === 0) return null

  const shown = myItems.map((m) => ({
    id: m.id,
    kind: 'image' as const,
    src: m.src,
    label: m.caption || 'concept image',
    title: m.caption || '',
  }))
  const shownP = photoItems.map((m) => ({
    id: m.id,
    kind: 'image' as const,
    src: m.src,
    label: m.caption || 'concept image',
    title: m.caption || '',
  }))

  return (
    <section id="concept-images" className="scroll-mt-16 py-10 sm:py-12">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="eyebrow-green">{t('concept.tag')}</p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
            {t('concept.title')}
          </h2>
          <p className="mt-3 text-muted">{t('concept.sub')}</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {shown.map((item, i) => (
            <Reveal key={item.id} delay={(i % 4) * 70}>
              <button
                onClick={() => setLightbox(i)}
                className="tilt-3d panel disc-hover group block w-full text-left hover:border-green"
                data-tilt
                data-tilt-max="8"
              >
                <div className="relative">
                  <MediaPanel item={item} />
                </div>
                {item.title && (
                  <div className="border-t border-ink-600 p-3.5">
                    <h3 className="font-display text-base text-paper transition-colors group-hover:text-greenReadable">
                      {item.title}
                    </h3>
                  </div>
                )}
              </button>
            </Reveal>
          ))}
        </div>

        {shownP.length > 0 && (
          <div className="mt-14 border-t border-ink-600 pt-8">
            <div className="max-w-2xl">
              <p className="eyebrow-green">{t('concept.photos.tag')}</p>
              <h3 className="mt-2 font-display text-2xl font-black uppercase tracking-tight sm:text-3xl">
                {t('concept.photos.title')}
              </h3>
              <p className="mt-3 text-muted">{t('concept.photos.sub')}</p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {shownP.map((item, i) => (
                <Reveal key={item.id} delay={(i % 2) * 70}>
                  <button
                    onClick={() => setLightboxP(i)}
                    className="tilt-3d panel disc-hover group block w-full text-left hover:border-green"
                    data-tilt
                    data-tilt-max="6"
                  >
                    <div className="relative">
                      <MediaPanel item={item} />
                    </div>
                    {item.title && (
                      <div className="border-t border-ink-600 p-3.5">
                        <h3 className="font-display text-base text-paper transition-colors group-hover:text-greenReadable">
                          {item.title}
                        </h3>
                      </div>
                    )}
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>

      {lightbox !== null && (
        <Lightbox
          items={shown as MediaItem[]}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onNav={(i) => setLightbox(i)}
        />
      )}

      {lightboxP !== null && (
        <Lightbox
          items={shownP as MediaItem[]}
          index={lightboxP}
          onClose={() => setLightboxP(null)}
          onNav={(i) => setLightboxP(i)}
        />
      )}
    </section>
  )
}
