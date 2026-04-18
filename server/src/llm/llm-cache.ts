// ============================================
// LLM Cache — Optimización de costos y velocidad
// ============================================

export class LLMCache {
    private static intentCache = new Map<string, string>();
    private static reformulationCache = new Map<string, string>();

    // --- Intent Caching ---
    static getIntent(message: string): string | null {
        const key = message.toLowerCase().trim();
        return this.intentCache.get(key) || null;
    }

    static setIntent(message: string, intent: string): void {
        const key = message.toLowerCase().trim();
        // Solo cacheamos si no es unknown
        if (intent !== 'unknown') {
            this.intentCache.set(key, intent);
        }
    }

    // --- Reformulation Caching ---
    // La llave incluye el label analítico (que contiene los números)
    // para que si el dato cambia, la IA vuelva a procesarlo.
    static getReformulation(label: string, mode: string, merchantId: string): string | null {
        const key = `${merchantId}:${mode}:${label}`;
        return this.reformulationCache.get(key) || null;
    }

    static setReformulation(label: string, mode: string, merchantId: string, answer: string): void {
        const key = `${merchantId}:${mode}:${label}`;
        this.reformulationCache.set(key, answer);
    }

    // Método para limpiar (opcional)
    static clear(): void {
        this.intentCache.clear();
        this.reformulationCache.clear();
    }
}
