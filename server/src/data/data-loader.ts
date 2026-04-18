// ============================================
// Data Loader — Carga y normaliza el dataset
// ============================================
// Para reemplazar con API real: modifica solo este archivo.

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { DataSet, MerchantData, Transaction } from '../types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

let cachedData: DataSet | null = null;

export function loadDataSet(): DataSet {
    if (cachedData) return cachedData;

    const filePath = join(__dirname, 'transactions.json');
    const raw = readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);

    // Normalización: acepta formato { merchants: [...] } o array directo
    if (Array.isArray(parsed)) {
        cachedData = { merchants: parsed };
    } else if (parsed.merchants) {
        cachedData = parsed as DataSet;
    } else {
        // Formato de un solo comercio
        cachedData = { merchants: [parsed as MerchantData] };
    }

    return cachedData;
}

export function getMerchantData(merchantId?: string): MerchantData {
    const ds = loadDataSet();
    if (!merchantId) return ds.merchants[0];
    const found = ds.merchants.find(m => m.merchant.merchantId === merchantId);
    if (!found) throw new Error(`Comercio ${merchantId} no encontrado`);
    return found;
}

export function getCompletedTransactions(merchantId?: string): Transaction[] {
    const data = getMerchantData(merchantId);
    return data.transactions.filter(t => t.status === 'completed');
}

export function getAllMerchants() {
    return loadDataSet().merchants.map(m => m.merchant);
}
