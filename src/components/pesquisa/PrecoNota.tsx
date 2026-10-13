import { PALAVRAS_NOTA, faixaNota } from './tipos'

const PILHA = ['0', '1', '2', '3', '4', '5']

/**
 * A faixa amarela da etiqueta: a nota escolhida vira o número do "preço".
 * O dígito rola na vertical (a pilha desliza); sem nota, mostra "–,–".
 */
export default function PrecoNota({ nota }: { nota: number | null }) {
  const indice = nota ?? 0
  const faixa = nota ? faixaNota(nota) : null
  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-4 py-3 sm:gap-4 sm:px-5 transition-colors duration-300 ${
        faixa ? `${faixa.faixa} text-ink` : 'bg-paper-dim text-ink-soft'
      }`}
    >
      <div
        aria-hidden="true"
        className="flex items-end font-display font-black tabular leading-none"
        style={{ fontSize: 'clamp(3.75rem, 18vw, 6rem)' }}
      >
        <span className="block overflow-hidden" style={{ height: '1em' }}>
          <span
            className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: `translateY(${-indice * 1}em)` }}
          >
            {PILHA.map((d) => (
              <span key={d} className="block text-center" style={{ height: '1em', lineHeight: '1em', minWidth: '0.5em' }}>
                {d}
              </span>
            ))}
          </span>
        </span>
        <span className="pb-[0.02em]">,0</span>
      </div>
      <div className="min-w-0 border-l-2 border-ink/25 pl-4 leading-tight">
        <p className="font-display text-sm font-bold uppercase tracking-[0.12em]">Sua nota</p>
        <p
          className="font-display text-[clamp(1.375rem,6.5vw,1.75rem)] font-extrabold uppercase leading-none text-balance"
          aria-live="polite"
        >
          {nota ? PALAVRAS_NOTA[nota - 1] : 'Toque numa estrela'}
        </p>
      </div>
      {faixa && (
        <faixa.Icone
          key={faixa.chave}
          aria-hidden="true"
          strokeWidth={2.25}
          className="ml-auto hidden size-[clamp(2rem,9vw,3rem)] shrink-0 animate-tag-in min-[400px]:block"
        />
      )}
    </div>
  )
}
