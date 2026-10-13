import { memo, useEffect, useRef, useState } from 'react'
import type { FormEvent, MouseEvent as ReactMouseEvent, RefObject } from 'react'
import { Link } from 'react-router'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleAlert,
  CircleHelp,
  Globe,
  Loader2,
  Lock,
  MessageCircle,
  Phone,
  Radar,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { isValidBRPhone, isValidName, maskBRPhone, phoneDigits } from '@/lib/phone'
import Funnel from '@/components/funnel/Funnel'
import QRModal from '@/components/invite/QRModal'
import HowItWorksModal from '@/components/invite/HowItWorksModal'
import RegulamentoModal from '@/components/invite/RegulamentoModal'
import DuplicateNotice from '@/components/invite/DuplicateNotice'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

/* ------------------------------------------------------------------ */
/* Duplicate-submission tracking (localStorage)                        */
/* ------------------------------------------------------------------ */

const SUBMITTED_KEY = 'prestek_convite_enviados'

interface SubmittedEntry {
  phone: string
  name?: string
  at: string
}

function readSubmitted(): SubmittedEntry[] {
  try {
    const raw = window.localStorage.getItem(SUBMITTED_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (e): e is SubmittedEntry =>
        typeof e === 'object' && e !== null && typeof (e as SubmittedEntry).phone === 'string',
    )
  } catch {
    return []
  }
}

function hasSubmittedPhone(phone: string): boolean {
  return readSubmitted().some((e) => e.phone === phone)
}

function rememberSubmitted(phone: string, name: string) {
  try {
    const list = readSubmitted().filter((e) => e.phone !== phone)
    list.push({ phone, name, at: new Date().toISOString() })
    window.localStorage.setItem(SUBMITTED_KEY, JSON.stringify(list))
  } catch {
    /* localStorage unavailable — dedupe silently disabled */
  }
}

/* ------------------------------------------------------------------ */
/* Ambient decorations (perpetual animations isolated + memoized)      */
/* ------------------------------------------------------------------ */

const GlowOrbs = memo(function GlowOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block" aria-hidden>
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
      className={cn('ambient-motion pointer-events-none select-none', className)}
      animate={{ opacity: [0.08, 0.18, 0.08] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
})

/* ------------------------------------------------------------------ */
/* Headline with word-level reveal + orange underline on "indicou"     */
/* ------------------------------------------------------------------ */

function Headline() {
  const words: { text: string; accent?: boolean }[] = [
    { text: 'Se' },
    { text: 'Marcio' },
    { text: 'indicou,', accent: true },
    { text: 'não' },
    { text: 'foi' },
    { text: 'à' },
    { text: 'toa.' },
  ]
  const wordDelay = (i: number) => 0.3 + i * 0.06

  return (
    <h1 className="font-display text-[clamp(28px,3.2vw,40px)] font-bold leading-[1.15] tracking-[-0.02em] text-white">
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
          <motion.span
            className="relative inline-block pr-[0.28em]"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: wordDelay(i), duration: 0.5, ease: EASE }}
          >
            {word.accent ? (
              <span className="relative inline-block text-brand-orange">
                {word.text}
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 120 12"
                  fill="none"
                  aria-hidden
                >
                  <motion.path
                    d="M3 9 C 30 3, 70 3, 117 7"
                    stroke="#F97316"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: wordDelay(words.length - 1) + 0.25, duration: 0.4, ease: 'easeOut' }}
                  />
                </svg>
              </span>
            ) : (
              word.text
            )}
          </motion.span>
        </span>
      ))}
    </h1>
  )
}

/* ------------------------------------------------------------------ */
/* Phone input with country selector (Brasil pinned) + BR mask         */
/* ------------------------------------------------------------------ */

const OTHER_COUNTRIES = ['Argentina', 'Chile', 'Estados Unidos', 'Portugal', 'Uruguai']

function BrazilFlag() {
  return (
    <svg viewBox="0 0 20 14" className="h-3.5 w-5 shrink-0 rounded-[2px]" aria-hidden>
      <rect width="20" height="14" fill="#009B3A" />
      <path d="M10 2 L18 7 L10 12 L2 7 Z" fill="#FEDF00" />
      <circle cx="10" cy="7" r="2.6" fill="#002776" />
    </svg>
  )
}

function PhoneInput({
  value,
  onChange,
  error,
  inputRef,
}: {
  value: string
  onChange: (v: string) => void
  error?: string
  inputRef: RefObject<HTMLInputElement | null>
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  return (
    <div ref={wrapRef} className="relative">
      <div
        className={cn(
          'flex h-12 overflow-hidden rounded-[10px] border bg-white transition-all duration-150',
          error
            ? 'border-error'
            : 'border-ink-300 focus-within:border-brand-orange focus-within:ring-2 focus-within:ring-orange-500/40',
        )}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-[88px] shrink-0 items-center justify-center gap-1.5 border-r border-ink-300 bg-surface-tint text-[13px] font-medium text-ink-900 transition-colors hover:bg-ink-300/20"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <BrazilFlag />
          Brasil
          <ChevronDown className={cn('h-3.5 w-3.5 text-ink-500 transition-transform', open && 'rotate-180')} />
        </button>
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="(00) 00000-0000"
            value={value}
            onChange={(e) => onChange(maskBRPhone(e.target.value))}
            className="h-full w-full bg-transparent pl-3 pr-9 text-[15px] text-ink-900 outline-none placeholder:text-ink-500"
            aria-label="Seu WhatsApp"
            aria-invalid={!!error}
          />
          <Phone className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-300" />
        </div>
      </div>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-[52px] z-30 w-56 overflow-hidden rounded-xl border border-ink-300/60 bg-white shadow-card"
        >
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-2.5 text-[13px] font-semibold text-ink-900">
            <BrazilFlag />
            Brasil
            <Check className="ml-auto h-4 w-4 text-brand-orange" />
          </div>
          {OTHER_COUNTRIES.map((c) => (
            <div
              key={c}
              title="Em breve"
              className="flex cursor-not-allowed items-center justify-between px-3 py-2.5 text-[13px] text-ink-300"
            >
              {c}
              <span className="rounded-full bg-surface-tint px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                Em breve
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Animated consent checkbox                                           */
/* ------------------------------------------------------------------ */

function ConsentCheckbox({
  checked,
  onChange,
  error,
  onOpenRegulamento,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  error?: string
  onOpenRegulamento: () => void
}) {
  return (
    <div className={cn(error && 'animate-shake')}>
      <div className="flex items-start gap-3">
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          aria-label="Aceite do regulamento"
          onClick={() => onChange(!checked)}
          className={cn(
            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border transition-colors duration-150',
            checked ? 'border-brand-orange bg-brand-orange' : 'border-ink-300 bg-white hover:border-brand-orange',
            error && !checked && 'border-error',
          )}
        >
          <motion.svg
            viewBox="0 0 14 12"
            className="h-3 w-3"
            initial={false}
            animate={{ scale: checked ? [1, 1.15, 1] : 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.path
              d="M1.5 6.5 L5 10 L12.5 1.5"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={false}
              animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />
          </motion.svg>
        </button>
        <p className="text-[13.5px] leading-[1.5] text-ink-900/80">
          Permito o uso dos meus dados pessoais e concordo em ser contatado pelo setor comercial e concordo com o{' '}
          <button
            type="button"
            onClick={onOpenRegulamento}
            className="font-medium text-brand-blue underline underline-offset-2 transition-colors hover:text-blue-800"
          >
            regulamento deste convite
          </button>
        </p>
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-error">
          <CircleAlert className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Invite page                                                         */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(true)
  const [errors, setErrors] = useState<{ name?: string; phone?: string; consent?: string }>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [duplicateOpen, setDuplicateOpen] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)

  const [qrOpen, setQrOpen] = useState(false)
  const [howOpen, setHowOpen] = useState(false)
  const [regOpen, setRegOpen] = useState(false)

  const nameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)

  // mascot pointer tilt (desktop)
  const tiltTarget = useMotionValue(0)
  const tilt = useSpring(tiltTarget, { stiffness: 120, damping: 18 })

  const handleTilt = (e: ReactMouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width - 0.5
    tiltTarget.set(pct * 3) // max ~1.5deg each way
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!isValidName(name)) next.name = 'Informe seu nome completo.'
    if (!isValidBRPhone(phone)) next.phone = 'Digite um WhatsApp válido com DDD.'
    if (!consent) next.consent = 'É preciso aceitar o regulamento para continuar.'
    setErrors(next)
    if (Object.keys(next).length > 0) {
      setShakeKey((k) => k + 1)
      if (next.name) nameRef.current?.focus()
      else if (next.phone) phoneRef.current?.focus()
      return
    }
    // Duplicate guard: this WhatsApp already confirmed the invite before —
    // skip the contracting funnel and show the notice bubble instead.
    const digits = phoneDigits(phone)
    if (hasSubmittedPhone(digits)) {
      setDuplicateOpen(true)
      return
    }
    setLoading(true)
    window.setTimeout(() => {
      rememberSubmitted(digits, name.trim())
      setLoading(false)
      setSuccess(true)
    }, 1200)
  }

  const resetForm = () => {
    setSuccess(false)
    setName('')
    setPhone('')
    setConsent(true)
    setErrors({})
  }

  const focusNameField = () => {
    window.setTimeout(() => nameRef.current?.focus({ preventScroll: false }), 250)
    nameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="grid min-h-[100dvh] bg-white lg:grid-cols-[58%_42%]">
      {/* ================= LEFT — dark panel ================= */}
      <section
        className="bg-panel-dark relative flex min-h-[52dvh] flex-col overflow-hidden lg:min-h-[100dvh]"
        onMouseMove={handleTilt}
        onMouseLeave={() => tiltTarget.set(0)}
      >
        <div className="bg-dotted-grid absolute inset-0" aria-hidden />
        <GlowOrbs />
        {/* wifi arcs watermark bottom-left */}
        <img
          src="/wifi-arcs.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 w-[420px] opacity-[0.12] lg:w-[600px]"
        />

        {/* copy block */}
        <div className="relative z-10 max-w-[560px] p-[clamp(24px,4vw,56px)]">
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 backdrop-blur"
          >
            <span className="animate-pulse-dot h-2 w-2 rounded-full bg-brand-orange" />
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-white">Convite Exclusivo</span>
          </motion.div>

          <div className="mt-5">
            <Headline />
          </div>

          <motion.p
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5, ease: EASE }}
            className="mt-4 max-w-[440px] text-[17px] leading-[1.55] text-white/85"
          >
            Ele já está conectado com a Prestek e você pode contratar agora com desconto especial.
          </motion.p>

          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5, ease: EASE }}
            className="mt-5 flex items-center gap-2.5"
          >
            <motion.img
              src="/avatar-marcio.png"
              alt="Marcio"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 300, damping: 18 }}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-orange-500/60"
            />
            <p className="text-[15px] text-white/70">
              Nome do indicador: <span className="font-semibold text-white">Marcio — Prestek Telecom</span>
            </p>
          </motion.div>
        </div>

        {/* mascot */}
        <motion.div
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.8, ease: EASE }}
          className="pointer-events-none absolute bottom-0 right-0 z-[5] h-[62%] w-full lg:h-[85%]"
          aria-hidden
        >
          <div
            className="absolute bottom-0 right-[8%] h-[70%] w-[70%] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(400px, rgba(249,115,22,0.25), transparent)' }}
          />
          <PulsingArcs className="absolute right-[34%] top-[2%] w-40 lg:w-56" />
          <motion.img
            src="/mascot-prestek.png"
            alt=""
            className="ambient-motion absolute bottom-0 right-0 h-full object-contain object-bottom"
            style={{ rotate: tilt }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* QR block */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5, ease: EASE }}
          className="relative z-10 mt-auto p-[clamp(24px,4vw,56px)]"
        >
          <div className="group inline-flex items-center gap-3">
            <span style={{ perspective: '120px' }} className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 transition-transform duration-200 group-hover:-rotate-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 40 40" fill="none" aria-hidden="true" className="qr-dice-spin">
                <path d="M6.25 8.125C6.25 7.09 7.09 6.25 8.125 6.25H15.625C16.66 6.25 17.5 7.09 17.5 8.125V15.625C17.5 16.66 16.66 17.5 15.625 17.5H8.125C7.62772 17.5 7.15081 17.3025 6.79917 16.9508C6.44754 16.5992 6.25 16.1223 6.25 15.625V8.125ZM6.25 24.375C6.25 23.34 7.09 22.5 8.125 22.5H15.625C16.66 22.5 17.5 23.34 17.5 24.375V31.875C17.5 32.91 16.66 33.75 15.625 33.75H8.125C7.62772 33.75 7.15081 33.5525 6.79917 33.2008C6.44754 32.8492 6.25 32.3723 6.25 31.875V24.375ZM22.5 8.125C22.5 7.09 23.34 6.25 24.375 6.25H31.875C32.91 6.25 33.75 7.09 33.75 8.125V15.625C33.75 16.66 32.91 17.5 31.875 17.5H24.375C23.8777 17.5 23.4008 17.3025 23.0492 16.9508C22.6975 16.5992 22.5 16.1223 22.5 15.625V8.125Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.25 11.25H12.5V12.5H11.25V11.25ZM11.25 27.5H12.5V28.75H11.25V27.5ZM27.5 11.25H28.75V12.5H27.5V11.25ZM22.5 22.5H23.75V23.75H22.5V22.5ZM22.5 32.5H23.75V33.75H22.5V32.5ZM32.5 22.5H33.75V23.75H32.5V22.5ZM32.5 32.5H33.75V33.75H32.5V32.5ZM27.5 27.5H28.75V28.75H27.5V27.5Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <button
              type="button"
              onClick={() => setQrOpen(true)}
              className="rounded-full border border-white/40 px-5 py-2.5 font-display text-[15px] font-semibold text-white transition-all duration-200 hover:border-white/60 hover:bg-white/10"
            >
              Gerar QR code
            </button>
          </div>
        </motion.div>
      </section>

      {/* ================= RIGHT — form panel ================= */}
      <section className="relative flex min-h-[100dvh] flex-col bg-surface-tint lg:bg-white">
        <motion.div
          initial={{ x: 48, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
          className="flex flex-1 flex-col justify-center px-[clamp(24px,4vw,64px)] py-12"
        >
          <div className="mx-auto w-full max-w-[420px]">
            <motion.img
              src="/logo-prestek.svg"
              alt="Prestek Telecom"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4, ease: EASE }}
              className="mx-auto mb-6 h-10 w-auto"
            />
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-ink-300/60" />
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">Convite de indicação</span>
              <span className="h-px flex-1 bg-ink-300/60" />
            </div>

            <motion.div
              key={shakeKey}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5, ease: EASE }}
              className={cn(
                'rounded-2xl bg-white p-5 sm:p-7 lg:border lg:border-[#E2E8F0] lg:shadow-card',
                shakeKey > 0 && 'animate-shake',
              )}
            >
              <form onSubmit={submit} noValidate className="space-y-5">
                  <motion.div
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.47, duration: 0.35, ease: EASE }}
                  >
                    <label htmlFor="invite-name" className="mb-1.5 block text-[13px] font-semibold tracking-[0.02em] text-ink-900">
                      Seu nome
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-300" />
                      <input
                        ref={nameRef}
                        id="invite-name"
                        type="text"
                        autoComplete="name"
                        placeholder="João"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value)
                          if (errors.name) setErrors((p) => ({ ...p, name: undefined }))
                        }}
                        aria-invalid={!!errors.name}
                        className={cn(
                          'h-12 w-full rounded-[10px] border bg-white pl-10 pr-3 text-[15px] text-ink-900 outline-none transition-all duration-150 placeholder:text-ink-500',
                          errors.name
                            ? 'border-error'
                            : 'border-ink-300 focus:border-brand-orange focus:ring-2 focus:ring-orange-500/40',
                        )}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-error">
                        <CircleAlert className="h-3.5 w-3.5" />
                        {errors.name}
                      </p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.54, duration: 0.35, ease: EASE }}
                  >
                    <label htmlFor="invite-phone" className="mb-1.5 block text-[13px] font-semibold tracking-[0.02em] text-ink-900">
                      Seu WhatsApp
                    </label>
                    <PhoneInput
                      value={phone}
                      onChange={(v) => {
                        setPhone(v)
                        if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }))
                      }}
                      error={errors.phone}
                      inputRef={phoneRef}
                    />
                    {errors.phone && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-error">
                        <CircleAlert className="h-3.5 w-3.5" />
                        {errors.phone}
                      </p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.61, duration: 0.35, ease: EASE }}
                  >
                    <ConsentCheckbox
                      checked={consent}
                      onChange={(v) => {
                        setConsent(v)
                        if (errors.consent) setErrors((p) => ({ ...p, consent: undefined }))
                      }}
                      error={errors.consent}
                      onOpenRegulamento={() => setRegOpen(true)}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.68, duration: 0.35, ease: EASE }}
                    className="space-y-3"
                  >
                    <button
                      type="submit"
                      disabled={loading}
                      className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-brand-orange font-display text-base font-semibold text-white transition-all duration-200 hover:bg-brand-orangeDark hover:shadow-cta-glow active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-80"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Enviando…
                        </>
                      ) : (
                        <>
                          Enviar meus dados
                          <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                    <p className="flex items-center justify-center gap-1.5 text-xs text-ink-500">
                      <Lock className="h-3 w-3" />
                      Seus dados estão seguros. Nada de spam, prometido.
                    </p>
                  </motion.div>
                </form>
            </motion.div>
          </div>
        </motion.div>

        {/* footer links row */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 border-t border-ink-300/40 px-6 py-6 lg:justify-end lg:border-t-0 lg:px-8"
          aria-label="Links auxiliares"
        >
          {([
            { icon: Globe, label: 'Nosso site', href: 'https://www.prestek.com.br', external: true },
            { icon: Radar, label: 'Acompanhar', to: '/acompanhar', external: false },
            { icon: MessageCircle, label: 'Fale conosco', to: '/fale-conosco', external: false },
          ] as { icon: typeof Globe; label: string; href?: string; to?: string; external: boolean }[]).map((item, i) => (
            <motion.span
              key={item.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.06, duration: 0.35 }}
            >
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-orange transition-colors duration-200 hover:text-brand-orangeDark"
                >
                  <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                  {item.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-brand-orangeDark transition-transform duration-200 group-hover:scale-x-100" />
                </a>
              ) : (
                <Link
                  to={item.to!}
                  className="group relative inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-orange transition-colors duration-200 hover:text-brand-orangeDark"
                >
                  <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                  {item.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-brand-orangeDark transition-transform duration-200 group-hover:scale-x-100" />
                </Link>
              )}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.18, duration: 0.35 }}
          >
            <button
              type="button"
              onClick={() => setHowOpen(true)}
              className="group relative inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-orange transition-colors duration-200 hover:text-brand-orangeDark"
            >
              <CircleHelp className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
              Como funciona o convite?
              <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-brand-orangeDark transition-transform duration-200 group-hover:scale-x-100" />
            </button>
          </motion.span>
        </motion.nav>
      </section>

      {/* 5-step contracting funnel (replaces the direct success screen) */}
      {success && <Funnel initialName={name} initialPhone={phone} onReset={resetForm} />}

      {/* Modals */}
      <QRModal open={qrOpen} onClose={() => setQrOpen(false)} />
      <HowItWorksModal open={howOpen} onClose={() => setHowOpen(false)} onFillInvite={focusNameField} />
      <RegulamentoModal open={regOpen} onClose={() => setRegOpen(false)} onAccept={() => setConsent(true)} />
      <DuplicateNotice open={duplicateOpen} onClose={() => setDuplicateOpen(false)} />
    </div>
  )
}
