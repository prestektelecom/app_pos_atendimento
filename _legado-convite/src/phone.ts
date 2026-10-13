/** Brazilian phone helpers: mask (00) 00000-0000 / (00) 0000-0000 + DDD validation. */

export function maskBRPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`
  const ddd = digits.slice(0, 2)
  const rest = digits.slice(2)
  // 11 digits → (00) 00000-0000 ; 10 digits → (00) 0000-0000
  const splitAt = digits.length > 10 ? 5 : 4
  if (rest.length <= splitAt) return `(${ddd}) ${rest}`
  return `(${ddd}) ${rest.slice(0, splitAt)}-${rest.slice(splitAt)}`
}

export function phoneDigits(value: string): string {
  return value.replace(/\D/g, '')
}

const VALID_DDDS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19, // SP
  21, 22, 24, // RJ
  27, 28, // ES
  31, 32, 33, 34, 35, 37, 38, // MG
  41, 42, 43, 44, 45, 46, // PR
  47, 48, 49, // SC
  51, 53, 54, 55, // RS
  61, // DF
  62, 64, // GO
  63, // TO
  65, 66, // MT
  67, // MS
  68, // AC
  69, // RO
  71, 73, 74, 75, 77, // BA
  79, // SE
  81, 87, // PE
  82, // AL
  83, // PB
  84, // RN
  85, 88, // CE
  86, 89, // PI
  91, 93, 94, // PA
  92, 97, // AM
  95, // RR
  96, // AP
  98, 99, // MA
])

export function isValidBRPhone(value: string): boolean {
  const digits = phoneDigits(value)
  if (digits.length !== 10 && digits.length !== 11) return false
  const ddd = Number(digits.slice(0, 2))
  return VALID_DDDS.has(ddd)
}

export function isValidName(value: string): boolean {
  const letters = value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, '')
  return value.trim().length >= 3 && letters.length >= 3
}
