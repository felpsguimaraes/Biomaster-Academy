# Pago: simulador → Stripe real

`site/js/checkout.js` simula o fluxo (Checkout + portal de cobrança). **Nada é cobrado nem enviado**: só marca e últimos 4 dígitos ficam no `localStorage` (`biomaster.sub.v1`).

## Cartões de teste do simulador
| Cartão | Resultado |
|---|---|
| 4242 4242 4242 4242 | Aprovado |
| 4000 0000 0000 0002 | Recusado |
| 4000 0000 0000 9995 | Saldo insuficiente |
| 4000 0025 0000 3155 | Pede autenticação 3D Secure |

## Para ir ao Stripe real (precisa de um backend, ex.: Cloudflare Worker)
1. Criar em Stripe 3 *Products/Prices* recorrentes (mensal 25,90 · semestral 129,90 · anual 219,90 — valores a confirmar com a professora).
2. Endpoint `POST /checkout` cria uma **Checkout Session** (`mode: subscription`, `price`, `success_url`, `cancel_url`) e devolve `url`; `BioPay.open()` passa a redirecionar para ela.
3. Webhook `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted` grava o estado da assinatura (banco) e libera o painel por usuário (login).
4. "Gestionar plan" passa a abrir o **Customer Portal** do Stripe (`billing_portal.sessions.create`).
5. Nunca coletar número de cartão no próprio site: usar Checkout/Elements. Chave secreta só no servidor.
