// ============================================
// Intent Router — Detecta la intención del usuario
// ============================================

import { INTENT_CATALOG, type IntentDef } from './intent-catalog.js';
import type { IntentMatch } from '../types/index.js';

export function detectIntent(message: string): IntentMatch {
    const normalized = message.toLowerCase().trim();

    // 1. Intentar matching por regex (más preciso)
    for (const def of INTENT_CATALOG) {
        for (const pattern of def.patterns) {
            if (pattern.test(normalized)) {
                return { intent: def.intent, confidence: 0.95, params: {} };
            }
        }
    }

    // 2. Fallback: matching por keywords
    let bestMatch: IntentDef | null = null;
    let bestScore = 0;

    for (const def of INTENT_CATALOG) {
        let score = 0;
        for (const keyword of def.keywords) {
            if (normalized.includes(keyword.toLowerCase())) {
                // Keywords más largos valen más (más específicos)
                score += keyword.length;
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestMatch = def;
        }
    }

    if (bestMatch && bestScore > 3) {
        const confidence = Math.min(0.85, 0.5 + bestScore * 0.05);
        return { intent: bestMatch.intent, confidence, params: {} };
    }

    // 3. No se pudo detectar → intent unknown
    return { intent: 'unknown', confidence: 0.1, params: {} };
}

export function getIntentDef(intent: string): IntentDef | undefined {
    return INTENT_CATALOG.find(d => d.intent === intent);
}

export function getSampleQuestions(): Array<{ question: string; intent: string }> {
    return [
        { question: '¿Cuánto vendí esta semana?', intent: 'sales_this_week' },
        { question: '¿Cómo voy vs el mes pasado?', intent: 'sales_comparison' },
        { question: '¿Cuál fue mi mejor día?', intent: 'best_day' },
        { question: '¿Qué clientes no han vuelto?', intent: 'customer_churn' },
        { question: '¿Cuál es mi ticket promedio?', intent: 'average_ticket' },
        { question: '¿Cómo va la tendencia?', intent: 'sales_trend' },
        { question: '¿Qué es lo que más vendo?', intent: 'top_products' },
        { question: '¿Cómo pagan mis clientes?', intent: 'payment_methods' },
        { question: '¿Qué días son más fuertes?', intent: 'strong_weak_days' },
        { question: 'Dame un consejo', intent: 'proactive_alert' },
    ];
}
