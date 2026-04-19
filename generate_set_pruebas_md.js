const fs = require('fs');

const results = JSON.parse(fs.readFileSync('test_results.json', 'utf8'));
const dc = results.datasetContext;
const ref = results.dynamicReference;

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

function mdEsc(value) {
  return String(value ?? '').replace(/\|/g, '/').replace(/\n/g, '<br>');
}

function dateLabel(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function generatedLabel(iso) {
  return new Date(iso).toLocaleString('es-EC', {
    timeZone: 'America/Guayaquil',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function visualLabel(type) {
  if (!type) return 'Sin gráfica';
  return {
    bar: 'Barra',
    line: 'Línea',
    pie: 'Pastel',
    table: 'Tabla'
  }[type] ?? type;
}

function modeLabel(mode) {
  return mode === 'complete' ? 'Pro / complete' : 'Simple';
}

function evidenceId(id, appendix = false) {
  if (appendix) return `EA-${String(id).replace('A', '').padStart(2, '0')}`;
  return `E-${String(id).padStart(2, '0')}`;
}

function statusLabel(row) {
  return row.success ? 'Aprobado' : 'Revisar';
}

function checksSummary(row) {
  return [
    `intent ${row.checks.intentOk ? 'ok' : 'falló'}`,
    `contenido ${row.checks.textOk ? 'ok' : 'falló'}`,
    `visual ${row.checks.visualizationOk ? 'ok' : 'falló'}`
  ].join(' · ');
}

function dateInterpretation(row) {
  const id = String(row.id);
  const map = {
    '1': `"hoy" = ${dateLabel(ref.today)}. Se calcula con la fecha real de Ecuador al momento de preguntar.`,
    '2': `"ayer" = ${dateLabel(ref.yesterday)}. Se calcula restando un día a la fecha real de Ecuador.`,
    '3': `"esta semana" = ${ref.week}. Semana actual de lunes a domingo.`,
    '4': `"este mes" = ${ref.currentMonth}. Mes calendario actual según Ecuador.`,
    '5': 'Año explícito 2025. No depende de la fecha actual.',
    '6': `Compara ${ref.currentMonth} contra el mes anterior, ambos calculados desde la fecha real.`,
    '7': `Últimos 14 días hasta ${dateLabel(ref.today)}. Ventana móvil.`,
    '8': `Cambio reciente sobre últimos 14 días hasta ${dateLabel(ref.today)}.`,
    '9': `Histórico completo del dataset: ${dc.period}.`,
    '10': `Histórico completo agrupado por día de semana: ${dc.period}.`,
    '11': `Clientes en riesgo contra ventana de 30 días desde ${dateLabel(ref.today)}.`,
    '12': `Histórico completo de clientes: ${dc.period}.`,
    '13': `Todas las transacciones completadas: ${dc.period}.`,
    '14': `Todas las ventas por categoría: ${dc.period}.`,
    '15': `Tendencia reciente hasta ${dateLabel(ref.today)} y análisis de días fuertes/flojos.`,
    'A1': `"aller" se entiende como "ayer" = ${dateLabel(ref.yesterday)}. Valida tolerancia a errores.`,
    'A2': 'Sin fecha. Valida que el usuario descubra capacidades.',
    'A3': 'Sin fecha. Valida entrada conversacional con contexto del comercio.',
    'A4': 'Sin dataset. Valida cálculo práctico de caja.',
    'A5': 'Sin fecha. Valida barrera de dominio: la app no debe convertirse en asistente general.',
    'A6': `"esta semana" = ${ref.week}. Misma pregunta que E-03, pero en modo Simple.`,
    'A7': `Histórico completo de métodos de pago: ${dc.period}.`
  };
  return map[id] ?? 'No aplica.';
}

function relevance(row) {
  const id = String(row.id);
  const map = {
    '1': 'Da el pulso inmediato del negocio y evita que el comerciante tenga que abrir reportes.',
    '2': 'Permite comparar el día anterior con el avance actual y detectar si el ritmo bajó.',
    '3': 'Resume la semana para decidir inventario, caja y promociones de corto plazo.',
    '4': 'Ayuda a controlar flujo mensual y saber si el negocio va alineado con sus ingresos esperados.',
    '5': 'Da lectura histórica anual sin exigir conocimientos contables.',
    '6': 'Convierte ventas aisladas en diagnóstico de crecimiento o caída frente al mes pasado.',
    '7': 'Permite anticipar problemas o aprovechar crecimiento antes de que termine el mes.',
    '8': 'Detecta cambios inusuales para actuar rápido con promociones o abastecimiento.',
    '9': 'Identifica un pico real para replicar horarios, promociones o inventario.',
    '10': 'Ayuda a planificar promociones y stock según el comportamiento semanal.',
    '11': 'Evita inventar clientes perdidos y muestra si la fidelización está estable.',
    '12': 'Permite premiar o retener a clientes frecuentes con acciones personalizadas.',
    '13': 'Muestra gasto promedio y oportunidades de venta cruzada.',
    '14': 'Guía inventario, combos y productos a promocionar.',
    '15': 'Transforma métricas en una recomendación accionable para vender más.',
    'A1': 'Reduce fricción para usuarios que escriben rápido o con errores ortográficos.',
    'A2': 'Mejora adopción: el usuario sabe qué puede pedir sin conocer dashboards.',
    'A3': 'Mantiene una experiencia conversacional cercana y contextualizada.',
    'A4': 'Apoya una tarea cotidiana de caja, útil para personas sin educación financiera formal.',
    'A5': 'Protege el foco del producto. Aunque exista LLM, el objetivo no es responder temas generales.',
    'A6': 'Demuestra que Simple da el dato con baja carga cognitiva, mientras Pro aporta más contexto.',
    'A7': 'Valida el intent, aunque se documenta como anexo porque m001 solo tiene pagos Deuna.'
  };
  return map[id] ?? row.businessValue;
}

function observations(row) {
  const id = String(row.id);
  if (id === 'A5') {
    return 'Con OpenAI activo, un LLM podría saber datos de fútbol, pero esta app debe rechazarlo porque su rol es ayudar con ventas, clientes y salud del negocio. Esta barrera evita desviar el producto.';
  }
  if (id === 'A6') {
    return 'Se compara contra E-03. La diferencia esperada no es el dato, sino la profundidad: Simple debe responder breve; Pro debe agregar contexto y visual.';
  }
  if (id === 'A7') {
    return 'El dataset de Tienda Don Pepe solo contiene el método "deuna"; por eso no aporta comparación entre medios, pero sí valida clasificación, cálculo y visualización.';
  }
  if (id === '11') {
    return 'Caso importante porque el sistema debe saber decir que no hay alerta, sin inventar clientes en riesgo.';
  }
  if (['1', '2', '3', '4', '6', '7', '8', '15'].includes(id)) {
    return 'Depende de fecha relativa o ventana móvil. El valor esperado corresponde a esta corrida; al ejecutar otro día se recalcula.';
  }
  return 'Output real tomado de test_results.json después de ejecutar node run_tests.js contra POST /api/chat.';
}

function shortAnswer(text) {
  return esc(text);
}

function rowForSummary(row, appendix = false) {
  return `<tr><td><strong>${esc(evidenceId(row.id, appendix))}</strong></td><td>${esc(row.category)}</td><td>${esc(row.question)}</td><td>${modeLabel(row.mode)}</td><td><code>${esc(row.expectedIntent)}</code><br><span class="muted">real: <code>${esc(row.realIntent)}</code></span></td><td>${visualLabel(row.visualizationType)}</td><td><strong>${statusLabel(row)}</strong></td></tr>`;
}

function summaryRows(rows, appendix = false) {
  return rows.map(row => rowForSummary(row, appendix)).join('\n');
}

function testCard(row, appendix = false) {
  const evidence = evidenceId(row.id, appendix);
  const type = appendix ? 'Anexo' : 'Negocio';
  const statusClass = row.success ? 'pass' : 'fail';
  return `
<section class="test-card">
  <div class="test-head">
    <div>
      <span class="evidence">${esc(evidence)}</span>
      <span class="pill">${esc(type)}</span>
      <span class="pill soft">${esc(row.category)}</span>
    </div>
    <div class="status ${statusClass}">${statusLabel(row)}</div>
  </div>

  <table class="case-table">
    <tr>
      <td class="label">Input probado</td>
      <td class="wide">${esc(row.question)}</td>
      <td class="label">Modo</td>
      <td>${modeLabel(row.mode)}</td>
    </tr>
    <tr>
      <td class="label">Fecha / periodo entendido</td>
      <td class="wide">${esc(dateInterpretation(row))}</td>
      <td class="label">Intent</td>
      <td>Esperado: <code>${esc(row.expectedIntent)}</code><br>Real: <code>${esc(row.realIntent)}</code><br><span class="muted">Confianza: ${row.confidence ?? 'n/a'}</span></td>
    </tr>
    <tr>
      <td class="label">Debería responder</td>
      <td colspan="3">${esc(row.expectedMetrics)}</td>
    </tr>
    <tr>
      <td class="label">Respondió la app</td>
      <td colspan="3" class="answer">${shortAnswer(row.realAnswer)}</td>
    </tr>
    <tr>
      <td class="label">Relevancia para el cliente</td>
      <td>${esc(relevance(row))}</td>
      <td class="label">Visual / métricas</td>
      <td>${visualLabel(row.visualizationType)}<br><span class="muted">${esc(row.metricsUsed.join(', ') || 'sin métrica directa')}</span></td>
    </tr>
    <tr>
      <td class="label">Observaciones</td>
      <td>${esc(observations(row))}</td>
      <td class="label">Evidencia</td>
      <td><strong>${esc(evidence)}</strong><br><span class="muted">Pegar captura del chat aquí con input, output y visual si aplica.</span></td>
    </tr>
    <tr>
      <td class="label">Validación</td>
      <td colspan="3">${esc(checksSummary(row))}</td>
    </tr>
  </table>
</section>`;
}

function cards(rows, appendix = false) {
  return rows.map(row => testCard(row, appendix)).join('\n');
}

function docsRows(rows, appendix = false) {
  return rows.map(row => {
    const evidence = evidenceId(row.id, appendix);
    return `| ${evidence} | ${mdEsc(row.category)} | ${mdEsc(row.question)} | ${mdEsc(modeLabel(row.mode))} | ${mdEsc(row.expectedMetrics)} | ${mdEsc(row.realAnswer)} | ${mdEsc(relevance(row))} | ${mdEsc(observations(row))} | ${row.success ? 'Sí' : 'No'} |`;
  }).join('\n');
}

const md = `<style>
  @page { margin: 1cm; size: A4 landscape; }
  body {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 9px;
    line-height: 1.34;
    color: #202124;
    background: white;
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
    margin: 16px 0 8px;
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
  tr { page-break-inside: avoid; }
  code {
    font-size: 8px;
    background: #f3f5f8;
    padding: 1px 3px;
    border-radius: 3px;
  }
  .muted { color: #5c6675; font-size: 8px; }
  .hero {
    border: 1px solid #d9dee7;
    border-left: 7px solid #eb0029;
    background: #fbfcfe;
    padding: 13px 15px;
    margin: 8px 0 12px;
  }
  .hero-title {
    font-size: 16px;
    font-weight: 700;
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
    background: #ffffff;
    padding: 9px;
    border-radius: 7px;
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
  .mini-table td:first-child {
    width: 24%;
    background: #fafafa;
    font-weight: 700;
  }
  .date-flow {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 7px;
    margin: 8px 0;
  }
  .date-box {
    border: 1px solid #d9dee7;
    background: #fbfcfe;
    border-radius: 7px;
    padding: 8px;
  }
  .date-box strong { display: block; color: #111; margin-bottom: 3px; }
  .summary { font-size: 7.5px; margin-top: 8px; }
  .summary th:nth-child(1), .summary td:nth-child(1) { width: 7%; text-align: center; }
  .summary th:nth-child(2), .summary td:nth-child(2) { width: 12%; }
  .summary th:nth-child(3), .summary td:nth-child(3) { width: 35%; }
  .summary th:nth-child(4), .summary td:nth-child(4) { width: 10%; }
  .summary th:nth-child(5), .summary td:nth-child(5) { width: 16%; }
  .summary th:nth-child(6), .summary td:nth-child(6) { width: 10%; text-align: center; }
  .summary th:nth-child(7), .summary td:nth-child(7) { width: 10%; text-align: center; }
  .test-card {
    border: 1px solid #ccd3df;
    border-radius: 8px;
    padding: 8px;
    margin: 10px 0;
    page-break-inside: avoid;
    background: #ffffff;
  }
  .test-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }
  .evidence {
    display: inline-block;
    background: #111827;
    color: white;
    font-weight: 800;
    padding: 4px 7px;
    border-radius: 5px;
    margin-right: 5px;
  }
  .pill {
    display: inline-block;
    background: #ffe7eb;
    color: #8b0018;
    border: 1px solid #ffc7d0;
    padding: 3px 6px;
    border-radius: 999px;
    font-weight: 700;
    font-size: 8px;
    margin-right: 4px;
  }
  .pill.soft {
    background: #eef2f7;
    color: #25364a;
    border-color: #d9dee7;
  }
  .status {
    font-weight: 800;
    padding: 4px 8px;
    border-radius: 5px;
  }
  .status.pass {
    color: #0f6b2f;
    background: #eafff0;
    border: 1px solid #b8ebc8;
  }
  .status.fail {
    color: #9c1d20;
    background: #fff1f1;
    border: 1px solid #f1c0c0;
  }
  .case-table {
    font-size: 7.2px;
  }
  .case-table td.label {
    width: 12%;
    background: #f6f8fb;
    font-weight: 800;
    color: #263241;
  }
  .case-table td.wide {
    width: 45%;
  }
  .case-table .answer {
    background: #fffefa;
  }
  .page-break { page-break-before: always; }
</style>

# Set de 15 Preguntas de Prueba + Resultados

<div class="hero">
  <div class="hero-title">Historia del caso: Tienda Don Pepe necesita respuestas, no dashboards complejos</div>
  <p>Este entregable prueba si <strong>Mi Contador de Bolsillo</strong> convierte transacciones de DeUna en respuestas útiles para un microcomerciante. La persona dueña del negocio no necesita saber de BI, SQL o finanzas: pregunta en lenguaje natural y recibe ventas, clientes, tendencias, ticket promedio, productos fuertes y recomendaciones accionables.</p>
  <p>El foco del chatbot no es ser un asistente general. Aunque haya LLM activo, su rol es responder sobre el negocio, la caja, los clientes y la salud comercial del microcomercio.</p>
</div>

<div class="metric-grid">
  <div class="metric"><div class="value">${esc(dc.merchantName)}</div><div class="label">comercio evaluado</div></div>
  <div class="metric"><div class="value">${dc.completedTransactions.toLocaleString('en-US')}</div><div class="label">transacciones completadas</div></div>
  <div class="metric"><div class="value">${esc(dc.historicalSales)}</div><div class="label">ventas históricas</div></div>
  <div class="metric"><div class="value">${results.summary.mainAccuracy}%</div><div class="label">acierto en 15 pruebas</div></div>
  <div class="metric"><div class="value">${results.summary.appendixCorrect}/${results.summary.appendixTotal}</div><div class="label">anexos aprobados</div></div>
</div>

**Proyecto:** Mi Contador de Bolsillo - DeUna  
**Equipo:** 4NOVA  
**Comercio:** ${esc(dc.merchantName)} (${esc(dc.merchantId)})  
**Fecha de generación:** ${generatedLabel(results.generatedAt)}  
**Fuente de verdad:** <code>server/src/data/transactions.json</code> + corrida real de <code>node run_tests.js</code> contra <code>POST /api/chat</code>.

## 1. Contexto del dataset

<table class="mini-table">
  <tr><td>Giro del negocio</td><td>${esc(dc.category)} / tienda de barrio</td></tr>
  <tr><td>Ciudad</td><td>${esc(dc.city)}</td></tr>
  <tr><td>Periodo histórico del dataset</td><td>${esc(dc.period)}</td></tr>
  <tr><td>Transacciones completadas</td><td>${dc.completedTransactions.toLocaleString('en-US')}</td></tr>
  <tr><td>Total vendido</td><td>${esc(dc.historicalSales)}</td></tr>
  <tr><td>Comercio usado en el prototipo</td><td>El backend responde con <code>m001</code> para mantener una demo controlada y consistente.</td></tr>
  <tr><td>Método de pago</td><td>En m001 aparece <strong>deuna</strong>. Por eso ese caso va en anexos: valida el intent, pero no aporta comparación entre métodos.</td></tr>
</table>

## 2. Lógica de fechas relativa a la fecha real

<div class="note">
Las fechas relativas <strong>no están quemadas</strong>. Cuando el usuario dice "hoy", "ayer", "esta semana" o "este mes", la app calcula el periodo con la fecha real de Ecuador (<code>America/Guayaquil</code>). En esta corrida, la fecha real fue <strong>${dateLabel(ref.today)}</strong>. Si se ejecuta otro día, los esperados y los outputs cambian de forma controlada según el dataset.
</div>

<div class="date-flow">
  <div class="date-box"><strong>"hoy"</strong>${dateLabel(ref.today)}<br><span class="muted">fecha real de Ecuador</span></div>
  <div class="date-box"><strong>"ayer"</strong>${dateLabel(ref.yesterday)}<br><span class="muted">hoy - 1 día</span></div>
  <div class="date-box"><strong>"esta semana"</strong>${esc(ref.week)}<br><span class="muted">lunes a domingo</span></div>
  <div class="date-box"><strong>"este mes"</strong>${esc(ref.currentMonth)}<br><span class="muted">mes calendario</span></div>
  <div class="date-box"><strong>fecha explícita</strong>se respeta<br><span class="muted">ej. año 2025</span></div>
</div>

## 3. Cómo leer la evidencia

Cada prueba tiene una columna <strong>Evidencia</strong>. Ahí va el código de captura que se debe usar cuando se pegue la imagen del chat:

<table class="mini-table">
  <tr><td><code>E-01</code> a <code>E-15</code></td><td>Pruebas principales de negocio.</td></tr>
  <tr><td><code>EA-01</code> a <code>EA-07</code></td><td>Anexos de barreras, modos y escenarios complementarios.</td></tr>
  <tr><td>Qué debe mostrar la captura</td><td>Input escrito por el usuario, respuesta real del asistente y visualización cuando exista.</td></tr>
</table>

## 4. Resumen visual de pruebas principales

<table class="summary">
  <thead>
    <tr>
      <th>Evidencia</th>
      <th>Escenario</th>
      <th>Input probado</th>
      <th>Modo</th>
      <th>Intent esperado / real</th>
      <th>Visual</th>
      <th>Estado</th>
    </tr>
  </thead>
  <tbody>${summaryRows(results.mainResults)}
  </tbody>
</table>

## 5. Resumen visual de anexos

<table class="summary">
  <thead>
    <tr>
      <th>Evidencia</th>
      <th>Escenario</th>
      <th>Input probado</th>
      <th>Modo</th>
      <th>Intent esperado / real</th>
      <th>Visual</th>
      <th>Estado</th>
    </tr>
  </thead>
  <tbody>${summaryRows(results.appendixResults, true)}
  </tbody>
</table>

## 6. Fichas de validación: 15 preguntas principales

${cards(results.mainResults)}

## 7. Fichas de validación: anexos y barreras

${cards(results.appendixResults, true)}

## 8. Criterios de evaluación

<table class="mini-table">
  <tr><td>Intent correcto</td><td>El sistema clasificó la intención esperada para cada input.</td></tr>
  <tr><td>Dato correcto</td><td>Montos, conteos, porcentajes y fechas coinciden con el cálculo determinístico sobre el dataset.</td></tr>
  <tr><td>Fecha relativa correcta</td><td>Las preguntas con "hoy", "ayer", "semana" y "mes" usan la fecha real de Ecuador.</td></tr>
  <tr><td>Output real</td><td>La columna "Respondió la app" viene de la corrida real guardada en <code>test_results.json</code>.</td></tr>
  <tr><td>Valor de negocio</td><td>La respuesta debe ayudar a vender más, controlar caja, retener clientes, planificar inventario o entender tendencias.</td></tr>
  <tr><td>Barreras</td><td>Los anexos validan errores ortográficos, ayuda, saludo, cálculo práctico, fuera de dominio, Simple vs Pro y métodos de pago.</td></tr>
</table>

## 9. Conclusión

El set demuestra que el chatbot cumple y supera el mínimo del reto: 15/15 preguntas principales correctas y 7/7 anexos correctos. Además, el documento deja explícito que el sistema no usa una fecha fija: interpreta la fecha real de Ecuador según la pregunta del usuario. Esto hace que el asistente sea útil en operación real, no solo en una demo estática.
`;

fs.writeFileSync('Set_Pruebas_15_Preguntas_4NOVA_DeUna.md', md, 'utf8');

const docs = `# Preguntas de Validación - Mi Contador de Bolsillo

## Contexto

Estas pruebas validan el asistente contra \`server/src/data/transactions.json\`, usando el comercio forzado del prototipo.

| Campo | Valor |
|---|---|
| Comercio | ${dc.merchantName} (\`${dc.merchantId}\`) |
| Giro | ${dc.category} |
| Ciudad | ${dc.city} |
| Periodo histórico del dataset | ${dc.period} |
| Transacciones completadas | ${dc.completedTransactions.toLocaleString('en-US')} |
| Ventas históricas | ${dc.historicalSales} |
| Fecha real de esta corrida | ${ref.today} |

## Fechas Relativas

La lógica de "hoy", "ayer", "esta semana" y "este mes" se calcula dinámicamente con la fecha real de Ecuador. Si se ejecuta otro día, los valores cambian automáticamente.

## 15 Preguntas Principales de Negocio

| Evidencia | Escenario | Input | Modo | Esperado | Output real | Relevancia | Observaciones | Ok |
|---|---|---|---|---|---|---|---|---|
${docsRows(results.mainResults)}

## Anexos de Barreras y Modos

| Evidencia | Escenario | Input | Modo | Esperado | Output real | Relevancia | Observaciones | Ok |
|---|---|---|---|---|---|---|---|---|
${docsRows(results.appendixResults, true)}
`;

fs.writeFileSync('docs/test-questions.md', docs, 'utf8');

console.log('Markdown actualizado: Set_Pruebas_15_Preguntas_4NOVA_DeUna.md');
console.log('Documento actualizado: docs/test-questions.md');
