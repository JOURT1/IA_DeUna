<style>
  @page { margin: 0.95cm; size: A4 landscape; }
  body {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 9px;
    line-height: 1.34;
    color: #202124;
  }
  h1 {
    font-size: 24px;
    color: #111;
    border-bottom: 4px solid #eb0029;
    padding-bottom: 7px;
    margin: 0 0 10px;
  }
  h2 {
    font-size: 15px;
    color: #16243a;
    margin: 15px 0 8px;
  }
  h3 {
    font-size: 12px;
    color: #111;
    margin: 12px 0 6px;
  }
  p { margin: 5px 0; }
  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    margin-top: 7px;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  thead { display: table-header-group; }
  tr {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  th, td {
    border: 1px solid #d9dee7;
    padding: 5px;
    vertical-align: top;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }
  th {
    background: #eef2f7;
    color: #111;
    font-weight: 700;
  }
  code {
    font-size: 8px;
    background: #f3f5f8;
    padding: 1px 3px;
    border-radius: 3px;
  }
  .muted { color: #5c6675; font-size: 8px; }
  .hero,
  .note,
  .ok,
  .diagram,
  .flow,
  .metric-grid,
  .card-grid,
  .section-card,
  .timeline,
  .module-grid {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .hero {
    border: 1px solid #d9dee7;
    border-left: 7px solid #eb0029;
    background: #fbfcfe;
    padding: 13px 15px;
    margin: 8px 0 12px;
  }
  .hero-title {
    font-size: 16px;
    font-weight: 800;
    color: #111;
    margin-bottom: 5px;
  }
  .metric-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    margin: 10px 0 12px;
  }
  .metric {
    border: 1px solid #d9dee7;
    background: #fff;
    border-radius: 7px;
    padding: 9px;
  }
  .metric .value {
    font-size: 15px;
    font-weight: 800;
    color: #111;
  }
  .metric .label {
    color: #5c6675;
    font-size: 8px;
    margin-top: 2px;
  }
  .note {
    border-left: 5px solid #eb0029;
    background: #fff7f8;
    padding: 8px 10px;
    margin: 8px 0;
  }
  .ok {
    border-left: 5px solid #16833b;
    background: #f4fff7;
    padding: 8px 10px;
    margin: 8px 0;
  }
  .diagram {
    display: grid;
    grid-template-columns: 1fr 0.12fr 1fr 0.12fr 1fr 0.12fr 1fr;
    gap: 6px;
    align-items: stretch;
    margin: 8px 0;
  }
  .flow {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 6px;
    margin: 8px 0;
  }
  .module-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin: 8px 0;
  }
  .card-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin: 8px 0;
  }
  .box,
  .module,
  .card {
    border: 1px solid #ccd3df;
    background: #fbfcfe;
    border-radius: 7px;
    padding: 8px;
    min-height: 62px;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .box strong,
  .module strong,
  .card strong {
    display: block;
    color: #111;
    margin-bottom: 3px;
  }
  .arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #eb0029;
    font-weight: 800;
    font-size: 18px;
  }
  .section-card {
    border: 1px solid #d9dee7;
    border-radius: 8px;
    padding: 10px;
    margin: 10px 0;
    background: #ffffff;
  }
  .mini-table td:first-child {
    width: 24%;
    background: #fafafa;
    font-weight: 700;
  }
  .compact {
    font-size: 7.7px;
  }
  .page-break { page-break-before: always; }
</style>

# Documentación Técnica Breve

<div class="hero">
  <div class="hero-title">Mi Contador de Bolsillo: arquitectura confiable para preguntas de negocio</div>
  <p>El sistema permite que un microcomerciante pregunte en lenguaje natural sobre ventas, clientes, productos y tendencias. El backend calcula las métricas con reglas determinísticas sobre el dataset y el LLM solo ayuda a clasificar preguntas ambiguas y explicar los resultados en español claro.</p>
  <p>La solución está diseñada para personas sin educación financiera formal: responde con números exactos, visualizaciones simples y recomendaciones accionables, sin obligar al usuario a leer dashboards complejos.</p>
</div>

<div class="metric-grid">
  <div class="metric"><div class="value">Angular 20</div><div class="label">frontend chat, voz y gráficos</div></div>
  <div class="metric"><div class="value">Express TS</div><div class="label">API REST y orquestación</div></div>
  <div class="metric"><div class="value">19 intents</div><div class="label">ventas, clientes, productos y ayuda</div></div>
  <div class="metric"><div class="value">100%</div><div class="label">15 pruebas principales</div></div>
  <div class="metric"><div class="value">7/7</div><div class="label">anexos de barreras</div></div>
</div>

**Proyecto:** Mi Contador de Bolsillo - DeUna  
**Equipo:** 4NOVA  
**Entregable:** Documento corto con arquitectura, modelo/LLM, prompts, conexión al dataset y manejo de errores.  
**Fecha:** 19 de abril de 2026  
**Estado:** Prototipo funcional con interfaz chat, voz, modo Simple/Pro, analítica determinística, fechas relativas dinámicas y reformulación con IA.

## 1. Resumen Ejecutivo

La arquitectura separa con claridad las responsabilidades:

<div class="diagram">
  <div class="box"><strong>Interfaz Angular</strong>Chat, entrada por voz, selector visual, modo Simple/Pro y render de visualizaciones.</div>
  <div class="arrow">→</div>
  <div class="box"><strong>API Express</strong>Recibe la pregunta, valida payload, selecciona comercio y coordina intent, cálculo y LLM.</div>
  <div class="arrow">→</div>
  <div class="box"><strong>Motor determinístico</strong>Calcula ventas, tendencias, clientes, ticket, categorías y alertas desde JSON.</div>
  <div class="arrow">→</div>
  <div class="box"><strong>LLM controlado</strong>Reformula resultados ya calculados. No recibe el dataset completo ni inventa métricas.</div>
</div>

<div class="note">
Actualización importante: el proyecto ahora usa una utilidad centralizada de fecha real de Ecuador. Cuando el usuario dice "hoy", "ayer", "esta semana" o "este mes", la app calcula el periodo con <code>America/Guayaquil</code>; no usa una fecha quemada ni la última fecha del dataset.
</div>

## 2. Stack Tecnológico

| Capa | Tecnología | Uso dentro del prototipo |
|---|---|---|
| Frontend | Angular 20 standalone | Chat tipo app móvil DeUna, modo Simple/Pro, voz y visualizaciones. |
| Backend | Node.js + Express + TypeScript | API REST, intents, analítica, manejo de errores y conexión LLM. |
| Datos | JSON en memoria | Dataset sintético de transacciones en `server/src/data/transactions.json`. |
| IA / LLM | OpenAI GPT-4o-mini configurable | Reformulación natural, clasificación fallback y manejo de consultas generales. |
| Fallback sin IA | NoOpProvider | Respuestas directas y controladas si no hay API key o se desactiva OpenAI. |
| Caché | LLMCache en memoria | Evita llamadas repetidas al LLM por intent y reformulación. |
| Voz | Web Speech API | Reduce barreras de escritura para microcomerciantes. |
| Visualizaciones | HTML/CSS en Angular | Barras, líneas, tablas y pastel/progreso sin librerías pesadas. |

## 3. Arquitectura General

<div class="section-card">
  <div class="diagram">
    <div class="box"><strong>Usuario</strong>Pregunta en lenguaje natural: "¿Cuánto vendí esta semana?"</div>
    <div class="arrow">→</div>
    <div class="box"><strong>Frontend</strong>Envía <code>{ message, mode, merchantId }</code> a la API.</div>
    <div class="arrow">→</div>
    <div class="box"><strong>Chat Route</strong>Valida, detecta intent, ejecuta motor y arma respuesta.</div>
    <div class="arrow">→</div>
    <div class="box"><strong>Respuesta</strong>Devuelve answer, intent, métricas, follow-ups y visualización.</div>
  </div>
</div>

<div class="section-card">
  <div class="diagram">
    <div class="box"><strong>Dataset JSON</strong>3 comercios y 15,042 transacciones totales; demo fuerza <code>m001</code>.</div>
    <div class="arrow">→</div>
    <div class="box"><strong>Data Loader</strong>Normaliza formato, filtra completadas y entrega Tienda Don Pepe.</div>
    <div class="arrow">→</div>
    <div class="box"><strong>Analytics Engine</strong>Produce <code>{ value, label, metricsUsed, visualization }</code>.</div>
    <div class="arrow">→</div>
    <div class="box"><strong>LLM Adapter</strong>Solo reformula el label calculado o clasifica si las reglas no bastan.</div>
  </div>
</div>

## 4. Mapa de Módulos del Backend

<div class="module-grid">
  <div class="module"><strong>index.ts</strong>Inicializa Express, CORS, JSON parser, dataset y proveedor LLM.</div>
  <div class="module"><strong>chat.routes.ts</strong>Endpoint principal. Orquesta intent, cálculo, LLM, follow-ups y visualización.</div>
  <div class="module"><strong>analytics.engine.ts</strong>Funciones determinísticas para ventas, clientes, tendencia, ticket y productos.</div>
  <div class="module"><strong>data-loader.ts</strong>Carga JSON desde `src` o desde build `dist`; fuerza m001 para demo.</div>
  <div class="module"><strong>intent-catalog.ts</strong>Catálogo de 19 intents con keywords, regex, descripción y follow-ups.</div>
  <div class="module"><strong>intent-router.ts</strong>Detecta intent y extrae fechas/años con tolerancia a errores.</div>
  <div class="module"><strong>date-utils.ts</strong>Fecha real de Ecuador, formato local y etiquetas de fecha.</div>
  <div class="module"><strong>llm/*</strong>OpenAIProvider, NoopProvider, LLMCache y adaptador común.</div>
</div>

## 5. Flujo de una Consulta

<div class="flow">
  <div class="box"><strong>1. Input</strong>El usuario pregunta: "¿Cuánto vendí ayer?"</div>
  <div class="box"><strong>2. Intent</strong>Regex/keywords detectan <code>sales_specific_date</code>.</div>
  <div class="box"><strong>3. Fecha</strong><code>extractDateFromMessage</code> convierte "ayer" a fecha real -1 día.</div>
  <div class="box"><strong>4. Métrica</strong><code>getSalesForDate</code> filtra transacciones completadas.</div>
  <div class="box"><strong>5. Lenguaje</strong>LLM reformula el label calculado según Simple/Pro.</div>
  <div class="box"><strong>6. UI</strong>Angular muestra respuesta, follow-ups y gráfico si aplica.</div>
</div>

El endpoint principal es <code>POST /api/chat</code>. Su respuesta incluye:

| Campo | Descripción |
|---|---|
| `answer` | Respuesta final que ve el usuario. |
| `mode` | `simple` o `complete`. |
| `detectedIntent` | Intent clasificado por reglas o LLM. |
| `confidence` | Confianza de clasificación. |
| `metricsUsed` | Métricas determinísticas usadas. |
| `suggestedFollowUps` | Preguntas sugeridas. |
| `visualization` | `bar`, `line`, `pie`, `table` o `null`. |

## 6. Fechas Relativas y Zona Horaria

Antes, la lógica podía confundirse si "hoy" se trataba como una fecha fija o como la última fecha del dataset. Ahora está centralizada:

<div class="diagram">
  <div class="box"><strong>getCurrentEcuadorDate()</strong>Obtiene fecha/hora real en <code>America/Guayaquil</code>.</div>
  <div class="arrow">→</div>
  <div class="box"><strong>chat.routes.ts</strong>Pasa la referencia real al parser de fechas.</div>
  <div class="arrow">→</div>
  <div class="box"><strong>intent-router.ts</strong>Resuelve "hoy", "ayer", "aller" y "anteayer".</div>
  <div class="arrow">→</div>
  <div class="box"><strong>analytics.engine.ts</strong>Calcula día, semana, mes, tendencia y churn con esa referencia.</div>
</div>

| Expresión | Manejo actual |
|---|---|
| `hoy`, `día de hoy`, `día actual` | Se convierte a la fecha real de Ecuador del momento de consulta. |
| `ayer`, `aller` | Se interpreta como fecha real de Ecuador menos un día. |
| `anteayer`, `ante ayer` | Se interpreta como fecha real de Ecuador menos dos días. |
| `esta semana` | Rango lunes-domingo de la semana actual. |
| `este mes` | Mes calendario de la fecha real. |
| Fechas explícitas | Se respetan, por ejemplo `2025`, `17 de abril`, `2025-04-17`. |

<div class="ok">
Esto quedó validado en el set de pruebas: "¿Cuánto he vendido el día de hoy?", "¿Cuánto vendí ayer?", "caunto bendi aller" y "¿Cuánto vendí esta semana?" pasan contra el endpoint real.
</div>

## 7. Dataset y Conexión a Datos

El archivo <code>server/src/data/transactions.json</code> contiene 3 comercios. El prototipo fuerza <code>m001</code> para que la demo sea estable y todas las pruebas correspondan a Tienda Don Pepe.

| Comercio | Categoría | Transacciones totales | Completadas | Ventas completadas | Rango |
|---|---:|---:|---:|---:|---|
| Tienda Don Pepe (`m001`) | abarrotes | 2,962 | 2,827 | $118,048.67 | 2024-01-01 a 2026-04-19 |
| Café Internet Mary (`m002`) | servicios | 4,777 | 4,548 | $56,277.58 | 2024-01-01 a 2026-04-19 |
| Restaurante Doña Lupita (`m003`) | restaurante | 7,303 | 6,921 | $157,519.90 | 2024-01-01 a 2026-04-19 |

<table class="mini-table">
  <tr><td>Carga actual</td><td>`data-loader.ts` lee JSON en memoria y normaliza si viene como array, objeto con `merchants` o un solo comercio.</td></tr>
  <tr><td>Compatibilidad build</td><td>Ahora busca `transactions.json` junto al build y también en `src/data`, evitando fallos al correr desde `dist`.</td></tr>
  <tr><td>Demo controlada</td><td>`getMerchantData` y `getAllMerchants` filtran a `m001`; el selector visual no implica multi-comercio activo en backend.</td></tr>
  <tr><td>Migración futura</td><td>Se puede reemplazar solo `data-loader.ts` por APIs reales de DeUna manteniendo intents y motor analítico.</td></tr>
  <tr><td>Privacidad</td><td>El dataset completo no viaja al LLM. Solo se envían labels calculados y métricas usadas.</td></tr>
</table>

## 8. Motor Analítico Determinístico

El motor en <code>analytics.engine.ts</code> evita que el LLM haga aritmética. Cada función filtra transacciones completadas y devuelve un objeto uniforme.

| Función | Qué calcula | Visualización |
|---|---|---|
| `getSalesToday` / `getSalesForDate` | Total y conteo de ventas por día. | Barra por hora |
| `getSalesForPeriod` | Ventas de semana o mes actual. | Barra por día |
| `getSalesForYear` | Total anual y transacciones por año. | Línea mensual |
| `comparePeriods` | Mes actual vs anterior, diferencia y variación. | Barra comparativa |
| `getBestDay` / `getWorstDay` | Días extremos del historial. | Sin gráfica |
| `getAverageTicket` | Promedio por transacción. | Sin gráfica |
| `getChurnRisk` | Clientes frecuentes sin compras recientes. | Tabla si hay riesgo |
| `getRepeatCustomers` | Clientes por frecuencia y total gastado. | Tabla |
| `getDayOfWeekAnalysis` | Promedio por día de semana. | Barra |
| `getSalesTrend` / `detectSignificantChange` | Últimos 14 días y cambio porcentual. | Línea |
| `getTopProducts` | Categorías líderes por ventas. | Pastel/progreso |
| `getPaymentBreakdown` | Total por método de pago. | Pastel/progreso |

## 9. Intents Soportados

El catálogo actual contiene 19 intents. Se cubre más que el mínimo del reto y se separan preguntas de negocio de barreras conversacionales.

| Grupo | Intents |
|---|---|
| Ventas por tiempo | `sales_today`, `sales_specific_date`, `sales_specific_year`, `sales_this_week`, `sales_this_month` |
| Comparación y tendencia | `sales_comparison`, `sales_trend`, `significant_change`, `best_day`, `worst_day`, `strong_weak_days` |
| Clientes | `customer_churn`, `repeat_customers` |
| Producto y pago | `top_products`, `payment_methods`, `average_ticket` |
| Asistencia | `proactive_alert`, `greeting`, `help` |

<div class="note">
El intent `sales_today` se reforzó para frases como "ventas del día de hoy", "cuánto he vendido en el día de hoy" y "hoy cuánto he vendido". Esto evita depender de una sola frase exacta.
</div>

## 10. LLM, Prompts y Barreras

El proveedor principal es <code>OpenAIProvider</code>, con modelo configurable por <code>LLM_MODEL</code> y valor por defecto <code>gpt-4o-mini</code>. El backend usa OpenAI solo si <code>LLM_PROVIDER=openai</code> y existe <code>OPENAI_API_KEY</code>; si no, usa <code>NoopProvider</code>.

| Uso del LLM | Prompt / regla | Valor técnico |
|---|---|---|
| Reformulación | No inventar datos, hablar en segunda persona, tono amigable, Simple breve y Pro con contexto. | Convierte métricas en lenguaje claro para microcomerciantes. |
| Clasificación fallback | Responder solo el nombre del intent, tolerar errores ortográficos, distinguir fechas y periodos. | Ayuda en inputs informales o ambiguos. |
| Consulta general | Acepta saludos y cálculos de caja; rechaza temas fuera del negocio. | Mantiene foco y evita que el producto se vuelva asistente general. |
| Fallback sin IA | `NoopProvider` responde con labels directos y sugerencias. | La demo no se rompe si no hay API key. |

<div class="section-card">
  <strong>Por qué se rechazan preguntas fuera de dominio</strong>
  <p>Aunque un LLM conectado a OpenAI pueda saber quién juega o quién ganó un partido, ese no es el objetivo del chatbot. La barrera de dominio protege la experiencia: el asistente debe concentrarse en ventas, clientes, caja, productos y salud del negocio.</p>
</div>

## 11. Modos Simple y Pro

| Modo | Comportamiento | Caso de uso |
|---|---|---|
| Simple (`simple`) | Respuesta breve de 1-2 frases, con baja carga cognitiva. | Comerciante atendiendo, necesita el dato rápido. |
| Pro (`complete`) | Más contexto, recomendación y visualización si aplica. | Demo, análisis, revisión de tendencia y toma de decisiones. |

La interfaz envía el modo al backend. El LLM lo usa para ajustar extensión y profundidad, pero los números siguen saliendo del motor determinístico.

## 12. Visualizaciones

Las visualizaciones son datos estructurados generados por backend y renderizados en Angular. No son obligatorias para todo: aparecen cuando aclaran el resultado.

| Tipo | Uso | Ejemplo de pregunta |
|---|---|---|
| `bar` | Ventas por hora/día, semana, mes o días fuertes. | "¿Cuánto vendí esta semana?" |
| `line` | Tendencia reciente o ventas anuales. | "¿Cuál es la tendencia?" |
| `table` | Clientes frecuentes o en riesgo. | "¿Quiénes me compran más?" |
| `pie` | Categorías o métodos de pago. | "¿Qué categorías se venden más?" |

<div class="ok">
Para evitar cortes feos en este PDF, las cajas, diagramas, tablas y tarjetas usan <code>break-inside: avoid</code> y <code>page-break-inside: avoid</code>. Además, las secciones largas se separan con saltos controlados.
</div>

## 13. Manejo de Errores y Casos Borde

| Caso | Manejo implementado |
|---|---|
| Mensaje vacío | `POST /api/chat` responde 400 con "El mensaje no puede estar vacío". |
| Intent desconocido | Si hay LLM, responde dentro del dominio; si no, sugiere preguntas válidas. |
| Pregunta fuera de dominio | Rechazo cordial y foco en ventas/salud del negocio. |
| Fecha relativa | `hoy`, `ayer`, `aller`, `anteayer` se resuelven con fecha real de Ecuador. |
| Fecha no parseada | En `sales_specific_date`, fallback a ventas del mes. |
| Fecha sin ventas | Responde que no hay ventas y no inventa gráfico. |
| Clientes sin churn | Responde que no hay clientes en riesgo. |
| Error OpenAI | Captura error y devuelve label determinístico original. |
| Sin API key | Usa `NoopProvider` con respuestas directas. |
| Dataset no encontrado en build | `data-loader.ts` prueba rutas candidatas antes de fallar. |
| Error interno | HTTP 500 con "Error procesando tu pregunta". |

## 14. Alertas Proactivas

El módulo <code>server/src/alerts/proactive-alerts.ts</code> genera insights sin que el usuario pregunte.

| Alerta | Regla |
|---|---|
| Caída de ventas | Variación reciente menor a -15%. |
| Ventas en subida | Variación reciente mayor a 20%. |
| Dependencia de cliente | Un cliente concentra más de 30% de ventas. |
| Clientes en riesgo | Cliente frecuente sin compra en más de 30 días. |
| Día fuerte/flojo | Sugiere promociones en el día con menor promedio. |

En la corrida de Tienda Don Pepe, el consejo proactivo identifica subida reciente de 20.4%, martes como día fuerte y domingo como día flojo.

## 15. Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/chat` | Procesa una pregunta y devuelve respuesta, intent, métricas, follow-ups y visualización. |
| `GET` | `/api/proactive-alert` | Devuelve la alerta proactiva principal. |
| `GET` | `/api/sample-questions` | Lista preguntas sugeridas. |
| `GET` | `/api/merchants` | Devuelve comercios disponibles; en demo solo `m001`. |
| `GET` | `/api/health` | Verifica estado del backend. |

## 16. Pruebas y Validación

La validación se ejecuta con <code>node run_tests.js</code>. El runner ahora calcula expectativas dinámicas desde el dataset y la fecha real de Ecuador. Los resultados quedan en <code>test_results.json</code> y alimentan el PDF de pruebas.

| Grupo | Resultado de la última corrida |
|---|---|
| 15 preguntas principales de negocio | 15 / 15 correctas |
| Anexos de barreras y modos | 7 / 7 correctas |
| Acierto principal | 100% |
| Acierto anexos | 100% |
| Requisito mínimo del reto | 80% |

<div class="section-card">
  <strong>Relación con el PDF de pruebas</strong>
  <p><code>Set_Pruebas_15_Preguntas_4NOVA_DeUna.pdf</code> documenta input, modo, esperado, output real, relevancia, observaciones y código de evidencia. Esta documentación técnica explica cómo la arquitectura produce esos resultados.</p>
</div>

## 17. Seguridad, Costos y Desempeño

<table class="mini-table">
  <tr><td>Precisión</td><td>Los cálculos no dependen del LLM. El backend calcula y el LLM reformula.</td></tr>
  <tr><td>Privacidad</td><td>El dataset completo permanece en servidor; solo se envían resultados resumidos al LLM.</td></tr>
  <tr><td>Costo</td><td>`LLMCache` evita llamadas repetidas para intents y reformulaciones ya vistas.</td></tr>
  <tr><td>Latencia</td><td>Regex/keywords y JSON en memoria son rápidos; el LLM es una capa de lenguaje.</td></tr>
  <tr><td>Escalabilidad</td><td>Puede migrar a API real de DeUna reemplazando `data-loader.ts`.</td></tr>
  <tr><td>Operación sin LLM</td><td>`NoopProvider` mantiene el prototipo utilizable con respuestas directas.</td></tr>
</table>

## 18. Limitaciones y Próximos Pasos

| Limitación actual | Siguiente paso recomendado |
|---|---|
| Backend fuerza `m001`. | Habilitar selección real por `merchantId` cuando se conecte a datos reales. |
| Dataset local estático. | Reemplazar JSON por API transaccional DeUna manteniendo contrato `Transaction`. |
| Caché en memoria. | Migrar a Redis si se despliega en múltiples instancias. |
| Métricas dependen de campos disponibles. | Agregar margen, costo, inventario y canal cuando existan en fuente real. |
| Visualizaciones simples. | Mantener simplicidad para microcomercio o migrar a librería ligera si se requiere interacción avanzada. |
| Sin autenticación productiva. | Agregar auth, control de comercio por usuario y permisos antes de producción. |

## 19. Conclusión Técnica

La solución cumple el reto porque combina datos exactos, lenguaje accesible y visualizaciones simples. La arquitectura evita que el LLM invente números: el backend calcula, el LLM explica y la interfaz muestra. La actualización de fechas dinámicas deja el prototipo listo para operar con expresiones naturales como "hoy" y "ayer" sin depender de una fecha fija.
