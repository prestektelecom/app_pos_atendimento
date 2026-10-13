# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Existing codebase: React 19 + TypeScript + Vite 7 + Tailwind 3 + shadcn/ui (mantido). Backend local novo: Node + PostgreSQL local (Docker) para gravar respostas.

## Users

Clientes do provedor Prestek Telecom que acabaram de ser atendidos (suporte, WhatsApp, visita técnica). Abrem o link pelo celular, muitas vezes logo após o atendimento, e querem responder rápido (menos de um minuto) e voltar ao que estavam fazendo. Podem estar frustrados se o problema não foi resolvido.

## Product Purpose

Pesquisa de satisfação pós-atendimento no site da Prestek. Mede a nota do atendimento, se o problema foi resolvido e o que melhorar. Sucesso = alta taxa de conclusão em menos de um minuto e, nos casos ruins, um caminho de recontato sem o cliente repetir tudo.

## Positioning

Pesquisa curta, de três perguntas, que reage ao resultado: nota baixa ou problema não resolvido abrem um pedido de contato em um toque.

## Operating Context

Fluxo fixo: (1) "Como foi seu atendimento?" com 1 a 5 estrelas; (2) "Seu problema foi resolvido?" Sim / Parcialmente / Não; (3) "O que podemos melhorar?" texto opcional; botão "Enviar avaliação". Após o envio: "Obrigado pela resposta!". Se a nota for baixa ou o problema não foi resolvido (Parcialmente/Não), oferecer o botão "Quero que entrem em contato comigo". Respostas gravadas em PostgreSQL local, via API Node local. Sem autenticação do cliente.

## Capabilities and Constraints

- Substitui por completo o conteúdo anterior (convite/indicação, planos, funil de contratação, acompanhar, regulamento, fale conosco).
- Idioma: português do Brasil.
- Banco: PostgreSQL local; nenhuma credencial ou dado de cliente do provedor versionado no git (o vault proíbe). Segredos só em `.env` ignorado pelo git.
- Não coletar nome, telefone ou documento na pesquisa; o recontato usa o protocolo/identificador do atendimento. Em aberto: como o link recebe o identificador do atendimento (parâmetro de URL) e quem consome os pedidos de contato.
- Critério de "nota baixa": 1 a 3 estrelas (hipótese a confirmar).

## Brand Commitments

Nome Prestek Telecom, logo (`public/logo-prestek.svg`, `public/logo-prestek-light.svg`) e mascote (`public/mascot-prestek.png`) permanecem. Cores, tipografia, layout e linguagem visual são redesenhados do zero (o laranja/roxo do convite é evidência, não autoridade).

## Evidence on Hand

Logos e mascote em `public/`. Não há dados reais de respostas, métricas de satisfação ou depoimentos: nada disso deve ser inventado.

## Product Principles

1. Menos de um minuto: cada campo extra precisa justificar o segundo que custa.
2. Uma pergunta de cada vez ou tudo visível sem rolagem no celular; nunca um formulário que intimida.
3. O mau resultado não vira burocracia: recontato em um toque, sem repetir o caso.
4. Pedir só o que a análise usa; nenhum dado pessoal desnecessário.
5. Agradecer de verdade, sem gamificar nem prometer o que a empresa não cumpre.

## Accessibility & Inclusion

Uso majoritário em celular, com polegar. Alvos de toque amplos, estrelas operáveis por teclado e leitor de tela (grupo de rádio com rótulos), contraste AA, foco visível, movimento reduzido respeitado.
