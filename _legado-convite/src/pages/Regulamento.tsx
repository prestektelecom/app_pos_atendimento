import { Fragment, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown, ChevronRight, Mail, MessageCircle, ScrollText, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { REGULAMENTO_DOC } from '@/components/RegulamentoContent'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

/* ------------------------------------------------------------------ */
/* Document content                                                    */
/* ------------------------------------------------------------------ */

interface DocSection {
  id: string
  tocLabel: string
  title: string
  body: ReactNode
}

const SECTIONS: DocSection[] = REGULAMENTO_DOC.map((section) => ({
  id: section.id,
  tocLabel: section.tocLabel,
  title: section.title,
  body: (
    <>
      {section.blocks.map((block, blockIndex) =>
        block.type === 'paragraph' ? (
          <p key={blockIndex}>{block.text}</p>
        ) : (
          <Fragment key={blockIndex}>
            {block.intro && <p>{block.intro}</p>}
            <ul>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          </Fragment>
        ),
      )}
    </>
  ),
}))

/** Card de contato do encarregado de dados (DPO), exibido ao final da página. */
function DpoCard() {
  return (
    <div className="not-prose mt-10 rounded-2xl border border-ink-300/50 bg-surface-tint p-6 transition-transform duration-200 hover:-translate-y-1">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100">
          <ShieldCheck className="h-6 w-6 text-brand-orange" />
        </span>
        <h4 className="font-display text-lg font-semibold text-ink-900">Dúvidas sobre seus dados?</h4>
      </div>
      <ul className="mt-4 space-y-3 text-[15px]">
        <li>
          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 font-medium text-ink-900/80 transition-colors hover:text-brand-orange"
          >
            <MessageCircle className="h-4 w-4 text-brand-orange" />
            WhatsApp: (00) 00000-0000
          </a>
        </li>
        <li>
          <a
            href="mailto:encarregado@prestektelecom.com.br"
            className="group inline-flex items-center gap-2.5 font-medium text-ink-900/80 transition-colors hover:text-brand-orange"
          >
            <Mail className="h-4 w-4 text-brand-orange" />
            encarregado@prestektelecom.com.br
          </a>
        </li>
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Scroll-spy                                                          */
/* ------------------------------------------------------------------ */

function useScrollSpy(ids: string[]) {
  const [activeId, setActiveId] = useState(ids[0])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: '-25% 0px -65% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])

  return activeId
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  const words = ['Regulamento', 'do', 'Convite']

  return (
    <section className="bg-surface-tint border-b border-ink-300/30 px-6 py-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE }}
          aria-label="Trilha de navegação"
          className="flex items-center gap-1.5 text-[13px] font-medium text-ink-500"
        >
          <Link to="/" className="transition-colors hover:text-brand-orange">
            Início
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <span className="text-ink-900/70">Regulamento</span>
        </motion.nav>

        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 24 }}
          className="mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100"
        >
          <ScrollText className="h-7 w-7 text-brand-orange" />
        </motion.span>

        <h1 className="mt-5 font-display text-[34px] font-bold tracking-[-0.01em] text-ink-900">
          {words.map((word, i) => (
            <span key={word} className="inline-block overflow-hidden pb-1 align-bottom">
              <motion.span
                className="inline-block pr-[0.28em]"
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.06, duration: 0.5, ease: EASE }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4, ease: EASE }}
          className="mt-3 font-display text-[15px] font-semibold uppercase tracking-wider text-brand-orange"
        >
          Termos de Uso e Confidencialidade dos Dados
        </motion.p>

        <motion.p
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4, ease: EASE }}
          className="mt-2 text-[13px] text-ink-500"
        >
          Prestek Telecom · Última atualização: janeiro de 2024 · Versão 1.2
        </motion.p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Table of contents                                                   */
/* ------------------------------------------------------------------ */

function StickyToc({ activeId }: { activeId: string }) {
  return (
    <motion.aside
      initial={{ x: -16, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
      className="hidden lg:block"
    >
      <nav aria-label="Sumário do regulamento" className="sticky top-28">
        <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-500">
          Neste regulamento
        </h2>
        <ul className="space-y-1">
          {SECTIONS.map((section) => {
            const active = section.id === activeId
            return (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  aria-current={active ? 'true' : undefined}
                  className={cn(
                    'relative block w-full rounded-r-lg py-1.5 pl-4 text-left text-sm font-medium transition-colors duration-200',
                    active ? 'text-brand-orange' : 'text-ink-500 hover:text-ink-900',
                  )}
                >
                  <span
                    className={cn(
                      'absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-brand-orange transition-opacity duration-200',
                      active ? 'opacity-100' : 'opacity-0',
                    )}
                    aria-hidden
                  />
                  {section.tocLabel}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </motion.aside>
  )
}

function MobileToc({ activeId }: { activeId: string }) {
  return (
    <div className="sticky top-16 z-30 -mx-4 mb-8 border-b border-ink-300/40 bg-white/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:hidden">
      <label htmlFor="regulamento-toc" className="sr-only">
        Ir para a seção
      </label>
      <div className="relative">
        <select
          id="regulamento-toc"
          value={activeId}
          onChange={(event) => scrollToSection(event.target.value)}
          className="w-full appearance-none rounded-xl border border-ink-300 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-ink-900 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
        >
          {SECTIONS.map((section) => (
            <option key={section.id} value={section.id}>
              {section.tocLabel}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" aria-hidden />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Document body                                                       */
/* ------------------------------------------------------------------ */

function DocumentBody() {
  const activeId = useScrollSpy(SECTIONS.map((s) => s.id))

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:grid lg:grid-cols-[260px_1fr] lg:gap-16 lg:px-8">
        <StickyToc activeId={activeId} />

        <div className="min-w-0">
          <MobileToc activeId={activeId} />

          <article className="max-w-prose">
            {SECTIONS.map((section) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ y: 24, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 'some' }}
                transition={{ duration: 0.5, ease: EASE }}
                className="scroll-mt-28 border-b border-ink-300/30 pb-10 pt-2 last:border-b-0 [&:not(:first-child)]:pt-10 [&_li]:relative [&_li]:pl-6 [&_li]:text-[15px] [&_li]:leading-[1.8] [&_li]:text-ink-900/80 [&_li]:before:absolute [&_li]:before:left-1 [&_li]:before:top-[0.8em] [&_li]:before:h-1.5 [&_li]:before:w-1.5 [&_li]:before:rounded-full [&_li]:before:bg-brand-orange [&_p]:text-[15px] [&_p]:leading-[1.8] [&_p]:text-ink-900/80 [&_ul]:mt-3 [&_ul]:space-y-1.5 [&_p+p]:mt-3 [&_ul+p]:mt-3"
              >
                <h3 className="mb-3 font-display text-xl font-semibold text-ink-900">{section.title}</h3>
                {section.body}
              </motion.section>
            ))}
          </article>

          <motion.div
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <DpoCard />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Bottom CTA                                                          */
/* ------------------------------------------------------------------ */

function BottomCta() {
  return (
    <section className="bg-white pb-20 pt-4">
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mx-auto flex max-w-3xl flex-col items-center px-6 text-center"
      >
        <p className="text-base text-ink-500">Concorda com os termos? Então aproveite seu convite:</p>
        <Link
          to="/"
          className="group mt-5 inline-flex h-12 items-center gap-2 rounded-full bg-brand-orange px-7 font-display text-base font-semibold text-white transition-all duration-200 hover:bg-brand-orangeDark hover:shadow-cta-glow"
        >
          Voltar ao convite
          <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Regulamento() {
  useEffect(() => {
    document.title = 'Regulamento — Convite Prestek Telecom'
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    meta?.setAttribute(
      'content',
      'Termos de uso e confidencialidade dos dados do Convite Exclusivo Prestek Telecom, em conformidade com a LGPD.',
    )
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Hero />
      <DocumentBody />
      <BottomCta />
    </motion.div>
  )
}
