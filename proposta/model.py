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

# ---------- MODELO FISCAL PARAGUAY (ILUSTRATIVO · validar con contador) ----------
FX_PYG = 5950                 # Gs por USD (BCP ago–sep/2026 ≈ 5.900–5.960; fuentes divergen)
RESIMPLE_LIMITE_GS = 80_000_000   # ingresos brutos anuales máximos (DNIT)
RESIMPLE_CUOTA_GS = 80_000    # cuota fija: rango 20.000–80.000 Gs (se usa el máximo)
IVA, IRE, IDU = 0.10, 0.10, 0.08  # IVA general · IRE 10% sobre utilidad · IDU 8% al distribuir a residentes
CONT_PF, CONT_EMP = 30, 80    # contador USD/mes (estimado)
EAS_COSTO = 800               # constitución de EAS (≈ USD 800 según abogado citado; SA/SRL ≈ 2.000–2.500)
RESIMPLE_EXIME_IVA = False    # True si el contador confirma que RESIMPLE no paga IVA (una fuente lo indica)
DISTRIB = 1.0                 # parte de la utilidad que la titular retira de la EAS
ESCENARIOS_PY = [40, 100, 500, 2000]
LIMITE_RESIMPLE_ALUMNOS = int(RESIMPLE_LIMITE_GS / (FX_PYG * 12 * ARPU))
def py_flow(n, fee, empresa):
    r = n * ARPU; pago = r * fee; inf = infra(n)["total"]; cont = CONT_EMP if empresa else CONT_PF
    resimple = (not empresa) and (r * 12 * FX_PYG <= RESIMPLE_LIMITE_GS)
    iva = 0 if (resimple and RESIMPLE_EXIME_IVA) else r * IVA / (1 + IVA)
    if resimple: ire = RESIMPLE_CUOTA_GS / FX_PYG; reg = "IRE RESIMPLE (cuota fija)"
    else: ire = max(0, r - iva - pago - inf - cont) * IRE; reg = "IRE 10% sobre la utilidad"
    pre = r - iva - pago - inf - cont - ire
    idu = max(0, pre) * DISTRIB * IDU if empresa else 0
    return dict(r=r, iva=iva, pago=pago, inf=inf, cont=cont, ire=ire, idu=idu, neto=pre - idu, regimen=reg, resimple=resimple)
