<style>
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
  <div class="metric"><div class="value">Tienda Don Pepe</div><div class="label">comercio evaluado</div></div>
  <div class="metric"><div class="value">2,827</div><div class="label">transacciones completadas</div></div>
  <div class="metric"><div class="value">$118,048.67</div><div class="label">ventas históricas</div></div>
  <div class="metric"><div class="value">100%</div><div class="label">acierto en 15 pruebas</div></div>
  <div class="metric"><div class="value">7/7</div><div class="label">anexos aprobados</div></div>
</div>

**Proyecto:** Mi Contador de Bolsillo - DeUna  
**Equipo:** 4NOVA  
**Comercio:** Tienda Don Pepe (m001)  
**Fecha de generación:** 19 de abril de 2026, 02:37 p. m.  
**Fuente de verdad:** <code>server/src/data/transactions.json</code> + corrida real de <code>node run_tests.js</code> contra <code>POST /api/chat</code>.

## 1. Contexto del dataset

<table class="mini-table">
  <tr><td>Giro del negocio</td><td>abarrotes / tienda de barrio</td></tr>
  <tr><td>Ciudad</td><td>Quito</td></tr>
  <tr><td>Periodo histórico del dataset</td><td>2024-01-01 a 2026-04-19</td></tr>
  <tr><td>Transacciones completadas</td><td>2,827</td></tr>
  <tr><td>Total vendido</td><td>$118,048.67</td></tr>
  <tr><td>Comercio usado en el prototipo</td><td>El backend responde con <code>m001</code> para mantener una demo controlada y consistente.</td></tr>
  <tr><td>Método de pago</td><td>En m001 aparece <strong>deuna</strong>. Por eso ese caso va en anexos: valida el intent, pero no aporta comparación entre métodos.</td></tr>
</table>

## 2. Lógica de fechas relativa a la fecha real

<div class="note">
Las fechas relativas <strong>no están quemadas</strong>. Cuando el usuario dice "hoy", "ayer", "esta semana" o "este mes", la app calcula el periodo con la fecha real de Ecuador (<code>America/Guayaquil</code>). En esta corrida, la fecha real fue <strong>19/04/2026</strong>. Si se ejecuta otro día, los esperados y los outputs cambian de forma controlada según el dataset.
</div>

<div class="date-flow">
  <div class="date-box"><strong>"hoy"</strong>19/04/2026<br><span class="muted">fecha real de Ecuador</span></div>
  <div class="date-box"><strong>"ayer"</strong>18/04/2026<br><span class="muted">hoy - 1 día</span></div>
  <div class="date-box"><strong>"esta semana"</strong>2026-04-13 a 2026-04-19<br><span class="muted">lunes a domingo</span></div>
  <div class="date-box"><strong>"este mes"</strong>abril de 2026<br><span class="muted">mes calendario</span></div>
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
  <tbody><tr><td><strong>E-01</strong></td><td>Ventas diarias</td><td>¿Cuánto he vendido el día de hoy?</td><td>Pro / complete</td><td><code>sales_today</code><br><span class="muted">real: <code>sales_today</code></span></td><td>Barra</td><td><strong>Aprobado</strong></td></tr>
<tr><td><strong>E-02</strong></td><td>Ventas por fecha</td><td>¿Cuánto vendí ayer?</td><td>Pro / complete</td><td><code>sales_specific_date</code><br><span class="muted">real: <code>sales_specific_date</code></span></td><td>Barra</td><td><strong>Aprobado</strong></td></tr>
<tr><td><strong>E-03</strong></td><td>Ventas semanales</td><td>¿Cuánto vendí esta semana?</td><td>Pro / complete</td><td><code>sales_this_week</code><br><span class="muted">real: <code>sales_this_week</code></span></td><td>Barra</td><td><strong>Aprobado</strong></td></tr>
<tr><td><strong>E-04</strong></td><td>Ventas mensuales</td><td>¿Cuál es el total de mis ventas de este mes?</td><td>Pro / complete</td><td><code>sales_this_month</code><br><span class="muted">real: <code>sales_this_month</code></span></td><td>Barra</td><td><strong>Aprobado</strong></td></tr>
<tr><td><strong>E-05</strong></td><td>Ventas anuales</td><td>¿Cuánto generé en todo el año 2025?</td><td>Pro / complete</td><td><code>sales_specific_year</code><br><span class="muted">real: <code>sales_specific_year</code></span></td><td>Línea</td><td><strong>Aprobado</strong></td></tr>
<tr><td><strong>E-06</strong></td><td>Comparación</td><td>¿Cómo voy en ventas comparado con el mes pasado?</td><td>Pro / complete</td><td><code>sales_comparison</code><br><span class="muted">real: <code>sales_comparison</code></span></td><td>Barra</td><td><strong>Aprobado</strong></td></tr>
<tr><td><strong>E-07</strong></td><td>Tendencia</td><td>¿Cuál es la tendencia de mis ventas en estas últimas semanas?</td><td>Pro / complete</td><td><code>sales_trend</code><br><span class="muted">real: <code>sales_trend</code></span></td><td>Línea</td><td><strong>Aprobado</strong></td></tr>
<tr><td><strong>E-08</strong></td><td>Alerta de cambio</td><td>¿Ha habido alguna caída o subida inusual en mis ventas recientes?</td><td>Pro / complete</td><td><code>significant_change</code><br><span class="muted">real: <code>significant_change</code></span></td><td>Línea</td><td><strong>Aprobado</strong></td></tr>
<tr><td><strong>E-09</strong></td><td>Mejor día</td><td>¿Cuál ha sido el mejor día de ventas en toda la historia de mi negocio?</td><td>Pro / complete</td><td><code>best_day</code><br><span class="muted">real: <code>best_day</code></span></td><td>Sin gráfica</td><td><strong>Aprobado</strong></td></tr>
<tr><td><strong>E-10</strong></td><td>Días fuertes/flojos</td><td>¿Cuáles son mis días de la semana con más ventas?</td><td>Pro / complete</td><td><code>strong_weak_days</code><br><span class="muted">real: <code>strong_weak_days</code></span></td><td>Barra</td><td><strong>Aprobado</strong></td></tr>
<tr><td><strong>E-11</strong></td><td>Retención</td><td>¿Qué clientes fieles dejaron de comprarme recientemente y están en riesgo de no volver?</td><td>Pro / complete</td><td><code>customer_churn</code><br><span class="muted">real: <code>customer_churn</code></span></td><td>Sin gráfica</td><td><strong>Aprobado</strong></td></tr>
<tr><td><strong>E-12</strong></td><td>Clientes frecuentes</td><td>¿Quiénes son los clientes que me compran con mayor frecuencia?</td><td>Pro / complete</td><td><code>repeat_customers</code><br><span class="muted">real: <code>repeat_customers</code></span></td><td>Tabla</td><td><strong>Aprobado</strong></td></tr>
<tr><td><strong>E-13</strong></td><td>Ticket promedio</td><td>¿Cuál es mi ticket promedio?</td><td>Pro / complete</td><td><code>average_ticket</code><br><span class="muted">real: <code>average_ticket</code></span></td><td>Sin gráfica</td><td><strong>Aprobado</strong></td></tr>
<tr><td><strong>E-14</strong></td><td>Categorías top</td><td>¿Cuáles son los productos o categorías que más se venden en mi tienda?</td><td>Pro / complete</td><td><code>top_products</code><br><span class="muted">real: <code>top_products</code></span></td><td>Pastel</td><td><strong>Aprobado</strong></td></tr>
<tr><td><strong>E-15</strong></td><td>Consejo proactivo</td><td>Analiza mis datos y dame un consejo proactivo para mejorar mi negocio.</td><td>Pro / complete</td><td><code>proactive_alert</code><br><span class="muted">real: <code>proactive_alert</code></span></td><td>Sin gráfica</td><td><strong>Aprobado</strong></td></tr>
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
  <tbody><tr><td><strong>EA-01</strong></td><td>Error ortográfico</td><td>caunto bendi aller</td><td>Pro / complete</td><td><code>sales_specific_date</code><br><span class="muted">real: <code>sales_specific_date</code></span></td><td>Barra</td><td><strong>Aprobado</strong></td></tr>
<tr><td><strong>EA-02</strong></td><td>Ayuda</td><td>¿Qué puedo preguntarte?</td><td>Pro / complete</td><td><code>help</code><br><span class="muted">real: <code>help</code></span></td><td>Sin gráfica</td><td><strong>Aprobado</strong></td></tr>
<tr><td><strong>EA-03</strong></td><td>Saludo</td><td>Hola</td><td>Pro / complete</td><td><code>greeting</code><br><span class="muted">real: <code>greeting</code></span></td><td>Sin gráfica</td><td><strong>Aprobado</strong></td></tr>
<tr><td><strong>EA-04</strong></td><td>Cálculo práctico</td><td>Si un cliente me lleva 3 atunes de $1.50 y 2 colas de $2.00, ¿cuánto debo cobrarle en total?</td><td>Pro / complete</td><td><code>unknown</code><br><span class="muted">real: <code>unknown</code></span></td><td>Sin gráfica</td><td><strong>Aprobado</strong></td></tr>
<tr><td><strong>EA-05</strong></td><td>Fuera de dominio</td><td>¿Quién ganó el mundial de fútbol de la FIFA?</td><td>Pro / complete</td><td><code>unknown</code><br><span class="muted">real: <code>unknown</code></span></td><td>Sin gráfica</td><td><strong>Aprobado</strong></td></tr>
<tr><td><strong>EA-06</strong></td><td>Modo Simple</td><td>¿Cuánto vendí esta semana?</td><td>Simple</td><td><code>sales_this_week</code><br><span class="muted">real: <code>sales_this_week</code></span></td><td>Barra</td><td><strong>Aprobado</strong></td></tr>
<tr><td><strong>EA-07</strong></td><td>Método de pago</td><td>¿Cómo pagan mis clientes?</td><td>Pro / complete</td><td><code>payment_methods</code><br><span class="muted">real: <code>payment_methods</code></span></td><td>Pastel</td><td><strong>Aprobado</strong></td></tr>
  </tbody>
</table>

## 6. Fichas de validación: 15 preguntas principales


<section class="test-card">
  <div class="test-head">
    <div>
      <span class="evidence">E-01</span>
      <span class="pill">Negocio</span>
      <span class="pill soft">Ventas diarias</span>
    </div>
    <div class="status pass">Aprobado</div>
  </div>

  <table class="case-table">
    <tr>
      <td class="label">Input probado</td>
      <td class="wide">¿Cuánto he vendido el día de hoy?</td>
      <td class="label">Modo</td>
      <td>Pro / complete</td>
    </tr>
    <tr>
      <td class="label">Fecha / periodo entendido</td>
      <td class="wide">&quot;hoy&quot; = 19/04/2026. Se calcula con la fecha real de Ecuador al momento de preguntar.</td>
      <td class="label">Intent</td>
      <td>Esperado: <code>sales_today</code><br>Real: <code>sales_today</code><br><span class="muted">Confianza: 0.95</span></td>
    </tr>
    <tr>
      <td class="label">Debería responder</td>
      <td colspan="3">19/04/2026; $206.03; 5 transacciones</td>
    </tr>
    <tr>
      <td class="label">Respondió la app</td>
      <td colspan="3" class="answer">Hoy, en Tienda Don Pepe, lograste ventas por un total de $206.03, distribuidas en 5 transacciones. Esto significa que cada cliente que compró contribuyó a tu negocio, lo cual es un buen indicador de actividad. Sigue así y considera estrategias para aumentar tanto el número de transacciones como el monto total de ventas. ¡Buen trabajo! 💪📈</td>
    </tr>
    <tr>
      <td class="label">Relevancia para el cliente</td>
      <td>Da el pulso inmediato del negocio y evita que el comerciante tenga que abrir reportes.</td>
      <td class="label">Visual / métricas</td>
      <td>Barra<br><span class="muted">total_ventas_dia, num_transacciones_dia</span></td>
    </tr>
    <tr>
      <td class="label">Observaciones</td>
      <td>Depende de fecha relativa o ventana móvil. El valor esperado corresponde a esta corrida; al ejecutar otro día se recalcula.</td>
      <td class="label">Evidencia</td>
      <td><strong>E-01</strong><br><span class="muted">Pegar captura del chat aquí con input, output y visual si aplica.</span></td>
    </tr>
    <tr>
      <td class="label">Validación</td>
      <td colspan="3">intent ok · contenido ok · visual ok</td>
    </tr>
  </table>
</section>

<section class="test-card">
  <div class="test-head">
    <div>
      <span class="evidence">E-02</span>
      <span class="pill">Negocio</span>
      <span class="pill soft">Ventas por fecha</span>
    </div>
    <div class="status pass">Aprobado</div>
  </div>

  <table class="case-table">
    <tr>
      <td class="label">Input probado</td>
      <td class="wide">¿Cuánto vendí ayer?</td>
      <td class="label">Modo</td>
      <td>Pro / complete</td>
    </tr>
    <tr>
      <td class="label">Fecha / periodo entendido</td>
      <td class="wide">&quot;ayer&quot; = 18/04/2026. Se calcula restando un día a la fecha real de Ecuador.</td>
      <td class="label">Intent</td>
      <td>Esperado: <code>sales_specific_date</code><br>Real: <code>sales_specific_date</code><br><span class="muted">Confianza: 0.95</span></td>
    </tr>
    <tr>
      <td class="label">Debería responder</td>
      <td colspan="3">18/04/2026; $70.91; 2 transacciones</td>
    </tr>
    <tr>
      <td class="label">Respondió la app</td>
      <td colspan="3" class="answer">El sábado 18 de abril, en Tienda Don Pepe, tuviste ventas por un total de $70.91, realizando 2 transacciones en el día. Esto significa que cada transacción generó un promedio de $35.46. ¡Sigue así y busca maneras de atraer más clientes para aumentar tus ventas! 📈</td>
    </tr>
    <tr>
      <td class="label">Relevancia para el cliente</td>
      <td>Permite comparar el día anterior con el avance actual y detectar si el ritmo bajó.</td>
      <td class="label">Visual / métricas</td>
      <td>Barra<br><span class="muted">total_ventas_dia, num_transacciones_dia</span></td>
    </tr>
    <tr>
      <td class="label">Observaciones</td>
      <td>Depende de fecha relativa o ventana móvil. El valor esperado corresponde a esta corrida; al ejecutar otro día se recalcula.</td>
      <td class="label">Evidencia</td>
      <td><strong>E-02</strong><br><span class="muted">Pegar captura del chat aquí con input, output y visual si aplica.</span></td>
    </tr>
    <tr>
      <td class="label">Validación</td>
      <td colspan="3">intent ok · contenido ok · visual ok</td>
    </tr>
  </table>
</section>

<section class="test-card">
  <div class="test-head">
    <div>
      <span class="evidence">E-03</span>
      <span class="pill">Negocio</span>
      <span class="pill soft">Ventas semanales</span>
    </div>
    <div class="status pass">Aprobado</div>
  </div>

  <table class="case-table">
    <tr>
      <td class="label">Input probado</td>
      <td class="wide">¿Cuánto vendí esta semana?</td>
      <td class="label">Modo</td>
      <td>Pro / complete</td>
    </tr>
    <tr>
      <td class="label">Fecha / periodo entendido</td>
      <td class="wide">&quot;esta semana&quot; = 2026-04-13 a 2026-04-19. Semana actual de lunes a domingo.</td>
      <td class="label">Intent</td>
      <td>Esperado: <code>sales_this_week</code><br>Real: <code>sales_this_week</code><br><span class="muted">Confianza: 0.95</span></td>
    </tr>
    <tr>
      <td class="label">Debería responder</td>
      <td colspan="3">Semana 13/04/2026-19/04/2026; $1,332.61; 30 transacciones</td>
    </tr>
    <tr>
      <td class="label">Respondió la app</td>
      <td colspan="3" class="answer">Esta semana, en Tienda Don Pepe, lograste vender un total de $1,332.61 a través de 30 transacciones. 🎉 Esto muestra que tus esfuerzos están dando frutos y que hay un buen flujo de clientes. Te animo a seguir promoviendo tus productos y a mantener la atención en la satisfacción del cliente para seguir mejorando estas cifras. ¡Sigue así! 💪</td>
    </tr>
    <tr>
      <td class="label">Relevancia para el cliente</td>
      <td>Resume la semana para decidir inventario, caja y promociones de corto plazo.</td>
      <td class="label">Visual / métricas</td>
      <td>Barra<br><span class="muted">total_ventas, num_transacciones</span></td>
    </tr>
    <tr>
      <td class="label">Observaciones</td>
      <td>Depende de fecha relativa o ventana móvil. El valor esperado corresponde a esta corrida; al ejecutar otro día se recalcula.</td>
      <td class="label">Evidencia</td>
      <td><strong>E-03</strong><br><span class="muted">Pegar captura del chat aquí con input, output y visual si aplica.</span></td>
    </tr>
    <tr>
      <td class="label">Validación</td>
      <td colspan="3">intent ok · contenido ok · visual ok</td>
    </tr>
  </table>
</section>

<section class="test-card">
  <div class="test-head">
    <div>
      <span class="evidence">E-04</span>
      <span class="pill">Negocio</span>
      <span class="pill soft">Ventas mensuales</span>
    </div>
    <div class="status pass">Aprobado</div>
  </div>

  <table class="case-table">
    <tr>
      <td class="label">Input probado</td>
      <td class="wide">¿Cuál es el total de mis ventas de este mes?</td>
      <td class="label">Modo</td>
      <td>Pro / complete</td>
    </tr>
    <tr>
      <td class="label">Fecha / periodo entendido</td>
      <td class="wide">&quot;este mes&quot; = abril de 2026. Mes calendario actual según Ecuador.</td>
      <td class="label">Intent</td>
      <td>Esperado: <code>sales_this_month</code><br>Real: <code>sales_this_month</code><br><span class="muted">Confianza: 0.95</span></td>
    </tr>
    <tr>
      <td class="label">Debería responder</td>
      <td colspan="3">abril de 2026; $3,356.19; 78 transacciones</td>
    </tr>
    <tr>
      <td class="label">Respondió la app</td>
      <td colspan="3" class="answer">Este mes, en Tienda Don Pepe, lograste ventas por un total de $3,356.19 a través de 78 transacciones. Esto significa que cada venta promedio fue de aproximadamente $43. Asegúrate de seguir ofreciendo un excelente servicio al cliente para mantener y aumentar estas cifras. ¡Sigue así! 🎉</td>
    </tr>
    <tr>
      <td class="label">Relevancia para el cliente</td>
      <td>Ayuda a controlar flujo mensual y saber si el negocio va alineado con sus ingresos esperados.</td>
      <td class="label">Visual / métricas</td>
      <td>Barra<br><span class="muted">total_ventas, num_transacciones</span></td>
    </tr>
    <tr>
      <td class="label">Observaciones</td>
      <td>Depende de fecha relativa o ventana móvil. El valor esperado corresponde a esta corrida; al ejecutar otro día se recalcula.</td>
      <td class="label">Evidencia</td>
      <td><strong>E-04</strong><br><span class="muted">Pegar captura del chat aquí con input, output y visual si aplica.</span></td>
    </tr>
    <tr>
      <td class="label">Validación</td>
      <td colspan="3">intent ok · contenido ok · visual ok</td>
    </tr>
  </table>
</section>

<section class="test-card">
  <div class="test-head">
    <div>
      <span class="evidence">E-05</span>
      <span class="pill">Negocio</span>
      <span class="pill soft">Ventas anuales</span>
    </div>
    <div class="status pass">Aprobado</div>
  </div>

  <table class="case-table">
    <tr>
      <td class="label">Input probado</td>
      <td class="wide">¿Cuánto generé en todo el año 2025?</td>
      <td class="label">Modo</td>
      <td>Pro / complete</td>
    </tr>
    <tr>
      <td class="label">Fecha / periodo entendido</td>
      <td class="wide">Año explícito 2025. No depende de la fecha actual.</td>
      <td class="label">Intent</td>
      <td>Esperado: <code>sales_specific_year</code><br>Real: <code>sales_specific_year</code><br><span class="muted">Confianza: 0.9</span></td>
    </tr>
    <tr>
      <td class="label">Debería responder</td>
      <td colspan="3">Año 2025; $51,305.18; 1224 transacciones</td>
    </tr>
    <tr>
      <td class="label">Respondió la app</td>
      <td colspan="3" class="answer">En el año 2025, tu negocio, Tienda Don Pepe, logró un excelente desempeño al alcanzar un total de $51,305.18 en ventas. Esto se traduce en 1,224 transacciones, lo que demuestra un buen flujo de clientes y una sólida actividad comercial. ¡Sigue así y mantén el impulso! 💪📈</td>
    </tr>
    <tr>
      <td class="label">Relevancia para el cliente</td>
      <td>Da lectura histórica anual sin exigir conocimientos contables.</td>
      <td class="label">Visual / métricas</td>
      <td>Línea<br><span class="muted">total_ventas_ano, conteo_transacciones_ano</span></td>
    </tr>
    <tr>
      <td class="label">Observaciones</td>
      <td>Output real tomado de test_results.json después de ejecutar node run_tests.js contra POST /api/chat.</td>
      <td class="label">Evidencia</td>
      <td><strong>E-05</strong><br><span class="muted">Pegar captura del chat aquí con input, output y visual si aplica.</span></td>
    </tr>
    <tr>
      <td class="label">Validación</td>
      <td colspan="3">intent ok · contenido ok · visual ok</td>
    </tr>
  </table>
</section>

<section class="test-card">
  <div class="test-head">
    <div>
      <span class="evidence">E-06</span>
      <span class="pill">Negocio</span>
      <span class="pill soft">Comparación</span>
    </div>
    <div class="status pass">Aprobado</div>
  </div>

  <table class="case-table">
    <tr>
      <td class="label">Input probado</td>
      <td class="wide">¿Cómo voy en ventas comparado con el mes pasado?</td>
      <td class="label">Modo</td>
      <td>Pro / complete</td>
    </tr>
    <tr>
      <td class="label">Fecha / periodo entendido</td>
      <td class="wide">Compara abril de 2026 contra el mes anterior, ambos calculados desde la fecha real.</td>
      <td class="label">Intent</td>
      <td>Esperado: <code>sales_comparison</code><br>Real: <code>sales_comparison</code><br><span class="muted">Confianza: 0.95</span></td>
    </tr>
    <tr>
      <td class="label">Debería responder</td>
      <td colspan="3">Mes actual $3,356.19 vs mes anterior $4,167.53; variación -19.5%</td>
    </tr>
    <tr>
      <td class="label">Respondió la app</td>
      <td colspan="3" class="answer">Este mes, en Tienda Don Pepe, has generado un total de $3,356.19 en ventas, lo que representa una disminución de $811.34 en comparación con los $4,167.53 que lograste el mes pasado. Esto equivale a una caída del 19.5% en tus ventas. <br><br>Te animo a analizar qué estrategias puedes implementar para mejorar tus resultados el próximo mes. ¡Siempre hay oportunidades para crecer! 📈</td>
    </tr>
    <tr>
      <td class="label">Relevancia para el cliente</td>
      <td>Convierte ventas aisladas en diagnóstico de crecimiento o caída frente al mes pasado.</td>
      <td class="label">Visual / métricas</td>
      <td>Barra<br><span class="muted">total_mes_actual, total_mes_anterior, variacion_porcentual</span></td>
    </tr>
    <tr>
      <td class="label">Observaciones</td>
      <td>Depende de fecha relativa o ventana móvil. El valor esperado corresponde a esta corrida; al ejecutar otro día se recalcula.</td>
      <td class="label">Evidencia</td>
      <td><strong>E-06</strong><br><span class="muted">Pegar captura del chat aquí con input, output y visual si aplica.</span></td>
    </tr>
    <tr>
      <td class="label">Validación</td>
      <td colspan="3">intent ok · contenido ok · visual ok</td>
    </tr>
  </table>
</section>

<section class="test-card">
  <div class="test-head">
    <div>
      <span class="evidence">E-07</span>
      <span class="pill">Negocio</span>
      <span class="pill soft">Tendencia</span>
    </div>
    <div class="status pass">Aprobado</div>
  </div>

  <table class="case-table">
    <tr>
      <td class="label">Input probado</td>
      <td class="wide">¿Cuál es la tendencia de mis ventas en estas últimas semanas?</td>
      <td class="label">Modo</td>
      <td>Pro / complete</td>
    </tr>
    <tr>
      <td class="label">Fecha / periodo entendido</td>
      <td class="wide">Últimos 14 días hasta 19/04/2026. Ventana móvil.</td>
      <td class="label">Intent</td>
      <td>Esperado: <code>sales_trend</code><br>Real: <code>sales_trend</code><br><span class="muted">Confianza: 0.95</span></td>
    </tr>
    <tr>
      <td class="label">Debería responder</td>
      <td colspan="3">Promedio diario pasa de $152.43 a $183.55; 20.4%</td>
    </tr>
    <tr>
      <td class="label">Respondió la app</td>
      <td colspan="3" class="answer">¡Hola! Estoy emocionado de compartirte que en la Tienda Don Pepe, tus ventas están en una tendencia positiva. El promedio de ventas diarias ha aumentado, pasando de $152.43 a $183.55, lo que representa un crecimiento del 20.4%. 🎉 Esto es una señal muy alentadora de que tus esfuerzos están dando resultados. ¡Sigue así!</td>
    </tr>
    <tr>
      <td class="label">Relevancia para el cliente</td>
      <td>Permite anticipar problemas o aprovechar crecimiento antes de que termine el mes.</td>
      <td class="label">Visual / métricas</td>
      <td>Línea<br><span class="muted">tendencia_ventas, promedio_diario, variacion_porcentual</span></td>
    </tr>
    <tr>
      <td class="label">Observaciones</td>
      <td>Depende de fecha relativa o ventana móvil. El valor esperado corresponde a esta corrida; al ejecutar otro día se recalcula.</td>
      <td class="label">Evidencia</td>
      <td><strong>E-07</strong><br><span class="muted">Pegar captura del chat aquí con input, output y visual si aplica.</span></td>
    </tr>
    <tr>
      <td class="label">Validación</td>
      <td colspan="3">intent ok · contenido ok · visual ok</td>
    </tr>
  </table>
</section>

<section class="test-card">
  <div class="test-head">
    <div>
      <span class="evidence">E-08</span>
      <span class="pill">Negocio</span>
      <span class="pill soft">Alerta de cambio</span>
    </div>
    <div class="status pass">Aprobado</div>
  </div>

  <table class="case-table">
    <tr>
      <td class="label">Input probado</td>
      <td class="wide">¿Ha habido alguna caída o subida inusual en mis ventas recientes?</td>
      <td class="label">Modo</td>
      <td>Pro / complete</td>
    </tr>
    <tr>
      <td class="label">Fecha / periodo entendido</td>
      <td class="wide">Cambio reciente sobre últimos 14 días hasta 19/04/2026.</td>
      <td class="label">Intent</td>
      <td>Esperado: <code>significant_change</code><br>Real: <code>significant_change</code><br><span class="muted">Confianza: 0.95</span></td>
    </tr>
    <tr>
      <td class="label">Debería responder</td>
      <td colspan="3">Cambio reciente de 20.4%</td>
    </tr>
    <tr>
      <td class="label">Respondió la app</td>
      <td colspan="3" class="answer">¡Excelente noticia para Tienda Don Pepe! 🎉 Tus ventas han aumentado un 20.4% en comparación con el periodo anterior. Esto significa que tu promedio diario de ventas ha crecido de $152.43 a $183.55. Este incremento es un indicador positivo de que tu negocio está atrayendo a más clientes, así que sigue trabajando en estrategias que mantengan este impulso. ¡Sigue así! 🚀</td>
    </tr>
    <tr>
      <td class="label">Relevancia para el cliente</td>
      <td>Detecta cambios inusuales para actuar rápido con promociones o abastecimiento.</td>
      <td class="label">Visual / métricas</td>
      <td>Línea<br><span class="muted">cambio_significativo, variacion_porcentual</span></td>
    </tr>
    <tr>
      <td class="label">Observaciones</td>
      <td>Depende de fecha relativa o ventana móvil. El valor esperado corresponde a esta corrida; al ejecutar otro día se recalcula.</td>
      <td class="label">Evidencia</td>
      <td><strong>E-08</strong><br><span class="muted">Pegar captura del chat aquí con input, output y visual si aplica.</span></td>
    </tr>
    <tr>
      <td class="label">Validación</td>
      <td colspan="3">intent ok · contenido ok · visual ok</td>
    </tr>
  </table>
</section>

<section class="test-card">
  <div class="test-head">
    <div>
      <span class="evidence">E-09</span>
      <span class="pill">Negocio</span>
      <span class="pill soft">Mejor día</span>
    </div>
    <div class="status pass">Aprobado</div>
  </div>

  <table class="case-table">
    <tr>
      <td class="label">Input probado</td>
      <td class="wide">¿Cuál ha sido el mejor día de ventas en toda la historia de mi negocio?</td>
      <td class="label">Modo</td>
      <td>Pro / complete</td>
    </tr>
    <tr>
      <td class="label">Fecha / periodo entendido</td>
      <td class="wide">Histórico completo del dataset: 2024-01-01 a 2026-04-19.</td>
      <td class="label">Intent</td>
      <td>Esperado: <code>best_day</code><br>Real: <code>best_day</code><br><span class="muted">Confianza: 0.95</span></td>
    </tr>
    <tr>
      <td class="label">Debería responder</td>
      <td colspan="3">17/12/2024; $507.88</td>
    </tr>
    <tr>
      <td class="label">Respondió la app</td>
      <td colspan="3" class="answer">El martes 17 de diciembre fue un día destacado para Tienda Don Pepe, ya que lograste alcanzar un total de ventas de $507.88. Este resultado indica que tus esfuerzos de ventas y atención al cliente están dando frutos, así que considera replicar las estrategias exitosas de ese día en el futuro. ¡Sigue así! 🎉</td>
    </tr>
    <tr>
      <td class="label">Relevancia para el cliente</td>
      <td>Identifica un pico real para replicar horarios, promociones o inventario.</td>
      <td class="label">Visual / métricas</td>
      <td>Sin gráfica<br><span class="muted">mejor_dia, total_dia</span></td>
    </tr>
    <tr>
      <td class="label">Observaciones</td>
      <td>Output real tomado de test_results.json después de ejecutar node run_tests.js contra POST /api/chat.</td>
      <td class="label">Evidencia</td>
      <td><strong>E-09</strong><br><span class="muted">Pegar captura del chat aquí con input, output y visual si aplica.</span></td>
    </tr>
    <tr>
      <td class="label">Validación</td>
      <td colspan="3">intent ok · contenido ok · visual ok</td>
    </tr>
  </table>
</section>

<section class="test-card">
  <div class="test-head">
    <div>
      <span class="evidence">E-10</span>
      <span class="pill">Negocio</span>
      <span class="pill soft">Días fuertes/flojos</span>
    </div>
    <div class="status pass">Aprobado</div>
  </div>

  <table class="case-table">
    <tr>
      <td class="label">Input probado</td>
      <td class="wide">¿Cuáles son mis días de la semana con más ventas?</td>
      <td class="label">Modo</td>
      <td>Pro / complete</td>
    </tr>
    <tr>
      <td class="label">Fecha / periodo entendido</td>
      <td class="wide">Histórico completo agrupado por día de semana: 2024-01-01 a 2026-04-19.</td>
      <td class="label">Intent</td>
      <td>Esperado: <code>strong_weak_days</code><br>Real: <code>strong_weak_days</code><br><span class="muted">Confianza: 0.95</span></td>
    </tr>
    <tr>
      <td class="label">Debería responder</td>
      <td colspan="3">Mejor día martes $44.52; día más flojo domingo $37.46</td>
    </tr>
    <tr>
      <td class="label">Respondió la app</td>
      <td colspan="3" class="answer">Para Tienda Don Pepe, tu día más fuerte de ventas es el martes, donde logras un promedio de $44.52. En cambio, el domingo se presenta como el día más flojo, con un promedio de $37.46. Esto sugiere que podrías enfocarte en estrategias para incrementar las ventas durante el fin de semana y, quizás, aprovechar el buen rendimiento del martes para lanzar promociones especiales. 📈✨</td>
    </tr>
    <tr>
      <td class="label">Relevancia para el cliente</td>
      <td>Ayuda a planificar promociones y stock según el comportamiento semanal.</td>
      <td class="label">Visual / métricas</td>
      <td>Barra<br><span class="muted">venta_promedio_por_dia, dia_mas_fuerte, dia_mas_flojo</span></td>
    </tr>
    <tr>
      <td class="label">Observaciones</td>
      <td>Output real tomado de test_results.json después de ejecutar node run_tests.js contra POST /api/chat.</td>
      <td class="label">Evidencia</td>
      <td><strong>E-10</strong><br><span class="muted">Pegar captura del chat aquí con input, output y visual si aplica.</span></td>
    </tr>
    <tr>
      <td class="label">Validación</td>
      <td colspan="3">intent ok · contenido ok · visual ok</td>
    </tr>
  </table>
</section>

<section class="test-card">
  <div class="test-head">
    <div>
      <span class="evidence">E-11</span>
      <span class="pill">Negocio</span>
      <span class="pill soft">Retención</span>
    </div>
    <div class="status pass">Aprobado</div>
  </div>

  <table class="case-table">
    <tr>
      <td class="label">Input probado</td>
      <td class="wide">¿Qué clientes fieles dejaron de comprarme recientemente y están en riesgo de no volver?</td>
      <td class="label">Modo</td>
      <td>Pro / complete</td>
    </tr>
    <tr>
      <td class="label">Fecha / periodo entendido</td>
      <td class="wide">Clientes en riesgo contra ventana de 30 días desde 19/04/2026.</td>
      <td class="label">Intent</td>
      <td>Esperado: <code>customer_churn</code><br>Real: <code>customer_churn</code><br><span class="muted">Confianza: 0.95</span></td>
    </tr>
    <tr>
      <td class="label">Debería responder</td>
      <td colspan="3">0 clientes frecuentes en riesgo</td>
    </tr>
    <tr>
      <td class="label">Respondió la app</td>
      <td colspan="3" class="answer">¡Felicidades, Tienda Don Pepe! Todos tus clientes habituales han realizado compras recientemente, lo que es una excelente señal de que están satisfechos con tus productos y servicios. Esto significa que has logrado mantener su interés y fidelidad. Sigue ofreciendo una experiencia excepcional para que continúen regresando. ¡Sigue así! 🎉</td>
    </tr>
    <tr>
      <td class="label">Relevancia para el cliente</td>
      <td>Evita inventar clientes perdidos y muestra si la fidelización está estable.</td>
      <td class="label">Visual / métricas</td>
      <td>Sin gráfica<br><span class="muted">clientes_en_riesgo, ultima_visita</span></td>
    </tr>
    <tr>
      <td class="label">Observaciones</td>
      <td>Caso importante porque el sistema debe saber decir que no hay alerta, sin inventar clientes en riesgo.</td>
      <td class="label">Evidencia</td>
      <td><strong>E-11</strong><br><span class="muted">Pegar captura del chat aquí con input, output y visual si aplica.</span></td>
    </tr>
    <tr>
      <td class="label">Validación</td>
      <td colspan="3">intent ok · contenido ok · visual ok</td>
    </tr>
  </table>
</section>

<section class="test-card">
  <div class="test-head">
    <div>
      <span class="evidence">E-12</span>
      <span class="pill">Negocio</span>
      <span class="pill soft">Clientes frecuentes</span>
    </div>
    <div class="status pass">Aprobado</div>
  </div>

  <table class="case-table">
    <tr>
      <td class="label">Input probado</td>
      <td class="wide">¿Quiénes son los clientes que me compran con mayor frecuencia?</td>
      <td class="label">Modo</td>
      <td>Pro / complete</td>
    </tr>
    <tr>
      <td class="label">Fecha / periodo entendido</td>
      <td class="wide">Histórico completo de clientes: 2024-01-01 a 2026-04-19.</td>
      <td class="label">Intent</td>
      <td>Esperado: <code>repeat_customers</code><br>Real: <code>repeat_customers</code><br><span class="muted">Confianza: 0.9</span></td>
    </tr>
    <tr>
      <td class="label">Debería responder</td>
      <td colspan="3">Carlos Mendoza; 316 visitas; $13,093.86</td>
    </tr>
    <tr>
      <td class="label">Respondió la app</td>
      <td colspan="3" class="answer">Tu negocio, Tienda Don Pepe, cuenta con 10 clientes frecuentes que visitan regularmente. Entre ellos, Carlos Mendoza se destaca como el cliente más activo, realizando un total de 316 visitas y acumulando compras por un valor de $13,093.86. Es importante mantener una buena relación con estos clientes, ya que su lealtad puede contribuir significativamente a tus ingresos. ¡Considera ofrecer promociones especiales para seguir incentivando sus visitas! 😊</td>
    </tr>
    <tr>
      <td class="label">Relevancia para el cliente</td>
      <td>Permite premiar o retener a clientes frecuentes con acciones personalizadas.</td>
      <td class="label">Visual / métricas</td>
      <td>Tabla<br><span class="muted">clientes_frecuentes, num_compras, total_por_cliente</span></td>
    </tr>
    <tr>
      <td class="label">Observaciones</td>
      <td>Output real tomado de test_results.json después de ejecutar node run_tests.js contra POST /api/chat.</td>
      <td class="label">Evidencia</td>
      <td><strong>E-12</strong><br><span class="muted">Pegar captura del chat aquí con input, output y visual si aplica.</span></td>
    </tr>
    <tr>
      <td class="label">Validación</td>
      <td colspan="3">intent ok · contenido ok · visual ok</td>
    </tr>
  </table>
</section>

<section class="test-card">
  <div class="test-head">
    <div>
      <span class="evidence">E-13</span>
      <span class="pill">Negocio</span>
      <span class="pill soft">Ticket promedio</span>
    </div>
    <div class="status pass">Aprobado</div>
  </div>

  <table class="case-table">
    <tr>
      <td class="label">Input probado</td>
      <td class="wide">¿Cuál es mi ticket promedio?</td>
      <td class="label">Modo</td>
      <td>Pro / complete</td>
    </tr>
    <tr>
      <td class="label">Fecha / periodo entendido</td>
      <td class="wide">Todas las transacciones completadas: 2024-01-01 a 2026-04-19.</td>
      <td class="label">Intent</td>
      <td>Esperado: <code>average_ticket</code><br>Real: <code>average_ticket</code><br><span class="muted">Confianza: 0.95</span></td>
    </tr>
    <tr>
      <td class="label">Debería responder</td>
      <td colspan="3">$41.76 sobre transacciones completadas</td>
    </tr>
    <tr>
      <td class="label">Respondió la app</td>
      <td colspan="3" class="answer">Para Tienda Don Pepe, tu ticket promedio por venta es de $41.76. Este valor se ha calculado a partir de un total de 2,827 ventas. Esto significa que, en promedio, cada cliente gasta un poco más de 41 dólares en tu tienda. Puedes considerar estrategias para aumentar este monto, como ofrecer promociones o combos que motiven a los clientes a comprar más. 💡</td>
    </tr>
    <tr>
      <td class="label">Relevancia para el cliente</td>
      <td>Muestra gasto promedio y oportunidades de venta cruzada.</td>
      <td class="label">Visual / métricas</td>
      <td>Sin gráfica<br><span class="muted">ticket_promedio, num_transacciones</span></td>
    </tr>
    <tr>
      <td class="label">Observaciones</td>
      <td>Output real tomado de test_results.json después de ejecutar node run_tests.js contra POST /api/chat.</td>
      <td class="label">Evidencia</td>
      <td><strong>E-13</strong><br><span class="muted">Pegar captura del chat aquí con input, output y visual si aplica.</span></td>
    </tr>
    <tr>
      <td class="label">Validación</td>
      <td colspan="3">intent ok · contenido ok · visual ok</td>
    </tr>
  </table>
</section>

<section class="test-card">
  <div class="test-head">
    <div>
      <span class="evidence">E-14</span>
      <span class="pill">Negocio</span>
      <span class="pill soft">Categorías top</span>
    </div>
    <div class="status pass">Aprobado</div>
  </div>

  <table class="case-table">
    <tr>
      <td class="label">Input probado</td>
      <td class="wide">¿Cuáles son los productos o categorías que más se venden en mi tienda?</td>
      <td class="label">Modo</td>
      <td>Pro / complete</td>
    </tr>
    <tr>
      <td class="label">Fecha / periodo entendido</td>
      <td class="wide">Todas las ventas por categoría: 2024-01-01 a 2026-04-19.</td>
      <td class="label">Intent</td>
      <td>Esperado: <code>top_products</code><br>Real: <code>top_products</code><br><span class="muted">Confianza: 0.95</span></td>
    </tr>
    <tr>
      <td class="label">Debería responder</td>
      <td colspan="3">bebidas $15,630.04; snacks $15,536.31; aceites $15,286.26</td>
    </tr>
    <tr>
      <td class="label">Respondió la app</td>
      <td colspan="3" class="answer">¡Hola! Para Tienda Don Pepe, la categoría que más destaca es &quot;bebidas&quot;, que ha generado ventas de $15,630.04. Justo detrás, se encuentran los &quot;snacks&quot; con $15,536.31 y los &quot;aceites&quot; con $15,286.26. Esto indica que tus clientes tienen una preferencia clara por las bebidas, así que podrías considerar promocionarlas aún más o ampliar la variedad. ¡Sigue así! 🍹📈</td>
    </tr>
    <tr>
      <td class="label">Relevancia para el cliente</td>
      <td>Guía inventario, combos y productos a promocionar.</td>
      <td class="label">Visual / métricas</td>
      <td>Pastel<br><span class="muted">ventas_por_categoria, categoria_top</span></td>
    </tr>
    <tr>
      <td class="label">Observaciones</td>
      <td>Output real tomado de test_results.json después de ejecutar node run_tests.js contra POST /api/chat.</td>
      <td class="label">Evidencia</td>
      <td><strong>E-14</strong><br><span class="muted">Pegar captura del chat aquí con input, output y visual si aplica.</span></td>
    </tr>
    <tr>
      <td class="label">Validación</td>
      <td colspan="3">intent ok · contenido ok · visual ok</td>
    </tr>
  </table>
</section>

<section class="test-card">
  <div class="test-head">
    <div>
      <span class="evidence">E-15</span>
      <span class="pill">Negocio</span>
      <span class="pill soft">Consejo proactivo</span>
    </div>
    <div class="status pass">Aprobado</div>
  </div>

  <table class="case-table">
    <tr>
      <td class="label">Input probado</td>
      <td class="wide">Analiza mis datos y dame un consejo proactivo para mejorar mi negocio.</td>
      <td class="label">Modo</td>
      <td>Pro / complete</td>
    </tr>
    <tr>
      <td class="label">Fecha / periodo entendido</td>
      <td class="wide">Tendencia reciente hasta 19/04/2026 y análisis de días fuertes/flojos.</td>
      <td class="label">Intent</td>
      <td>Esperado: <code>proactive_alert</code><br>Real: <code>proactive_alert</code><br><span class="muted">Confianza: 0.95</span></td>
    </tr>
    <tr>
      <td class="label">Debería responder</td>
      <td colspan="3">Usa tendencia reciente (20.4%) y días fuerte/flojo (martes/domingo)</td>
    </tr>
    <tr>
      <td class="label">Respondió la app</td>
      <td colspan="3" class="answer">📈 ¡Ventas en subida!<br>Tus ventas subieron un 20.4% recientemente. ¡Buen trabajo! Aprovecha el impulso para fidelizar a tus nuevos clientes.<br><br>📅 Dato útil sobre tus ventas<br>Tu día más fuerte es martes y el más flojo es domingo. Podrías hacer promociones los domingo para equilibrar tus ventas.</td>
    </tr>
    <tr>
      <td class="label">Relevancia para el cliente</td>
      <td>Transforma métricas en una recomendación accionable para vender más.</td>
      <td class="label">Visual / métricas</td>
      <td>Sin gráfica<br><span class="muted">sin métrica directa</span></td>
    </tr>
    <tr>
      <td class="label">Observaciones</td>
      <td>Depende de fecha relativa o ventana móvil. El valor esperado corresponde a esta corrida; al ejecutar otro día se recalcula.</td>
      <td class="label">Evidencia</td>
      <td><strong>E-15</strong><br><span class="muted">Pegar captura del chat aquí con input, output y visual si aplica.</span></td>
    </tr>
    <tr>
      <td class="label">Validación</td>
      <td colspan="3">intent ok · contenido ok · visual ok</td>
    </tr>
  </table>
</section>

## 7. Fichas de validación: anexos y barreras


<section class="test-card">
  <div class="test-head">
    <div>
      <span class="evidence">EA-01</span>
      <span class="pill">Anexo</span>
      <span class="pill soft">Error ortográfico</span>
    </div>
    <div class="status pass">Aprobado</div>
  </div>

  <table class="case-table">
    <tr>
      <td class="label">Input probado</td>
      <td class="wide">caunto bendi aller</td>
      <td class="label">Modo</td>
      <td>Pro / complete</td>
    </tr>
    <tr>
      <td class="label">Fecha / periodo entendido</td>
      <td class="wide">&quot;aller&quot; se entiende como &quot;ayer&quot; = 18/04/2026. Valida tolerancia a errores.</td>
      <td class="label">Intent</td>
      <td>Esperado: <code>sales_specific_date</code><br>Real: <code>sales_specific_date</code><br><span class="muted">Confianza: 0.9</span></td>
    </tr>
    <tr>
      <td class="label">Debería responder</td>
      <td colspan="3">Debe entender &quot;aller&quot; como ayer: 18/04/2026; $70.91; 2 transacciones</td>
    </tr>
    <tr>
      <td class="label">Respondió la app</td>
      <td colspan="3" class="answer">El sábado 18 de abril, en Tienda Don Pepe, tuviste ventas por un total de $70.91, realizando 2 transacciones en el día. Esto significa que cada transacción generó un promedio de $35.46. ¡Sigue así y busca maneras de atraer más clientes para aumentar tus ventas! 📈</td>
    </tr>
    <tr>
      <td class="label">Relevancia para el cliente</td>
      <td>Reduce fricción para usuarios que escriben rápido o con errores ortográficos.</td>
      <td class="label">Visual / métricas</td>
      <td>Barra<br><span class="muted">total_ventas_dia, num_transacciones_dia</span></td>
    </tr>
    <tr>
      <td class="label">Observaciones</td>
      <td>Output real tomado de test_results.json después de ejecutar node run_tests.js contra POST /api/chat.</td>
      <td class="label">Evidencia</td>
      <td><strong>EA-01</strong><br><span class="muted">Pegar captura del chat aquí con input, output y visual si aplica.</span></td>
    </tr>
    <tr>
      <td class="label">Validación</td>
      <td colspan="3">intent ok · contenido ok · visual ok</td>
    </tr>
  </table>
</section>

<section class="test-card">
  <div class="test-head">
    <div>
      <span class="evidence">EA-02</span>
      <span class="pill">Anexo</span>
      <span class="pill soft">Ayuda</span>
    </div>
    <div class="status pass">Aprobado</div>
  </div>

  <table class="case-table">
    <tr>
      <td class="label">Input probado</td>
      <td class="wide">¿Qué puedo preguntarte?</td>
      <td class="label">Modo</td>
      <td>Pro / complete</td>
    </tr>
    <tr>
      <td class="label">Fecha / periodo entendido</td>
      <td class="wide">Sin fecha. Valida que el usuario descubra capacidades.</td>
      <td class="label">Intent</td>
      <td>Esperado: <code>help</code><br>Real: <code>help</code><br><span class="muted">Confianza: 0.95</span></td>
    </tr>
    <tr>
      <td class="label">Debería responder</td>
      <td colspan="3">Debe listar capacidades del asistente.</td>
    </tr>
    <tr>
      <td class="label">Respondió la app</td>
      <td colspan="3" class="answer">Puedo responder preguntas como:<br><br>• ¿Cómo voy comparado con el mes pasado?<br>• ¿Qué clientes están en riesgo de no volver?<br>• ¿Cuál es la tendencia de mis ventas?<br>• ¿Quiénes son mis mejores clientes?<br>• Dame un consejo sobre mi negocio<br>• ¿Cuánto vendí en todo el 2025?<br>• ¿Cuál fue mi mejor día de ventas?<br>• ¿Cuál es mi ticket promedio?<br>• ¿Qué es lo que más vendo?<br>• ¿Cuáles son mis días más fuertes?<br>• ¿Cómo pagan mis clientes?<br><br>¡Pregúntame lo que quieras! 😊</td>
    </tr>
    <tr>
      <td class="label">Relevancia para el cliente</td>
      <td>Mejora adopción: el usuario sabe qué puede pedir sin conocer dashboards.</td>
      <td class="label">Visual / métricas</td>
      <td>Sin gráfica<br><span class="muted">sin métrica directa</span></td>
    </tr>
    <tr>
      <td class="label">Observaciones</td>
      <td>Output real tomado de test_results.json después de ejecutar node run_tests.js contra POST /api/chat.</td>
      <td class="label">Evidencia</td>
      <td><strong>EA-02</strong><br><span class="muted">Pegar captura del chat aquí con input, output y visual si aplica.</span></td>
    </tr>
    <tr>
      <td class="label">Validación</td>
      <td colspan="3">intent ok · contenido ok · visual ok</td>
    </tr>
  </table>
</section>

<section class="test-card">
  <div class="test-head">
    <div>
      <span class="evidence">EA-03</span>
      <span class="pill">Anexo</span>
      <span class="pill soft">Saludo</span>
    </div>
    <div class="status pass">Aprobado</div>
  </div>

  <table class="case-table">
    <tr>
      <td class="label">Input probado</td>
      <td class="wide">Hola</td>
      <td class="label">Modo</td>
      <td>Pro / complete</td>
    </tr>
    <tr>
      <td class="label">Fecha / periodo entendido</td>
      <td class="wide">Sin fecha. Valida entrada conversacional con contexto del comercio.</td>
      <td class="label">Intent</td>
      <td>Esperado: <code>greeting</code><br>Real: <code>greeting</code><br><span class="muted">Confianza: 0.95</span></td>
    </tr>
    <tr>
      <td class="label">Debería responder</td>
      <td colspan="3">Debe saludar y mencionar Tienda Don Pepe.</td>
    </tr>
    <tr>
      <td class="label">Respondió la app</td>
      <td colspan="3" class="answer">¡Hola! 👋 Soy tu contador de bolsillo para Tienda Don Pepe. Puedo ayudarte con información sobre tus ventas, clientes y tendencias. ¿Qué quieres saber?</td>
    </tr>
    <tr>
      <td class="label">Relevancia para el cliente</td>
      <td>Mantiene una experiencia conversacional cercana y contextualizada.</td>
      <td class="label">Visual / métricas</td>
      <td>Sin gráfica<br><span class="muted">sin métrica directa</span></td>
    </tr>
    <tr>
      <td class="label">Observaciones</td>
      <td>Output real tomado de test_results.json después de ejecutar node run_tests.js contra POST /api/chat.</td>
      <td class="label">Evidencia</td>
      <td><strong>EA-03</strong><br><span class="muted">Pegar captura del chat aquí con input, output y visual si aplica.</span></td>
    </tr>
    <tr>
      <td class="label">Validación</td>
      <td colspan="3">intent ok · contenido ok · visual ok</td>
    </tr>
  </table>
</section>

<section class="test-card">
  <div class="test-head">
    <div>
      <span class="evidence">EA-04</span>
      <span class="pill">Anexo</span>
      <span class="pill soft">Cálculo práctico</span>
    </div>
    <div class="status pass">Aprobado</div>
  </div>

  <table class="case-table">
    <tr>
      <td class="label">Input probado</td>
      <td class="wide">Si un cliente me lleva 3 atunes de $1.50 y 2 colas de $2.00, ¿cuánto debo cobrarle en total?</td>
      <td class="label">Modo</td>
      <td>Pro / complete</td>
    </tr>
    <tr>
      <td class="label">Fecha / periodo entendido</td>
      <td class="wide">Sin dataset. Valida cálculo práctico de caja.</td>
      <td class="label">Intent</td>
      <td>Esperado: <code>unknown</code><br>Real: <code>unknown</code><br><span class="muted">Confianza: 0.1</span></td>
    </tr>
    <tr>
      <td class="label">Debería responder</td>
      <td colspan="3">Debe resolver $8.50 sin consultar el dataset.</td>
    </tr>
    <tr>
      <td class="label">Respondió la app</td>
      <td colspan="3" class="answer">Para calcular el total, multiplica el precio de los atunes y colas por la cantidad: <br><br>3 atunes a $1.50 son $4.50 y 2 colas a $2.00 son $4.00. <br><br>Sumando ambos, el total es $4.50 + $4.00 = $8.50. ¡Debes cobrarle $8.50!</td>
    </tr>
    <tr>
      <td class="label">Relevancia para el cliente</td>
      <td>Apoya una tarea cotidiana de caja, útil para personas sin educación financiera formal.</td>
      <td class="label">Visual / métricas</td>
      <td>Sin gráfica<br><span class="muted">sin métrica directa</span></td>
    </tr>
    <tr>
      <td class="label">Observaciones</td>
      <td>Output real tomado de test_results.json después de ejecutar node run_tests.js contra POST /api/chat.</td>
      <td class="label">Evidencia</td>
      <td><strong>EA-04</strong><br><span class="muted">Pegar captura del chat aquí con input, output y visual si aplica.</span></td>
    </tr>
    <tr>
      <td class="label">Validación</td>
      <td colspan="3">intent ok · contenido ok · visual ok</td>
    </tr>
  </table>
</section>

<section class="test-card">
  <div class="test-head">
    <div>
      <span class="evidence">EA-05</span>
      <span class="pill">Anexo</span>
      <span class="pill soft">Fuera de dominio</span>
    </div>
    <div class="status pass">Aprobado</div>
  </div>

  <table class="case-table">
    <tr>
      <td class="label">Input probado</td>
      <td class="wide">¿Quién ganó el mundial de fútbol de la FIFA?</td>
      <td class="label">Modo</td>
      <td>Pro / complete</td>
    </tr>
    <tr>
      <td class="label">Fecha / periodo entendido</td>
      <td class="wide">Sin fecha. Valida barrera de dominio: la app no debe convertirse en asistente general.</td>
      <td class="label">Intent</td>
      <td>Esperado: <code>unknown</code><br>Real: <code>unknown</code><br><span class="muted">Confianza: 0.1</span></td>
    </tr>
    <tr>
      <td class="label">Debería responder</td>
      <td colspan="3">Debe rechazar cordialmente por estar fuera del negocio.</td>
    </tr>
    <tr>
      <td class="label">Respondió la app</td>
      <td colspan="3" class="answer">¡Hola! Lamentablemente, no puedo ayudarte con eso. Mi rol es asistirte con datos de ventas y la salud de &quot;Tienda Don Pepe&quot;. ¿Hay algo relacionado con tu negocio en lo que pueda ayudarte?</td>
    </tr>
    <tr>
      <td class="label">Relevancia para el cliente</td>
      <td>Protege el foco del producto. Aunque exista LLM, el objetivo no es responder temas generales.</td>
      <td class="label">Visual / métricas</td>
      <td>Sin gráfica<br><span class="muted">sin métrica directa</span></td>
    </tr>
    <tr>
      <td class="label">Observaciones</td>
      <td>Con OpenAI activo, un LLM podría saber datos de fútbol, pero esta app debe rechazarlo porque su rol es ayudar con ventas, clientes y salud del negocio. Esta barrera evita desviar el producto.</td>
      <td class="label">Evidencia</td>
      <td><strong>EA-05</strong><br><span class="muted">Pegar captura del chat aquí con input, output y visual si aplica.</span></td>
    </tr>
    <tr>
      <td class="label">Validación</td>
      <td colspan="3">intent ok · contenido ok · visual ok</td>
    </tr>
  </table>
</section>

<section class="test-card">
  <div class="test-head">
    <div>
      <span class="evidence">EA-06</span>
      <span class="pill">Anexo</span>
      <span class="pill soft">Modo Simple</span>
    </div>
    <div class="status pass">Aprobado</div>
  </div>

  <table class="case-table">
    <tr>
      <td class="label">Input probado</td>
      <td class="wide">¿Cuánto vendí esta semana?</td>
      <td class="label">Modo</td>
      <td>Simple</td>
    </tr>
    <tr>
      <td class="label">Fecha / periodo entendido</td>
      <td class="wide">&quot;esta semana&quot; = 2026-04-13 a 2026-04-19. Misma pregunta que E-03, pero en modo Simple.</td>
      <td class="label">Intent</td>
      <td>Esperado: <code>sales_this_week</code><br>Real: <code>sales_this_week</code><br><span class="muted">Confianza: 0.95</span></td>
    </tr>
    <tr>
      <td class="label">Debería responder</td>
      <td colspan="3">Debe responder breve: $1,332.61 y 30 transacciones.</td>
    </tr>
    <tr>
      <td class="label">Respondió la app</td>
      <td colspan="3" class="answer">Esta semana, en Tienda Don Pepe, realizaste ventas por un total de $1332.61 en 30 transacciones. ¡Buen trabajo! 🛍️</td>
    </tr>
    <tr>
      <td class="label">Relevancia para el cliente</td>
      <td>Demuestra que Simple da el dato con baja carga cognitiva, mientras Pro aporta más contexto.</td>
      <td class="label">Visual / métricas</td>
      <td>Barra<br><span class="muted">total_ventas, num_transacciones</span></td>
    </tr>
    <tr>
      <td class="label">Observaciones</td>
      <td>Se compara contra E-03. La diferencia esperada no es el dato, sino la profundidad: Simple debe responder breve; Pro debe agregar contexto y visual.</td>
      <td class="label">Evidencia</td>
      <td><strong>EA-06</strong><br><span class="muted">Pegar captura del chat aquí con input, output y visual si aplica.</span></td>
    </tr>
    <tr>
      <td class="label">Validación</td>
      <td colspan="3">intent ok · contenido ok · visual ok</td>
    </tr>
  </table>
</section>

<section class="test-card">
  <div class="test-head">
    <div>
      <span class="evidence">EA-07</span>
      <span class="pill">Anexo</span>
      <span class="pill soft">Método de pago</span>
    </div>
    <div class="status pass">Aprobado</div>
  </div>

  <table class="case-table">
    <tr>
      <td class="label">Input probado</td>
      <td class="wide">¿Cómo pagan mis clientes?</td>
      <td class="label">Modo</td>
      <td>Pro / complete</td>
    </tr>
    <tr>
      <td class="label">Fecha / periodo entendido</td>
      <td class="wide">Histórico completo de métodos de pago: 2024-01-01 a 2026-04-19.</td>
      <td class="label">Intent</td>
      <td>Esperado: <code>payment_methods</code><br>Real: <code>payment_methods</code><br><span class="muted">Confianza: 0.95</span></td>
    </tr>
    <tr>
      <td class="label">Debería responder</td>
      <td colspan="3">Dataset m001 contiene deuna: $118,048.67; 2827 transacciones.</td>
    </tr>
    <tr>
      <td class="label">Respondió la app</td>
      <td colspan="3" class="answer">En Tienda Don Pepe, el método de pago más popular entre tus clientes es &quot;deuna&quot;, que ha generado un total de $118,048.67 a través de 2,827 ventas. Esto indica que tus clientes prefieren utilizar este método, por lo que podrías considerar promocionarlo aún más o asegurarte de que sea una opción destacada en tu tienda. 🎉💳</td>
    </tr>
    <tr>
      <td class="label">Relevancia para el cliente</td>
      <td>Valida el intent, aunque se documenta como anexo porque m001 solo tiene pagos Deuna.</td>
      <td class="label">Visual / métricas</td>
      <td>Pastel<br><span class="muted">metodos_de_pago, total_por_metodo</span></td>
    </tr>
    <tr>
      <td class="label">Observaciones</td>
      <td>El dataset de Tienda Don Pepe solo contiene el método &quot;deuna&quot;; por eso no aporta comparación entre medios, pero sí valida clasificación, cálculo y visualización.</td>
      <td class="label">Evidencia</td>
      <td><strong>EA-07</strong><br><span class="muted">Pegar captura del chat aquí con input, output y visual si aplica.</span></td>
    </tr>
    <tr>
      <td class="label">Validación</td>
      <td colspan="3">intent ok · contenido ok · visual ok</td>
    </tr>
  </table>
</section>

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
