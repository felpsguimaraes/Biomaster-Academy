"""Genera gastos-mantenimiento.html: lista de gastos de mantenimiento (hospedaje, base de datos, pago). Solo listado, sin escenarios."""
import pathlib
from model import *
OF, SEC, EST = "<span class='s of'>Doc. oficial*</span>", "<span class='s sc'>Fuente secundaria</span>", "<span class='s es'>Estimación</span>"
PEND = "<span class='s pe'>A definir</span>"
G = [
 ("1", "HOSPEDAJE", "Dónde viven el sitio, la API y los videos", [
  ("1.1", "Servidor de la API (cuentas, planes, progreso)", "Cloudflare Workers", "Plan gratis para empezar · <b>USD 5/mes</b> plan Paid (recomendado en producción)", "Fijo", OF),
  ("1.2", "Sitio web (páginas y archivos)", "Cloudflare Pages / Workers assets", "Sin costo relevante a esta escala (confirmar límites)", "Fijo", EST),
  ("1.3", "Dominio (ej. biomasteracademy.com)", "Registrador de dominios", "≈ <b>USD 10–15/año</b> (.com); .com.py: consultar NIC.PY", "Anual", EST),
  ("1.4", "Almacenamiento de videos de las aulas", "Cloudflare Stream", "<b>USD 5</b> por cada 1.000 min almacenados (≈ USD 10/mes con ~1.500 min de curso)", "Fijo (crece con las aulas)", OF),
  ("1.5", "Reproducción de videos (lo que miran los alumnos)", "Cloudflare Stream", "<b>USD 1</b> por cada 1.000 min reproducidos", "Variable (según uso)", OF),
  ("1.6", "Alternativa de video más económica con mucho tráfico", "Bunny Stream", "Cobra por GB: ≈ USD 0,01/GB almacenado y ≈ USD 0,01/GB entregado (EE. UU./Europa)", "Variable", SEC),
  ("1.7", "Tipografías del sitio", "Google Fonts", "Gratis", "—", EST),
 ]),
 ("2", "BASE DE DATOS", "Dónde se guardan alumnos, planes, progreso y aulas", [
  ("2.1", "Base de datos de la plataforma", "Cloudflare D1", "Incluida con Workers. Gratis: hasta 5 M lecturas y 100 mil escrituras por día y 5 GB. En Paid: 25 mil M lecturas y 50 M escrituras al mes y 5 GB incluidos", "Fijo (incluido)", OF),
  ("2.2", "Exceso de uso (si se supera lo incluido)", "Cloudflare D1", "USD 0,75 por GB-mes extra · USD 1 por millón de escrituras extra · USD 0,001 por millón de lecturas extra", "Variable", OF),
  ("2.3", "Copias de seguridad / exportación periódica", "Procedimiento del desarrollador", "Sin costo de servicio estimado; definir frecuencia y responsable", "—", PEND),
 ]),
 ("3", "PLATAFORMA DE PAGO", "Quién cobra a los alumnos y cuánto se queda", [
  ("3.1", "Comisión por venta", "Hotmart (actual)", "<b>9,9%</b> por venta aprobada (puede bajar con mayor facturación anual)", "Por venta", SEC),
  ("3.2", "Tarifa fija por transacción", "Hotmart", "Antes ≈ USD 0,50; fuentes recientes indican <b>R$ 2,49</b> desde el 21/09/2026. Se repite en cada renovación", "Por venta", SEC),
  ("3.3", "Reproductor de video de Hotmart", "Hotmart", "Antes ≈ USD 1,49 (o R$ 2,49) por venta aprobada; la propia Hotmart indica que desde el 21/09/2026 queda incluido en la tarifa fija", "Por venta", SEC),
  ("3.4", "Anticipación de cobros (opcional)", "Hotmart", "≈ 2,19% a 4,79% sobre lo anticipado", "Por uso", SEC),
  ("3.5", "Retiro de dinero y conversión de moneda", "Hotmart + tu banco", "≈ USD 1 por solicitud de retiro + comisiones del banco receptor y tipo de cambio aplicado", "Por retiro", SEC),
  ("3.6", "Comisión por venta (pasarela local)", "Pagopar / upay", "≈ <b>2%</b> débito · ≈ <b>3%</b> crédito · ≈ 2,9% QR Pix", "Por venta", SEC),
  ("3.7", "Cobro en reales por PIX con liquidación en guaraníes", "Bancard", "Liquidación en 48 h; tarifas no publicadas (consultar)", "Por venta", PEND),
  ("3.8", "Pasarela «todo en uno» (PIX + USD + PYG)", "dLocal / EBANX", "Tarifas a medida (una fuente cita 0,99%–7,99% en dLocal Go); consultar", "Por venta", PEND),
  ("3.9", "Pago con tarjeta en USD (Stripe)", "Stripe", "Según fuentes secundarias <b>no abre cuentas con domicilio en Paraguay</b> (confirmar en stripe.com/global)", "—", SEC),
  ("3.10", "Reembolsos y contracargos", "Según plataforma", "Política y costos por confirmar con cada proveedor; en Hotmart, el contracargo bloquea la comisión de la venta", "Por evento", PEND),
 ]),
 ("4", "COMPLEMENTOS NECESARIOS", "Servicios que la plataforma necesita para funcionar", [
  ("4.1", "Correos del sistema (bienvenida, recuperación de contraseña)", "Resend", "Gratis hasta 3.000/mes (máx. 100/día) · Pro ≈ USD 20/mes (50.000/mes)", "Fijo / variable", SEC),
  ("4.2", "Contador", "Contador paraguayo", "≈ USD 30/mes persona física · ≈ USD 80/mes empresa", "Fijo mensual", EST),
  ("4.3", "Mantenimiento técnico y soporte de la plataforma", "Desarrollador", "A definir según el modelo de contratación (licencia, cesión o participación)", "Fijo mensual", PEND),
 ]),
]

def n_es(x): return f"{x:,}".replace(",", ".")
def pct(x): return f"{x*100:.0f}%"
_rows = ""
for n in (0, 40, 100, 500, 2000):
    r = n * ARPU; inf = infra(n)["total"]; cont = CONT_PF
    ph = r * FEE_HOTMART; pg = r * FEE_GW; th = inf + cont + ph; tg = inf + cont + pg
    lab = "0 (encendida, sin alumnos)" if n == 0 else str(n)
    _rows += f"<tr><td><b>{lab}</b></td><td>{usd(r)}</td><td>{usd(inf)}</td><td>{usd(cont)}</td><td>{usd(ph)}</td><td class='tot'>{usd(th)}{(' <small>(' + pct(th/r) + ')</small>') if r else ''}</td><td>{usd(pg)}</td><td class='tot'>{usd(tg)}{(' <small>(' + pct(tg/r) + ')</small>') if r else ''}</td></tr>"
RES = f"""<h2 style="margin-top:18px">¿Cuánto cuesta mantenerla funcionando?</h2>
<div class="cards3"><div><span>Para tenerla encendida (sin alumnos)</span><b>≈ {usd(infra(0)['total'])}/mes</b><small>servidor USD 5 + dominio ≈ USD 1 + almacenamiento de video USD 10 (curso completo; al lanzar con pocas aulas, ≈ USD 5). Base de datos y correos: USD 0.</small></div><div><span>Con contador (persona física)</span><b>≈ {usd(infra(0)['total']+CONT_PF)}/mes</b><small>suma ≈ USD {CONT_PF}/mes de contador. Con empresa (EAS): ≈ USD {CONT_EMP}/mes.</small></div><div><span>Lo que más pesa</span><b>la comisión de pago</b><small>crece con las ventas: ≈ 11% con Hotmart; ≈ 4,5% con pasarela propia (estimado).</small></div></div>
<div class="scroll"><table class="tt"><thead><tr><th>Alumnos pagos</th><th>Ingresos/mes</th><th>Hospedaje + video + BD + correo</th><th>Contador (PF)</th><th>Pago · Hotmart ≈ {int(FEE_HOTMART*100)}%</th><th>TOTAL con Hotmart</th><th>Pago · pasarela ≈ {str(FEE_GW*100).replace('.',',')}%</th><th>TOTAL con pasarela</th></tr></thead><tbody>{_rows}</tbody></table></div>
<p class="foot">Supuestos: ingreso medio {usd(ARPU)}/alumno/mes · {MIN_ALUMNO} min de video por alumno al mes · curso de ≈ {n_es(MIN_CURSO)} min. <b>No incluye</b> el mantenimiento técnico del desarrollador (a definir: USD 150/mes en la Opción A, USD 100/mes opcional en la B, o 4% de los ingresos en la C) ni los impuestos sobre las ventas. Los porcentajes entre paréntesis son sobre los ingresos.</p>"""

def rows():
    out = ""
    for num, name, sub, items in G:
        out += f"<tr class='grp'><td colspan='6'><b>{num} · {name}</b> <span>— {sub}</span></td></tr>"
        for n, rub, svc, cost, tipo, est in items:
            out += f"<tr><td class='n'>{n}</td><td><b>{rub}</b><br><small>{svc}</small></td><td>{cost}</td><td><span class='tp'>{tipo}</span></td><td>{est}</td></tr>"
    return out
DOC = f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Gastos de mantenimiento · Biomáster Academy</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap">
<style>
:root{{--navy:#1f2f4a;--blue:#4f74ad;--sky:#e8f0fc;--gold:#e8cd8c;--ink:#16213a;--mut:#56637f;--line:#dbe5f5}}
*{{box-sizing:border-box}}body{{margin:0;background:#f4f8ff;color:var(--ink);font:14px/1.5 Inter,system-ui,sans-serif}}
.page{{max-width:1040px;margin:0 auto;padding:26px 22px 50px}}h1,h2,h3{{font-family:Poppins,sans-serif;color:var(--navy);margin:0}}
h1{{font-size:26px}}.tag{{display:inline-block;background:var(--gold);color:#3b2d08;font:700 11px Poppins;padding:4px 12px;border-radius:99px;margin-bottom:8px}}
.sub{{color:var(--mut);margin:6px 0 16px;max-width:760px}}
.map{{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;align-items:stretch;margin:12px 0 4px}}.map div{{background:#fff;border:1.6px solid var(--blue);border-radius:12px;padding:9px 10px;text-align:center;font:600 12px Inter;position:relative}}
.map div small{{display:block;font:500 11px Inter;color:var(--mut);margin-top:2px}}.map div b{{display:block;font:800 11px Poppins;color:var(--blue);letter-spacing:.06em;margin-bottom:2px}}.map .pay{{border-color:#c9a24a;background:#fff6dc}}.map .ext{{border-style:dashed;background:#f6f6f8}}
.map div:not(:last-child):after{{content:"→";position:absolute;right:-12px;top:50%;transform:translateY(-50%);color:var(--blue);font-weight:800}}
table{{width:100%;border-collapse:collapse;background:#fff;border:1px solid var(--line);border-radius:12px;overflow:hidden;margin-top:14px}}
th{{background:#f6f9ff;text-align:left;font:700 10.5px Poppins;letter-spacing:.07em;text-transform:uppercase;color:var(--mut);padding:9px 11px}}td{{padding:9px 11px;border-bottom:1px solid #eef2fa;vertical-align:top}}
td.n{{font:700 12px Poppins;color:var(--blue);width:38px}}td small{{color:var(--mut);font-size:12px}}tr.grp td{{background:var(--navy);color:#fff;border:0;padding:8px 11px}}tr.grp td span{{color:#c6d3ea;font-weight:400}}
.tp{{font:600 11px Inter;background:var(--sky);color:#2b3a55;border-radius:99px;padding:2px 9px;white-space:nowrap}}
.s{{font:600 10.5px Inter;border-radius:99px;padding:2px 8px;white-space:nowrap}}.of{{background:#e3f5ec;color:#1f7a5c}}.sc{{background:#fff3d6;color:#8a5a00}}.es{{background:#eef0f5;color:#56637f}}.pe{{background:#fdf2f0;color:#8f2d22}}
.cards3{{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:10px 0}}.cards3 div{{background:#fff;border:1px solid var(--line);border-radius:14px;padding:12px 14px}}.cards3 span{{display:block;font:600 11px Inter;color:var(--mut);text-transform:uppercase;letter-spacing:.05em}}.cards3 b{{display:block;font:800 21px Poppins;color:var(--navy);margin:3px 0}}.cards3 small{{font-size:12px;color:var(--mut)}}.tt{{width:100%;border-collapse:collapse;background:#fff;border:1px solid var(--line);font-size:12.5px}}.tt th{{background:#f6f9ff;text-align:left;font:700 10px Poppins;letter-spacing:.05em;text-transform:uppercase;color:var(--mut);padding:8px 9px}}.tt td{{padding:8px 9px;border-bottom:1px solid #eef2fa}}.tt td.tot{{background:#e3f5ec;font-weight:700;color:#1f7a5c}}.tt td small{{font-weight:500;color:#56637f}}.foot{{font-size:12px;color:var(--mut);margin:8px 0 4px}}.scroll{{overflow-x:auto}}.note{{background:#fff6dc;border:1px solid #f1e2b0;border-radius:12px;padding:10px 14px;font-size:12.5px;color:#5c4400;margin-top:12px}}
.resume{{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}}.resume div{{background:#fff;border:1px solid var(--line);border-radius:12px;padding:10px 13px}}.resume b{{font:700 13px Poppins;color:var(--navy);display:block;margin-bottom:3px}}.resume span{{font-size:12.5px;color:var(--mut)}}
@page{{size:A4;margin:10mm}}@media print{{body{{background:#fff}}.page{{padding:0}}tr{{break-inside:avoid}}tr.grp{{break-after:avoid}}tr.grp td,.s,.tp,.note,.map div,.resume div{{-webkit-print-color-adjust:exact;print-color-adjust:exact}}}}
@media(max-width:760px){{.map,.resume,.cards3{{grid-template-columns:1fr 1fr}}}}
</style></head><body><div class="page">
<span class="tag">Biomáster Academy · Lista de gastos · 31 de octubre de 2026</span>
<h1>Gastos de mantenimiento de la plataforma</h1>
<p class="sub">Qué hay que pagar para que la plataforma funcione, organizado por la estructura del sistema: <b>hospedaje</b>, <b>base de datos</b> y <b>plataforma de pago</b>. Primero el <b>total mensual</b> y después el detalle de cada gasto. Aún no incluye recomendaciones.</p>
{RES}
<h2 style="margin-top:22px">Detalle de cada gasto</h2>
<div class="map"><div><b>① HOSPEDAJE</b>Sitio y videos<small>Cloudflare + dominio</small></div><div><b>① HOSPEDAJE</b>API (Workers)<small>cuentas, planes, progreso</small></div><div><b>② BASE DE DATOS</b>D1<small>alumnos, aulas, planes</small></div><div class="pay"><b>③ PAGO</b>Hotmart / pasarela<small>cobro y comisión</small></div><div class="ext"><b>④ COMPLEMENTOS</b>Correo · contador<small>y soporte técnico</small></div></div>
<table><thead><tr><th>#</th><th>Gasto</th><th>Costo</th><th>Tipo</th><th>Estado de la cifra</th></tr></thead><tbody>{rows()}</tbody></table>
<div class="resume"><div><b>Fijos</b><span>Servidor/API, base de datos incluida, dominio, almacenamiento de video, contador y mantenimiento técnico.</span></div><div><b>Variables</b><span>Reproducción de video (según minutos vistos), correos por encima del límite gratis y exceso de base de datos.</span></div><div><b>Por venta</b><span>Comisiones y tarifas de la plataforma de pago (Hotmart o pasarela local), anticipación, retiros y contracargos.</span></div></div>
<div class="note"><b>Cómo leer «Estado de la cifra»:</b> <i>Doc. oficial*</i> = cifra tomada de la documentación pública del proveedor (consultada mediante búsqueda; los sitios oficiales no abrieron directamente desde este entorno) · <i>Fuente secundaria</i> = blogs, comparadores o noticias: confirmar con el proveedor · <i>Estimación</i> = cálculo propio · <i>A definir</i> = falta información o decisión. Los valores en USD de Hotmart provienen de tarifas en reales o dólares según el producto; el tipo de cambio puede variar.</div>
</div></body></html>"""
pathlib.Path(__file__).with_name("gastos-mantenimiento.html").write_text(DOC, encoding="utf-8")
print("ok")
