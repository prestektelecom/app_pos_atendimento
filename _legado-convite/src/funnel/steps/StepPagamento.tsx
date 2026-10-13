import type { ReactElement } from 'react'
import { ArrowRight, Barcode, Check, ChevronLeft, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PaymentMethod } from '../types'

/** PIX-style diamond glyph (lucide não tem o logo oficial do Pix). */
function PixIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <rect x="7" y="7" width="10" height="10" rx="2.5" transform="rotate(45 12 12)" />
      <rect x="9.8" y="9.8" width="4.4" height="4.4" rx="1.2" transform="rotate(45 12 12)" fill="currentColor" stroke="none" />
    </svg>
  )
}

const OPTIONS: { id: PaymentMethod; label: string; icon: (p: { className?: string }) => ReactElement }[] = [
  { id: 'pix', label: 'PIX', icon: PixIcon },
  { id: 'boleto', label: 'Boleto', icon: (p) => <Barcode className={p.className} aria-hidden /> },
  { id: 'card', label: 'Crédito', icon: (p) => <CreditCard className={p.className} aria-hidden /> },
]

const DUE_DAYS = [5, 10, 15, 20]

/** Etapa 3 — método de pagamento + dia de vencimento (layout conforme referência do cliente). */
export default function StepPagamento({
  value,
  dueDay,
  onSelect,
  onSelectDueDay,
  onBack,
  onNext,
}: {
  value: PaymentMethod | null
  dueDay: number | null
  onSelect: (m: PaymentMethod) => void
  onSelectDueDay: (d: number) => void
  onBack: () => void
  onNext: () => void
}) {
  const canContinue = !!value && dueDay !== null

  return (
    <div className="mx-auto w-full max-w-[560px]">
      <h3 className="mx-auto max-w-[520px] text-center font-display text-[19px] font-bold leading-snug text-ink-900">
        Agora, que tal nos contar qual é a melhor forma de pagamento para você, caso decida fechar o contrato?
      </h3>

      {/* Método de pagamento */}
      <p className="mt-8 text-center text-[15px] text-ink-900">
        Prefiro <span className="font-bold text-brand-orange">pagar</span> a mensalidade com:
      </p>
      <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4" role="radiogroup" aria-label="Método de pagamento">
        {OPTIONS.map((opt) => {
          const selected = value === opt.id
          const Icon = opt.icon
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(opt.id)}
              className={cn(
                'relative flex flex-col items-center gap-2.5 rounded-xl border-2 bg-white px-3 py-5 text-center transition-all duration-200',
                selected
                  ? 'border-brand-orange bg-orange-50 shadow-card'
                  : 'border-brand-orange/60 hover:bg-orange-50/60 hover:shadow-card',
              )}
            >
              {selected && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-white">
                  <Check className="h-3 w-3" />
                </span>
              )}
              <Icon className="h-9 w-9 text-brand-orange" />
              <span className="font-display text-[15px] font-semibold text-brand-orange">{opt.label}</span>
            </button>
          )
        })}
      </div>

      {/* Dia de vencimento */}
      <p className="mt-8 text-center text-[15px] font-semibold text-ink-900">Dia de vencimento da mensalidade:</p>
      <div className="mt-4 grid grid-cols-4 gap-3 sm:gap-4" role="radiogroup" aria-label="Dia de vencimento">
        {DUE_DAYS.map((day) => {
          const selected = dueDay === day
          return (
            <button
              key={day}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelectDueDay(day)}
              className={cn(
                'flex h-12 items-center justify-center rounded-xl border-2 bg-white font-display text-[16px] font-semibold transition-all duration-200',
                selected
                  ? 'border-brand-orange bg-brand-orange text-white shadow-cta-glow'
                  : 'border-brand-orange/60 text-brand-orange hover:bg-orange-50',
              )}
            >
              {day}
            </button>
          )
        })}
      </div>

      {/* Ações */}
      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink-300 text-ink-900 transition-all duration-200 hover:border-ink-500 hover:bg-ink-300/10"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="group flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand-orange font-display text-base font-semibold text-white transition-all duration-200 hover:bg-brand-orangeDark hover:shadow-cta-glow active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Próximo
          <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  )
}
