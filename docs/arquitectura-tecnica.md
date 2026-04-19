# Arquitectura Técnica - Mi Contador de Bolsillo

## Visión General

Mi Contador de Bolsillo es un asistente conversacional para microcomerciantes ecuatorianos. El usuario pregunta en lenguaje natural sobre ventas, clientes, tendencias, ticket promedio o productos, y la aplicación responde con datos exactos, lenguaje simple y visualizaciones cuando aportan claridad.

El principio técnico central es **determinístico primero**: el backend calcula las métricas desde `server/src/data/transactions.json`; el LLM no suma ni consulta el dataset completo. La IA se usa para clasificar preguntas ambiguas y reformular resultados en español claro.

## Stack

| Capa | Tecnología | Uso |
|---|---|---|
| Frontend | Angular 20 standalone | Chat, modo Simple/Pro, voz y visualizaciones. |
| Backend | Node.js + Express + TypeScript | API REST, intents, analítica y LLM adapter. |
| Datos | JSON en memoria | Dataset sintético de transacciones. |
| IA / LLM | OpenAI GPT-4o-mini configurable | Reformulación, clasificación fallback y límites de dominio. |
| Fallback | NoOpProvider | Respuestas directas si no hay API key. |
| Fechas | `date-utils.ts` | Fecha real de Ecuador para "hoy", "ayer", semana y mes. |

## Flujo Principal

```text
Usuario
  -> Frontend Angular
  -> POST /api/chat { message, mode, merchantId }
  -> chat.routes.ts
  -> Intent Router
  -> Analytics Engine determinístico
  -> LLM Adapter
  -> Respuesta { answer, detectedIntent, metricsUsed, visualization, suggestedFollowUps }
```

## Fechas Relativas

La lógica de fecha ya no usa una fecha quemada ni la última fecha del dataset. `getCurrentEcuadorDate()` obtiene la fecha real de Ecuador (`America/Guayaquil`) y esa referencia se usa para:

| Expresión | Manejo |
|---|---|
| hoy / día de hoy | Fecha real de Ecuador. |
| ayer / aller | Fecha real menos un día. |
| anteayer | Fecha real menos dos días. |
| esta semana | Semana actual de lunes a domingo. |
| este mes | Mes calendario actual. |
| fecha explícita | Se respeta tal como la pidió el usuario. |

## Dataset

El JSON contiene 3 comercios y 15,042 transacciones totales. Para la demo, `data-loader.ts` fuerza `m001` para mantener el prototipo estable sobre Tienda Don Pepe.

| Comercio | Categoría | Transacciones totales | Completadas | Ventas completadas |
|---|---:|---:|---:|---:|
| Tienda Don Pepe (`m001`) | abarrotes | 2,962 | 2,827 | $118,048.67 |
| Café Internet Mary (`m002`) | servicios | 4,777 | 4,548 | $56,277.58 |
| Restaurante Doña Lupita (`m003`) | restaurante | 7,303 | 6,921 | $157,519.90 |

`data-loader.ts` también busca el JSON en rutas compatibles con `src` y `dist`, para que el backend pueda correr después de `npm run build`.

## Motor Analítico

| Función | Métrica |
|---|---|
| `getSalesToday`, `getSalesForDate` | Ventas de hoy o fecha específica |
| `getSalesForPeriod`, `getSalesForYear` | Semana, mes y año |
| `comparePeriods` | Mes actual vs mes anterior |
| `getBestDay`, `getWorstDay` | Días extremos |
| `getAverageTicket` | Ticket promedio |
| `getChurnRisk`, `getRepeatCustomers` | Clientes en riesgo y frecuentes |
| `getDayOfWeekAnalysis` | Días fuertes y flojos |
| `getSalesTrend`, `detectSignificantChange` | Tendencia y cambios relevantes |
| `getTopProducts`, `getPaymentBreakdown` | Categorías y métodos de pago |

## LLM y Barreras

El LLM tiene tres usos controlados:

- Reformular labels calculados por backend.
- Clasificar intents cuando las reglas tienen baja confianza.
- Responder saludos/cálculos útiles y rechazar preguntas fuera del negocio.

Aunque OpenAI pueda responder temas generales, el chatbot debe mantenerse en ventas, clientes, caja, productos y salud del negocio.

## Modos

| Modo | Descripción |
|---|---|
| `simple` | Respuesta breve para baja carga cognitiva. |
| `complete` / Pro | Más contexto, recomendaciones y visualización cuando aplica. |

## Validación

La validación se ejecuta con `node run_tests.js`. El runner calcula expectativas dinámicas desde `transactions.json` y la fecha real de Ecuador.

| Grupo | Resultado |
|---|---|
| 15 preguntas principales de negocio | 15 / 15 |
| Anexos de barreras y modos | 7 / 7 |
| Acierto principal | 100% |

## Limitaciones

- El backend fuerza `m001`; el selector multi-comercio está listo visualmente, pero no activo en datos.
- El dataset es local y estático.
- La caché es en memoria.
- Las visualizaciones son simples a propósito para microcomerciantes.
- Para producción faltan autenticación, permisos por comercio e integración con API real de DeUna.
