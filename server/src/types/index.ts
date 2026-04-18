// ============================================
// Tipos compartidos del backend
// ============================================

export interface Merchant {
    merchantId: string;
    merchantName: string;
    category: string;
    city: string;
}

export interface Transaction {
    transactionId: string;
    date: string;
    amount: number;
    status: 'completed' | 'pending' | 'cancelled';
    customerId: string;
    customerName: string;
    paymentMethod: 'deuna';
    product: string | null;
    category: string;
    channel: 'presencial' | 'online' | 'delivery';
    quantity: number;
    description: string | null;
}

export interface MerchantData {
    merchant: Merchant;
    transactions: Transaction[];
}

export interface DataSet {
    merchants: MerchantData[];
}

export interface Visualization {
    type: 'bar' | 'line' | 'pie' | 'table';
    title: string;
    data: unknown;
}

export interface ProactiveInsight {
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'success';
}

export interface ChatRequest {
    message: string;
    mode?: 'simple' | 'complete';
    merchantId?: string;
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

export interface IntentMatch {
    intent: string;
    confidence: number;
    params: Record<string, string>;
}

export interface AnalyticsResult {
    value: unknown;
    label: string;
    metricsUsed: string[];
    visualization: Visualization | null;
}
