# Arquitectura Técnica — Mi Contador de Bolsillo

## 1. Visión General

Mi Contador de Bolsillo es un asistente conversacional que responde preguntas de negocio sobre un dataset sintético de transacciones, diseñado para micro-comerciantes ecuatorianos sin formación financiera.

## 2. Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| **Frontend** | Angular 20 (Standalone) | Framework robusto, compilación AOT, componentes standalone sin módulos |
| **Backend** | Node.js + Express + TypeScript | Tipado estricto, ecosistema maduro, rápido de prototipar |
| **LLM** | OpenAI GPT-4o-mini | Balance óptimo costo/calidad para reformulación en español |
| **Voz** | Web Speech API (es-EC) | Gratis, nativo del navegador, sin dependencias externas |
| **Dataset** | JSON estático en memoria | Sub-ms de lectura, sin infrastructure de BD para el prototipo |

## 3. Arquitectura del Sistema

```
┌──────────────────────────────────────────────────────┐
│                    FRONTEND (Angular)                 │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Chat UI    │  │ Speech (Voz) │  │ Viz (Charts) │ │
│  └──────┬─────┘  └──────┬───────┘  └──────────────┘ │
│         │               │                            │
│         └───────┬───────┘                            │
│                 │ HTTP POST /api/chat                 │
└─────────────────┼────────────────────────────────────┘
                  │
┌─────────────────┼────────────────────────────────────┐
│                 ▼      BACKEND (Node.js/Express)     │
│  ┌─────────────────────────────────────────────────┐ │
│  │              Intent Router                       │ │
│  │  1. Regex patterns (confianza 0.95)             │ │
│  │  2. Keyword matching (confianza 0.5-0.85)       │ │
│  │  3. LLM Classification fallback (si <0.5)       │ │
│  └──────────────────┬──────────────────────────────┘ │
│                     │                                │
│  ┌──────────────────▼──────────────────────────────┐ │
│  │         Analytics Engine (Determinístico)        │ │
│  │  12 funciones: ventas, tendencia, churn,         │ │
│  │  ticket promedio, productos top, etc.            │ │
│  │  → Calcula sobre dataset en memoria              │ │
│  │  → Resultado: {value, label, metricsUsed, viz}   │ │
│  └──────────────────┬──────────────────────────────┘ │
│                     │                                │
│  ┌──────────────────▼──────────────────────────────┐ │
│  │         LLM Adapter (Reformulación)              │ │
│  │  ┌─────────┐ ┌────────────┐ ┌───────────┐      │ │
│  │  │  Cache   │ │  OpenAI    │ │   NoOp    │      │ │
│  │  │ (ahorro) │ │ GPT-4o-mini│ │ (sin LLM) │      │ │
│  │  └─────────┘ └────────────┘ └───────────┘      │ │
│  └─────────────────────────────────────────────────┘ │
│                                                      │
│  ┌─────────────────────────────────────────────────┐ │
│  │         Proactive Alerts Engine                  │ │
│  │  Detecta: caídas de ventas, churn, concentración │ │
│  └─────────────────────────────────────────────────┘ │
│                                                      │
│  ┌─────────────────────────────────────────────────┐ │
│  │         Dataset (JSON en memoria)                │ │
│  │  3 comercios × ~1500 txns × 12 meses           │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

## 4. Flujo de una Consulta

1. El usuario escribe o dicta una pregunta (ej: "¿Cuánto vendí esta semana?")
2. El frontend envía `POST /api/chat` con `{message, mode, merchantId}`
3. El **Intent Router** clasifica la intención:
   - Primero intenta Regex (gratis, <1ms)
   - Si la confianza es baja y hay LLM, usa OpenAI para clasificar
4. El **Analytics Engine** ejecuta la función matemática correspondiente
5. El resultado se pasa al **LLM Adapter** para reformulación natural
   - Se revisa la **caché** primero (ahorro de tokens)
6. Se devuelve la respuesta con texto, visualización y follow-ups
7. El frontend muestra la respuesta con gráficos CSS si aplica

## 5. Decisiones de Diseño Clave

### Determinístico First (No alucinaciones)
Los datos NUNCA se envían al LLM. El motor analítico calcula los números exactos usando matemáticas sobre el dataset. El LLM solo recibe el resultado pre-calculado para reformularlo en lenguaje natural. **Esto garantiza 100% de precisión en los datos.**

### Optimización de Costos
- **Caché de intenciones:** Si un mensaje ya fue clasificado por el LLM, se guarda. Preguntas idénticas no generan costo.
- **Caché de reformulaciones:** Si los datos no cambian, la respuesta natural se reutiliza.
- **Regex/Keywords primero:** 80%+ de las preguntas se resuelven sin llamar al LLM.

### Privacidad
El dataset completo nunca sale del servidor. Solo se envían etiquetas resumidas al LLM (ej: "Ventas de la semana: $150, 12 transacciones").

## 6. Endpoints API

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/chat` | Procesar pregunta del usuario |
| GET | `/api/proactive-alert` | Obtener alerta proactiva |
| GET | `/api/sample-questions` | Preguntas sugeridas |
| GET | `/api/merchants` | Lista de comercios disponibles |
| GET | `/api/health` | Estado del servidor |

## 7. Intents Soportados (16 total)

| Intent | Ejemplo | Visualización |
|--------|---------|--------------|
| `sales_this_week` | "¿Cuánto vendí esta semana?" | Barras |
| `sales_this_month` | "¿Cuánto vendí este mes?" | Barras |
| `sales_comparison` | "¿Cómo voy vs el mes pasado?" | Barras |
| `best_day` | "¿Cuál fue mi mejor día?" | — |
| `worst_day` | "¿Cuál fue mi peor día?" | — |
| `average_ticket` | "¿Cuál es mi ticket promedio?" | — |
| `customer_churn` | "¿Qué clientes no han vuelto?" | Tabla |
| `repeat_customers` | "¿Quién compra más seguido?" | Tabla |
| `strong_weak_days` | "¿Qué días son más fuertes?" | Barras |
| `sales_trend` | "¿Cómo va la tendencia?" | Barras |
| `significant_change` | "¿Hubo alguna caída?" | Barras |
| `top_products` | "¿Qué es lo más vendido?" | Pie |
| `payment_methods` | "¿Cómo pagan mis clientes?" | Pie |
| `proactive_alert` | "Dame un consejo" | — |
| `greeting` | "Hola" | — |
| `help` | "¿Qué puedo preguntarte?" | — |
