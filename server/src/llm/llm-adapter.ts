// ============================================
// LLM Adapter — Interfaz desacoplada de proveedor
// ============================================

export interface LLMProvider {
    name: string;
    reformulate(analyticsLabel: string, context: {
        intent: string;
        mode: 'simple' | 'complete';
        merchantName: string;
        metricsUsed: string[];
    }): Promise<string>;
    classifyIntent(message: string, intents: { intent: string; description: string }[]): Promise<string>;
    handleGeneralQuery(message: string, merchantName: string): Promise<string>;
}

let currentProvider: LLMProvider | null = null;

export function setLLMProvider(provider: LLMProvider): void {
    currentProvider = provider;
}

export function getLLMProvider(): LLMProvider {
    if (!currentProvider) throw new Error('LLM provider no configurado');
    return currentProvider;
}
