/* Biomáster Academy · API (Cloudflare Worker + D1).
   Auth con sesión por cookie HttpOnly, suscripción vía Stripe (Checkout + Customer Portal + webhook),
   progreso del alumno y contenido de aulas protegido por suscripción. */
import { json, HttpError, now, randomHex, sha256Hex, hashPassword, timingSafeEqual, stripe, verifyStripeSignature } from './lib.js';

const PLANS = ['mensual', 'semestral', 'anual'];
const SESSION_TTL = 60 * 60 * 24 * 30;
const EMAIL_RE = /^[^@\s]{1,64}@[^@\s]{1,255}\.[^@\s]{2,}$/;

const priceId = (env, plan) => ({ mensual: env.PRICE_MENSUAL, semestral: env.PRICE_SEMESTRAL, anual: env.PRICE_ANUAL })[plan];
const planFromPrice = (env, id) => PLANS.find((p) => priceId(env, p) && priceId(env, p) === id) || null;
const first = (db, sql, ...args) => db.prepare(sql).bind(...args).first();
const run = (db, sql, ...args) => db.prepare(sql).bind(...args).run();

/* ---------- CORS / CSRF ---------- */
function corsHeaders(req, env) {
  const origin = req.headers.get('origin');
  if (!origin || origin !== env.ALLOWED_ORIGIN) return {};
  return { 'access-control-allow-origin': origin, 'access-control-allow-credentials': 'true', 'access-control-allow-headers': 'content-type,x-requested-with', 'access-control-allow-methods': 'GET,POST,PUT,OPTIONS', vary: 'origin' };
}
function assertCsrf(req, env) {
  const origin = req.headers.get('origin');
  if (origin && origin !== env.ALLOWED_ORIGIN) throw new HttpError(403, 'Origen no permitido.');
  if (req.headers.get('x-requested-with') !== 'biomaster') throw new HttpError(403, 'Solicitud no válida.');
}
async function body(req, max = 65536) {
  const text = await req.text();
  if (text.length > max) throw new HttpError(413, 'Solicitud demasiado grande.');
  try { const v = JSON.parse(text || '{}'); if (v && typeof v === 'object') return v; } catch { /* cae abajo */ }
  throw new HttpError(400, 'JSON no válido.');
}

/* ---------- Sesión ---------- */
function cookieAttrs(env, maxAge) {
  const same = env.COOKIE_SAMESITE === 'None' ? 'None' : 'Lax';
  return `Path=/; HttpOnly; ${env.INSECURE_COOKIES === '1' ? '' : 'Secure; '}SameSite=${same}; Max-Age=${maxAge}`;
}
async function startSession(env, userId) {
  const token = randomHex(32);
  await run(env.DB, 'DELETE FROM sessions WHERE expires_at < ?', now());
  await run(env.DB, 'INSERT INTO sessions(id,user_id,expires_at) VALUES(?,?,?)', await sha256Hex(token), userId, now() + SESSION_TTL);
  return { 'set-cookie': `bio_session=${token}; ${cookieAttrs(env, SESSION_TTL)}` };
}
async function currentUser(req, env) {
  const m = /(?:^|;\s*)bio_session=([a-f0-9]{64})/.exec(req.headers.get('cookie') || '');
  if (!m) return null;
  return first(env.DB, 'SELECT u.id,u.email,u.name FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.id=? AND s.expires_at>?', await sha256Hex(m[1]), now());
}
async function requireUser(req, env) { const u = await currentUser(req, env); if (!u) throw new HttpError(401, 'Inicia sesión para continuar.'); return u; }

async function throttle(env, key, limit, windowSec) {
  const row = await first(env.DB, 'SELECT count,reset_at FROM throttle WHERE key=?', key);
  if (row && row.reset_at > now()) {
    if (row.count >= limit) throw new HttpError(429, 'Demasiados intentos. Inténtalo de nuevo más tarde.');
    await run(env.DB, 'UPDATE throttle SET count=count+1 WHERE key=?', key);
  } else await run(env.DB, 'INSERT INTO throttle(key,count,reset_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=1,reset_at=excluded.reset_at', key, now() + windowSec);
}

/* ---------- Suscripción ---------- */
async function getSub(env, userId) { return first(env.DB, 'SELECT * FROM subscriptions WHERE user_id=?', userId); }
function hasAccess(sub) {
  if (!sub || !['active', 'trialing'].includes(sub.status)) return false;
  if (!sub.stripe_sub && !(sub.current_period_end > now())) return false; // simulador: no hay renovaciones
  return true;
}
function publicSub(sub) {
  if (!sub) return null;
  return { plan: sub.plan, status: sub.status, renews: sub.current_period_end ? sub.current_period_end * 1000 : null, cancelAtPeriodEnd: !!sub.cancel_at_period_end, brand: sub.card_brand, last4: sub.card_last4, simulated: !sub.stripe_sub };
}
async function saveSub(env, userId, f) {
  const cols = ['plan', 'status', 'stripe_customer', 'stripe_sub', 'current_period_end', 'cancel_at_period_end', 'card_brand', 'card_last4'].filter((c) => f[c] !== undefined);
  const vals = cols.map((c) => f[c]);
  await run(env.DB, `INSERT INTO subscriptions(user_id,${cols.join(',')},updated_at) VALUES(?,${cols.map(() => '?').join(',')},?)
    ON CONFLICT(user_id) DO UPDATE SET ${cols.map((c) => `${c}=excluded.${c}`).join(',')},updated_at=excluded.updated_at`, userId, ...vals, now());
}
function fromStripeSub(env, s) {
  const item = s.items?.data?.[0];
  return { plan: planFromPrice(env, item?.price?.id), status: s.status === 'canceled' ? 'canceled' : s.status, stripe_customer: s.customer, stripe_sub: s.id,
    current_period_end: s.current_period_end ?? item?.current_period_end ?? null, cancel_at_period_end: s.cancel_at_period_end ? 1 : 0 };
}

/* ---------- Progreso (sanea la entrada) ---------- */
function cleanProgress(d) {
  const out = { done: {}, pins: [], notes: [], open: '' };
  for (const k of Object.keys(d.done || {}).slice(0, 400)) if (/^m\d{1,2}-\d{1,3}$/.test(k) && d.done[k]) out.done[k] = true;
  out.pins = (Array.isArray(d.pins) ? d.pins : []).filter((p) => typeof p === 'string' && /^[am]\d{1,2}$/.test(p)).slice(0, 100);
  out.notes = (Array.isArray(d.notes) ? d.notes : []).slice(0, 200).filter((n) => n && typeof n.t === 'string').map((n) => ({ t: n.t.slice(0, 120), u: typeof n.u === 'string' ? n.u.slice(0, 300) : '' }));
  out.open = typeof d.open === 'string' && /^m\d{1,2}$/.test(d.open) ? d.open : '';
  return out;
}

/* ---------- Rutas ---------- */
const routes = {
  'GET /api/health': async () => json({ ok: true }),
  'GET /api/config': async (req, env) => json({ stripe: !!env.STRIPE_SECRET_KEY, sim: env.SIM_MODE === 'true' && !env.STRIPE_SECRET_KEY, plans: PLANS }),

  'POST /api/auth/register': async (req, env) => {
    const b = await body(req);
    const email = String(b.email || '').trim().toLowerCase(), password = String(b.password || ''), name = String(b.name || '').trim().slice(0, 80);
    if (!EMAIL_RE.test(email)) throw new HttpError(400, 'Escribe un correo válido.');
    if (password.length < 8 || password.length > 200) throw new HttpError(400, 'La contraseña debe tener al menos 8 caracteres.');
    await throttle(env, `reg:${req.headers.get('cf-connecting-ip') || 'x'}`, 10, 3600);
    if (await first(env.DB, 'SELECT 1 AS x FROM users WHERE email=?', email)) throw new HttpError(409, 'Ya existe una cuenta con ese correo. Inicia sesión.');
    const { hash, salt } = await hashPassword(password), id = crypto.randomUUID();
    await run(env.DB, 'INSERT INTO users(id,email,name,pw_hash,pw_salt,created_at) VALUES(?,?,?,?,?,?)', id, email, name, hash, salt, now());
    return json({ user: { id, email, name } }, 201, await startSession(env, id));
  },
  'POST /api/auth/login': async (req, env) => {
    const b = await body(req), email = String(b.email || '').trim().toLowerCase(), password = String(b.password || '');
    await throttle(env, `login:${req.headers.get('cf-connecting-ip') || 'x'}:${email}`, 8, 900);
    const u = await first(env.DB, 'SELECT * FROM users WHERE email=?', email);
    const { hash } = await hashPassword(password.slice(0, 200), u ? u.pw_salt : '00'.repeat(16)); // mismo costo exista o no
    if (!u || !timingSafeEqual(hash, u.pw_hash)) throw new HttpError(401, 'Correo o contraseña incorrectos.');
    return json({ user: { id: u.id, email: u.email, name: u.name } }, 200, await startSession(env, u.id));
  },
  'POST /api/auth/logout': async (req, env) => {
    const m = /(?:^|;\s*)bio_session=([a-f0-9]{64})/.exec(req.headers.get('cookie') || '');
    if (m) await run(env.DB, 'DELETE FROM sessions WHERE id=?', await sha256Hex(m[1]));
    return json({ ok: true }, 200, { 'set-cookie': `bio_session=; ${cookieAttrs(env, 0)}` });
  },
  'GET /api/me': async (req, env) => {
    const u = await currentUser(req, env);
    if (!u) return json({ user: null, subscription: null, access: false });
    const sub = await getSub(env, u.id);
    return json({ user: u, subscription: publicSub(sub), access: hasAccess(sub), admin: (env.ADMIN_EMAILS || '').toLowerCase().split(',').map((s) => s.trim()).includes(u.email) });
  },

  'GET /api/progress': async (req, env) => {
    const u = await requireUser(req, env), row = await first(env.DB, 'SELECT data,updated_at FROM progress WHERE user_id=?', u.id);
    return json({ progress: row ? JSON.parse(row.data) : null, updatedAt: row?.updated_at || 0 });
  },
  'PUT /api/progress': async (req, env) => {
    const u = await requireUser(req, env), data = cleanProgress((await body(req, 32768)).progress || {});
    await run(env.DB, 'INSERT INTO progress(user_id,data,updated_at) VALUES(?,?,?) ON CONFLICT(user_id) DO UPDATE SET data=excluded.data,updated_at=excluded.updated_at', u.id, JSON.stringify(data), now());
    return json({ ok: true });
  },

  'GET /api/lessons': async (req, env) => {
    const u = await currentUser(req, env), access = u ? hasAccess(await getSub(env, u.id)) : false;
    const { results } = await env.DB.prepare('SELECT * FROM lessons ORDER BY module,position').all();
    return json({ access, lessons: results.map((l) => ({ id: l.id, module: l.module, position: l.position, title: l.title, duration: l.duration, free: !!l.free, video: l.free || access ? l.video_url : '', locked: !(l.free || access) })) });
  },
  'PUT /api/admin/lessons': async (req, env) => {
    const u = await requireUser(req, env);
    if (!(env.ADMIN_EMAILS || '').toLowerCase().split(',').map((s) => s.trim()).includes(u.email)) throw new HttpError(403, 'Sin permiso.');
    const list = (await body(req, 262144)).lessons;
    if (!Array.isArray(list) || list.length > 300) throw new HttpError(400, 'Lista de aulas no válida.');
    const stmts = list.map((l) => {
      if (!/^m\d{1,2}-\d{1,3}$/.test(l.id) || !/^m\d{1,2}$/.test(l.module)) throw new HttpError(400, `ID no válido: ${l.id}`);
      const video = String(l.video_url || '');
      if (video && !/^https:\/\//i.test(video)) throw new HttpError(400, 'El video debe ser una URL https.');
      return env.DB.prepare(`INSERT INTO lessons(id,module,position,title,duration,video_url,free,updated_at) VALUES(?,?,?,?,?,?,?,?)
        ON CONFLICT(id) DO UPDATE SET module=excluded.module,position=excluded.position,title=excluded.title,duration=excluded.duration,video_url=excluded.video_url,free=excluded.free,updated_at=excluded.updated_at`)
        .bind(l.id, l.module, Number(l.position) || 0, String(l.title || '').slice(0, 160), String(l.duration || '').slice(0, 10), video.slice(0, 500), l.free ? 1 : 0, now());
    });
    if (stmts.length) await env.DB.batch(stmts);
    return json({ ok: true, count: stmts.length });
  },

  'POST /api/checkout': async (req, env) => {
    const u = await requireUser(req, env), plan = (await body(req)).plan;
    if (!PLANS.includes(plan)) throw new HttpError(400, 'Plan no válido.');
    const price = priceId(env, plan); if (!price) throw new HttpError(503, 'Plan no disponible todavía.');
    let sub = await getSub(env, u.id);
    if (hasAccess(sub) && sub.stripe_sub) throw new HttpError(409, 'Ya tienes un plan activo. Usa “Gestionar plan” para cambiarlo.');
    let customer = sub?.stripe_customer;
    if (!customer) { customer = (await stripe(env, 'POST', '/customers', { email: u.email, name: u.name || undefined, metadata: { user_id: u.id } })).id; await saveSub(env, u.id, { stripe_customer: customer, status: sub?.status || 'none' }); }
    const session = await stripe(env, 'POST', '/checkout/sessions', {
      mode: 'subscription', customer, client_reference_id: u.id, line_items: [{ price, quantity: 1 }], allow_promotion_codes: true,
      subscription_data: { metadata: { user_id: u.id, plan } },
      success_url: `${env.SITE_URL}/#inicio`, cancel_url: `${env.SITE_URL}/#planes` });
    return json({ url: session.url });
  },
  'POST /api/portal': async (req, env) => {
    const u = await requireUser(req, env), sub = await getSub(env, u.id);
    if (!sub?.stripe_customer) throw new HttpError(404, 'Aún no tienes una suscripción.');
    const s = await stripe(env, 'POST', '/billing_portal/sessions', { customer: sub.stripe_customer, return_url: `${env.SITE_URL}/#inicio` });
    return json({ url: s.url });
  },

  /* Modo demostración (sin Stripe): conserva el mismo contrato para probar el flujo con cuentas reales */
  'POST /api/sim/subscribe': async (req, env) => {
    if (env.SIM_MODE !== 'true' || env.STRIPE_SECRET_KEY) throw new HttpError(404, 'No encontrado.');
    const u = await requireUser(req, env), b = await body(req);
    if (!PLANS.includes(b.plan)) throw new HttpError(400, 'Plan no válido.');
    const months = { mensual: 1, semestral: 6, anual: 12 }[b.plan], end = new Date(); end.setMonth(end.getMonth() + months);
    await saveSub(env, u.id, { plan: b.plan, status: 'active', stripe_sub: null, current_period_end: Math.floor(end / 1000), cancel_at_period_end: 0,
      card_brand: String(b.brand || '').slice(0, 12), card_last4: /^\d{4}$/.test(b.last4) ? b.last4 : null });
    return json({ ok: true });
  },
  'POST /api/sim/cancel': async (req, env) => simToggle(req, env, 1),
  'POST /api/sim/reactivate': async (req, env) => simToggle(req, env, 0),
  'POST /api/sim/reset': async (req, env) => {
    if (env.SIM_MODE !== 'true' || env.STRIPE_SECRET_KEY) throw new HttpError(404, 'No encontrado.');
    const u = await requireUser(req, env); await run(env.DB, 'DELETE FROM subscriptions WHERE user_id=? AND stripe_sub IS NULL', u.id); return json({ ok: true });
  },
};
async function simToggle(req, env, v) {
  if (env.SIM_MODE !== 'true' || env.STRIPE_SECRET_KEY) throw new HttpError(404, 'No encontrado.');
  const u = await requireUser(req, env), sub = await getSub(env, u.id);
  if (!sub || sub.stripe_sub) throw new HttpError(404, 'Sin suscripción simulada.');
  await saveSub(env, u.id, { cancel_at_period_end: v }); return json({ ok: true });
}

/* ---------- Webhook de Stripe ---------- */
async function webhook(req, env) {
  const raw = await req.text();
  if (!(await verifyStripeSignature(raw, req.headers.get('stripe-signature'), env.STRIPE_WEBHOOK_SECRET))) throw new HttpError(400, 'Firma no válida.');
  const ev = JSON.parse(raw);
  if (await first(env.DB, 'SELECT 1 AS x FROM stripe_events WHERE id=?', ev.id)) return json({ received: true, duplicate: true });
  const obj = ev.data.object;
  const userFor = async (o) => o.metadata?.user_id || o.client_reference_id || (await first(env.DB, 'SELECT user_id FROM subscriptions WHERE stripe_customer=?', o.customer))?.user_id;
  if (ev.type === 'checkout.session.completed' && obj.mode === 'subscription' && obj.subscription) {
    const uid = await userFor(obj);
    if (uid) await saveSub(env, uid, fromStripeSub(env, await stripe(env, 'GET', `/subscriptions/${obj.subscription}`)));
  } else if (['customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted'].includes(ev.type)) {
    const uid = await userFor(obj);
    if (uid) await saveSub(env, uid, { ...fromStripeSub(env, obj), ...(ev.type.endsWith('deleted') ? { status: 'canceled' } : {}) });
  }
  await run(env.DB, 'INSERT OR IGNORE INTO stripe_events(id,received_at) VALUES(?,?)', ev.id, now());
  return json({ received: true });
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url), cors = corsHeaders(req, env);
    try {
      if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
      let res;
      if (url.pathname === '/api/stripe/webhook' && req.method === 'POST') res = await webhook(req, env);
      else {
        const h = routes[`${req.method} ${url.pathname}`];
        if (!h) throw new HttpError(404, 'No encontrado.');
        if (req.method !== 'GET') assertCsrf(req, env);
        res = await h(req, env);
      }
      for (const [k, v] of Object.entries(cors)) res.headers.set(k, v);
      return res;
    } catch (e) {
      if (!(e instanceof HttpError)) console.error('error', e?.stack || e);
      return json({ error: e instanceof HttpError ? e.message : 'Error interno.' }, e instanceof HttpError ? e.status : 500, cors);
    }
  },
};
