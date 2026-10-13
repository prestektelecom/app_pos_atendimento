import { Frown, Meh, Smile } from 'lucide-react'

export type Resolvido ='sim' | 'parcialmente' | 'nao'

export const PALAVRAS_NOTA = ['Muito ruim', 'Ruim', 'Regular', 'Bom', 'Excelente'] as const

export const OPCOES_RESOLVIDO: { valor: Resolvido; rotulo: string }[] = [
  { valor: 'sim', rotulo: 'Sim' },
  { valor: 'parcialmente', rotulo: 'Parcialmente' },
  { valor: 'nao', rotulo: 'Não' },
]

export const LIMITE_COMENTARIO = 500

/** Nota até 3 ou problema não resolvido por completo abre o pedido de recontato. */
export function precisaContato(nota: number, resolvido: Resolvido) {
  return nota <= 3 || resolvido !== 'sim'
}

/** Cor e ícone por faixa de nota: 1–2, 3 e 4–5. */
export function faixaNota(nota: number) {
  if (nota <= 2) return { chave: 'baixa', Icone: Frown, faixa: 'bg-nota-baixa', estrela: 'fill-nota-baixa' }
  if (nota === 3) return { chave: 'media', Icone: Meh, faixa: 'bg-tag', estrela: 'fill-tag' }
  return { chave: 'alta', Icone: Smile, faixa: 'bg-nota-alta', estrela: 'fill-nota-alta' }
}
