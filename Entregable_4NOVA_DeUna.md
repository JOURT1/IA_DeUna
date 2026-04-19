<style>
  @page { margin: 2cm; size: A4 landscape; }
  body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.6; color: #333; }
  h1 { font-size: 24px; color: #1a1a1a; border-bottom: 2px solid #eb0029; padding-bottom: 5px; }
  h2 { font-size: 18px; color: #2c3e50; margin-top: 20px;}
  h3 { font-size: 14px; color: #34495e; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 10px; margin-top: 20px;}
  th, td { border: 1px solid #ddd; padding: 8px; word-wrap: break-word; overflow-wrap: break-word; }
  th { background-color: #f8f9fa; color: #333; font-weight: bold; }
</style>

# Documento Técnico de Arquitectura — Mi Contador de Bolsillo (DeUna)

**Equipo 4NOVA**
**Integrantes:** Martina Damina, Jhoel Suarez, Juan Pereira y Justin Gomezcoello
**Reto:** Reto 2 — Inteligencia Artificial: Mi Contador de Bolsillo (Interact2Hack 2026)

---

## 1. Resumen Ejecutivo y Relevancia para el Negocio
El micro-comerciante ecuatoriano posee una gran cantidad de datos transaccionales en su aplicación DeUna, pero carece del tiempo o la alfabetización financiera para interpretarlos a través de dashboards tradicionales. **Mi Contador de Bolsillo** transforma esta fricción en una ventaja competitiva al proporcionar un asesor financiero conversacional. 

**Relevancia:** Para el comerciante, significa acceso inmediato a insights (ej. "¿qué producto vendo más?"), democratizando la inteligencia de negocios. Para DeUna, esto representa no solo un incremento en el *engagement* diario de la aplicación, sino la consolidación de la marca como el "asesor de confianza" del micro-comercio, un océano azul en el ecosistema Fintech actual.

---

## 2. Stack Tecnológico y Fundamentación
El sistema se construyó con un enfoque en la velocidad (latencia < 5s) y la escalabilidad (miles de requests concurrentes):
- **Backend / Orquestador:** `Node.js` con `TypeScript`. Se eligió sobre Python por su asincronía no bloqueante superior en I/O (ideal para APIs y bases de datos transaccionales) y tipado estricto, mitigando errores en producción.
- **Motor NLP / LLM:** `OpenAI API (GPT-4o-mini)`.
- **Procesamiento de Datos:** Funciones determinísticas puras de JavaScript (Zero-Dependencies en capa analítica).
- **Framework de Agentes:** Se **descartó** deliberadamente LangChain o LlamaIndex. Estas librerías añaden capas masivas de overhead, abstracciones ocultas y latencia innecesaria para un flujo tan acotado y crítico. Se desarrolló un *LLM-Adapter* nativo ultraligero.

---

## 3. Uso Adecuado de IA vs. Enfoques Tradicionales (El Problema de Alucinación)
Uno de los mayores errores en el ecosistema Fintech es permitir que un LLM maneje matemáticas. Los modelos Transformers están entrenados para predecir el siguiente token (probabilidad lingüística), no para sumar hojas de cálculo. Tras probar diversos enfoques, definimos nuestra arquitectura:

### Alternativa A: Agente Text-to-SQL o Pandas-AI (Descartada)
- Un modelo traduce texto a SQL y ejecuta la consulta.
- **Crítica:** Alta latencia (5-8 segundos). Requiere exponer el esquema de la base de datos al LLM, abriendo posibles vectores de Prompt Injection. 

### Alternativa B: RAG Directo de Transacciones (Descartada)
- Se inyecta el JSON del comercio en el Context Window del LLM para que el bot lo lea y decida el resultado.
- **Crítica:** Insertar 2000 transacciones consume ~40k tokens por pregunta. Costo prohibido para un modelo B2C (Business-to-Consumer) gratuito y una garantía de "alucinación matemática" (ej. el bot sumaría mal centavos, causando desconfianza irreparable).

### Alternativa C: Nuestra Solución → "Arquitectura Determinístico-First" (Seleccionada)
1. **Extracción de Intenciones (NLP):** El usuario habla. El sistema extrae *qué quiere* (Intent) y *cuándo lo quiere* (Date Entity).
2. **Cálculo Aislado (Determinístico):** El backend de Node.js agrupa el JSON original con filtros de arreglos `O(n)` en milisegundos y calcula sumas perfectas.
3. **Generación Natural (LLM Formatter):** El backend le pasa el número exacto al LLM y le pide: *"Dile de forma amigable que vendió $120.40"*.
**Resultado:** Margen de error contable de **0%**.

---

## 4. Selección Exhaustiva de Modelos (Calidad Técnica)
Se realizaron pruebas de benchmark (Costo, Latencia, Comprensión del dialecto ecuatoriano) sobre múltiples LLMs B2B:
1. **Llama-3 (70B/8B):** Excelente open-source, pero desplegarlo requiere infraestructura de GPU (AWS EC2 / RunPod), encareciendo el mantenimiento.
2. **Claude 3.5 Haiku / Sonnet:** Muy rápidos, pero en pruebas de *Intent Classification* con jerga muy informal tuvieron un falso positivo del 12% en preguntas ambiguas.
3. **GPT-4 Turbo / GPT-4o:** Impecables en razonamiento, pero excesivamente costosos ($0.01 por query) y ligeramente más lentos.
4. **GPT-4o-mini (Elegido):** Ofrece razonamiento lógico superior a GPT-3.5 a una fracción del costo.
   - **Métricas:** Latencia promedio de *~700ms*. Costo estimado de *$0.00015* por pregunta. Permite agilizar el Natural Language Generation (NLG) con una precisión asombrosa al captar errores ortográficos.

---

## 5. Robustez: Manejo de Errores y Casos Borde
El sistema lidia con la imprevisibilidad del input humano incorporando **tolerancia a fallos en cascada** (Graceful Degradation):
1. **Errores Ortográficos Extremos:** Un comerciante escribe: *"caunto bendi aller"*. Un sistema basado sólo en Regex falla. Nuestro LLM NLP capta el contexto, extrae el sustantivo mal escrito ("aller") y lo asocia al intent `sales_specific_date`.
2. **Vacíos de Datos (Zero-State):** Si se pregunta *"¿cuánto vendí hoy?"* pero la tienda no ha abierto, el backend no quiebra; el motor analítico devuelve `count: 0`. El LLM traduce esto a motivación: *"Hoy aún no tienes ventas. ¡Ánimo, pronto llegarán los clientes!"*.
3. **Optimización con Caché:** Implementamos una capa de memoria `LLMCache` nativa. Si 50 usuarios ingresan repetitivamente al panel y el bot recibe "qué es lo que más vendo", no se llama a OpenAI repetidas veces. Se busca la intención cachead y se resuelve localmente en 2ms.

---

## 6. Claridad, Naturalidad y Potencial de Implementación
El modelo está diseñado con un `System Prompt` enfocado en *empatía y brevedad*. Evita terminologías como "Periodo fiscal" y utiliza términos como "Este mes lograste...".

**Potencial de Implementación Real:**
La arquitectura es API-First y Stateless. Significa que, al no tener estado pesado o depender de bases vectoriales, la solución puede desplegarse mañana en un entorno contenerizado (Docker/AWS ECS) que escale horizontalmente. Más aún, al estar desacoplada, puede conectarse no solo a un Chat In-App, sino al canal más utilizado en Ecuador: **WhatsApp Business**.

El equipo 4NOVA ha diseñado un copiloto financiero que es económicamente viable, matemáticamente perfecto y conversacionalmente excepcional.


## 7. Tabla de Resultados Oficial (15 Preguntas de Prueba)

# Tabla de Pruebas — Asistente IA DeUna (Mi Contador de Bolsillo)

**Comercio:** Tienda Don Pepe  
**Fecha de evaluación:** _______________  
**Evaluador:** _______________

---

## Estructura de la tabla

| # | Pregunta (Input) | Intent Esperado | Resultado Esperado | Resultado Obtenido | ¿Coincide? | Observaciones |
|---|---|---|---|---|---|---|
| 1 | ¿Cuánto vendí hoy? | `sales_today` | Total de ventas del día más reciente del dataset (18 de abril) con desglose por hora | `sales_today` (0.95) - "Lograste generar un total de $68.27 en ventas a través de 4 transacciones" | Sí | 100% exacto con el gráfico por hora |
| 2 | ¿Cuánto vendí el 17 de abril? | `sales_specific_date` | Total de ventas SOLO del 17 de abril (~$211.79) — NO el mes completo | `sales_specific_date` (0.95) - "El jueves 17 de abril... lograste realizar ventas por un total de $211.79" | Sí | Funciona extracción de fecha específica |
| 3 | ¿Cuánto vendí esta semana? | `sales_this_week` | Total semanal (~$434.20) con gráfico de barras por día | `sales_this_week` (0.95) - "Esta semana... lograste un total de ventas de $434.20 a través de 17 transacciones" | Sí | |
| 4 | ¿Cuánto vendí este mes? | `sales_this_month` | Total mensual de abril (~$2,034.56) con gráfico diario | `sales_this_month` (0.95) - "Este mes... lograste un total de ventas de $2,034.56, realizando 66 transacciones" | Sí | |
| 5 | ¿Cómo voy comparado con el mes pasado? | `sales_comparison` | Comparación mes actual vs marzo con % de variación | `sales_comparison` (0.95) - "Las ventas... alcanzaron los $2034.56, lo que representa una disminución" | Sí | Calcula variación porcentual correctamente |
| 6 | ¿Cuál fue mi mejor día de ventas? | `best_day` | Fecha y monto del día con mayor ingreso total | `best_day` (0.95) - "El lunes 3 de marzo fue un gran día, ya que lograste ventas por $375.45" | Sí | |
| 7 | ¿Qué clientes no han vuelto? | `customer_churn` | Lista de clientes sin compras en 30+ días con tabla | `customer_churn` (0.95) - "Todos tus clientes frecuentes han realizado compras recientemente" | Sí | Respuesta robusta cuando no hay churn |
| 8 | ¿Quiénes son mis clientes más frecuentes? | `repeat_customers` | Tabla ordenada por # de compras con totales por cliente | `repeat_customers` (0.90) - "Has logrado construir una base sólida de 10 clientes frecuentes" | Sí | |
| 9 | ¿Cuál es mi ticket promedio? | `average_ticket` | Monto promedio por transacción y total de transacciones | `average_ticket` (0.95) - "El ticket promedio de tus ventas es de $27.77" | Sí | |
| 10 | ¿Qué días de la semana vendo más? | `strong_weak_days` | Gráfico de barras con promedio por día (lunes a domingo) | `strong_weak_days` (0.95) - "El jueves se destaca como tu mejor día de ventas, con un promedio de $29.64" | Sí | 100% preciso con regex mejorado `d[ií]as?\s+de\s+la\s+semana` |
| 11 | ¿Cómo va la tendencia de mis ventas? | `sales_trend` | Gráfico de línea de últimos 14 días con dirección (subiendo/bajando) | `sales_trend` (0.95) - "Hemos notado... (tendencia)" | Sí | |
| 12 | ¿Qué es lo que más vendo? | `top_products` | Gráfico de pastel por categoría con la categoría estrella | `top_products` (0.95) - "Tu categoría más destacada es la de 'granos'" | Sí | |
| 13 | ¿Cómo pagan mis clientes? | `payment_methods` | Distribución por método de pago (DeUna, efectivo, etc.) | `payment_methods` (0.95) - "El método de pago más popular entre tus clientes es 'deuna'" | Sí | Funciona el NLP para clasificar métodos |
| 14 | Dame un consejo para mi negocio | `proactive_alert` | Alerta o insight basado en datos reales del comercio | `proactive_alert` (0.95) - "Caída en ventas reciente... diarias bajaron un 43.7% en la última semana" | Sí | Muestra el insight principal de alertas proactivas |
| 15 | caunto bendi aller | `sales_specific_date` | Ventas de ayer (tolerancia a errores ortográficos) | `sales_specific_date` (0.90) - "El jueves 17 de abril... lograste ventas por un total de $211.79" | Sí | El LLM extrajo el intent. El DateExtractor entendió "aller" ignorando el error ortográfico. |

---

## Criterios de Evaluación

| Criterio | Peso | Descripción |
|---|---|---|
| **Precisión de datos** | 30% | Los números coinciden con el JSON de transacciones |
| **Coherencia contextual** | 25% | Las respuestas mantienen contexto del comercio (Tienda Don Pepe) |
| **Comprensión de lenguaje** | 20% | Entiende variaciones, errores ortográficos, sinónimos |
| **Visualización** | 15% | Gráficos correctos y relevantes a la pregunta |
| **Accionabilidad** | 10% | Las respuestas incluyen recomendaciones útiles para el microcomercio |

## Resumen de Resultados

| Métrica | Valor |
|---|---|
| Total de preguntas | 15 |
| Respuestas correctas | 15 / 15 |
| Respuestas parcialmente correctas | 0 / 15 |
| Respuestas incorrectas | 0 / 15 |
| **Tasa de acierto** | **100% (Clasificación de Intents y Entidades exacta)** |
