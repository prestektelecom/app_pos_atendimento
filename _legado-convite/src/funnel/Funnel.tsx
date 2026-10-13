import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FunnelStepper from './FunnelStepper'
import StepPlano from './steps/StepPlano'
import StepDados from './steps/StepDados'
import StepPagamento from './steps/StepPagamento'
import StepRevisao from './steps/StepRevisao'
import StepFinalizacao from './steps/StepFinalizacao'
import type { FunnelData, PaymentMethod, Plan } from './types'
import type { DadosValues } from './steps/StepDados'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

/**
 * 5-step contracting funnel (client-side only): Plano → Dados → Pagamento →
 * Revisão → Finalização. Runs as a full-screen scrollable layer over the
 * invite page; on mobile it naturally takes the whole screen.
 */
export default function Funnel({
  initialName,
  initialPhone,
  onReset,
}: {
  initialName: string
  initialPhone: string
  onReset: () => void
}) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<FunnelData>({
    plan: null,
    name: initialName,
    phone: initialPhone,
    document: '',
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    endereco: '',
    numero: '',
    complemento: '',
    payment: null,
    dueDay: null,
  })

  const goTo = (next: number) => {
    setStep(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pickPlan = (plan: Plan) => {
    setData((p) => ({ ...p, plan }))
    goTo(2)
  }

  const saveDados = (values: DadosValues) => {
    setData((p) => ({ ...p, ...values }))
    goTo(3)
  }

  const pickPayment = (payment: PaymentMethod) => setData((p) => ({ ...p, payment }))
  const pickDueDay = (dueDay: number) => setData((p) => ({ ...p, dueDay }))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 overflow-y-auto bg-surface-tint"
      role="region"
      aria-label="Esteira de contratação"
    >
      <div className="mx-auto w-full max-w-[1080px] px-4 py-10 sm:px-8 sm:py-14">
        <FunnelStepper step={step} />

        <div className="mt-10 sm:mt-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -48 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {step === 1 && <StepPlano onSelect={pickPlan} />}
              {step === 2 && (
                <StepDados
                  initial={{
                    name: data.name,
                    document: data.document,
                    cep: data.cep,
                    estado: data.estado,
                    cidade: data.cidade,
                    bairro: data.bairro,
                    endereco: data.endereco,
                    numero: data.numero,
                    complemento: data.complemento,
                  }}
                  onBack={() => goTo(1)}
                  onNext={saveDados}
                />
              )}
              {step === 3 && (
                <StepPagamento
                  value={data.payment}
                  dueDay={data.dueDay}
                  onSelect={pickPayment}
                  onSelectDueDay={pickDueDay}
                  onBack={() => goTo(2)}
                  onNext={() => goTo(4)}
                />
              )}
              {step === 4 && <StepRevisao data={data} onBack={() => goTo(3)} onConfirm={() => goTo(5)} />}
              {step === 5 && <StepFinalizacao onReset={onReset} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
