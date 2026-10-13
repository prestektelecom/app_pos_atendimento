import { useRef, useState, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import Estrelas from './Estrelas'
import ResolvidoCampo from './Resolvido'
import PrecoNota from './PrecoNota'
import Obrigado from './Obrigado'
import { enviarAvaliacao } from './api'
import { LIMITE_COMENTARIO, precisaContato, type Resolvido } from './tipos'

interface Enviada {
  id: string
  nota: number
  resolvido: Resolvido
}

const titulo = 'font-display text-[1.625rem] font-extrabold uppercase leading-[1.05] tracking-[0.01em]'

export default function Pesquisa() {
  const [nota, setNota] = useState<number | null>(null)
  const [resolvido, setResolvido] = useState<Resolvido | null>(null)
  const [comentario, setComentario] = useState('')
  const [erros, setErros] = useState<{ nota?: string; resolvido?: string; envio?: string }>({})
  const [enviando, setEnviando] = useState(false)
  const [enviada, setEnviada] = useState<Enviada | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  function foco(campo: 'nota' | 'resolvido') {
    formRef.current?.querySelector<HTMLInputElement>(`[data-campo="${campo}"] input`)?.focus()
  }

  async function enviar(e: FormEvent) {
    e.preventDefault()
    if (enviando) return
    if (nota === null) {
      setErros({ nota: 'Escolha uma nota de 1 a 5 estrelas.' })
      return foco('nota')
    }
    if (resolvido === null) {
      setErros({ resolvido: 'Diga se o problema foi resolvido.' })
      return foco('resolvido')
    }
    setErros({})
    setEnviando(true)
    try {
      const id = await enviarAvaliacao({
        nota,
        resolvido,
        comentario: comentario.trim(),
        protocolo: new URLSearchParams(window.location.search).get('protocolo'),
      })
      setEnviada({ id, nota, resolvido })
    } catch {
      setErros({ envio: 'Não foi possível enviar agora. Suas respostas continuam aqui — tente de novo.' })
    } finally {
      setEnviando(false)
    }
  }

  if (enviada) {
    return (
      <Obrigado
        id={enviada.id}
        nota={enviada.nota}
        resolvido={enviada.resolvido}
        precisaContato={precisaContato(enviada.nota, enviada.resolvido)}
      />
    )
  }

  return (
    <form ref={formRef} onSubmit={enviar} noValidate className="animate-tag-in rounded-xl bg-paper shadow-etiqueta">
      <section className="space-y-4 p-5 pb-6 sm:p-7 sm:pb-8">
        <h1 className="font-display text-[clamp(2rem,9.5vw,2.75rem)] font-black uppercase leading-[0.98] tracking-[0.01em]">
          Como foi seu atendimento?
        </h1>
        <Estrelas
          valor={nota}
          onChange={(n) => {
            setNota(n)
            setErros((x) => ({ ...x, nota: undefined }))
          }}
          descricaoErro={erros.nota}
          idErro="erro-nota"
        />
        <PrecoNota nota={nota} />
      </section>

      <section className="space-y-3 border-t-2 border-dashed border-ink-line p-5 sm:px-7 sm:py-6">
        <h2 className={titulo}>Seu problema foi resolvido?</h2>
        <ResolvidoCampo
          valor={resolvido}
          onChange={(v) => {
            setResolvido(v)
            setErros((x) => ({ ...x, resolvido: undefined }))
          }}
          descricaoErro={erros.resolvido}
          idErro="erro-resolvido"
        />
      </section>

      <section className="space-y-3 border-t-2 border-dashed border-ink-line p-5 sm:px-7 sm:py-6">
        <label htmlFor="comentario" className={`${titulo} block`}>
          O que podemos melhorar?{' '}
          <span className="font-sans text-base font-medium normal-case tracking-normal text-ink-soft">(opcional)</span>
        </label>
        <textarea
          id="comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value.slice(0, LIMITE_COMENTARIO))}
          rows={3}
          placeholder="Conte em poucas palavras"
          className="block w-full resize-y rounded-lg border-2 border-ink/50 bg-paper px-4 py-3 text-lg leading-snug placeholder:text-ink-soft hover:border-ink focus:border-ink focus-visible:outline-offset-0"
        />
        <p className="text-right text-sm tabular text-ink-soft" aria-hidden="true">
          {comentario.length}/{LIMITE_COMENTARIO}
        </p>
      </section>

      <div className="space-y-3 p-5 pt-1 sm:px-7 sm:pb-8">
        {erros.envio && (
          <p role="alert" className="font-semibold text-alert">
            {erros.envio}
          </p>
        )}
        <button
          type="submit"
          disabled={enviando}
          className="flex h-16 w-full items-center justify-center gap-3 rounded-xl bg-brand-orange font-display text-[1.75rem] font-extrabold uppercase tracking-[0.03em] text-ink shadow-cta transition duration-150 hover:bg-brand-orangeHover active:translate-y-px active:shadow-none disabled:cursor-wait disabled:opacity-80"
        >
          {enviando ? (
            <>
              <Loader2 className="size-6 animate-spin" aria-hidden="true" /> Enviando…
            </>
          ) : (
            'Enviar avaliação'
          )}
        </button>
      </div>
    </form>
  )
}
