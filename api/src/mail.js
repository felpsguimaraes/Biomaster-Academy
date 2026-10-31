/* E-mails transaccionales vía Resend (REST). Sin RESEND_API_KEY no se envía nada (solo log si MAIL_DEBUG=1). */
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const shell = (title, body) => `<!doctype html><html><body style="margin:0;background:#f6f9ff;font-family:Inter,Arial,sans-serif;color:#16213a"><div style="max-width:520px;margin:0 auto;padding:28px 18px">
<div style="font:800 18px Poppins,Arial,sans-serif;letter-spacing:.05em;color:#1f2f4a;margin-bottom:18px">BIOMÁSTER <span style="color:#4f74ad;font-weight:600;letter-spacing:.3em;font-size:11px">ACADEMY</span></div>
<div style="background:#fff;border:1px solid #dbe5f5;border-radius:18px;padding:26px"><h1 style="font:700 21px Poppins,Arial,sans-serif;margin:0 0 12px;color:#1f2f4a">${esc(title)}</h1>${body}</div>
<p style="font-size:12px;color:#6b7a94;margin-top:16px">Si no esperabas este mensaje, puedes ignorarlo.</p></div></body></html>`;
const btn = (href, label) => `<p style="margin:22px 0"><a href="${esc(href)}" style="background:#e8cd8c;color:#3b2d08;text-decoration:none;font-weight:700;padding:13px 24px;border-radius:99px;display:inline-block">${esc(label)}</a></p>`;

export function welcomeEmail(env, user) {
  const name = esc(user.name || '');
  return { subject: '¡Bienvenido/a a Biomáster Academy!', html: shell(`¡Hola${name ? ' ' + name : ''}!`,
    `<p>Tu cuenta está lista. Ya puedes entrar al panel y empezar con la clase de bienvenida de la Bioq. Andrea López.</p>${btn(`${env.SITE_URL}/#inicio`, 'Entrar al panel')}<p style="color:#56637f">La Bioquímica no se memoriza, ¡se domina!</p>`) };
}
export function resetEmail(env, link) {
  return { subject: 'Restablece tu contraseña · Biomáster Academy', html: shell('Restablece tu contraseña',
    `<p>Recibimos una solicitud para cambiar tu contraseña. El enlace es válido por <b>1 hora</b> y solo se puede usar una vez.</p>${btn(link, 'Crear nueva contraseña')}`) };
}
export async function sendEmail(env, to, { subject, html }) {
  if (!env.RESEND_API_KEY) { if (env.MAIL_DEBUG === '1') console.log('[mail:debug]', to, subject, html.match(/href="([^"]+)"/)?.[1] || ''); return false; }
  try {
    const res = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: env.MAIL_FROM || 'Biomáster Academy <onboarding@resend.dev>', to: [to], subject, html }) });
    if (!res.ok) console.error('mail error', res.status);
    return res.ok;
  } catch (e) { console.error('mail fail', e?.message); return false; }
}
