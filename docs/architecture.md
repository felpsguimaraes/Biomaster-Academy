# Documentação de arquitetura

## Visão de alto nível

A Biomaster Academy será organizada como um monorepo com duas aplicações principais:

- apps/web: frontend em React
- apps/api: backend em Node.js + Express

## Objetivo do sistema

Centralizar organização acadêmica, materiais, tarefas e desempenho dos alunos em um ambiente único.

## Módulos esperados

- autenticação
- painel do aluno
- painel do professor
- disciplinas e materiais
- agenda
- avaliações
- relatórios
- administração

## Fluxo de dados

1. Usuário acessa interface web.
2. Frontend envia requisições para API REST.
3. Backend valida autenticação e regras de negócio.
4. Dados são persistidos em banco PostgreSQL.
5. Dashboard exibe métricas e progresso em tempo real.

## Próximos passos

- definir modelo de dados no Prisma
- criar autenticação JWT
- implementar CRUD de disciplinas e materiais
- criar routes para quizzes e progresso
- conectar frontend com API
