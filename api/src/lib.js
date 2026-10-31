/* Utilidades: respostas, criptografia (WebCrypto) e Stripe (REST + webhook). Sem dependências. */
const enc = new TextEncoder();
export const now = () => Math.floor(Date.now() / 1000);

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });
}
export class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }

const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const unhex = (s) => new Uint8Array(s.match(/../g).map((h) => parseInt(h, 16)));
export function randomHex(bytes = 32) { return hex(crypto.getRandomValues(new Uint8Array(bytes))); }
export async function sha256Hex(text) { return hex(await crypto.subtle.digest('SHA-256', enc.encode(text))); }

export function timingSafeEqual(a, b) {
  const x = typeof a === 'string' ? enc.encode(a) : a, y = typeof b === 'string' ? enc.encode(b) : b;
  let d = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) d |= (x[i] || 0) ^ (y[i] || 0);
  return d === 0;
}
/* PBKDF2-SHA256, 100.000 iteraciones (máximo que permite Workers) */
export async function hashPassword(password, saltHex = randomHex(16)) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: unhex(saltHex), iterations: 100000 }, key, 256);
  return { hash: hex(bits), salt: saltHex };
}
export async function hmacHex(secret, message) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, enc.encode(message)));
}

/* Stripe: codificación de formulario con corchetes anidados */
export function form(obj, prefix = '', out = []) {
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (Array.isArray(v)) v.forEach((item, i) => (typeof item === 'object' ? form(item, `${key}[${i}]`, out) : out.push(`${encodeURIComponent(`${key}[${i}]`)}=${encodeURIComponent(item)}`)));
    else if (typeof v === 'object') form(v, key, out);
    else out.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
  }
  return out.join('&');
}
export async function stripe(env, method, path, body) {
  if (!env.STRIPE_SECRET_KEY) throw new HttpError(503, 'Stripe no está configurado.');
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method, headers: { authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, 'content-type': 'application/x-www-form-urlencoded' },
    body: body ? form(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) { console.error('stripe error', res.status, data?.error?.message); throw new HttpError(502, 'Error al comunicarse con el proveedor de pagos.'); }
  return data;
}
/* Verifica Stripe-Signature: t=timestamp,v1=hmac(secret, `${t}.${raw}`) con tolerancia de 5 min */
export async function verifyStripeSignature(raw, header, secret, tolerance = 300) {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(header.split(',').map((p) => p.split('=')).filter((p) => p.length === 2));
  const t = Number(parts.t); if (!t || Math.abs(now() - t) > tolerance) return false;
  const sigs = header.split(',').filter((p) => p.startsWith('v1=')).map((p) => p.slice(3));
  const expected = await hmacHex(secret, `${t}.${raw}`);
  return sigs.some((s) => timingSafeEqual(s, expected));
}
