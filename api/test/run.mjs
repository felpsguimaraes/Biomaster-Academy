import assert from 'node:assert/strict';
import { makeDB } from './d1shim.mjs';
import api from '../src/index.js';
import { hmacHex } from '../src/lib.js';

const ORIGIN = 'https://site.test';
const baseEnv = () => ({ DB: makeDB(), SITE_URL: ORIGIN, ALLOWED_ORIGIN: ORIGIN, SIM_MODE: 'false', ADMIN_EMAILS: 'prof@x.com', INSECURE_COOKIES: '0' });
const call = (env, method, path, { body, cookie, headers = {}, csrf = true, origin = ORIGIN } = {}) =>
  api.fetch(new Request('https://api.test' + path, { method, headers: { ...(body !== undefined ? { 'content-type': 'application/json' } : {}), ...(csrf && method !== 'GET' ? { 'x-requested-with': 'biomaster' } : {}), ...(origin ? { origin } : {}), ...(cookie ? { cookie } : {}), ...headers }, body: body !== undefined ? JSON.stringify(body) : undefined }), env);
const j = async (r) => r.json();
const cookieOf = (r) => /bio_session=[a-f0-9]{64}/.exec(r.headers.get('set-cookie') || '')?.[0];
let n = 0; const ok = (m) => console.log(`  ✓ ${++n}. ${m}`);

/* ---- Auth ---- */
{ const env = baseEnv();
  let r = await call(env, 'POST', '/api/auth/register', { body: { email: 'Ana@Mail.com', password: 'secreto123', name: 'Ana' } });
  assert.equal(r.status, 201); const ck = cookieOf(r); assert.ok(ck);
  const sc = r.headers.get('set-cookie'); assert.match(sc, /HttpOnly/); assert.match(sc, /Secure/); assert.match(sc, /SameSite=Lax/); ok('registro crea sesión con cookie HttpOnly+Secure+Lax');
  const me = await j(await call(env, 'GET', '/api/me', { cookie: ck })); assert.equal(me.user.email, 'ana@mail.com'); assert.equal(me.access, false); ok('/api/me normaliza el correo y access=false sin plan');
  assert.equal((await j(await call(env, 'GET', '/api/me'))).user, null); ok('/api/me sin cookie → user null');
  assert.equal((await call(env, 'POST', '/api/auth/register', { body: { email: 'ana@mail.com', password: 'otra12345' } })).status, 409); ok('correo duplicado → 409');
  assert.equal((await call(env, 'POST', '/api/auth/register', { body: { email: 'b@mail.com', password: '123' } })).status, 400); ok('contraseña corta → 400');
  assert.equal((await call(env, 'POST', '/api/auth/register', { body: { email: 'malo', password: 'secreto123' } })).status, 400); ok('correo inválido → 400');
  assert.equal((await call(env, 'POST', '/api/auth/login', { body: { email: 'ana@mail.com', password: 'secreto123' }, csrf: false })).status, 403); ok('CSRF: sin X-Requested-With → 403');
  assert.equal((await call(env, 'POST', '/api/auth/login', { body: { email: 'ana@mail.com', password: 'secreto123' }, origin: 'https://evil.test' })).status, 403); ok('CSRF: origen ajeno → 403');
  r = await call(env, 'POST', '/api/auth/login', { body: { email: 'ana@mail.com', password: 'mala' } }); assert.equal(r.status, 401); assert.equal((await j(r)).error, 'Correo o contraseña incorrectos.'); ok('contraseña incorrecta → 401');
  r = await call(env, 'POST', '/api/auth/login', { body: { email: 'nadie@mail.com', password: 'mala' } }); assert.equal(r.status, 401); ok('usuario inexistente → mismo 401');
  for (let i = 0; i < 8; i++) await call(env, 'POST', '/api/auth/login', { body: { email: 'ana@mail.com', password: 'x' + i } });
  assert.equal((await call(env, 'POST', '/api/auth/login', { body: { email: 'ana@mail.com', password: 'secreto123' } })).status, 429); ok('límite de intentos → 429');
  const env2 = baseEnv(); await call(env2, 'POST', '/api/auth/register', { body: { email: 'ana@mail.com', password: 'secreto123' } });
  r = await call(env2, 'POST', '/api/auth/login', { body: { email: 'ana@mail.com', password: 'secreto123' } }); assert.equal(r.status, 200); const c2 = cookieOf(r);
  await call(env2, 'POST', '/api/auth/logout', { cookie: c2 }); assert.equal((await j(await call(env2, 'GET', '/api/me', { cookie: c2 }))).user, null); ok('login correcto y logout invalida la sesión');
  const h = await env2.DB.prepare('SELECT pw_hash,pw_salt FROM users').first(); assert.ok(h.pw_hash.length === 64 && !h.pw_hash.includes('secreto')); ok('contraseña guardada como hash PBKDF2 con sal');
}
/* ---- Progreso y aulas ---- */
{ const env = { ...baseEnv(), SIM_MODE: 'true' };
  const reg = async (email) => cookieOf(await call(env, 'POST', '/api/auth/register', { body: { email, password: 'secreto123' } }));
  const ana = await reg('ana@x.com'), prof = await reg('prof@x.com');
  assert.equal((await call(env, 'GET', '/api/progress')).status, 401); ok('progreso exige sesión');
  await call(env, 'PUT', '/api/progress', { cookie: ana, body: { progress: { done: { 'm6-1': true, '<script>': true }, pins: ['m6', 'x<y'], notes: [{ t: 'nota', u: 'https://a.b' }], open: 'm6' } } });
  const p = (await j(await call(env, 'GET', '/api/progress', { cookie: ana }))).progress; assert.deepEqual(p.done, { 'm6-1': true }); assert.deepEqual(p.pins, ['m6']); ok('progreso se guarda saneado (claves/ids inválidos descartados)');
  assert.equal((await call(env, 'PUT', '/api/admin/lessons', { cookie: ana, body: { lessons: [] } })).status, 403); ok('editar aulas: no-admin → 403');
  assert.equal((await call(env, 'PUT', '/api/admin/lessons', { cookie: prof, body: { lessons: [{ id: 'm6-1', module: 'm6', video_url: 'http://inseguro' }] } })).status, 400); ok('video no-https rechazado');
  let r = await call(env, 'PUT', '/api/admin/lessons', { cookie: prof, body: { lessons: [{ id: 'm0-1', module: 'm0', position: 1, title: 'Bienvenida', duration: '01:09', video_url: 'https://v.test/0.mp4', free: true }, { id: 'm6-1', module: 'm6', position: 1, title: 'Intro Metabolismo I', duration: '11:32', video_url: 'https://v.test/1.mp4' }] } }); assert.equal(r.status, 200);
  let L = await j(await call(env, 'GET', '/api/lessons', { cookie: ana })); assert.equal(L.access, false);
  assert.equal(L.lessons.find((l) => l.id === 'm0-1').video, 'https://v.test/0.mp4'); assert.equal(L.lessons.find((l) => l.id === 'm6-1').video, ''); ok('sin plan: aula gratis visible, aula de pago sin URL de video');
  assert.equal((await call(env, 'POST', '/api/sim/subscribe', { cookie: ana, body: { plan: 'oro' } })).status, 400); 
  assert.equal((await call(env, 'POST', '/api/sim/subscribe', { cookie: ana, body: { plan: 'semestral', brand: 'VISA', last4: '4242' } })).status, 200);
  L = await j(await call(env, 'GET', '/api/lessons', { cookie: ana })); assert.equal(L.access, true); assert.equal(L.lessons.find((l) => l.id === 'm6-1').video, 'https://v.test/1.mp4'); ok('modo demo: suscribir desbloquea las aulas');
  const me = await j(await call(env, 'GET', '/api/me', { cookie: ana })); assert.equal(me.subscription.plan, 'semestral'); assert.equal(me.subscription.simulated, true); assert.ok(me.subscription.renews > Date.now());
  await call(env, 'POST', '/api/sim/cancel', { cookie: ana }); assert.equal((await j(await call(env, 'GET', '/api/me', { cookie: ana }))).subscription.cancelAtPeriodEnd, true);
  await call(env, 'POST', '/api/sim/reactivate', { cookie: ana }); assert.equal((await j(await call(env, 'GET', '/api/me', { cookie: ana }))).subscription.cancelAtPeriodEnd, false); ok('cancelar / reactivar suscripción demo');
  await env.DB.prepare('UPDATE subscriptions SET current_period_end=1 WHERE 1=1').run(); assert.equal((await j(await call(env, 'GET', '/api/me', { cookie: ana }))).access, false); ok('suscripción demo vencida pierde acceso');
  assert.equal((await call({ ...env, SIM_MODE: 'false' }, 'POST', '/api/sim/subscribe', { cookie: ana, body: { plan: 'mensual' } })).status, 404); ok('endpoints demo apagados fuera de SIM_MODE');
}
/* ---- Stripe ---- */
{ const env = { ...baseEnv(), STRIPE_SECRET_KEY: 'sk_test_x', STRIPE_WEBHOOK_SECRET: 'whsec_test', PRICE_MENSUAL: 'price_m', PRICE_SEMESTRAL: 'price_s', PRICE_ANUAL: 'price_a', SIM_MODE: 'true' };
  const calls = []; const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => { const u = String(url); calls.push({ u, method: init.method, body: init.body, auth: init.headers.authorization });
    const out = u.endsWith('/customers') ? { id: 'cus_1' } : u.endsWith('/checkout/sessions') ? { url: 'https://checkout.stripe.com/c/pay/cs_test_1' } : u.endsWith('/billing_portal/sessions') ? { url: 'https://billing.stripe.com/p/session/x' }
      : u.includes('/subscriptions/sub_1') ? { id: 'sub_1', customer: 'cus_1', status: 'active', cancel_at_period_end: false, current_period_end: Math.floor(Date.now() / 1000) + 86400 * 30, items: { data: [{ price: { id: 'price_s' } }] } } : {};
    return new Response(JSON.stringify(out), { status: 200 }); };
  const ck = cookieOf(await call(env, 'POST', '/api/auth/register', { body: { email: 'ana@x.com', password: 'secreto123', name: 'Ana' } }));
  assert.deepEqual(await j(await call(env, 'GET', '/api/config')), { stripe: true, sim: false, plans: ['mensual', 'semestral', 'anual'] }); ok('config: Stripe activo apaga el modo demo');
  assert.equal((await call(env, 'POST', '/api/sim/subscribe', { cookie: ck, body: { plan: 'mensual' } })).status, 404); ok('con Stripe configurado el modo demo no existe');
  assert.equal((await call(env, 'POST', '/api/checkout', { body: { plan: 'mensual' } })).status, 401); ok('checkout exige sesión');
  assert.equal((await call(env, 'POST', '/api/checkout', { cookie: ck, body: { plan: 'platino' } })).status, 400);
  let r = await call(env, 'POST', '/api/checkout', { cookie: ck, body: { plan: 'semestral' } }); assert.equal((await j(r)).url, 'https://checkout.stripe.com/c/pay/cs_test_1');
  const sess = calls.find((c) => c.u.endsWith('/checkout/sessions')); assert.equal(sess.auth, 'Bearer sk_test_x'); assert.match(decodeURIComponent(sess.body), /line_items\[0\]\[price\]=price_s/); assert.match(decodeURIComponent(sess.body), /mode=subscription/); assert.match(decodeURIComponent(sess.body), /subscription_data\[metadata\]\[user_id\]=/); ok('checkout crea cliente + Checkout Session con el price correcto');
  const uid = (await env.DB.prepare('SELECT id FROM users').first()).id;
  const send = async (ev, { secret = 'whsec_test', ts = Math.floor(Date.now() / 1000), tamper = false } = {}) => { const raw = JSON.stringify(ev); const sig = await hmacHex(secret, `${ts}.${raw}`);
    return api.fetch(new Request('https://api.test/api/stripe/webhook', { method: 'POST', headers: { 'stripe-signature': `t=${ts},v1=${sig}` }, body: tamper ? raw + ' ' : raw }), env); };
  const subEv = (id, type, extra = {}) => ({ id, type, data: { object: { id: 'sub_1', customer: 'cus_1', status: 'active', cancel_at_period_end: false, current_period_end: Math.floor(Date.now() / 1000) + 86400 * 30, metadata: { user_id: uid }, items: { data: [{ price: { id: 'price_s' } }] }, ...extra } } });
  assert.equal((await send(subEv('evt_0', 'customer.subscription.created'), { secret: 'otro' })).status, 400); ok('webhook con firma falsa → 400');
  assert.equal((await send(subEv('evt_0', 'customer.subscription.created'), { tamper: true })).status, 400); ok('webhook con cuerpo alterado → 400');
  assert.equal((await send(subEv('evt_0', 'customer.subscription.created'), { ts: 1000 })).status, 400); ok('webhook con marca de tiempo vieja (replay) → 400');
  assert.equal((await send({ id: 'evt_1', type: 'checkout.session.completed', data: { object: { mode: 'subscription', subscription: 'sub_1', customer: 'cus_1', client_reference_id: uid } } })).status, 200);
  let me = await j(await call(env, 'GET', '/api/me', { cookie: ck })); assert.equal(me.access, true); assert.equal(me.subscription.plan, 'semestral'); assert.equal(me.subscription.simulated, false); ok('checkout.session.completed activa la suscripción (plan por price id)');
  assert.equal((await j(await send({ id: 'evt_1', type: 'checkout.session.completed', data: { object: {} } }))).duplicate, true); ok('evento repetido es idempotente');
  assert.equal((await call(env, 'POST', '/api/checkout', { cookie: ck, body: { plan: 'anual' } })).status, 409); ok('no permite segundo checkout con plan activo');
  await send(subEv('evt_2', 'customer.subscription.updated', { cancel_at_period_end: true })); me = await j(await call(env, 'GET', '/api/me', { cookie: ck })); assert.equal(me.subscription.cancelAtPeriodEnd, true); assert.equal(me.access, true); ok('cancelación al fin del periodo mantiene acceso');
  await send(subEv('evt_3', 'customer.subscription.updated', { status: 'past_due' })); assert.equal((await j(await call(env, 'GET', '/api/me', { cookie: ck }))).access, false); ok('pago fallido (past_due) quita acceso');
  await send(subEv('evt_4', 'customer.subscription.updated', { status: 'active', metadata: {} })); assert.equal((await j(await call(env, 'GET', '/api/me', { cookie: ck }))).access, true); ok('usuario resuelto por stripe_customer cuando falta metadata');
  await send(subEv('evt_5', 'customer.subscription.deleted')); me = await j(await call(env, 'GET', '/api/me', { cookie: ck })); assert.equal(me.access, false); assert.equal(me.subscription.status, 'canceled'); ok('suscripción eliminada → sin acceso');
  r = await call(env, 'POST', '/api/portal', { cookie: ck }); assert.match((await j(r)).url, /billing\.stripe\.com/); ok('portal de cobro devuelve URL de Stripe');
  globalThis.fetch = realFetch;
}
console.log(`\n${n} pruebas OK`);
