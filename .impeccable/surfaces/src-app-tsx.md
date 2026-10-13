---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Pesquisa de satisfação pós-atendimento

Scope: página única `/` (src/App.tsx). Modo: Operate (o cliente conclui uma tarefa de menos de 1 minuto), celular primeiro.
Audiência/tarefa: cliente Prestek recém-atendido; nota 1–5, problema resolvido (Sim/Parcialmente/Não), texto opcional, enviar. Pós-envio: agradecimento; nota ≤3 ou não resolvido total → botão "Quero que entrem em contato comigo".
Memorável: a nota escolhida vira um número gigante de "preço" na etiqueta.
Em aberto: parâmetro `?protocolo=` como identificador do atendimento; quem consome os pedidos de contato.

## Direction contract

THESIS: A pesquisa é uma etiqueta de gôndola: a nota escolhida vira o número gigante do "preço". Recusa o cartão branco centralizado com estrelas pequenas.
OWN-WORLD: campo azul-royal do boné da mascote; etiqueta branca com tinta azul-marinho quase preta; faixa amarela de etiqueta para o número; laranja Prestek só em ação e seleção; Big Shoulders Display condensada pesada nos títulos e números, Barlow no corpo; sem gradientes; divisórias finas de linha de tabela de gôndola.
STORY: o cliente entende em um segundo que são 3 perguntas rápidas, toca a nota e vê o número crescer, responde as outras duas, envia; se o caso foi ruim, pede recontato em um toque.
FIRST VIEWPORT: celular 390x844: logo Prestek no topo sobre o azul; etiqueta ocupa a largura; título "Como foi seu atendimento?", cinco estrelas de 56px, faixa amarela com numeral de 6rem e palavra da nota; as duas perguntas seguintes e o botão laranja abaixo, visíveis ao rolar um pouco. Desktop: etiqueta de 560px centrada no azul.
FORM: Etiqueta de gôndola (pool do sorteio, índice 7); seed 0830e8f2.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
