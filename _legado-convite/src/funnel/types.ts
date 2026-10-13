export interface Plan {
  id: string
  name: string
  price: string
  featured?: boolean
}

export type PaymentMethod = 'pix' | 'card' | 'boleto'

export interface FunnelData {
  plan: Plan | null
  name: string
  phone: string
  document: string
  cep: string
  estado: string
  cidade: string
  bairro: string
  endereco: string
  numero: string
  complemento: string
  payment: PaymentMethod | null
  dueDay: number | null
}

export const PLANS: Plan[] = [
  { id: '400', name: '400MB', price: '89,90' },
  { id: '600', name: '600MB', price: '99,90', featured: true },
  { id: '750', name: '750MB', price: '109,90' },
]

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  pix: 'PIX',
  card: 'Crédito',
  boleto: 'Boleto',
}

export const STEP_LABELS = ['Plano', 'Dados', 'Pagamento', 'Revisão', 'Finalização'] as const
