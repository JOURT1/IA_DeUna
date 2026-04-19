// ============================================
// Analytics Engine — Motor analítico determinístico
// ============================================
// Todas las métricas se calculan directamente del JSON.
// Nunca inventa datos: si un campo no existe, lo dice.

import { getCompletedTransactions, getMerchantData } from '../data/data-loader.js';
import { getCurrentEcuadorDate, toLocalDateStr } from '../utils/date-utils.js';
import type { Transaction, AnalyticsResult, Visualization } from '../types/index.js';

// ─── Utilidades de fecha ───────────────────────────────
function toDate(d: string): Date { return new Date(d); }
function fmt(n: number): string { return `$${n.toFixed(2)}`; }
function fmtDate(d: Date): string {
    return d.toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long' });
}
function dayName(dow: number): string {
    return ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][dow];
}
function getWeekRange(ref: Date): { start: Date; end: Date } {
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

function getMonthRange(ref: Date): { start: Date; end: Date } {
    const start = new Date(ref.getFullYear(), ref.getMonth(), 1);
    const end = new Date(ref.getFullYear(), ref.getMonth() + 1, 0, 23, 59, 59, 999);
    return { start, end };
}

function filterByRange(txns: Transaction[], start: Date, end: Date): Transaction[] {
    return txns.filter(t => {
        const d = toDate(t.date);
        return d >= start && d <= end;
    });
}

function sumAmounts(txns: Transaction[]): number {
    return txns.reduce((s, t) => s + t.amount, 0);
}

// ─── Referencia de fecha ───────────────────────────────
function getRefDate(_merchantId?: string): Date {
    return getCurrentEcuadorDate();
}

// ─── Funciones analíticas ──────────────────────────────

export function getSalesForPeriod(period: 'week' | 'month', merchantId?: string): AnalyticsResult {
    const txns = getCompletedTransactions(merchantId);
    const ref = getRefDate(merchantId);
    const range = period === 'week' ? getWeekRange(ref) : getMonthRange(ref);
    const filtered = filterByRange(txns, range.start, range.end);
    const total = sumAmounts(filtered);

    // Datos para gráfico: ventas por día
    const dailyMap = new Map<string, number>();
    filtered.forEach(t => {
        const key = toLocalDateStr(toDate(t.date));
        dailyMap.set(key, (dailyMap.get(key) ?? 0) + t.amount);
    });
    const labels = [...dailyMap.keys()].sort();
    const values = labels.map(l => +(dailyMap.get(l)!.toFixed(2)));

    const viz: Visualization = {
        type: 'bar',
        title: `Ventas por día (${period === 'week' ? 'esta semana' : 'este mes'})`,
        data: { labels, values }
    };

    return {
        value: { total: +total.toFixed(2), count: filtered.length, period },
        label: `Vendiste ${fmt(total)} en ${filtered.length} ventas ${period === 'week' ? 'esta semana' : 'este mes'}.`,
        metricsUsed: ['total_ventas', 'num_transacciones'],
        visualization: viz
    };
}

export function getSalesForDate(dateStr: string, merchantId?: string): AnalyticsResult {
    const txns = getCompletedTransactions(merchantId);
    const targetDate = new Date(dateStr + 'T00:00:00');
    const start = new Date(targetDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(targetDate);
    end.setHours(23, 59, 59, 999);

    const filtered = filterByRange(txns, start, end);
    const total = sumAmounts(filtered);

    // Desglose por hora para el gráfico
    const hourlyMap = new Map<string, number>();
    filtered.forEach(t => {
        const hour = toDate(t.date).getHours();
        const key = `${hour}:00`;
        hourlyMap.set(key, (hourlyMap.get(key) ?? 0) + t.amount);
    });
    const labels = [...hourlyMap.keys()].sort((a, b) => parseInt(a) - parseInt(b));
    const values = labels.map(l => +(hourlyMap.get(l)!.toFixed(2)));

    const dateLabel = fmtDate(targetDate);

    const viz: Visualization | null = filtered.length > 0 ? {
        type: 'bar',
        title: `Ventas del ${dateLabel}`,
        data: { labels, values }
    } : null;

    return {
        value: { total: +total.toFixed(2), count: filtered.length, date: dateStr },
        label: filtered.length > 0
            ? `El ${dateLabel} vendiste ${fmt(total)} en ${filtered.length} transacciones.`
            : `No se encontraron ventas para el ${dateLabel}.`,
        metricsUsed: ['total_ventas_dia', 'num_transacciones_dia'],
        visualization: viz
    };
}

// ─── Funciones analíticas nuevas ────────────────────────

export function getSalesForYear(year: number, merchantId?: string): AnalyticsResult {
    const txns = getCompletedTransactions(merchantId);

    // Filter matching year
    const yearlyTxns = txns.filter(t => {
        const d = toDate(t.date);
        return d.getFullYear() === year;
    });

    const total = sumAmounts(yearlyTxns);

    // Group by month for visualization
    const monthlyMap = new Map<number, number>();
    for (let i = 0; i < 12; i++) monthlyMap.set(i, 0);

    yearlyTxns.forEach(t => {
        const m = toDate(t.date).getMonth();
        monthlyMap.set(m, (monthlyMap.get(m) ?? 0) + t.amount);
    });

    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const viz: Visualization = {
        type: 'line',
        title: `Ventas del año ${year}`,
        data: {
            labels: monthNames,
            values: Array.from(monthlyMap.values()).map(v => +v.toFixed(2))
        }
    };

    return {
        value: { year, total: +total.toFixed(2), count: yearlyTxns.length },
        label: yearlyTxns.length > 0
            ? `En el año ${year} acumulaste un total de ${fmt(total)} en ${yearlyTxns.length} ventas.`
            : `No tengo registros de ventas para el año ${year}.`,
        metricsUsed: ['total_ventas_ano', 'conteo_transacciones_ano'],
        visualization: yearlyTxns.length > 0 ? viz : null
    };
}

export function getSalesToday(merchantId?: string): AnalyticsResult {
    const ref = getRefDate(merchantId);
    const dateStr = toLocalDateStr(ref);
    const result = getSalesForDate(dateStr, merchantId);
    // Ajustar etiqueta a "hoy"
    if (result.value && (result.value as any).count > 0) {
        result.label = `Hoy vendiste ${fmt((result.value as any).total)} en ${(result.value as any).count} transacciones.`;
    } else {
        result.label = 'Hoy no has tenido ventas registradas aún.';
    }
    if (result.visualization) {
        result.visualization.title = 'Ventas de hoy (por hora)';
    }
    return result;
}

export function comparePeriods(merchantId?: string): AnalyticsResult {
    const txns = getCompletedTransactions(merchantId);
    const ref = getRefDate(merchantId);
    const thisMonth = getMonthRange(ref);
    const prevRef = new Date(ref.getFullYear(), ref.getMonth() - 1, 15);
    const lastMonth = getMonthRange(prevRef);

    const thisTxns = filterByRange(txns, thisMonth.start, thisMonth.end);
    const lastTxns = filterByRange(txns, lastMonth.start, lastMonth.end);
    const thisTotal = sumAmounts(thisTxns);
    const lastTotal = sumAmounts(lastTxns);

    const diff = thisTotal - lastTotal;
    const pct = lastTotal > 0 ? ((diff / lastTotal) * 100) : 0;
    const direction = diff >= 0 ? 'más' : 'menos';

    const viz: Visualization = {
        type: 'bar',
        title: 'Comparación mes actual vs anterior',
        data: {
            labels: ['Mes anterior', 'Mes actual'],
            values: [+lastTotal.toFixed(2), +thisTotal.toFixed(2)]
        }
    };

    return {
        value: { thisMonth: +thisTotal.toFixed(2), lastMonth: +lastTotal.toFixed(2), diff: +diff.toFixed(2), pct: +pct.toFixed(1) },
        label: `Este mes llevas ${fmt(thisTotal)} vs ${fmt(lastTotal)} del mes pasado. Eso es ${fmt(Math.abs(diff))} ${direction} (${Math.abs(+pct.toFixed(1))}%).`,
        metricsUsed: ['total_mes_actual', 'total_mes_anterior', 'variacion_porcentual'],
        visualization: viz
    };
}

export function getBestDay(merchantId?: string): AnalyticsResult {
    const txns = getCompletedTransactions(merchantId);
    const dailyMap = new Map<string, number>();
    txns.forEach(t => {
        const key = toLocalDateStr(toDate(t.date));
        dailyMap.set(key, (dailyMap.get(key) ?? 0) + t.amount);
    });

    let bestDay = '', bestAmount = 0;
    dailyMap.forEach((v, k) => { if (v > bestAmount) { bestAmount = v; bestDay = k; } });

    return {
        value: { date: bestDay, amount: +bestAmount.toFixed(2) },
        label: `Tu mejor día fue el ${fmtDate(new Date(bestDay + 'T12:00:00'))} con ${fmt(bestAmount)} en ventas.`,
        metricsUsed: ['mejor_dia', 'total_dia'],
        visualization: null
    };
}

export function getWorstDay(merchantId?: string): AnalyticsResult {
    const txns = getCompletedTransactions(merchantId);
    const dailyMap = new Map<string, number>();
    txns.forEach(t => {
        const key = toLocalDateStr(toDate(t.date));
        dailyMap.set(key, (dailyMap.get(key) ?? 0) + t.amount);
    });

    let worstDay = '', worstAmount = Infinity;
    dailyMap.forEach((v, k) => { if (v < worstAmount) { worstAmount = v; worstDay = k; } });

    return {
        value: { date: worstDay, amount: +worstAmount.toFixed(2) },
        label: `Tu día más flojo fue el ${fmtDate(new Date(worstDay + 'T12:00:00'))} con ${fmt(worstAmount)} en ventas.`,
        metricsUsed: ['peor_dia', 'total_dia'],
        visualization: null
    };
}

export function getAverageTicket(merchantId?: string): AnalyticsResult {
    const txns = getCompletedTransactions(merchantId);
    const avg = txns.length > 0 ? sumAmounts(txns) / txns.length : 0;

    return {
        value: { average: +avg.toFixed(2), totalTransactions: txns.length },
        label: `Tu ticket promedio es de ${fmt(avg)} por venta (basado en ${txns.length} ventas).`,
        metricsUsed: ['ticket_promedio', 'num_transacciones'],
        visualization: null
    };
}

export function getChurnRisk(merchantId?: string): AnalyticsResult {
    const txns = getCompletedTransactions(merchantId);
    const ref = getRefDate(merchantId);
    const customerLastVisit = new Map<string, { name: string; lastDate: Date; count: number }>();

    txns.forEach(t => {
        const d = toDate(t.date);
        const existing = customerLastVisit.get(t.customerId);
        if (!existing || d > existing.lastDate) {
            customerLastVisit.set(t.customerId, {
                name: t.customerName,
                lastDate: d,
                count: (existing?.count ?? 0) + 1
            });
        } else {
            existing.count++;
        }
    });

    const thirtyDaysAgo = new Date(ref);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const atRisk: Array<{ name: string; lastVisit: string; daysSince: number }> = [];
    customerLastVisit.forEach((v) => {
        if (v.lastDate < thirtyDaysAgo && v.count >= 2) {
            const daysSince = Math.floor((ref.getTime() - v.lastDate.getTime()) / (1000 * 60 * 60 * 24));
            atRisk.push({ name: v.name, lastVisit: fmtDate(v.lastDate), daysSince });
        }
    });

    atRisk.sort((a, b) => b.daysSince - a.daysSince);

    const viz: Visualization | null = atRisk.length > 0 ? {
        type: 'table',
        title: 'Clientes que no han vuelto',
        data: { headers: ['Cliente', 'Última visita', 'Días sin venir'], rows: atRisk.map(r => [r.name, r.lastVisit, r.daysSince.toString()]) }
    } : null;

    return {
        value: atRisk,
        label: atRisk.length > 0
            ? `Hay ${atRisk.length} cliente(s) que no han vuelto en más de 30 días: ${atRisk.map(r => r.name).join(', ')}.`
            : 'Todos tus clientes frecuentes han comprado recientemente. ¡Buen trabajo!',
        metricsUsed: ['clientes_en_riesgo', 'ultima_visita'],
        visualization: viz
    };
}

export function getRepeatCustomers(merchantId?: string): AnalyticsResult {
    const txns = getCompletedTransactions(merchantId);
    const customerStats = new Map<string, { name: string; count: number; total: number }>();

    txns.forEach(t => {
        const existing = customerStats.get(t.customerId) ?? { name: t.customerName, count: 0, total: 0 };
        existing.count++;
        existing.total += t.amount;
        customerStats.set(t.customerId, existing);
    });

    const repeaters = [...customerStats.values()]
        .filter(c => c.count >= 2)
        .sort((a, b) => b.count - a.count);

    const viz: Visualization = {
        type: 'table',
        title: 'Clientes frecuentes',
        data: {
            headers: ['Cliente', 'Compras', 'Total gastado'],
            rows: repeaters.map(r => [r.name, r.count.toString(), fmt(r.total)])
        }
    };

    return {
        value: repeaters,
        label: repeaters.length > 0
            ? `Tienes ${repeaters.length} clientes frecuentes. ${repeaters[0].name} es quien más compra con ${repeaters[0].count} visitas (${fmt(repeaters[0].total)} en total).`
            : 'Aún no tienes suficientes datos de clientes repetidos.',
        metricsUsed: ['clientes_frecuentes', 'num_compras', 'total_por_cliente'],
        visualization: viz
    };
}

export function getDayOfWeekAnalysis(merchantId?: string): AnalyticsResult {
    const txns = getCompletedTransactions(merchantId);
    const dowMap = new Map<number, { total: number; count: number }>();

    txns.forEach(t => {
        const dow = toDate(t.date).getDay();
        const existing = dowMap.get(dow) ?? { total: 0, count: 0 };
        existing.total += t.amount;
        existing.count++;
        dowMap.set(dow, existing);
    });

    const labels: string[] = [];
    const values: number[] = [];
    let bestDow = 0, bestAvg = 0, worstDow = 0, worstAvg = Infinity;

    for (let i = 1; i <= 6; i++) { // lunes a sábado
        const data = dowMap.get(i) ?? { total: 0, count: 0 };
        const avg = data.count > 0 ? data.total / data.count : 0;
        labels.push(dayName(i));
        values.push(+avg.toFixed(2));
        if (avg > bestAvg) { bestAvg = avg; bestDow = i; }
        if (avg < worstAvg) { worstAvg = avg; worstDow = i; }
    }
    // domingo
    const sunData = dowMap.get(0) ?? { total: 0, count: 0 };
    const sunAvg = sunData.count > 0 ? sunData.total / sunData.count : 0;
    labels.push(dayName(0));
    values.push(+sunAvg.toFixed(2));
    if (sunAvg > bestAvg) { bestAvg = sunAvg; bestDow = 0; }
    if (sunAvg < worstAvg && sunData.count > 0) { worstAvg = sunAvg; worstDow = 0; }

    const viz: Visualization = {
        type: 'bar',
        title: 'Ventas promedio por día de la semana',
        data: { labels, values }
    };

    return {
        value: { labels, values, bestDay: dayName(bestDow), worstDay: dayName(worstDow) },
        label: `Tu mejor día de la semana es ${dayName(bestDow)} (promedio ${fmt(bestAvg)}) y el más flojo es ${dayName(worstDow)} (promedio ${fmt(worstAvg)}).`,
        metricsUsed: ['venta_promedio_por_dia', 'dia_mas_fuerte', 'dia_mas_flojo'],
        visualization: viz
    };
}

export function getSalesTrend(merchantId?: string): AnalyticsResult {
    const txns = getCompletedTransactions(merchantId);
    const ref = getRefDate(merchantId);

    // Últimos 14 días
    const start = new Date(ref);
    start.setDate(start.getDate() - 13);
    start.setHours(0, 0, 0, 0);

    const dailyMap = new Map<string, number>();
    const filtered = filterByRange(txns, start, ref);
    filtered.forEach(t => {
        const key = toLocalDateStr(toDate(t.date));
        dailyMap.set(key, (dailyMap.get(key) ?? 0) + t.amount);
    });

    // Llenar días sin ventas con 0
    const labels: string[] = [];
    const values: number[] = [];
    for (let d = new Date(start); d <= ref; d.setDate(d.getDate() + 1)) {
        const key = toLocalDateStr(d);
        labels.push(key);
        values.push(+(dailyMap.get(key) ?? 0).toFixed(2));
    }

    // Tendencia simple: promedio primera mitad vs segunda mitad
    const mid = Math.floor(values.length / 2);
    const firstHalf = values.slice(0, mid);
    const secondHalf = values.slice(mid);
    const avgFirst = firstHalf.reduce((s, v) => s + v, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((s, v) => s + v, 0) / secondHalf.length;
    const trend = avgSecond >= avgFirst ? 'subiendo' : 'bajando';
    const pctChange = avgFirst > 0 ? (((avgSecond - avgFirst) / avgFirst) * 100) : 0;

    const viz: Visualization = {
        type: 'line',
        title: 'Tendencia de ventas (últimos 14 días)',
        data: { labels, values }
    };

    return {
        value: { avgFirst: +avgFirst.toFixed(2), avgSecond: +avgSecond.toFixed(2), trend, pctChange: +pctChange.toFixed(1) },
        label: `La tendencia de ventas está ${trend}. El promedio diario pasó de ${fmt(avgFirst)} a ${fmt(avgSecond)} (${pctChange > 0 ? '+' : ''}${pctChange.toFixed(1)}%).`,
        metricsUsed: ['tendencia_ventas', 'promedio_diario', 'variacion_porcentual'],
        visualization: viz
    };
}

export function detectSignificantChange(merchantId?: string): AnalyticsResult {
    const trend = getSalesTrend(merchantId);
    const v = trend.value as { avgFirst: number; avgSecond: number; trend: string; pctChange: number };
    const significant = Math.abs(v.pctChange) > 15;

    let label: string;
    if (!significant) {
        label = `No hay cambios significativos recientes. Las ventas se mantienen estables (variación de ${v.pctChange}%).`;
    } else if (v.pctChange < 0) {
        label = `⚠️ Atención: tus ventas han bajado un ${Math.abs(v.pctChange)}% recientemente. El promedio diario pasó de ${fmt(v.avgFirst)} a ${fmt(v.avgSecond)}.`;
    } else {
        label = `✅ ¡Buena noticia! Tus ventas subieron un ${v.pctChange}% recientemente. El promedio diario pasó de ${fmt(v.avgFirst)} a ${fmt(v.avgSecond)}.`;
    }

    return {
        value: { ...v, significant },
        label,
        metricsUsed: ['cambio_significativo', 'variacion_porcentual'],
        visualization: trend.visualization
    };
}

export function getTopProducts(merchantId?: string): AnalyticsResult {
    const txns = getCompletedTransactions(merchantId);
    const productMap = new Map<string, { total: number; count: number }>();

    txns.forEach(t => {
        const key = t.category;
        const existing = productMap.get(key) ?? { total: 0, count: 0 };
        existing.total += t.amount;
        existing.count += t.quantity;
        productMap.set(key, existing);
    });

    const sorted = [...productMap.entries()].sort((a, b) => b[1].total - a[1].total);
    const labels = sorted.map(([k]) => k);
    const values = sorted.map(([, v]) => +v.total.toFixed(2));

    const viz: Visualization = {
        type: 'pie',
        title: 'Ventas por categoría',
        data: { labels, values }
    };

    return {
        value: sorted.map(([k, v]) => ({ category: k, total: +v.total.toFixed(2), units: v.count })),
        label: `Tu categoría estrella es "${sorted[0]?.[0]}" con ${fmt(sorted[0]?.[1]?.total ?? 0)} en ventas. Le siguen: ${sorted.slice(1, 3).map(([k, v]) => `${k} (${fmt(v.total)})`).join(', ')}.`,
        metricsUsed: ['ventas_por_categoria', 'categoria_top'],
        visualization: viz
    };
}

export function getPaymentBreakdown(merchantId?: string): AnalyticsResult {
    const txns = getCompletedTransactions(merchantId);
    const methodMap = new Map<string, { total: number; count: number }>();

    txns.forEach(t => {
        const existing = methodMap.get(t.paymentMethod) ?? { total: 0, count: 0 };
        existing.total += t.amount;
        existing.count++;
        methodMap.set(t.paymentMethod, existing);
    });

    const sorted = [...methodMap.entries()].sort((a, b) => b[1].total - a[1].total);
    const labels = sorted.map(([k]) => k);
    const values = sorted.map(([, v]) => +v.total.toFixed(2));

    const viz: Visualization = {
        type: 'pie',
        title: 'Distribución por método de pago',
        data: { labels, values }
    };

    return {
        value: sorted.map(([k, v]) => ({ method: k, total: +v.total.toFixed(2), count: v.count })),
        label: `El método de pago más usado es "${sorted[0]?.[0]}" con ${fmt(sorted[0]?.[1]?.total ?? 0)} (${sorted[0]?.[1]?.count} ventas). ${sorted.length > 1 ? `Le sigue "${sorted[1][0]}" con ${fmt(sorted[1][1].total)}.` : ''}`,
        metricsUsed: ['metodos_de_pago', 'total_por_metodo'],
        visualization: viz
    };
}
