"""Genera propuesta-comercial.html con los escenarios calculados. Editar SUPUESTOS y volver a ejecutar:  python3 proposta/build.py"""
import math, html, pathlib
from model import *
import html, pathlib
rows = ""
for n in ESCENARIOS:
    r = n * ARPU; i = infra(n); sav = r * (FEE_HOTMART - FEE_GW); a = sav - i["total"] - A_MES; b = sav - i["total"]; c = sav - i["total"] - C_PCT * r
    rows += f"<tr><td><b>{n}</b></td><td>{usd(r)}</td><td>{usd(i['total'])}</td><td>{usd(r*FEE_HOTMART)}</td><td>{usd(r*FEE_GW)}</td><td>{usd(sav)}</td><td class='{'neg' if a<0 else 'pos'}'>{usd(a)}</td><td class='pos'>{usd(b)}</td><td class='pos'>{usd(c)}</td></tr>"
BE = next(n for n in range(10, 3000) if n * ARPU * (FEE_HOTMART - FEE_GW) - infra(n)["total"] - A_MES >= 0)
LOGO = "../site/assets/logo-coruja.png"; OWL = "../site/assets/coruja-alas.png"; PANEL = "../site/assets/panel-inicio.jpg"

def table(head, rows_, cls=""):
    h = "".join(f"<th>{x}</th>" for x in head)
    b = "".join("<tr>" + "".join(f"<td>{c}</td>" for c in r) + "</tr>" for r in rows_)
    return f"<table class='t {cls}'><thead><tr>{h}</tr></thead><tbody>{b}</tbody></table>"

OK, PROTO, TODO = "<span class='b ok'>✅ Listo</span>", "<span class='b pr'>🟡 Prototipo</span>", "<span class='b td'>⏳ Pendiente</span>"
estado = table(["Área", "Función", "Estado", "Comentario"], [
 ["Alumnos", "Sitio de ventas con experiencia 3D, planes y preguntas frecuentes", OK, "Falta el archivo del video de presentación y el nuevo video corto de bienvenida."],
 ["Alumnos", "Panel: Inicio, Mi curso (progreso por aula), Fijados y notas, buscador", OK, "Progreso sincronizado en la nube al iniciar sesión."],
 ["Alumnos", "Temario de 17 módulos + «Empieza por aquí»", OK, "Contenido grabado hoy: bienvenida + 4 aulas del módulo 06. El resto se publica a medida que se graba."],
 ["Alumnos", "Reproductor de aulas protegido por plan (aula gratis visible, el resto con candado)", OK, "Requiere alojar los videos (ver costos). El enlace puede copiarse: para protección fuerte usar video con URL temporal."],
 ["Alumnos", "Repaso: flashcards, rutas metabólicas, repaso de 10 min", PROTO, "Pantalla lista; falta cargar el contenido y la lógica de repetición espaciada."],
 ["Alumnos", "Banco de preguntas y Desafíos con corrección", PROTO, "Pantalla lista; falta el motor de preguntas, corrección y puntaje."],
 ["Alumnos", "Material premium (PDF Ciclo de Krebs)", PROTO, "Falta descarga protegida con marca de agua; la profesora enviará el PDF actualizado."],
 ["Negocio", "Registro, inicio de sesión, recuperación de contraseña, correo de bienvenida", OK, "El correo requiere cuenta en Resend con dominio verificado."],
 ["Negocio", "3 planes (mensual, semestral, anual) y «Gestionar plan»", OK, "Precios a confirmar por la profesora."],
 ["Negocio", "Cobro con tarjeta (Stripe) con webhook y portal de cobranza", PROTO, "Código probado con simulador y 55 pruebas automáticas; <b>depende de que Stripe atienda a la titular</b> (ver sección 4)."],
 ["Negocio", "PIX, guaraníes (PYG) y otros medios locales", TODO, "Requiere integrar un proveedor adicional (ver sección 4): ~20–40 h por proveedor."],
 ["Profesora", "Panel: resumen de ventas, gestión de aulas por módulo, lista de alumnos y exportación CSV", OK, "Un módulo con aulas guardadas se publica solo."],
 ["Seguridad", "HTTPS, contraseñas con hash, protección CSRF, límite de intentos, administración verificada", OK, "Validado en el entorno real de Cloudflare."],
 ["Legal", "Términos, Política de Privacidad y Contrato", PROTO, "Borradores en <code>proposta/legal/</code>; requieren revisión de abogado."],
])
infra_tbl = table(["Concepto", "Servicio sugerido", "Costo", "Estado de la cifra"], [
 ["Servidor de la API", "Cloudflare Workers", "Gratis para empezar · <b>USD 5/mes</b> plan Paid (recomendado en producción)", "Verificado en búsqueda sobre documentación de Cloudflare"],
 ["Base de datos", "Cloudflare D1", "Incluida: gratis hasta 5 M lecturas y 100 mil escrituras por día y 5 GB; en Paid, 25 mil M lecturas y 50 M escrituras al mes incluidas; excedente USD 0,75/GB-mes", "Verificado (docs Cloudflare vía búsqueda)"],
 ["Sitio web (archivos)", "Cloudflare Pages / Workers assets", "Sin costo relevante a esta escala", "Confirmar límites vigentes"],
 ["Dominio", ".com (o .com.py)", "≈ USD 10–15/año (.com)", "Estimación, no verificada"],
 ["Correos del sistema", "Resend", "Gratis hasta 3.000/mes (máx. 100/día) · Pro USD 20/mes (50.000)", "Terceros; confirmar en resend.com/pricing"],
 ["Video de las aulas", "Cloudflare Stream", "USD 5 por 1.000 min almacenados + USD 1 por 1.000 min reproducidos (sin costo de ancho de banda aparte)", "Documentación oficial vía búsqueda; alternativa: Bunny Stream (por GB, más económico con mucho tráfico)"],
 ["Comisión de cobro", "Ver sección 4", "Hotmart ≈ 9,9% + USD 0,50 por venta · pasarelas propias ≈ 2–5% según medio", "Fuentes secundarias: <b>confirmar con cada proveedor</b>"],
 ["Legal / contabilidad", "Abogado + contador", "A definir", "—"],
])
pagos = table(["Proveedor", "PIX", "USD", "PYG", "Cobro recurrente", "Notas"], [
 ["<b>Hotmart</b> (actual)", "Verificar para compradores en Brasil", "Checkout internacional con tarjeta", "No confirmado", "Sí (suscripciones)", "Ya operativo. ≈ 9,9% + USD 0,50 (fuente secundaria). Ofrece 20+ medios; detalle por país a confirmar con soporte."],
 ["<b>dLocal</b>", "Sí (proveedor de PIX)", "Liquida en USD", "Sí (Paraguay)", "Sí vía integradores", "Más orientado a empresas; tarifas a medida (una fuente cita 0,99%–7,99% en dLocal Go). Es el candidato «todo en uno»; verificar acceso para un vendedor pequeño."],
 ["<b>EBANX</b>", "Sí (Brasil)", "A confirmar", "Tarjetas en PYG (sin otros medios locales)", "A confirmar", "Una integración cubre Brasil y Paraguay; sin tarifas públicas."],
 ["<b>Bancard</b> (Paraguay)", "<b>Sí</b>: el cliente paga en reales y el comercio recibe en guaraníes en 48 h (documentado)", "Dólares según contrato", "<b>Sí</b>", "Parcial (a confirmar)", "Requiere comercio en Paraguay."],
 ["<b>Pagopar / upay</b> (Paraguay)", "QR Pix (≈ 2,9% según blog)", "—", "<b>Sí</b>", "<b>Sí</b>, con reintentos", "≈ 2% débito, 3% crédito (blog; confirmar). Requiere comercio en Paraguay."],
 ["<b>Stripe</b>", "Pix para negocios brasileños (verificar)", "<b>Sí</b>", "No", "<b>Sí</b>", "Fuentes secundarias indican que <b>no abre cuentas con domicilio en Paraguay</b>; confirmar en stripe.com/global. Código de la plataforma ya listo."],
], "wide")


def pct1(x): return str(round(x*100, 1)).rstrip("0").rstrip(".").replace(".", ",")
def n_es(x): return f"{x:,}".replace(",", ".")
fiscal_rows = ""
for n in ESCENARIOS_PY:
    for lab, v in ((f"Hotmart ≈ {int(FEE_HOTMART*100)}%", FEE_HOTMART), (f"Pasarela propia ≈ {pct1(FEE_GW)}%", FEE_GW)):
        a_ = py_flow(n, v, False); b_ = py_flow(n, v, True)
        fiscal_rows += f"<tr><td><b>{n}</b></td><td>{lab}</td><td>{a_['regimen']}</td><td>{usd(a_['ire']+a_['iva'])}</td><td class='pos'>{usd(a_['neto'])} <small>({a_['neto']/a_['r']*100:.0f}%)</small></td><td>{usd(b_['ire']+b_['iva']+b_['idu'])}</td><td class='pos'>{usd(b_['neto'])} <small>({b_['neto']/b_['r']*100:.0f}%)</small></td><td class='neg'>{usd(a_['neto']-b_['neto'])}</td></tr>"
fiscal_tbl = f"<div class='scroll'><table class='t wide'><thead><tr><th>Alumnos pagos</th><th>Cobro</th><th>Régimen sin empresa</th><th>Impuestos A</th><th>Neto/mes · A Sin empresa</th><th>Impuestos B</th><th>Neto/mes · B Con empresa (retirando todo)</th><th>A − B</th></tr></thead><tbody>{fiscal_rows}</tbody></table></div>"
requis = table(["", "A · Sin empresa (persona física con RUC)", "B · Con empresa (EAS)"], [
 ["Para empezar", "Inmediato. El RUC de persona física es gratuito y en línea con la cédula (DNIT).", f"EAS: trámite en línea (SUACE), ≈ 3–8 días hábiles y ≈ {usd(EAS_COSTO)} en la práctica (SA/SRL ≈ USD 2.000–2.500). Luego RUC de la empresa y cuenta bancaria."],
 ["Impuestos", f"Hasta Gs 80 millones al año (≈ {usd(RESIMPLE_LIMITE_GS/FX_PYG)} ≈ {LIMITE_RESIMPLE_ALUMNOS} alumnos pagos): <b>IRE RESIMPLE</b>, cuota fija Gs 20.000–80.000 (si la actividad califica). Por encima: IRE 10% sobre utilidad + IVA 10%. Si se clasifica como servicio personal: IRP 8–10%.", "IRE 10% sobre la utilidad + IVA 10% + <b>IDU 8%</b> cuando retiras utilidades (15% si el socio no es residente). Las utilidades que dejas en la empresa no pagan IDU."],
 ["Costos fijos", f"Contador ≈ {usd(CONT_PF)}/mes (estimado).", f"Contador ≈ {usd(CONT_EMP)}/mes (estimado), facturación electrónica y declaraciones mensuales."],
 ["Responsabilidad", "Ilimitada con tu patrimonio personal.", "Limitada a la empresa (con excepciones legales)."],
 ["Cobros", "Algunos procesadores locales (Bancard, Pagopar) probablemente exigen RUC o empresa: <b>a confirmar con cada uno</b>.", "Acceso más fácil a pasarelas, facturación a instituciones y convenios con universidades."],
 ["Contrato con el desarrollador", "A nombre personal; cesión de código a persona física.", "A nombre de la EAS; gastos deducibles; imagen profesional."],
 ["Resultado en bolsillo", "<b>Mayor</b> (sin IDU y con contador más barato).", "<b>Menor</b> si retiras todo: ver tabla. La ventaja es protección, acceso e imagen, no ahorro."],
 ["Cuándo conviene", "Fase de prueba o hasta que una pasarela, un convenio o la protección patrimonial exijan empresa.", "Cuando necesites facturar a instituciones, una pasarela exija empresa, o quieras separar el patrimonio del negocio."],
], "wide")
hot_tbl = table(["Componente", "Qué cobra (según fuentes consultadas)", "Impacto en un plan mensual de USD 25,90", "Estado de la cifra"], [
 ["Comisión por venta", "9,9% por venta aprobada (puede bajar hasta ≈ 8,9% con facturación anual de 6 cifras)", "≈ USD 2,56 (9,9%)", "Varias fuentes concuerdan"],
 ["Tarifa fija por transacción", "Antes ≈ USD 0,50 (o R$ 1,00); fuentes recientes indican <b>R$ 2,49</b> desde el 21/09/2026", "≈ USD 0,45–0,50 (1,7–1,9 pts) y se repite en <b>cada renovación</b>", "Fuentes en conflicto: confirmar en tu cuenta"],
 ["Reproductor de video Hotmart", "Antes ≈ R$ 2,49 o USD 1,49 por venta aprobada; la propia Hotmart dice que desde 21/09/2026 queda <b>incluido en la tarifa fija</b>", "Hasta ≈ USD 1,49 (5,8 pts) si todavía se cobra aparte", "Versiones de la ayuda en conflicto"],
 ["Anticipación de cobros", "≈ 2,19%–4,79% (tarjeta estándar) si adelantas el dinero", "Hasta ≈ USD 0,50–1,20", "Un texto de mayo/2026; confirmar"],
 ["Conversión de moneda / spread", "Se aplica un tipo de cambio al convertir; en Argentina hay un cargo específico de 9,5%", "Depende del país y del par de monedas", "Sin porcentaje general verificado"],
 ["Retiros", "≈ USD 1 por solicitud + costos del banco receptor", "Pequeño", "Blog, 2021–2025"],
 ["Microtransacción (≤ R$ 10)", "≈ 20% por venta", "No aplica a tus planes", "Fuente única"],
 ["Afiliados / coproductores", "Su comisión sale de tu parte", "Variable", "—"],
], "wide")
hib_tbl = table(["", "1 · Todo en Hotmart (hoy)", "2 · Híbrido: Hotmart cobra + plataforma propia", "3 · Plataforma + pasarela propia"], [
 ["Quién cobra", "Hotmart", "Hotmart (checkout, medios de pago, impuestos)", "Pagopar / Bancard / Stripe / dLocal…"],
 ["Quién entrega el curso", "Hotmart Club (área de miembros gratuita)", "<b>Tu plataforma</b> (marca, panel, repasos, preguntas) abre el acceso automáticamente al recibir el aviso de compra (webhook)", "Tu plataforma"],
 ["Comisión por venta", "≈ 9,9% + fija (+ reproductor si aplica)", "<b>La misma comisión de Hotmart</b>; se ahorra el reproductor/hosting de video de Hotmart si lo alojas por tu cuenta", "≈ 2–5% según medio (a confirmar)"],
 ["Ahorro posible", "—", "Pequeño (solo reproductor y extras)", "Grande (≈ 6–7 puntos de la venta)"],
 ["Trabajo de desarrollo", "—", "≈ 15–25 h (webhook, creación de cuentas, altas/bajas)", "≈ 20–40 h por proveedor + cumplimiento"],
 ["Riesgo", "Dependes de sus reglas, retenciones y bloqueos", "Mismo riesgo de pagos, mejor experiencia", "Gestionas reembolsos, contracargos e impuestos"],
], "wide")
opciones = table(["", "A · Licencia + operación", "B · Cesión total", "C · Socio"], [
 ["Inversión inicial", f"{usd(A_SETUP)}", f"{usd(B_PRECIO)}", f"{usd(C_SETUP)}"],
 ["Pago mensual al desarrollador", f"{usd(A_MES)}/mes (operación, soporte, actualizaciones)", f"Opcional: {usd(B_MANT)}/mes", f"{int(C_PCT*100)}% de los ingresos brutos"],
 ["Propiedad del código", "Del desarrollador (licencia de uso)", "De la titular", "A definir"],
 ["Quién asume el riesgo", "Equilibrado", "La titular paga todo antes de vender", "Compartido: se paga más si ella vende más"],
 ["Conviene si…", "Quiere empezar con poco y delegar el mantenimiento", "Quiere independencia y planea escalar", "Quiere mínimo desembolso y alinear incentivos"],
], "wide")

HTMLDOC = f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Propuesta · Biomáster Academy — Plataforma propia de cursos</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap">
<style>
:root{{--navy:#1f2f4a;--blue:#4f74ad;--sky:#e8f0fc;--sky2:#d3e3fa;--gold:#e8cd8c;--ink:#16213a;--mut:#56637f;--line:#dbe5f5}}
*{{box-sizing:border-box}}body{{margin:0;font:15px/1.6 Inter,system-ui,sans-serif;color:var(--ink);background:#f4f8ff}}
h1,h2,h3{{font-family:Poppins,system-ui,sans-serif;color:var(--navy);letter-spacing:-.015em;margin:0}}
.page{{max-width:980px;margin:0 auto;padding:0 28px}}
.cover{{background:linear-gradient(135deg,#1f2f4a,#2f4a7a);color:#eaf1fb;padding:64px 0 48px}}
.cover .page{{display:grid;grid-template-columns:1.3fr .7fr;gap:24px;align-items:center}}
.cover h1{{color:#fff;font-size:42px;line-height:1.08;font-weight:800;margin:14px 0}}.cover p{{color:#c6d3ea;font-size:17px}}
.cover img.owl{{width:100%;max-width:300px;justify-self:center;filter:drop-shadow(0 20px 24px rgba(0,0,0,.35))}}
.tag{{display:inline-block;background:var(--gold);color:#3b2d08;font:700 12px Poppins,sans-serif;padding:5px 14px;border-radius:99px}}
.logo{{display:flex;align-items:center;gap:10px;font:800 15px Poppins,sans-serif;letter-spacing:.05em;color:#fff}}.logo img{{width:38px;height:38px;border-radius:50%}}
section{{padding:36px 0 8px}}section h2{{font-size:26px;margin-bottom:6px}}section h2 small{{display:block;font:700 11px Inter,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--blue);margin-bottom:4px}}
p.lead{{color:var(--mut);margin:8px 0 14px}}
.cards{{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:16px 0}}.card{{background:#fff;border:1px solid var(--line);border-radius:16px;padding:16px 18px}}.card b{{display:block;font:700 15px Poppins,sans-serif;color:var(--navy);margin-bottom:4px}}.card span{{font-size:13.5px;color:var(--mut)}}
.t{{width:100%;border-collapse:collapse;background:#fff;border:1px solid var(--line);border-radius:12px;overflow:hidden;font-size:13px;margin:12px 0}}
.t th{{background:#f6f9ff;text-align:left;font:700 11px Poppins,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:var(--mut)}}.t th,.t td{{padding:9px 11px;border-bottom:1px solid #eef2fa;vertical-align:top}}
.t td.pos{{color:#1f7a5c;font-weight:700}}.t td.neg{{color:#b03a2e;font-weight:700}}
.b{{font:600 11px Inter,sans-serif;border-radius:99px;padding:3px 9px;white-space:nowrap}}.b.ok{{background:#e3f5ec;color:#1f7a5c}}.b.pr{{background:#fff3d6;color:#8a5a00}}.b.td{{background:#eef0f5;color:#56637f}}
.note{{background:#fff6dc;border:1px solid #f1e2b0;border-radius:12px;padding:11px 15px;font-size:13.5px;margin:12px 0;color:#5c4400}}
.warn{{background:#fdf2f0;border:1px solid #f0c9c4;color:#8f2d22}}
ul.ck{{list-style:none;padding:0;margin:10px 0;display:grid;gap:7px}}ul.ck li:before{{content:"✓ ";color:#1f9d73;font-weight:700}}
.calc{{background:#fff;border:1px solid var(--line);border-radius:18px;padding:20px;margin:14px 0}}.calc .g{{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}}
.calc label{{font-size:12px;color:var(--mut);font-weight:600;display:block}}.calc input{{width:100%;height:38px;border:1px solid #d5ddec;border-radius:10px;padding:0 10px;font:inherit;margin-top:3px}}
.calc .out{{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:16px}}.calc .out div{{background:var(--sky);border-radius:12px;padding:10px 12px}}.calc .out span{{display:block;font-size:11px;color:var(--mut);font-weight:600;text-transform:uppercase;letter-spacing:.05em}}.calc .out b{{font:800 19px Poppins,sans-serif;color:var(--navy)}}
.steps{{counter-reset:s;list-style:none;padding:0;display:grid;gap:10px}}.steps li{{counter-increment:s;background:#fff;border:1px solid var(--line);border-radius:14px;padding:12px 16px 12px 52px;position:relative}}.steps li:before{{content:counter(s);position:absolute;left:14px;top:11px;width:28px;height:28px;border-radius:9px;background:var(--navy);color:var(--gold);font:700 14px Poppins,sans-serif;display:grid;place-items:center}}
footer{{padding:30px 0 50px;font-size:12px;color:var(--mut)}}footer a{{color:var(--blue)}}
.shot{{border-radius:14px;border:1px solid var(--line);box-shadow:0 14px 30px rgba(31,47,74,.15);width:100%}}
@media print{{body{{background:#fff}}section{{break-inside:auto}}.card,.calc,.steps li{{break-inside:avoid}}.cover{{-webkit-print-color-adjust:exact;print-color-adjust:exact}}.b,.note,.t th,.calc .out div{{-webkit-print-color-adjust:exact;print-color-adjust:exact}}section>h2,section>h3,h3{{break-after:avoid}}section>h2 small{{break-after:avoid}}.t tr{{break-inside:avoid}}.page{{max-width:none;padding:0 6px}}}}
@media screen and (max-width:760px){{.cover .page,.cards,.calc .g,.calc .out{{grid-template-columns:1fr}}}}
</style></head><body>
<header class="cover"><div class="page"><div>
<div class="logo"><img src="{LOGO}" alt="">BIOMÁSTER ACADEMY</div>
<h1>Tu plataforma propia de cursos, con tu marca y tus alumnos.</h1>
<p>Propuesta comercial para la <b>Bioq. Andrea López Ramirez</b>: qué incluye, qué ya está listo, cuánto cuesta operarla, cómo cobrar con PIX, dólares y guaraníes, y los términos legales.</p>
<span class="tag">Versión borrador · 31 de octubre de 2026</span></div><img class="owl" src="{OWL}" alt=""></div></header>
<main class="page">

<section><h2><small>1 · Resumen</small>Qué te proponemos</h2>
<p class="lead">Pasar de vender dentro de una plataforma ajena a tener <b>tu propio espacio</b>: sitio de ventas, panel de alumnos, cobros y panel de gestión, con tu marca. Tú eres dueña de tus <b>alumnos, sus correos y tus precios</b>; sin depender de las reglas de un tercero.</p>
<div class="cards"><div class="card"><b>Más margen</b><span>Menor comisión por venta que un marketplace: con 500 alumnos la diferencia estimada supera USD 700 al mes (sección 5).</span></div><div class="card"><b>Tu marca y tus datos</b><span>Lista de alumnos, progreso y ventas son tuyos. Puedes ofrecer cupones, planes y promociones propias.</span></div><div class="card"><b>Lista para crecer</b><span>Los módulos se publican a medida que los grabas. Los alumnos ven el avance del curso y nuevas aulas sin costo extra.</span></div></div>
<img class="shot" src="{PANEL}" alt="Panel del alumno">
</section>

<section><h2><small>2 · Qué vende la plataforma</small>Lo que recibe tu alumno</h2>
<p class="lead">El mensaje central: <b>«La Bioquímica no se memoriza, ¡se domina!»</b> Un método en 6 pasos dentro de un solo panel.</p>
<div class="cards"><div class="card"><b>Aprende</b><span>Videoaulas por módulo, en orden: 17 módulos de la química básica a la bioquímica clínica.</span></div><div class="card"><b>Conecta</b><span>Mapas, esquemas y explicaciones visuales que integran las vías metabólicas.</span></div><div class="card"><b>Repasa</b><span>Flashcards y repasos rápidos de 10 minutos.</span></div><div class="card"><b>Practica</b><span>Banco de preguntas y detección de puntos débiles.</span></div><div class="card"><b>Material premium</b><span>PDFs exclusivos, como «Ciclo de Krebs».</span></div><div class="card"><b>Desafíos</b><span>Ejercicios con banco de respuestas para medir lo que sabes.</span></div></div>
<p><b>Planes sugeridos:</b> Mensual USD 25,90 · Semestral USD 129,90 (≈ USD 21,65/mes, −16%) · Anual «Fundadores» USD 219,90 (≈ USD 18,33/mes, −29%). 7 días de garantía. <i>Precios a confirmar por la profesora; el plan anual se recomienda lanzarlo cuando haya más módulos publicados.</i></p></section>

<section><h2><small>3 · Qué incluye hoy</small>Estado real de la plataforma</h2>
<p class="lead">Transparencia total: lo que funciona hoy, lo que es prototipo y lo que falta.</p>{estado}
<div class="note"><b>Oportunidades de ingreso adicionales</b> (fuera del alcance actual): cursos nuevos (p. ej. Hematología), certificados de finalización, programa de afiliados, convenios con universidades o centros de estudiantes, cupones de lanzamiento, y una cuenta gratuita con la clase de bienvenida para captar correos y convertirlos en alumnos.</div></section>

<section><h2><small>4 · Cobros</small>PIX, dólares y guaraníes</h2>
<p class="lead">Objetivo: que el alumno pague con el medio que ya usa — <b>PIX</b> (Brasil), <b>tarjeta en dólares</b> (internacional) y <b>guaraníes</b> (Paraguay).</p>{pagos}
<div class="note warn"><b>Conclusión honesta de la investigación:</b> no encontré un único proveedor <u>confirmado oficialmente</u> que cubra PIX + USD + PYG para una vendedora pequeña con un solo contrato. Los mejores candidatos son <b>dLocal</b> (todo en uno, pero orientado a empresas) o una combinación <b>Bancard / Pagopar (PYG + PIX local) + procesador de USD</b>. Como la titular es <b>paraguaya</b>, el camino más realista es combinar <b>Bancard / Pagopar</b> (guaraníes y PIX local; falta confirmar si aceptan persona física) con <b>Hotmart</b> para tarjetas en USD. dLocal queda para volúmenes mayores y Stripe, según fuentes secundarias, no abre cuentas con domicilio en Paraguay. Los sitios oficiales de los proveedores no pudieron consultarse en esta investigación: todas las tarifas deben confirmarse con cada proveedor antes de decidir.</div>
<p><b>Cómo lo resolvemos técnicamente:</b></p><ul class="ck"><li><b>Tarjeta:</b> cobro recurrente mensual automático.</li><li><b>PIX y medios locales:</b> el alumno paga un período fijo (mensual, semestral o anual) y recibe acceso hasta el vencimiento, sin débito automático; el sistema avisa antes de que venza. Encaja muy bien con los planes semestral y anual.</li><li>La plataforma ya está preparada para sumar proveedores sin rehacerla (≈ 20–40 horas por proveedor).</li></ul>
<p><b>Recomendación (titular paraguaya):</b> (1) empezar con el modelo <b>híbrido</b> sobre Hotmart; (2) sumar <b>Bancard o Pagopar</b> para guaraníes y PIX en alumnos nuevos, una vez confirmado si aceptan persona física con RUC; (3) mantener Hotmart para USD; (4) evaluar dLocal si el volumen lo justifica.</p></section>


<section><h2><small>4B · Hotmart</small>¿Cuánto paga hoy y qué cambia con un modelo híbrido?</h2>
<p class="lead">Importante: según las fuentes, el <b>área de miembros de Hotmart (Hotmart Club) es gratuita</b>. Lo que encarece es la <b>comisión de pago</b> (9,9% + fija) y, hasta septiembre de 2026, la tarifa del reproductor de video. Es decir: <u>no es el «hosting» lo que se paga caro, sino el procesamiento de pagos y el marketplace</u>.</p>{hot_tbl}
<div class="note"><b>Ejemplo (plan mensual USD 25,90):</b> 9,9% (USD 2,56) + fija ≈ USD 0,50 = <b>≈ 11,8%</b>. Si además se cobra el reproductor (USD 1,49): <b>≈ 17,6%</b>. Si anticipa el 100% de los cobros al 3%: <b>≈ 20%</b>. En planes semestral y anual el peso de las tarifas fijas es mucho menor (≈ 10,3% y ≈ 10,1%).</div>
<p><b>Para saber cuánto paga realmente:</b> abrir <code>proposta/analisis-hotmart.html</code>, subir el <b>informe de ventas</b> de Hotmart (Ventas → Informe → Exportar) y la herramienta calcula la comisión efectiva real por plan y por mes, sin enviar datos a ningún servidor. También permite estimar con sus propios números.</p>
<h3 style="margin-top:20px">¿Se puede dejar solo el cobro en Hotmart y tener una plataforma propia?</h3>
<p class="lead"><b>Sí.</b> Hotmart permite enviar <b>avisos automáticos (webhooks)</b> a un sistema externo cuando hay una compra aprobada, cancelación de suscripción, reembolso o contracargo. La plataforma propia recibe el aviso, crea o activa la cuenta del alumno y le da o quita acceso. <i>(Eventos documentados: compra aprobada y cancelación de suscripción, API de webhooks v2; la forma exacta de validar el aviso con el «hottok» debe verificarse en la documentación oficial al implementar.)</i></p>{hib_tbl}
<div class="note"><b>Recomendación:</b> empezar por el <b>modelo 2 (híbrido)</b>: es rápido, mantiene los medios de pago que ya funcionan (tarjetas internacionales, PIX en Brasil) y deja lista la experiencia propia. Después, <b>agregar pasarelas propias</b> (modelo 3) para los nuevos alumnos —empezando por PIX/guaraníes locales— y mover el volumen gradualmente. Así se reduce el riesgo y la comisión baja por etapas. Mientras tanto, <b>negociar la tarifa con Hotmart</b> si su facturación anual supera el tramo de 6 cifras.</div>
</section>

<section><h2><small>4C · Camino financiero (Paraguay)</small>Con empresa o sin empresa: dos flujos de valores</h2>
<p class="lead">Para una profesional en Paraguay hay dos caminos: vender como <b>persona física con RUC</b> (A) o a través de una <b>empresa tipo EAS</b> (B). <b>Las cifras son ilustrativas</b> y deben validarse con un contador paraguayo: no se pudo confirmar en las fuentes si el curso vendido a alumnos de otros países está exento de IVA (se asume 10%), ni qué actividades pueden acogerse al RESIMPLE.</p>{requis}
<h3 style="margin-top:20px">¿Cuánto queda cada mes? (A vs B, con Hotmart y con pasarela propia)</h3>
<p class="lead">Supuestos: ingreso medio {usd(ARPU)}/alumno/mes · IVA 10% incluido en el precio y sin crédito fiscal · IRE 10% sobre utilidad · IDU 8% si retiras el 100% de la utilidad · guaraní a {n_es(FX_PYG)} por USD · RESIMPLE con cuota máxima (Gs {n_es(RESIMPLE_CUOTA_GS)}/mes) y sin exención de IVA · contador PF ≈ {usd(CONT_PF)}, empresa ≈ {usd(CONT_EMP)}.</p>{fiscal_tbl}
<div class="note warn"><b>Conclusión:</b> en Paraguay <u>la empresa no ahorra impuestos</u>: el IRE es el mismo y el IDU de 8% al retirar utilidades, más el contador, hacen que queden menos USD en tu bolsillo (≈ {usd(py_flow(100,FEE_HOTMART,False)['neto']-py_flow(100,FEE_HOTMART,True)['neto'])}/mes con 100 alumnos; más ≈ {usd(EAS_COSTO)} una sola vez). Se elige empresa por <b>protección patrimonial, acceso a pasarelas, facturación a instituciones e imagen</b>. Los diagramas completos están en <code>proposta/flujograma-decision.pdf</code>.</div>
<div class="calc"><h3 style="margin-bottom:10px">Calculadora (Paraguay)</h3><div class="g">
<div><label>Alumnos pagos<input id="fn" type="number" value="100" min="0"></label></div>
<div><label>Camino<select id="fcase" style="width:100%;height:38px;border:1px solid #d5ddec;border-radius:10px;margin-top:3px"><option value="A">A · Sin empresa (persona física)</option><option value="B">B · Con empresa (EAS)</option></select></label></div>
<div><label>Comisión de pago (%)<input id="ffee" type="number" value="{FEE_HOTMART*100:g}" step="0.1"></label></div>
<div><label>Ingreso medio/alumno (USD)<input id="farpu" type="number" value="{ARPU}" step="0.5"></label></div>
<div><label>Guaraníes por USD<input id="ffx" type="number" value="{FX_PYG}" step="10"></label></div>
<div><label>% de utilidades que retiras (solo B)<input id="fdist" type="number" value="{int(DISTRIB*100)}" step="5" min="0" max="100"></label></div></div>
<div class="out"><div><span>Ingresos/mes</span><b id="f1"></b></div><div><span>Impuestos/mes</span><b id="f2"></b></div><div><span>Neto en bolsillo</span><b id="f3"></b></div><div><span>% que queda</span><b id="f4"></b></div></div></div>
<div class="note warn"><b>Preguntas para el contador paraguayo (antes de decidir):</b> (1) ¿Mi actividad (curso en línea) califica al <b>RESIMPLE</b> y el RESIMPLE exime del IVA? (2) ¿Las ventas a alumnos de otros países son exportación de servicios con IVA 0% o tributan 10%? (3) ¿Se clasifica como IRE (empresa unipersonal) o IRP (servicio personal)? (4) ¿Cómo facturo a Hotmart y a las pasarelas (SIFEN) y qué retenciones aplican? (5) ¿Bancard y Pagopar aceptan persona física con RUC? (6) ¿EAS o SRL?</div>
</section>

<section><h2><small>5 · Costos de operación</small>Cuánto cuesta mantenerla</h2>{infra_tbl}
<h3 style="margin-top:22px">Escenarios mensuales (estimación)</h3>
<p class="lead">Supuestos: ingreso medio de {usd(ARPU)} por alumno/mes · {MIN_ALUMNO} min de video por alumno al mes · curso de ~{MIN_CURSO:,} min · comisión Hotmart ≈ {int(FEE_HOTMART*100)}% · pasarela propia ≈ {FEE_GW*100:.1f}%. <i>Edita los supuestos en la calculadora de abajo.</i></p>
<div class="scroll"><table class="t wide"><thead><tr><th>Alumnos pagos</th><th>Ingresos</th><th>Infraestructura + video</th><th>Comisión Hotmart</th><th>Comisión pasarela propia</th><th>Ahorro bruto</th><th>Beneficio neto · Opción A</th><th>Opción B</th><th>Opción C</th></tr></thead><tbody>{rows}</tbody></table></div>
<p style="font-size:13px;color:#56637f"><i>Beneficio neto = ahorro de comisiones − infraestructura − pago al desarrollador. Es el dinero extra frente a seguir 100% en Hotmart.</i></p>
<div class="note"><b>Punto de equilibrio:</b> con la Opción A la plataforma empieza a rendir más que Hotmart desde aproximadamente <b>{BE} alumnos pagos</b>. Por debajo de ese número, quedarse en Hotmart es más barato. Lo que justifica la plataforma antes de ese punto es la marca, el control de datos y de precios, y el crecimiento planificado.</div>
<div class="calc"><h3 style="margin-bottom:10px">Calculadora</h3><div class="g">
<div><label>Alumnos pagos<input id="n" type="number" value="500" min="0"></label></div>
<div><label>Ingreso medio/alumno (USD/mes)<input id="arpu" type="number" value="{ARPU}" step="0.5"></label></div>
<div><label>Minutos de video por alumno/mes<input id="mins" type="number" value="{MIN_ALUMNO}"></label></div>
<div><label>Minutos totales del curso<input id="cmin" type="number" value="{MIN_CURSO}"></label></div>
<div><label>Comisión Hotmart (%)<input id="hot" type="number" value="{FEE_HOTMART*100:g}" step="0.1"></label></div>
<div><label>Comisión pasarela propia (%)<input id="gw" type="number" value="{FEE_GW*100:g}" step="0.1"></label></div>
<div><label>Opción<select id="opt" style="width:100%;height:38px;border:1px solid #d5ddec;border-radius:10px;margin-top:3px"><option value="A">A · {usd(A_MES)}/mes</option><option value="B">B · cesión (sin mensualidad)</option><option value="C">C · {int(C_PCT*100)}% de ingresos</option></select></label></div></div>
<div class="out"><div><span>Ingresos/mes</span><b id="o1"></b></div><div><span>Infra + video</span><b id="o2"></b></div><div><span>Ahorro vs Hotmart</span><b id="o3"></b></div><div><span>Neto para la profesora</span><b id="o4"></b></div></div></div>
</section>

<section><h2><small>6 · Modelo de contratación</small>Tres formas de trabajar juntos</h2>{opciones}
<p style="font-size:13px;color:#56637f"><i>Valores sugeridos como punto de partida (≈ 160 h de desarrollo a USD 30/h para la cesión total). Se ajustan en la negociación.</i></p>
<p><b>Lo que NO incluye ninguna opción:</b> producción de videos, campañas de marketing, costos de terceros (ver sección 5) ni cambios fuera del alcance firmado. Las cuentas de hosting, dominio y pagos se abren <b>a nombre de la titular</b>.</p></section>

<section><h2><small>7 · Aspectos legales</small>Documentos y marco normativo</h2>
<ul class="ck"><li><b>Términos y Condiciones</b> de uso para alumnos (planes, renovación, cancelación, garantía de 7 días, licencia personal de contenido, aviso educativo).</li><li><b>Política de Privacidad</b> (datos tratados, proveedores, transferencias internacionales, derechos del titular).</li><li><b>Contrato de desarrollo y licencia/cesión</b> entre desarrollador y titular (propiedad del código, datos, soporte, confidencialidad).</li></ul>
<p>Los tres están en <code>proposta/legal/</code> como <b>borradores</b> con campos por completar.</p>
<div class="note"><b>Puntos a vigilar:</b><br>• <b>Paraguay</b> aprobó la <b>Ley N.º 7593/2025 de Protección de Datos Personales</b>; según las fuentes consultadas su vigencia plena sería ~24 meses tras su publicación (≈ noviembre de 2027) y crea una Agencia Nacional. Conviene diseñar el cumplimiento desde ahora. <i>Fechas por confirmar en el texto oficial.</i><br>• Si hay alumnos en <b>Brasil</b>, aplica la <b>LGPD</b>.<br>• <b>Derecho de consumidor y de arrepentimiento</b> en ventas a distancia: no pude confirmar en esta investigación qué plazo exige la Ley 1334/98 de Paraguay; la garantía de 7 días de la plataforma debe validarse por un abogado local.<br>• <b>Propiedad de los contenidos:</b> la titular debe acreditar derechos sobre videos, fotos y la mascota «búho».<br>• <b>Contenido de salud:</b> carácter educativo, no consejo médico.</div></section>

<section><h2><small>8 · Hoja de ruta</small>Próximos pasos</h2>
<ol class="steps"><li><b>Decisiones de la profesora</b> (semana 1): país y entidad de cobro, opción de contratación, precios definitivos, si seguirá en Hotmart durante la transición.</li><li><b>Puesta en producción base</b> (semanas 1–2): cuentas a nombre de la titular, dominio, base de datos, correo, publicación del sitio.</li><li><b>Cobros</b> (semanas 2–4): activar el proveedor elegido (tarjeta, PIX, PYG) y pruebas con pagos reales de bajo monto.</li><li><b>Contenido</b> (continuo): subir aulas del módulo 06 y siguientes; nuevo video de bienvenida; PDF premium actualizado.</li><li><b>Repaso y Preguntas</b> (semanas 4–8): flashcards, banco de preguntas, desafíos y descarga protegida de PDFs.</li><li><b>Lanzamiento</b>: migración o convivencia con Hotmart, comunicación a la base de alumnos, cupón de lanzamiento.</li></ol></section>

<section><h2><small>9 · Supuestos y riesgos</small>Lo que conviene saber</h2>
<ul class="ck"><li>Las cifras de infraestructura vienen de la documentación pública de Cloudflare; las comisiones de pago y varias tarifas provienen de <b>fuentes secundarias</b> y deben confirmarse. Los sitios oficiales de Stripe, Cloudflare y del Congreso paraguayo no estuvieron accesibles durante la investigación.</li><li>Depender de un desarrollador para mantener la plataforma es un riesgo: se mitiga con documentación, código con pruebas automáticas y cuentas a nombre de la titular.</li><li>Los videos protegidos por enlace pueden copiarse por un alumno; para proteger mejor se usa video con URL temporal (costo mayor).</li><li>Sin una base mínima de alumnos (≈ {BE}) quedarse en Hotmart sigue siendo más económico: la plataforma es una inversión de crecimiento.</li></ul></section>

<footer><b>Fuentes consultadas (secundarias salvo indicación):</b> Cloudflare Workers/D1/Stream (documentación vía búsqueda) · Resend (pricing) · Hotmart (blogs y centro de ayuda) · Bancard (PIX para comercios) · Pagopar (blog de gestión) · dLocal / EBANX (documentación) · Ley N.º 7593/2025 (BACN, noticias y análisis legales) · Ley 1334/98. Documento de trabajo, sujeto a verificación.</footer>
</main>
<script>
(function(){{var $=function(i){{return document.getElementById(i)}},f=function(x){{return 'USD '+Math.round(x).toLocaleString('es')}};
function upd(){{var n=+$('n').value||0,a=+$('arpu').value||0,m=+$('mins').value||0,cm=+$('cmin').value||0,h=(+$('hot').value||0)/100,g=(+$('gw').value||0)/100,o=$('opt').value;
var r=n*a,inf=5+1+(n>1000?20:0)+5*Math.ceil(cm/1000)+n*m/1000,sav=r*(h-g),fee=o==='A'?{A_MES}:(o==='C'?{C_PCT}*r:0);
$('o1').textContent=f(r);$('o2').textContent=f(inf);$('o3').textContent=f(sav);var net=sav-inf-fee;$('o4').textContent=f(net);$('o4').style.color=net<0?'#b03a2e':'#1f7a5c'}}
document.querySelectorAll('#n,#arpu,#mins,#cmin,#hot,#gw,#opt').forEach(function(e){{e.addEventListener('input',upd)}});upd();function fisc(){{var n=+$('fn').value||0,a=+$('farpu').value||0,fee=(+$('ffee').value||0)/100,fx=+$('ffx').value||{FX_PYG},emp=$('fcase').value==='B',dist=Math.min(100,Math.max(0,+$('fdist').value||0))/100, r=n*a,pago=r*fee,inf=5+1+(n>1000?20:0)+5*Math.ceil({MIN_CURSO}/1000)+n*{MIN_ALUMNO}/1000,cont=emp?{CONT_EMP}:{CONT_PF},res=!emp&&(r*12*fx<={RESIMPLE_LIMITE_GS}), iva=(res&&{str(RESIMPLE_EXIME_IVA).lower()})?0:r*{IVA}/(1+{IVA}),ire=res?{RESIMPLE_CUOTA_GS}/fx:Math.max(0,r-iva-pago-inf-cont)*{IRE},pre=r-iva-pago-inf-cont-ire,idu=emp?Math.max(0,pre)*dist*{IDU}:0,net=pre-idu,imp=iva+ire+idu; $('f1').textContent=f(r);$('f2').textContent=f(imp);$('f3').textContent=f(net);$('f4').textContent=(r?Math.round(net/r*100):0)+'%'}}document.querySelectorAll('#fn,#fcase,#ffee,#farpu,#ffx,#fdist').forEach(function(e){{e.addEventListener('input',fisc)}});fisc();}})();
</script></body></html>"""
pathlib.Path(__file__).with_name("propuesta-comercial.html").write_text(HTMLDOC, encoding="utf-8")
print("ok; punto de equilibrio A =", BE)
