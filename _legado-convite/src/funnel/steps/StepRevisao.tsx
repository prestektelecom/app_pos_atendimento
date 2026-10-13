import { useState } from 'react'
import { ArrowLeft, BadgeCheck, CreditCard, User, Wifi } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { FunnelData } from '../types'
import { PAYMENT_LABELS } from '../types'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <span className="text-[13px] font-medium text-ink-500">{label}</span>
      <span className="text-right text-[14px] font-semibold text-ink-900">{value}</span>
    </div>
  )
}

/** Etapa 4 — revisão do pedido + confirmação. */
export default function StepRevisao({
  data,
  onBack,
  onConfirm,
}: {
  data: FunnelData
  onBack: () => void
  onConfirm: () => void
}) {
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <h3 className="text-center font-display text-xl font-bold text-ink-900">Revise seu pedido</h3>
      <p className="mt-2 text-center text-[14px] text-ink-500">
        Confira as informações antes de confirmar a contratação.
      </p>

      <div className="mt-6 space-y-5 rounded-2xl border border-ink-300/60 bg-white p-5 shadow-card sm:p-7">
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-orange">
            <Wifi className="h-4 w-4" aria-hidden />
            Plano escolhido
          </p>
          <div className="flex items-baseline justify-between rounded-xl bg-surface-tint px-4 py-3">
            <span className="font-display text-lg font-bold text-ink-900">{data.plan?.name}</span>
            <span className="font-display text-lg font-bold text-brand-orange">
              R$ {data.plan?.price}
              <span className="text-xs font-medium text-ink-500">/mês</span>
            </span>
          </div>
        </div>

        <div>
          <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-orange">
            <User className="h-4 w-4" aria-hidden />
            Seus dados
          </p>
          <div className="divide-y divide-ink-300/40 rounded-xl bg-surface-tint px-4 py-1.5">
            <Row label="Nome" value={data.name} />
            <Row label="WhatsApp" value={data.phone} />
            <Row label="CPF/CNPJ" value={data.document} />
            <Row label="CEP da instalação" value={data.cep} />
            <Row label="Estado" value={data.estado} />
            <Row label="Cidade" value={data.cidade} />
            <Row label="Bairro" value={data.bairro} />
            <Row
              label="Endereço"
              value={`${data.endereco}, ${data.numero}${data.complemento ? ` — ${data.complemento}` : ''}`}
            />
          </div>
        </div>

        <div>
          <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-orange">
            <CreditCard className="h-4 w-4" aria-hidden />
            Pagamento
          </p>
          <div className="divide-y divide-ink-300/40 rounded-xl bg-surface-tint px-4 py-1.5">
            <Row label="Forma de pagamento" value={data.payment ? PAYMENT_LABELS[data.payment] : '—'} />
            <Row label="Vencimento" value={data.dueDay ? `Dia ${data.dueDay}` : '—'} />
          </div>
        </div>

        <button
          type="button"
          role="checkbox"
          aria-checked={confirmed}
          onClick={() => setConfirmed((v) => !v)}
          className="flex w-full items-start gap-3 text-left"
        >
          <span
            className={cn(
              'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border transition-colors duration-150',
              confirmed ? 'border-brand-orange bg-brand-orange' : 'border-ink-300 bg-white hover:border-brand-orange',
            )}
          >
            <motion.svg
              viewBox="0 0 14 12"
              className="h-3 w-3"
              initial={false}
              animate={{ scale: confirmed ? [1, 1.15, 1] : 1 }}
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
                animate={{ pathLength: confirmed ? 1 : 0, opacity: confirmed ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />
            </motion.svg>
          </span>
          <span className="text-[13.5px] leading-[1.5] text-ink-900/80">Confirmo que os dados estão corretos</span>
        </button>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onBack}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full font-display text-[15px] font-semibold text-ink-500 transition-colors hover:bg-ink-300/20 hover:text-ink-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={!confirmed}
          className="flex h-12 flex-[2] items-center justify-center gap-2 rounded-full bg-brand-orange font-display text-base font-semibold text-white transition-all duration-200 hover:bg-brand-orangeDark hover:shadow-cta-glow active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <BadgeCheck className="h-5 w-5" aria-hidden />
          Confirmar contratação
        </button>
      </div>
    </div>
  )
}
