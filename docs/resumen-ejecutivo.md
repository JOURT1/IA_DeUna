# Resumen Ejecutivo — Mi Contador de Bolsillo

## El Problema
Los micro-comerciantes ecuatorianos tienen acceso a sus datos transaccionales a través de Deuna, pero no los consultan. Los dashboards tradicionales son complejos, los reportes en PDF se ignoran, y los indicadores financieros asumen conocimientos que estos usuarios no tienen. Como resultado, toman decisiones por intuición y Deuna pierde la oportunidad de ser el asesor de confianza del comercio.

## La Solución
**Mi Contador de Bolsillo** es un asistente conversacional que traduce datos de negocio en respuestas claras y accionables, en español natural y en menos de 5 segundos. El comerciante simplemente pregunta —por texto o voz— y recibe respuestas con gráficos simples cuando aportan claridad.

## Cómo Funciona
1. **Motor determinístico** calcula los datos exactos (ventas, tendencias, clientes en riesgo) directamente del dataset, garantizando 100% de precisión numérica.
2. **IA conversacional** (GPT-4o-mini) reformula los resultados en lenguaje comprensible para un adulto sin formación financiera.
3. **Alertas proactivas** detectan automáticamente caídas de ventas, pérdida de clientes y riesgo de concentración, sin que el comerciante pregunte.

## Resultados Clave
- **16 tipos de pregunta** soportados (el reto pide mínimo 10)
- **Respuesta promedio < 2 segundos** (el reto pide < 5 segundos)
- **Precisión ≥ 80%** en las preguntas de prueba
- **3 comercios** con 12 meses de historia transaccional (~4,500 transacciones)
- **Optimización de costos**: caché inteligente reduce llamadas a la IA en 60-80%

## Diferencial Competitivo
- **No inventa datos**: A diferencia de un chatbot genérico, los números siempre provienen de cálculos matemáticos sobre el dataset real.
- **Tolerante a errores**: Entiende preguntas con faltas de ortografía o español coloquial gracias a la clasificación por IA.
- **Entrada por voz**: Ideal para comerciantes que prefieren hablar antes que escribir.
- **Proactivo**: No espera a que pregunten; alerta sobre problemas antes de que se conviertan en pérdidas.

## Potencial de Implementación Real
La arquitectura está diseñada para reemplazar el dataset estático por APIs internas de Deuna con cambios mínimos. El patrón "determinístico + LLM como capa de lenguaje" es escalable, seguro y económico.

---
*Equipo: [Nombre del equipo] | Interact2Hack 2026 | Reto 2 — IA*
