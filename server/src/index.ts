// ============================================
// Server Entry Point — Express + CORS + dotenv
// ============================================

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { chatRouter } from './routes/chat.routes.js';
import { setLLMProvider } from './llm/llm-adapter.js';
import { NoopProvider } from './llm/noop.provider.js';
import { loadDataSet } from './data/data-loader.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// ─── Middleware ─────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Configurar LLM Provider ──────────────────────────
async function configureLLM(): Promise<void> {
    const provider = process.env.LLM_PROVIDER || 'noop';

    if (provider === 'openai' && process.env.OPENAI_API_KEY) {
        const { OpenAIProvider } = await import('./llm/openai.provider.js');
        setLLMProvider(new OpenAIProvider());
        console.log('✅ LLM: OpenAI configurado');
    } else {
        setLLMProvider(new NoopProvider());
        console.log('ℹ️  LLM: Modo sin IA (respuestas directas)');
    }
}

// ─── Rutas ──────────────────────────────────────────────
app.use('/api', chatRouter);

// ─── Iniciar servidor ──────────────────────────────────
async function start(): Promise<void> {
    // Precargar dataset (mejora tiempo de respuesta)
    const ds = loadDataSet();
    const totalTxns = ds.merchants.reduce((s, m) => s + m.transactions.length, 0);
    console.log(`📦 Dataset cargado: ${ds.merchants.length} comercio(s), ${totalTxns} transacciones`);

    await configureLLM();

    app.listen(PORT, () => {
        console.log(`🚀 Mi Contador de Bolsillo — Backend corriendo en http://localhost:${PORT}`);
        console.log(`   Endpoints:`);
        console.log(`   - GET  /api/health`);
        console.log(`   - POST /api/chat`);
        console.log(`   - GET  /api/proactive-alert`);
        console.log(`   - GET  /api/sample-questions`);
        console.log(`   - GET  /api/merchants`);
    });
}

start().catch(console.error);
