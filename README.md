# Biomaster-Academy
Plataforma de estudo acadêmico para alunos, professores e administração.

## Estrutura
- `site/index.html` — landing 3D + painel do aluno (estático, sem build).
  - `css/landing.css`, `js/landing.js` — landing com profundidade 3D ligada ao scroll (fontes: Poppins + Inter).
  - `css/panel.css`, `js/panel.js` — painel do aluno (progresso salvo no navegador).
  - `js/course-data.js` — temário (Empieza por aquí + 17 módulos) e planos.
  - `css/checkout.css`, `js/checkout.js` — **simulador** de pagamento estilo Stripe + "Gestionar plan". Ver `docs/stripe-integracao.md`.
  - `admin.html`, `js/admin.js` — painel da professora (aulas, alunos, resumo). Requer backend.
  - `js/config.js`, `js/api.js`, `js/auth.js` — conexão opcional com o backend (cuentas, aulas protegidas, progresso). Vazio = modo demonstração.
  - `assets/` — imagens. **Pendente:** `presentacion.mp4` (7,7 MB) não foi baixado do artifact.

- `api/` — backend Cloudflare Worker + D1 (auth, Stripe, webhook, progresso, aulas). Ver `docs/backend.md`.

## Rodar localmente
`python3 -m http.server -d site 8000` e abra http://localhost:8000
