import { memo, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { motion, useScroll } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  BadgePercent,
  ChevronRight,
  HeartHandshake,
  MessageCircleQuestion,
  Zap,
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

/* ------------------------------------------------------------------ */
/* Ambient decorations (perpetual animations isolated + memoized)      */
/* ------------------------------------------------------------------ */

const GlowOrbs = memo(function GlowOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="ambient-motion absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-brand-orange/20 blur-3xl"
        animate={{ x: [0, -24, 0], y: [0, 24, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="ambient-motion absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full bg-brand-violet700/50 blur-3xl"
        animate={{ x: [0, 24, 0], y: [0, -24, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
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
      className={className}
      animate={{ opacity: [0.08, 0.18, 0.08] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
})

const FloatingMascot = memo(function FloatingMascot({ className }: { className?: string }) {
  return (
    <motion.img
      src="/mascot-prestek.png"
      alt="Mascote da Prestek Telecom"
      className={className}
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
})

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function scrollToFaq() {
  document.getElementById('perguntas-frequentes')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function PrimaryCta({ children, className }: { children: string; className?: string }) {
  return (
    <Link
      to="/"
      className={`group inline-flex h-12 items-center gap-2 rounded-full bg-brand-orange px-7 font-display text-base font-semibold text-white transition-all duration-200 hover:bg-brand-orangeDark hover:shadow-cta-glow ${className ?? ''}`}
    >
      {children}
      <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/* Section 1 — Hero                                                    */
/* ------------------------------------------------------------------ */

function Hero() {
  const words: { text: string; accent?: boolean }[] = [
    { text: 'Como' },
    { text: 'funciona' },
    { text: 'o' },
    { text: 'convite?', accent: true },
  ]

  return (
    <section className="bg-panel-dark relative overflow-hidden px-6 pb-20 pt-24">
      <div className="bg-dotted-grid absolute inset-0" aria-hidden />
      <GlowOrbs />
      <PulsingArcs className="ambient-motion pointer-events-none absolute -right-16 -top-16 w-72 select-none" />
      <PulsingArcs className="ambient-motion pointer-events-none absolute -bottom-16 -left-16 w-72 rotate-180 select-none" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE }}
          aria-label="Trilha de navegação"
          className="flex items-center gap-1.5 text-[13px] font-medium text-white/60"
        >
          <Link to="/" className="transition-colors hover:text-brand-orangeLight">
            Início
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <span className="text-white/80">Como funciona</span>
        </motion.nav>

        <motion.div
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4, ease: EASE }}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 backdrop-blur"
        >
          <span className="animate-pulse-dot h-2 w-2 rounded-full bg-brand-orange" />
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-white">Passo a passo</span>
        </motion.div>

        <h1 className="mt-5 font-display text-[clamp(30px,4vw,44px)] font-bold leading-[1.15] tracking-[-0.02em] text-white">
          {words.map((word, i) => (
            <span key={word.text} className="inline-block overflow-hidden pb-1 align-bottom">
              <motion.span
                className={word.accent ? 'inline-block pr-[0.1em] text-brand-orange' : 'inline-block pr-[0.28em]'}
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.06, duration: 0.5, ease: EASE }}
              >
                {word.text}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
          className="mt-4 max-w-2xl text-lg leading-[1.55] text-white/80"
        >
          Receber um convite da Prestek é a sua chance de ter uma Internet Premium com desconto
          especial. Entenda em 3 passos como aproveitar.
        </motion.p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.65, type: 'spring', stiffness: 260, damping: 24 }}
          >
            <PrimaryCta>Preencher meu convite</PrimaryCta>
          </motion.div>
          <motion.button
            type="button"
            onClick={scrollToFaq}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.75, type: 'spring', stiffness: 260, damping: 24 }}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/40 px-7 font-display text-base font-semibold text-white transition-colors duration-200 hover:bg-white/10"
          >
            <MessageCircleQuestion className="h-5 w-5" />
            Ver perguntas frequentes
          </motion.button>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 2 — Por que você recebeu este convite?                      */
/* ------------------------------------------------------------------ */

const BENEFITS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: BadgePercent,
    title: 'Desconto especial',
    text: 'Quem chega por indicação contrata com condições exclusivas, melhores que as do site.',
  },
  {
    icon: Zap,
    title: 'Prioridade no atendimento',
    text: 'Convidados entram na fila prioritária do nosso time comercial.',
  },
  {
    icon: HeartHandshake,
    title: 'Indicação de confiança',
    text: 'Você foi indicado por alguém que já usa e aprova a conexão Prestek.',
  },
]

function WhySection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <motion.div
          initial={{ y: 32, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="lg:sticky lg:top-32 lg:self-start"
        >
          <h2 className="font-display text-3xl font-bold tracking-[-0.01em] text-ink-900">
            Por que você recebeu <span className="text-brand-orange">este convite?</span>
          </h2>
          <p className="mt-4 text-[17px] font-semibold leading-relaxed text-brand-orange">
            Este convite é sua chance de ter uma Internet Premium!
          </p>
          <p className="mt-3 text-base leading-relaxed text-ink-900/75">
            Provavelmente você recebeu esse convite de um amigo ou familiar que quer compartilhar
            com você a melhor conexão de sua região. Quem indica é cliente Prestek — e cliente
            Prestek não indica à toa.
          </p>
        </motion.div>

        <div className="space-y-5">
          {BENEFITS.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ x: 40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: i * 0.12, duration: 0.5, ease: EASE }}
              whileHover={{ y: -6 }}
              className="group rounded-2xl border border-ink-300/50 bg-white p-6 shadow-card transition-shadow duration-200 hover:shadow-modal"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 transition-transform duration-200 group-hover:-rotate-6">
                  <benefit.icon className="h-6 w-6 text-brand-orange" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink-900">{benefit.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-900/70">{benefit.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 3 — Os 3 passos                                             */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    number: '01',
    image: '/step-convite.svg',
    alt: 'Ilustração de um smartphone exibindo o formulário do convite',
    title: 'Preencha o convite',
    text: 'Basta informar seu nome e WhatsApp no convite que você recebeu. Leva menos de 1 minuto.',
  },
  {
    number: '02',
    image: '/step-whatsapp.svg',
    alt: 'Ilustração de um smartphone com mensagem de confirmação no WhatsApp',
    title: 'Confirme no WhatsApp',
    text: 'Logo em seguida você receberá uma mensagem em seu WhatsApp informando a confirmação do seu convite.',
  },
  {
    number: '03',
    image: '/step-instalacao.svg',
    alt: 'Ilustração de um técnico instalando um roteador com sinal WiFi',
    title: 'Aguarde nosso contato',
    text: 'Aí é só aguardar o contato da nossa equipe comercial para ativar sua Internet Premium com desconto! 😊',
  },
]

function StepsSection() {
  const gridRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ['start 0.8', 'end 0.5'],
  })

  return (
    <section className="bg-surface-tint py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 32, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-brand-orange">
            É simples assim
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.01em] text-ink-900">
            Do convite à conexão em <span className="text-brand-orange">3 passos</span>
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-500">
            Sem burocracia. Você preenche, a gente confirma no WhatsApp e nossa equipe cuida do resto.
          </p>
        </motion.div>

        <div ref={gridRef} className="relative mt-14">
          {/* dashed connector (desktop, draws with scroll) */}
          <svg
            className="pointer-events-none absolute left-[18%] right-[18%] top-20 hidden h-1 w-[64%] lg:block"
            viewBox="0 0 640 4"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden
          >
            <motion.path
              d="M2 2 H 638"
              stroke="#F97316"
              strokeOpacity="0.4"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="2 10"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>

          <div className="grid gap-8 lg:grid-cols-3">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ y: 48, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: EASE }}
                className="group relative rounded-[20px] border border-ink-300/40 bg-white p-8 text-center shadow-card transition-colors duration-200 hover:border-brand-orange/40"
              >
                <motion.span
                  initial={{ scale: 1.3, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.15 + 0.2, duration: 0.5, ease: EASE }}
                  className="pointer-events-none absolute right-6 top-4 font-display text-7xl font-extrabold text-brand-orange/10"
                  aria-hidden
                >
                  {step.number}
                </motion.span>
                <motion.img
                  src={step.image}
                  alt={step.alt}
                  className="mx-auto h-40 w-auto"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                />
                <h3 className="mt-6 font-display text-xl font-semibold text-ink-900">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-900/70">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 4 — FAQ                                                     */
/* ------------------------------------------------------------------ */

const FAQ_ITEMS: { question: string; answer: ReactNode }[] = [
  {
    question: 'Preciso pagar algo para aceitar o convite?',
    answer:
      'Não. Aceitar o convite é gratuito. Você só contrata se gostar da proposta que nossa equipe apresentar — com o desconto especial de indicado.',
  },
  {
    question: 'Quanto tempo leva para entrarem em contato?',
    answer: 'Após a confirmação no WhatsApp, nosso time comercial entra em contato em até 1 dia útil.',
  },
  {
    question: 'O desconto vale para qualquer plano?',
    answer: 'Sim! O desconto de indicação pode ser aplicado em qualquer plano disponível na sua região.',
  },
  {
    question: 'Meus dados estão seguros?',
    answer: (
      <>
        Sim. Tratamos seus dados conforme a LGPD (Lei nº 13.709/2018). Eles são usados apenas para o
        contato comercial deste convite — nunca vendidos ou compartilhados. Veja o{' '}
        <Link to="/regulamento" className="font-medium text-brand-blue underline underline-offset-2 hover:text-brand-orange">
          Regulamento
        </Link>
        .
      </>
    ),
  },
  {
    question: 'Posso indicar outras pessoas depois?',
    answer:
      'Pode! Depois de virar cliente, você também recebe seu próprio link de convite para indicar amigos.',
  },
]

function FaqSection() {
  return (
    <section id="perguntas-frequentes" className="scroll-mt-24 bg-white py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 32, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center"
        >
          <h2 className="font-display text-3xl font-bold tracking-[-0.01em] text-ink-900">
            Perguntas <span className="text-brand-orange">frequentes</span>
          </h2>
          <p className="mt-3 text-base text-ink-500">Tudo o que você precisa saber sobre o convite.</p>
        </motion.div>

        <motion.div
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mt-10"
        >
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, i) => (
              <motion.div
                key={item.question}
                initial={{ y: 16, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: EASE }}
              >
                <AccordionItem value={`faq-${i}`} className="border-ink-300/40">
                  <AccordionTrigger className="py-5 text-base font-semibold text-ink-900 hover:text-brand-orange hover:no-underline [&[data-state=open]>svg]:text-brand-orange">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-[15px] leading-relaxed text-ink-900/75">
                    {item.answer}
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
/* Section 5 — Final CTA band                                          */
/* ------------------------------------------------------------------ */

function FinalCta() {
  return (
    <section className="bg-panel-dark relative overflow-hidden py-20">
      <div className="bg-dotted-grid absolute inset-0" aria-hidden />
      <GlowOrbs />
      <PulsingArcs className="ambient-motion pointer-events-none absolute -left-16 -top-16 w-64 select-none" />
      <FloatingMascot className="ambient-motion pointer-events-none absolute bottom-0 right-[6%] hidden h-52 w-auto select-none lg:block" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center lg:-translate-x-16">
        <motion.h2
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="font-display text-[32px] font-bold tracking-[-0.01em] text-white"
        >
          Pronto para aproveitar <span className="text-brand-orange">seu convite?</span>
        </motion.h2>
        <motion.p
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
          className="mt-3 text-base leading-relaxed text-white/80"
        >
          Preencha seus dados em menos de 1 minuto e garanta seu desconto especial.
        </motion.p>
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
          className="mt-8"
        >
          <PrimaryCta className="h-14 px-8 text-lg">Preencher meu convite</PrimaryCta>
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ComoFunciona() {
  useEffect(() => {
    document.title = 'Como funciona o convite — Prestek Telecom'
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    meta?.setAttribute(
      'content',
      'Entenda como funciona o convite de indicação da Prestek Telecom e garanta sua internet premium com desconto.',
    )
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Hero />
      <WhySection />
      <StepsSection />
      <FaqSection />
      <FinalCta />
    </motion.div>
  )
}
