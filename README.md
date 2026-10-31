# Biomaster Academy

Plataforma de estudo acadêmico para alunos, professores e administradores.

## Visão geral

A Biomaster Academy centraliza materiais, cronograma, avaliações e progresso em um único ambiente para facilitar o processo de aprendizagem.

## Stack atual

- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Banco: PostgreSQL
- ORM: Prisma
- Autenticação: JWT
- Infraestrutura: Docker + Docker Compose

## Estrutura principal

```text
.
├── apps
│   ├── api
│   │   └── src
│   └── web
│       ├── public
│       └── src
├── docs
├── prisma
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── README.md
└���─ LICENSE
```

## MVP em foco

- Cadastro e login
- Perfil do usuário
- Dashboard com métricas do aluno
- Disciplinas e materiais
- Agenda de estudo
- Quiz e avaliações
- Progresso e relatórios
- Painel do professor e admin

## Requisitos

- Node.js 20+
- npm 10+
- Docker + Docker Compose

## Desenvolvimento local

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
```

## Arquitetura

- Frontend: experiência moderna, responsiva e orientada ao usuário
- Backend: API REST com autenticação e regras de negócio
- Banco de dados: persistência para cursos, usuários, materiais e avaliações
- Segurança: JWT e controle de acesso por perfil

## Roadmap

### Fase 1 - MVP
- autenticação
- dashboard inicial
- disciplinas e materiais
- agenda de estudos
- quiz

### Fase 2 - Engajamento
- notificações
- flashcards
- relatórios por professor
- fórum de dúvidas

### Fase 3 - Escala
- analytics avançado
- recomendação inteligente
- gamificação
- IA para revisão personalizada

## Licença

MIT

## Site estático e backend (do branch claude/integrate-biomaster-artifact)


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
