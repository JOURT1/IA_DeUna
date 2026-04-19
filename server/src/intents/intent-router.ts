// ============================================
// Intent Router — Detecta la intención del usuario
// ============================================

import { INTENT_CATALOG, type IntentDef } from './intent-catalog.js';
import type { IntentMatch } from '../types/index.js';
import { toLocalDateStr } from '../utils/date-utils.js';

const MONTH_MAP: Record<string, number> = {
    'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
    'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
};

/**
 * Extrae una fecha del mensaje del usuario.
 * Soporta: "hoy", "ayer", "17 de abril", "el 15", "17 de abril de 2025".
 * Devuelve formato YYYY-MM-DD o null.
 */
export function extractDateFromMessage(message: string, refDate: Date): string | null {
    const normalized = message.toLowerCase().trim();

    // Formato ISO: "2025-04-17"
    const isoMatch = normalized.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
        return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
    }

    // "hoy" y variantes naturales. Usa la referencia real pasada por la ruta,
    // no una fecha fija ni la última fecha disponible del dataset.
    if (/\b(hoy|d[ií]a\s+de\s+hoy|dia\s+de\s+hoy|d[ií]a\s+actual|dia\s+actual)\b/.test(normalized)) {
        return toLocalDateStr(refDate);
    }

    // "ayer" o "aller" (tolerancia a ortografía)
    if (/\b(ayer|aller)\b/.test(normalized)) {
        const yesterday = new Date(refDate);
        yesterday.setDate(yesterday.getDate() - 1);
        return toLocalDateStr(yesterday);
    }

    // "anteayer" 
    if (/\b(anteayer|ante\s*ayer)\b/.test(normalized)) {
        const dayBefore = new Date(refDate);
        dayBefore.setDate(dayBefore.getDate() - 2);
        return toLocalDateStr(dayBefore);
    }

    // "17 de abril" o "17 de abril de 2025" or "17 de abril del 2025"
    const fullDateMatch = normalized.match(/(\d{1,2})\s+de\s+(\w+)(?:\s+(?:de|del)\s+(\d{4}))?/);
    if (fullDateMatch) {
        const day = parseInt(fullDateMatch[1]);
        const monthName = fullDateMatch[2];
        const year = fullDateMatch[3] ? parseInt(fullDateMatch[3]) : refDate.getFullYear();
        const month = MONTH_MAP[monthName];
        if (month !== undefined && day >= 1 && day <= 31) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            return dateStr;
        }
    }

    // "el 15" o "del 15" (solo día, asume mes actual del refDate)
    const dayOnlyMatch = normalized.match(/(?:el|del)\s+(\d{1,2})(?:\s|$|[,.])/);
    if (dayOnlyMatch) {
        const day = parseInt(dayOnlyMatch[1]);
        if (day >= 1 && day <= 31) {
            const dateStr = `${refDate.getFullYear()}-${String(refDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            return dateStr;
        }
    }

    return null;
}

/**
 * Extrae un año del mensaje del usuario.
 * Soporta: "2024", "este año", "año pasado"
 * Devuelve un número de año o null.
 */
export function extractYearFromMessage(message: string, refDate: Date): number | null {
    const normalized = message.toLowerCase().trim();

    // "este año"
    if (/este\s+a[ñn]o/i.test(normalized)) {
        return refDate.getFullYear();
    }

    // "año pasado"
    if (/a[ñn]o\s+pasado/i.test(normalized)) {
        return refDate.getFullYear() - 1;
    }

    // "año antepasado"
    if (/(a[ñn]o\s+ante(\s*)pasado|ante(\s*)pasado)/i.test(normalized)) {
        return refDate.getFullYear() - 2;
    }

    // Específico: "del 2025", "en 2024"
    const yearMatch = normalized.match(/\b(202[4-6])\b/);
    if (yearMatch) {
        return parseInt(yearMatch[1]);
    }

    return null;
}

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
        { question: '¿Cómo voy comparado con el mes pasado?', intent: 'sales_comparison' },
        { question: '¿Qué clientes están en riesgo de no volver?', intent: 'customer_churn' },
        { question: '¿Cuál es la tendencia de mis ventas?', intent: 'sales_trend' },
        { question: '¿Quiénes son mis mejores clientes?', intent: 'repeat_customers' },
        { question: 'Dame un consejo sobre mi negocio', intent: 'proactive_alert' },
        { question: '¿Cuánto vendí en todo el 2025?', intent: 'sales_specific_year' },
        { question: '¿Cuál fue mi mejor día de ventas?', intent: 'best_day' },
        { question: '¿Cuál es mi ticket promedio?', intent: 'average_ticket' },
        { question: '¿Qué es lo que más vendo?', intent: 'top_products' },
        { question: '¿Cuáles son mis días más fuertes?', intent: 'strong_weak_days' },
        { question: '¿Cómo pagan mis clientes?', intent: 'payment_methods' }
    ];
}
