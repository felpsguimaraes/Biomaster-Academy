"""Modelo de cálculo compartido (supuestos editables). Lo usan build.py y build_flow.py."""
import math
# ---------- SUPUESTOS (editar) ----------
ARPU = 22.0          # ingreso medio mensual por alumno (USD), mezcla de planes con descuento
MIN_ALUMNO = 240     # minutos de video vistos por alumno al mes
MIN_CURSO = 1500     # minutos totales de video del curso (≈17 módulos × 4 aulas × ~20 min)
FEE_HOTMART = 0.11   # comisión efectiva estimada Hotmart (9,9% + tarifa fija; ver sección 4B; puede llegar a ≈ 17% si se cobra el reproductor aparte)
FEE_GW = 0.045       # comisión efectiva estimada de pasarela propia (tarjeta/PIX/local; a confirmar)
A_SETUP, A_MES = 1200, 150
B_PRECIO, B_MANT = 4800, 100
C_SETUP, C_PCT = 500, 0.04
ESCENARIOS = [100, 500, 2000]
# -----------------------------------------
def infra(n):
    stor = 5 * math.ceil(MIN_CURSO / 1000); deliv = n * MIN_ALUMNO / 1000
    email = 0 if n <= 1000 else 20
    return dict(workers=5, dominio=1, email=email, stor=stor, deliv=deliv, total=5 + 1 + email + stor + deliv)
def usd(x, d=0): return "USD " + f"{x:,.{d}f}".replace(",", "X").replace(".", ",").replace("X", ".")

# ---------- MODELO FISCAL ILUSTRATIVO (validar con contador) ----------
FX_BRL = 5.4            # BRL por USD (supuesto)
PY_IVA, PY_IRE = 0.10, 0.10          # IVA general 10% (incluido en el precio) · IRE 10% sobre utilidad
PY_CONT_PF, PY_CONT_EMP = 30, 80     # contador USD/mes (estimado)
PY_EAS_COSTO = 800                    # costo de constituir EAS (≈ USD 800 según abogado citado; SA/SRL ≈ 2.000–2.500)
BR_CONT_PF, BR_CONT_PJ = 0, 300 / 5.4 # contador (R$ 300/mes PJ, estimado) en USD
def br_tabla(b):  # tabla mensual progresiva (valores 2025/2026 según fuentes secundarias)
    if b <= 2428.80: return 0
    if b <= 2826.65: return b*0.075-182.16
    if b <= 3751.05: return b*0.15-394.16
    if b <= 4664.68: return b*0.225-675.49
    return b*0.275-908.73
def br_pf(x):     # carnê-leão mensual (R$): descuento simplificado 607,20 + redutor 2026 hasta 7.350
    if x <= 5000: return 0
    base = max(0, x-607.20)
    if x <= 7350: return max(0, br_tabla(base) - max(0, 978.62-0.133145*x))
    return br_tabla(x-607.20)
def simples_iii(rbt12):  # Anexo III (servicios), alícuota efectiva
    for lim, nom, ded in [(180000,.06,0),(360000,.112,9360),(720000,.135,17640),(1800000,.16,35640),(3600000,.21,125640),(4800000,.33,648000)]:
        if rbt12 <= lim: return (rbt12*nom-ded)/rbt12
    return .33
def fiscal(caso, n, fee_pago):
    r = n*ARPU; pago = r*fee_pago; inf = infra(n)['total']
    if caso == 'py_pf':   cont = PY_CONT_PF;  iva = r*PY_IVA/(1+PY_IVA); ire = max(0, (r/(1+PY_IVA)-pago-inf-cont*1))*PY_IRE; imp = iva+ire
    elif caso == 'py_emp': cont = PY_CONT_EMP; iva = r*PY_IVA/(1+PY_IVA); ire = max(0, (r/(1+PY_IVA)-pago-inf-cont))*PY_IRE; imp = iva+ire
    elif caso == 'br_pf': cont = BR_CONT_PF; base = (r-pago-inf)*FX_BRL; imp = br_pf(base)/FX_BRL
    else:                 cont = BR_CONT_PJ; imp = r*simples_iii(r*12*FX_BRL)
    neto = r - pago - inf - cont - imp
    return dict(r=r, pago=pago, inf=inf, cont=cont, imp=imp, neto=neto)
CASOS = [('py_pf','🇵🇾 Paraguay · sin empresa (persona física)'),('py_emp','🇵🇾 Paraguay · con empresa (EAS/SRL)'),('br_pf','🇧🇷 Brasil · sin empresa (PF, carnê-leão)'),('br_pj','🇧🇷 Brasil · con empresa (ME, Simples Anexo III)')]
