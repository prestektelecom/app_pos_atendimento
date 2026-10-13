import { useEffect, useState } from 'react'
import Pesquisa from '@/components/pesquisa/Pesquisa'
import logoVideo from '@/midia/video_cae11e38.mp4'

/** Logo animado só para quem não pediu movimento reduzido; senão, o SVG estático. */
function Logo() {
  const [animar, setAnimar] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: no-preference)')
    setAnimar(mq.matches)
    const aoMudar = (e: MediaQueryListEvent) => setAnimar(e.matches)
    mq.addEventListener('change', aoMudar)
    return () => mq.removeEventListener('change', aoMudar)
  }, [])

  if (!animar) {
    return <img src="/logo-prestek-light.svg" alt="Prestek Telecom" width={220} height={48} className="h-12 w-auto" />
  }
  return (
    <video
      src={logoVideo}
      role="img"
      aria-label="Prestek Telecom"
      className="aspect-video h-14 w-auto rounded-lg"
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      disablePictureInPicture
    />
  )
}

export default function App() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col px-4 pb-8 pt-6 sm:pt-10">
      <header className="mb-5 flex items-end justify-between gap-4 text-paper">
        <Logo />
        <p className="pb-0.5 text-base font-semibold">Leva menos de 1 minuto</p>
      </header>
      <main className="flex-1">
        <Pesquisa />
      </main>
      <footer className="mt-6 text-center text-sm font-medium text-paper/85">Prestek Telecom</footer>
    </div>
  )
}
