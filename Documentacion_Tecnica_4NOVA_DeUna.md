<style>
  @page { margin: 1.15cm; size: A4 landscape; }
  body {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 10px;
    line-height: 1.35;
    color: #222;
  }
  h1 {
    font-size: 22px;
    color: #111;
    border-bottom: 3px solid #eb0029;
    padding-bottom: 6px;
    margin: 0 0 10px;
  }
  h2 {
    font-size: 15px;
    color: #26384a;
    margin: 15px 0 7px;
  }
  h3 {
    font-size: 12px;
    margin: 10px 0 5px;
    color: #111;
  }
  p { margin: 5px 0; }
  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    margin-top: 7px;
  }
  th, td {
    border: 1px solid #d7d7d7;
    padding: 5px;
    vertical-align: top;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  th {
    background: #f1f4f8;
    color: #111;
    font-weight: 700;
  }
  tr { page-break-inside: avoid; }
  code {
    font-size: 8.5px;
    background: #f6f6f6;
    padding: 1px 3px;
    border-radius: 3px;
  }
  .note {
    border-left: 4px solid #eb0029;
    background: #fff7f8;
    padding: 7px 9px;
    margin: 8px 0;
  }
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .meta td:first-child,
  .decision td:first-child {
    width: 24%;
    background: #fafafa;
    font-weight: 700;
  }
  .diagram {
    display: grid;
    grid-template-columns: 1fr 0.12fr 1fr 0.12fr 1fr 0.12fr 1fr;
    gap: 5px;
    align-items: stretch;
    margin: 8px 0;
  }
  .box {
    border: 1px solid #cfd7e2;
    border-radius: 6px;
    padding: 7px;
    background: #fbfcfe;
    min-height: 72px;
  }
  .box strong {
    display: block;
    color: #111;
    margin-bottom: 3px;
  }
  .arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #eb0029;
    font-weight: 700;
    font-size: 18px;
  }
  .flow {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 5px;
    margin: 8px 0;
  }
  .flow .box { min-height: 56px; }
  .small { font-size: 8.4px; color: #444; }
  .compact { font-size: 8.1px; }
</style>

# Documentación Técnica Breve

**Proyecto:** Mi Contador de Bolsillo - DeUna  
**Equipo:** 4NOVA  
**Entregable:** Documento corto con arquitectura, modelo/LLM, prompts, conexión al dataset y manejo de errores.  
**Fecha:** 19 de abril de 2026  
**Estado:** Prototipo funcional con interfaz chat, voz, modo Simple/Pro, analítica determinística y reformulación con IA.

## 1. Visión general

Mi Contador de Bolsillo es un asistente conversacional para microcomerciantes ecuatorianos. El usuario pregunta en lenguaje natural sobre ventas, clientes, tendencias o productos, y la aplicación responde con números exactos, explicaciones simples y visualizaciones cuando ayudan a entender el negocio.

El principio técnico central es **determinístico primero**: el backend calcula las métricas directamente desde `transactions.json`; el LLM no suma ni consulta el dataset completo. La IA se usa para clasificar preguntas ambiguas y reformular resultados en español claro, evitando jerga financiera.

<div class="note">
Objetivo de negocio: ayudar a personas sin educación financiera formal a tomar decisiones reales, como saber cuánto vendieron, qué días son fuertes, qué productos impulsan ingresos, qué clientes son frecuentes y qué acción conviene tomar.
</div>

## 2. Stack tecnológico

| Capa | Tecnología | Uso dentro del prototipo |
|---|---|---|
| Frontend | Angular 20 standalone | Chat tipo app móvil DeUna, modo Simple/Pro, entrada por texto/voz y visualizaciones CSS. |
| Backend | Node.js + Express + TypeScript | API REST, enrutamiento de intents, analítica de negocio y conexión al LLM. |
| Datos | JSON en memoria | Dataset sintético de transacciones cargado desde `server/src/data/transactions.json`. |
| IA / LLM | OpenAI GPT-4o-mini | Reformulación natural, clasificación fallback y respuesta controlada ante preguntas generales. |
| Fallback sin IA | NoOpProvider | Permite operar sin API key, devolviendo respuestas directas calculadas por backend. |
| Voz | Web Speech API | Captura de voz en navegador para reducir barreras de escritura. |
| Visualizaciones | CSS/HTML en Angular | Barras, líneas, tablas y distribución tipo pastel/progreso sin librerías pesadas. |

## 3. Diagrama de arquitectura

<div class="diagram">
  <div class="box">
    <strong>Frontend Angular</strong>
    Chat UI, input de voz, toggle Simple/Pro, render de tablas y gráficos.
  </div>
  <div class="arrow">→</div>
  <div class="box">
    <strong>API Express</strong>
    `POST /api/chat`, valida mensaje, selecciona comercio y coordina el flujo.
  </div>
  <div class="arrow">→</div>
  <div class="box">
    <strong>Intent Router</strong>
    Regex + keywords. Si hay baja confianza, usa LLM para clasificar.
  </div>
  <div class="arrow">→</div>
  <div class="box">
    <strong>Analytics Engine</strong>
    Calcula ventas, tendencias, clientes, ticket, productos y alertas desde JSON.
  </div>
</div>

<div class="diagram">
  <div class="box">
    <strong>Dataset JSON</strong>
    3 comercios, 15,042 transacciones totales; prototipo fuerza `m001`.
  </div>
  <div class="arrow">→</div>
  <div class="box">
    <strong>Resultado exacto</strong>
    `{ value, label, metricsUsed, visualization }`.
  </div>
  <div class="arrow">→</div>
  <div class="box">
    <strong>LLM Adapter</strong>
    Reformula el label calculado; no recibe el dataset completo.
  </div>
  <div class="arrow">→</div>
  <div class="box">
    <strong>Respuesta final</strong>
    Texto claro, follow-ups y visualización si aplica.
  </div>
</div>

## 4. Flujo de una consulta

<div class="flow">
  <div class="box"><strong>1. Usuario</strong>Pregunta: "¿Cuál es mi ticket promedio?"</div>
  <div class="box"><strong>2. Frontend</strong>Envía `{ message, mode, merchantId }`.</div>
  <div class="box"><strong>3. Intent</strong>Detecta `average_ticket`.</div>
  <div class="box"><strong>4. Cálculo</strong>Suma transacciones y divide por conteo.</div>
  <div class="box"><strong>5. LLM</strong>Reformula el resultado en lenguaje natural.</div>
  <div class="box"><strong>6. UI</strong>Muestra respuesta y sugerencias.</div>
</div>

El endpoint principal es `POST /api/chat`. La respuesta devuelve:

| Campo | Descripción |
|---|---|
| `answer` | Respuesta final para el usuario. |
| `mode` | `simple` o `complete`. |
| `detectedIntent` | Intent clasificado por reglas o LLM. |
| `confidence` | Confianza del clasificador. |
| `metricsUsed` | Métricas determinísticas usadas. |
| `suggestedFollowUps` | Preguntas sugeridas para continuar. |
| `visualization` | `bar`, `line`, `pie`, `table` o `null`. |

## 5. Dataset y conexión a datos

El archivo `server/src/data/data-loader.ts` carga `transactions.json`, normaliza el formato y filtra transacciones completadas. Para esta demo, aunque el JSON contiene tres comercios, el backend fuerza `m001` para garantizar una presentación estable sobre Tienda Don Pepe.

| Comercio | Categoría | Transacciones totales | Completadas | Ventas completadas | Rango |
|---|---:|---:|---:|---:|---|
| Tienda Don Pepe (`m001`) | abarrotes | 2,962 | 2,827 | $118,048.67 | 2024-01-01 a 2026-04-19 |
| Café Internet Mary (`m002`) | servicios | 4,777 | 4,548 | $56,277.58 | 2024-01-01 a 2026-04-19 |
| Restaurante Doña Lupita (`m003`) | restaurante | 7,303 | 6,921 | $157,519.90 | 2024-01-01 a 2026-04-19 |

<table class="decision">
  <tr><td>Conexión actual</td><td>Lectura local en memoria con `readFileSync`, suficiente para prototipo y demo rápida.</td></tr>
  <tr><td>Ruta de migración</td><td>Reemplazar solo `data-loader.ts` por llamadas a APIs internas de DeUna, conservando intents y motor analítico.</td></tr>
  <tr><td>Privacidad</td><td>El dataset completo no se envía al LLM. Solo se envían labels calculados, como "Vendiste $1,332.61 en 30 ventas".</td></tr>
</table>

## 6. Motor analítico determinístico

El motor en `server/src/analytics/analytics.engine.ts` contiene funciones puras que filtran, agrupan y calculan métricas. Esto evita que el LLM haga aritmética y garantiza consistencia de números.

| Función | Qué calcula | Visualización |
|---|---|---|
| `getSalesToday` / `getSalesForDate` | Ventas de hoy o fecha específica, total y conteo. | Barra por hora |
| `getSalesForPeriod` | Ventas de semana o mes actual. | Barra por día |
| `getSalesForYear` | Total anual y cantidad de transacciones. | Línea mensual |
| `comparePeriods` | Mes actual vs mes anterior, diferencia y variación. | Barra comparativa |
| `getBestDay` / `getWorstDay` | Días extremos del historial. | Sin gráfica |
| `getAverageTicket` | Ticket promedio por venta. | Sin gráfica |
| `getChurnRisk` | Clientes frecuentes sin compras en 30+ días. | Tabla si hay riesgo |
| `getRepeatCustomers` | Clientes por frecuencia y total gastado. | Tabla |
| `getDayOfWeekAnalysis` | Promedio por día de la semana. | Barra |
| `getSalesTrend` / `detectSignificantChange` | Tendencia de últimos 14 días y variación. | Línea |
| `getTopProducts` | Categorías líderes por ventas. | Pastel/progreso |
| `getPaymentBreakdown` | Distribución por método de pago. | Pastel/progreso |

## 7. Intents soportados

El catálogo actual tiene 19 intents, superando el mínimo del reto. Cubre consultas de ventas, fechas, comparación, clientes, productos, pago, ayuda y saludos.

| Grupo | Intents |
|---|---|
| Ventas por tiempo | `sales_today`, `sales_specific_date`, `sales_specific_year`, `sales_this_week`, `sales_this_month` |
| Comparación y tendencia | `sales_comparison`, `sales_trend`, `significant_change`, `best_day`, `worst_day`, `strong_weak_days` |
| Clientes | `customer_churn`, `repeat_customers` |
| Producto y pago | `top_products`, `payment_methods`, `average_ticket` |
| Asistencia | `proactive_alert`, `greeting`, `help` |

El router aplica tres niveles: primero patrones regex con confianza alta, luego keywords ponderadas y, si la confianza es baja, clasificación por LLM cuando está disponible.

## 8. Modelo LLM y prompts

El proveedor principal es `OpenAIProvider` con modelo configurable por `LLM_MODEL`; por defecto usa `gpt-4o-mini`. El adaptador tiene tres responsabilidades:

| Uso del LLM | Prompt / regla clave | Por qué aporta valor |
|---|---|---|
| Reformulación | "Eres un asistente financiero amigable para microcomerciantes en Ecuador"; no inventar datos; segunda persona; breve en Simple; más contexto en complete; sin jerga financiera. | Convierte números en lenguaje entendible para el comerciante. |
| Clasificación fallback | Responder solo el nombre del intent; tolerar errores ortográficos; priorizar hoy, fechas específicas, días de semana, semana y mes. | Captura lenguaje informal como "caunto bendi aller". |
| Consulta general | Acepta saludos y cálculos útiles de ventas; rechaza preguntas fuera del negocio. | Mantiene foco del producto y reduce respuestas irrelevantes. |

El sistema también incluye `NoopProvider`: si no hay API key o se desactiva OpenAI, la app sigue funcionando con labels calculados por backend.

## 9. Modos Simple y Pro

| Modo | Comportamiento | Caso de uso |
|---|---|---|
| Simple (`simple`) | Respuesta corta de 1-2 frases. Muestra visualizaciones para consultas clave como hoy, fecha, semana, mes o tendencia. | Comerciante que quiere una respuesta rápida mientras atiende. |
| Pro (`complete`) | Respuesta con contexto adicional, recomendación y visualización siempre que el intent la soporte. | Evaluación, análisis y toma de decisiones con más detalle. |

La interfaz muestra un toggle "PRO". El backend recibe el modo y lo pasa al LLM para controlar extensión y tono.

## 10. Visualizaciones

Las visualizaciones se generan en el backend como datos estructurados y se renderizan en Angular:

| Tipo | Uso | Ejemplo |
|---|---|---|
| `bar` | Ventas por día, semana, mes o promedio por día. | "¿Cuánto vendí esta semana?" |
| `line` | Tendencias o ventas anuales. | "¿Cómo va la tendencia?" |
| `table` | Clientes frecuentes o clientes en riesgo. | "¿Quiénes me compran más?" |
| `pie` | Categorías o métodos de pago. | "¿Qué es lo que más vendo?" |

Esto evita dashboards complejos: el gráfico aparece solo cuando ayuda a entender el resultado.

## 11. Manejo de errores y casos borde

| Caso | Manejo implementado |
|---|---|
| Mensaje vacío | `POST /api/chat` responde 400 con "El mensaje no puede estar vacío". |
| Intent desconocido | Si hay LLM, responde dentro del dominio; si no, sugiere preguntas válidas. |
| Fecha relativa | `ayer` y `aller` se resuelven con `extractDateFromMessage`. |
| Fecha no parseada | En `sales_specific_date`, si no puede extraer fecha, usa ventas del mes como fallback. |
| Sin datos para una fecha | Devuelve "No se encontraron ventas..." y no inventa gráfico. |
| Clientes sin churn | Responde que todos los clientes frecuentes compraron recientemente. |
| Error de OpenAI | Se captura el error y se devuelve el label determinístico original. |
| Sin API key | Usa `NoopProvider`, manteniendo funcionalidad básica. |
| Pregunta fuera de dominio | Rechazo cordial: el asistente se limita a ventas y salud del negocio. |
| Error interno | Respuesta HTTP 500 con "Error procesando tu pregunta". |

## 12. Alertas proactivas

El módulo `server/src/alerts/proactive-alerts.ts` genera insights sin que el usuario pregunte. Evalúa:

| Alerta | Regla |
|---|---|
| Caída de ventas | Variación reciente menor a -15%. |
| Ventas en subida | Variación reciente mayor a 20%. |
| Dependencia de cliente | Un cliente concentra más de 30% de ventas. |
| Clientes en riesgo | Cliente frecuente sin compra en más de 30 días. |
| Día fuerte/flojo | Sugiere promociones en el día con menor promedio. |

En la corrida actual de Tienda Don Pepe, el consejo proactivo destaca una subida reciente de 20.4%, martes como día fuerte y domingo como día flojo.

## 13. Seguridad, costos y desempeño

<table class="decision">
  <tr><td>Precisión</td><td>Los cálculos no dependen del LLM. La IA solo reformula, por lo que no puede alterar la fuente de datos si el backend ya calculó el número.</td></tr>
  <tr><td>Costo</td><td>`LLMCache` guarda intents y reformulaciones por label, modo y comercio. Preguntas repetidas evitan llamadas innecesarias.</td></tr>
  <tr><td>Privacidad</td><td>El JSON completo permanece en servidor; al LLM solo viajan resultados resumidos.</td></tr>
  <tr><td>Latencia</td><td>Regex/keywords y lectura en memoria son rápidos. El LLM se usa como capa de lenguaje, no como motor analítico.</td></tr>
  <tr><td>Escalabilidad</td><td>La API es stateless salvo caché en memoria; puede migrar a contenedor y conectarse a APIs reales de DeUna.</td></tr>
</table>

## 14. Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/chat` | Procesa una pregunta y devuelve respuesta, intent, métricas, follow-ups y visualización. |
| `GET` | `/api/proactive-alert` | Devuelve la alerta proactiva principal del comercio. |
| `GET` | `/api/sample-questions` | Lista preguntas sugeridas para guiar al usuario. |
| `GET` | `/api/merchants` | Devuelve comercios disponibles; en demo se filtra a `m001`. |
| `GET` | `/api/health` | Verifica estado del backend. |

## 15. Validación del prototipo

La validación funcional está documentada en `Set_Pruebas_15_Preguntas_4NOVA_DeUna.pdf` y se ejecuta con `node run_tests.js`.

| Grupo | Resultado |
|---|---|
| 15 preguntas principales de negocio | 15 / 15 correctas |
| Anexos de barreras y modos | 7 / 7 correctas |
| Acierto principal | 100% |
| Requisito mínimo | 80% |

## 16. Limitaciones actuales y siguientes pasos

| Limitación | Siguiente paso recomendado |
|---|---|
| El backend fuerza `m001` aunque el JSON tiene 3 comercios. | Habilitar selección real por `merchantId` en `data-loader.ts`. |
| Dataset estático local. | Reemplazar por API transaccional DeUna manteniendo el contrato de `Transaction`. |
| Caché en memoria no persiste entre reinicios. | Usar Redis o caché distribuida si escala a producción. |
| Métricas limitadas al dataset disponible. | Agregar costos, margen, inventario y comparaciones por canal cuando existan datos reales. |
| Visualizaciones CSS simples. | Mantenerlas simples para microcomercio, o migrar a una librería ligera si se requiere interacción avanzada. |

## 17. Conclusión técnica

La solución cumple el reto porque combina datos exactos con lenguaje natural accesible. La arquitectura separa responsabilidades: el backend calcula, el LLM explica y la interfaz muestra. Esta separación hace que el sistema sea confiable para decisiones de negocio, fácil de demostrar y viable de migrar a una integración real con DeUna.
