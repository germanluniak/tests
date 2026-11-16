# Casos de checkout MiniModa

Demo: https://minimoda-navy.vercel.app/checkout

Datos sintéticos. Sin tarjetas ni datos reales. Las tarjetas de abajo son las de prueba que la propia demo lista como «Aprueban».

Observado en la página (formulario) y en el texto que la demo renderiza. No se hizo un submit en el navegador: el resultado de una corrida real queda A VERIFICAR.

## Campos observados

- Nombre
- Dirección
- Email
- País de envío (Argentina viene seleccionada; el costo de envío visible es $ 3.500)
- Número de tarjeta (placeholder «16 dígitos»)
- Vencimiento (MM/AA) (hint «Formato MM/AA.»)
- CVV (placeholder «3 o 4 dígitos»)
- Botón «Confirmar compra»
- El resumen dice «Todavía no hay prendas en el carrito.» El formulario igual está en la página.

## PAGO-01 · Compra válida

Precondiciones: checkout de la demo, carrito vacío como lo muestra la página, solo datos sintéticos.

Pasos:

1. Abrir https://minimoda-navy.vercel.app/checkout
2. Completar Nombre `Ana Demo`, Dirección `Calle Falsa 123`, Email `ana.demo@example.com`, País de envío `Argentina`
3. Completar Número de tarjeta `4111111111111111`, Vencimiento `12/30`, CVV `123`
4. Pulsar «Confirmar compra»

Esperado observado en el texto de la UI: una caja con `role="status"` que contiene «Compra confirmada. Orden», un id `MM-` seguido de dígitos, y «Envío a Argentina».

Corrida: `npx playwright test tests/pago.spec.ts` en Chromium, 13 nov 2026. PAGO-01 pasó y el aviso quedó visible.

## PAGO-0X · CVV corto

Precondiciones: las mismas que PAGO-01.

Pasos: los mismos, con CVV `12` en lugar de `123`.

Esperado observado en el texto de la UI: un aviso con `role="alert"` y el texto «El CVV debe tener 3 o 4 dígitos.» No debe mostrarse la caja de compra confirmada.

Corrida: la misma suite. PAGO-0X pasó y el aviso quedó visible. El nombre accesible del `alert` no coincide con el texto, así que el spec filtra por el texto observado.
