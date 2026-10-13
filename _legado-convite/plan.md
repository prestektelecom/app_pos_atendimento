# Plano — Clone da página "Convite Exclusivo" (zapisp.com.br)

## Objetivo
Recriar a página inteira de convite/indicação com TODAS as funções:
- Layout split-screen (esquerda escura com ilustração 3D + textos; direita branca com formulário)
- Formulário: nome, WhatsApp com seletor de país + máscara (00) 00000-0000, checkbox LGPD
- Modal "Gerar QR Code" (copiar link, compartilhar, download PNG, copiar QR)
- Modal "Como funciona este convite?"
- Modal "Regulamento" (termos de uso, scrollável)
- Links rodapé: Nosso site, Acompanhar, Fale conosco, Como funciona o convite?
- Envio do formulário → validação + tela de sucesso (sem backend real; simular com estado local)
- Design: laranja (#f97316-ish) como cor primária, fonte sans, responsivo

## Estágio 1 — Setup + Design/Build
- Skill: `vibecoding-webapp-swarm` (React + Tailwind + shadcn)
- Subagente builder: implementar a página completa (componentes: Hero lateral, Form, QrModal, HowItWorksModal, RegulamentoModal, máscara de telefone, geração de QR via lib `qrcode`, assets: ilustração gerada por IA + logo recriado)
- Assets: gerar imagem da mascote 3D (image_generation) e logo Prestek-like

## Estágio 2 — Validação
- Reviewer/verifier: build, checar funções (máscara, modais, QR download/share), responsividade

## Estágio 3 — Entrega
- `website_version_manager` build_version (type: static)
