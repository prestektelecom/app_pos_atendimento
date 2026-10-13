import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircleWarning, X } from 'lucide-react'

interface DuplicateNoticeProps {
  open: boolean
  onClose: () => void
}

/**
 * "Já cadastrado" notice: chat-bubble card (white, big radius, top tail) over a
 * frosted dark overlay (backdrop-blur + translucent slate). ESC, overlay click
 * and the "Entendi" pill button close it; body scroll is locked while open.
 */
export default function DuplicateNotice({ open, onClose }: DuplicateNoticeProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-md"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Você já preencheu esse link de indicação."
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[380px] rounded-[20px] bg-white p-7 pt-8 text-center shadow-[0_24px_60px_-12px_rgba(15,23,42,0.35)]"
          >
            {/* bubble tail (top) */}
            <span
              aria-hidden
              className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 rounded-[3px] bg-white"
            />

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-all duration-200 hover:rotate-90 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>

            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <MessageCircleWarning className="h-6 w-6 text-[#F97316]" />
            </span>

            <h2 className="mt-4 font-display text-lg font-semibold leading-snug text-slate-900">
              Você já preencheu esse link de indicação.
            </h2>
            <p className="mt-2.5 text-[15px] leading-relaxed text-slate-600">
              Você já está cadastrado neste link de indicações (convite). Aguarde o contato de um de nossos
              especialistas
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-brand-orange font-display text-[15px] font-semibold text-white transition-all duration-200 hover:bg-brand-orangeDark hover:shadow-cta-glow active:scale-[0.97]"
            >
              Entendi
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
