import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface PlaceholderPageProps {
  icon: LucideIcon
  title: string
  description: string
}

/** Simple placeholder used for sub-page route stubs (replaced by page agents). */
export default function PlaceholderPage({ icon: Icon, title, description }: PlaceholderPageProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mx-auto flex max-w-content flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
        <Icon className="h-8 w-8 text-brand-orange" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-bold tracking-[-0.01em] text-ink-900">{title}</h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-ink-500">{description}</p>
      <Link
        to="/"
        className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-brand-orange px-6 font-display text-base font-semibold text-white transition-all hover:bg-brand-orangeDark hover:shadow-cta-glow"
      >
        Ir para o convite
        <ArrowRight className="h-5 w-5" />
      </Link>
    </motion.section>
  )
}
