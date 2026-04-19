import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'DeUna API is running' });
});

// API chat endpoint (placeholder)
app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    res.json({
        response: 'Respuesta de prueba: ' + message,
        timestamp: new Date().toISOString()
    });
});

// API sample questions
app.get('/api/sample-questions', (req, res) => {
    res.json({
        questions: [
            '¿Cuál fue mi gasto más alto?',
            '¿Cuánto gasté este mes?',
            '¿En qué categoría gasto más?'
        ]
    });
});

// Fallback para health check en raíz
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'DeUna API ready' });
});

export default app;

