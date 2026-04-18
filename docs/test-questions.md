# Preguntas de Validación — Mi Contador de Bolsillo

## Instrucciones
Ejecutar cada pregunta en el chat y verificar que la respuesta sea coherente con el dataset.
Marcar Pass/Fail según los criterios al final del documento.

## Tabla de 15 Preguntas de Prueba

| # | Pregunta | Intent Esperado | Respuesta Esperada | Respuesta Obtenida | ¿Gráfico? | Resultado |
|---|----------|-----------------|--------------------|--------------------|-----------|-----------|
| 1 | ¿Cuánto vendí esta semana? | `sales_this_week` | Monto total de ventas de los últimos 7 días con # de transacciones | | Bar | [ ] Pass |
| 2 | ¿Cuánto vendí este mes? | `sales_this_month` | Monto total del mes en curso con # de transacciones | | Bar | [ ] Pass |
| 3 | ¿Cómo voy vs el mes pasado? | `sales_comparison` | Comparación porcentual mes actual vs anterior | | Bar | [ ] Pass |
| 4 | ¿Cuál fue mi mejor día? | `best_day` | Fecha y monto del día con más ventas | | — | [ ] Pass |
| 5 | ¿Cuál fue mi peor día? | `worst_day` | Fecha y monto del día con menos ventas | | — | [ ] Pass |
| 6 | ¿Cuál es mi ticket promedio? | `average_ticket` | Valor promedio por transacción en $ | | — | [ ] Pass |
| 7 | ¿Qué clientes no han vuelto? | `customer_churn` | Lista de clientes sin compras en 30+ días | | Table | [ ] Pass |
| 8 | ¿Quién compra más seguido? | `repeat_customers` | Lista de clientes por frecuencia de compra | | Table | [ ] Pass |
| 9 | ¿Qué días son más fuertes? | `strong_weak_days` | Ranking de días de la semana por monto | | Bar | [ ] Pass |
| 10 | ¿Cómo va la tendencia? | `sales_trend` | Tendencia de ventas últimas 2 semanas | | Bar | [ ] Pass |
| 11 | ¿Hubo alguna caída? | `significant_change` | Detección de cambio significativo reciente | | Bar | [ ] Pass |
| 12 | ¿Qué es lo que más vendo? | `top_products` | Ranking de productos/categorías por monto | | Pie | [ ] Pass |
| 13 | ¿Cómo pagan mis clientes? | `payment_methods` | Distribución porcentual por método de pago | | Pie | [ ] Pass |
| 14 | Dame un consejo | `proactive_alert` | Alerta(s) proactiva(s) basadas en datos | | — | [ ] Pass |
| 15 | Hola | `greeting` | Saludo con nombre del comercio y opciones | | — | [ ] Pass |

## Preguntas Adicionales (Edge Cases)

| # | Pregunta | Intent Esperado | Respuesta Esperada | Respuesta Obtenida | Resultado |
|---|----------|-----------------|--------------------|--------------------|-----------|
| 16 | ¿Qué puedo preguntarte? | `help` | Lista de capacidades del asistente | | [ ] Pass |
| 17 | ¿Cuánto vendí la última semana? | `sales_this_week` | Misma respuesta que #1 | | [ ] Pass |
| 18 | ¿Cuáles son mis clientes frecuentes? | `repeat_customers` | Misma respuesta que #8 | | [ ] Pass |

## Criterios de Calificación

- **Pass**: Respuesta coherente, intent correcto, datos no inventados, comprensible sin explicación
- **Fail**: Intent incorrecto, datos inventados, error de servidor, o respuesta confusa

## Verificaciones Adicionales

- [ ] Alerta proactiva aparece al cargar la app
- [ ] Toggle simple/completo cambia la extensión de la respuesta
- [ ] Selector de comercio cambia los datos (3 comercios disponibles)
- [ ] Chips de preguntas sugeridas funcionan
- [ ] Tiempo de respuesta < 5 segundos en todos los casos
- [ ] Interfaz responsive en móvil
- [ ] Entrada por voz funciona (botón micrófono)
- [ ] El asistente no inventa datos que no existen en el dataset
