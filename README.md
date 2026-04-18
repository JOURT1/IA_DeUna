# Mi Contador de Bolsillo 💰

> Agente conversacional para microcomerciantes — Hackathon DeUna 2025

Un asistente de chat que responde preguntas de negocio sobre transacciones en español natural, con visualizaciones y alertas proactivas.

## 🚀 Inicio rápido

```bash
# 1. Instalar dependencias del frontend
npm install

# 2. Instalar dependencias del backend
cd server && npm install && cd ..

# 3. Copiar variables de entorno
cp server/.env.example server/.env

# 4. Levantar frontend + backend
npm run dev
```

Abrir **http://localhost:4200** en el navegador.

## 📐 Arquitectura

```
Usuario → Angular Chat UI → Express API → Analytics Engine → JSON Dataset
                                        → Intent Router (reglas/regex)
                                        → LLM Adapter (opcional, reformula resultados)
                                        → Proactive Alerts Engine
```

**Decisiones clave:**
- **Analítica determinística primero**: cálculos directos del JSON, sin depender del LLM
- **LLM opcional**: reformula respuestas, pero el sistema funciona sin API key
- **No envía dataset al LLM**: solo resultados ya calculados
- **Precarga en memoria**: dataset cargado al iniciar para respuestas < 100ms
- **CSS-based charts**: gráficos sin librerías extra (barras, pie, tablas)

## 📁 Estructura

```
├── src/                       # Frontend Angular 20 (standalone)
│   ├── app/
│   │   ├── chat/              # Componente principal de chat
│   │   └── models/            # Interfaces TypeScript
│   └── environments/          # URL del backend
├── server/                    # Backend Node.js/Express
│   └── src/
│       ├── analytics/         # Motor analítico (12 funciones)
│       ├── intents/           # Catálogo de 16 intents
│       ├── llm/               # Adaptador LLM (noop + OpenAI)
│       ├── alerts/            # Alertas proactivas
│       ├── data/              # Dataset JSON + loader
│       ├── routes/            # Endpoints REST
│       └── types/             # Interfaces compartidas
└── docs/                      # Test de validación
```

## 🔌 Endpoints API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Estado del servidor |
| POST | `/api/chat` | Enviar mensaje y recibir respuesta |
| GET | `/api/proactive-alert` | Alerta proactiva principal |
| GET | `/api/sample-questions` | Preguntas sugeridas |
| GET | `/api/merchants` | Lista de comercios |

## 🤖 Habilitar LLM (opcional)

Editar `server/.env`:
```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-tu-key
LLM_MODEL=gpt-4o-mini
```

Sin LLM, el sistema funciona con templates directos (modo `noop`).

## 📊 Preguntas soportadas

1. ¿Cuánto vendí esta semana/mes?
2. ¿Cómo voy vs el mes pasado?
3. ¿Cuál fue mi mejor/peor día?
4. ¿Cuál es mi ticket promedio?
5. ¿Qué clientes no han vuelto?
6. ¿Quién compra más seguido?
7. ¿Qué días son más fuertes?
8. ¿Cómo va la tendencia?
9. ¿Hubo alguna caída/subida?
10. ¿Qué es lo que más vendo?
11. ¿Cómo pagan mis clientes?
12. Dame un consejo

## 🔄 Reemplazar dataset por API real

Modificar solo `server/src/data/data-loader.ts`:
```typescript
// Cambiar loadDataSet() para hacer fetch a tu API
export async function loadDataSet(): Promise<DataSet> {
  const response = await fetch('https://tu-api.com/transactions');
  return normalizeResponse(await response.json());
}
```

## ⚡ Alertas proactivas

Se generan automáticamente al cargar la app evaluando:
- Caída de ventas > 15% en última semana
- Concentración > 30% en un solo cliente
- Clientes frecuentes que no vuelven en 30+ días
- Sugerencia de promoción en días flojos
