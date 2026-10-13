import type { Resolvido } from './tipos'

/** Rede móvel ruim não pode deixar o botão preso em "Enviando…": após o prazo, cai no erro com nova tentativa. */
const PRAZO_MS = 20_000

export async function enviarAvaliacao(dados: {
  nota: number
  resolvido: Resolvido
  comentario: string
  protocolo: string | null
}): Promise<string> {
  const r = await fetch('/api/avaliacoes', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(dados),
    signal: AbortSignal.timeout(PRAZO_MS),
  })
  if (!r.ok) throw new Error(`avaliacao ${r.status}`)
  return (await r.json()).id as string
}

export async function pedirContato(id: string): Promise<void> {
  const r = await fetch(`/api/avaliacoes/${id}/contato`, { method: 'POST', signal: AbortSignal.timeout(PRAZO_MS) })
  if (!r.ok) throw new Error(`contato ${r.status}`)
}
