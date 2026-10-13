import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowUpRight, Facebook, Instagram, Mail, MapPin, MessageCircle } from 'lucide-react'

const INVITE_LINKS = [
  { label: 'Como funciona', to: '/como-funciona' },
  { label: 'Acompanhar indicação', to: '/acompanhar' },
  { label: 'Regulamento', to: '/regulamento' },
  { label: 'Gerar QR Code', to: '/' },
]

const SOCIALS = [
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
  { icon: MessageCircle, label: 'WhatsApp', href: 'https://wa.me/5500000000000' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

export default function Footer() {
  return (
    <footer className="bg-panel-dark text-white">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto grid max-w-content gap-12 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8"
      >
        <motion.div variants={item} className="space-y-4">
          <img src="/logo-prestek-light.svg" alt="Prestek Telecom" className="h-10 w-auto" />
          <p className="max-w-xs text-[15px] leading-relaxed text-white/70">
            Internet Premium na sua região.
          </p>
          <div className="flex gap-3">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/80 transition-colors duration-200 hover:border-brand-orange hover:text-brand-orange"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item}>
          <h3 className="mb-4 font-display text-base font-semibold text-white">Convite</h3>
          <ul className="space-y-3">
            {INVITE_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="text-sm font-medium text-white/70 transition-colors duration-200 hover:text-brand-orangeLight"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={item}>
          <h3 className="mb-4 font-display text-base font-semibold text-white">Contato</h3>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-brand-orangeLight" />
              <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-brand-orangeLight">
                WhatsApp comercial
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand-orangeLight" />
              <a href="mailto:contato@prestek.com.br" className="transition-colors hover:text-brand-orangeLight">
                contato@prestek.com.br
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-orangeLight" />
              <span>Av. das Conexões, 1000 — Centro, Sua Cidade/BR</span>
            </li>
            <li>
              <a
                href="https://www.prestek.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-brand-orangeLight transition-colors hover:text-brand-orange"
              >
                Nosso site
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </li>
          </ul>
        </motion.div>
      </motion.div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-2 px-4 py-5 text-[13px] text-ink-300/60 sm:flex-row sm:px-6 lg:px-8">
          <span>© 2024 Prestek Telecom · Todos os direitos reservados</span>
          <span>Feito com 💙 para conectar você</span>
        </div>
      </div>
    </footer>
  )
}
