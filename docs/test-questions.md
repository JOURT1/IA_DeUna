# Preguntas de Validación - Mi Contador de Bolsillo

## Contexto

Estas pruebas validan el asistente contra `server/src/data/transactions.json`, usando el comercio forzado del prototipo.

| Campo | Valor |
|---|---|
| Comercio | Tienda Don Pepe (`m001`) |
| Giro | abarrotes |
| Ciudad | Quito |
| Periodo histórico del dataset | 2024-01-01 a 2026-04-19 |
| Transacciones completadas | 2,827 |
| Ventas históricas | $118,048.67 |
| Modo principal | `complete` / Pro |

## Fechas Relativas

La lógica de "hoy", "ayer", "esta semana" y "este mes" se calcula dinámicamente con la fecha real de Ecuador. En la corrida documentada en `test_results.json`:

| Expresión | Valor de esta corrida |
|---|---|
| hoy | 2026-04-19 |
| ayer | 2026-04-18 |
| esta semana | 2026-04-13 a 2026-04-19 |
| este mes | abril de 2026 |

Si se ejecuta en otra fecha, estos valores cambian automáticamente.

## 15 Preguntas Principales de Negocio

| Evidencia | Escenario | Pregunta | Fecha / periodo interpretado | Intent esperado / real | Dato esperado | Output real | Visual real | Ok |
|---|---|---|---|---|---|---|---|---|
| E-01 | Ventas diarias | ¿Cuánto he vendido el día de hoy? | "hoy" = 19/04/2026. Se calcula con la fecha real de Ecuador al momento de preguntar. | `sales_today` / `sales_today` | 19/04/2026; $206.03; 5 transacciones | Hoy, en Tienda Don Pepe, lograste ventas por un total de $206.03, distribuidas en 5 transacciones. Esto significa que cada cliente que compró contribuyó a tu negocio, lo cual es un buen indicador de actividad. Sigue así y considera estrategias para aumentar tanto el número de transacciones como el monto total de ventas. ¡Buen trabajo! 💪📈 | Barra | Sí |
| E-02 | Ventas por fecha | ¿Cuánto vendí ayer? | "ayer" = 18/04/2026. Se calcula restando un día a "hoy". | `sales_specific_date` / `sales_specific_date` | 18/04/2026; $70.91; 2 transacciones | El sábado 18 de abril, en Tienda Don Pepe, tuviste ventas por un total de $70.91, realizando 2 transacciones en el día. Esto significa que cada transacción generó un promedio de $35.46. ¡Sigue así y busca maneras de atraer más clientes para aumentar tus ventas! 📈 | Barra | Sí |
| E-03 | Ventas semanales | ¿Cuánto vendí esta semana? | "esta semana" = 2026-04-13 a 2026-04-19. Semana calculada de lunes a domingo según fecha real. | `sales_this_week` / `sales_this_week` | Semana 13/04/2026-19/04/2026; $1,332.61; 30 transacciones | Esta semana, en Tienda Don Pepe, lograste vender un total de $1,332.61 a través de 30 transacciones. 🎉 Esto muestra que tus esfuerzos están dando frutos y que hay un buen flujo de clientes. Te animo a seguir promoviendo tus productos y a mantener la atención en la satisfacción del cliente para seguir mejorando estas cifras. ¡Sigue así! 💪 | Barra | Sí |
| E-04 | Ventas mensuales | ¿Cuál es el total de mis ventas de este mes? | "este mes" = abril de 2026. Mes actual calculado desde fecha real. | `sales_this_month` / `sales_this_month` | abril de 2026; $3,356.19; 78 transacciones | Este mes, en Tienda Don Pepe, lograste ventas por un total de $3,356.19 a través de 78 transacciones. Esto significa que cada venta promedio fue de aproximadamente $43. Asegúrate de seguir ofreciendo un excelente servicio al cliente para mantener y aumentar estas cifras. ¡Sigue así! 🎉 | Barra | Sí |
| E-05 | Ventas anuales | ¿Cuánto generé en todo el año 2025? | Año explícito 2025. No depende de "hoy". | `sales_specific_year` / `sales_specific_year` | Año 2025; $51,305.18; 1224 transacciones | En el año 2025, tu negocio, Tienda Don Pepe, logró un excelente desempeño al alcanzar un total de $51,305.18 en ventas. Esto se traduce en 1,224 transacciones, lo que demuestra un buen flujo de clientes y una sólida actividad comercial. ¡Sigue así y mantén el impulso! 💪📈 | Línea | Sí |
| E-06 | Comparación | ¿Cómo voy en ventas comparado con el mes pasado? | Compara abril de 2026 contra el mes anterior. Periodos calculados desde fecha real. | `sales_comparison` / `sales_comparison` | Mes actual $3,356.19 vs mes anterior $4,167.53; variación -19.5% | Este mes, en Tienda Don Pepe, has generado un total de $3,356.19 en ventas, lo que representa una disminución de $811.34 en comparación con los $4,167.53 que lograste el mes pasado. Esto equivale a una caída del 19.5% en tus ventas. <br><br>Te animo a analizar qué estrategias puedes implementar para mejorar tus resultados el próximo mes. ¡Siempre hay oportunidades para crecer! 📈 | Barra | Sí |
| E-07 | Tendencia | ¿Cuál es la tendencia de mis ventas en estas últimas semanas? | Últimos 14 días hasta 19/04/2026. Ventana móvil, no fija. | `sales_trend` / `sales_trend` | Promedio diario pasa de $152.43 a $183.55; 20.4% | ¡Hola! Estoy emocionado de compartirte que en la Tienda Don Pepe, tus ventas están en una tendencia positiva. El promedio de ventas diarias ha aumentado, pasando de $152.43 a $183.55, lo que representa un crecimiento del 20.4%. 🎉 Esto es una señal muy alentadora de que tus esfuerzos están dando resultados. ¡Sigue así! | Línea | Sí |
| E-08 | Alerta de cambio | ¿Ha habido alguna caída o subida inusual en mis ventas recientes? | Cambio reciente sobre los últimos 14 días hasta 19/04/2026. | `significant_change` / `significant_change` | Cambio reciente de 20.4% | ¡Excelente noticia para Tienda Don Pepe! 🎉 Tus ventas han aumentado un 20.4% en comparación con el periodo anterior. Esto significa que tu promedio diario de ventas ha crecido de $152.43 a $183.55. Este incremento es un indicador positivo de que tu negocio está atrayendo a más clientes, así que sigue trabajando en estrategias que mantengan este impulso. ¡Sigue así! 🚀 | Línea | Sí |
| E-09 | Mejor día | ¿Cuál ha sido el mejor día de ventas en toda la historia de mi negocio? | Histórico completo del dataset: 2024-01-01 a 2026-04-19. | `best_day` / `best_day` | 17/12/2024; $507.88 | El martes 17 de diciembre fue un día destacado para Tienda Don Pepe, ya que lograste alcanzar un total de ventas de $507.88. Este resultado indica que tus esfuerzos de ventas y atención al cliente están dando frutos, así que considera replicar las estrategias exitosas de ese día en el futuro. ¡Sigue así! 🎉 | Sin gráfica | Sí |
| E-10 | Días fuertes/flojos | ¿Cuáles son mis días de la semana con más ventas? | Histórico completo agrupado por día de semana: 2024-01-01 a 2026-04-19. | `strong_weak_days` / `strong_weak_days` | Mejor día martes $44.52; día más flojo domingo $37.46 | Para Tienda Don Pepe, tu día más fuerte de ventas es el martes, donde logras un promedio de $44.52. En cambio, el domingo se presenta como el día más flojo, con un promedio de $37.46. Esto sugiere que podrías enfocarte en estrategias para incrementar las ventas durante el fin de semana y, quizás, aprovechar el buen rendimiento del martes para lanzar promociones especiales. 📈✨ | Barra | Sí |
| E-11 | Retención | ¿Qué clientes fieles dejaron de comprarme recientemente y están en riesgo de no volver? | Riesgo de churn calculado contra los últimos 30 días desde 19/04/2026. | `customer_churn` / `customer_churn` | 0 clientes frecuentes en riesgo | ¡Felicidades, Tienda Don Pepe! Todos tus clientes habituales han realizado compras recientemente, lo que es una excelente señal de que están satisfechos con tus productos y servicios. Esto significa que has logrado mantener su interés y fidelidad. Sigue ofreciendo una experiencia excepcional para que continúen regresando. ¡Sigue así! 🎉 | Sin gráfica | Sí |
| E-12 | Clientes frecuentes | ¿Quiénes son los clientes que me compran con mayor frecuencia? | Histórico completo de clientes: 2024-01-01 a 2026-04-19. | `repeat_customers` / `repeat_customers` | Carlos Mendoza; 316 visitas; $13,093.86 | Tu negocio, Tienda Don Pepe, cuenta con 10 clientes frecuentes que visitan regularmente. Entre ellos, Carlos Mendoza se destaca como el cliente más activo, realizando un total de 316 visitas y acumulando compras por un valor de $13,093.86. Es importante mantener una buena relación con estos clientes, ya que su lealtad puede contribuir significativamente a tus ingresos. ¡Considera ofrecer promociones especiales para seguir incentivando sus visitas! 😊 | Tabla | Sí |
| E-13 | Ticket promedio | ¿Cuál es mi ticket promedio? | Histórico completo de transacciones completadas: 2024-01-01 a 2026-04-19. | `average_ticket` / `average_ticket` | $41.76 sobre transacciones completadas | Para Tienda Don Pepe, tu ticket promedio por venta es de $41.76. Este valor se ha calculado a partir de un total de 2,827 ventas. Esto significa que, en promedio, cada cliente gasta un poco más de 41 dólares en tu tienda. Puedes considerar estrategias para aumentar este monto, como ofrecer promociones o combos que motiven a los clientes a comprar más. 💡 | Sin gráfica | Sí |
| E-14 | Categorías top | ¿Cuáles son los productos o categorías que más se venden en mi tienda? | Histórico completo por categoría: 2024-01-01 a 2026-04-19. | `top_products` / `top_products` | bebidas $15,630.04; snacks $15,536.31; aceites $15,286.26 | ¡Hola! Para Tienda Don Pepe, la categoría que más destaca es "bebidas", que ha generado ventas de $15,630.04. Justo detrás, se encuentran los "snacks" con $15,536.31 y los "aceites" con $15,286.26. Esto indica que tus clientes tienen una preferencia clara por las bebidas, así que podrías considerar promocionarlas aún más o ampliar la variedad. ¡Sigue así! 🍹📈 | Pastel | Sí |
| E-15 | Consejo proactivo | Analiza mis datos y dame un consejo proactivo para mejorar mi negocio. | Recomendación proactiva basada en tendencia reciente hasta 19/04/2026 y días fuertes/flojos. | `proactive_alert` / `proactive_alert` | Usa tendencia reciente (20.4%) y días fuerte/flojo (martes/domingo) | 📈 ¡Ventas en subida!<br>Tus ventas subieron un 20.4% recientemente. ¡Buen trabajo! Aprovecha el impulso para fidelizar a tus nuevos clientes.<br><br>📅 Dato útil sobre tus ventas<br>Tu día más fuerte es martes y el más flojo es domingo. Podrías hacer promociones los domingo para equilibrar tus ventas. | Sin gráfica | Sí |

## Anexos de Barreras y Modos

| Evidencia | Escenario | Pregunta | Fecha / periodo interpretado | Intent esperado / real | Dato esperado | Output real | Visual real | Ok |
|---|---|---|---|---|---|---|---|---|
| EA-01 | Error ortográfico | caunto bendi aller | "aller" se interpreta como "ayer" = 18/04/2026. Valida tolerancia ortográfica. | `sales_specific_date` / `sales_specific_date` | Debe entender "aller" como ayer: 18/04/2026; $70.91; 2 transacciones | El sábado 18 de abril, en Tienda Don Pepe, tuviste ventas por un total de $70.91, realizando 2 transacciones en el día. Esto significa que cada transacción generó un promedio de $35.46. ¡Sigue así y busca maneras de atraer más clientes para aumentar tus ventas! 📈 | Barra | Sí |
| EA-02 | Ayuda | ¿Qué puedo preguntarte? | No aplica fecha. Valida menú de ayuda. | `help` / `help` | Debe listar capacidades del asistente. | Puedo responder preguntas como:<br><br>• ¿Cómo voy comparado con el mes pasado?<br>• ¿Qué clientes están en riesgo de no volver?<br>• ¿Cuál es la tendencia de mis ventas?<br>• ¿Quiénes son mis mejores clientes?<br>• Dame un consejo sobre mi negocio<br>• ¿Cuánto vendí en todo el 2025?<br>• ¿Cuál fue mi mejor día de ventas?<br>• ¿Cuál es mi ticket promedio?<br>• ¿Qué es lo que más vendo?<br>• ¿Cuáles son mis días más fuertes?<br>• ¿Cómo pagan mis clientes?<br><br>¡Pregúntame lo que quieras! 😊 | Sin gráfica | Sí |
| EA-03 | Saludo | Hola | No aplica fecha. Valida saludo con contexto del comercio. | `greeting` / `greeting` | Debe saludar y mencionar Tienda Don Pepe. | ¡Hola! 👋 Soy tu contador de bolsillo para Tienda Don Pepe. Puedo ayudarte con información sobre tus ventas, clientes y tendencias. ¿Qué quieres saber? | Sin gráfica | Sí |
| EA-04 | Cálculo práctico | Si un cliente me lleva 3 atunes de $1.50 y 2 colas de $2.00, ¿cuánto debo cobrarle en total? | No aplica dataset. Valida cálculo práctico de caja. | `unknown` / `unknown` | Debe resolver $8.50 sin consultar el dataset. | Para calcular el total, multiplica el precio de los atunes y colas por la cantidad: <br><br>3 atunes a $1.50 son $4.50 y 2 colas a $2.00 son $4.00. <br><br>Sumando ambos, el total es $4.50 + $4.00 = $8.50. ¡Debes cobrarle $8.50! | Sin gráfica | Sí |
| EA-05 | Fuera de dominio | ¿Quién ganó el mundial de fútbol de la FIFA? | No aplica fecha. Valida límite de dominio. | `unknown` / `unknown` | Debe rechazar cordialmente por estar fuera del negocio. | ¡Hola! Lamentablemente, no puedo ayudarte con eso. Mi rol es asistirte con datos de ventas y la salud de "Tienda Don Pepe". ¿Hay algo relacionado con tu negocio en lo que pueda ayudarte? | Sin gráfica | Sí |
| EA-06 | Modo Simple | ¿Cuánto vendí esta semana? | "esta semana" = 2026-04-13 a 2026-04-19. Misma pregunta que E-03, pero en modo Simple. | `sales_this_week` / `sales_this_week` | Debe responder breve: $1,332.61 y 30 transacciones. | Esta semana, en Tienda Don Pepe, realizaste ventas por un total de $1332.61 en 30 transacciones. ¡Buen trabajo! 🛍️ | Barra | Sí |
| EA-07 | Método de pago | ¿Cómo pagan mis clientes? | Histórico completo de métodos de pago: 2024-01-01 a 2026-04-19. | `payment_methods` / `payment_methods` | Dataset m001 contiene deuna: $118,048.67; 2827 transacciones. | En Tienda Don Pepe, el método de pago más popular entre tus clientes es "deuna", que ha generado un total de $118,048.67 a través de 2,827 ventas. Esto indica que tus clientes prefieren utilizar este método, por lo que podrías considerar promocionarlo aún más o asegurarte de que sea una opción destacada en tu tienda. 🎉💳 | Pastel | Sí |

## Ejecución

1. Levantar el backend.
2. Ejecutar `node run_tests.js` desde la raíz del proyecto.
3. Revisar `test_results.json`.
4. Regenerar `Set_Pruebas_15_Preguntas_4NOVA_DeUna.pdf`.
5. Pegar capturas `E-01` a `E-15` y `EA-01` a `EA-07` en la columna de evidencia.

## Criterios de aprobación

- Intent correcto.
- Números correctos respecto al dataset y a la fecha real de Ecuador.
- Visualización esperada cuando aplica.
- Respuesta clara para una persona sin formación financiera.
- No inventa datos ante escenarios sin alerta.
