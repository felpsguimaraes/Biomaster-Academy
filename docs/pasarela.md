# Pasarela de cobro: ruta más barata y experiencia atractiva

Estado: **simulador**. La pasarela (`site/js/checkout.js` + `site/js/course-data.js`) ya elige moneda, método y proveedor; los proveedores reales se conectan después (ver «Para pasar a producción»).

## Ruta de cobro más barata (comisión estimada por método)
| Comprador | Moneda | Método | Proveedor | Comisión estimada | En un plan de USD 25,90 |
|---|---|---|---|---|---|
| Paraguay | Gs | Tarjeta | Pagopar | ≈ 3% crédito · 2% débito | ≈ USD 0,78 |
| Paraguay | Gs | QR / transferencia | Pagopar | ≈ 2% | ≈ USD 0,52 |
| Brasil | R$ | **PIX** | Pagopar (QR Pix) | ≈ 2,9% | ≈ USD 0,75 |
| Brasil | R$ | Tarjeta | Hotmart | 9,9% + fija | ≈ USD 3,06 |
| Otros países | USD | Tarjeta | Hotmart | 9,9% + fija | ≈ USD 3,06 |

**Ahorro:** cada venta mensual por QR/PIX/tarjeta local cuesta ≈ USD 0,5–0,8 de comisión contra ≈ USD 3,06 en Hotmart (≈ −75%). Las cifras vienen de fuentes secundarias (Pagopar: blog; Hotmart: blogs y centro de ayuda): **confirmar con cada proveedor y verificar que acepten persona física.** Las tarifas están en `ROUTES` (`course-data.js`).

## Qué hace la pasarela para ser atractiva
- **Detecta el país** (zona horaria / idioma) y muestra los precios en su moneda: Gs, R$ o USD, con selector manual.
- **Precios locales redondeados** (Gs 149.000 · 749.000 · 1.249.000 / R$ 139,90 · 699,90 · 1.189,90 / USD 25,90 · 129,90 · 219,90). Revisarlos cada trimestre: el guaraní se apreció ≈ 10% en 2026.
- **Método preferido por país:** Brasil entra por **PIX**; Paraguay ofrece tarjeta o **QR/transferencia**; resto del mundo, tarjeta.
- **PIX/QR sin tarjeta internacional**, con código y «copiar código», sin renovación automática: se paga el período elegido y se avisa antes de que venza (encaja con los planes semestral y anual).
- Descuento por plan visible en la moneda del alumno (≈ −16/−17% semestral y ≈ −29/−30% anual), garantía de 7 días y recibo inmediato.

## Para pasar a producción (requiere cuentas de la titular)
1. **Pagopar/Bancard:** crear comercio, obtener claves, endpoint `POST /api/checkout/{proveedor}` que cree la orden y devuelva el QR/URL de pago; **webhook** de confirmación → `saveSub` con `current_period_end` según el plan (pago único: sin renovación).
2. **Hotmart (tarjeta USD y R$):** webhook de compra aprobada/cancelación/reembolso → activar/revocar acceso (modelo híbrido).
3. Registrar proveedor, moneda y método en la suscripción (hoy se guarda solo la marca: `PIX`, `QR`, `VISA`…).
4. Recordatorio por correo 7 días antes del vencimiento de los pagos no recurrentes.
5. Confirmar impuestos, facturación y retenciones con el contador (ver `proposta/`).

## ¿Puede vender como persona física? Verificación (31/10/2026)
Los sitios oficiales no pudieron consultarse desde el entorno de trabajo; el estado se basa en búsquedas y guías de terceros. **Nada de esto es confirmación oficial.**

| Proveedor | ¿Persona física? | Lo que se encontró | Estado |
|---|---|---|---|
| **Pagopar** | Probablemente **sí** | Una guía de terceros (centro de ayuda de Waclis, ≈ 11 meses de antigüedad) dice que se puede usar Pagopar «como persona física, sin una empresa legalmente constituida», subiendo los documentos que pida según el tipo de comercio; no los lista. Pagopar puede pedir documentos adicionales y suspender cuentas cuyos datos no pueda verificar. | Probable · confirmar |
| **Bancard** (tarjetas y PIX) | **Sin confirmar** | Para PIX, el comercio debe estar adherido a la red y tener cuenta bancaria **en dólares** (nota de 2024). Para vPOS (e-commerce) los requisitos «se acuerdan con la empresa». Para facturar desde el POS se pide RUC activo y estar al día con la DNIT. No hay fuente sobre si afilian persona física sin local. | Sin confirmar · consultar |
| **Hotmart** | Ya la usa | La profesora ya vende allí. Regla general de su ayuda: la cuenta bancaria debe estar en el mismo país de residencia registrado; retiros en USD/EUR (HotPay Internacional, mínimo ≈ USD 50 + tarifas, según artículos de otros países). No se encontró confirmación específica para Paraguay. | Operativa hoy · confirmar retiro |
| **dLocal / EBANX** | Sin confirmar | Orientadas a empresas; condiciones a medida. | Consultar |
| **Stripe** | **No** (según fuentes secundarias) | No abre cuentas con domicilio en Paraguay (confirmar en stripe.com/global). | No disponible |

**RUC de persona física:** es gratuito y en línea con la cédula (DNIT/Marangatu). Es el requisito mínimo que casi todos piden; para facturar con Bancard se exige RUC activo y al día.

### Mensaje para enviar a Pagopar, Bancard y dLocal (copiar y pegar)
> Hola, soy [NOMBRE], docente de Bioquímica, y vendo un curso en línea por suscripción (mensual, semestral y anual) en mi propia plataforma. Quisiera saber: 1) ¿Puedo afiliarme como **persona física con RUC**, sin empresa constituida? 2) ¿Qué documentos piden? 3) ¿Aceptan **cobros por QR y PIX** y qué comisión aplican? 4) ¿Ofrecen **cobros recurrentes** con tarjeta (suscripción) y reintentos? 5) ¿En qué moneda y en cuánto tiempo acreditan? ¿Piden cuenta en dólares? 6) ¿Cómo manejan reembolsos y contracargos? 7) ¿Tienen API/webhook para confirmar pagos automáticamente en mi sitio? Muchas gracias.

### Qué pasa en la plataforma según la respuesta
- **Aceptan persona física:** se activa la ruta barata tal como está en `ROUTES`.
- **Exigen empresa:** o se constituye la EAS (ver `proposta/flujograma-decision.pdf`, rama `claude/proposta-comercial`), o se mantiene todo en Hotmart (modelo híbrido) hasta que haya volumen.
