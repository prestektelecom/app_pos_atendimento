import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowLeft, ArrowRight, CircleAlert, Hash, Home, IdCard, MapPin, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isValidName } from '@/lib/phone'
import { isValidCPFCNPJ, isValidCEP, maskCEP, maskCPFCNPJ } from '@/lib/document'

export interface DadosValues {
  name: string
  document: string
  cep: string
  estado: string
  cidade: string
  bairro: string
  endereco: string
  numero: string
  complemento: string
}

const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const

interface FieldProps {
  id: string
  label: string
  icon: typeof User
  value: string
  onChange: (v: string) => void
  error?: string
  placeholder: string
  inputMode?: 'text' | 'numeric' | 'tel'
  autoComplete?: string
}

const inputClass = (error?: string) =>
  cn(
    'h-12 w-full rounded-[10px] border bg-white pl-10 pr-3 text-[15px] text-ink-900 outline-none transition-all duration-150 placeholder:text-ink-500',
    error ? 'border-error' : 'border-ink-300 focus:border-brand-orange focus:ring-2 focus:ring-orange-500/40',
  )

function FieldError({ error }: { error?: string }) {
  if (!error) return null
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-error">
      <CircleAlert className="h-3.5 w-3.5" />
      {error}
    </p>
  )
}

function Field({ id, label, icon: Icon, value, onChange, error, placeholder, inputMode, autoComplete }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold tracking-[0.02em] text-ink-900">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-300" />
        <input
          id={id}
          type="text"
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          className={inputClass(error)}
        />
      </div>
      <FieldError error={error} />
    </div>
  )
}

/** Etapa 2 — dados do titular + endereço de instalação (WhatsApp já coletado no convite). */
export default function StepDados({
  initial,
  onBack,
  onNext,
}: {
  initial: DadosValues
  onBack: () => void
  onNext: (values: DadosValues) => void
}) {
  const [values, setValues] = useState<DadosValues>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof DadosValues, string>>>({})

  const set = (key: keyof DadosValues) => (v: string) => {
    setValues((p) => ({ ...p, [key]: v }))
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!isValidName(values.name)) next.name = 'Informe seu nome completo.'
    if (!values.estado) next.estado = 'Selecione o estado.'
    if (!values.cidade.trim()) next.cidade = 'Informe a cidade.'
    // Campos opcionais: valida formato apenas se preenchidos
    if (values.document.trim() && !isValidCPFCNPJ(values.document)) next.document = 'Digite um CPF ou CNPJ válido.'
    if (values.cep.trim() && !isValidCEP(values.cep)) next.cep = 'Digite um CEP válido.'
    setErrors(next)
    if (Object.keys(next).length > 0) return
    onNext(values)
  }

  return (
    <form onSubmit={submit} noValidate className="mx-auto w-full max-w-[560px]">
      <h3 className="text-center font-display text-xl font-bold text-ink-900">Confirme seus dados</h3>
      <p className="mt-2 text-center text-[14px] text-ink-500">
        Precisamos dessas informações para montar seu pedido de contratação.
      </p>

      <div className="mt-6 space-y-4 rounded-2xl border border-ink-300/60 bg-white p-5 shadow-card sm:p-7">
        <Field
          id="funnel-name"
          label="Seu nome"
          icon={User}
          value={values.name}
          onChange={set('name')}
          error={errors.name}
          placeholder="João da Silva"
          autoComplete="name"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="funnel-document"
            label="CPF/CNPJ (opcional)"
            icon={IdCard}
            value={values.document}
            onChange={(v) => set('document')(maskCPFCNPJ(v))}
            error={errors.document}
            placeholder="000.000.000-00 ou 00.000.000/0000-00"
            inputMode="numeric"
          />
          <Field
            id="funnel-cep"
            label="CEP da instalação (opcional)"
            icon={MapPin}
            value={values.cep}
            onChange={(v) => set('cep')(maskCEP(v))}
            error={errors.cep}
            placeholder="00000-000"
            inputMode="numeric"
            autoComplete="postal-code"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="funnel-estado" className="mb-1.5 block text-[13px] font-semibold tracking-[0.02em] text-ink-900">
              Estado
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-300" />
              <select
                id="funnel-estado"
                value={values.estado}
                onChange={(e) => set('estado')(e.target.value)}
                aria-invalid={!!errors.estado}
                className={cn(inputClass(errors.estado), 'appearance-none pr-9', !values.estado && 'text-ink-500')}
              >
                <option value="" disabled>
                  Selecione o estado
                </option>
                {UFS.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
            <FieldError error={errors.estado} />
          </div>
          <Field
            id="funnel-cidade"
            label="Cidade"
            icon={MapPin}
            value={values.cidade}
            onChange={set('cidade')}
            error={errors.cidade}
            placeholder="Sua cidade"
            autoComplete="address-level2"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="funnel-bairro"
            label="Bairro (opcional)"
            icon={MapPin}
            value={values.bairro}
            onChange={set('bairro')}
            error={errors.bairro}
            placeholder="Seu bairro"
            autoComplete="address-level3"
          />
          <Field
            id="funnel-endereco"
            label="Endereço (opcional)"
            icon={Home}
            value={values.endereco}
            onChange={set('endereco')}
            error={errors.endereco}
            placeholder="Rua, avenida..."
            autoComplete="street-address"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="funnel-numero"
            label="Número (opcional)"
            icon={Hash}
            value={values.numero}
            onChange={set('numero')}
            error={errors.numero}
            placeholder="Número"
            inputMode="numeric"
          />
          <Field
            id="funnel-complemento"
            label="Complemento (opcional)"
            icon={Home}
            value={values.complemento}
            onChange={set('complemento')}
            placeholder="Apto, bloco, casa..."
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onBack}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full font-display text-[15px] font-semibold text-ink-500 transition-colors hover:bg-ink-300/20 hover:text-ink-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <button
          type="submit"
          className="group flex h-12 flex-[2] items-center justify-center gap-2 rounded-full bg-brand-orange font-display text-base font-semibold text-white transition-all duration-200 hover:bg-brand-orangeDark hover:shadow-cta-glow active:scale-[0.97]"
        >
          Continuar
          <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  )
}
