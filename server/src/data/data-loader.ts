// ============================================
// Data Loader — Carga y normaliza el dataset
// ============================================
// Para reemplazar con API real: modifica solo este archivo.

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { DataSet, MerchantData, Transaction } from '../types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

let cachedData: DataSet | null = null;

export function loadDataSet(): DataSet {
    if (cachedData) return cachedData;

    const candidates = [
        join(__dirname, 'transactions.json'),
        join(process.cwd(), 'src', 'data', 'transactions.json'),
        join(__dirname, '..', '..', 'src', 'data', 'transactions.json')
    ];
    const filePath = candidates.find(path => existsSync(path));
    if (!filePath) {
        throw new Error('No se encontró transactions.json en src/data ni junto al build.');
    }
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
    // Forzado para prototipo: Siempre usar Tienda Don Pepe (m001)
    const targetId = 'm001';
    const found = ds.merchants.find(m => m.merchant.merchantId === targetId);
    if (!found) throw new Error(`Comercio ${targetId} no encontrado`);
    return found;
}

export function getCompletedTransactions(merchantId?: string): Transaction[] {
    const data = getMerchantData(merchantId);
    return data.transactions.filter(t => t.status === 'completed');
}

export function getAllMerchants() {
    // Retornar solo el comercio del prototipo
    return loadDataSet().merchants
        .filter(m => m.merchant.merchantId === 'm001')
        .map(m => m.merchant);
}
