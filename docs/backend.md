# Backend (Cloudflare Worker + D1)

Cuentas, sesión, suscripción Stripe, progreso y aulas protegidas. Código en `api/`, sin dependencias de ejecución.

## O que já existe
| Endpoint | Função |
|---|---|
| `POST /api/auth/register · login · logout`, `GET /api/me` | Conta e sessão (cookie HttpOnly, hash PBKDF2, limite de tentativas). Cadastro envia e-mail de boas-vindas |
| `POST /api/auth/forgot · reset` | Recuperação de senha: link de uso único (1 h, guardado só como hash), resposta genérica, encerra todas as sessões |
| `POST /api/checkout`, `POST /api/portal` | Stripe Checkout (assinatura) e Customer Portal |
| `POST /api/stripe/webhook` | Verifica assinatura (HMAC + tolerância de 5 min), idempotente; ativa/cancela acesso |
| `GET/PUT /api/progress` | Progresso do aluno no servidor (sanitizado) |
| `GET /api/lessons` | Lista de aulas; **a URL do vídeo só vem com plano ativo** (ou se a aula for `free`) |
| `GET/PUT /api/admin/lessons` | Professora cadastra aulas por módulo (`replace` apaga as que sobraram) |
| `GET /api/admin/stats` | Resumo (alunos, planos ativos, receita mensal estimada) e lista de alunos |
| `POST /api/sim/*` | Modo demonstração (assina sem Stripe). Só existe com `SIM_MODE=true` **e** sem `STRIPE_SECRET_KEY` |

**Quem é admin:** e-mail em `ADMIN_EMAILS` **e verificado**. O e-mail só é verificado ao concluir um link de redefinição (prova de acesso à caixa). Assim ninguém consegue virar admin cadastrando antes o e-mail da professora. **Na primeira vez**, a professora deve se cadastrar e usar “¿Olvidaste tu contraseña?” para verificar.

## Painel da professora
`site/admin.html` (link “⚙ Panel de la profesora” aparece no menu do painel só para admin): **Resumo**, **Aulas** (título, duração, URL do vídeo https, aula gratuita, ordem) e **Alunos** (busca e CSV, com proteção contra injeção de fórmulas). Um módulo com aulas salvas aparece disponível para os alunos; os alunos sem cadastro/plano veem o cadeado.

⚠ O progresso é guardado por **posição** (`m6-2` = 2ª aula do módulo 6). Reordenar ou apagar aulas já publicadas desloca o progresso dos alunos.

Proteções: CSRF por `Origin` + cabeçalho `X-Requested-With`, CORS restrito a `ALLOWED_ORIGIN`, vídeos só `https://`, corpo limitado, mensagens de login iguais para usuário inexistente/senha errada.

## Testes
```bash
node --no-warnings api/test/run.mjs     # 55 provas (auth, CSRF, webhook, acesso, Stripe simulado, recuperação, admin)
```
Também foi validado no runtime real (`wrangler dev --local`) e no navegador (cadastro → aula bloqueada → pagamento → desbloqueio → progresso → logout).

## Publicar (precisa da sua conta Cloudflare e Stripe)
1. `cd api && npx wrangler d1 create biomaster` → cole o `database_id` em `wrangler.toml`.
2. `npx wrangler d1 execute biomaster --remote --file=schema.sql`
3. Ajuste `SITE_URL` e `ALLOWED_ORIGIN` (seu domínio). **Recomendado:** servir o site e a API no mesmo domínio (rota `/api/*` do Worker) → cookie `SameSite=Lax`, sem CORS.
4. No Stripe: crie 3 preços recorrentes (mensal/semestral/anual) e um webhook para `https://SEU-DOMINIO/api/stripe/webhook` com os eventos `checkout.session.completed`, `customer.subscription.created|updated|deleted`.
5. Segredos: `npx wrangler secret put STRIPE_SECRET_KEY` · `STRIPE_WEBHOOK_SECRET` · `PRICE_MENSUAL` · `PRICE_SEMESTRAL` · `PRICE_ANUAL` · `RESEND_API_KEY` (e-mails; conta em resend.com com domínio verificado) e a variável `MAIL_FROM` (ex.: `Biomáster Academy <hola@seudominio.com>`). Sem `RESEND_API_KEY` nenhum e-mail é enviado. Defina `ADMIN_EMAILS` e **deixe `SIM_MODE="false"`**.
6. `npx wrangler deploy`
7. Em `site/js/config.js`: `apiBase: ''` (mesmo domínio) ou a URL do Worker. Ative **Customer Portal** no painel do Stripe.
8. Teste primeiro com chaves `sk_test_…` e cartão `4242…`.

## Rodar local
```bash
cd api && cp wrangler.toml wrangler.dev.toml   # troque COLE-O-ID-AQUI por um UUID qualquer
npx wrangler d1 execute biomaster --local --config wrangler.dev.toml --file=schema.sql
npx wrangler dev --local --config wrangler.dev.toml --var SITE_URL:http://localhost:8000 --var ALLOWED_ORIGIN:http://localhost:8000 --var SIM_MODE:true --var INSECURE_COOKIES:1
python3 -m http.server -d site 8000      # e em site/js/config.js: apiBase: 'http://localhost:8787'
```

## Limites honestos
- O vídeo protegido por URL **não impede** que um assinante copie o link. Para proteção forte use hospedagem com URLs assinadas/expirantes (Cloudflare Stream, Mux, Bunny, Vimeo privado).
- Falta: e-mail de recibo (o Stripe já envia o próprio se ativado), verificação de e-mail para alunos comuns, tela para a professora enviar vídeos (hoje cola-se a URL) e termos/privacidade (LGPD).
- Impostos/IVA e cobrança em moeda local não estão tratados (Stripe Tax / preços por moeda).
