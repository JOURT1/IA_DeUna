// ============================================
// Chat Routes — Endpoints REST del backend
// ============================================

import { Router, type Request, type Response } from 'express';
import * as analytics from '../analytics/analytics.engine.js';
import { detectIntent, getIntentDef, getSampleQuestions, extractDateFromMessage, extractYearFromMessage } from '../intents/intent-router.js';
import { generateProactiveAlerts, getTopAlert } from '../alerts/proactive-alerts.js';
import { getAllMerchants, getMerchantData, getCompletedTransactions } from '../data/data-loader.js';
import { getLLMProvider } from '../llm/llm-adapter.js';
import { LLMCache } from '../llm/llm-cache.js';
import { getCurrentEcuadorDate } from '../utils/date-utils.js';
import type { ChatRequest, ChatResponse, AnalyticsResult } from '../types/index.js';

export const chatRouter = Router();

function getRefDate(_merchantId?: string): Date {
    return getCurrentEcuadorDate();
}

// ─── POST /api/chat ────────────────────────────────────
chatRouter.post('/chat', async (req: Request, res: Response): Promise<void> => {
    try {
        const { message, mode = 'simple', merchantId: rawMerchantId } = req.body as ChatRequest;
        const merchantId = rawMerchantId || '';

        if (!message?.trim()) {
            res.status(400).json({ error: 'El mensaje no puede estar vacío' });
            return;
        }

        const merchant = getMerchantData(merchantId);
        let intentMatch = detectIntent(message);
        const llm = getLLMProvider();

        // 1. Verificar si el intent ya está en caché
        const cachedIntent = LLMCache.getIntent(message);
        if (cachedIntent) {
            intentMatch = { intent: cachedIntent, confidence: 1.0, params: {} };
        }
        // 2. Si no hay caché y el motor determinístico tiene poca confianza, preguntamos al LLM
        else if (intentMatch.confidence < 0.5 && llm.name !== 'noop') {
            const { INTENT_CATALOG } = await import('../intents/intent-catalog.js');
            const aiIntent = await llm.classifyIntent(message, INTENT_CATALOG.map(i => ({
                intent: i.intent,
                description: i.description
            })));

            if (aiIntent !== 'unknown') {
                intentMatch = { intent: aiIntent, confidence: 0.9, params: {} };
                LLMCache.setIntent(message, aiIntent); // Guardar en caché
            }
        }

        const intentDef = getIntentDef(intentMatch.intent);

        let result: AnalyticsResult | null = null;
        let answer = '';
        let followUps: string[] = [];

        // Ejecutar la función analítica correspondiente
        switch (intentMatch.intent) {
            case 'sales_today':
                result = analytics.getSalesToday(merchantId);
                break;
            case 'sales_specific_date': {
                const refDate = getRefDate(merchantId);
                const dateStr = extractDateFromMessage(message, refDate);
                if (dateStr) {
                    result = analytics.getSalesForDate(dateStr, merchantId);
                } else {
                    // Fallback: si no pudo parsear la fecha, usar ventas del mes
                    result = analytics.getSalesForPeriod('month', merchantId);
                }
                break;
            }
            case 'sales_specific_year': {
                const refDate = getRefDate(merchantId);
                const year = extractYearFromMessage(message, refDate);

                if (year) {
                    result = analytics.getSalesForYear(year, merchantId);
                } else {
                    // El usuario preguntó por el año sin ser específico (ej: "¿Cuánto vendí al año?")
                    answer = "¿A qué año te refieres? Tengo registros detallados de tus ventas del 2024, 2025 y 2026. Dime un año y te doy el reporte.";
                    followUps = ["2026", "2025", "2024"];
                }
                break;
            }
            case 'sales_this_week':
                result = analytics.getSalesForPeriod('week', merchantId);
                break;
            case 'sales_this_month':
                result = analytics.getSalesForPeriod('month', merchantId);
                break;
            case 'sales_comparison':
                result = analytics.comparePeriods(merchantId);
                break;
            case 'best_day':
                result = analytics.getBestDay(merchantId);
                break;
            case 'worst_day':
                result = analytics.getWorstDay(merchantId);
                break;
            case 'average_ticket':
                result = analytics.getAverageTicket(merchantId);
                break;
            case 'customer_churn':
                result = analytics.getChurnRisk(merchantId);
                break;
            case 'repeat_customers':
                result = analytics.getRepeatCustomers(merchantId);
                break;
            case 'strong_weak_days':
                result = analytics.getDayOfWeekAnalysis(merchantId);
                break;
            case 'sales_trend':
                result = analytics.getSalesTrend(merchantId);
                break;
            case 'significant_change':
                result = analytics.detectSignificantChange(merchantId);
                break;
            case 'top_products':
                result = analytics.getTopProducts(merchantId);
                break;
            case 'payment_methods':
                result = analytics.getPaymentBreakdown(merchantId);
                break;
            case 'proactive_alert': {
                const alerts = generateProactiveAlerts(merchantId);
                answer = alerts.length > 0
                    ? alerts.map(a => `${a.title}\n${a.message}`).join('\n\n')
                    : 'Por ahora todo se ve bien con tu negocio. ¡Sigue así! 💪';
                followUps = ['¿Quieres ver tu tendencia de ventas?', '¿Quieres comparar con el mes pasado?'];
                break;
            }
            case 'greeting':
                answer = `¡Hola! 👋 Soy tu contador de bolsillo para ${merchant.merchant.merchantName}. Puedo ayudarte con información sobre tus ventas, clientes y tendencias. ¿Qué quieres saber?`;
                followUps = getSampleQuestions().slice(0, 3).map(q => q.question);
                break;
            case 'help':
                answer = `Puedo responder preguntas como:\n\n${getSampleQuestions().map(q => `• ${q.question}`).join('\n')}\n\n¡Pregúntame lo que quieras! 😊`;
                followUps = [];
                break;
            default:
                if (llm.name !== 'noop') {
                    answer = await llm.handleGeneralQuery(message, merchant.merchant.merchantName);
                    // Provide a couple of high-value suggestions
                    followUps = getSampleQuestions().slice(0, 2).map(q => q.question);
                } else {
                    answer = `No entendí bien tu pregunta. Intenta algo como:\n\n${getSampleQuestions().slice(0, 5).map(q => `• ${q.question}`).join('\n')}\n\nO escribe "ayuda" para ver todas las opciones.`;
                    followUps = getSampleQuestions().slice(0, 3).map(q => q.question);
                }
                break;
        }

        // Si tenemos resultado analítico, reformulamos con LLM (usando caché)
        if (result) {
            const llm = getLLMProvider();

            // Intentar obtener de caché
            const cachedAnswer = LLMCache.getReformulation(result.label, mode, merchantId);

            if (cachedAnswer && llm.name !== 'noop') {
                answer = cachedAnswer;
            } else {
                answer = await llm.reformulate(result.label, {
                    intent: intentMatch.intent,
                    mode,
                    merchantName: merchant.merchant.merchantName,
                    metricsUsed: result.metricsUsed
                });
                // Guardar en caché para futuras consultas idénticas
                LLMCache.setReformulation(result.label, mode, merchantId, answer);
            }
            followUps = intentDef?.followUps ?? [];
        }

        // En modo simple, no mostrar visualización a menos que se pida explícitamente
        const showViz = mode === 'complete'
            || intentMatch.intent.includes('trend')
            || intentMatch.intent === 'sales_today'
            || intentMatch.intent === 'sales_specific_date'
            || intentMatch.intent === 'sales_this_week'
            || intentMatch.intent === 'sales_this_month';

        const response: ChatResponse = {
            answer,
            mode,
            detectedIntent: intentMatch.intent,
            confidence: intentMatch.confidence,
            metricsUsed: result?.metricsUsed ?? [],
            suggestedFollowUps: followUps,
            visualization: showViz ? (result?.visualization ?? null) : null,
            proactiveInsight: null
        };

        res.json(response);
    } catch (error) {
        console.error('Error en /api/chat:', error);
        res.status(500).json({ error: 'Error procesando tu pregunta' });
    }
});

// ─── GET /api/proactive-alert ──────────────────────────
chatRouter.get('/proactive-alert', (req: Request, res: Response): void => {
    const merchantId = (req.query.merchantId as string) || '';
    const alert = getTopAlert(merchantId);
    res.json({ alert });
});

// ─── GET /api/sample-questions ─────────────────────────
chatRouter.get('/sample-questions', (_req: Request, res: Response): void => {
    res.json({ questions: getSampleQuestions() });
});

// ─── GET /api/merchants ────────────────────────────────
chatRouter.get('/merchants', (_req: Request, res: Response): void => {
    res.json({ merchants: getAllMerchants() });
});

// ─── GET /api/health ───────────────────────────────────
chatRouter.get('/health', (_req: Request, res: Response): void => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
