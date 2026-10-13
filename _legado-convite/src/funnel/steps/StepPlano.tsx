import { CheckCircle2, Wifi } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Plan } from '../types'
import { PLANS } from '../types'

const FEATURES = ['35+ canais de TV', '100% Fibra Óptica', 'Suporte técnico', 'Wi-Fi Grátis']

/** Etapa 1 — escolha do plano (3 cards, destaque no 600MB). */
export default function StepPlano({ onSelect }: { onSelect: (plan: Plan) => void }) {
  const reduceMotion = useReducedMotion()
  return (
    <div>
      <p className="mx-auto max-w-[640px] text-center text-[16px] leading-relaxed text-ink-900">
        <span className="font-semibold">Pronto! Para que possamos entrar em contato e esclarecer suas dúvidas,</span>{' '}
        escolha o plano ideal para você e prossiga.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-5 sm:pt-12 lg:gap-6">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={false}
            animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 3.6, delay: i * 0.7, repeat: Infinity, ease: 'easeInOut' }}
            className={cn('relative', plan.featured && 'sm:-my-4')}
          >
            <div
              className={cn(
                'relative flex h-full flex-col rounded-2xl px-6 pb-6 pt-16 text-center transition-all duration-300 hover:-translate-y-2',
                plan.featured
                  ? 'bg-gradient-to-b from-[#F97316] to-[#EA580C] text-white shadow-cta-glow hover:shadow-[0_24px_48px_rgba(249,115,22,0.45)] sm:pb-10 sm:pt-20'
                  : 'border border-ink-300/60 bg-white shadow-card hover:shadow-[0_24px_48px_rgba(15,23,42,0.18)]',
              )}
            >
            {/* overlapping speed badge */}
            <div className="absolute left-1/2 top-0 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-0.5 rounded-full bg-gradient-to-b from-[#F97316] to-[#EA580C] text-white shadow-lg ring-4 ring-white">
              <Wifi className="h-8 w-8" aria-hidden />
              <span className="text-sm font-bold leading-none">{plan.name}</span>
            </div>

            <p className="mt-2">
              <span
                className={cn(
                  'align-top text-lg font-bold',
                  plan.featured ? 'text-white' : 'text-ink-900',
                )}
              >
                R$
              </span>{' '}
              <span
                className={cn(
                  'font-display text-4xl font-bold',
                  plan.featured ? 'text-white' : 'text-ink-900',
                )}
              >
                {plan.price}
              </span>{' '}
              <span
                className={cn(
                  'text-sm font-medium',
                  plan.featured ? 'text-white/80' : 'text-ink-500',
                )}
              >
                /mês
              </span>
            </p>

            <div
              className={cn(
                'my-5 h-px w-full',
                plan.featured ? 'bg-white/30' : 'bg-ink-300/50',
              )}
              aria-hidden
            />

            <ul className="space-y-3 text-left">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <CheckCircle2
                    className={cn(
                      'h-5 w-5 shrink-0',
                      plan.featured ? 'text-green-300' : 'text-green-500',
                    )}
                    aria-hidden
                  />
                  <span
                    className={cn(
                      'text-[14px] font-medium',
                      plan.featured ? 'text-white' : 'text-ink-500',
                    )}
                  >
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => onSelect(plan)}
              className={cn(
                'mt-7 flex h-12 w-full items-center justify-center rounded-full font-display text-[15px] font-semibold transition-all duration-300 active:scale-[0.97]',
                plan.featured
                  ? 'bg-white text-[#1e3a5f] hover:bg-orange-50'
                  : 'bg-[#1e3a5f] text-white hover:bg-[#16294a]',
              )}
            >
              Obter plano
            </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
