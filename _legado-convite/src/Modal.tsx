import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  icon: LucideIcon
  title: string
  children: ReactNode
  maxWidthClass?: string
  bodyClassName?: string
}

/**
 * Shared modal shell (design 6.4): blurred dark overlay, white panel radius-20px,
 * orange icon in soft circle + title + close X. On mobile it behaves like a
 * bottom sheet (slides up, drag-to-dismiss). ESC and overlay click close it.
 */
export default function Modal({ open, onClose, icon: Icon, title, children, maxWidthClass = 'max-w-lg', bodyClassName }: ModalProps) {
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
          className="fixed inset-0 z-[70] flex items-end justify-center bg-ink-900/60 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            drag={typeof window !== 'undefined' && window.innerWidth < 640 ? 'y' : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) onClose()
            }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-modal sm:rounded-[20px]',
              maxWidthClass,
            )}
          >
            {/* drag handle (mobile) */}
            <div className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-ink-300 sm:hidden" />
            <div className="flex items-center gap-3 px-6 pb-4 pt-4 sm:pt-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
                <Icon className="h-5 w-5 text-brand-orange" />
              </span>
              <h2 className="flex-1 font-display text-xl font-bold text-brand-orangeDark">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-all duration-200 hover:rotate-90 hover:bg-surface-tint hover:text-ink-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className={cn('overflow-y-auto px-6 pb-6', bodyClassName)}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
