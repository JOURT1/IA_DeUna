import { Injectable } from '@angular/core';

export interface ChatMessage {
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private botResponses: Map<string, string[]> = new Map([
        ['hola', ['¡Hola! ¿En qué puedo ayudarte hoy? 😊', '¡Hey! ¿Qué tal? ¿Cómo puedo asistirte?', '¡Buenas! Estoy aquí para ayudarte.']],
        ['ayuda', ['Claro, puedo ayudarte con información general, responder preguntas o simplemente charlar. ¿Qué necesitas?', 'Estoy aquí para asistirte. Puedes preguntarme lo que quieras.']],
        ['gracias', ['¡De nada! Siempre es un placer ayudar. 😄', '¡No hay de qué! ¿Hay algo más en lo que pueda ayudarte?']],
        ['adiós', ['¡Hasta luego! Que tengas un excelente día. 👋', '¡Nos vemos! No dudes en volver cuando necesites ayuda.']],
        ['cómo estás', ['¡Estoy muy bien, gracias por preguntar! Listo para ayudarte. 🤖', 'Funcionando al 100%. ¿Y tú cómo estás?']],
        ['qué puedes hacer', ['Puedo responder preguntas, charlar contigo y hasta escucharte por voz. ¡Prueba el botón del micrófono! 🎤', 'Soy tu asistente virtual. Puedo chatear por texto o por voz.']],
        ['nombre', ['Me llamo ChatBot Assistant. ¡Encantado de conocerte! 🤩', 'Soy tu asistente virtual, puedes llamarme ChatBot.']],
    ]);

    private defaultResponses: string[] = [
        'Interesante, cuéntame más sobre eso. 🤔',
        'Entiendo. ¿Podrías darme más detalles?',
        'Gracias por compartir eso conmigo. ¿En qué más puedo ayudarte?',
        '¡Vaya! Eso es muy interesante. ¿Qué más quieres saber?',
        'Hmm, déjame pensar... ¿Podrías reformular tu pregunta?',
        'Estoy aprendiendo cada día. ¡Gracias por la conversación! 📚',
        'Esa es una gran pregunta. En el futuro podré conectarme a una IA más avanzada para darte mejores respuestas.',
    ];

    getResponse(userMessage: string): Promise<string> {
        return new Promise((resolve) => {
            const delay = 800 + Math.random() * 1200;

            setTimeout(() => {
                const lowerMessage = userMessage.toLowerCase().trim();
                let response: string | undefined;

                for (const [keyword, responses] of this.botResponses.entries()) {
                    if (lowerMessage.includes(keyword)) {
                        response = responses[Math.floor(Math.random() * responses.length)];
                        break;
                    }
                }

                if (!response) {
                    response = this.defaultResponses[Math.floor(Math.random() * this.defaultResponses.length)];
                }

                resolve(response);
            }, delay);
        });
    }
}
