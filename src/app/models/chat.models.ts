// ============================================
// Modelos compartidos del frontend
// ============================================

export interface ChatMessage {
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    visualization?: Visualization | null;
    proactiveInsight?: ProactiveInsight | null;
    suggestedFollowUps?: string[];
    createdInProMode?: boolean;
}

export interface Visualization {
    type: 'bar' | 'line' | 'pie' | 'table';
    title: string;
    data: any;
}

export interface ProactiveInsight {
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'success';
}

export interface ChatResponse {
    answer: string;
    mode: 'simple' | 'complete';
    detectedIntent: string;
    confidence: number;
    metricsUsed: string[];
    suggestedFollowUps: string[];
    visualization: Visualization | null;
    proactiveInsight: ProactiveInsight | null;
}

export interface Merchant {
    merchantId: string;
    merchantName: string;
    category: string;
    city: string;
}

export interface SampleQuestion {
    question: string;
    intent: string;
}
