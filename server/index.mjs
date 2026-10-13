// API local da pesquisa de satisfação + PostgreSQL local (embutido).
// Sem DATABASE_URL, sobe um Postgres real em .pgdata/ (porta 5433) e guarda a
// senha gerada em .env (ignorado pelo git). Com DATABASE_URL, só usa o banco informado.
import http from 'node:http'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import pg from 'pg'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const envFile = path.join(root, '.env')

function loadEnv() {
  const env = {}
  if (existsSync(envFile)) {
    for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m) env[m[1]] = m[2]
    }
  }
  return env
}

const env = { ...loadEnv(), ...process.env }
const API_PORT = Number(env.API_PORT ?? 3001)
const PG_PORT = Number(env.PGPORT ?? 5433)
const PG_USER = 'pesquisa'
const PG_DB = 'pesquisa'

let embedded = null
let connectionString = env.DATABASE_URL

if (!connectionString) {
  let password = env.PGPASSWORD_LOCAL
  if (!password) {
    password = randomBytes(18).toString('hex')
    const prev = existsSync(envFile) ? readFileSync(envFile, 'utf8').replace(/\s*$/, '\n') : ''
    writeFileSync(envFile, `${prev}PGPASSWORD_LOCAL=${password}\n`)
  }
  const { default: EmbeddedPostgres } = await import('embedded-postgres')
  const databaseDir = path.join(root, '.pgdata')
  embedded = new EmbeddedPostgres({
    databaseDir,
    user: PG_USER,
    password,
    port: PG_PORT,
    persistent: true,
    // UTF8 (acentos e emojis das conversas); o padrão no Windows seria WIN1252.
    initdbFlags: ['--encoding=UTF8', '--locale=C'],
    onLog: () => {},
    onError: (e) => console.error('[postgres]', String(e).trim()),
  })
  if (!existsSync(path.join(databaseDir, 'PG_VERSION'))) await embedded.initialise()
  await embedded.start()
  try {
    await embedded.createDatabase(PG_DB)
  } catch {
    /* já existe */
  }
  connectionString = `postgres://${PG_USER}:${password}@127.0.0.1:${PG_PORT}/${PG_DB}`
}

const pool = new pg.Pool({ connectionString, max: 5 })

await pool.query(`
  create table if not exists avaliacoes (
    id uuid primary key default gen_random_uuid(),
    criado_em timestamptz not null default now(),
    protocolo text,
    nota smallint not null check (nota between 1 and 5),
    resolvido text not null check (resolvido in ('sim', 'parcialmente', 'nao')),
    comentario text,
    contato_solicitado boolean not null default false,
    contato_solicitado_em timestamptz
  );
  create index if not exists avaliacoes_criado_em_idx on avaliacoes (criado_em desc);

  create table if not exists conversas (
    id uuid primary key default gen_random_uuid(),
    protocolo text not null unique,
    criado_em timestamptz not null default now(),
    encerrada_em timestamptz,
    canal text,
    cliente_nome text,
    cliente_contato text,
    atendente text
  );

  create table if not exists mensagens (
    id bigserial primary key,
    conversa_id uuid not null references conversas (id) on delete cascade,
    enviada_em timestamptz not null default now(),
    autor text not null check (autor in ('cliente', 'atendente', 'bot', 'sistema')),
    texto text not null
  );
  create index if not exists mensagens_conversa_idx on mensagens (conversa_id, enviada_em, id);
`)

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const RESOLVIDO = new Set(['sim', 'parcialmente', 'nao'])
const AUTORES = new Set(['cliente', 'atendente', 'bot', 'sistema'])
const MAX_MENSAGENS = 500

const txt = (v, n) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, n) : null)

function normalizarMensagens(lista) {
  if (lista === undefined) return []
  if (!Array.isArray(lista) || lista.length > MAX_MENSAGENS) return null
  const out = []
  for (const m of lista) {
    const texto = txt(m?.texto, 4000)
    const autor = String(m?.autor ?? '')
    const data = m?.enviada_em ? new Date(m.enviada_em) : null
    if (!texto || !AUTORES.has(autor) || (data && Number.isNaN(data.getTime()))) return null
    out.push({ autor, texto, enviada_em: data })
  }
  return out
}

async function inserirMensagens(client, conversaId, msgs) {
  for (const m of msgs) {
    await client.query(
      'insert into mensagens (conversa_id, autor, texto, enviada_em) values ($1, $2, $3, coalesce($4, now()))',
      [conversaId, m.autor, m.texto, m.enviada_em],
    )
  }
}

async function emTransacao(fn) {
  const client = await pool.connect()
  try {
    await client.query('begin')
    const r = await fn(client)
    await client.query('commit')
    return r
  } catch (e) {
    await client.query('rollback').catch(() => {})
    throw e
  } finally {
    client.release()
  }
}

function send(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  res.end(body === undefined ? undefined : JSON.stringify(body))
}

function readJson(req, limit = 8192) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (c) => {
      size += c.length
      if (size > limit) {
        reject(Object.assign(new Error('payload'), { status: 413 }))
        req.destroy()
      } else chunks.push(c)
    })
    req.on('end', () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {})
      } catch {
        reject(Object.assign(new Error('json'), { status: 400 }))
      }
    })
    req.on('error', reject)
  })
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost')
  try {
    if (req.method === 'GET' && url.pathname === '/api/health') {
      await pool.query('select 1')
      return send(res, 200, { ok: true })
    }

    if (req.method === 'POST' && url.pathname === '/api/avaliacoes') {
      const b = await readJson(req)
      const nota = Number(b.nota)
      const resolvido = String(b.resolvido ?? '')
      const comentario = typeof b.comentario === 'string' ? b.comentario.trim().slice(0, 500) : ''
      const protocolo = typeof b.protocolo === 'string' ? b.protocolo.trim().slice(0, 40) : ''
      if (!Number.isInteger(nota) || nota < 1 || nota > 5) return send(res, 422, { erro: 'nota' })
      if (!RESOLVIDO.has(resolvido)) return send(res, 422, { erro: 'resolvido' })
      const { rows } = await pool.query(
        'insert into avaliacoes (protocolo, nota, resolvido, comentario) values ($1, $2, $3, $4) returning id',
        [protocolo || null, nota, resolvido, comentario || null],
      )
      return send(res, 201, { id: rows[0].id })
    }

    // Conversas: cria/atualiza pelo protocolo e anexa mensagens.
    if (req.method === 'POST' && url.pathname === '/api/conversas') {
      const b = await readJson(req, 512 * 1024)
      const protocolo = txt(b.protocolo, 40)
      const msgs = normalizarMensagens(b.mensagens)
      if (!protocolo) return send(res, 422, { erro: 'protocolo' })
      if (!msgs) return send(res, 422, { erro: 'mensagens' })
      const id = await emTransacao(async (client) => {
        const { rows } = await client.query(
          `insert into conversas (protocolo, canal, cliente_nome, cliente_contato, atendente)
           values ($1, $2, $3, $4, $5)
           on conflict (protocolo) do update set
             canal = coalesce(excluded.canal, conversas.canal),
             cliente_nome = coalesce(excluded.cliente_nome, conversas.cliente_nome),
             cliente_contato = coalesce(excluded.cliente_contato, conversas.cliente_contato),
             atendente = coalesce(excluded.atendente, conversas.atendente)
           returning id`,
          [protocolo, txt(b.canal, 40), txt(b.cliente_nome, 120), txt(b.cliente_contato, 120), txt(b.atendente, 120)],
        )
        await inserirMensagens(client, rows[0].id, msgs)
        return rows[0].id
      })
      return send(res, 201, { id, mensagens: msgs.length })
    }

    const c = url.pathname.match(/^\/api\/conversas\/([^/]+)(\/mensagens|\/encerrar)?$/)
    if (c) {
      const protocolo = decodeURIComponent(c[1]).slice(0, 40)
      const { rows: conv } = await pool.query('select * from conversas where protocolo = $1', [protocolo])
      if (!conv.length) return send(res, 404, { erro: 'nao_encontrado' })

      if (req.method === 'GET' && !c[2]) {
        const { rows } = await pool.query(
          'select autor, texto, enviada_em from mensagens where conversa_id = $1 order by enviada_em, id',
          [conv[0].id],
        )
        return send(res, 200, { ...conv[0], mensagens: rows })
      }
      if (req.method === 'POST' && c[2] === '/mensagens') {
        const b = await readJson(req, 512 * 1024)
        const msgs = normalizarMensagens(Array.isArray(b) ? b : (b.mensagens ?? [b]))
        if (!msgs?.length) return send(res, 422, { erro: 'mensagens' })
        await emTransacao((client) => inserirMensagens(client, conv[0].id, msgs))
        return send(res, 201, { mensagens: msgs.length })
      }
      if (req.method === 'POST' && c[2] === '/encerrar') {
        await pool.query('update conversas set encerrada_em = coalesce(encerrada_em, now()) where id = $1', [conv[0].id])
        return send(res, 204)
      }
    }

    const m = url.pathname.match(/^\/api\/avaliacoes\/([^/]+)\/contato$/)
    if (req.method === 'POST' && m) {
      if (!UUID.test(m[1])) return send(res, 404, { erro: 'nao_encontrado' })
      const r = await pool.query(
        'update avaliacoes set contato_solicitado = true, contato_solicitado_em = coalesce(contato_solicitado_em, now()) where id = $1',
        [m[1]],
      )
      return r.rowCount ? send(res, 204) : send(res, 404, { erro: 'nao_encontrado' })
    }

    send(res, 404, { erro: 'nao_encontrado' })
  } catch (e) {
    const status = e?.status ?? 500
    if (status === 500) console.error('[api]', e)
    send(res, status, { erro: status === 500 ? 'interno' : 'requisicao_invalida' })
  }
})

server.listen(API_PORT, '127.0.0.1', () => {
  console.log(`API da pesquisa em http://127.0.0.1:${API_PORT}  (banco: ${embedded ? `Postgres local, porta ${PG_PORT}` : 'DATABASE_URL'})`)
})

let closing = false
async function shutdown() {
  if (closing) return
  closing = true
  server.close()
  await pool.end().catch(() => {})
  if (embedded) await embedded.stop().catch(() => {})
  process.exit(0)
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
