import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode, RefObject } from 'react'
import { motion } from 'framer-motion'
import {
  Check,
  ChevronDown,
  CircleAlert,
  Loader2,
  MessageCircle,
  Phone,
  Send,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { isValidBRPhone, isValidName, maskBRPhone } from '@/lib/phone'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

export const WA_NUMBER = '5500000000000'
export const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
  'Olá! Vim pela página Fale Conosco da Prestek Telecom e gostaria de atendimento.',
)}`

const SUBJECTS = [
  'Dúvida sobre meu convite',
  'Planos e preços',
  'Suporte técnico',
  'Meus dados (LGPD)',
  'Outro',
]

const OTHER_COUNTRIES = ['Argentina', 'Chile', 'Estados Unidos', 'Portugal', 'Uruguai']

/* ------------------------------------------------------------------ */
/* Phone input with country selector (Brasil pinned) + BR mask         */
/* ------------------------------------------------------------------ */

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
/* Field wrapper: label + control + inline error                       */
/* ------------------------------------------------------------------ */

function Field({
  label,
  htmlFor,
  error,
  shakeKey,
  children,
}: {
  label: string
  htmlFor?: string
  error?: string
  shakeKey: number
  children: ReactNode
}) {
  return (
    <div key={shakeKey} className={cn(error && 'animate-shake')}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-[13px] font-semibold tracking-[0.02em] text-ink-900"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-[12px] font-medium text-error">
          <CircleAlert className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Success state                                                       */
/* ------------------------------------------------------------------ */

function FormSuccess({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="flex flex-col items-center py-10 text-center"
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
      >
        <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden>
          <motion.path
            d="M9 21 L17 29 L31 12"
            fill="none"
            stroke="#16A34A"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
          />
        </svg>
      </motion.span>
      <h3 className="mt-6 font-display text-[24px] font-bold text-ink-900">Mensagem enviada!</h3>
      <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-ink-500">
        Nossa equipe responde em até 1 dia útil. Para resposta imediata, chame no WhatsApp.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-orange px-6 font-display text-[15px] font-semibold text-white transition-all duration-200 hover:bg-brand-orangeDark hover:shadow-cta-glow"
        >
          <MessageCircle className="h-5 w-5" />
          Abrir WhatsApp
        </a>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-12 items-center rounded-full border border-ink-300 px-6 font-display text-[15px] font-semibold text-ink-900 transition-colors duration-200 hover:border-brand-orange hover:text-brand-orange"
        >
          Enviar outra mensagem
        </button>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Contact form card                                                   */
/* ------------------------------------------------------------------ */

type FormErrors = { name?: string; phone?: string; message?: string }

export default function ContactForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState(SUBJECTS[0])
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)

  const nameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: FormErrors = {}
    if (!isValidName(name)) next.name = 'Informe seu nome completo.'
    if (!isValidBRPhone(phone)) next.phone = 'Digite um WhatsApp válido com DDD.'
    if (message.trim().length < 10) next.message = 'Conte um pouco mais (mínimo de 10 caracteres).'
    setErrors(next)
    if (Object.keys(next).length > 0) {
      setShakeKey((k) => k + 1)
      window.setTimeout(() => {
        if (next.name) nameRef.current?.focus()
        else if (next.phone) phoneRef.current?.focus()
        else if (next.message) messageRef.current?.focus()
      }, 50)
      return
    }
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      toast.success('Mensagem enviada com sucesso!')
    }, 1200)
  }

  const resetForm = () => {
    setSuccess(false)
    setName('')
    setPhone('')
    setSubject(SUBJECTS[0])
    setMessage('')
    setErrors({})
  }

  if (success) {
    return (
      <div className="rounded-[20px] border border-ink-300/40 bg-white p-6 shadow-card sm:p-8">
        <FormSuccess onReset={resetForm} />
      </div>
    )
  }

  return (
    <div className="rounded-[20px] border border-ink-300/40 bg-white p-6 shadow-card sm:p-8">
      <h2 className="font-display text-[26px] font-bold tracking-[-0.01em] text-ink-900">
        Envie sua <span className="text-brand-orange">mensagem</span>
      </h2>
      <p className="mt-2 text-[15px] text-ink-500">
        Preencha os campos abaixo — respondemos rapidinho.
      </p>

      <form onSubmit={submit} noValidate className="mt-7 space-y-5">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          className="space-y-5"
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } } }}>
            <Field label="Seu nome" htmlFor="contato-nome" error={errors.name} shakeKey={shakeKey}>
              <div
                className={cn(
                  'relative h-12 rounded-[10px] border bg-white transition-all duration-150',
                  errors.name
                    ? 'border-error'
                    : 'border-ink-300 focus-within:border-brand-orange focus-within:ring-2 focus-within:ring-orange-500/40',
                )}
              >
                <input
                  ref={nameRef}
                  id="contato-nome"
                  type="text"
                  autoComplete="name"
                  placeholder="João"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (errors.name) setErrors((p) => ({ ...p, name: undefined }))
                  }}
                  className="h-full w-full rounded-[10px] bg-transparent pl-3 pr-10 text-[15px] text-ink-900 outline-none placeholder:text-ink-500"
                  aria-invalid={!!errors.name}
                />
                <User className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-300" />
              </div>
            </Field>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } } }}>
            <Field label="Seu WhatsApp" error={errors.phone} shakeKey={shakeKey}>
              <PhoneInput
                value={phone}
                onChange={(v) => {
                  setPhone(v)
                  if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }))
                }}
                error={errors.phone}
                inputRef={phoneRef}
              />
            </Field>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } } }}>
            <div>
              <label
                htmlFor="contato-assunto"
                className="mb-1.5 block text-[13px] font-semibold tracking-[0.02em] text-ink-900"
              >
                Assunto
              </label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger
                  id="contato-assunto"
                  className="h-12 w-full rounded-[10px] border-ink-300 px-3 text-[15px] text-ink-900 shadow-none focus:border-brand-orange focus:ring-2 focus:ring-orange-500/40"
                >
                  <SelectValue placeholder="Selecione o assunto" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s} className="text-[15px]">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } } }}>
            <Field label="Mensagem" htmlFor="contato-mensagem" error={errors.message} shakeKey={shakeKey}>
              <textarea
                ref={messageRef}
                id="contato-mensagem"
                placeholder="Como podemos ajudar?"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value)
                  if (errors.message) setErrors((p) => ({ ...p, message: undefined }))
                }}
                rows={5}
                className={cn(
                  'h-32 w-full resize-none rounded-[10px] border bg-white px-3 py-3 text-[15px] text-ink-900 outline-none transition-all duration-150 placeholder:text-ink-500',
                  errors.message
                    ? 'border-error'
                    : 'border-ink-300 focus:border-brand-orange focus:ring-2 focus:ring-orange-500/40',
                )}
                aria-invalid={!!errors.message}
              />
            </Field>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } } }}>
            <button
              type="submit"
              disabled={loading}
              className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-orange font-display text-[15px] font-semibold text-white transition-all duration-200 hover:bg-brand-orangeDark hover:shadow-cta-glow active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-80"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Enviando…
                </>
              ) : (
                <>
                  Enviar mensagem
                  <Send className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </motion.div>
        </motion.div>
      </form>
    </div>
  )
}
