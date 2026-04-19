# Arquitectura Técnica - Mi Contador de Bolsillo

## Visión General

Mi Contador de Bolsillo es un asistente conversacional para microcomerciantes ecuatorianos. El usuario pregunta en lenguaje natural sobre ventas, clientes, tendencias o productos, y la aplicación responde con números exactos, explicaciones simples y visualizaciones cuando aportan claridad.

El principio técnico central es **determinístico primero**: el backend calcula las métricas desde `server/src/data/transactions.json`; el LLM no suma ni consulta el dataset completo. La IA se usa para clasificar preguntas ambiguas y reformular resultados en español claro.

## Stack Tecnológico

| Capa | Tecnología | Uso |
|---|---|---|
| Frontend | Angular 20 standalone | Chat tipo app móvil, modo Simple/Pro, entrada por voz y visualizaciones. |
| Backend | Node.js + Express + TypeScript | API REST, intents, analítica y conexión al LLM. |
| Datos | JSON en memoria | Dataset sintético de transacciones. |
| IA / LLM | OpenAI GPT-4o-mini | Reformulación, clasificación fallback y límites de dominio. |
| Fallback | NoOpProvider | Respuestas directas calculadas cuando no hay API key. |
| Voz | Web Speech API | Entrada por voz en navegador. |

## Arquitectura

```text
Usuario
  |
  v
Frontend Angular
  - Chat UI
  - Voz
  - Toggle Simple/Pro
  - Render de gráficos
  |
  v
POST /api/chat { message, mode, merchantId }
  |
  v
Backend Express
  |
  +--> Intent Router
  |     - Regex
  |     - Keywords
  |     - LLM fallback si hay baja confianza
  |
  +--> Analytics Engine determinístico
  |     - Filtra y agrega transacciones completadas
  |     - Calcula ventas, ticket, clientes, productos, tendencias
  |
  +--> LLM Adapter
  |     - Reformula labels calculados
  |     - No recibe el dataset completo
  |
  v
Respuesta { answer, detectedIntent, metricsUsed, visualization, suggestedFollowUps }
```

## Dataset

El JSON contiene 3 comercios y 15,042 transacciones totales. Para la demo, `data-loader.ts` fuerza `m001` para mantener el prototipo estable sobre Tienda Don Pepe.

| Comercio | Categoría | Transacciones totales | Completadas | Ventas completadas |
|---|---:|---:|---:|---:|
| Tienda Don Pepe (`m001`) | abarrotes | 2,962 | 2,827 | $118,048.67 |
| Café Internet Mary (`m002`) | servicios | 4,777 | 4,548 | $56,277.58 |
| Restaurante Doña Lupita (`m003`) | restaurante | 7,303 | 6,921 | $157,519.90 |

## Motor Analítico

El motor en `server/src/analytics/analytics.engine.ts` calcula todas las métricas:

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

## LLM y Prompts

El proveedor principal es `OpenAIProvider` con `gpt-4o-mini`. El prompt de reformulación indica:

- No inventar datos ni métricas.
- Hablar en segunda persona.
- Usar tono amigable y profesional.
- En modo Simple, responder en 1-2 oraciones.
- En modo Pro, explicar con más contexto.
- Evitar jerga financiera.
- Priorizar frases accionables.

El prompt de clasificación exige responder solo con el nombre del intent y ser tolerante a errores ortográficos. El prompt de consultas generales permite cálculos útiles de caja y rechaza preguntas fuera del contexto de negocio.

## Modos

| Modo | Descripción |
|---|---|
| `simple` | Respuesta breve para baja carga cognitiva. |
| `complete` / Pro | Más contexto, recomendaciones y visualización cuando aplica. |

## Manejo de Errores

| Caso | Manejo |
|---|---|
| Mensaje vacío | HTTP 400. |
| Intent desconocido | Respuesta guiada o sugerencias. |
| Error de LLM | Se usa el label determinístico. |
| Sin API key | Se usa NoOpProvider. |
| Fecha sin datos | Respuesta explícita sin inventar ventas. |
| Pregunta fuera de dominio | Rechazo cordial y foco en ventas/negocio. |
| Error interno | HTTP 500 con mensaje controlado. |

## Validación

La validación principal se ejecuta con `node run_tests.js` y se documenta en `Set_Pruebas_15_Preguntas_4NOVA_DeUna.pdf`.

| Grupo | Resultado |
|---|---|
| 15 preguntas principales de negocio | 15 / 15 |
| Anexos de barreras y modos | 7 / 7 |
| Acierto principal | 100% |

## Limitaciones

- El backend fuerza `m001`; el selector multi-comercio está listo en interfaz, pero no habilitado en datos.
- El dataset es local y estático.
- La caché es en memoria.
- Las visualizaciones son simples a propósito para microcomerciantes.
