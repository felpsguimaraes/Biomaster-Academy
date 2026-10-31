/* Adaptador Pagopar (API Pública). ESQUELETO: los endpoints, el cálculo del hash y el formato del webhook
   deben completarse con la documentación oficial de Pagopar (no pudo consultarse al escribir este archivo).
   Mientras no existan PAGOPAR_PUBLIC_KEY y PAGOPAR_PRIVATE_KEY, el proveedor queda deshabilitado.
   Contrato:
     start(env, order, user)  → { type:'redirect', url } | { type:'qr', code, url? }  y guarda order.provider_ref
     parseWebhook(env, req)   → { orderRef, paid:boolean }  (verificando la autenticidad del aviso) */
import { HttpError } from '../lib.js';
export const pagopar = {
  id: 'pagopar',
  enabled: (env) => !!(env.PAGOPAR_PUBLIC_KEY && env.PAGOPAR_PRIVATE_KEY),
  async start() { throw new HttpError(501, 'Integración con Pagopar pendiente de completar según su documentación.'); },
  async parseWebhook() { throw new HttpError(501, 'Webhook de Pagopar pendiente de completar según su documentación.'); },
};
