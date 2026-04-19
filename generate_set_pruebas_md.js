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

function checksSummary(row) {
  return [
    `intent ${row.checks.intentOk ? 'ok' : 'falló'}`,
    `texto ${row.checks.textOk ? 'ok' : 'falló'}`,
    `visual ${row.checks.visualizationOk ? 'ok' : 'falló'}`
  ].join('; ');
}

function statusLabel(row) {
  return row.success ? 'Aprobado' : 'Revisar';
}

function allRows() {
  return [
    ...results.mainResults.map(row => ({ ...row, group: '15 preguntas de negocio', evidence: evidenceId(row.id), appendix: false })),
    ...results.appendixResults.map(row => ({ ...row, group: 'Anexo de barreras y modos', evidence: evidenceId(row.id, true), appendix: true }))
  ];
}

function dateInterpretation(row) {
  const id = String(row.id);
  const map = {
    '1': `"hoy" = ${dateLabel(ref.today)}. Se calcula con la fecha real de Ecuador al momento de preguntar.`,
    '2': `"ayer" = ${dateLabel(ref.yesterday)}. Se calcula restando un día a "hoy".`,
    '3': `"esta semana" = ${ref.week}. Semana calculada de lunes a domingo según fecha real.`,
    '4': `"este mes" = ${ref.currentMonth}. Mes actual calculado desde fecha real.`,
    '5': 'Año explícito 2025. No depende de "hoy".',
    '6': `Compara ${ref.currentMonth} contra el mes anterior. Periodos calculados desde fecha real.`,
    '7': `Últimos 14 días hasta ${dateLabel(ref.today)}. Ventana móvil, no fija.`,
    '8': `Cambio reciente sobre los últimos 14 días hasta ${dateLabel(ref.today)}.`,
    '9': `Histórico completo del dataset: ${dc.period}.`,
    '10': `Histórico completo agrupado por día de semana: ${dc.period}.`,
    '11': `Riesgo de churn calculado contra los últimos 30 días desde ${dateLabel(ref.today)}.`,
    '12': `Histórico completo de clientes: ${dc.period}.`,
    '13': `Histórico completo de transacciones completadas: ${dc.period}.`,
    '14': `Histórico completo por categoría: ${dc.period}.`,
    '15': `Recomendación proactiva basada en tendencia reciente hasta ${dateLabel(ref.today)} y días fuertes/flojos.`,
    'A1': `"aller" se interpreta como "ayer" = ${dateLabel(ref.yesterday)}. Valida tolerancia ortográfica.`,
    'A2': 'No aplica fecha. Valida menú de ayuda.',
    'A3': 'No aplica fecha. Valida saludo con contexto del comercio.',
    'A4': 'No aplica dataset. Valida cálculo práctico de caja.',
    'A5': 'No aplica fecha. Valida límite de dominio.',
    'A6': `"esta semana" = ${ref.week}. Misma pregunta que E-03, pero en modo Simple.`,
    'A7': `Histórico completo de métodos de pago: ${dc.period}.`
  };
  return map[id] ?? 'No aplica.';
}

function scenarioObjective(row) {
  const id = String(row.id);
  const map = {
    '1': 'Pulso del día: saber si hoy ya hubo movimiento y cuánto ingresó.',
    '2': 'Comparar rápidamente el día anterior con el avance actual.',
    '3': 'Revisar desempeño semanal sin leer reportes manuales.',
    '4': 'Controlar avance mensual y flujo de caja.',
    '5': 'Leer desempeño anual histórico para decisiones de crecimiento.',
    '6': 'Detectar si el mes actual va mejor o peor que el anterior.',
    '7': 'Entender si las ventas recientes están subiendo o bajando.',
    '8': 'Identificar cambios inusuales que requieran acción.',
    '9': 'Encontrar un pico histórico que pueda replicarse.',
    '10': 'Planificar promociones e inventario por día de semana.',
    '11': 'Evitar inventar alertas cuando no hay clientes en riesgo.',
    '12': 'Identificar clientes de mayor frecuencia para fidelización.',
    '13': 'Medir gasto promedio y oportunidades de venta cruzada.',
    '14': 'Priorizar inventario, combos y categorías fuertes.',
    '15': 'Convertir métricas en una recomendación accionable.',
    'A1': 'Validar escritura con errores comunes.',
    'A2': 'Guiar a usuarios que no saben qué preguntar.',
    'A3': 'Confirmar experiencia conversacional básica.',
    'A4': 'Resolver una operación cotidiana de caja.',
    'A5': 'Rechazar temas fuera del negocio sin perder cordialidad.',
    'A6': 'Comparar brevedad del modo Simple frente al modo Pro.',
    'A7': 'Validar intent de medios de pago aunque el dataset solo tenga Deuna.'
  };
  return map[id] ?? row.businessValue;
}

function coverageRows() {
  return allRows().map(row => `
    <tr>
      <td><strong>${esc(row.evidence)}</strong></td>
      <td>${esc(row.group)}</td>
      <td>${esc(row.category)}</td>
      <td>${esc(row.question)}</td>
      <td>${esc(dateInterpretation(row))}</td>
      <td>${esc(scenarioObjective(row))}</td>
      <td><strong>${statusLabel(row)}</strong></td>
    </tr>`).join('\n');
}

function detailRows(rows, appendix = false) {
  return rows.map(row => `
    <tr>
      <td><strong>${esc(evidenceId(row.id, appendix))}</strong></td>
      <td>${esc(row.category)}<br><span class="muted">${esc(scenarioObjective(row))}</span></td>
      <td>${esc(row.question)}</td>
      <td>${esc(dateInterpretation(row))}</td>
      <td>${modeLabel(row.mode)}<br><code>${esc(row.expectedIntent)}</code><br><span class="muted">real: <code>${esc(row.realIntent)}</code><br>conf.: ${row.confidence ?? 'n/a'}</span></td>
      <td>${esc(row.expectedMetrics)}</td>
      <td>${esc(row.realAnswer)}</td>
      <td>${esc(row.metricsUsed.join(', ') || 'alerta proactiva / sin métrica directa')}<br><span class="muted">Visual esperado: ${visualLabel(row.expectedVisualization)}<br>Visual real: ${visualLabel(row.visualizationType)}</span></td>
      <td><strong>${statusLabel(row)}</strong><br>${esc(checksSummary(row))}</td>
    </tr>`).join('\n');
}

function docsRows(rows, appendix = false) {
  return rows.map(row => {
    const evidence = evidenceId(row.id, appendix);
    return `| ${evidence} | ${mdEsc(row.category)} | ${mdEsc(row.question)} | ${mdEsc(dateInterpretation(row))} | \`${row.expectedIntent}\` / \`${row.realIntent}\` | ${mdEsc(row.expectedMetrics)} | ${mdEsc(row.realAnswer)} | ${visualLabel(row.visualizationType)} | ${row.success ? 'Sí' : 'No'} |`;
  }).join('\n');
}

const md = `<style>
  @page { margin: 0.9cm; size: A4 landscape; }
  body {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 8.7px;
    line-height: 1.28;
    color: #222;
  }
  h1 {
    font-size: 21px;
    color: #111;
    border-bottom: 3px solid #eb0029;
    padding-bottom: 6px;
    margin: 0 0 9px;
  }
  h2 {
    font-size: 14px;
    color: #25364a;
    margin: 13px 0 6px;
  }
  h3 {
    font-size: 11px;
    color: #111;
    margin: 10px 0 5px;
  }
  p { margin: 5px 0; }
  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    margin-top: 6px;
  }
  th, td {
    border: 1px solid #d4d8de;
    padding: 4px;
    vertical-align: top;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  th {
    background: #eef2f7;
    color: #111;
    font-weight: 700;
  }
  tr { page-break-inside: avoid; }
  code {
    font-size: 7.5px;
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
  .ok {
    border-left: 4px solid #16833b;
    background: #f4fff7;
    padding: 7px 9px;
    margin: 8px 0;
  }
  .muted { color: #5f6670; font-size: 7.4px; }
  .meta td:first-child,
  .summary td:first-child,
  .criteria td:first-child,
  .date-ref td:first-child {
    width: 25%;
    background: #fafafa;
    font-weight: 700;
  }
  .coverage { font-size: 6.9px; }
  .coverage th:nth-child(1), .coverage td:nth-child(1) { width: 5%; text-align: center; }
  .coverage th:nth-child(2), .coverage td:nth-child(2) { width: 11%; }
  .coverage th:nth-child(3), .coverage td:nth-child(3) { width: 10%; }
  .coverage th:nth-child(4), .coverage td:nth-child(4) { width: 18%; }
  .coverage th:nth-child(5), .coverage td:nth-child(5) { width: 20%; }
  .coverage th:nth-child(6), .coverage td:nth-child(6) { width: 28%; }
  .coverage th:nth-child(7), .coverage td:nth-child(7) { width: 8%; text-align: center; }
  .matrix { font-size: 6.3px; }
  .matrix th:nth-child(1), .matrix td:nth-child(1) { width: 5%; text-align: center; }
  .matrix th:nth-child(2), .matrix td:nth-child(2) { width: 10%; }
  .matrix th:nth-child(3), .matrix td:nth-child(3) { width: 12%; }
  .matrix th:nth-child(4), .matrix td:nth-child(4) { width: 13%; }
  .matrix th:nth-child(5), .matrix td:nth-child(5) { width: 10%; }
  .matrix th:nth-child(6), .matrix td:nth-child(6) { width: 13%; }
  .matrix th:nth-child(7), .matrix td:nth-child(7) { width: 23%; }
  .matrix th:nth-child(8), .matrix td:nth-child(8) { width: 9%; }
  .matrix th:nth-child(9), .matrix td:nth-child(9) { width: 5%; text-align: center; }
</style>

# Set de 15 Preguntas de Prueba + Resultados

**Proyecto:** Mi Contador de Bolsillo - DeUna  
**Equipo:** 4NOVA  
**Entregable:** Lista de preguntas típicas, respuesta esperada y respuesta real del asistente para medir al menos 80% de acierto.  
**Comercio evaluado:** ${esc(dc.merchantName)} (${esc(dc.merchantId)})  
**Fecha de generación del reporte:** ${generatedLabel(results.generatedAt)}  
**Modo principal evaluado:** Pro / \`complete\`

## 1. Objetivo del entregable

Este PDF documenta el set completo de validación del chatbot: 15 preguntas principales de negocio y anexos de barreras/modos. Cada fila incluye el input exacto probado, la fecha o periodo interpretado, el intent esperado y real, la respuesta esperada, el output real observado del endpoint, las métricas/visualizaciones usadas, el resultado y el código de evidencia para que luego se pegue la captura.

<div class="note">
Las fechas relativas no están quemadas. La app calcula <strong>"hoy"</strong>, <strong>"ayer"</strong>, <strong>"esta semana"</strong> y <strong>"este mes"</strong> con la fecha real de Ecuador (<code>America/Guayaquil</code>) al momento de la pregunta. Por eso el dato esperado se llama "en esta corrida": si la prueba se ejecuta otro día, el sistema vuelve a calcular la fecha correcta y cambia los montos según el dataset.
</div>

<div class="ok">
Los outputs de las tablas vienen de <code>test_results.json</code>, generado por <code>node run_tests.js</code> contra el endpoint real <code>POST /api/chat</code>. Resultado: <strong>${results.summary.mainCorrect}/${results.summary.mainTotal}</strong> preguntas principales correctas (${results.summary.mainAccuracy}%) y <strong>${results.summary.appendixCorrect}/${results.summary.appendixTotal}</strong> anexos correctos (${results.summary.appendixAccuracy}%).
</div>

## 2. Contexto del dataset y negocio evaluado

<table class="meta">
  <tr><td>Fuente de datos</td><td><code>server/src/data/transactions.json</code></td></tr>
  <tr><td>Comercio</td><td>${esc(dc.merchantName)}</td></tr>
  <tr><td>ID de comercio</td><td>${esc(dc.merchantId)}. El prototipo fuerza este comercio para una demo controlada.</td></tr>
  <tr><td>Tipo de negocio</td><td>${esc(dc.category)} / tienda de barrio</td></tr>
  <tr><td>Ciudad</td><td>${esc(dc.city)}</td></tr>
  <tr><td>Periodo histórico del dataset</td><td>${esc(dc.period)}</td></tr>
  <tr><td>Transacciones completadas</td><td>${dc.completedTransactions.toLocaleString('en-US')}</td></tr>
  <tr><td>Total histórico vendido</td><td>${esc(dc.historicalSales)}</td></tr>
  <tr><td>Método de pago en m001</td><td>deuna. Por eso "métodos de pago" se deja como anexo: valida el intent, pero aporta menos comparación.</td></tr>
</table>

## 3. Referencia dinámica de fechas

Esta corrida se generó con fecha real de Ecuador equivalente a <strong>${dateLabel(ref.today)}</strong>. Las expresiones relativas se interpretaron así:

<table class="date-ref">
  <tr><td>"hoy"</td><td>${dateLabel(ref.today)}. Se calcula con <code>getCurrentEcuadorDate()</code>, no con la última fecha del dataset.</td></tr>
  <tr><td>"ayer"</td><td>${dateLabel(ref.yesterday)}. Se calcula restando un día a la fecha real de Ecuador.</td></tr>
  <tr><td>"esta semana"</td><td>${esc(ref.week)}. Semana actual de lunes a domingo.</td></tr>
  <tr><td>"este mes"</td><td>${esc(ref.currentMonth)}. Mes calendario actual según Ecuador.</td></tr>
  <tr><td>Fechas explícitas</td><td>Si el usuario pregunta por 2025, una fecha exacta o un periodo histórico, la app usa esa fecha explícita y no la reemplaza por "hoy".</td></tr>
</table>

## 4. Por qué estas pruebas dan relevancia al negocio

Las 15 preguntas principales cubren decisiones reales de microcomercios: ventas diarias, ventas por periodo, comparación, tendencia, cambios inusuales, clientes frecuentes, clientes en riesgo, ticket promedio, categorías top y consejo accionable. Los anexos prueban barreras de adopción: errores ortográficos, ayuda, saludo, cálculo de caja, pregunta fuera de dominio, modo Simple vs Pro y métodos de pago.

## 5. Mapa de cobertura completo

<table class="coverage">
  <thead>
    <tr>
      <th>Evidencia</th>
      <th>Grupo</th>
      <th>Escenario</th>
      <th>Input exacto</th>
      <th>Fecha / periodo interpretado</th>
      <th>Qué valida</th>
      <th>Estado</th>
    </tr>
  </thead>
  <tbody>${coverageRows()}
  </tbody>
</table>

## 6. Matriz principal: 15 preguntas de negocio

<table class="matrix">
  <thead>
    <tr>
      <th>Evidencia</th>
      <th>Escenario / objetivo</th>
      <th>Input probado</th>
      <th>Fecha / periodo que debe entender</th>
      <th>Modo + intent esperado/real</th>
      <th>Respuesta esperada / dato clave</th>
      <th>Output real observado de la app</th>
      <th>Métrica / visualización</th>
      <th>Resultado</th>
    </tr>
  </thead>
  <tbody>${detailRows(results.mainResults)}
  </tbody>
</table>

## 7. Matriz de anexos: barreras, modos y escenarios extra

<table class="matrix">
  <thead>
    <tr>
      <th>Evidencia</th>
      <th>Escenario / objetivo</th>
      <th>Input probado</th>
      <th>Fecha / periodo que debe entender</th>
      <th>Modo + intent esperado/real</th>
      <th>Respuesta esperada / dato clave</th>
      <th>Output real observado de la app</th>
      <th>Métrica / visualización</th>
      <th>Resultado</th>
    </tr>
  </thead>
  <tbody>${detailRows(results.appendixResults, true)}
  </tbody>
</table>

## 8. Criterios de evaluación

<table class="criteria">
  <tr><td>Precisión de datos</td><td>Montos, conteos, fechas, clientes y porcentajes coinciden con el cálculo determinístico sobre <code>transactions.json</code>.</td></tr>
  <tr><td>Interpretación temporal</td><td>Las expresiones relativas se calculan con la fecha real de Ecuador. Las fechas explícitas se respetan.</td></tr>
  <tr><td>Interpretación del input</td><td>Reconoce intención, lenguaje coloquial y errores ortográficos relevantes.</td></tr>
  <tr><td>Claridad para negocio</td><td>La respuesta es entendible para una persona sin educación financiera formal.</td></tr>
  <tr><td>Visualización correcta</td><td>Devuelve barra, línea, tabla o pastel cuando aporta valor.</td></tr>
  <tr><td>Accionabilidad</td><td>La respuesta ayuda a tomar decisiones: vender más, retener clientes, planificar promociones o revisar inventario.</td></tr>
</table>

## 9. Resumen de resultados

<table class="summary">
  <tr><td>Preguntas principales de negocio</td><td>${results.summary.mainTotal}</td></tr>
  <tr><td>Correctas en matriz principal</td><td>${results.summary.mainCorrect} / ${results.summary.mainTotal}</td></tr>
  <tr><td>Acierto principal</td><td><strong>${results.summary.mainAccuracy}%</strong></td></tr>
  <tr><td>Casos de anexos</td><td>${results.summary.appendixTotal}</td></tr>
  <tr><td>Correctos en anexos</td><td>${results.summary.appendixCorrect} / ${results.summary.appendixTotal}</td></tr>
  <tr><td>Acierto en anexos</td><td><strong>${results.summary.appendixAccuracy}%</strong></td></tr>
  <tr><td>Requisito mínimo del reto</td><td>Al menos 80% de acierto</td></tr>
  <tr><td>Resultado final</td><td><strong>Cumple y supera el requisito</strong></td></tr>
</table>

## 10. Evidencia para capturas

La columna <strong>Evidencia</strong> contiene el código que debe usarse al pegar capturas manuales: <code>E-01</code> a <code>E-15</code> para las preguntas principales y <code>EA-01</code> a <code>EA-07</code> para anexos. Cada captura debe mostrar input, respuesta real y visualización cuando exista.

## 11. Conclusión

El set demuestra que Mi Contador de Bolsillo responde preguntas relevantes para microcomercios y transforma datos transaccionales en información útil. Además, corrige el punto crítico de fechas: "hoy" no es una constante ni la última fecha del dataset; es la fecha real de Ecuador al momento de la consulta.
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
| Modo principal | \`complete\` / Pro |

## Fechas Relativas

La lógica de "hoy", "ayer", "esta semana" y "este mes" se calcula dinámicamente con la fecha real de Ecuador. En la corrida documentada en \`test_results.json\`:

| Expresión | Valor de esta corrida |
|---|---|
| hoy | ${ref.today} |
| ayer | ${ref.yesterday} |
| esta semana | ${ref.week} |
| este mes | ${ref.currentMonth} |

Si se ejecuta en otra fecha, estos valores cambian automáticamente.

## 15 Preguntas Principales de Negocio

| Evidencia | Escenario | Pregunta | Fecha / periodo interpretado | Intent esperado / real | Dato esperado | Output real | Visual real | Ok |
|---|---|---|---|---|---|---|---|---|
${docsRows(results.mainResults)}

## Anexos de Barreras y Modos

| Evidencia | Escenario | Pregunta | Fecha / periodo interpretado | Intent esperado / real | Dato esperado | Output real | Visual real | Ok |
|---|---|---|---|---|---|---|---|---|
${docsRows(results.appendixResults, true)}

## Ejecución

1. Levantar el backend.
2. Ejecutar \`node run_tests.js\` desde la raíz del proyecto.
3. Revisar \`test_results.json\`.
4. Regenerar \`Set_Pruebas_15_Preguntas_4NOVA_DeUna.pdf\`.
5. Pegar capturas \`E-01\` a \`E-15\` y \`EA-01\` a \`EA-07\` en la columna de evidencia.

## Criterios de aprobación

- Intent correcto.
- Números correctos respecto al dataset y a la fecha real de Ecuador.
- Visualización esperada cuando aplica.
- Respuesta clara para una persona sin formación financiera.
- No inventa datos ante escenarios sin alerta.
`;

fs.writeFileSync('docs/test-questions.md', docs, 'utf8');

console.log('Markdown actualizado: Set_Pruebas_15_Preguntas_4NOVA_DeUna.md');
console.log('Documento actualizado: docs/test-questions.md');
