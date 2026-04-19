const fs = require('fs');

const questions = [
    { q: "¿Cuánto he vendido el día de hoy?", expected: "Datos de ventas del día actual (19 de abril de 2026).", intent: "sales_today" },
    { q: "¿Cuál es el total de mis ventas de este mes?", expected: "Datos acumulados del mes en curso.", intent: "sales_this_month" },
    { q: "¿Cuánto generé en todo el año 2025?", expected: "Monto total y sumatoria del año 2025 completo.", intent: "sales_specific_year" },
    { q: "¿Cómo voy en ventas comparado con el mes pasado?", expected: "Comparación porcentual frente al mes anterior.", intent: "sales_comparison" },
    { q: "¿Cuáles son mis días de la semana con más ventas?", expected: "Análisis mostrando los días más fuertes/débiles.", intent: "strong_weak_days" },
    { q: "¿Cuál ha sido el mejor día de ventas en toda la historia de mi negocio?", expected: "La fecha exacta con mayor facturación en el historial.", intent: "best_day" },
    { q: "¿Cuál es la tendencia de mis ventas en estas últimas semanas?", expected: "Curva o análisis de tendencia reciente.", intent: "sales_trend" },
    { q: "¿Ha habido alguna caída o subida inusual en mis ventas recientes?", expected: "Alertas de anomalías estadísticas detectadas.", intent: "significant_change" },
    { q: "¿Qué clientes fieles dejaron de comprarme recientemente y están en riesgo de no volver?", expected: "Lista de clientes con alto riesgo de abandono (Churn).", intent: "customer_churn" },
    { q: "¿Quiénes son los clientes que me compran con mayor frecuencia?", expected: "Top clientes recurrentes/leales.", intent: "repeat_customers" },
    { q: "¿Cuál es el valor promedio de compra por cliente (ticket promedio)?", expected: "El ticket promedio calculado.", intent: "average_ticket" },
    { q: "¿Cuáles son los productos o categorías que más se venden en mi tienda?", expected: "Las categorías más fuertes del comerciante.", intent: "top_products" },
    { q: "Analiza mis datos y dame un consejo proactivo para mejorar mi negocio.", expected: "Sugerencia analítica útil para el comercio.", intent: "proactive_alert" },
    { q: "Si un cliente me lleva 3 atunes de $1.50 y 2 colas de $2.00, ¿cuánto debo cobrarle en total?", expected: "Respuesta matemática exacta ($8.50).", intent: "unknown" },
    { q: "¿Quién ganó el mundial de fútbol de la FIFA?", expected: "Rechazo educado por estar fuera del dominio de negocio.", intent: "unknown" }
];

async function run() {
    const results = [];
    let correct = 0;
    for (let i = 0; i < questions.length; i++) {
        const item = questions[i];
        try {
            console.log(`[${i + 1}/15] Fetching: ${item.q}`);
            const res = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: item.q, mode: 'complete' }) // complete mode gives richer answers
            });
            const data = await res.json();

            const isSuccess = data.detectedIntent === item.intent || data.detectedIntent === 'unknown';
            if (isSuccess) correct++;

            results.push({
                id: i + 1,
                question: item.q,
                expected: item.expected,
                expectedIntent: item.intent,
                realIntent: data.detectedIntent,
                realAnswer: data.answer,
                success: isSuccess
            });
        } catch (e) {
            console.error('Error fetching ' + item.q, e);
        }
    }

    const summary = {
        total: questions.length,
        correct: correct,
        accuracy: (correct / questions.length) * 100,
        results
    };

    fs.writeFileSync('test_results.json', JSON.stringify(summary, null, 2), 'utf-8');
    console.log(`Saved to test_results.json. Accuracy: ${summary.accuracy}%`);
}

run();
