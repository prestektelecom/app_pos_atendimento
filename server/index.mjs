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
`)

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const RESOLVIDO = new Set(['sim', 'parcialmente', 'nao'])

function send(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  res.end(body === undefined ? undefined : JSON.stringify(body))
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (c) => {
      size += c.length
      if (size > 8192) {
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
