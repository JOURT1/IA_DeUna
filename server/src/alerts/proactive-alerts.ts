// ============================================
// Proactive Alerts — Alertas proactivas
// ============================================

import * as analytics from '../analytics/analytics.engine.js';
import { getCompletedTransactions, getMerchantData } from '../data/data-loader.js';
import type { ProactiveInsight } from '../types/index.js';

export function generateProactiveAlerts(merchantId?: string): ProactiveInsight[] {
    const alerts: ProactiveInsight[] = [];

    try {
        // 1. Detectar caída de ventas
        const trend = analytics.getSalesTrend(merchantId);
        const trendValue = trend.value as { pctChange: number; trend: string; avgFirst: number; avgSecond: number };
        if (trendValue.pctChange < -15) {
            alerts.push({
                title: '📉 Caída en ventas reciente',
                message: `Tus ventas diarias bajaron un ${Math.abs(trendValue.pctChange)}% en la última semana (de $${trendValue.avgFirst.toFixed(2)} a $${trendValue.avgSecond.toFixed(2)} promedio por día). Considera hacer una promoción o contactar a tus clientes frecuentes.`,
                severity: 'warning'
            });
        } else if (trendValue.pctChange > 20) {
            alerts.push({
                title: '📈 ¡Ventas en subida!',
                message: `Tus ventas subieron un ${trendValue.pctChange}% recientemente. ¡Buen trabajo! Aprovecha el impulso para fidelizar a tus nuevos clientes.`,
                severity: 'success'
            });
        }

        // 2. Detectar concentración de clientes
        const txns = getCompletedTransactions(merchantId);
        const customerTotals = new Map<string, { name: string; total: number }>();
        const grandTotal = txns.reduce((s, t) => {
            const existing = customerTotals.get(t.customerId) ?? { name: t.customerName, total: 0 };
            existing.total += t.amount;
            customerTotals.set(t.customerId, existing);
            return s + t.amount;
        }, 0);

        const sorted = [...customerTotals.values()].sort((a, b) => b.total - a.total);
        if (sorted.length > 0 && grandTotal > 0) {
            const topPct = (sorted[0].total / grandTotal) * 100;
            if (topPct > 30) {
                alerts.push({
                    title: '⚠️ Dependencia de un solo cliente',
                    message: `${sorted[0].name} representa el ${topPct.toFixed(0)}% de tus ventas totales. Es bueno diversificar tu base de clientes para reducir riesgos.`,
                    severity: 'warning'
                });
            }
        }

        // 3. Detectar clientes en riesgo
        const churn = analytics.getChurnRisk(merchantId);
        const churnData = churn.value as Array<{ name: string; daysSince: number }>;
        if (churnData.length > 0) {
            alerts.push({
                title: '👤 Clientes que te extrañan',
                message: `${churnData.length} cliente(s) frecuente(s) no han vuelto en más de 30 días: ${churnData.map(c => c.name).join(', ')}. Un mensaje o descuento podría traerlos de vuelta.`,
                severity: 'info'
            });
        }

        // 4. Mejor día de la semana
        const dow = analytics.getDayOfWeekAnalysis(merchantId);
        const dowValue = dow.value as { bestDay: string; worstDay: string };
        alerts.push({
            title: '📅 Dato útil sobre tus ventas',
            message: `Tu día más fuerte es ${dowValue.bestDay} y el más flojo es ${dowValue.worstDay}. Podrías hacer promociones los ${dowValue.worstDay} para equilibrar tus ventas.`,
            severity: 'info'
        });

    } catch (error) {
        console.error('Error generando alertas proactivas:', error);
    }

    return alerts;
}

export function getTopAlert(merchantId?: string): ProactiveInsight | null {
    const alerts = generateProactiveAlerts(merchantId);
    // Priorizar warnings, luego success, luego info
    const warning = alerts.find(a => a.severity === 'warning');
    if (warning) return warning;
    const success = alerts.find(a => a.severity === 'success');
    if (success) return success;
    return alerts[0] ?? null;
}
