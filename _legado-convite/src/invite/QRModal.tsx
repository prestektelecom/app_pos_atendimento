import { useRef } from 'react'
import { motion } from 'framer-motion'
import { QRCodeCanvas } from 'qrcode.react'
import { Copy, Download, QrCode, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import Modal from '@/components/Modal'

export const INVITE_PATH = '/convite/48647f6cd511d0f'

export function getInviteUrl(): string {
  if (typeof window !== 'undefined') return `${window.location.origin}${INVITE_PATH}`
  return `https://zapisp.com.br${INVITE_PATH}`
}

export default function QRModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const url = getInviteUrl()
  const qrWrapRef = useRef<HTMLDivElement>(null)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copiado!')
    } catch {
      toast.error('Não foi possível copiar o link.')
    }
  }

  const getCanvas = (): HTMLCanvasElement | null =>
    qrWrapRef.current?.querySelector('canvas') ?? null

  const downloadPNG = () => {
    const canvas = getCanvas()
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = 'convite-prestek-qrcode.png'
    a.click()
    toast.success('QR Code baixado!')
  }

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Convite Exclusivo — Prestek Telecom', text: 'Você foi indicado! Garanta seu desconto na internet premium da Prestek.', url })
        return
      } catch {
        return // usuário cancelou
      }
    }
    await copyLink()
  }

  const copyImage = async () => {
    const canvas = getCanvas()
    if (!canvas) return
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
      if (blob && typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        toast.success('QR Code copiado como imagem!')
        return
      }
      throw new Error('unsupported')
    } catch {
      downloadPNG()
      toast.success('QR Code baixado! (cópia de imagem não suportada)')
    }
  }

  return (
    <Modal open={open} onClose={onClose} icon={QrCode} title="Gerar QR Code" maxWidthClass="max-w-md">
      <div className="space-y-5">
        {/* URL row */}
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={url}
            onFocus={(e) => e.target.select()}
            className="h-11 flex-1 rounded-[10px] border border-ink-300 bg-surface-tint px-3 font-mono text-[13px] text-ink-500 outline-none"
            aria-label="Link do convite"
          />
          <motion.button
            type="button"
            whileTap={{ scale: 0.85 }}
            onClick={copyLink}
            title="Copiar link"
            aria-label="Copiar link"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-ink-300 text-ink-500 transition-colors hover:border-brand-orange hover:text-brand-orange"
          >
            <Copy className="h-4 w-4" />
          </motion.button>
        </div>

        {/* QR card */}
        <motion.div
          initial={{ scale: 0.9, rotate: -2, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
          className="mx-auto w-fit rounded-2xl border border-ink-300/60 bg-white p-4 shadow-card"
        >
          <div ref={qrWrapRef}>
            <QRCodeCanvas
              value={url}
              size={200}
              level="H"
              marginSize={2}
              imageSettings={{ src: '/qr-center-logo.png', height: 44, width: 44, excavate: true }}
            />
          </div>
        </motion.div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={share}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-brand-orange font-display text-[15px] font-semibold text-brand-orange transition-colors hover:bg-orange-50"
          >
            <Share2 className="h-4 w-4" />
            Compartilhar
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={downloadPNG}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-orange font-display text-[15px] font-semibold text-white transition-all hover:bg-brand-orangeDark hover:shadow-cta-glow"
          >
            <Download className="h-4 w-4" />
            Download
          </motion.button>
        </div>

        <button
          type="button"
          onClick={copyImage}
          className="mx-auto block text-sm font-semibold text-brand-orange underline-offset-4 transition-colors hover:text-brand-orangeDark hover:underline"
        >
          Copiar QR code
        </button>
      </div>
    </Modal>
  )
}
