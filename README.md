# Biomaster Academy

Plataforma de estudo acadêmico com foco em organização, desempenho e acompanhamento do aprendizado.

## Visão geral

A Biomaster Academy é uma plataforma para alunos, professores e administradores organizarem estudos, materiais, avaliações e progresso dentro de um único ambiente.

## Stack sugerida

- Frontend: React + Vite + TypeScript + Tailwind
- Backend: Node.js + TypeScript + Express
- Banco de dados: PostgreSQL
- ORM: Prisma
- Autenticação: JWT
- Infraestrutura: Docker + Docker Compose

## Estrutura do projeto

```text
.
├── apps
│   ├── api
│   │   └── src
│   └── web
│       ├── public
│       └── src
├── docs
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
└── README.md
```

## Requisitos

- Node.js 20+
- npm 10+
- Docker + Docker Compose

## Inicialização rápida

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

- `npm run dev` - inicia frontend e backend em paralelo
- `npm run build` - gera build das aplicações
- `npm run lint` - valida qualidade do código

## Fluxo principal

1. Aluno realiza cadastro e login.
2. Acessa disciplinas, materiais e cronograma.
3. Marca aulas e conteúdos como concluídos.
4. Responde quizzes e acompanha desempenho.
5. Recebe lembretes e relatórios de progresso.

## Roadmap

- MVP: cadastro, disciplinas, materiais, agenda, quiz e dashboard
- Etapa 2: notificações, relatórios, flashcards e fórum
- Etapa 3: métricas avançadas e recomendação inteligente

## Licença

MIT
