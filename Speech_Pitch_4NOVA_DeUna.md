<style>
  @page { margin: 2.5cm; size: A4 portrait; }
  body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 13.5px; line-height: 1.6; color: #222; }
  h1 { font-size: 26px; color: #eb0029; border-bottom: 2px solid #eb0029; padding-bottom: 5px; }
  h2 { font-size: 18px; color: #2c3e50; margin-top: 20px; border-bottom: 1px solid #ddd; padding-bottom: 3px; }
  h3 { font-size: 15px; color: #e67e22; margin-top: 15px;}
  .highlight { background-color: #f1c40f; padding: 2px 4px; border-radius: 3px; font-weight: bold; }
  .box { background-color: #f8f9fa; border-left: 4px solid #3498db; padding: 10px; margin: 10px 0; font-style: italic; }
</style>

# Speech Oficial del Pitch (5 Minutos) — Hackathon DeUna
**Equipo 4NOVA:** Martina Damina, Jhoel Suarez, Juan Pereira y Justin Gomezcoello

---

## 1. Problema Claro y Necesidad (00:00 - 00:45)
**[Diapositiva en pantalla: Problema vs Necesidad]**
*"Hola a todos, somos el equipo 4NOVA.* 
*Para empezar, hay que entender algo clave: una necesidad es el deseo fundamental, pero un problema es la barrera específica que impide satisfacer esa necesidad.* 

*El micro-comerciante en Ecuador, como Don Pepe, tiene una necesidad obvia: hacer crecer sus ventas. Pero su problema real es que, aunque tiene toda su data transaccional en DeUna, los dashboards y PDFs tradicionales asumen una alfabetización financiera que él **no tiene**. Son abrumadores. Esa fricción es el verdadero problema, y el resultado es que hoy toma decisiones a ciegas basadas en la intuición."*

---

## 2. Insight del Usuario y el "Wow Moment" (00:45 - 01:30)
**[Diapositiva en pantalla: Proto-Persona y Value Proposition Canvas]**
*"Cuando analizamos nuestro Proto-Persona, vimos que el trabajo diario de Don Pepe es netamente operativo. Sus dolores (pains) vienen de la soledad administrativa y la falta de claridad: '¿estoy ganando o estoy perdiendo?'.* 

*Entendimos que no basta con que un software funcione. Teníamos que crear un **Minimum Lovable Product (MLP)**. Algo que resuelva su core pain, sea estúpidamente intuitivo y le genere valor desde el segundo cero.*
*Por eso creamos **Mi Contador de Bolsillo**: Un asistente conversacional que no requiere entrenamiento, que habla el lenguaje real del tendero ecuatoriano y que transforma la app de DeUna en su asesor financiero 24/7."*

---

## 3. Solución y Demo Rápida (01:30 - 03:00)
**[Demo en Vivo / Interfaz del Chat]**
*(Aquí uno del equipo muestra el celular o la pantalla haciendo la demo en vivo).*

*"¿Cómo cumple esto los criterios de naturalidad y robustez ante errores? Mírenlo en acción.*
*Si Don Pepe escribe a la rápida, con faltas de ortografía graves: 'Qué onda mijo, caunto bendi aller', cualquier sistema clásico de reglas fallaría. Pero nuestro asistente tiene un entendimiento semántico profundo. Repara la intención, sabe que 'aller' es una fecha, se conecta a los datos transaccionales, y ¡bum! En menos de un segundo le dice: '¡Hola Don Pepe! Ayer, 17 de abril, lograste ventas por $211.79...'* 

*Le entregamos el dato exacto, pero orquestado con una empatía brutal. Además le lanza **alertas proactivas**, avisándole por ejemplo si sus clientes Top dejaron de venir. Es información 100% accionable y digerida."*

---

## 4. Por Qué Funciona: Lógica, Métricas y Calidad Técnica (03:00 - 04:15)
**[Diapositiva en pantalla: Solución Ganadora (Deseable + Viable + Factible) & Arquitectura]**
*"Nuestra solución es ganadora porque es Deseable, Viable y Factible.*

*Hablando de **Factibilidad y Calidad Técnica**: ¿Por qué nuestro bot NO alucina? En Inteligencia Artificial, si dejas que un LLM (un modelo de lenguaje verbal) haga matemáticas de ventas, va a fallar un porcentaje inaceptable del tiempo. Perderíamos la confianza del comerciante al darle sumas equivocadas. Para solventarlo, hemos creado una arquitectura **Determinístico-First**: Desarrollamos un motor interno local y stateless en Node.js que filtra los datos y hace las sumas precisas con 100% de fiabilidad en milisegundos. El LLM **SOLO** está ahí para el procesamiento del lenguaje natural (NLP) y reformatear el mensaje a español neutro. Separamos la matemática de la lingüística.*

*¿Y por qué es **Viable como negocio**? Evaluamos múltiples gigantes como Claude-Haiko o Llama-3, pero nos fuimos por **GPT-4o-mini** mediante API. ¿Por qué? Porque para esta arquitectura nos otorga latencias bajísimas de 700 ms y un costo ínfimo de **$0.0001** por consulta, asegurando escalabilidad masiva sin reventar los costos de AWS de DeUna. Sumado a nuestro Caché de Intenciones interno, es una solución brillante económicamente hablando."*

---

## 5. Cierre: Impacto para DeUna y Potencial (04:15 - 05:00)
**[Diapositiva en pantalla: El futuro de DeUna]**
*"Logramos una tasa del **100% de precisión en base a las 15 pruebas de estrés** evaluadas por el reto de DeUna. Nuestro modelo no inventa datos, mitiga casos especiales y rechaza inputs groseros de lógica de negocio.*

*El potencial de implementación de esto es real. Al ser una arquitectura API-First, DeUna no solo lo puede clavar en la app de inmediato, sino que maána este contador puede vivir directamente dentro del WhatsApp del comerciante.*

*Hoy, DeUna no es sólo la app con la que cobran. Hoy, le devolvemos el poder a sus datos. Hoy, DeUna se convierte en su socio de confianza para crecer y retener su negocio.*

*Somos el equipo 4NOVA. Muchas gracias."*
