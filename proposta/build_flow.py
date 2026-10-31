"""Genera flujograma-decision.html: fluxogramas comparativos (empresa vs persona física) con cifras de model.py.
Uso:  python3 proposta/build_flow.py   (después, imprimir a PDF en horizontal)"""
import textwrap, pathlib
from model import *

def n_es(x): return f"{x:,}".replace(",", ".")
W = 1100
def esc(s): return s.replace("&", "&amp;").replace("<", "&lt;")
NODES = {}
def node(i, cx, cy, w, text, cls, h=None):
    lines = []
    for para in text.split("\n"):
        lines += textwrap.wrap(para, max(10, int(w / 7.4))) or [""]
    h = h or max(46, 22 * len(lines) + 20)
    NODES[i] = (cx, cy, w, h)
    ty = cy - (len(lines) - 1) * 9
    tx = "".join(f'<tspan x="{cx}" y="{ty + k * 18}">{esc(l)}</tspan>' for k, l in enumerate(lines))
    shape = f'<rect x="{cx - w/2}" y="{cy - h/2}" width="{w}" height="{h}" rx="{22 if cls=="q" else 14}" class="n {cls}"/>'
    return shape + f'<text text-anchor="middle" class="t {cls}">{tx}</text>'
def top(i): cx, cy, w, h = NODES[i]; return (cx, cy - h / 2)
def bot(i): cx, cy, w, h = NODES[i]; return (cx, cy + h / 2)
def edge(a, b, label="", side=None, dx=0):
    (x1, y1), (x2, y2) = a, b; my = (y1 + y2) / 2
    pts = f"{x1},{y1} {x1},{my} {x2},{my} {x2},{y2 - 2}" if x1 != x2 else f"{x1},{y1} {x2},{y2 - 2}"
    out = f'<polyline points="{pts}" class="e" marker-end="url(#ar)"/>'
    if label:
        lx = (x2 if side == "dst" else x1) + dx; ly = (y2 - 8) if side == "dst" else my - 6
        out += f'<text x="{lx}" y="{ly}" class="lb" text-anchor="middle">{esc(label)}</text>'
    return out

# ---------------- Diagrama 1: árbol de decisión (Paraguay) ----------------
LIM = LIMITE_RESIMPLE_ALUMNOS
d = [node("s", 550, 40, 520, "Soy paraguaya y quiero vender mi curso en mi propia plataforma", "s"),
     node("q2", 550, 150, 520, f"¿Tus ventas anuales serán de hasta Gs 80 millones (≈ USD {str(round(RESIMPLE_LIMITE_GS/FX_PYG/1000,1)).replace('.',',')} mil ≈ {LIM} alumnos pagos)?", "q"),
     node("q2b", 250, 290, 380, "¿Tu actividad puede acogerse al RESIMPLE? (confirmar con la DNIT o un contador)", "q"),
     node("q3", 810, 290, 420, "¿Necesitas una pasarela que exija empresa, facturar a instituciones o separar tu patrimonio personal?", "q"),
     node("r1", 110, 450, 200, "PERSONA FÍSICA · RESIMPLE\nCuota fija Gs 20–80 mil\nSin empresa, casi sin costo", "pf"),
     node("r2", 380, 450, 210, "PERSONA FÍSICA · IRE 10%\nIVA 10% + 10% sobre la utilidad\nContador ≈ USD 30/mes", "pf"),
     node("r3", 700, 450, 230, f"EMPRESA (EAS)\n≈ USD {EAS_COSTO} · 3–8 días hábiles\nIRE 10% + IDU 8% al retirar utilidades", "em"),
     node("r4", 960, 450, 190, "PERSONA FÍSICA · IRE 10%\nReevaluar si cambian tus necesidades", "pf"),
     node("fin", 550, 600, 640, "Siguiente decisión → ¿cómo cobrar? (Hotmart, híbrido o pasarela propia) — ver Diagrama 4", "s")]
d += [edge(bot("s"), top("q2")),
      edge(bot("q2"), top("q2b"), "Sí", "dst", 0), edge(bot("q2"), top("q3"), "No", "dst", 0),
      edge(bot("q2b"), top("r1"), "Sí", "dst", 0), edge(bot("q2b"), top("r2"), "No", "dst", 0),
      edge(bot("q3"), top("r3"), "Sí", "dst", 0), edge(bot("q3"), top("r4"), "No", "dst", 0)]
for k in ("r1", "r2", "r3", "r4"):
    x, y = bot(k); d.append(f'<polyline points="{x},{y} {x},558 550,558 550,{top("fin")[1]-2}" class="e soft" marker-end="url(#ar)"/>')
DEFS = '<defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#4f74ad"/></marker></defs>'
D1 = f'<svg viewBox="0 0 {W} 650" class="dg">{DEFS}{"".join(d)}</svg>'

# ---------------- Diagrama 3: flujos de valores (cascada) ----------------
def money(x): return usd(x)
def wf(titulo, sub, f, empresa, colx):
    rows = [("Ventas brutas", f["r"], "#1f2f4a", None), ("− IVA 10% (incluido en el precio)", f["iva"], "#e07b6a", None),
            ("− Comisión de pago", f["pago"], "#d9a441", None), ("− Infra + video", f["inf"], "#9fb4d6", None),
            ("− Contador", f["cont"], "#b9a7d8", None), (("− IRE 10% sobre utilidad" if not f["resimple"] else "− Cuota RESIMPLE"), f["ire"], "#e07b6a", None),
            ("− IDU 8% al retirar utilidades" if empresa else "IDU: no aplica (sin empresa)", f["idu"], "#e07b6a", None),
            ("= NETO EN BOLSILLO", f["neto"], "#2e9e74", None)]
    x0 = colx; bx = x0 + 215; bw = 190; out = f'<text x="{x0}" y="26" class="cl">{esc(titulo)}</text><text x="{x0}" y="46" class="bl">{esc(sub)}</text>'
    rem = f["r"]; y = 66
    for i, (lab, v, c, _) in enumerate(rows):
        out += f'<text x="{x0}" y="{y+17}" class="bl{" strong" if i in (0,7) else ""}">{esc(lab)}</text>'
        if i == 0: s, w = 0, bw
        elif i == 7: s, w = 0, max(2, f["neto"] / f["r"] * bw)
        else:
            w = v / f["r"] * bw; rem -= v; s = rem / f["r"] * bw
        out += f'<rect x="{bx + s:.1f}" y="{y}" width="{max(w, 1.5):.1f}" height="24" fill="{c}"/>'
        out += f'<text x="{bx + bw + 12}" y="{y+17}" class="bv{" net" if i==7 else ""}">{money(v) if i in (0,7) else ("−" + money(v) if v else "—")}</text>'
        y += 38
    return out
def flows(n, fee):
    a = py_flow(n, fee, False); b = py_flow(n, fee, True)
    svg = f'<svg viewBox="0 0 {W} 400" class="dg">' + wf("FLUJO A · SIN EMPRESA (persona física)", a["regimen"] + (" · ≤ Gs 80 M/año" if a["resimple"] else ""), a, False, 20) \
          + wf("FLUJO B · CON EMPRESA (EAS)", "IRE 10% + IDU 8% si retiras las utilidades", b, True, 575) + '</svg>'
    dif = a["neto"] - b["neto"]
    nota = f'<div class="note"><b>Con {n} alumnos pagos</b> y comisión de pago de {str(round(fee*100,1)).rstrip("0").rstrip(".").replace(".",",")}%: sin empresa te quedan <b>{money(a["neto"])}/mes</b>; con empresa <b>{money(b["neto"])}/mes</b> si retiras todas las utilidades (<b>{money(dif)} menos al mes</b>, más ≈ {money(EAS_COSTO)} una sola vez para constituirla). Si dejas parte de las utilidades dentro de la empresa, el IDU se difiere sobre esa parte.</div>'
    return svg + nota
tabsN = "".join(f'<button class="tb{" on" if n==100 else ""}" data-g="n" data-v="{n}">{n} alumnos pagos</button>' for n in ESCENARIOS_PY)
tabsF = "".join(f'<button class="tb{" on" if v==FEE_HOTMART else ""}" data-g="f" data-v="{k}">{lab}</button>' for k, v, lab in (("h", FEE_HOTMART, f"Cobro con Hotmart (≈ {int(FEE_HOTMART*100)}%)"), ("p", FEE_GW, f"Pasarela propia (≈ {str(FEE_GW*100).replace('.',',')}%)")))
panes = "".join(f'<div class="pane{" on" if (n==100 and k=="h") else ""}" data-n="{n}" data-f="{k}">{flows(n, v)}</div>' for n in ESCENARIOS_PY for k, v in (("h", FEE_HOTMART), ("p", FEE_GW)))
legend = "".join(f'<span><i style="background:{c}"></i>{l}</span>' for l, c in (("Impuestos", "#e07b6a"), ("Comisión de pago", "#d9a441"), ("Infra + video", "#9fb4d6"), ("Contador", "#b9a7d8"), ("Neto en bolsillo", "#2e9e74")))


def fm(x): return usd(x)
_r = ""
for n in ESCENARIOS_PY:
    for lab, v in (("Hotmart ≈ %d%%" % int(FEE_HOTMART*100), FEE_HOTMART), ("Pasarela propia ≈ %s%%" % str(FEE_GW*100).replace(".", ","), FEE_GW)):
        a = py_flow(n, v, False); b = py_flow(n, v, True)
        _r += f"<tr><td>{n}</td><td>{lab}</td><td>{a['regimen']}</td><td><b>{fm(a['neto'])}</b></td><td><b>{fm(b['neto'])}</b></td><td>{fm(a['neto']-b['neto'])}</td></tr>"
SUMMARY = f"<table class='tt'><thead><tr><th>Alumnos pagos</th><th>Cobro</th><th>Régimen sin empresa</th><th>Neto/mes · Sin empresa</th><th>Neto/mes · Con empresa (retirando todo)</th><th>Diferencia</th></tr></thead><tbody>{_r}</tbody></table>"

def step(t_, sub, chips):
    c = "".join(f'<em>{x}</em>' for x in chips)
    return f'<li><b>{t_}</b><span>{sub}</span><div class="ch">{c}</div></li>'
laneA = "".join([step("Inscribirte o actualizar tu RUC", "Con tu cédula, gratis y en línea (DNIT)", ["1 día", "USD 0"]),
                 step("Elegir régimen con un contador", "RESIMPLE (cuota fija) o IRE 10% según tus ventas", ["1–3 días", f"≈ {usd(CONT_PF)}/mes"]),
                 step("Habilitar comprobantes", "Boleta RESIMPLE o factura electrónica (SIFEN) según el régimen", ["a confirmar con DNIT"]),
                 step("Abrir cuentas a tu nombre", "Hosting, base de datos, dominio, correo", ["1–2 días", f"≈ {usd(7)}/mes"]),
                 step("Conectar el cobro", "Hotmart híbrido o pasarela que acepte persona física (a confirmar)", ["1–2 semanas", "según proveedor"]),
                 step("Subir aulas y probar", "Módulo 06 + bienvenida; pago de prueba", ["1 semana", "USD 0"])])
laneB = "".join([step("Constituir la EAS", "Empresa por Acciones Simplificada, trámite en línea (SUACE)", ["3–8 días hábiles", f"≈ {usd(EAS_COSTO)}"]),
                 step("RUC de la empresa + cuenta bancaria empresarial", "Alta fiscal y cuenta a nombre de la EAS", ["1–3 semanas", "variable"]),
                 step("Contratar contador y habilitar factura electrónica", "IVA, IRE, retención del IDU, SIFEN", ["1–2 semanas", f"≈ {usd(CONT_EMP)}/mes"]),
                 step("Abrir cuentas a nombre de la EAS", "Hosting, dominio, correo, pasarela; contrato con el desarrollador a nombre de la empresa", ["1–2 días", f"≈ {usd(7)}/mes"]),
                 step("Conectar cobro (Pagopar/Bancard + Hotmart)", "Gs y PIX local con pasarela propia; USD por Hotmart", ["2–4 semanas", "según proveedor"]),
                 step("Subir aulas y probar", "Módulo 06 + bienvenida; pago de prueba", ["1 semana", "USD 0"])])
def lane(t_, ttl, steps_, cls): return f'<div class="lane {cls}"><h3>{ttl}</h3><p class="lt">{t_}</p><ol class="st">{steps_}</ol></div>'
LANES = f'<div class="lanes">{lane("Empiezas ya y tributas como persona","A · SIN EMPRESA (persona física)",laneA,"a")}{lane("Más pasos al inicio; más orden y protección","B · CON EMPRESA (EAS)",laneB,"b")}</div><div class="join">⬇ Ambos caminos terminan en: <b>LANZAMIENTO</b> (cuenta gratuita + planes de pago)</div>'

def arch(titulo, steps_, fee, nota, cls):
    boxes = '<i class="ar">→</i>'.join(f'<div class="bx {c}">{t_}</div>' for t_, c in steps_)
    return f'<div class="arch {cls}"><h3>{titulo}</h3><div class="row">{boxes}<div class="fee">{fee}</div></div><p>{nota}</p></div>'
ARCH = (arch("1 · Todo en Hotmart (hoy)", [("Alumno", "u"), ("Checkout Hotmart", "h"), ("Hotmart Club", "h")], "≈ 9,9% + fija<br><small>(+ reproductor si se cobra)</small>", "Cobra y entrega en Hotmart. Sin marca propia ni datos propios más allá del informe.", "o1")
      + arch("2 · Híbrido: Hotmart cobra, tu plataforma entrega", [("Alumno", "u"), ("Checkout Hotmart", "h"), ("Aviso automático (webhook)", "w"), ("Tu plataforma", "p")], "≈ 9,9% + fija", "Mismo costo de cobro, pero experiencia, repasos y panel propios. ≈ 15–25 h de desarrollo. <b>Paso intermedio recomendado.</b>", "o2")
      + arch("3 · Pasarela local propia (Bancard / Pagopar) + Hotmart para USD", [("Alumno en Paraguay / Brasil", "u"), ("Gs · PIX (Bancard/Pagopar)", "g"), ("Tu plataforma", "p")], f"≈ {str(FEE_GW*100).replace('.',',')}%<br><small>(según medio; confirmar)</small>", "Menor comisión en guaraníes y PIX; las tarjetas en USD de otros países siguen por Hotmart (Stripe, según fuentes, no abre cuentas con domicilio en Paraguay). ≈ 20–40 h por proveedor; reembolsos, contracargos e impuestos son tuyos.", "o3"))

HTMLDOC = f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Flujograma de decisión · Biomáster Academy</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap">
<style>
:root{{--navy:#1f2f4a;--blue:#4f74ad;--sky:#e8f0fc;--gold:#e8cd8c;--ink:#16213a;--mut:#56637f;--line:#dbe5f5}}
*{{box-sizing:border-box}}body{{margin:0;background:#f4f8ff;color:var(--ink);font:15px/1.55 Inter,system-ui,sans-serif}}
h1,h2,h3{{font-family:Poppins,sans-serif;color:var(--navy);margin:0}}
.page{{max-width:1080px;margin:0 auto;padding:0 24px}}
.cover{{background:linear-gradient(135deg,#1f2f4a,#2f4a7a);color:#eaf1fb;padding:36px 0}}.cover h1{{color:#fff;font-size:32px;line-height:1.1;margin:8px 0}}.cover p{{color:#c6d3ea;margin:0;max-width:760px}}
.tag{{display:inline-block;background:var(--gold);color:#3b2d08;font:700 12px Poppins;padding:4px 12px;border-radius:99px}}
section.d{{padding:30px 0 6px}}section.d>h2{{font-size:22px}}section.d>h2 small{{display:block;font:700 11px Inter;letter-spacing:.16em;text-transform:uppercase;color:var(--blue);margin-bottom:3px}}
.lead{{color:var(--mut);margin:6px 0 14px}}
svg.dg{{width:100%;height:auto;background:#fff;border:1px solid var(--line);border-radius:16px;padding:6px;display:block}}
.n{{stroke-width:1.6}}.n.s{{fill:#1f2f4a;stroke:#1f2f4a}}.n.q{{fill:#fff;stroke:#4f74ad}}.n.pf{{fill:#e8f0fc;stroke:#4f74ad}}.n.em{{fill:#fff6dc;stroke:#c9a24a}}.n.w{{fill:#f6f6f8;stroke:#a7afc0;stroke-dasharray:5 4}}
.t{{font:600 13px Inter,sans-serif;fill:#16213a}}.t.s{{fill:#fff}}
.e{{fill:none;stroke:#4f74ad;stroke-width:1.8}}.e.soft{{stroke:#b7c6df;stroke-dasharray:4 4}}.lb{{font:700 12px Inter;fill:#1f2f4a;paint-order:stroke;stroke:#fff;stroke-width:5px}}
.cl{{font:700 14px Poppins;fill:#1f2f4a}}.bl{{font:500 12px Inter;fill:#56637f}}.bl.strong{{font-weight:700;fill:#1f2f4a}}.bv{{font:600 12.5px Inter;fill:#16213a}}.bv.net{{font-weight:800;fill:#1f7a5c;font-size:14px}}
.tabs{{display:flex;gap:8px;margin:8px 0;flex-wrap:wrap}}.tb{{border:1px solid var(--line);background:#fff;border-radius:99px;padding:7px 14px;font:600 13px Poppins;color:var(--mut);cursor:pointer}}.tb.on{{background:var(--navy);color:#fff;border-color:var(--navy)}}.pane{{display:none}}.pane.on{{display:block}}
.lg{{display:flex;gap:16px;flex-wrap:wrap;font-size:12.5px;color:var(--mut);margin:8px 0}}.lg i{{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:6px;vertical-align:-1px}}
.lanes{{display:grid;grid-template-columns:1fr 1fr;gap:18px}}.lane{{background:#fff;border:1px solid var(--line);border-radius:18px;padding:16px 18px}}.lane.a{{border-top:5px solid var(--blue)}}.lane.b{{border-top:5px solid #c9a24a}}
.lane h3{{font-size:17px}}.lt{{color:var(--mut);margin:2px 0 10px;font-size:13.5px}}
ol.st{{list-style:none;margin:0;padding:0;counter-reset:s}}ol.st li{{counter-increment:s;position:relative;padding:10px 12px 10px 46px;border:1px solid var(--line);border-radius:12px;margin-bottom:22px;background:#fbfdff}}
ol.st li:before{{content:counter(s);position:absolute;left:10px;top:10px;width:26px;height:26px;border-radius:8px;background:var(--navy);color:var(--gold);font:700 13px Poppins;display:grid;place-items:center}}
ol.st li:not(:last-child):after{{content:"▼";position:absolute;left:50%;bottom:-19px;font-size:12px;color:#4f74ad}}
ol.st b{{display:block;font-family:Poppins;font-size:14px;color:var(--navy)}}ol.st span{{font-size:13px;color:var(--mut)}}
.ch{{margin-top:5px;display:flex;gap:6px;flex-wrap:wrap}}.ch em{{font:600 11px Inter;font-style:normal;background:var(--sky);color:#2b3a55;border-radius:99px;padding:2px 9px}}
.join{{text-align:center;background:var(--navy);color:#fff;border-radius:14px;padding:12px;margin-top:6px}}.join b{{color:var(--gold)}}
.arch{{background:#fff;border:1px solid var(--line);border-radius:16px;padding:14px 16px;margin-bottom:14px}}.arch h3{{font-size:15px;margin-bottom:8px}}.arch p{{margin:8px 0 0;font-size:13.5px;color:var(--mut)}}
.row{{display:flex;align-items:center;gap:8px;flex-wrap:wrap}}.bx{{border-radius:12px;padding:9px 13px;font:600 13px Inter;border:1.6px solid}}.bx.u{{background:#fff;border-color:#a7afc0}}.bx.h{{background:#fff3d6;border-color:#c9a24a}}.bx.w{{background:#f6f6f8;border:1.6px dashed #a7afc0}}.bx.p{{background:#e8f0fc;border-color:#4f74ad}}.bx.g{{background:#e3f5ec;border-color:#2e9e74}}
.ar{{font-style:normal;color:#4f74ad;font-weight:800}}.fee{{margin-left:auto;text-align:right;font:700 14px Poppins;color:#b03a2e}}.fee small{{font:500 11px Inter;color:#56637f}}
.o3{{border-color:#2e9e74;box-shadow:0 0 0 3px #e3f5ec}}
.tt{{width:100%;border-collapse:collapse;background:#fff;border:1px solid var(--line);font-size:13px;margin:6px 0 10px}}.tt th,.tt td{{padding:7px 10px;border-bottom:1px solid #eef2fa;text-align:left}}.tt th{{background:#f6f9ff;font:700 10.5px Poppins;letter-spacing:.05em;text-transform:uppercase;color:var(--mut)}}.note.warn{{background:#fdf2f0;border-color:#f0c9c4;color:#8f2d22}}.note{{background:#fff6dc;border:1px solid #f1e2b0;border-radius:12px;padding:11px 15px;font-size:13.5px;color:#5c4400;margin:12px 0}}
.chk{{background:#fff;border:1px solid var(--line);border-radius:16px;padding:16px 20px}}.chk li{{list-style:none;margin:8px 0;display:flex;gap:10px;align-items:flex-start}}.chk li:before{{content:"☐";font-size:18px;line-height:1;color:var(--blue)}}.chk ul{{margin:0;padding:0}}
footer{{font-size:12px;color:var(--mut);padding:18px 0 40px}}
@page{{size:A4 landscape;margin:10mm}}
@media print{{body{{background:#fff;font-size:13px}}.cover{{break-after:page;-webkit-print-color-adjust:exact;print-color-adjust:exact}}section.d{{break-after:page;break-inside:avoid;padding:0}}section.d:last-of-type{{break-after:auto}}
svg.dg{{max-height:150mm;width:auto;max-width:100%;margin:0 auto}}.tabs{{display:none}}.pane:not(.on){{display:none!important}}.pane.on{{display:block!important}}.pb{{break-before:page}}
.lane{{padding:10px 14px}}ol.st li{{padding:4px 8px 4px 38px;margin-bottom:12px}}ol.st li:before{{top:6px;left:8px;width:22px;height:22px;font-size:11px}}ol.st li:not(:last-child):after{{bottom:-15px;font-size:10px}}ol.st b{{font-size:12px}}ol.st span{{font-size:10.5px}}.ch{{margin-top:2px}}.ch em{{font-size:10px;padding:1px 7px}}.lt{{display:none}}.lane h3{{font-size:14px}}.join{{padding:7px;font-size:12px}}.lead{{margin:2px 0 8px}}.note{{margin:8px 0;font-size:12.5px}}.arch{{margin-bottom:10px;padding:10px 14px}}
.n,.join,.ch em,.note,.n,.lane,.arch,svg{{-webkit-print-color-adjust:exact;print-color-adjust:exact}}}}
@media(max-width:760px){{.lanes{{grid-template-columns:1fr}}}}
</style></head><body>
<header class="cover"><div class="page"><span class="tag">Para decidir · Paraguay · 31 de octubre de 2026</span><h1>¿Seguir como persona física o abrir una empresa?<br>Dos flujos de valores para decidir.</h1><p>Cuatro diagramas pensados para la Dra. Andrea López (Paraguay): el árbol de decisión, el camino de cada opción, <b>cuánto queda en tu bolsillo en cada flujo</b> y cómo se cobra. <b>Las cifras son ilustrativas</b>: deben validarse con un contador paraguayo.</p></div></header>
<main class="page">
<section class="d"><h2><small>Diagrama 1</small>Árbol de decisión: ¿empresa o persona física?</h2><p class="lead">Responde de arriba hacia abajo. Azul = persona física · Dorado = empresa.</p>{D1}</section>
<section class="d"><h2><small>Diagrama 2</small>Camino paso a paso: de hoy al lanzamiento</h2><p class="lead">Tiempo y costo estimados de cada camino.</p>{LANES}</section>
<section class="d"><h2><small>Diagrama 3</small>Los dos flujos de valores: ¿cuánto queda de cada venta?</h2><p class="lead">De lo que pagan tus alumnos en un mes hasta lo que queda en tu bolsillo, paso a paso, en cada camino.</p>
<div class="tabs">{tabsN}</div><div class="tabs">{tabsF}</div><div class="lg">{legend}</div>{panes}
<div class="pb">{SUMMARY}
<div class="note warn"><b>Qué significa:</b> en Paraguay la empresa <u>no reduce impuestos</u>: el IRE de 10% es igual para persona física y empresa, y al retirar las utilidades de la EAS se paga además el <b>IDU de 8%</b>, más un contador más caro. La empresa se justifica por <b>protección patrimonial, acceso a pasarelas que la exijan, facturación a instituciones e imagen</b>, no por ahorro. Supuestos: ingreso medio {usd(ARPU)}/alumno/mes · {MIN_ALUMNO} min de video/alumno · curso ≈ {n_es(MIN_CURSO)} min · guaraní a {n_es(FX_PYG)} por USD · IVA 10% incluido en el precio y sin crédito fiscal · RESIMPLE: se usa el máximo de la cuota (Gs {n_es(RESIMPLE_CUOTA_GS)}/mes) y se asume que NO exime del IVA (si lo exime, la opción sin empresa mejora ≈ 9 puntos con pocos alumnos).</div></div></section>
<section class="d"><h2><small>Diagrama 4</small>Cómo fluye el cobro: tres arquitecturas</h2><p class="lead">Se pueden combinar por etapas: empezar híbrido y sumar la pasarela local.</p>{ARCH}
<div class="note"><b>Recomendación de camino:</b> 1) empezar en <b>híbrido</b>; 2) activar una <b>pasarela local</b> (Bancard o Pagopar) para guaraníes y PIX en alumnos nuevos —verificando antes si aceptan persona física—; 3) mantener Hotmart para tarjetas en USD de otros países.</div></section>
<section class="d"><h2><small>Siguiente paso</small>Lo que necesito de ti para cerrar</h2><div class="chk"><ul>
<li>¿Ya tienes RUC como persona física? ¿Qué actividad figura?</li><li>¿Ya tienes alguna empresa (EAS/SRL)? ¿Desde cuándo?</li><li>Cuántos alumnos pagos esperas en 12 meses (aprox.) y cuántos tienes hoy.</li><li>Informe de ventas actual de Hotmart (para medir tu comisión real).</li><li>Tu cuenta bancaria para recibir en USD y en guaraníes.</li><li>Nombre de tu contador (o autorización para contactar uno) para validar RESIMPLE, IVA, IRE y facturación.</li><li>Precios definitivos de los planes y cuándo abrir el plan anual.</li></ul></div></section>
<footer>Documento de trabajo. Impuestos y tarifas: fuentes secundarias, a confirmar con la DNIT/contador. Parámetros editables en <code>proposta/model.py</code>.</footer>
</main>
<script>document.querySelectorAll('.tb').forEach(function(b){{b.addEventListener('click',function(){{var g=b.dataset.g;document.querySelectorAll('.tb[data-g="'+g+'"]').forEach(function(x){{x.classList.toggle('on',x===b)}});var n=document.querySelector('.tb[data-g="n"].on').dataset.v,f=document.querySelector('.tb[data-g="f"].on').dataset.v;document.querySelectorAll('.pane').forEach(function(p){{p.classList.toggle('on',p.dataset.n===n&&p.dataset.f===f)}})}})}})</script>
</body></html>"""
pathlib.Path(__file__).with_name("flujograma-decision.html").write_text(HTMLDOC, encoding="utf-8")
print("ok")
