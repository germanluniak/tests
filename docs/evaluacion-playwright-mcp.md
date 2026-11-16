# Evaluación · Playwright MCP

Fecha: 16 nov 2026. Alcance: repo de la práctica MiniModa (checkout de demo). No se instaló el servidor.

## Fuente

- Repositorio: https://github.com/microsoft/playwright-mcp
- Paquete: `@playwright/mcp` (el README de instalación usa `npx @playwright/mcp@latest`)
- Qué es: un servidor MCP que le da al agente herramientas de browser (snapshot de accesibilidad, click, tipeo, navegación) sobre Playwright.

No es el runner de esta práctica. Los tests de `tests/pago.spec.ts` corren con `@playwright/test` (`npx playwright test`). El MCP no los ejecuta ni los reemplaza.

El propio README distingue MCP y CLI: el MCP mantiene un browser abierto para exploración; para un agente de código suele convenir menos porque carga esquemas de tools y árboles de accesibilidad en la ventana de contexto.

## Permisos

Instalarlo suma un proceso local (`npx`) que abre un browser controlado por el agente. Con la config estándar del README:

- Las tools de core no son de solo lectura: pueden navegar, clickear, tipear, arrastrar, leer la consola y cerrar el browser.
- El perfil es persistente por defecto y se guarda en disco. `--isolated` lo deja en memoria. La extensión puede engancharse a un Chrome o Edge ya abierto, con la sesión que ese browser tenga.
- Orígenes: por defecto se permite pedir cualquier origen. `--allowed-origins` y `--blocked-origins` no son un límite de seguridad y no cubren redirects.
- Capabilities extra, apagadas por defecto: `vision`, `pdf`, `devtools`.
- Se pueden conceder permisos del contexto (`geolocation`, `clipboard-read`, `clipboard-write`) y desactivar la sandbox del browser (`--no-sandbox`).
- El filtrado de secretos y de parámetros de URL es una comodidad, no un control de seguridad.
- El límite de archivos del workspace tampoco es un límite de seguridad: el README pide apoyarse en los permisos del cliente.

El README lo dice directo: Playwright MCP no es un security boundary.

## Beneficios

1. El agente puede leer el checkout real (roles y textos del árbol de accesibilidad) y contrastar locators con la UI, en lugar de inventar copy.
2. La interacción es estructurada, sin modelo de visión: sirve para recorrer la demo y anotar el resultado de PAGO-01 y PAGO-0X.
3. La sesión de browser queda abierta entre pasos, útil si hubiera que explorar un flujo largo antes de fijar el caso en `casos/pago.md`.

## Riesgos

1. El agente pasa a poder actuar en cualquier sitio que abra el browser. En esta práctica el único destino permitido es la demo de MiniModa, con datos sintéticos. Un origen mal acotado mezcla esa demo con otras páginas y mete su contenido en el contexto del modelo.
2. El perfil persistente y la extensión reutilizan cookies y sesión. Una corrida puede arrastrar estado de otra, o engancharse a un browser personal.
3. No aporta la evidencia que pide el PR. Un snapshot del agente no sustituye `npx playwright test` ni las assertions de la UI. Además `@latest` no fija versión, y el árbol de accesibilidad gasta contexto sin correr la suite.

## Decisión

No instalar Playwright MCP en este repo.

Los casos ya están observados en `casos/pago.md` y cubiertos por `tests/pago.spec.ts` contra https://minimoda-navy.vercel.app/checkout. `AGENTS.md` pide confirmación antes de agregar dependencias. Sumar el MCP ahora ampliaría permisos sin cambiar lo que la suite demuestra.

Si más adelante se incorpora, hace falta un pedido explícito y una config acotada: solo la demo, `--isolated`, sin `--no-sandbox`, sin la extensión del browser personal y sin secretos en archivos del repo.
