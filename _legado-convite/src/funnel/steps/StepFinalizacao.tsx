import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'

const WA_LINK =
  'https://wa.me/5500000000000?text=' +
  encodeURIComponent('Olá! Acabei de registrar minha contratação da Prestek Telecom indicada por Marcio.')

/** Etapa 5 — finalização: confetti + check animado + CTAs. */
export default function StepFinalizacao({ onReset }: { onReset: () => void }) {
  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 75,
      startVelocity: 38,
      origin: { y: 0.6 },
      colors: ['#F97316', '#3B1A6E', '#FFFFFF'],
      zIndex: 80,
    })
    toast.success('Pedido registrado com sucesso!')
  }, [])

  return (
    <div className="mx-auto flex w-full max-w-[420px] flex-col items-center py-4 text-center">
      <motion.svg
        viewBox="0 0 80 80"
        className="h-20 w-20"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      >
        <motion.circle
          cx="40"
          cy="40"
          r="34"
          fill="none"
          stroke="#16A34A"
          strokeWidth="5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <motion.path
          d="M26 41 L36 51 L55 30"
          fill="none"
          stroke="#16A34A"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.35, duration: 0.4, ease: 'easeOut' }}
        />
      </motion.svg>
      <h3 className="mt-5 font-display text-2xl font-bold text-ink-900">Pedido recebido! 🎉</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
        Sua contratação foi registrada. Nossa equipe entrará em contato no seu WhatsApp para finalizar.
      </p>
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-orange font-display text-base font-semibold text-white transition-all hover:bg-brand-orangeDark hover:shadow-cta-glow active:scale-[0.97]"
      >
        <MessageCircle className="h-5 w-5" />
        Abrir WhatsApp
      </a>
      <button
        type="button"
        onClick={onReset}
        className="mt-3 h-11 w-full rounded-full font-display text-[15px] font-semibold text-ink-500 transition-colors hover:bg-ink-300/20 hover:text-ink-900"
      >
        Voltar ao início
      </button>
    </div>
  )
}
