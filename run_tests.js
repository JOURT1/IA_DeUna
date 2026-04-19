const http = require('http');

const questions = [
    "¿Cuánto vendí hoy?",
    "¿Cuánto vendí el 17 de abril?",
    "¿Cuánto vendí esta semana?",
    "¿Cuánto vendí este mes?",
    "¿Cómo voy comparado con el mes pasado?",
    "¿Cuál fue mi mejor día de ventas?",
    "¿Qué clientes no han vuelto?",
    "¿Quiénes son mis clientes más frecuentes?",
    "¿Cuál es mi ticket promedio?",
    "¿Qué días de la semana vendo más?",
    "¿Cómo va la tendencia de mis ventas?",
    "¿Qué es lo que más vendo?",
    "¿Cómo pagan mis clientes?",
    "Dame un consejo para mi negocio",
    "caunto bendi aller"
];

function makeRequest(message) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({ message, mode: 'complete', merchantId: 'm001' });
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/chat',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        const req = http.request(options, res => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve({ error: "Parsing JSON failed", raw: data });
                }
            });
        });

        req.on('error', e => resolve({ error: e.message }));
        req.write(payload);
        req.end();
    });
}

async function runTests() {
    console.log("Iniciando pruebas...\n");
    const results = [];

    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        console.log(`[Test ${i + 1}/15] Pregunta: "${q}"`);
        const res = await makeRequest(q);

        if (res.error || !res.answer) {
            console.error(`  -> ERROR O RESPUESTA INESPERADA:`, res);
        } else {
            console.log(`  -> Intent: ${res.detectedIntent} (Confianza: ${res.confidence})`);
            console.log(`  -> Respuesta: ${res.answer.substring(0, 100)}...`);
            results.push({
                num: i + 1,
                question: q,
                intent: res.detectedIntent,
                answer: res.answer
            });
        }
        // Pequeña pausa para no saturar
        await new Promise(r => setTimeout(r, 1500));
    }

    const fs = require('fs');
    fs.writeFileSync('test_results.json', JSON.stringify(results, null, 2));
    console.log("\nPruebas finalizadas. Resultados guardados en test_results.json");
}

runTests();
