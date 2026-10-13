import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { Check, ChevronDown, CircleAlert, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { maskBRPhone } from '@/lib/phone'

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

/**
 * Composite BR phone field: Brasil-pinned country selector + masked input
 * `(00) 00000-0000` / `(00) 0000-0000` (mask from `@/lib/phone`).
 */
export default function PhoneInput({
  value,
  onChange,
  error,
  inputRef,
  id,
  onEnter,
}: {
  value: string
  onChange: (v: string) => void
  error?: string
  inputRef?: RefObject<HTMLInputElement | null>
  id?: string
  onEnter?: () => void
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
    <div>
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
            aria-label="País do número"
          >
            <BrazilFlag />
            Brasil
            <ChevronDown className={cn('h-3.5 w-3.5 text-ink-500 transition-transform', open && 'rotate-180')} />
          </button>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              id={id}
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="(00) 00000-0000"
              value={value}
              onChange={(e) => onChange(maskBRPhone(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  onEnter?.()
                }
              }}
              className="h-full w-full bg-transparent pl-3 pr-9 text-[15px] text-ink-900 outline-none placeholder:text-ink-500"
              aria-label="WhatsApp usado no convite"
              aria-invalid={!!error}
              aria-describedby={error && id ? `${id}-error` : undefined}
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

      {error && (
        <p id={id ? `${id}-error` : undefined} className="mt-1.5 flex items-center gap-1 text-xs font-medium text-error">
          <CircleAlert className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  )
}
