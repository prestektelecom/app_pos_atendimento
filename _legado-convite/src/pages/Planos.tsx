import { memo, useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Gauge,
  Loader2,
  MapPin,
  ShieldCheck,
  Star,
  Wifi,
  Wrench,
} from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

function maskCEP(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

/* ------------------------------------------------------------------ */
/* Hero background — Ken Burns, perpetual animation isolated           */
/* ------------------------------------------------------------------ */

const HeroBackground = memo(function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <motion.img
        src="/hero-planos-bg.png"
        alt=""
        className="ambient-motion h-full w-full object-cover"
        initial={{ scale: 1 }}
        animate={{ scale: 1.08 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-navy900/80 via-brand-navy900/60 to-brand-navy900/85" />
    </div>
  )
})

/* ------------------------------------------------------------------ */
/* Map parallax — GSAP ScrollTrigger, isolated component               */
/* ------------------------------------------------------------------ */

function MapParallax() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!wrapRef.current || !imgRef.current) return
    const tween = gsap.fromTo(
      imgRef.current,
      { y: -20 },
      {
        y: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <div ref={wrapRef} className="relative h-64 overflow-hidden rounded-2xl shadow-card lg:h-full lg:min-h-[320px]">
      <img
        ref={imgRef}
        src="/mapa-cobertura.png"
        alt="Mapa de cobertura da fibra Prestek Telecom"
        className="absolute inset-0 h-[calc(100%+40px)] w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-navy900/70 to-transparent p-4">
        <p className="flex items-center gap-1.5 text-[13px] font-medium text-white/90">
          <MapPin className="h-4 w-4 text-brand-orangeLight" />
          Cobertura em expansão na sua região
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Stat count-up — GSAP, isolated component                            */
/* ------------------------------------------------------------------ */

function StatNumber({ value, format }: { value: number; format: (v: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const counter = { v: 0 }
    const el = ref.current
    el.textContent = format(0)
    const tween = gsap.to(counter, {
      v: value,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = format(counter.v)
      },
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [value, format])

  return <span ref={ref}>{format(0)}</span>
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const TRUST_ITEMS = [
  { icon: Wifi, label: 'WiFi 6 incluso' },
  { icon: Gauge, label: 'Velocidade garantida' },
  { icon: Wrench, label: 'Instalação grátis' },
  { icon: ShieldCheck, label: 'Sem fidelidade abusiva' },
]

const PLANS = [
  {
    speed: '400',
    unit: 'MEGA',
    tagline: 'Para streaming e redes sociais',
    oldPrice: 'R$ 119,90',
    price: 'R$ 99,90',
    features: ['WiFi 6 incluso', 'Instalação grátis', 'Streaming em Full HD', 'Suporte 24h'],
    highlight: false,
  },
  {
    speed: '600',
    unit: 'MEGA',
    tagline: 'Para quem vive conectado',
    oldPrice: 'R$ 159,90',
    price: 'R$ 129,90',
    features: [
      'WiFi 6 incluso',
      'Instalação grátis',
      'Streaming 4K + games',
      'Suporte prioritário 24h',
      'App de gestão do WiFi',
    ],
    highlight: true,
  },
  {
    speed: '1',
    unit: 'GIGA',
    tagline: 'Potência máxima para tudo',
    oldPrice: 'R$ 249,90',
    price: 'R$ 199,90',
    features: [
      'WiFi 6 mesh (2 pontos)',
      'Instalação grátis',
      '8K, games e home office pesado',
      'Atendimento VIP',
      'IP dinâmico otimizado p/ jogos',
    ],
    highlight: false,
  },
]

const STATS = [
  { value: 99.8, format: (v: number) => `${v.toFixed(1).replace('.', ',')}%`, label: 'de uptime da rede' },
  { value: 12, format: (v: number) => `+${Math.round(v)} mil`, label: 'clientes conectados' },
  { value: 4.9, format: (v: number) => `${v.toFixed(1).replace('.', ',')}★`, label: 'avaliação média' },
  { value: 24, format: (v: number) => `${Math.round(v)}h`, label: 'suporte todos os dias' },
]

/* ------------------------------------------------------------------ */
/* Plan card                                                           */
/* ------------------------------------------------------------------ */

function PlanCard({ plan, index }: { plan: (typeof PLANS)[number]; index: number }) {
  const highlighted = plan.highlight
  return (
    <motion.div
      className={cn('relative', highlighted && 'lg:-my-3')}
      initial={{ opacity: 0, y: 48, scale: highlighted ? 0.95 : 1 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: EASE }}
    >
      {highlighted && (
        <span className="absolute -top-[14px] left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-brand-orange px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-cta-glow">
          <Star className="h-3.5 w-3.5 fill-white" />
          Mais escolhido
        </span>
      )}
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className={cn(
          'group flex h-full flex-col rounded-[20px] border bg-white p-8 shadow-card transition-shadow duration-300 hover:shadow-[0_16px_48px_rgba(15,23,42,0.14)]',
          highlighted ? 'border-2 border-brand-orange' : 'border-ink-300/50',
        )}
      >
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[44px] font-extrabold leading-none text-ink-900 transition-colors duration-200 group-hover:text-brand-orange">
            {plan.speed}
          </span>
          <span className="font-display text-base font-bold text-brand-orange">{plan.unit}</span>
        </div>
        <p className="mt-2 text-sm text-ink-500">{plan.tagline}</p>

        <div className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-sm text-ink-300 line-through">{plan.oldPrice}</span>
          <span className="font-display text-[30px] font-extrabold leading-none text-brand-orange">{plan.price}</span>
          <span className="text-sm text-ink-500">/mês</span>
        </div>
        <span className="mt-2.5 inline-flex w-fit items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          Desconto do convite
        </span>

        <ul className="mt-6 flex-1 space-y-3">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[15px] text-ink-900/85">
              <Check className="mt-0.5 h-[18px] w-[18px] shrink-0 text-brand-orange" strokeWidth={2.5} />
              {f}
            </li>
          ))}
        </ul>

        <Link
          to="/"
          className="group/btn mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-orange font-display text-[15px] font-semibold text-white transition-all hover:bg-brand-orangeDark hover:shadow-cta-glow active:scale-[0.97]"
        >
          Assinar com meu convite
          <ArrowRight className="h-[18px] w-[18px] transition-transform duration-200 group-hover/btn:translate-x-1" />
        </Link>
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Planos() {
  const [cep, setCep] = useState('')
  const [cepError, setCepError] = useState<string>()
  const [cepState, setCepState] = useState<'idle' | 'loading' | 'success'>('idle')
  const [cepShake, setCepShake] = useState(0)
  const cepRef = useRef<HTMLInputElement>(null)
  const underlineRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    document.title = 'Planos de Internet Fibra — Prestek Telecom'
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const prev = meta?.content
    meta?.setAttribute(
      'content',
      'Planos de fibra óptica de 400 Mega a 1 Giga com WiFi 6 e instalação grátis. Desconto especial para indicados.',
    )
    return () => {
      document.title = 'Convite Exclusivo — Prestek Telecom'
      if (meta && prev) meta.setAttribute('content', prev)
    }
  }, [])

  // Section header underline: grows 0→100% as the plans section enters (scrub)
  useEffect(() => {
    if (!underlineRef.current) return
    const tween = gsap.fromTo(
      underlineRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: underlineRef.current,
          start: 'top 90%',
          end: 'top 45%',
          scrub: true,
        },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  const consultCep = (e?: FormEvent) => {
    e?.preventDefault()
    if (cepState === 'loading') return
    if (cep.replace(/\D/g, '').length !== 8) {
      setCepError('Digite um CEP válido com 8 dígitos.')
      setCepShake((k) => k + 1)
      cepRef.current?.focus()
      return
    }
    setCepError(undefined)
    setCepState('loading')
    window.setTimeout(() => setCepState('success'), 1000)
  }

  return (
    <div>
      {/* Section 1 — Hero */}
      <section className="relative overflow-hidden py-28 sm:py-32">
        <HeroBackground />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <nav aria-label="Breadcrumb" className="mb-5 flex items-center justify-center gap-1.5 text-[13px] font-medium text-white/60">
            <Link to="/" className="transition-colors hover:text-brand-orangeLight">
              Início
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/85">Planos</span>
          </nav>

          <motion.span
            className="inline-block rounded-full border border-brand-orange/40 bg-brand-orange/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-brand-orangeLight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            Internet fibra óptica
          </motion.span>

          <h1 className="mt-5 font-display text-[clamp(32px,4vw,46px)] font-bold leading-[1.15] tracking-[-0.02em] text-white">
            {[
              { text: 'Velocidade' },
              { text: 'de' },
              { text: 'verdade,' },
              { text: 'preço' },
              { text: 'de' },
              { text: 'indicação', accent: true },
            ].map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
                <motion.span
                  className="inline-block pr-[0.26em]"
                  initial={{ y: 28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: EASE }}
                >
                  {word.accent ? <span className="text-brand-orange">{word.text}</span> : word.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mx-auto mt-5 max-w-2xl text-[17px] leading-[1.55] text-white/80"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5, ease: EASE }}
          >
            Planos de fibra 100% óptica com WiFi de alta performance. Quem chega por convite ganha desconto especial
            em qualquer plano.
          </motion.p>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {TRUST_ITEMS.map(({ icon: Icon, label }, i) => (
              <motion.li
                key={label}
                className="flex items-center gap-2 text-sm font-medium text-white/70"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
              >
                <Icon className="h-4 w-4 text-brand-orange" />
                {label}
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Section 2 — Coverage checker */}
      <section className="bg-white py-20">
        <motion.div
          className="mx-auto grid max-w-4xl items-center gap-8 rounded-[20px] p-4 sm:p-6 lg:grid-cols-2 lg:gap-10"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="px-2 sm:px-4">
            <h2 className="font-display text-[28px] font-bold tracking-[-0.01em] text-ink-900">
              Consulte a <span className="text-brand-orange">cobertura</span>
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-500">
              Digite seu CEP e veja se a fibra Prestek já chegou na sua rua.
            </p>

            <form onSubmit={consultCep} className="mt-6" noValidate>
              <div key={cepShake} className={cn(cepError && 'animate-shake')}>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1">
                    <div
                      className={cn(
                        'relative h-12 overflow-hidden rounded-[10px] border bg-white transition-all duration-150',
                        cepError
                          ? 'border-error'
                          : 'border-ink-300 focus-within:border-brand-orange focus-within:ring-2 focus-within:ring-orange-500/40',
                      )}
                    >
                      <input
                        ref={cepRef}
                        type="tel"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        placeholder="00000-000"
                        value={cep}
                        onChange={(e) => {
                          setCep(maskCEP(e.target.value))
                          if (cepError) setCepError(undefined)
                          if (cepState === 'success') setCepState('idle')
                        }}
                        className="h-full w-full bg-transparent pl-3 pr-10 text-[15px] tracking-wide text-ink-900 outline-none placeholder:text-ink-500"
                        aria-label="Seu CEP"
                        aria-invalid={!!cepError}
                      />
                      <MapPin className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-300" />
                    </div>
                    {cepError && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-error">
                        <CircleAlert className="h-3.5 w-3.5" />
                        {cepError}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={cepState === 'loading'}
                    className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-orange px-7 font-display text-[15px] font-semibold text-white transition-all hover:bg-brand-orangeDark hover:shadow-cta-glow active:scale-[0.97] disabled:cursor-wait disabled:opacity-80"
                  >
                    {cepState === 'loading' ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Consultando…
                      </>
                    ) : (
                      'Consultar'
                    )}
                  </button>
                </div>
              </div>
            </form>

            <AnimatePresence>
              {cepState === 'success' && (
                <motion.div
                  key="cep-success"
                  className="mt-5 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4"
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  role="status"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
                  <p className="text-sm leading-relaxed text-green-800">
                    🎉 Temos cobertura! Você pode contratar qualquer plano abaixo com o desconto do seu convite.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <MapParallax />
        </motion.div>
      </section>

      {/* Section 3 — Plan cards */}
      <section className="bg-surface-tint py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <motion.p
              className="text-[13px] font-semibold uppercase tracking-[0.08em] text-brand-orange"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              Escolha o seu
            </motion.p>
            <motion.h2
              className="mt-2 font-display text-[28px] font-bold tracking-[-0.01em] text-ink-900 sm:text-[32px]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.08, duration: 0.4, ease: EASE }}
            >
              Planos com <span className="relative inline-block text-brand-orange">desconto de indicado
                <span
                  ref={underlineRef}
                  className="absolute -bottom-1 left-0 h-1 w-full origin-left rounded-full bg-brand-orange"
                  aria-hidden
                />
              </span>
            </motion.h2>
            <motion.p
              className="mt-3 text-base text-ink-500"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.16, duration: 0.4, ease: EASE }}
            >
              Preços já com o desconto do convite aplicado.
            </motion.p>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-3 lg:gap-6 xl:gap-8">
            {PLANS.map((plan, i) => (
              <PlanCard key={plan.speed + plan.unit} plan={plan} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — Why Prestek */}
      <section className="bg-panel-dark bg-dotted-grid py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <h2 className="font-display text-[30px] font-bold tracking-[-0.01em] text-white">
              Por que a <span className="text-brand-orange">Prestek?</span>
            </h2>
            <p className="mt-4 max-w-md text-base leading-[1.7] text-white/75">
              Rede própria de fibra, suporte humano de verdade e instalação rápida. É por isso que nossos clientes
              indicam — e por isso que você recebeu um convite.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors duration-200 hover:bg-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }}
              >
                <p className="font-display text-[32px] font-extrabold leading-none text-brand-orange">
                  <StatNumber value={stat.value} format={stat.format} />
                </p>
                <p className="mt-2 text-[13px] font-medium text-white/70">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 — Final CTA */}
      <section className="relative overflow-hidden bg-panel-dark py-20">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(500px_at_75%_50%,rgba(249,115,22,0.15),transparent)]"
          aria-hidden
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
          <motion.div
            className="max-w-xl text-center lg:text-left"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <h2 className="font-display text-[28px] font-bold leading-[1.2] tracking-[-0.01em] text-white sm:text-[32px]">
              Seu desconto de indicado <span className="text-brand-orange">está esperando</span>
            </h2>
            <p className="mt-3 text-base leading-relaxed text-white/75">
              Confirme seus dados no convite e garanta o preço especial em qualquer plano de fibra.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
            >
              <Link
                to="/"
                className="group mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-8 py-3.5 font-display text-base font-semibold text-white transition-all hover:bg-brand-orangeDark hover:shadow-cta-glow active:scale-[0.97]"
              >
                Usar meu convite
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
          <motion.img
            src="/mascot-prestek.png"
            alt="Mascote da Prestek Telecom"
            className="w-48 select-none sm:w-56 lg:w-64"
            initial={{ opacity: 0, x: 32, rotate: 3 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 160, damping: 20 }}
          />
        </div>
      </section>
    </div>
  )
}
