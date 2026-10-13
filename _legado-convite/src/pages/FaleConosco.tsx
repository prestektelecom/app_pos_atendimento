import { memo, useEffect } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ChevronRight,
  CircleHelp,
  Mail,
  MapPin,
  MessageCircle,
  Radar,
  ScrollText,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import ContactForm, { WA_LINK } from '@/components/contato/ContactForm'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

/* ------------------------------------------------------------------ */
/* Ambient decorations (memoized perpetual animations)                 */
/* ------------------------------------------------------------------ */

const GlowOrbs = memo(function GlowOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="ambient-motion absolute -right-16 -top-16 h-[260px] w-[260px] rounded-full bg-brand-orange/20 blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="ambient-motion absolute -bottom-20 -left-20 h-[320px] w-[320px] rounded-full bg-brand-violet700/50 blur-3xl"
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
})

const PulsingArcs = memo(function PulsingArcs({ className }: { className?: string }) {
  return (
    <motion.img
      src="/wifi-arcs.svg"
      alt=""
      aria-hidden
      className={cn('ambient-motion pointer-events-none select-none', className)}
      animate={{ opacity: [0.08, 0.18, 0.08] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
})

/* ------------------------------------------------------------------ */
/* Section 1 — Hero                                                    */
/* ------------------------------------------------------------------ */

function Hero() {
  const words: { text: string; accent?: boolean }[] = [
    { text: 'Fale' },
    { text: 'com' },
    { text: 'a' },
    { text: 'Prestek', accent: true },
  ]

  return (
    <section className="bg-panel-dark bg-dotted-grid relative overflow-hidden pb-32 pt-20">
      <GlowOrbs />
      <PulsingArcs className="absolute -right-10 top-8 w-56 opacity-10 lg:right-16 lg:w-72" />
      <PulsingArcs className="absolute -left-14 bottom-10 w-44 rotate-180 opacity-10 lg:w-56" />

      <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center justify-center gap-1.5 text-[13px] font-medium text-white/60">
          <Link to="/" className="transition-colors hover:text-brand-orangeLight">
            Início
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <span className="text-white/90">Fale conosco</span>
        </nav>

        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="inline-flex items-center rounded-full border border-brand-orange/30 bg-brand-orange/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-orangeLight"
        >
          Atendimento
        </motion.span>

        <h1 className="mt-5 font-display text-[clamp(28px,3.5vw,40px)] font-bold leading-[1.15] tracking-[-0.02em] text-white">
          {words.map((word, i) => (
            <span key={word.text} className="inline-block overflow-hidden pb-1 align-bottom">
              <motion.span
                className={cn('inline-block pr-[0.28em]', word.accent && 'text-brand-orange')}
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: EASE }}
              >
                {word.text}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: EASE }}
          className="mt-4 text-[17px] leading-[1.55] text-white/80"
        >
          Dúvidas sobre o convite, planos ou instalação? Nosso time responde rápido — de verdade.
        </motion.p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 2 — Contact channel cards                                   */
/* ------------------------------------------------------------------ */

interface Channel {
  icon: LucideIcon
  iconWrap: string
  title: string
  body: ReactNode
  action?: ReactNode
}

function ChannelCard({ channel, index }: { channel: Channel; index: number }) {
  const Icon = channel.icon
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.12, type: 'spring', stiffness: 260, damping: 24 }}
      whileHover={{ y: -6 }}
      className="group flex flex-col items-center rounded-[20px] border border-ink-300/40 bg-white p-8 text-center shadow-card transition-shadow duration-[250ms] hover:shadow-[0_12px_40px_rgba(15,23,42,0.14)]"
    >
      <span
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-[250ms] group-hover:-rotate-[8deg]',
          channel.iconWrap,
        )}
      >
        <Icon className="h-7 w-7" />
      </span>
      <h2 className="mt-5 font-display text-xl font-semibold text-ink-900">{channel.title}</h2>
      <div className="mt-2 flex flex-1 flex-col items-center text-sm leading-relaxed text-ink-500">
        {channel.body}
      </div>
      {channel.action && <div className="mt-6 w-full">{channel.action}</div>}
    </motion.article>
  )
}

function Channels() {
  const channels: Channel[] = [
    {
      icon: MessageCircle,
      iconWrap: 'bg-green-100 text-green-600',
      title: 'WhatsApp comercial',
      body: <p>Resposta em minutos, todos os dias das 8h às 22h.</p>,
      action: (
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-orange font-display text-[15px] font-semibold text-white transition-all duration-200 hover:bg-brand-orangeDark hover:shadow-cta-glow active:scale-[0.98]"
        >
          Chamar no WhatsApp
          <ArrowRight className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-1" />
        </a>
      ),
    },
    {
      icon: Mail,
      iconWrap: 'bg-orange-100 text-brand-orange',
      title: 'E-mail',
      body: (
        <>
          <p>Para dúvidas gerais e parcerias:</p>
          <a
            href="mailto:contato@prestektelecom.com.br"
            className="mt-1 font-display text-base font-semibold text-brand-orange transition-colors hover:text-brand-orangeDark"
          >
            contato@prestektelecom.com.br
          </a>
          <p className="mt-3 text-[13px]">
            Dados/LGPD:{' '}
            <a
              href="mailto:encarregado@prestektelecom.com.br"
              className="font-medium text-ink-900 underline decoration-ink-300 underline-offset-2 transition-colors hover:text-brand-orange hover:decoration-brand-orange"
            >
              encarregado@prestektelecom.com.br
            </a>
          </p>
        </>
      ),
    },
    {
      icon: MapPin,
      iconWrap: 'bg-blue-100 text-blue-600',
      title: 'Loja física',
      body: (
        <>
          <p>Av. das Conexões, 1234 — Centro</p>
          <p className="mt-2 text-[13px]">Seg a Sex, 9h–18h · Sáb, 9h–13h</p>
        </>
      ),
    },
  ]

  return (
    <section className="bg-white pb-4">
      <div className="mx-auto -mt-14 grid max-w-5xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        {channels.map((channel, i) => (
          <ChannelCard key={channel.title} channel={channel} index={i} />
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 3 — Form + info column                                      */
/* ------------------------------------------------------------------ */

const QUICK_LINKS = [
  { icon: CircleHelp, label: 'Como funciona o convite', to: '/como-funciona' },
  { icon: Radar, label: 'Acompanhar minha indicação', to: '/acompanhar' },
  { icon: ScrollText, label: 'Regulamento e LGPD', to: '/regulamento' },
]

function FormAndInfo() {
  return (
    <section className="bg-surface-tint py-24">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        {/* Left — form card */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <ContactForm />
        </motion.div>

        {/* Right — info column */}
        <div className="space-y-8">
          <div>
            <h3 className="font-display text-[21px] font-semibold text-ink-900">
              Antes de enviar, veja se ajuda:
            </h3>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
              className="mt-5 space-y-3"
            >
              {QUICK_LINKS.map(({ icon: Icon, label, to }) => (
                <motion.div
                  key={to}
                  variants={{
                    hidden: { opacity: 0, x: 24 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
                  }}
                >
                  <Link
                    to={to}
                    className="group flex items-center gap-3 rounded-xl border border-ink-300/50 bg-white p-4 transition-all duration-200 hover:translate-x-1 hover:border-brand-orange/40"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-brand-orange transition-colors duration-200 group-hover:bg-brand-orange group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1 text-[15px] font-semibold text-ink-900 transition-colors group-hover:text-brand-orange">
                      {label}
                    </span>
                    <ArrowRight className="h-5 w-5 text-ink-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-brand-orange" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative overflow-hidden rounded-2xl border border-ink-300/40 shadow-card"
          >
            <img
              src="/mapa-cobertura.png"
              alt="Mapa estilizado da área de cobertura da Prestek Telecom"
              className="aspect-video w-full object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-4 left-4 flex items-center gap-2.5 rounded-xl bg-white/90 p-3 backdrop-blur">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100">
                <MapPin className="h-5 w-5 text-brand-orange" />
              </span>
              <span className="text-[13px] font-semibold text-ink-900">Nossa área de cobertura</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 4 — Mini FAQ                                                */
/* ------------------------------------------------------------------ */

const FAQ_ITEMS = [
  {
    q: 'Qual o horário de atendimento?',
    a: 'WhatsApp e loja física: segunda a sexta, 9h–18h; sábado 9h–13h. Suporte técnico da rede: 24h, todos os dias.',
  },
  {
    q: 'Quero alterar/excluir meus dados. Como faço?',
    a: 'Fale com nosso encarregado de dados em encarregado@prestektelecom.com.br ou pelo WhatsApp. Atendemos solicitações LGPD em até 15 dias.',
  },
  {
    q: 'Ainda não recebi o contato comercial do meu convite.',
    a: 'Verifique a etapa da sua indicação na página Acompanhar. Se estiver há mais de 1 dia útil na etapa de contato, chame a gente no WhatsApp que resolvemos na hora.',
  },
]

function Faq() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="text-center font-display text-[28px] font-bold tracking-[-0.01em] text-ink-900 sm:text-[32px]"
        >
          Dúvidas <span className="text-brand-orange">rápidas</span>
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="mt-10"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <motion.div
                key={item.q}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
                }}
              >
                <AccordionItem
                  value={`faq-${i}`}
                  className="rounded-2xl border border-ink-300/50 bg-surface-tint px-5 shadow-xs transition-colors data-[state=open]:border-brand-orange/40 data-[state=open]:bg-white"
                >
                  <AccordionTrigger className="py-5 font-display text-[15px] font-semibold text-ink-900 hover:text-brand-orange hover:no-underline [&>svg]:text-brand-orange">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[14px] leading-[1.7] text-ink-500">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function FaleConosco() {
  useEffect(() => {
    document.title = 'Fale conosco — Prestek Telecom'
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content =
      'Fale com a Prestek Telecom pelo WhatsApp, e-mail ou visite nossa loja. Atendimento rápido sobre convites, planos e suporte.'
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Hero />
      <Channels />
      <FormAndInfo />
      <Faq />
    </motion.div>
  )
}
