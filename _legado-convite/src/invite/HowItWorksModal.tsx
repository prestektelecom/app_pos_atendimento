import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowRight, CircleHelp } from 'lucide-react'
import Modal from '@/components/Modal'

const stagger = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

export default function HowItWorksModal({ open, onClose, onFillInvite }: { open: boolean; onClose: () => void; onFillInvite?: () => void }) {
  return (
    <Modal open={open} onClose={onClose} icon={CircleHelp} title="Como funciona este convite?" maxWidthClass="max-w-lg">
      <div className="space-y-4 text-[15px] leading-relaxed text-ink-900/75">
        <motion.h3 custom={0} variants={stagger} initial="hidden" animate="show" className="font-display text-lg font-semibold text-ink-900">
          Por que você recebeu este convite?
        </motion.h3>
        <motion.p custom={1} variants={stagger} initial="hidden" animate="show" className="font-semibold text-brand-orange">
          Este convite é sua chance de ter uma Internet Premium!
        </motion.p>
        <motion.p custom={2} variants={stagger} initial="hidden" animate="show">
          Provavelmente você recebeu esse convite de um amigo ou familiar que quer compartilhar com você a melhor conexão de sua região.
        </motion.p>

        <motion.hr custom={3} variants={stagger} initial="hidden" animate="show" className="border-ink-300/50" />

        <motion.h3 custom={4} variants={stagger} initial="hidden" animate="show" className="font-display text-lg font-semibold text-ink-900">
          Como funciona o convite?
        </motion.h3>
        <motion.p custom={5} variants={stagger} initial="hidden" animate="show">
          Basta preencher o convite com os seus dados. Logo em seguida você receberá uma mensagem em seu WhatsApp informando a confirmação do seu convite. Aí é só aguardar o contato da nossa equipe! 😊
        </motion.p>

        <motion.div
          custom={6}
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-wrap items-center justify-between gap-3 pt-2"
        >
          <motion.button
            type="button"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ delay: 0.6, duration: 0.4 }}
            onClick={() => {
              onClose()
              onFillInvite?.()
            }}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-orange px-5 font-display text-sm font-semibold text-white transition-all hover:bg-brand-orangeDark hover:shadow-cta-glow"
          >
            Preencher meu convite
            <ArrowRight className="h-4 w-4" />
          </motion.button>
          <Link
            to="/como-funciona"
            onClick={onClose}
            className="text-[13px] font-semibold text-brand-blue underline-offset-4 hover:underline"
          >
            Ver página completa →
          </Link>
        </motion.div>
      </div>
    </Modal>
  )
}
