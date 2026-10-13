# Pesquisa de satisfação pós-atendimento — Prestek Telecom

Aplicação web que o cliente abre (normalmente por link, no celular) logo depois de ser atendido, para avaliar o atendimento em menos de um minuto. Também guarda o histórico das conversas do atendimento, ligado à avaliação pelo número de protocolo.

## O que o cliente vê

1. **Como foi seu atendimento?**: nota de 1 a 5 estrelas.
2. **Seu problema foi resolvido?**: Sim, Parcialmente ou Não.
3. **O que podemos melhorar?**: comentário opcional (até 500 caracteres).

Depois de enviar aparece "Obrigado pela resposta!". Se a nota for 3 ou menos, ou o problema não foi resolvido por completo, aparece o botão **"Quero que entrem em contato comigo"**, que marca a avaliação para recontato.

A pesquisa não coleta nome, telefone nem documento. O recontato usa o protocolo do atendimento.

### Link com protocolo

O sistema de atendimento deve enviar o link com o protocolo na URL:

```
https://<endereço-da-pesquisa>/?protocolo=ABC123
```

O protocolo é gravado junto com a avaliação e é o que liga avaliação, conversa e atendimento.

## Como funciona

```
Navegador (React + Vite)  ──/api──▶  API Node (server/index.mjs)  ──▶  PostgreSQL
        porta 3000                          porta 3001                    porta 5433
```

- **Frontend** (`src/`): React 19, TypeScript, Vite 7, Tailwind 3. A tela fica em `src/components/pesquisa/`, e as chamadas à API em `src/components/pesquisa/api.ts`. Em desenvolvimento o Vite repassa `/api` para a porta 3001 (ver `vite.config.ts`).
- **API** (`server/index.mjs`): servidor HTTP em Node sem framework, só escuta em `127.0.0.1`. Cria as tabelas sozinha ao iniciar.
- **Banco**: PostgreSQL. Sem `DATABASE_URL`, a API sobe um Postgres embutido (pacote `embedded-postgres`) em `.pgdata/`. Com `DATABASE_URL`, usa o banco informado.

## Como rodar

Requisitos: Node.js (versão LTS recente) e npm.

```
npm install
npm run dev      # API (porta 3001) + Vite (porta 3000) juntos
```

Abra http://localhost:3000/?protocolo=TESTE para testar.

Outros comandos:

| Comando | O que faz |
|---|---|
| `npm run api` | Só a API |
| `npm run web` | Só o frontend |
| `npm run build` | Checa os tipos e gera o frontend em `dist/` |
| `npm run preview` | Serve o `dist/` gerado |
| `npm run lint` | Roda o ESLint |

### Configuração

Variáveis lidas do ambiente ou do arquivo `.env` na raiz (que fica fora do git):

| Variável | Padrão | Para que serve |
|---|---|---|
| `DATABASE_URL` | vazio | Postgres externo. Vazio = usa o Postgres embutido |
| `API_PORT` | `3001` | Porta da API |
| `PGPORT` | `5433` | Porta do Postgres embutido |
| `PGPASSWORD_LOCAL` | gerada | Senha do Postgres embutido. Criada no `.env` na primeira execução |

Na primeira execução o Postgres embutido é criado em `.pgdata/` em UTF-8, com a senha gerada em `.env`. Os dois ficam fora do git e **não devem ser versionados**.

> Se você tem um `.pgdata/` criado antes da migração para UTF-8 (padrão antigo do Windows, WIN1252), ele não aceita emojis. Apague a pasta para recriar (só se não houver dados que precise manter).

### Produção

O Postgres embutido serve para desenvolvimento. Em produção, aponte `DATABASE_URL` para um Postgres gerenciado em UTF-8. A API não tem autenticação e só escuta em `127.0.0.1`: coloque-a atrás de um proxy reverso e proteja os endpoints de conversas antes de expô-los.

## API

Todas as rotas respondem JSON. Erros vêm no formato `{ "erro": "<motivo>" }`.

### Saúde

- `GET /api/health`: confere a conexão com o banco.

### Avaliações

- `POST /api/avaliacoes`: grava uma avaliação.
  `{ "nota": 1-5, "resolvido": "sim|parcialmente|nao", "comentario": "...", "protocolo": "ABC123" }`
  Responde `201 { "id": "<uuid>" }`.
- `POST /api/avaliacoes/:id/contato`: marca que o cliente quer contato. Responde `204`.

### Conversas

Para guardar o histórico do atendimento. O `protocolo` é a chave.

- `POST /api/conversas`: cria a conversa, ou atualiza se o protocolo já existir. Aceita as mensagens no mesmo corpo (até 500 mensagens e 512 KB).
  ```json
  {
    "protocolo": "ABC123",
    "canal": "whatsapp",
    "cliente_nome": "Fulano",
    "cliente_contato": "...",
    "atendente": "Maria",
    "mensagens": [
      { "autor": "cliente", "texto": "Oi", "enviada_em": "2026-10-13T19:00:00Z" },
      { "autor": "atendente", "texto": "Olá!" }
    ]
  }
  ```
  `autor` é `cliente`, `atendente`, `bot` ou `sistema`. `enviada_em` é opcional (padrão: agora).
- `POST /api/conversas/:protocolo/mensagens`: acrescenta uma ou mais mensagens (um objeto, uma lista, ou `{ "mensagens": [...] }`).
- `POST /api/conversas/:protocolo/encerrar`: marca o encerramento. Responde `204`.
- `GET /api/conversas/:protocolo`: devolve a conversa com todas as mensagens em ordem.

## Banco de dados

Criado automaticamente por `server/index.mjs`.

- **`avaliacoes`**: `id`, `criado_em`, `protocolo`, `nota`, `resolvido`, `comentario`, `contato_solicitado`, `contato_solicitado_em`.
- **`conversas`**: `id`, `protocolo` (único), `criado_em`, `encerrada_em`, `canal`, `cliente_nome`, `cliente_contato`, `atendente`.
- **`mensagens`**: `id`, `conversa_id` (→ `conversas`), `enviada_em`, `autor`, `texto`.

Avaliações e conversas se cruzam pelo `protocolo`. As avaliações com `contato_solicitado = true` são a fila de recontato.

## Estrutura

```
server/index.mjs        API + Postgres embutido
src/                    frontend React
  components/pesquisa/  tela da pesquisa e cliente da API
public/                 logo, mascote e favicon
PRODUCT.md              contexto de produto e decisões de design
_legado-convite/        convite/indicação anterior, fora do build
```

## Pendências

- Definir quem consome os pedidos de recontato (hoje ficam só marcados no banco).
- Autenticação nos endpoints de conversas antes de integrar com o sistema de atendimento.
- Confirmar o critério de "nota baixa" (hoje, 1 a 3 estrelas).
