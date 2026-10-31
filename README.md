# Biomaster-Academy
Plataforma de estudo acadêmico para alunos, professores e administração.

## Estrutura
- `site/` — protótipo integrado do artifact "Projeto Biomáster Academy" (página de vendas + painel do aluno, estático, sem build).
  - `site/index.html` — landing de vendas (USD 25,90/mês) e painel do aluno (Início, Mi curso, Repaso, Preguntas, Materiales, Fijados). Progresso salvo no navegador (localStorage).
  - `site/assets/` — mascote (coruja), professora, capturas e materiais.
  - **Pendente:** `assets/presentacion.mp4` (7,7 MB) não pôde ser baixado do artifact; copie manualmente para `site/assets/`.

## Rodar localmente
`python3 -m http.server -d site 8000` e abra http://localhost:8000
