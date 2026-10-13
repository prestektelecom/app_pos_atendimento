import { memo, useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  ChevronRight,
  CircleHelp,
  Clock,
  Loader2,
  Lock,
  MessageCircle,
  RotateCcw,
  Search,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { isValidBRPhone, phoneDigits } from '@/lib/phone'
import PhoneInput from '@/components/PhoneInput'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]
const WA_LINK =
  'https://wa.me/5500000000000?text=' +
  encodeURIComponent('Olá! Consultei o status do meu convite Prestek Telecom e quero falar com a equipe.')

type LookupState = 'idle' | 'loading' | 'result'

const STAGES: { title: string; description: string; time?: string; state: 'done' | 'current' | 'pending' }[] = [
  {
    title: 'Convite preenchido',
    description: 'Recebemos seus dados com sucesso.',
    time: 'Hoje, 14:32',
    state: 'done',
  },
  {
    title: 'Confirmação enviada no WhatsApp',
    description: 'Você recebeu a mensagem de confirmação do convite.',
    time: 'Hoje, 14:33',
    state: 'done',
  },
  {
    title: 'Contato comercial em andamento',
    description:
      'Nossa equipe está preparando sua proposta com desconto especial. Você receberá o contato em até 1 dia útil.',
    time: 'Em andamento',
    state: 'current',
  },
  {
    title: 'Ativação da Internet Premium',
    description: 'Instalação e ativação do seu plano com desconto de indicado.',
    state: 'pending',
  },
]

function maskPhone(value: string): string {
  const d = phoneDigits(value)
  if (d.length < 4) return '(**) ****-****'
  const last = d.slice(-2)
  const ddd = d.slice(0, 2)
  return `(${ddd}) 9••••-••${last}`
}

/* ------------------------------------------------------------------ */
/* Ambient decorations (perpetual animations isolated + memoized)      */
/* ------------------------------------------------------------------ */

const GlowOrbs = memo(function GlowOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="ambient-motion absolute -right-20 -top-24 h-[300px] w-[300px] rounded-full bg-brand-orange/20 blur-3xl"
        animate={{ x: [0, -24, 0], y: [0, 24, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="ambient-motion absolute -bottom-16 -left-24 h-[360px] w-[360px] rounded-full bg-brand-violet700/50 blur-3xl"
        animate={{ x: [0, 24, 0], y: [0, -20, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.img
        src="/wifi-arcs.svg"
        alt=""
        className="ambient-motion absolute right-8 top-10 w-40 select-none opacity-20"
        animate={{ opacity: [0.08, 0.22, 0.08] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
})

/* ------------------------------------------------------------------ */
/* Word-stagger headline                                               */
/* ------------------------------------------------------------------ */

function Headline() {
  const words: { text: string; accent?: boolean }[] = [
    { text: 'Acompanhe' },
    { text: 'seu' },
    { text: 'convite', accent: true },
  ]
  return (
    <h1 className="font-display text-[clamp(28px,3.5vw,38px)] font-bold leading-[1.15] tracking-[-0.02em] text-white">
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
          <motion.span
            className="inline-block pr-[0.28em]"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: EASE }}
          >
            {word.accent ? <span className="text-brand-orange">{word.text}</span> : word.text}
          </motion.span>
        </span>
      ))}
    </h1>
  )
}

/* ------------------------------------------------------------------ */
/* Loading skeleton (shimmer bars)                                     */
/* ------------------------------------------------------------------ */

function TimelineSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div
              className="h-3.5 animate-pulse rounded-full bg-slate-200"
              style={{ width: `${70 - i * 12}%`, animationDelay: `${i * 150}ms` }}
            />
            <div
              className="h-3 animate-pulse rounded-full bg-slate-100"
              style={{ width: `${45 - i * 8}%`, animationDelay: `${i * 150 + 60}ms` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Timeline stage row                                                  */
/* ------------------------------------------------------------------ */

function StageDot({ state }: { state: 'done' | 'current' | 'pending' }) {
  if (state === 'done') {
    return (
      <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white shadow-[0_4px_12px_rgba(249,115,22,0.4)]">
        <Check className="h-[18px] w-[18px]" strokeWidth={3} />
      </span>
    )
  }
  if (state === 'current') {
    return (
      <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-brand-orange/30" />
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-orange bg-white">
          <span className="h-3 w-3 animate-pulse-dot rounded-full bg-brand-orange" />
        </span>
      </span>
    )
  }
  return (
    <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 bg-white" />
  )
}

/* ------------------------------------------------------------------ */
/* Result timeline                                                     */
/* ------------------------------------------------------------------ */

function StatusTimeline({ phone, onReset }: { phone: string; onReset: () => void }) {
  return (
    <div>
      {/* Summary header */}
      <div className="flex items-center gap-4">
        <img
          src="/avatar-marcio.png"
          alt="Marcio"
          className="h-12 w-12 shrink-0 rounded-full border-2 border-orange-100 object-cover"
        />
        <div>
          <p className="text-[15px] font-semibold leading-snug text-ink-900 sm:text-base">
            Convite indicado por <span className="text-brand-orange">Marcio — Prestek Telecom</span>
          </p>
          <p className="mt-0.5 text-[13px] text-ink-500">Número consultado: {maskPhone(phone)}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[13px] font-semibold text-ink-500">Progresso da indicação</span>
          <span className="text-[13px] font-semibold text-brand-orange">Etapa 3 de 4</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className="relative h-full rounded-full bg-gradient-to-r from-brand-orange to-brand-orangeDark"
            initial={{ width: '0%' }}
            animate={{ width: '75%' }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <motion.span
              className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, delay: 0.9, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative mt-8">
        {/* connector line */}
        <motion.span
          className="absolute bottom-5 left-[17px] top-5 w-0.5 origin-top bg-slate-200"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          aria-hidden
        />
        <ol className="space-y-5">
          {STAGES.map((stage, i) => (
            <motion.li
              key={stage.title}
              className={cn(
                'relative flex gap-4 rounded-2xl p-3 -m-3',
                stage.state === 'current' && 'border-l-2 border-brand-orange bg-orange-50/50',
              )}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.12, duration: 0.45, ease: EASE }}
            >
              <StageDot state={stage.state} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3
                    className={cn(
                      'font-display text-[17px] font-semibold',
                      stage.state === 'pending' ? 'text-ink-300' : 'text-ink-900',
                    )}
                  >
                    {stage.title}
                  </h3>
                  {stage.time && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface-tint px-2.5 py-1 text-xs font-medium text-ink-500">
                      <Clock className="h-3 w-3" />
                      {stage.time}
                    </span>
                  )}
                </div>
                <p className={cn('mt-1 text-sm leading-relaxed', stage.state === 'pending' ? 'text-ink-300' : 'text-ink-500')}>
                  {stage.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* CTA row */}
      <motion.div
        className="mt-8 flex flex-col gap-3 sm:flex-row"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.4, ease: EASE }}
      >
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand-orange font-display text-[15px] font-semibold text-white transition-all hover:bg-brand-orangeDark hover:shadow-cta-glow active:scale-[0.97]"
        >
          <MessageCircle className="h-5 w-5" />
          Falar com a equipe
        </a>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full font-display text-[15px] font-semibold text-ink-500 transition-colors hover:bg-surface-tint hover:text-ink-900"
        >
          <RotateCcw className="h-4 w-4" />
          Nova consulta
        </button>
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Acompanhar() {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string>()
  const [state, setState] = useState<LookupState>('idle')
  const [shakeKey, setShakeKey] = useState(0)
  const phoneRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    document.title = 'Acompanhar indicação — Prestek Telecom'
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const prev = meta?.content
    meta?.setAttribute('content', 'Veja o status do seu convite de indicação Prestek Telecom.')
    return () => {
      document.title = 'Convite Exclusivo — Prestek Telecom'
      if (meta && prev) meta.setAttribute('content', prev)
    }
  }, [])

  const submit = (e?: FormEvent) => {
    e?.preventDefault()
    if (state === 'loading') return
    if (!isValidBRPhone(phone)) {
      setError('Digite um WhatsApp válido com DDD.')
      setShakeKey((k) => k + 1)
      phoneRef.current?.focus()
      return
    }
    setError(undefined)
    setState('loading')
    window.setTimeout(() => setState('result'), 1400)
  }

  const reset = () => {
    setState('idle')
    setPhone('')
    setError(undefined)
  }

  return (
    <div>
      {/* Section 1 — Hero + lookup form */}
      <section className="bg-panel-dark bg-dotted-grid relative overflow-hidden pb-24 pt-20 sm:pb-28 sm:pt-24">
        <GlowOrbs />
        <div className="relative mx-auto max-w-xl px-4 text-center sm:px-6">
          <nav aria-label="Breadcrumb" className="mb-5 flex items-center justify-center gap-1.5 text-[13px] font-medium text-white/50">
            <Link to="/" className="transition-colors hover:text-brand-orangeLight">
              Início
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/80">Acompanhar</span>
          </nav>

          <motion.span
            className="inline-block rounded-full border border-brand-orange/40 bg-brand-orange/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-brand-orangeLight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            Acompanhar indicação
          </motion.span>

          <div className="mt-4">
            <Headline />
          </div>

          <motion.p
            className="mt-4 text-base leading-relaxed text-white/80"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: EASE }}
          >
            Digite o WhatsApp usado no convite e veja em que etapa sua indicação está.
          </motion.p>
        </div>
      </section>

      {/* Lookup card overlapping the hero band */}
      <section className="mx-auto -mt-16 max-w-xl px-4 pb-16 sm:-mt-16 sm:px-6">
        <motion.div
          className="rounded-[20px] bg-white p-6 shadow-card sm:p-8"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 160, damping: 22 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {state !== 'result' ? (
              <motion.form
                key="form"
                onSubmit={submit}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: EASE }}
                noValidate
              >
                <label
                  htmlFor="track-phone"
                  className="mb-1.5 block text-[13px] font-semibold tracking-[0.02em] text-ink-900"
                >
                  WhatsApp usado no convite
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div key={shakeKey} className={cn('flex-1', error && 'animate-shake')}>
                    <PhoneInput
                      id="track-phone"
                      value={phone}
                      onChange={(v) => {
                        setPhone(v)
                        if (error) setError(undefined)
                      }}
                      error={error}
                      inputRef={phoneRef}
                      onEnter={() => submit()}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={state === 'loading'}
                    className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-orange px-7 font-display text-[15px] font-semibold text-white transition-all hover:bg-brand-orangeDark hover:shadow-cta-glow active:scale-[0.97] disabled:cursor-wait disabled:opacity-80"
                  >
                    {state === 'loading' ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Consultando…
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                        Consultar
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-500">
                  <Lock className="h-3.5 w-3.5 text-ink-300" />
                  Consulta segura — nenhum dado é exibido publicamente.
                </p>

                {state === 'loading' && (
                  <motion.div
                    className="mt-6 border-t border-ink-300/40 pt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TimelineSkeleton />
                  </motion.div>
                )}
              </motion.form>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <StatusTimeline phone={phone} onReset={reset} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Section 3 — Help strip */}
      <section className="bg-surface-tint py-14">
        <motion.div
          className="mx-auto max-w-xl px-4 text-center sm:px-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <h2 className="font-display text-[22px] font-semibold text-ink-900">Ficou alguma dúvida?</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-500">
            Fale com a gente ou veja como funciona o convite.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/fale-conosco"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-full border border-ink-300 bg-white px-6 font-display text-sm font-semibold text-ink-900 transition-all hover:border-brand-orange hover:text-brand-orange"
            >
              <MessageCircle className="h-4 w-4 text-brand-orange" />
              Fale conosco
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/como-funciona"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-ink-300 bg-white px-6 font-display text-sm font-semibold text-ink-900 transition-all hover:border-brand-orange hover:text-brand-orange"
            >
              <CircleHelp className="h-4 w-4 text-brand-orange" />
              Como funciona
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
