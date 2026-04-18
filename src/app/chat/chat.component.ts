import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatMessage, ChatService } from './chat.service';
import { SpeechService } from './speech.service';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {
    @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;

    messages: ChatMessage[] = [];
    currentMessage = '';
    isTyping = false;
    isListening = false;
    speechSupported = false;

    private speechSub?: Subscription;

    constructor(
        private chatService: ChatService,
        private speechService: SpeechService,
        private router: Router
    ) { }

    goBack(): void {
        this.router.navigate(['/']);
    }

    ngOnInit(): void {
        this.speechSupported = this.speechService.isSupported;

        // Welcome message
        this.messages.push({
            text: '¡Hola! 👋 Soy tu asistente virtual. Puedes escribirme o usar el micrófono para hablar conmigo. ¿En qué puedo ayudarte?',
            sender: 'bot',
            timestamp: new Date()
        });

        // Subscribe to speech events
        this.speechSub = this.speechService.events$.subscribe(event => {
            switch (event.type) {
                case 'result':
                    if (event.text) {
                        this.currentMessage = event.text;
                    }
                    break;
                case 'start':
                    this.isListening = true;
                    break;
                case 'end':
                    this.isListening = false;
                    // Auto-send if there's text after speech ends
                    if (this.currentMessage.trim()) {
                        setTimeout(() => this.sendMessage(), 300);
                    }
                    break;
                case 'error':
                    this.isListening = false;
                    console.error('Speech error:', event.error);
                    break;
            }
        });
    }

    ngOnDestroy(): void {
        this.speechSub?.unsubscribe();
        this.speechService.stop();
    }

    async sendMessage(): Promise<void> {
        const text = this.currentMessage.trim();
        if (!text) return;

        // Add user message
        this.messages.push({
            text,
            sender: 'user',
            timestamp: new Date()
        });

        this.currentMessage = '';
        this.scrollToBottom();

        // Show typing indicator
        this.isTyping = true;
        this.scrollToBottom();

        // Get bot response
        try {
            const response = await this.chatService.getResponse(text);
            this.isTyping = false;

            this.messages.push({
                text: response,
                sender: 'bot',
                timestamp: new Date()
            });

            this.scrollToBottom();
        } catch (error) {
            this.isTyping = false;
            this.messages.push({
                text: 'Lo siento, ocurrió un error. Por favor intenta de nuevo.',
                sender: 'bot',
                timestamp: new Date()
            });
            this.scrollToBottom();
        }
    }

    toggleVoice(): void {
        this.speechService.toggle();
    }

    formatTime(date: Date): string {
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    private scrollToBottom(): void {
        setTimeout(() => {
            if (this.messagesContainer) {
                const el = this.messagesContainer.nativeElement;
                el.scrollTop = el.scrollHeight;
            }
        }, 50);
    }
}
