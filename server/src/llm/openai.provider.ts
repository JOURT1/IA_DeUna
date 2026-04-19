// ============================================
// OpenAI Provider — Reformula con lenguaje natural
// ============================================
// IMPORTANTE: Solo recibe resultados ya calculados.
// NUNCA recibe el dataset completo.

import OpenAI from 'openai';
import type { LLMProvider } from './llm-adapter.js';

export class OpenAIProvider implements LLMProvider {
    name = 'openai';
    private client: OpenAI;
    private model: string;

    constructor() {
        this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        this.model = process.env.LLM_MODEL || 'gpt-4o-mini';
    }

    async reformulate(analyticsLabel: string, context: {
        intent: string;
        mode: 'simple' | 'complete';
        merchantName: string;
        metricsUsed: string[];
    }): Promise<string> {
        const systemPrompt = `Eres un asistente financiero amigable para microcomerciantes en Ecuador.
Tu trabajo es reformular datos de negocio en lenguaje natural claro, en español.
REGLAS:
- Nunca inventes datos ni métricas que no te den
- Habla en segunda persona (tú/tu negocio)
- Usa un tono amigable pero profesional
- Si el modo es "simple", sé muy breve (1-2 oraciones)
- Si el modo es "complete", explica un poco más y da contexto
- Usa emojis moderadamente
- No uses jerga financiera compleja
- Prioriza frases accionables`;

        const userPrompt = `Reformula este resultado para ${context.merchantName} (modo: ${context.mode}):

${analyticsLabel}

Intent: ${context.intent}
Métricas usadas: ${context.metricsUsed.join(', ')}`;

        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: context.mode === 'simple' ? 150 : 300,
                temperature: 0.7,
            });

            return response.choices[0]?.message?.content ?? analyticsLabel;
        } catch (error) {
            console.error('Error LLM, usando respuesta directa:', error);
            return analyticsLabel;
        }
    }

    async classifyIntent(message: string, intents: { intent: string; description: string }[]): Promise<string> {
        // Obtener fecha actual de Ecuador (UTC-5)
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const ecDate = new Date(utc - 5 * 60 * 60000);
        const dateCtx = ecDate.toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

        const systemPrompt = `Eres un clasificador de intenciones para un asistente financiero.
Tu tarea es asignar el mensaje del usuario a una de las intenciones disponibles.
CONTEXTO TEMPORAL: Hoy es ${dateCtx} (zona horaria: Ecuador UTC-5). El dataset cubre desde enero 2024 hasta abril 2026.
REGLAS:
- Responde ÚNICAMENTE con el nombre del intent (ej: sales_this_week) o "unknown" si no aplica ninguno.
- Sé tolerante a errores ortográficos (ej: "caunto ved" -> "sales_today").
- Si el usuario saluda, usa "greeting".
- Si pide ayuda, usa "help".
- PRIORIDAD DE FECHAS Y DÍAS:
  - Si menciona "hoy" → usa "sales_today" (NO sales_this_week)
  - Si menciona una fecha específica ("17 de abril", "ayer", "aller") → usa "sales_specific_date"
  - Si pregunta "qué días" o "mejores días" de la semana → usa "strong_weak_days" (NO sales_this_week)
  - Si pide el total de "esta semana" → usa "sales_this_week"
  - Si menciona "este mes" → usa "sales_this_month"
- La clave es distinguir entre consultas de un DÍA ESPECÍFICO vs períodos (semana/mes).`;

        const userPrompt = `Mensaje del usuario: "${message}"

Intenciones disponibles:
${intents.map(i => `- ${i.intent}: ${i.description}`).join('\n')}

Intención detectada:`;

        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: 20,
                temperature: 0,
            });

            const detected = response.choices[0]?.message?.content?.trim().toLowerCase() ?? 'unknown';
            // Validar que el intent devuelto exista
            return intents.some(i => i.intent === detected) ? detected : 'unknown';
        } catch (error) {
            console.error('Error LLM clasificando:', error);
            return 'unknown';
        }
    }

    async handleGeneralQuery(message: string, merchantName: string): Promise<string> {
        const systemPrompt = `Eres el contador de bolsillo (asistente financiero) de "${merchantName}".
REGLAS:
1. Puedes responder amablemente saludos, despedidas o preguntas matemáticas básicas que puedan ser útiles en ventas (ej. sumar "100 + 50", cálculos rápidos).
2. Si el usuario pregunta cosas FUERA del contexto de negocios, tienda, ventas, clientes o herramientas de su tienda (ej. "quién juega hoy fútbol", deportes, historia, política, celebridades, etc.), DEBES rechazar cordialmente la pregunta explicando que tu rol es ayudarte exclusivamente con los datos de ventas y la salud del negocio.
3. Sé breve, amigable y empático (1-2 oraciones).`;

        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                max_tokens: 150,
                temperature: 0.5,
            });
            return response.choices[0]?.message?.content ?? 'No estoy seguro de cómo responder a eso. Intenta preguntarme sobre tus ventas o clientes.';
        } catch (error) {
            console.error('Error LLM general query:', error);
            return 'Ocurrió un problema, intenta preguntarme sobre los datos de tu negocio.';
        }
    }
}
