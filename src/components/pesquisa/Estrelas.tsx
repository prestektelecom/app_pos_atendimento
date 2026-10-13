import { Star } from 'lucide-react'
import { PALAVRAS_NOTA, faixaNota } from './tipos'

interface Props {
  valor: number | null
  onChange: (n: number) => void
  descricaoErro?: string
  idErro?: string
}

export default function Estrelas({ valor, onChange, idErro, descricaoErro }: Props) {
  return (
    <fieldset aria-describedby={descricaoErro ? idErro : undefined}>
      <legend className="sr-only">Como foi seu atendimento? Escolha de 1 a 5 estrelas</legend>
      <div className="flex justify-between gap-1" data-campo="nota">
        {[1, 2, 3, 4, 5].map((n) => {
          const cheia = valor !== null && n <= valor
          return (
            <label key={n} className="group relative flex-1 cursor-pointer">
              <input
                type="radio"
                name="nota"
                value={n}
                checked={valor === n}
                onChange={() => onChange(n)}
                className="peer sr-only"
                aria-invalid={descricaoErro ? true : undefined}
                aria-label={`${n} ${n === 1 ? 'estrela' : 'estrelas'}, ${PALAVRAS_NOTA[n - 1]}`}
              />
              <span className="flex h-16 items-center justify-center rounded-lg transition-transform duration-150 peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink group-active:scale-90">
                <Star
                  aria-hidden="true"
                  className={`size-12 transition-colors duration-200 ${
                    cheia && valor ? `${faixaNota(valor).estrela} stroke-ink` : 'fill-transparent stroke-ink/70 group-hover:fill-brand-orange/30'
                  }`}
                  strokeWidth={1.75}
                  strokeLinejoin="round"
                />
              </span>
            </label>
          )
        })}
      </div>
      {descricaoErro && (
        <p id={idErro} role="alert" className="mt-2 font-semibold text-alert">
          {descricaoErro}
        </p>
      )}
    </fieldset>
  )
}
