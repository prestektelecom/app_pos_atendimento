import { useEffect, useRef, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import PrecoNota from './PrecoNota'
import { pedirContato } from './api'
import type { Resolvido } from './tipos'

interface Props {
  id: string
  nota: number
  resolvido: Resolvido
  precisaContato: boolean
}

export default function Obrigado({ id, nota, resolvido, precisaContato }: Props) {
  const titulo = useRef<HTMLHeadingElement>(null)
  const [contato, setContato] = useState<'ocioso' | 'enviando' | 'feito' | 'erro'>('ocioso')
  const feliz = nota >= 4 && resolvido === 'sim'

  useEffect(() => {
    titulo.current?.focus()
    window.scrollTo({ top: 0 })
  }, [])

  async function solicitar() {
    setContato('enviando')
    try {
      await pedirContato(id)
      setContato('feito')
    } catch {
      setContato('erro')
    }
  }

  return (
    <section className="animate-tag-in overflow-hidden rounded-xl bg-paper shadow-etiqueta">
      <div className="space-y-4 p-5 pb-6 sm:p-7 sm:pb-8">
        <h1
          ref={titulo}
          tabIndex={-1}
          className="font-display text-[clamp(2.25rem,11vw,3.25rem)] font-black uppercase leading-[0.96] tracking-[0.01em] outline-none"
        >
          Obrigado pela resposta!
        </h1>
        <PrecoNota nota={nota} />
        {feliz && (
          <div className="flex items-end gap-4">
            <img src="/mascot-prestek-360.png" alt="" width={317} height={360} decoding="async" className="h-40 w-auto" />
            <p className="pb-4 text-lg leading-snug">Que bom que deu certo. Sua avaliação ajuda a manter o padrão.</p>
          </div>
        )}
        {!feliz && !precisaContato && <p className="text-lg leading-snug">Sua avaliação foi registrada.</p>}
      </div>

      {precisaContato && (
        <div className="space-y-3 border-t-2 border-dashed border-ink-line p-5 sm:px-7 sm:py-6">
          {contato === 'feito' ? (
            <p role="status" className="flex items-start gap-3 text-lg font-semibold leading-snug">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-ink text-paper">
                <Check className="size-4" aria-hidden="true" />
              </span>
              Pedido registrado. Vamos entrar em contato — você não precisa repetir o caso.
            </p>
          ) : (
            <>
              <p className="text-lg leading-snug">
                Sentimos que não foi o atendimento que você esperava. Se quiser, a gente retorna — sem você contar tudo de novo.
              </p>
              {contato === 'erro' && (
                <p role="alert" className="font-semibold text-alert">
                  Não foi possível registrar o pedido agora. Tente de novo.
                </p>
              )}
              <button
                type="button"
                onClick={solicitar}
                disabled={contato === 'enviando'}
                className="flex min-h-16 w-full items-center justify-center gap-3 rounded-xl bg-brand-orange px-4 font-display text-[1.5rem] font-extrabold uppercase leading-none tracking-[0.03em] text-ink shadow-cta transition duration-150 hover:bg-brand-orangeHover active:translate-y-px active:shadow-none disabled:cursor-wait disabled:opacity-80"
              >
                {contato === 'enviando' && <Loader2 className="size-6 animate-spin" aria-hidden="true" />}
                Quero que entrem em contato comigo
              </button>
            </>
          )}
        </div>
      )}
    </section>
  )
}
