// ============================================
// NoOp Provider — Sin LLM, usa templates directos
// ============================================

import type { LLMProvider } from './llm-adapter.js';

export class NoopProvider implements LLMProvider {
    name = 'noop';

    async reformulate(analyticsLabel: string, context: {
        intent: string;
        mode: 'simple' | 'complete';
        merchantName: string;
    }): Promise<string> {
        // En modo simple, devuelve el label directo
        if (context.mode === 'simple') {
            return analyticsLabel;
        }

        // En modo completo, añade contexto
        const prefix = `📊 ${context.merchantName}:\n\n`;
        const suffix = '\n\n💡 Si necesitas más detalle, pregúntame con confianza.';
        return prefix + analyticsLabel + suffix;
    }

    async classifyIntent(_message: string, _intents: any[]): Promise<string> {
        return 'unknown';
    }
}
