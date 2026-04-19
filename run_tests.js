const http = require('http');
const fs = require('fs');

const API_HOST = process.env.TEST_API_HOST || 'localhost';
const API_PORT = Number(process.env.TEST_API_PORT || 3000);
const MERCHANT_ID = 'm001';

function getCurrentEcuadorDate() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Guayaquil',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    hourCycle: 'h23'
  }).formatToParts(new Date());

  const value = (type) => parts.find((part) => part.type === type)?.value || '00';
  return new Date(
    Number(value('year')),
    Number(value('month')) - 1,
    Number(value('day')),
    Number(value('hour')),
    Number(value('minute')),
    Number(value('second'))
  );
}

function toDate(d) {
  return new Date(d);
}

function toLocalDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDateForLabel(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function money(n) {
  return `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function sum(txns) {
  return +(txns.reduce((total, txn) => total + txn.amount, 0).toFixed(2));
}

function getDayRange(dateStr) {
  const start = new Date(`${dateStr}T00:00:00`);
  const end = new Date(`${dateStr}T23:59:59.999`);
  return { start, end };
}

function getWeekRange(ref) {
  const d = new Date(ref);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(d.setDate(diff));
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function getMonthRange(ref) {
  return {
    start: new Date(ref.getFullYear(), ref.getMonth(), 1),
    end: new Date(ref.getFullYear(), ref.getMonth() + 1, 0, 23, 59, 59, 999)
  };
}

function filterByRange(txns, start, end) {
  return txns.filter((txn) => {
    const d = toDate(txn.date);
    return d >= start && d <= end;
  });
}

function readDatasetContext() {
  const ds = JSON.parse(fs.readFileSync('server/src/data/transactions.json', 'utf8'));
  const merchantData = ds.merchants.find((merchant) => merchant.merchant.merchantId === MERCHANT_ID);
  if (!merchantData) throw new Error(`No se encontró el comercio ${MERCHANT_ID}`);

  const completed = merchantData.transactions.filter((txn) => txn.status === 'completed');
  const dates = completed.map((txn) => toDate(txn.date).getTime());
  const categories = [...new Set(completed.map((txn) => txn.category))];
  const customers = new Set(completed.map((txn) => txn.customerId));

  return {
    merchant: merchantData.merchant,
    completed,
    datasetContext: {
      merchantId: merchantData.merchant.merchantId,
      merchantName: merchantData.merchant.merchantName,
      category: merchantData.merchant.category,
      city: merchantData.merchant.city,
      period: `${toLocalDateStr(new Date(Math.min(...dates)))} a ${toLocalDateStr(new Date(Math.max(...dates)))}`,
      completedTransactions: completed.length,
      historicalSales: money(sum(completed)),
      evaluationDate: toLocalDateStr(getCurrentEcuadorDate()),
      note: 'Las fechas relativas se calculan dinámicamente con la fecha actual de Ecuador.'
    },
    categories,
    customers
  };
}

function buildMetrics(completed) {
  const ref = getCurrentEcuadorDate();
  const todayStr = toLocalDateStr(ref);
  const yesterday = new Date(ref);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = toLocalDateStr(yesterday);

  const daySummary = (dateStr) => {
    const { start, end } = getDayRange(dateStr);
    const txns = filterByRange(completed, start, end);
    return { date: dateStr, count: txns.length, total: sum(txns) };
  };

  const weekRange = getWeekRange(ref);
  const weekTxns = filterByRange(completed, weekRange.start, weekRange.end);

  const thisMonthRange = getMonthRange(ref);
  const thisMonthTxns = filterByRange(completed, thisMonthRange.start, thisMonthRange.end);

  const prevRef = new Date(ref.getFullYear(), ref.getMonth() - 1, 15);
  const lastMonthRange = getMonthRange(prevRef);
  const lastMonthTxns = filterByRange(completed, lastMonthRange.start, lastMonthRange.end);
  const thisMonthTotal = sum(thisMonthTxns);
  const lastMonthTotal = sum(lastMonthTxns);
  const comparisonDiff = +(thisMonthTotal - lastMonthTotal).toFixed(2);
  const comparisonPct = lastMonthTotal > 0 ? +((comparisonDiff / lastMonthTotal) * 100).toFixed(1) : 0;

  const tx2025 = completed.filter((txn) => toDate(txn.date).getFullYear() === 2025);

  const dailyMap = new Map();
  for (const txn of completed) {
    const key = toLocalDateStr(toDate(txn.date));
    dailyMap.set(key, (dailyMap.get(key) || 0) + txn.amount);
  }
  const [bestDayDate, bestDayAmount] = [...dailyMap.entries()].sort((a, b) => b[1] - a[1])[0];

  const dowNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const dowMap = new Map();
  for (const txn of completed) {
    const dow = toDate(txn.date).getDay();
    const current = dowMap.get(dow) || { total: 0, count: 0 };
    current.total += txn.amount;
    current.count++;
    dowMap.set(dow, current);
  }
  const dowRows = [];
  for (let i = 1; i <= 6; i++) {
    const current = dowMap.get(i) || { total: 0, count: 0 };
    dowRows.push({ day: dowNames[i], avg: current.count ? +(current.total / current.count).toFixed(2) : 0 });
  }
  const sunday = dowMap.get(0) || { total: 0, count: 0 };
  dowRows.push({ day: dowNames[0], avg: sunday.count ? +(sunday.total / sunday.count).toFixed(2) : 0 });
  const bestDow = [...dowRows].sort((a, b) => b.avg - a.avg)[0];
  const worstDow = [...dowRows].filter((row) => row.avg > 0).sort((a, b) => a.avg - b.avg)[0] || dowRows[0];

  const trendStart = new Date(ref);
  trendStart.setDate(trendStart.getDate() - 13);
  trendStart.setHours(0, 0, 0, 0);
  const trendTxns = filterByRange(completed, trendStart, ref);
  const trendDailyMap = new Map();
  for (const txn of trendTxns) {
    const key = toLocalDateStr(toDate(txn.date));
    trendDailyMap.set(key, (trendDailyMap.get(key) || 0) + txn.amount);
  }
  const trendValues = [];
  for (let d = new Date(trendStart); d <= ref; d.setDate(d.getDate() + 1)) {
    trendValues.push(+(trendDailyMap.get(toLocalDateStr(d)) || 0).toFixed(2));
  }
  const mid = Math.floor(trendValues.length / 2);
  const avgFirst = trendValues.slice(0, mid).reduce((a, b) => a + b, 0) / mid;
  const avgSecond = trendValues.slice(mid).reduce((a, b) => a + b, 0) / (trendValues.length - mid);
  const trendPct = avgFirst > 0 ? +(((avgSecond - avgFirst) / avgFirst) * 100).toFixed(1) : 0;

  const customerStats = new Map();
  const customerLastVisit = new Map();
  for (const txn of completed) {
    const current = customerStats.get(txn.customerId) || { name: txn.customerName, count: 0, total: 0 };
    current.count++;
    current.total += txn.amount;
    customerStats.set(txn.customerId, current);

    const last = customerLastVisit.get(txn.customerId);
    if (!last || toDate(txn.date) > last.lastDate) {
      customerLastVisit.set(txn.customerId, { name: txn.customerName, lastDate: toDate(txn.date), count: current.count });
    }
  }
  const repeaters = [...customerStats.values()]
    .filter((customer) => customer.count >= 2)
    .sort((a, b) => b.count - a.count);
  const topCustomer = repeaters[0];

  const thirtyDaysAgo = new Date(ref);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const atRisk = [];
  for (const [customerId, visit] of customerLastVisit.entries()) {
    const stats = customerStats.get(customerId);
    if (visit.lastDate < thirtyDaysAgo && stats.count >= 2) {
      atRisk.push({ name: visit.name, count: stats.count });
    }
  }

  const categoryMap = new Map();
  for (const txn of completed) {
    categoryMap.set(txn.category, (categoryMap.get(txn.category) || 0) + txn.amount);
  }
  const topCategories = [...categoryMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category, total]) => ({ category, total: +total.toFixed(2) }));

  const paymentMap = new Map();
  for (const txn of completed) {
    const current = paymentMap.get(txn.paymentMethod) || { count: 0, total: 0 };
    current.count++;
    current.total += txn.amount;
    paymentMap.set(txn.paymentMethod, current);
  }
  const topPayment = [...paymentMap.entries()].sort((a, b) => b[1].total - a[1].total)[0];

  return {
    today: daySummary(todayStr),
    yesterday: daySummary(yesterdayStr),
    week: {
      start: toLocalDateStr(weekRange.start),
      end: toLocalDateStr(weekRange.end),
      count: weekTxns.length,
      total: sum(weekTxns)
    },
    thisMonth: {
      monthLabel: ref.toLocaleDateString('es-EC', { month: 'long', year: 'numeric' }),
      count: thisMonthTxns.length,
      total: thisMonthTotal
    },
    comparison: {
      current: thisMonthTotal,
      previous: lastMonthTotal,
      diff: comparisonDiff,
      pct: comparisonPct
    },
    year2025: { count: tx2025.length, total: sum(tx2025) },
    trend: {
      avgFirst: +avgFirst.toFixed(2),
      avgSecond: +avgSecond.toFixed(2),
      pct: trendPct
    },
    bestDay: { date: bestDayDate, total: +bestDayAmount.toFixed(2) },
    dow: { best: bestDow, worst: worstDow },
    churn: { atRisk },
    topCustomer,
    averageTicket: +(sum(completed) / completed.length).toFixed(2),
    topCategories,
    topPayment: {
      method: topPayment[0],
      total: +topPayment[1].total.toFixed(2),
      count: topPayment[1].count
    }
  };
}

function expectedDayContains(summary) {
  return summary.count > 0
    ? [money(summary.total), `${summary.count} transacciones`]
    : ['no has tenido ventas'];
}

function buildTests(metrics) {
  const trendPctText = `${Math.abs(metrics.trend.pct)}%`;
  const topCategoriesExpected = metrics.topCategories.flatMap((item) => [item.category, money(item.total)]);
  const churnExpected = metrics.churn.atRisk.length > 0
    ? [`${metrics.churn.atRisk.length}`, metrics.churn.atRisk[0].name]
    : ['recientemente'];

  const mainTests = [
    {
      id: 1,
      category: 'Ventas diarias',
      question: '¿Cuánto he vendido el día de hoy?',
      mode: 'complete',
      expectedIntent: 'sales_today',
      expectedMetrics: `${formatDateForLabel(metrics.today.date)}; ${money(metrics.today.total)}; ${metrics.today.count} transacciones`,
      expectedContains: expectedDayContains(metrics.today),
      expectedVisualization: metrics.today.count > 0 ? 'bar' : null,
      businessValue: 'Permite revisar el pulso del día sin entrar a un dashboard.'
    },
    {
      id: 2,
      category: 'Ventas por fecha',
      question: '¿Cuánto vendí ayer?',
      mode: 'complete',
      expectedIntent: 'sales_specific_date',
      expectedMetrics: `${formatDateForLabel(metrics.yesterday.date)}; ${money(metrics.yesterday.total)}; ${metrics.yesterday.count} transacciones`,
      expectedContains: expectedDayContains(metrics.yesterday),
      expectedVisualization: metrics.yesterday.count > 0 ? 'bar' : null,
      businessValue: 'Ayuda a comparar rápidamente el día anterior con el día actual.'
    },
    {
      id: 3,
      category: 'Ventas semanales',
      question: '¿Cuánto vendí esta semana?',
      mode: 'complete',
      expectedIntent: 'sales_this_week',
      expectedMetrics: `Semana ${formatDateForLabel(metrics.week.start)}-${formatDateForLabel(metrics.week.end)}; ${money(metrics.week.total)}; ${metrics.week.count} transacciones`,
      expectedContains: [money(metrics.week.total), `${metrics.week.count} transacciones`],
      expectedVisualization: 'bar',
      businessValue: 'Resume el desempeño semanal y muestra qué días aportaron más.'
    },
    {
      id: 4,
      category: 'Ventas mensuales',
      question: '¿Cuál es el total de mis ventas de este mes?',
      mode: 'complete',
      expectedIntent: 'sales_this_month',
      expectedMetrics: `${metrics.thisMonth.monthLabel}; ${money(metrics.thisMonth.total)}; ${metrics.thisMonth.count} transacciones`,
      expectedContains: [money(metrics.thisMonth.total), `${metrics.thisMonth.count} transacciones`],
      expectedVisualization: 'bar',
      businessValue: 'Sirve para controlar avance mensual y flujo de ingresos.'
    },
    {
      id: 5,
      category: 'Ventas anuales',
      question: '¿Cuánto generé en todo el año 2025?',
      mode: 'complete',
      expectedIntent: 'sales_specific_year',
      expectedMetrics: `Año 2025; ${money(metrics.year2025.total)}; ${metrics.year2025.count} transacciones`,
      expectedContains: [money(metrics.year2025.total), `${metrics.year2025.count} transacciones`],
      expectedVisualization: 'line',
      businessValue: 'Da una lectura histórica anual sin exigir conocimientos contables.'
    },
    {
      id: 6,
      category: 'Comparación',
      question: '¿Cómo voy en ventas comparado con el mes pasado?',
      mode: 'complete',
      expectedIntent: 'sales_comparison',
      expectedMetrics: `Mes actual ${money(metrics.comparison.current)} vs mes anterior ${money(metrics.comparison.previous)}; variación ${metrics.comparison.pct}%`,
      expectedContains: [money(metrics.comparison.current), money(metrics.comparison.previous), `${Math.abs(metrics.comparison.pct)}%`],
      expectedVisualization: 'bar',
      businessValue: 'Convierte ventas aisladas en diagnóstico de crecimiento o caída.'
    },
    {
      id: 7,
      category: 'Tendencia',
      question: '¿Cuál es la tendencia de mis ventas en estas últimas semanas?',
      mode: 'complete',
      expectedIntent: 'sales_trend',
      expectedMetrics: `Promedio diario pasa de ${money(metrics.trend.avgFirst)} a ${money(metrics.trend.avgSecond)}; ${metrics.trend.pct}%`,
      expectedContains: [money(metrics.trend.avgFirst), money(metrics.trend.avgSecond), trendPctText],
      expectedVisualization: 'line',
      businessValue: 'Indica si el negocio mejora o pierde tracción antes de fin de mes.'
    },
    {
      id: 8,
      category: 'Alerta de cambio',
      question: '¿Ha habido alguna caída o subida inusual en mis ventas recientes?',
      mode: 'complete',
      expectedIntent: 'significant_change',
      expectedMetrics: `Cambio reciente de ${metrics.trend.pct}%`,
      expectedContains: [trendPctText],
      expectedVisualization: 'line',
      businessValue: 'Detecta cambios relevantes y evita que el comerciante dependa solo de intuición.'
    },
    {
      id: 9,
      category: 'Mejor día',
      question: '¿Cuál ha sido el mejor día de ventas en toda la historia de mi negocio?',
      mode: 'complete',
      expectedIntent: 'best_day',
      expectedMetrics: `${formatDateForLabel(metrics.bestDay.date)}; ${money(metrics.bestDay.total)}`,
      expectedContains: [money(metrics.bestDay.total)],
      expectedVisualization: null,
      businessValue: 'Identifica un pico real para replicar promociones, horarios o inventario.'
    },
    {
      id: 10,
      category: 'Días fuertes/flojos',
      question: '¿Cuáles son mis días de la semana con más ventas?',
      mode: 'complete',
      expectedIntent: 'strong_weak_days',
      expectedMetrics: `Mejor día ${metrics.dow.best.day} ${money(metrics.dow.best.avg)}; día más flojo ${metrics.dow.worst.day} ${money(metrics.dow.worst.avg)}`,
      expectedContains: [metrics.dow.best.day, money(metrics.dow.best.avg), metrics.dow.worst.day, money(metrics.dow.worst.avg)],
      expectedVisualization: 'bar',
      businessValue: 'Ayuda a decidir cuándo lanzar promociones y reforzar inventario.'
    },
    {
      id: 11,
      category: 'Retención',
      question: '¿Qué clientes fieles dejaron de comprarme recientemente y están en riesgo de no volver?',
      mode: 'complete',
      expectedIntent: 'customer_churn',
      expectedMetrics: `${metrics.churn.atRisk.length} clientes frecuentes en riesgo`,
      expectedContains: churnExpected,
      expectedVisualization: metrics.churn.atRisk.length > 0 ? 'table' : null,
      businessValue: 'Valida que el sistema también maneja bien escenarios sin alerta.'
    },
    {
      id: 12,
      category: 'Clientes frecuentes',
      question: '¿Quiénes son los clientes que me compran con mayor frecuencia?',
      mode: 'complete',
      expectedIntent: 'repeat_customers',
      expectedMetrics: `${metrics.topCustomer.name}; ${metrics.topCustomer.count} visitas; ${money(metrics.topCustomer.total)}`,
      expectedContains: [metrics.topCustomer.name, `${metrics.topCustomer.count}`, money(metrics.topCustomer.total)],
      expectedVisualization: 'table',
      businessValue: 'Permite fidelizar a clientes valiosos con promociones o atención personalizada.'
    },
    {
      id: 13,
      category: 'Ticket promedio',
      question: '¿Cuál es mi ticket promedio?',
      mode: 'complete',
      expectedIntent: 'average_ticket',
      expectedMetrics: `${money(metrics.averageTicket)} sobre transacciones completadas`,
      expectedContains: [money(metrics.averageTicket)],
      expectedVisualization: null,
      businessValue: 'Muestra cuánto gasta un cliente promedio y habilita estrategias de venta cruzada.'
    },
    {
      id: 14,
      category: 'Categorías top',
      question: '¿Cuáles son los productos o categorías que más se venden en mi tienda?',
      mode: 'complete',
      expectedIntent: 'top_products',
      expectedMetrics: metrics.topCategories.map((item) => `${item.category} ${money(item.total)}`).join('; '),
      expectedContains: topCategoriesExpected,
      expectedVisualization: 'pie',
      businessValue: 'Guía decisiones de inventario, combos y productos a promocionar.'
    },
    {
      id: 15,
      category: 'Consejo proactivo',
      question: 'Analiza mis datos y dame un consejo proactivo para mejorar mi negocio.',
      mode: 'complete',
      expectedIntent: 'proactive_alert',
      expectedMetrics: `Usa tendencia reciente (${metrics.trend.pct}%) y días fuerte/flojo (${metrics.dow.best.day}/${metrics.dow.worst.day})`,
      expectedContains: [trendPctText, metrics.dow.best.day, metrics.dow.worst.day],
      expectedVisualization: null,
      businessValue: 'Transforma métricas en una recomendación comprensible y accionable.'
    }
  ];

  const appendixTests = [
    {
      id: 'A1',
      category: 'Error ortográfico',
      question: 'caunto bendi aller',
      mode: 'complete',
      expectedIntent: 'sales_specific_date',
      expectedMetrics: `Debe entender "aller" como ayer: ${formatDateForLabel(metrics.yesterday.date)}; ${money(metrics.yesterday.total)}; ${metrics.yesterday.count} transacciones`,
      expectedContains: expectedDayContains(metrics.yesterday),
      expectedVisualization: metrics.yesterday.count > 0 ? 'bar' : null,
      businessValue: 'Reduce barreras para comerciantes que escriben rápido o con errores.'
    },
    {
      id: 'A2',
      category: 'Ayuda',
      question: '¿Qué puedo preguntarte?',
      mode: 'complete',
      expectedIntent: 'help',
      expectedMetrics: 'Debe listar capacidades del asistente.',
      expectedContains: ['ventas', 'clientes'],
      expectedVisualization: null,
      businessValue: 'Facilita adopción para usuarios que no saben qué preguntar.'
    },
    {
      id: 'A3',
      category: 'Saludo',
      question: 'Hola',
      mode: 'complete',
      expectedIntent: 'greeting',
      expectedMetrics: 'Debe saludar y mencionar Tienda Don Pepe.',
      expectedContains: ['Tienda Don Pepe'],
      expectedVisualization: null,
      businessValue: 'Mantiene una entrada conversacional simple y cercana.'
    },
    {
      id: 'A4',
      category: 'Cálculo práctico',
      question: 'Si un cliente me lleva 3 atunes de $1.50 y 2 colas de $2.00, ¿cuánto debo cobrarle en total?',
      mode: 'complete',
      expectedIntent: 'unknown',
      expectedMetrics: 'Debe resolver $8.50 sin consultar el dataset.',
      expectedContains: ['$8.50'],
      expectedVisualization: null,
      businessValue: 'Resuelve barreras operativas cotidianas en caja.'
    },
    {
      id: 'A5',
      category: 'Fuera de dominio',
      question: '¿Quién ganó el mundial de fútbol de la FIFA?',
      mode: 'complete',
      expectedIntent: 'unknown',
      expectedMetrics: 'Debe rechazar cordialmente por estar fuera del negocio.',
      expectedContains: ['ventas', 'negocio'],
      expectedVisualization: null,
      businessValue: 'Evita desviarse de su rol y protege foco de producto.'
    },
    {
      id: 'A6',
      category: 'Modo Simple',
      question: '¿Cuánto vendí esta semana?',
      mode: 'simple',
      expectedIntent: 'sales_this_week',
      expectedMetrics: `Debe responder breve: ${money(metrics.week.total)} y ${metrics.week.count} transacciones.`,
      expectedContains: [money(metrics.week.total), `${metrics.week.count} transacciones`],
      expectedVisualization: 'bar',
      businessValue: 'Demuestra respuesta rápida y de baja carga cognitiva.'
    },
    {
      id: 'A7',
      category: 'Método de pago',
      question: '¿Cómo pagan mis clientes?',
      mode: 'complete',
      expectedIntent: 'payment_methods',
      expectedMetrics: `Dataset m001 contiene ${metrics.topPayment.method}: ${money(metrics.topPayment.total)}; ${metrics.topPayment.count} transacciones.`,
      expectedContains: [metrics.topPayment.method, money(metrics.topPayment.total), `${metrics.topPayment.count}`],
      expectedVisualization: 'pie',
      businessValue: 'Valida el intent, aunque se deja como anexo porque no hay variedad de medios de pago.'
    }
  ];

  return { mainTests, appendixTests };
}

function makeSingleRequest(test) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      message: test.question,
      mode: test.mode,
      merchantId: MERCHANT_ID
    });

    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path: '/api/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          resolve({ error: 'Parsing JSON failed', raw: data });
        }
      });
    });

    req.on('error', (error) => resolve({ error: error.message }));
    req.write(payload);
    req.end();
  });
}

async function makeRequest(test, attempts = 3) {
  let lastResponse = null;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    lastResponse = await makeSingleRequest(test);
    if (!lastResponse.error) return lastResponse;
    await new Promise((resolve) => setTimeout(resolve, 750 * attempt));
  }
  return lastResponse;
}

function includesAll(answer, expectedContains) {
  const normalize = (value) => (value || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/,/g, '');
  const normalized = normalize(answer);
  return expectedContains.every((fragment) => normalized.includes(normalize(fragment)));
}

function normalizeResult(test, response) {
  const realAnswer = response.answer || '';
  const visualizationType = response.visualization?.type ?? null;
  const intentOk = response.detectedIntent === test.expectedIntent;
  const textOk = includesAll(realAnswer, test.expectedContains);
  const vizOk = visualizationType === test.expectedVisualization;

  return {
    id: test.id,
    category: test.category,
    question: test.question,
    mode: test.mode,
    expectedIntent: test.expectedIntent,
    realIntent: response.detectedIntent ?? 'error',
    confidence: response.confidence ?? null,
    expectedMetrics: test.expectedMetrics,
    realAnswer,
    metricsUsed: response.metricsUsed ?? [],
    visualizationType,
    expectedVisualization: test.expectedVisualization,
    businessValue: test.businessValue,
    success: Boolean(!response.error && intentOk && textOk && vizOk),
    checks: {
      intentOk,
      textOk,
      visualizationOk: vizOk
    },
    error: response.error ?? null
  };
}

async function runGroup(name, tests) {
  const results = [];
  console.log(`\n${name}`);

  for (const test of tests) {
    process.stdout.write(`[${test.id}] ${test.question} ... `);
    const response = await makeRequest(test);
    const result = normalizeResult(test, response);
    results.push(result);
    console.log(result.success ? 'PASS' : 'FAIL');
  }

  return results;
}

async function runTests() {
  console.log(`Ejecutando pruebas contra http://${API_HOST}:${API_PORT}/api/chat`);

  const { completed, datasetContext } = readDatasetContext();
  const metrics = buildMetrics(completed);
  const { mainTests, appendixTests } = buildTests(metrics);

  const mainResults = await runGroup('15 preguntas principales de negocio', mainTests);
  const appendixResults = await runGroup('Anexos de barreras y modos', appendixTests);

  const mainCorrect = mainResults.filter((r) => r.success).length;
  const appendixCorrect = appendixResults.filter((r) => r.success).length;

  const output = {
    generatedAt: new Date().toISOString(),
    datasetContext,
    dynamicReference: {
      today: metrics.today.date,
      yesterday: metrics.yesterday.date,
      week: `${metrics.week.start} a ${metrics.week.end}`,
      currentMonth: metrics.thisMonth.monthLabel
    },
    summary: {
      mainTotal: mainResults.length,
      mainCorrect,
      mainAccuracy: Number(((mainCorrect / mainResults.length) * 100).toFixed(1)),
      appendixTotal: appendixResults.length,
      appendixCorrect,
      appendixAccuracy: Number(((appendixCorrect / appendixResults.length) * 100).toFixed(1))
    },
    mainResults,
    appendixResults
  };

  fs.writeFileSync('test_results.json', JSON.stringify(output, null, 2), 'utf8');
  console.log('\nResultados guardados en test_results.json');
  console.log(`Fecha de referencia Ecuador: ${metrics.today.date}`);
  console.log(`Principal: ${mainCorrect}/${mainResults.length} (${output.summary.mainAccuracy}%)`);
  console.log(`Anexos: ${appendixCorrect}/${appendixResults.length} (${output.summary.appendixAccuracy}%)`);

  if (mainCorrect !== mainResults.length || appendixCorrect !== appendixResults.length) {
    process.exitCode = 1;
  }
}

runTests();
