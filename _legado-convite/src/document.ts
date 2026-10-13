/** Brazilian document helpers: CPF (000.000.000-00) and CEP (00000-000) masks + basic validation. */

export function maskCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length === 0) return ''
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

export function isValidCPF(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  if (digits.length !== 11) return false
  // reject known-invalid repeated sequences (111.111.111-11 etc.)
  if (/^(\d)\1{10}$/.test(digits)) return false
  return true
}

/** CPF/CNPJ combined mask: up to 11 digits → CPF (000.000.000-00); 12–14 digits → CNPJ (00.000.000/0000-00). */
export function maskCPFCNPJ(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14)
  if (digits.length <= 11) return maskCPF(digits)
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
}

export function isValidCPFCNPJ(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 11) return isValidCPF(digits)
  if (digits.length === 14) return !/^(\d)\1{13}$/.test(digits)
  return false
}

export function maskCEP(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export function isValidCEP(value: string): boolean {
  return value.replace(/\D/g, '').length === 8
}
