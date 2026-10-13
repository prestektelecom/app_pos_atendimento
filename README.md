# Pesquisa de satisfação pós-atendimento — Prestek Telecom

Três perguntas (nota 1–5, problema resolvido, o que melhorar) e envio. Nota ≤ 3 ou problema não resolvido por completo oferece "Quero que entrem em contato comigo".

## Rodar

```
npm install
npm run dev      # API (porta 3001) + Vite (porta 3000)
```

- Na primeira execução sobe um PostgreSQL local embutido em `.pgdata/` (porta 5433) e gera a senha em `.env`. Ambos ficam fora do git.
- Para usar outro Postgres, defina `DATABASE_URL` (a tabela `avaliacoes` é criada sozinha).
- Link com identificador do atendimento: `/?protocolo=ABC123` (gravado na coluna `protocolo`).

## Dados

Tabela `avaliacoes`: `nota`, `resolvido` (sim/parcialmente/nao), `comentario`, `protocolo`, `contato_solicitado`, `contato_solicitado_em`. Não coleta nome nem telefone.

## Histórico

O convite/indicação anterior está em `_legado-convite/` (fora do build).
