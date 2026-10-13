import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { STEP_LABELS } from './types'

/**
 * Funnel header: small boxed Prestek logo + horizontal 5-step stepper.
 * Current step = filled orange circle + orange label; done = orange with check;
 * upcoming = white circle with gray border/label. Labels hide on small screens.
 */
export default function FunnelStepper({ step }: { step: number }) {
  return (
    <div className="flex flex-col items-center">
      <div className="inline-flex items-center justify-center rounded-xl border border-ink-300/60 bg-white px-5 py-3 shadow-xs">
        <img src="/logo-prestek.svg" alt="Prestek Telecom" className="h-8 w-auto" />
      </div>

      <ol className="mt-8 flex w-full max-w-[640px] items-start" aria-label="Etapas da contratação">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1
          const done = n < step
          const current = n === step
          return (
            <li key={label} className={cn('flex items-start', n < STEP_LABELS.length && 'flex-1')}>
              <div className="flex w-12 shrink-0 flex-col items-center gap-1.5 sm:w-auto sm:min-w-12">
                <span
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full border text-[13px] font-bold transition-colors duration-200',
                    done && 'border-brand-orange bg-brand-orange text-white',
                    current && 'border-brand-orange bg-brand-orange text-white shadow-cta-glow',
                    !done && !current && 'border-ink-300 bg-white text-ink-500',
                  )}
                  aria-current={current ? 'step' : undefined}
                >
                  {done ? <Check className="h-4 w-4" /> : String(n).padStart(2, '0')}
                </span>
                <span
                  className={cn(
                    'hidden text-center text-xs font-semibold sm:block',
                    current ? 'text-brand-orange' : 'text-ink-500',
                  )}
                >
                  {label}
                </span>
              </div>
              {n < STEP_LABELS.length && (
                <span
                  className={cn(
                    'mx-1 mt-[17px] h-0.5 flex-1 rounded-full sm:mx-2',
                    n < step ? 'bg-brand-orange' : 'bg-ink-300/70',
                  )}
                  aria-hidden
                />
              )}
            </li>
          )
        })}
      </ol>
      {/* mobile-only current step label */}
      <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-brand-orange sm:hidden">
        Etapa {step} de 5 — {STEP_LABELS[step - 1]}
      </p>
    </div>
  )
}
