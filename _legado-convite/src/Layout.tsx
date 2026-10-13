import { useEffect } from 'react'
import type { ReactNode } from 'react'
import Lenis from 'lenis'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

/**
 * Shared shell for inner pages (Navbar + content + Footer).
 * Children pattern: Layout wraps <Routes>/page elements in App.tsx.
 * The invite page (/) does NOT use this Layout — it is a full-viewport funnel.
 */
export default function Layout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1 })
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="flex min-h-[100dvh] flex-col bg-surface-tint">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
