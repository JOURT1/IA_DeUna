<style>
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
**Comercio evaluado:** Tienda Don Pepe (m001)  
**Fecha de generación del reporte:** 19 de abril de 2026, 02:37 p. m.  
**Modo principal evaluado:** Pro / `complete`

## 1. Objetivo del entregable

Este PDF documenta el set completo de validación del chatbot: 15 preguntas principales de negocio y anexos de barreras/modos. Cada fila incluye el input exacto probado, la fecha o periodo interpretado, el intent esperado y real, la respuesta esperada, el output real observado del endpoint, las métricas/visualizaciones usadas, el resultado y el código de evidencia para que luego se pegue la captura.

<div class="note">
Las fechas relativas no están quemadas. La app calcula <strong>"hoy"</strong>, <strong>"ayer"</strong>, <strong>"esta semana"</strong> y <strong>"este mes"</strong> con la fecha real de Ecuador (<code>America/Guayaquil</code>) al momento de la pregunta. Por eso el dato esperado se llama "en esta corrida": si la prueba se ejecuta otro día, el sistema vuelve a calcular la fecha correcta y cambia los montos según el dataset.
</div>

<div class="ok">
Los outputs de las tablas vienen de <code>test_results.json</code>, generado por <code>node run_tests.js</code> contra el endpoint real <code>POST /api/chat</code>. Resultado: <strong>15/15</strong> preguntas principales correctas (100%) y <strong>7/7</strong> anexos correctos (100%).
</div>

## 2. Contexto del dataset y negocio evaluado

<table class="meta">
  <tr><td>Fuente de datos</td><td><code>server/src/data/transactions.json</code></td></tr>
  <tr><td>Comercio</td><td>Tienda Don Pepe</td></tr>
  <tr><td>ID de comercio</td><td>m001. El prototipo fuerza este comercio para una demo controlada.</td></tr>
  <tr><td>Tipo de negocio</td><td>abarrotes / tienda de barrio</td></tr>
  <tr><td>Ciudad</td><td>Quito</td></tr>
  <tr><td>Periodo histórico del dataset</td><td>2024-01-01 a 2026-04-19</td></tr>
  <tr><td>Transacciones completadas</td><td>2,827</td></tr>
  <tr><td>Total histórico vendido</td><td>$118,048.67</td></tr>
  <tr><td>Método de pago en m001</td><td>deuna. Por eso "métodos de pago" se deja como anexo: valida el intent, pero aporta menos comparación.</td></tr>
</table>

## 3. Referencia dinámica de fechas

Esta corrida se generó con fecha real de Ecuador equivalente a <strong>19/04/2026</strong>. Las expresiones relativas se interpretaron así:

<table class="date-ref">
  <tr><td>"hoy"</td><td>19/04/2026. Se calcula con <code>getCurrentEcuadorDate()</code>, no con la última fecha del dataset.</td></tr>
  <tr><td>"ayer"</td><td>18/04/2026. Se calcula restando un día a la fecha real de Ecuador.</td></tr>
  <tr><td>"esta semana"</td><td>2026-04-13 a 2026-04-19. Semana actual de lunes a domingo.</td></tr>
  <tr><td>"este mes"</td><td>abril de 2026. Mes calendario actual según Ecuador.</td></tr>
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
  <tbody>
    <tr>
      <td><strong>E-01</strong></td>
      <td>15 preguntas de negocio</td>
      <td>Ventas diarias</td>
      <td>¿Cuánto he vendido el día de hoy?</td>
      <td>&quot;hoy&quot; = 19/04/2026. Se calcula con la fecha real de Ecuador al momento de preguntar.</td>
      <td>Pulso del día: saber si hoy ya hubo movimiento y cuánto ingresó.</td>
      <td><strong>Aprobado</strong></td>
    </tr>

    <tr>
      <td><strong>E-02</strong></td>
      <td>15 preguntas de negocio</td>
      <td>Ventas por fecha</td>
      <td>¿Cuánto vendí ayer?</td>
      <td>&quot;ayer&quot; = 18/04/2026. Se calcula restando un día a &quot;hoy&quot;.</td>
      <td>Comparar rápidamente el día anterior con el avance actual.</td>
      <td><strong>Aprobado</strong></td>
    </tr>

    <tr>
      <td><strong>E-03</strong></td>
      <td>15 preguntas de negocio</td>
      <td>Ventas semanales</td>
      <td>¿Cuánto vendí esta semana?</td>
      <td>&quot;esta semana&quot; = 2026-04-13 a 2026-04-19. Semana calculada de lunes a domingo según fecha real.</td>
      <td>Revisar desempeño semanal sin leer reportes manuales.</td>
      <td><strong>Aprobado</strong></td>
    </tr>

    <tr>
      <td><strong>E-04</strong></td>
      <td>15 preguntas de negocio</td>
      <td>Ventas mensuales</td>
      <td>¿Cuál es el total de mis ventas de este mes?</td>
      <td>&quot;este mes&quot; = abril de 2026. Mes actual calculado desde fecha real.</td>
      <td>Controlar avance mensual y flujo de caja.</td>
      <td><strong>Aprobado</strong></td>
    </tr>

    <tr>
      <td><strong>E-05</strong></td>
      <td>15 preguntas de negocio</td>
      <td>Ventas anuales</td>
      <td>¿Cuánto generé en todo el año 2025?</td>
      <td>Año explícito 2025. No depende de &quot;hoy&quot;.</td>
      <td>Leer desempeño anual histórico para decisiones de crecimiento.</td>
      <td><strong>Aprobado</strong></td>
    </tr>

    <tr>
      <td><strong>E-06</strong></td>
      <td>15 preguntas de negocio</td>
      <td>Comparación</td>
      <td>¿Cómo voy en ventas comparado con el mes pasado?</td>
      <td>Compara abril de 2026 contra el mes anterior. Periodos calculados desde fecha real.</td>
      <td>Detectar si el mes actual va mejor o peor que el anterior.</td>
      <td><strong>Aprobado</strong></td>
    </tr>

    <tr>
      <td><strong>E-07</strong></td>
      <td>15 preguntas de negocio</td>
      <td>Tendencia</td>
      <td>¿Cuál es la tendencia de mis ventas en estas últimas semanas?</td>
      <td>Últimos 14 días hasta 19/04/2026. Ventana móvil, no fija.</td>
      <td>Entender si las ventas recientes están subiendo o bajando.</td>
      <td><strong>Aprobado</strong></td>
    </tr>

    <tr>
      <td><strong>E-08</strong></td>
      <td>15 preguntas de negocio</td>
      <td>Alerta de cambio</td>
      <td>¿Ha habido alguna caída o subida inusual en mis ventas recientes?</td>
      <td>Cambio reciente sobre los últimos 14 días hasta 19/04/2026.</td>
      <td>Identificar cambios inusuales que requieran acción.</td>
      <td><strong>Aprobado</strong></td>
    </tr>

    <tr>
      <td><strong>E-09</strong></td>
      <td>15 preguntas de negocio</td>
      <td>Mejor día</td>
      <td>¿Cuál ha sido el mejor día de ventas en toda la historia de mi negocio?</td>
      <td>Histórico completo del dataset: 2024-01-01 a 2026-04-19.</td>
      <td>Encontrar un pico histórico que pueda replicarse.</td>
      <td><strong>Aprobado</strong></td>
    </tr>

    <tr>
      <td><strong>E-10</strong></td>
      <td>15 preguntas de negocio</td>
      <td>Días fuertes/flojos</td>
      <td>¿Cuáles son mis días de la semana con más ventas?</td>
      <td>Histórico completo agrupado por día de semana: 2024-01-01 a 2026-04-19.</td>
      <td>Planificar promociones e inventario por día de semana.</td>
      <td><strong>Aprobado</strong></td>
    </tr>

    <tr>
      <td><strong>E-11</strong></td>
      <td>15 preguntas de negocio</td>
      <td>Retención</td>
      <td>¿Qué clientes fieles dejaron de comprarme recientemente y están en riesgo de no volver?</td>
      <td>Riesgo de churn calculado contra los últimos 30 días desde 19/04/2026.</td>
      <td>Evitar inventar alertas cuando no hay clientes en riesgo.</td>
      <td><strong>Aprobado</strong></td>
    </tr>

    <tr>
      <td><strong>E-12</strong></td>
      <td>15 preguntas de negocio</td>
      <td>Clientes frecuentes</td>
      <td>¿Quiénes son los clientes que me compran con mayor frecuencia?</td>
      <td>Histórico completo de clientes: 2024-01-01 a 2026-04-19.</td>
      <td>Identificar clientes de mayor frecuencia para fidelización.</td>
      <td><strong>Aprobado</strong></td>
    </tr>

    <tr>
      <td><strong>E-13</strong></td>
      <td>15 preguntas de negocio</td>
      <td>Ticket promedio</td>
      <td>¿Cuál es mi ticket promedio?</td>
      <td>Histórico completo de transacciones completadas: 2024-01-01 a 2026-04-19.</td>
      <td>Medir gasto promedio y oportunidades de venta cruzada.</td>
      <td><strong>Aprobado</strong></td>
    </tr>

    <tr>
      <td><strong>E-14</strong></td>
      <td>15 preguntas de negocio</td>
      <td>Categorías top</td>
      <td>¿Cuáles son los productos o categorías que más se venden en mi tienda?</td>
      <td>Histórico completo por categoría: 2024-01-01 a 2026-04-19.</td>
      <td>Priorizar inventario, combos y categorías fuertes.</td>
      <td><strong>Aprobado</strong></td>
    </tr>

    <tr>
      <td><strong>E-15</strong></td>
      <td>15 preguntas de negocio</td>
      <td>Consejo proactivo</td>
      <td>Analiza mis datos y dame un consejo proactivo para mejorar mi negocio.</td>
      <td>Recomendación proactiva basada en tendencia reciente hasta 19/04/2026 y días fuertes/flojos.</td>
      <td>Convertir métricas en una recomendación accionable.</td>
      <td><strong>Aprobado</strong></td>
    </tr>

    <tr>
      <td><strong>EA-01</strong></td>
      <td>Anexo de barreras y modos</td>
      <td>Error ortográfico</td>
      <td>caunto bendi aller</td>
      <td>&quot;aller&quot; se interpreta como &quot;ayer&quot; = 18/04/2026. Valida tolerancia ortográfica.</td>
      <td>Validar escritura con errores comunes.</td>
      <td><strong>Aprobado</strong></td>
    </tr>

    <tr>
      <td><strong>EA-02</strong></td>
      <td>Anexo de barreras y modos</td>
      <td>Ayuda</td>
      <td>¿Qué puedo preguntarte?</td>
      <td>No aplica fecha. Valida menú de ayuda.</td>
      <td>Guiar a usuarios que no saben qué preguntar.</td>
      <td><strong>Aprobado</strong></td>
    </tr>

    <tr>
      <td><strong>EA-03</strong></td>
      <td>Anexo de barreras y modos</td>
      <td>Saludo</td>
      <td>Hola</td>
      <td>No aplica fecha. Valida saludo con contexto del comercio.</td>
      <td>Confirmar experiencia conversacional básica.</td>
      <td><strong>Aprobado</strong></td>
    </tr>

    <tr>
      <td><strong>EA-04</strong></td>
      <td>Anexo de barreras y modos</td>
      <td>Cálculo práctico</td>
      <td>Si un cliente me lleva 3 atunes de $1.50 y 2 colas de $2.00, ¿cuánto debo cobrarle en total?</td>
      <td>No aplica dataset. Valida cálculo práctico de caja.</td>
      <td>Resolver una operación cotidiana de caja.</td>
      <td><strong>Aprobado</strong></td>
    </tr>

    <tr>
      <td><strong>EA-05</strong></td>
      <td>Anexo de barreras y modos</td>
      <td>Fuera de dominio</td>
      <td>¿Quién ganó el mundial de fútbol de la FIFA?</td>
      <td>No aplica fecha. Valida límite de dominio.</td>
      <td>Rechazar temas fuera del negocio sin perder cordialidad.</td>
      <td><strong>Aprobado</strong></td>
    </tr>

    <tr>
      <td><strong>EA-06</strong></td>
      <td>Anexo de barreras y modos</td>
      <td>Modo Simple</td>
      <td>¿Cuánto vendí esta semana?</td>
      <td>&quot;esta semana&quot; = 2026-04-13 a 2026-04-19. Misma pregunta que E-03, pero en modo Simple.</td>
      <td>Comparar brevedad del modo Simple frente al modo Pro.</td>
      <td><strong>Aprobado</strong></td>
    </tr>

    <tr>
      <td><strong>EA-07</strong></td>
      <td>Anexo de barreras y modos</td>
      <td>Método de pago</td>
      <td>¿Cómo pagan mis clientes?</td>
      <td>Histórico completo de métodos de pago: 2024-01-01 a 2026-04-19.</td>
      <td>Validar intent de medios de pago aunque el dataset solo tenga Deuna.</td>
      <td><strong>Aprobado</strong></td>
    </tr>
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
  <tbody>
    <tr>
      <td><strong>E-01</strong></td>
      <td>Ventas diarias<br><span class="muted">Pulso del día: saber si hoy ya hubo movimiento y cuánto ingresó.</span></td>
      <td>¿Cuánto he vendido el día de hoy?</td>
      <td>&quot;hoy&quot; = 19/04/2026. Se calcula con la fecha real de Ecuador al momento de preguntar.</td>
      <td>Pro / complete<br><code>sales_today</code><br><span class="muted">real: <code>sales_today</code><br>conf.: 0.95</span></td>
      <td>19/04/2026; $206.03; 5 transacciones</td>
      <td>Hoy, en Tienda Don Pepe, lograste ventas por un total de $206.03, distribuidas en 5 transacciones. Esto significa que cada cliente que compró contribuyó a tu negocio, lo cual es un buen indicador de actividad. Sigue así y considera estrategias para aumentar tanto el número de transacciones como el monto total de ventas. ¡Buen trabajo! 💪📈</td>
      <td>total_ventas_dia, num_transacciones_dia<br><span class="muted">Visual esperado: Barra<br>Visual real: Barra</span></td>
      <td><strong>Aprobado</strong><br>intent ok; texto ok; visual ok</td>
    </tr>

    <tr>
      <td><strong>E-02</strong></td>
      <td>Ventas por fecha<br><span class="muted">Comparar rápidamente el día anterior con el avance actual.</span></td>
      <td>¿Cuánto vendí ayer?</td>
      <td>&quot;ayer&quot; = 18/04/2026. Se calcula restando un día a &quot;hoy&quot;.</td>
      <td>Pro / complete<br><code>sales_specific_date</code><br><span class="muted">real: <code>sales_specific_date</code><br>conf.: 0.95</span></td>
      <td>18/04/2026; $70.91; 2 transacciones</td>
      <td>El sábado 18 de abril, en Tienda Don Pepe, tuviste ventas por un total de $70.91, realizando 2 transacciones en el día. Esto significa que cada transacción generó un promedio de $35.46. ¡Sigue así y busca maneras de atraer más clientes para aumentar tus ventas! 📈</td>
      <td>total_ventas_dia, num_transacciones_dia<br><span class="muted">Visual esperado: Barra<br>Visual real: Barra</span></td>
      <td><strong>Aprobado</strong><br>intent ok; texto ok; visual ok</td>
    </tr>

    <tr>
      <td><strong>E-03</strong></td>
      <td>Ventas semanales<br><span class="muted">Revisar desempeño semanal sin leer reportes manuales.</span></td>
      <td>¿Cuánto vendí esta semana?</td>
      <td>&quot;esta semana&quot; = 2026-04-13 a 2026-04-19. Semana calculada de lunes a domingo según fecha real.</td>
      <td>Pro / complete<br><code>sales_this_week</code><br><span class="muted">real: <code>sales_this_week</code><br>conf.: 0.95</span></td>
      <td>Semana 13/04/2026-19/04/2026; $1,332.61; 30 transacciones</td>
      <td>Esta semana, en Tienda Don Pepe, lograste vender un total de $1,332.61 a través de 30 transacciones. 🎉 Esto muestra que tus esfuerzos están dando frutos y que hay un buen flujo de clientes. Te animo a seguir promoviendo tus productos y a mantener la atención en la satisfacción del cliente para seguir mejorando estas cifras. ¡Sigue así! 💪</td>
      <td>total_ventas, num_transacciones<br><span class="muted">Visual esperado: Barra<br>Visual real: Barra</span></td>
      <td><strong>Aprobado</strong><br>intent ok; texto ok; visual ok</td>
    </tr>

    <tr>
      <td><strong>E-04</strong></td>
      <td>Ventas mensuales<br><span class="muted">Controlar avance mensual y flujo de caja.</span></td>
      <td>¿Cuál es el total de mis ventas de este mes?</td>
      <td>&quot;este mes&quot; = abril de 2026. Mes actual calculado desde fecha real.</td>
      <td>Pro / complete<br><code>sales_this_month</code><br><span class="muted">real: <code>sales_this_month</code><br>conf.: 0.95</span></td>
      <td>abril de 2026; $3,356.19; 78 transacciones</td>
      <td>Este mes, en Tienda Don Pepe, lograste ventas por un total de $3,356.19 a través de 78 transacciones. Esto significa que cada venta promedio fue de aproximadamente $43. Asegúrate de seguir ofreciendo un excelente servicio al cliente para mantener y aumentar estas cifras. ¡Sigue así! 🎉</td>
      <td>total_ventas, num_transacciones<br><span class="muted">Visual esperado: Barra<br>Visual real: Barra</span></td>
      <td><strong>Aprobado</strong><br>intent ok; texto ok; visual ok</td>
    </tr>

    <tr>
      <td><strong>E-05</strong></td>
      <td>Ventas anuales<br><span class="muted">Leer desempeño anual histórico para decisiones de crecimiento.</span></td>
      <td>¿Cuánto generé en todo el año 2025?</td>
      <td>Año explícito 2025. No depende de &quot;hoy&quot;.</td>
      <td>Pro / complete<br><code>sales_specific_year</code><br><span class="muted">real: <code>sales_specific_year</code><br>conf.: 0.9</span></td>
      <td>Año 2025; $51,305.18; 1224 transacciones</td>
      <td>En el año 2025, tu negocio, Tienda Don Pepe, logró un excelente desempeño al alcanzar un total de $51,305.18 en ventas. Esto se traduce en 1,224 transacciones, lo que demuestra un buen flujo de clientes y una sólida actividad comercial. ¡Sigue así y mantén el impulso! 💪📈</td>
      <td>total_ventas_ano, conteo_transacciones_ano<br><span class="muted">Visual esperado: Línea<br>Visual real: Línea</span></td>
      <td><strong>Aprobado</strong><br>intent ok; texto ok; visual ok</td>
    </tr>

    <tr>
      <td><strong>E-06</strong></td>
      <td>Comparación<br><span class="muted">Detectar si el mes actual va mejor o peor que el anterior.</span></td>
      <td>¿Cómo voy en ventas comparado con el mes pasado?</td>
      <td>Compara abril de 2026 contra el mes anterior. Periodos calculados desde fecha real.</td>
      <td>Pro / complete<br><code>sales_comparison</code><br><span class="muted">real: <code>sales_comparison</code><br>conf.: 0.95</span></td>
      <td>Mes actual $3,356.19 vs mes anterior $4,167.53; variación -19.5%</td>
      <td>Este mes, en Tienda Don Pepe, has generado un total de $3,356.19 en ventas, lo que representa una disminución de $811.34 en comparación con los $4,167.53 que lograste el mes pasado. Esto equivale a una caída del 19.5% en tus ventas. <br><br>Te animo a analizar qué estrategias puedes implementar para mejorar tus resultados el próximo mes. ¡Siempre hay oportunidades para crecer! 📈</td>
      <td>total_mes_actual, total_mes_anterior, variacion_porcentual<br><span class="muted">Visual esperado: Barra<br>Visual real: Barra</span></td>
      <td><strong>Aprobado</strong><br>intent ok; texto ok; visual ok</td>
    </tr>

    <tr>
      <td><strong>E-07</strong></td>
      <td>Tendencia<br><span class="muted">Entender si las ventas recientes están subiendo o bajando.</span></td>
      <td>¿Cuál es la tendencia de mis ventas en estas últimas semanas?</td>
      <td>Últimos 14 días hasta 19/04/2026. Ventana móvil, no fija.</td>
      <td>Pro / complete<br><code>sales_trend</code><br><span class="muted">real: <code>sales_trend</code><br>conf.: 0.95</span></td>
      <td>Promedio diario pasa de $152.43 a $183.55; 20.4%</td>
      <td>¡Hola! Estoy emocionado de compartirte que en la Tienda Don Pepe, tus ventas están en una tendencia positiva. El promedio de ventas diarias ha aumentado, pasando de $152.43 a $183.55, lo que representa un crecimiento del 20.4%. 🎉 Esto es una señal muy alentadora de que tus esfuerzos están dando resultados. ¡Sigue así!</td>
      <td>tendencia_ventas, promedio_diario, variacion_porcentual<br><span class="muted">Visual esperado: Línea<br>Visual real: Línea</span></td>
      <td><strong>Aprobado</strong><br>intent ok; texto ok; visual ok</td>
    </tr>

    <tr>
      <td><strong>E-08</strong></td>
      <td>Alerta de cambio<br><span class="muted">Identificar cambios inusuales que requieran acción.</span></td>
      <td>¿Ha habido alguna caída o subida inusual en mis ventas recientes?</td>
      <td>Cambio reciente sobre los últimos 14 días hasta 19/04/2026.</td>
      <td>Pro / complete<br><code>significant_change</code><br><span class="muted">real: <code>significant_change</code><br>conf.: 0.95</span></td>
      <td>Cambio reciente de 20.4%</td>
      <td>¡Excelente noticia para Tienda Don Pepe! 🎉 Tus ventas han aumentado un 20.4% en comparación con el periodo anterior. Esto significa que tu promedio diario de ventas ha crecido de $152.43 a $183.55. Este incremento es un indicador positivo de que tu negocio está atrayendo a más clientes, así que sigue trabajando en estrategias que mantengan este impulso. ¡Sigue así! 🚀</td>
      <td>cambio_significativo, variacion_porcentual<br><span class="muted">Visual esperado: Línea<br>Visual real: Línea</span></td>
      <td><strong>Aprobado</strong><br>intent ok; texto ok; visual ok</td>
    </tr>

    <tr>
      <td><strong>E-09</strong></td>
      <td>Mejor día<br><span class="muted">Encontrar un pico histórico que pueda replicarse.</span></td>
      <td>¿Cuál ha sido el mejor día de ventas en toda la historia de mi negocio?</td>
      <td>Histórico completo del dataset: 2024-01-01 a 2026-04-19.</td>
      <td>Pro / complete<br><code>best_day</code><br><span class="muted">real: <code>best_day</code><br>conf.: 0.95</span></td>
      <td>17/12/2024; $507.88</td>
      <td>El martes 17 de diciembre fue un día destacado para Tienda Don Pepe, ya que lograste alcanzar un total de ventas de $507.88. Este resultado indica que tus esfuerzos de ventas y atención al cliente están dando frutos, así que considera replicar las estrategias exitosas de ese día en el futuro. ¡Sigue así! 🎉</td>
      <td>mejor_dia, total_dia<br><span class="muted">Visual esperado: Sin gráfica<br>Visual real: Sin gráfica</span></td>
      <td><strong>Aprobado</strong><br>intent ok; texto ok; visual ok</td>
    </tr>

    <tr>
      <td><strong>E-10</strong></td>
      <td>Días fuertes/flojos<br><span class="muted">Planificar promociones e inventario por día de semana.</span></td>
      <td>¿Cuáles son mis días de la semana con más ventas?</td>
      <td>Histórico completo agrupado por día de semana: 2024-01-01 a 2026-04-19.</td>
      <td>Pro / complete<br><code>strong_weak_days</code><br><span class="muted">real: <code>strong_weak_days</code><br>conf.: 0.95</span></td>
      <td>Mejor día martes $44.52; día más flojo domingo $37.46</td>
      <td>Para Tienda Don Pepe, tu día más fuerte de ventas es el martes, donde logras un promedio de $44.52. En cambio, el domingo se presenta como el día más flojo, con un promedio de $37.46. Esto sugiere que podrías enfocarte en estrategias para incrementar las ventas durante el fin de semana y, quizás, aprovechar el buen rendimiento del martes para lanzar promociones especiales. 📈✨</td>
      <td>venta_promedio_por_dia, dia_mas_fuerte, dia_mas_flojo<br><span class="muted">Visual esperado: Barra<br>Visual real: Barra</span></td>
      <td><strong>Aprobado</strong><br>intent ok; texto ok; visual ok</td>
    </tr>

    <tr>
      <td><strong>E-11</strong></td>
      <td>Retención<br><span class="muted">Evitar inventar alertas cuando no hay clientes en riesgo.</span></td>
      <td>¿Qué clientes fieles dejaron de comprarme recientemente y están en riesgo de no volver?</td>
      <td>Riesgo de churn calculado contra los últimos 30 días desde 19/04/2026.</td>
      <td>Pro / complete<br><code>customer_churn</code><br><span class="muted">real: <code>customer_churn</code><br>conf.: 0.95</span></td>
      <td>0 clientes frecuentes en riesgo</td>
      <td>¡Felicidades, Tienda Don Pepe! Todos tus clientes habituales han realizado compras recientemente, lo que es una excelente señal de que están satisfechos con tus productos y servicios. Esto significa que has logrado mantener su interés y fidelidad. Sigue ofreciendo una experiencia excepcional para que continúen regresando. ¡Sigue así! 🎉</td>
      <td>clientes_en_riesgo, ultima_visita<br><span class="muted">Visual esperado: Sin gráfica<br>Visual real: Sin gráfica</span></td>
      <td><strong>Aprobado</strong><br>intent ok; texto ok; visual ok</td>
    </tr>

    <tr>
      <td><strong>E-12</strong></td>
      <td>Clientes frecuentes<br><span class="muted">Identificar clientes de mayor frecuencia para fidelización.</span></td>
      <td>¿Quiénes son los clientes que me compran con mayor frecuencia?</td>
      <td>Histórico completo de clientes: 2024-01-01 a 2026-04-19.</td>
      <td>Pro / complete<br><code>repeat_customers</code><br><span class="muted">real: <code>repeat_customers</code><br>conf.: 0.9</span></td>
      <td>Carlos Mendoza; 316 visitas; $13,093.86</td>
      <td>Tu negocio, Tienda Don Pepe, cuenta con 10 clientes frecuentes que visitan regularmente. Entre ellos, Carlos Mendoza se destaca como el cliente más activo, realizando un total de 316 visitas y acumulando compras por un valor de $13,093.86. Es importante mantener una buena relación con estos clientes, ya que su lealtad puede contribuir significativamente a tus ingresos. ¡Considera ofrecer promociones especiales para seguir incentivando sus visitas! 😊</td>
      <td>clientes_frecuentes, num_compras, total_por_cliente<br><span class="muted">Visual esperado: Tabla<br>Visual real: Tabla</span></td>
      <td><strong>Aprobado</strong><br>intent ok; texto ok; visual ok</td>
    </tr>

    <tr>
      <td><strong>E-13</strong></td>
      <td>Ticket promedio<br><span class="muted">Medir gasto promedio y oportunidades de venta cruzada.</span></td>
      <td>¿Cuál es mi ticket promedio?</td>
      <td>Histórico completo de transacciones completadas: 2024-01-01 a 2026-04-19.</td>
      <td>Pro / complete<br><code>average_ticket</code><br><span class="muted">real: <code>average_ticket</code><br>conf.: 0.95</span></td>
      <td>$41.76 sobre transacciones completadas</td>
      <td>Para Tienda Don Pepe, tu ticket promedio por venta es de $41.76. Este valor se ha calculado a partir de un total de 2,827 ventas. Esto significa que, en promedio, cada cliente gasta un poco más de 41 dólares en tu tienda. Puedes considerar estrategias para aumentar este monto, como ofrecer promociones o combos que motiven a los clientes a comprar más. 💡</td>
      <td>ticket_promedio, num_transacciones<br><span class="muted">Visual esperado: Sin gráfica<br>Visual real: Sin gráfica</span></td>
      <td><strong>Aprobado</strong><br>intent ok; texto ok; visual ok</td>
    </tr>

    <tr>
      <td><strong>E-14</strong></td>
      <td>Categorías top<br><span class="muted">Priorizar inventario, combos y categorías fuertes.</span></td>
      <td>¿Cuáles son los productos o categorías que más se venden en mi tienda?</td>
      <td>Histórico completo por categoría: 2024-01-01 a 2026-04-19.</td>
      <td>Pro / complete<br><code>top_products</code><br><span class="muted">real: <code>top_products</code><br>conf.: 0.95</span></td>
      <td>bebidas $15,630.04; snacks $15,536.31; aceites $15,286.26</td>
      <td>¡Hola! Para Tienda Don Pepe, la categoría que más destaca es &quot;bebidas&quot;, que ha generado ventas de $15,630.04. Justo detrás, se encuentran los &quot;snacks&quot; con $15,536.31 y los &quot;aceites&quot; con $15,286.26. Esto indica que tus clientes tienen una preferencia clara por las bebidas, así que podrías considerar promocionarlas aún más o ampliar la variedad. ¡Sigue así! 🍹📈</td>
      <td>ventas_por_categoria, categoria_top<br><span class="muted">Visual esperado: Pastel<br>Visual real: Pastel</span></td>
      <td><strong>Aprobado</strong><br>intent ok; texto ok; visual ok</td>
    </tr>

    <tr>
      <td><strong>E-15</strong></td>
      <td>Consejo proactivo<br><span class="muted">Convertir métricas en una recomendación accionable.</span></td>
      <td>Analiza mis datos y dame un consejo proactivo para mejorar mi negocio.</td>
      <td>Recomendación proactiva basada en tendencia reciente hasta 19/04/2026 y días fuertes/flojos.</td>
      <td>Pro / complete<br><code>proactive_alert</code><br><span class="muted">real: <code>proactive_alert</code><br>conf.: 0.95</span></td>
      <td>Usa tendencia reciente (20.4%) y días fuerte/flojo (martes/domingo)</td>
      <td>📈 ¡Ventas en subida!<br>Tus ventas subieron un 20.4% recientemente. ¡Buen trabajo! Aprovecha el impulso para fidelizar a tus nuevos clientes.<br><br>📅 Dato útil sobre tus ventas<br>Tu día más fuerte es martes y el más flojo es domingo. Podrías hacer promociones los domingo para equilibrar tus ventas.</td>
      <td>alerta proactiva / sin métrica directa<br><span class="muted">Visual esperado: Sin gráfica<br>Visual real: Sin gráfica</span></td>
      <td><strong>Aprobado</strong><br>intent ok; texto ok; visual ok</td>
    </tr>
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
  <tbody>
    <tr>
      <td><strong>EA-01</strong></td>
      <td>Error ortográfico<br><span class="muted">Validar escritura con errores comunes.</span></td>
      <td>caunto bendi aller</td>
      <td>&quot;aller&quot; se interpreta como &quot;ayer&quot; = 18/04/2026. Valida tolerancia ortográfica.</td>
      <td>Pro / complete<br><code>sales_specific_date</code><br><span class="muted">real: <code>sales_specific_date</code><br>conf.: 0.9</span></td>
      <td>Debe entender &quot;aller&quot; como ayer: 18/04/2026; $70.91; 2 transacciones</td>
      <td>El sábado 18 de abril, en Tienda Don Pepe, tuviste ventas por un total de $70.91, realizando 2 transacciones en el día. Esto significa que cada transacción generó un promedio de $35.46. ¡Sigue así y busca maneras de atraer más clientes para aumentar tus ventas! 📈</td>
      <td>total_ventas_dia, num_transacciones_dia<br><span class="muted">Visual esperado: Barra<br>Visual real: Barra</span></td>
      <td><strong>Aprobado</strong><br>intent ok; texto ok; visual ok</td>
    </tr>

    <tr>
      <td><strong>EA-02</strong></td>
      <td>Ayuda<br><span class="muted">Guiar a usuarios que no saben qué preguntar.</span></td>
      <td>¿Qué puedo preguntarte?</td>
      <td>No aplica fecha. Valida menú de ayuda.</td>
      <td>Pro / complete<br><code>help</code><br><span class="muted">real: <code>help</code><br>conf.: 0.95</span></td>
      <td>Debe listar capacidades del asistente.</td>
      <td>Puedo responder preguntas como:<br><br>• ¿Cómo voy comparado con el mes pasado?<br>• ¿Qué clientes están en riesgo de no volver?<br>• ¿Cuál es la tendencia de mis ventas?<br>• ¿Quiénes son mis mejores clientes?<br>• Dame un consejo sobre mi negocio<br>• ¿Cuánto vendí en todo el 2025?<br>• ¿Cuál fue mi mejor día de ventas?<br>• ¿Cuál es mi ticket promedio?<br>• ¿Qué es lo que más vendo?<br>• ¿Cuáles son mis días más fuertes?<br>• ¿Cómo pagan mis clientes?<br><br>¡Pregúntame lo que quieras! 😊</td>
      <td>alerta proactiva / sin métrica directa<br><span class="muted">Visual esperado: Sin gráfica<br>Visual real: Sin gráfica</span></td>
      <td><strong>Aprobado</strong><br>intent ok; texto ok; visual ok</td>
    </tr>

    <tr>
      <td><strong>EA-03</strong></td>
      <td>Saludo<br><span class="muted">Confirmar experiencia conversacional básica.</span></td>
      <td>Hola</td>
      <td>No aplica fecha. Valida saludo con contexto del comercio.</td>
      <td>Pro / complete<br><code>greeting</code><br><span class="muted">real: <code>greeting</code><br>conf.: 0.95</span></td>
      <td>Debe saludar y mencionar Tienda Don Pepe.</td>
      <td>¡Hola! 👋 Soy tu contador de bolsillo para Tienda Don Pepe. Puedo ayudarte con información sobre tus ventas, clientes y tendencias. ¿Qué quieres saber?</td>
      <td>alerta proactiva / sin métrica directa<br><span class="muted">Visual esperado: Sin gráfica<br>Visual real: Sin gráfica</span></td>
      <td><strong>Aprobado</strong><br>intent ok; texto ok; visual ok</td>
    </tr>

    <tr>
      <td><strong>EA-04</strong></td>
      <td>Cálculo práctico<br><span class="muted">Resolver una operación cotidiana de caja.</span></td>
      <td>Si un cliente me lleva 3 atunes de $1.50 y 2 colas de $2.00, ¿cuánto debo cobrarle en total?</td>
      <td>No aplica dataset. Valida cálculo práctico de caja.</td>
      <td>Pro / complete<br><code>unknown</code><br><span class="muted">real: <code>unknown</code><br>conf.: 0.1</span></td>
      <td>Debe resolver $8.50 sin consultar el dataset.</td>
      <td>Para calcular el total, multiplica el precio de los atunes y colas por la cantidad: <br><br>3 atunes a $1.50 son $4.50 y 2 colas a $2.00 son $4.00. <br><br>Sumando ambos, el total es $4.50 + $4.00 = $8.50. ¡Debes cobrarle $8.50!</td>
      <td>alerta proactiva / sin métrica directa<br><span class="muted">Visual esperado: Sin gráfica<br>Visual real: Sin gráfica</span></td>
      <td><strong>Aprobado</strong><br>intent ok; texto ok; visual ok</td>
    </tr>

    <tr>
      <td><strong>EA-05</strong></td>
      <td>Fuera de dominio<br><span class="muted">Rechazar temas fuera del negocio sin perder cordialidad.</span></td>
      <td>¿Quién ganó el mundial de fútbol de la FIFA?</td>
      <td>No aplica fecha. Valida límite de dominio.</td>
      <td>Pro / complete<br><code>unknown</code><br><span class="muted">real: <code>unknown</code><br>conf.: 0.1</span></td>
      <td>Debe rechazar cordialmente por estar fuera del negocio.</td>
      <td>¡Hola! Lamentablemente, no puedo ayudarte con eso. Mi rol es asistirte con datos de ventas y la salud de &quot;Tienda Don Pepe&quot;. ¿Hay algo relacionado con tu negocio en lo que pueda ayudarte?</td>
      <td>alerta proactiva / sin métrica directa<br><span class="muted">Visual esperado: Sin gráfica<br>Visual real: Sin gráfica</span></td>
      <td><strong>Aprobado</strong><br>intent ok; texto ok; visual ok</td>
    </tr>

    <tr>
      <td><strong>EA-06</strong></td>
      <td>Modo Simple<br><span class="muted">Comparar brevedad del modo Simple frente al modo Pro.</span></td>
      <td>¿Cuánto vendí esta semana?</td>
      <td>&quot;esta semana&quot; = 2026-04-13 a 2026-04-19. Misma pregunta que E-03, pero en modo Simple.</td>
      <td>Simple<br><code>sales_this_week</code><br><span class="muted">real: <code>sales_this_week</code><br>conf.: 0.95</span></td>
      <td>Debe responder breve: $1,332.61 y 30 transacciones.</td>
      <td>Esta semana, en Tienda Don Pepe, realizaste ventas por un total de $1332.61 en 30 transacciones. ¡Buen trabajo! 🛍️</td>
      <td>total_ventas, num_transacciones<br><span class="muted">Visual esperado: Barra<br>Visual real: Barra</span></td>
      <td><strong>Aprobado</strong><br>intent ok; texto ok; visual ok</td>
    </tr>

    <tr>
      <td><strong>EA-07</strong></td>
      <td>Método de pago<br><span class="muted">Validar intent de medios de pago aunque el dataset solo tenga Deuna.</span></td>
      <td>¿Cómo pagan mis clientes?</td>
      <td>Histórico completo de métodos de pago: 2024-01-01 a 2026-04-19.</td>
      <td>Pro / complete<br><code>payment_methods</code><br><span class="muted">real: <code>payment_methods</code><br>conf.: 0.95</span></td>
      <td>Dataset m001 contiene deuna: $118,048.67; 2827 transacciones.</td>
      <td>En Tienda Don Pepe, el método de pago más popular entre tus clientes es &quot;deuna&quot;, que ha generado un total de $118,048.67 a través de 2,827 ventas. Esto indica que tus clientes prefieren utilizar este método, por lo que podrías considerar promocionarlo aún más o asegurarte de que sea una opción destacada en tu tienda. 🎉💳</td>
      <td>metodos_de_pago, total_por_metodo<br><span class="muted">Visual esperado: Pastel<br>Visual real: Pastel</span></td>
      <td><strong>Aprobado</strong><br>intent ok; texto ok; visual ok</td>
    </tr>
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
  <tr><td>Preguntas principales de negocio</td><td>15</td></tr>
  <tr><td>Correctas en matriz principal</td><td>15 / 15</td></tr>
  <tr><td>Acierto principal</td><td><strong>100%</strong></td></tr>
  <tr><td>Casos de anexos</td><td>7</td></tr>
  <tr><td>Correctos en anexos</td><td>7 / 7</td></tr>
  <tr><td>Acierto en anexos</td><td><strong>100%</strong></td></tr>
  <tr><td>Requisito mínimo del reto</td><td>Al menos 80% de acierto</td></tr>
  <tr><td>Resultado final</td><td><strong>Cumple y supera el requisito</strong></td></tr>
</table>

## 10. Evidencia para capturas

La columna <strong>Evidencia</strong> contiene el código que debe usarse al pegar capturas manuales: <code>E-01</code> a <code>E-15</code> para las preguntas principales y <code>EA-01</code> a <code>EA-07</code> para anexos. Cada captura debe mostrar input, respuesta real y visualización cuando exista.

## 11. Conclusión

El set demuestra que Mi Contador de Bolsillo responde preguntas relevantes para microcomercios y transforma datos transaccionales en información útil. Además, corrige el punto crítico de fechas: "hoy" no es una constante ni la última fecha del dataset; es la fecha real de Ecuador al momento de la consulta.
