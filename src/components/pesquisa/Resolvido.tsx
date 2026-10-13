import { OPCOES_RESOLVIDO, type Resolvido } from './tipos'

interface Props {
  valor: Resolvido | null
  onChange: (v: Resolvido) => void
  descricaoErro?: string
  idErro?: string
}

export default function ResolvidoCampo({ valor, onChange, descricaoErro, idErro }: Props) {
  return (
    <fieldset aria-describedby={descricaoErro ? idErro : undefined}>
      <legend className="sr-only">Seu problema foi resolvido?</legend>
      <div className="grid gap-2" data-campo="resolvido">
        {OPCOES_RESOLVIDO.map(({ valor: v, rotulo }) => {
          const marcado = valor === v
          return (
            <label key={v} className="relative block cursor-pointer">
              <input
                type="radio"
                name="resolvido"
                value={v}
                checked={marcado}
                onChange={() => onChange(v)}
                className="peer sr-only"
                aria-invalid={descricaoErro ? true : undefined}
              />
              <span
                className={`flex min-h-14 items-center gap-3 rounded-lg border-2 px-4 font-semibold transition-colors duration-150 active:scale-[0.98] peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink ${
                  marcado ? 'border-ink bg-ink text-paper' : 'border-ink/50 bg-paper hover:border-ink'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`grid size-6 shrink-0 place-items-center rounded-full border-2 ${
                    marcado ? 'border-paper' : 'border-ink/60'
                  }`}
                >
                  {marcado && <span className="size-3 rounded-full bg-brand-orange" />}
                </span>
                {rotulo}
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
