import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Planos', to: '/planos' },
  { label: 'Como funciona', to: '/como-funciona' },
  { label: 'Acompanhar', to: '/acompanhar' },
  { label: 'Regulamento', to: '/regulamento' },
  { label: 'Fale conosco', to: '/fale-conosco' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: scrolled ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0)',
          boxShadow: scrolled ? '0 1px 2px rgba(15,23,42,0.08)' : '0 0 0 rgba(0,0,0,0)',
        }}
        transition={{ duration: 0.25 }}
        className="sticky top-0 z-50 backdrop-blur-sm"
      >
        <div className="mx-auto flex h-16 max-w-content items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="Prestek Telecom — início" className="shrink-0">
            <img src="/logo-prestek.svg" alt="Prestek Telecom" className="h-9 w-auto" />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'group relative text-sm font-medium text-ink-900 transition-colors duration-200 hover:text-brand-orange',
                    isActive && 'text-brand-orange',
                  )
                }
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-brand-orange transition-transform duration-200 group-hover:scale-x-100" />
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden rounded-full bg-brand-orange px-5 py-2.5 font-display text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-orangeDark hover:shadow-cta-glow sm:inline-flex"
            >
              Quero meu convite
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink-900 transition-colors hover:bg-surface-tint lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-panel-dark fixed inset-0 z-[60] flex flex-col"
          >
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">
              <img src="/logo-prestek-light.svg" alt="Prestek Telecom" className="h-9 w-auto" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10"
                aria-label="Fechar menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col items-start justify-center gap-6 px-8" aria-label="Menu móvel">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i + 0.1, duration: 0.3 }}
                >
                  <NavLink
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="font-display text-2xl font-bold text-white transition-colors hover:text-brand-orangeLight"
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * NAV_LINKS.length + 0.1, duration: 0.3 }}
                className="pt-4"
              >
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-brand-orange px-6 py-3 font-display text-base font-semibold text-white transition-colors hover:bg-brand-orangeDark"
                >
                  Quero meu convite
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
