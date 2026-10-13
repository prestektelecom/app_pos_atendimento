import { useRef, useState } from 'react'
import { Check, ScrollText } from 'lucide-react'
import { toast } from 'sonner'
import Modal from '@/components/Modal'
import RegulamentoContent from '@/components/RegulamentoContent'

interface RegulamentoModalProps {
  open: boolean
  onClose: () => void
  onAccept?: () => void
}

export default function RegulamentoModal({ open, onClose, onAccept }: RegulamentoModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrolledToEnd, setScrolledToEnd] = useState(false)
  const [accepted, setAccepted] = useState(false)

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) setScrolledToEnd(true)
  }

  const handleAccept = () => {
    setAccepted(true)
    onAccept?.()
    toast.success('Consentimento registrado.')
    setTimeout(() => {
      onClose()
      setAccepted(false)
    }, 350)
  }

  return (
    <Modal open={open} onClose={onClose} icon={ScrollText} title="Regulamento" maxWidthClass="max-w-xl" bodyClassName="px-0 pb-0">
      <div className="relative px-6 pb-6">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="scrollbar-orange max-h-[60vh] overflow-y-auto pr-2"
        >
          <RegulamentoContent />
        </div>
        {/* scroll affordance gradient */}
        {!scrolledToEnd && (
          <div className="pointer-events-none absolute inset-x-6 bottom-20 h-12 bg-gradient-to-t from-white to-transparent" />
        )}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-full px-5 font-display text-sm font-semibold text-ink-500 transition-colors hover:bg-surface-tint hover:text-ink-900"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-orange px-5 font-display text-sm font-semibold text-white transition-all hover:bg-brand-orangeDark hover:shadow-cta-glow"
          >
            {accepted ? <Check className="h-4 w-4" /> : null}
            Li e aceito
          </button>
        </div>
      </div>
    </Modal>
  )
}
