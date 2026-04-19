// ============================================
// Intent Catalog — Catálogo de intents de negocio
// ============================================

export interface IntentDef {
    intent: string;
    keywords: string[];
    patterns: RegExp[];
    description: string;
    analyticsFn: string;
    supportsVisualization: boolean;
    followUps: string[];
}

export const INTENT_CATALOG: IntentDef[] = [
    {
        intent: 'sales_today',
        keywords: ['hoy', 'vendí hoy', 'ventas hoy', 'ventas de hoy'],
        patterns: [/cu[aá]nto\s+vend[ií]\s+hoy/i, /ventas?\s+(de\s+)?hoy/i, /hoy\s+cu[aá]nto/i, /hoy\s+vend[ií]/i],
        description: 'Total de ventas del día de hoy',
        analyticsFn: 'getSalesToday',
        supportsVisualization: true,
        followUps: ['¿Quieres ver las ventas de esta semana?', '¿Quieres comparar con ayer?']
    },
    {
        intent: 'sales_specific_date',
        keywords: ['vendí el', 'ventas del', 'de abril', 'de mayo', 'de junio', 'de julio', 'de agosto', 'de septiembre', 'de octubre', 'de noviembre', 'de diciembre', 'de enero', 'de febrero', 'de marzo', 'ayer', '2025-', '2024-'],
        patterns: [
            /\d{4}-\d{2}-\d{2}/i,
            /cu[aá]nto\s+vend[ií]\s+(el\s+)?\d{1,2}\s+de\s+\w+/i,
            /ventas?\s+(del?\s+)?\d{1,2}\s+de\s+\w+/i,
            /cu[aá]nto\s+vend[ií]\s+ayer/i,
            /ventas?\s+(de\s+)?ayer/i,
            /el\s+\d{1,2}\s+de\s+\w+\s+cu[aá]nto/i,
            /cu[aá]nto\s+vend[ií]\s+el\s+\d{1,2}/i,
            /ventas?\s+del\s+\d{1,2}/i
        ],
        description: 'Ventas de una fecha específica (ej: "17 de abril", "ayer")',
        analyticsFn: 'getSalesForDate',
        supportsVisualization: true,
        followUps: ['¿Quieres ver las ventas de esta semana?', '¿Quieres ver tu ticket promedio?']
    },
    {
        intent: 'sales_this_week',
        keywords: ['vendí esta semana', 'ventas semana', 'semana', 'semanal'],
        patterns: [/cu[aá]nto\s+vend[ií]\s+(esta\s+)?semana/i, /ventas?\s+(de\s+)?(esta\s+)?semana/i],
        description: 'Total de ventas de la semana actual',
        analyticsFn: 'getSalesForPeriod_week',
        supportsVisualization: true,
        followUps: ['¿Quieres comparar con la semana pasada?', '¿Quieres ver qué día vendiste más?']
    },
    {
        intent: 'sales_this_month',
        keywords: ['vendí este mes', 'ventas mes', 'mensual'],
        patterns: [/cu[aá]nto\s+vend[ií]\s+(este\s+)?mes/i, /ventas?\s+(de\s+)?(este\s+)?mes/i],
        description: 'Total de ventas del mes actual',
        analyticsFn: 'getSalesForPeriod_month',
        supportsVisualization: true,
        followUps: ['¿Quieres comparar con el mes pasado?', '¿Quieres ver tu ticket promedio?']
    },
    {
        intent: 'sales_comparison',
        keywords: ['comparar', 'vs mes pasado', 'respecto al mes', 'comparación', 'mes anterior'],
        patterns: [/compar/i, /vs\s+mes/i, /respecto\s+al?\s+mes/i, /mes\s+(pasado|anterior)/i],
        description: 'Comparación de ventas mes actual vs anterior',
        analyticsFn: 'comparePeriods',
        supportsVisualization: true,
        followUps: ['¿Quieres ver la tendencia día a día?', '¿Quieres saber cuál fue tu mejor día?']
    },
    {
        intent: 'best_day',
        keywords: ['mejor día', 'mejor dia', 'día más fuerte', 'dia mas fuerte', 'más vendí', 'mas vendi'],
        patterns: [/mejor\s+d[ií]a/i, /d[ií]a\s+m[aá]s\s+(fuerte|alto|bueno)/i, /m[aá]s\s+vend[ií]/i],
        description: 'El día con más ventas',
        analyticsFn: 'getBestDay',
        supportsVisualization: false,
        followUps: ['¿Quieres ver cuál fue tu peor día?', '¿Quieres ver qué días de la semana son más fuertes?']
    },
    {
        intent: 'worst_day',
        keywords: ['peor día', 'peor dia', 'día más flojo', 'dia mas flojo', 'menos vendí'],
        patterns: [/peor\s+d[ií]a/i, /d[ií]a\s+m[aá]s\s+(flojo|bajo|d[eé]bil)/i, /menos\s+vend[ií]/i],
        description: 'El día con menos ventas',
        analyticsFn: 'getWorstDay',
        supportsVisualization: false,
        followUps: ['¿Quieres ver cuál fue tu mejor día?', '¿Quieres analizar la tendencia?']
    },
    {
        intent: 'average_ticket',
        keywords: ['ticket promedio', 'promedio', 'ticket medio', 'cuánto gastan en promedio', 'venta promedio'],
        patterns: [/ticket\s+promedio/i, /promedio\s+(de\s+)?venta/i, /venta\s+promedio/i, /cu[aá]nto\s+gastan/i],
        description: 'Valor promedio por transacción',
        analyticsFn: 'getAverageTicket',
        supportsVisualization: false,
        followUps: ['¿Quieres ver quién compra más seguido?', '¿Quieres ver las ventas por categoría?']
    },
    {
        intent: 'customer_churn',
        keywords: ['no han vuelto', 'dejaron de comprar', 'clientes perdidos', 'riesgo', 'no vuelven'],
        patterns: [/no\s+han?\s+vuelto/i, /dejaron?\s+de\s+comprar/i, /clientes?\s+(perdidos?|en\s+riesgo)/i, /no\s+vuelven?/i],
        description: 'Clientes que no han vuelto en 30+ días',
        analyticsFn: 'getChurnRisk',
        supportsVisualization: true,
        followUps: ['¿Quieres ver quiénes son tus clientes más frecuentes?', '¿Quieres ver la tendencia de ventas?']
    },
    {
        intent: 'repeat_customers',
        keywords: ['clientes frecuentes', 'compran más seguido', 'mejores clientes', 'fieles', 'leales', 'repiten'],
        patterns: [/clientes?\s+(frecuentes?|fieles?|leales?)/i, /compran?\s+m[aá]s\s+seguido/i, /mejores?\s+clientes?/i, /qui[eé]n\s+(m[aá]s\s+)?compra/i],
        description: 'Clientes que compran con más frecuencia',
        analyticsFn: 'getRepeatCustomers',
        supportsVisualization: true,
        followUps: ['¿Quieres ver qué clientes están en riesgo de irse?', '¿Quieres ver tu ticket promedio?']
    },
    {
        intent: 'strong_weak_days',
        keywords: ['días fuertes', 'dias fuertes', 'días flojos', 'qué día vendo más', 'día de la semana'],
        patterns: [/d[ií]as?\s+(fuertes?|flojos?|buenos?|malos?)/i, /qu[eé]\s+d[ií]as?\s+vendo/i, /d[ií]as?\s+de\s+la\s+semana/i, /cu[aá]les\s+son\s+los\s+d[ií]as?/i],
        description: 'Análisis de ventas por día de la semana',
        analyticsFn: 'getDayOfWeekAnalysis',
        supportsVisualization: true,
        followUps: ['¿Quieres ver la tendencia general?', '¿Quieres comparar con el mes pasado?']
    },
    {
        intent: 'sales_trend',
        keywords: ['tendencia', 'cómo va', 'como va', 'hacia dónde van', 'evolución'],
        patterns: [/tendencia/i, /c[oó]mo\s+va(n)?/i, /evoluci[oó]n/i, /hacia\s+d[oó]nde/i],
        description: 'Tendencia de ventas últimas 2 semanas',
        analyticsFn: 'getSalesTrend',
        supportsVisualization: true,
        followUps: ['¿Quieres ver si hubo una caída relevante?', '¿Quieres comparar con el mes anterior?']
    },
    {
        intent: 'significant_change',
        keywords: ['caída', 'subida', 'bajó', 'subió', 'cambio', 'alerta'],
        patterns: [/ca[ií]da/i, /subida/i, /baj[oó]/i, /subi[oó]/i, /cambio\s+(relevante|importante)/i, /hubo\s+(alguna?\s+)?(ca[ií]da|subida|cambio)/i],
        description: 'Detecta si hubo cambio significativo reciente',
        analyticsFn: 'detectSignificantChange',
        supportsVisualization: true,
        followUps: ['¿Quieres ver la tendencia completa?', '¿Quieres un consejo basado en tus datos?']
    },
    {
        intent: 'top_products',
        keywords: ['qué vendo más', 'producto estrella', 'categoría', 'más vendido', 'qué se vende'],
        patterns: [/qu[eé]\s+(m[aá]s\s+)?vendo/i, /producto\s+estrella/i, /m[aá]s\s+vendido/i, /categor[ií]a/i, /qu[eé]\s+se\s+vende/i],
        description: 'Productos/categorías más vendidos',
        analyticsFn: 'getTopProducts',
        supportsVisualization: true,
        followUps: ['¿Quieres ver cómo pagan tus clientes?', '¿Quieres ver tu ticket promedio?']
    },
    {
        intent: 'payment_methods',
        keywords: ['cómo pagan', 'como pagan', 'método de pago', 'medios de pago', 'efectivo', 'tarjeta'],
        patterns: [/c[oó]mo\s+pagan/i, /m[eé]todo\s+de\s+pago/i, /medios?\s+de\s+pago/i],
        description: 'Distribución por método de pago',
        analyticsFn: 'getPaymentBreakdown',
        supportsVisualization: true,
        followUps: ['¿Quieres ver qué productos vendes más?', '¿Quieres ver tus ventas del mes?']
    },
    {
        intent: 'proactive_alert',
        keywords: ['consejo', 'recomendación', 'sugerencia', 'dame un tip', 'qué debería saber'],
        patterns: [/consejo/i, /recomendaci[oó]n/i, /sugerencia/i, /tip/i, /qu[eé]\s+deber[ií]a\s+saber/i, /alerta/i],
        description: 'Solicita un consejo o alerta proactiva',
        analyticsFn: 'getProactiveAlerts',
        supportsVisualization: false,
        followUps: ['¿Quieres ver tu tendencia de ventas?', '¿Quieres saber si algún cliente no ha vuelto?']
    },
    {
        intent: 'greeting',
        keywords: ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'qué tal', 'hey'],
        patterns: [/^hola/i, /^buenos?\s+d[ií]as?/i, /^buenas?\s+(tardes?|noches?)/i, /^qu[eé]\s+tal/i, /^hey/i],
        description: 'Saludo',
        analyticsFn: 'greeting',
        supportsVisualization: false,
        followUps: []
    },
    {
        intent: 'help',
        keywords: ['ayuda', 'qué puedo preguntar', 'qué sabes hacer', 'opciones', 'menú'],
        patterns: [/ayuda/i, /qu[eé]\s+(puedo|te puedo)\s+preguntar/i, /qu[eé]\s+sabes/i, /opciones/i, /men[uú]/i],
        description: 'Muestra lo que puede hacer el asistente',
        analyticsFn: 'help',
        supportsVisualization: false,
        followUps: []
    }
];
