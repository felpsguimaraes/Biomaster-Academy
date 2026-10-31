"""Genera flujograma-decision.html: fluxogramas comparativos (empresa vs persona física) con cifras de model.py.
Uso:  python3 proposta/build_flow.py   (después, imprimir a PDF en horizontal)"""
import textwrap, pathlib
from model import *

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

# ---------------- Diagrama 1: árbol de decisión ----------------
d = [node("s", 550, 40, 460, "Quiero vender mi curso en mi propia plataforma", "s"),
     node("q1", 550, 135, 430, "¿En qué país está tu RUC/CPF y tu cuenta bancaria?", "q"),
     node("py", 200, 270, 360, "🇵🇾 PARAGUAY\n¿Venderás más de ≈ 40 alumnos pagos? (≈ USD 10–11 mil/año = límite del RESIMPLE)", "q"),
     node("br", 640, 270, 360, "🇧🇷 BRASIL\n¿Superarás R$ 81 mil al año (≈ 57 alumnos pagos)? (límite del MEI)", "q"),
     node("ot", 975, 270, 190, "Otro país / sin definir", "q"),
     node("otr", 985, 405, 170, "Definir con un contador local. Revisar dLocal / Stripe si hay entidad en país soportado.", "w"),
     node("py_no", 80, 440, 150, "PERSONA FÍSICA (RESIMPLE)\nEmpiezas ya, casi sin costo", "pf"),
     node("py_q3", 300, 440, 250, "¿Quieres cobrar con Bancard/Pagopar, vender a instituciones o proteger tu patrimonio?", "q"),
     node("py_emp", 200, 610, 200, "EMPRESA (EAS)\n≈ USD 800 · 3–8 días hábiles\nIRE 10% + IVA", "em"),
     node("py_pf2", 430, 610, 220, "PERSONA FÍSICA con RUC\nIVA 10% + renta personal\nReevaluar a los 100 alumnos", "pf"),
     node("br_no", 560, 440, 210, "MEI (si tu actividad lo permite) o persona física\nRevisar CNAE con contador", "pf"),
     node("br_si", 800, 440, 210, "EMPRESA: ME en Simples Nacional (CNPJ)\nCon 500 alumnos ≈ USD 1.190 más al mes que como PF", "em"),
     node("fin", 550, 770, 640, "Siguiente decisión → ¿cómo cobrar? (Hotmart, híbrido o pasarela propia) — ver Diagrama 3", "s")]
d += [edge(bot("s"), top("q1")),
      edge(bot("q1"), top("py"), "Paraguay", "dst", 0), edge(bot("q1"), top("br"), "Brasil", "dst", 0), edge(bot("q1"), top("ot"), "Otro", "dst", 0),
      edge(bot("ot"), top("otr")),
      edge(bot("py"), top("py_no"), "No", "dst", 0), edge(bot("py"), top("py_q3"), "Sí", "dst", 0),
      edge(bot("py_q3"), top("py_emp"), "Sí", "dst", 0), edge(bot("py_q3"), top("py_pf2"), "No", "dst", 0),
      edge(bot("br"), top("br_no"), "No", "dst", 0), edge(bot("br"), top("br_si"), "Sí", "dst", 0)]
for k in ("py_no", "py_emp", "py_pf2", "br_no", "br_si"):
    x, y = bot(k); d.append(f'<polyline points="{x},{y} {x},715 550,715 550,{top("fin")[1]-2}" class="e soft" marker-end="url(#ar)"/>')
DEFS = '<defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#4f74ad"/></marker></defs>'
D1 = f'<svg viewBox="0 0 {W} 815" class="dg">{DEFS}{"".join(d)}</svg>'

# ---------------- Diagrama 3: barras apiladas ----------------
COL = [("pago", "Comisión de pago", "#d9a441"), ("inf", "Infra + video", "#9fb4d6"), ("cont", "Contador", "#b9a7d8"), ("imp", "Impuestos", "#e07b6a"), ("neto", "Neto en bolsillo", "#2e9e74")]
def bars(n):
    out = f'<svg viewBox="0 0 {W} 430" class="dg">'
    y = 20
    for k, lab in CASOS:
        out += f'<text x="0" y="{y+12}" class="cl">{esc(lab)}</text>'; y += 24
        for nm, fee in (("Hotmart", FEE_HOTMART), ("Pasarela propia", FEE_GW)):
            f = fiscal(k, n, fee); r = f["r"]; x = 150; bw = 640
            out += f'<text x="0" y="{y+16}" class="bl">{nm} {str(round(fee*100,1)).rstrip('0').rstrip('.').replace('.',',')}%</text>'
            for key, _, c in COL:
                v = f[{"pago": "pago", "inf": "inf", "cont": "cont", "imp": "imp", "neto": "neto"}[key]]
                w = max(0, v / r * bw)
                out += f'<rect x="{x:.1f}" y="{y}" width="{w:.1f}" height="24" fill="{c}"/>'; x += w
            out += f'<text x="{150+bw+10}" y="{y+17}" class="bv">{usd(f["neto"])} <tspan class="pc">({f["neto"]/r*100:.0f}%)</tspan></text>'
            y += 30
        y += 14
    return out + "</svg>"
tabs = "".join(f'<button class="tb{" on" if n==500 else ""}" data-n="{n}">{n} alumnos pagos · {usd(n*ARPU)}/mes</button>' for n in ESCENARIOS)
panes = "".join(f'<div class="pane{" on" if n==500 else ""}" data-n="{n}">{bars(n)}</div>' for n in ESCENARIOS)
legend = "".join(f'<span><i style="background:{c}"></i>{l}</span>' for _, l, c in COL)

def step(t, sub, chips):
    c = "".join(f'<em>{x}</em>' for x in chips)
    return f'<li><b>{t}</b><span>{sub}</span><div class="ch">{c}</div></li>'
laneA = "".join([step("Decidir planes y precios", "Mensual · semestral · anual", ["1 día", "USD 0"]),
                 step("Abrir cuentas a tu nombre", "Hosting, base de datos, dominio, correo", ["1–2 días", f"≈ {usd(7)}/mes"]),
                 step("Conectar el cobro", "Hotmart híbrido (persona física) o pasarela que acepte PF", ["1–2 semanas", "según proveedor"]),
                 step("Subir aulas y probar", "Módulo 06 + bienvenida; pago de prueba", ["1 semana", "USD 0"])])
laneB = "".join([step("Constituir la empresa", "Paraguay: EAS/SRL · Brasil: CNPJ (ME)", ["3–8 días (EAS)", f"≈ {usd(PY_EAS_COSTO)} (PY) / sin tasa (BR)"]),
                 step("RUC/CNPJ + cuenta bancaria empresarial", "Alta fiscal y cuenta a nombre de la empresa", ["1–3 semanas", "variable"]),
                 step("Contratar contador", "Facturación, IVA, renta", ["1 día", f"≈ {usd(PY_CONT_EMP)}/mes (PY) · ≈ {usd(BR_CONT_PJ)}/mes (BR)"]),
                 step("Abrir cuentas a nombre de la empresa", "Hosting, dominio, correo, pasarela", ["1–2 días", f"≈ {usd(7)}/mes"]),
                 step("Conectar cobro (pasarela propia + Hotmart)", "Bancard/Pagopar/Stripe/dLocal según país", ["2–4 semanas", "según proveedor"]),
                 step("Subir aulas y probar", "Módulo 06 + bienvenida; pago de prueba", ["1 semana", "USD 0"])])

def lane(t, ttl, steps_, cls): return f'<div class="lane {cls}"><h3>{ttl}</h3><p class="lt">{t}</p><ol class="st">{steps_}</ol></div>'
LANES = f'<div class="lanes">{lane("Empiezas ya, tributas como persona","A · SIN EMPRESA",laneA,"a")}{lane("Más pasos al inicio, más orden y protección","B · CON EMPRESA",laneB,"b")}</div><div class="join">⬇ Ambos caminos terminan en el mismo lugar: <b>LANZAMIENTO</b> (cuenta gratuita + planes de pago)</div>'

def arch(titulo, steps_, fee, nota, cls):
    boxes = '<i class="ar">→</i>'.join(f'<div class="bx {c}">{t}</div>' for t, c in steps_)
    return f'<div class="arch {cls}"><h3>{titulo}</h3><div class="row">{boxes}<div class="fee">{fee}</div></div><p>{nota}</p></div>'
ARCH = (arch("1 · Todo en Hotmart (hoy)", [("Alumno", "u"), ("Checkout Hotmart", "h"), ("Hotmart Club", "h")], "≈ 9,9% + fija<br><small>(+ reproductor si se cobra)</small>", "Cobra y entrega en Hotmart. Sin marca propia ni datos propios más allá del informe.", "o1")
      + arch("2 · Híbrido: Hotmart cobra, tu plataforma entrega", [("Alumno", "u"), ("Checkout Hotmart", "h"), ("Aviso automático (webhook)", "w"), ("Tu plataforma", "p")], "≈ 9,9% + fija", "Mismo costo de cobro, pero experiencia, repasos y panel propios. ≈ 15–25 h de desarrollo. <b>Paso intermedio recomendado.</b>", "o2")
      + arch("3 · Pasarela propia (opción elegida para comparar)", [("Alumno", "u"), ("PIX · PYG · USD", "g"), ("Tu plataforma", "p")], f"≈ {str(FEE_GW*100).replace('.',',')}%<br><small>(según medio; confirmar)</small>", "Menor comisión, más trabajo: reembolsos, contracargos e impuestos son tuyos. ≈ 20–40 h por proveedor.", "o3"))

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
.cl{{font:700 13px Poppins;fill:#1f2f4a}}.bl{{font:500 12px Inter;fill:#56637f}}.bv{{font:700 13px Inter;fill:#1f7a5c}}.pc{{font-weight:500;fill:#56637f}}
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
.note{{background:#fff6dc;border:1px solid #f1e2b0;border-radius:12px;padding:11px 15px;font-size:13.5px;color:#5c4400;margin:12px 0}}
.chk{{background:#fff;border:1px solid var(--line);border-radius:16px;padding:16px 20px}}.chk li{{list-style:none;margin:8px 0;display:flex;gap:10px;align-items:flex-start}}.chk li:before{{content:"☐";font-size:18px;line-height:1;color:var(--blue)}}.chk ul{{margin:0;padding:0}}
footer{{font-size:12px;color:var(--mut);padding:18px 0 40px}}
@page{{size:A4 landscape;margin:10mm}}
@media print{{body{{background:#fff;font-size:13px}}.cover{{break-after:page;-webkit-print-color-adjust:exact;print-color-adjust:exact}}section.d{{break-after:page;break-inside:avoid;padding:0}}section.d:last-of-type{{break-after:auto}}
svg.dg{{max-height:150mm;width:auto;max-width:100%;margin:0 auto}}.tabs{{display:none}}.pane{{display:none!important}}.pane[data-n="500"]{{display:block!important}}
.lane{{padding:10px 14px}}ol.st li{{padding:4px 8px 4px 38px;margin-bottom:12px}}ol.st li:before{{top:6px;left:8px;width:22px;height:22px;font-size:11px}}ol.st li:not(:last-child):after{{bottom:-15px;font-size:10px}}ol.st b{{font-size:12px}}ol.st span{{font-size:10.5px}}.ch{{margin-top:2px}}.ch em{{font-size:10px;padding:1px 7px}}.lt{{display:none}}.lane h3{{font-size:14px}}.join{{padding:7px;font-size:12px}}.lead{{margin:2px 0 8px}}.note{{margin:8px 0;font-size:12.5px}}.arch{{margin-bottom:10px;padding:10px 14px}}
.n,.join,.ch em,.note,.n,.lane,.arch,svg{{-webkit-print-color-adjust:exact;print-color-adjust:exact}}}}
@media(max-width:760px){{.lanes{{grid-template-columns:1fr}}}}
</style></head><body>
<header class="cover"><div class="page"><span class="tag">Para decidir · 31 de octubre de 2026</span><h1>¿Seguir como persona física o abrir una empresa?<br>Y después, ¿cómo cobrar?</h1><p>Cuatro diagramas para decidir con claridad: el árbol de decisión, el camino paso a paso de cada opción, cuánto queda en tu bolsillo y cómo fluye el cobro. <b>Las cifras son ilustrativas</b>: deben validarse con un contador local.</p></div></header>
<main class="page">
<section class="d"><h2><small>Diagrama 1</small>Árbol de decisión: ¿empresa o persona física?</h2><p class="lead">Responde de arriba hacia abajo. Azul = persona física · Dorado = empresa.</p>{D1}</section>
<section class="d"><h2><small>Diagrama 2</small>Comparativo paso a paso: de hoy al lanzamiento</h2><p class="lead">Tiempo y costo estimados de cada camino.</p>{LANES}</section>
<section class="d"><h2><small>Diagrama 3</small>¿Cuánto queda en el bolsillo? Hotmart vs pasarela propia</h2><p class="lead">Cada barra es el 100% de lo que pagan tus alumnos en un mes; la parte verde es lo que te queda después de comisión de pago, infraestructura, contador e impuestos.</p>
<div class="tabs">{tabs}</div><div class="lg">{legend}</div>{panes}
<div class="note"><b>Cómo leer:</b> comparando barras del mismo caso, la pasarela propia (comisión ≈ {str(FEE_GW*100).replace('.',',')}%) deja más que Hotmart (≈ {FEE_HOTMART*100:g}%). Comparando casos, en Brasil la empresa (ME en Simples) deja claramente más que la persona física; en Paraguay la diferencia entre ambos es pequeña. Supuestos: ingreso medio {usd(ARPU)}/alumno/mes · {MIN_ALUMNO} min de video/alumno · curso de ~{MIN_CURSO:,} min · R$ {str(FX_BRL).replace('.',',')} por USD.</div></section>
<section class="d"><h2><small>Diagrama 4</small>Cómo fluye el cobro: tres arquitecturas</h2><p class="lead">Se pueden combinar por etapas: empezar híbrido y sumar pasarelas propias.</p>{ARCH}
<div class="note"><b>Recomendación de camino:</b> 1) empezar en <b>híbrido</b>; 2) activar una <b>pasarela propia</b> para PIX y guaraníes (primero para alumnos nuevos); 3) mantener Hotmart para tarjetas internacionales mientras no haya alternativa confirmada para USD.</div></section>
<section class="d"><h2><small>Siguiente paso</small>Lo que necesito de ti para cerrar</h2><div class="chk"><ul>
<li>País de tu RUC/CPF y de tu cuenta bancaria.</li><li>¿Ya tienes empresa (EAS/SRL, MEI/ME)? ¿Desde cuándo y con qué actividad?</li><li>Cuántos alumnos pagos esperas en 12 meses (aprox.).</li><li>Informe de ventas actual de Hotmart (para medir tu comisión real).</li><li>Si seguirás en Hotmart durante la transición.</li><li>Nombre de tu contador (o autorización para contactar uno) para validar IVA, renta y facturación.</li><li>Precios definitivos de los planes y cuándo abrir el plan anual.</li></ul></div></section>
<footer>Documento de trabajo. Impuestos y tarifas: fuentes secundarias, a confirmar. Parámetros editables en <code>proposta/model.py</code>.</footer>
</main>
<script>document.querySelectorAll('.tb').forEach(function(b){{b.addEventListener('click',function(){{document.querySelectorAll('.tb,.pane').forEach(function(x){{x.classList.toggle('on',x.dataset.n===b.dataset.n)}})}})}})</script>
</body></html>"""
pathlib.Path(__file__).with_name("flujograma-decision.html").write_text(HTMLDOC, encoding="utf-8")
print("ok")
