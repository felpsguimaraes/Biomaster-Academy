/* Capa de pedidos de pago independiente del proveedor: el servidor fija el monto, el proveedor cobra y avisa por webhook,
   y recién entonces se concede el acceso (pago por período fijo, sin renovación automática).
   Proveedores: 'sim' (demostración, solo con SIM_MODE) y 'pagopar' (esqueleto). Stripe sigue su propio flujo (suscripción). */
import { HttpError, now, json } from './lib.js';
import { pagopar } from './providers/pagopar.js';

export const PRICES = { USD: { mensual: 2590, semestral: 12990, anual: 21990 }, PYG: { mensual: 149000, semestral: 749000, anual: 1249000 }, BRL: { mensual: 13990, semestral: 69990, anual: 118990 } }; // USD/BRL en centavos, PYG entero
const MONTHS = { mensual: 1, semestral: 6, anual: 12 };
const METHODS = { PYG: ['card', 'qr'], BRL: ['pix', 'card'], USD: ['card'] };
const LABEL = { card: 'TARJETA', qr: 'QR', pix: 'PIX' };
const ROUTE = { 'PYG:card': 'pagopar', 'PYG:qr': 'pagopar', 'BRL:pix': 'pagopar' }; // el resto va por Hotmart/Stripe (fuera de esta capa)
const PROVIDERS = { pagopar };

function providerFor(env, currency, method) {
  const wanted = ROUTE[`${currency}:${method}`];
  if (wanted && PROVIDERS[wanted].enabled(env)) return wanted;
  if (env.SIM_MODE === 'true' && !env.STRIPE_SECRET_KEY) return 'sim';
  return null;
}
function addMonths(sec, m) { const d = new Date(sec * 1000); d.setMonth(d.getMonth() + m); return Math.floor(d / 1000); }

export function makePay(h) {
  const { requireUser, getSub, saveSub, first, run, body, assertSim } = h;

  async function grant(env, order) {
    const sub = await getSub(env, order.user_id);
    const live = sub && ['active', 'trialing'].includes(sub.status) && !sub.stripe_sub && sub.current_period_end > now();
    const base = live ? sub.current_period_end : now(); // renovar antes de vencer extiende el período
    await saveSub(env, order.user_id, { plan: order.plan, status: 'active', stripe_sub: null, current_period_end: addMonths(base, MONTHS[order.plan]),
      cancel_at_period_end: 0, card_brand: LABEL[order.method], card_last4: null });
  }
  async function markPaid(env, order) {
    const r = await run(env.DB, "UPDATE orders SET status='paid', paid_at=? WHERE id=? AND status='pending'", now(), order.id);
    if (r?.meta?.changes === 0) return false; // idempotente: ya estaba pagado
    await grant(env, order); return true;
  }
  const mine = async (req, env, id) => {
    const u = await requireUser(req, env), o = await first(env.DB, 'SELECT * FROM orders WHERE id=? AND user_id=?', id, u.id);
    if (!o) throw new HttpError(404, 'Pedido no encontrado.'); return o;
  };

  const routes = {
    'GET /api/pay/options': async (req, env) => json({ methods: Object.fromEntries(Object.entries(METHODS).map(([c, ms]) => [c, ms.filter((m) => providerFor(env, c, m))])) }),
    'POST /api/pay/start': async (req, env) => {
      const u = await requireUser(req, env), b = await body(req), plan = b.plan, currency = b.currency, method = b.method;
      if (!MONTHS[plan]) throw new HttpError(400, 'Plan no válido.');
      if (!PRICES[currency] || !(METHODS[currency] || []).includes(method)) throw new HttpError(400, 'Moneda o método no válidos.');
      const sub = await getSub(env, u.id);
      if (sub?.stripe_sub && ['active', 'trialing'].includes(sub.status)) throw new HttpError(409, 'Ya tienes una suscripción con tarjeta. Usa «Gestionar plan».');
      const provider = providerFor(env, currency, method);
      if (!provider) throw new HttpError(503, 'Este método de pago todavía no está disponible.');
      const id = crypto.randomUUID(), order = { id, user_id: u.id, plan, currency, method, provider, amount: PRICES[currency][plan] };
      await run(env.DB, 'INSERT INTO orders(id,user_id,plan,currency,method,provider,amount,status,created_at) VALUES(?,?,?,?,?,?,?,?,?)', id, u.id, plan, currency, method, provider, order.amount, 'pending', now());
      const action = provider === 'sim' ? { type: 'sim' } : await PROVIDERS[provider].start(env, order, u);
      return json({ orderId: id, provider, amount: order.amount, currency, action });
    },
    'GET /api/pay/order': async (req, env) => {
      const id = new URL(req.url).searchParams.get('id') || '', o = await mine(req, env, id);
      return json({ id: o.id, status: o.status, plan: o.plan, currency: o.currency, amount: o.amount, method: o.method });
    },
    'POST /api/pay/sim/confirm': async (req, env) => {
      assertSim(env); const o = await mine(req, env, String((await body(req)).orderId || ''));
      if (o.provider !== 'sim') throw new HttpError(400, 'Este pedido no es de demostración.');
      await markPaid(env, o); return json({ ok: true });
    },
  };
  async function webhook(req, env, name) {
    const prov = PROVIDERS[name];
    if (!prov) throw new HttpError(404, 'No encontrado.');
    if (!prov.enabled(env)) throw new HttpError(503, 'Proveedor no configurado.');
    const ev = await prov.parseWebhook(env, req); // debe verificar la autenticidad y lanzar HttpError si no es válida
    const o = await first(env.DB, 'SELECT * FROM orders WHERE provider=? AND provider_ref=?', name, ev.orderRef);
    if (!o) return json({ received: true, unknown: true });
    if (ev.paid) await markPaid(env, o);
    return json({ received: true });
  }
  return { routes, webhook };
}
