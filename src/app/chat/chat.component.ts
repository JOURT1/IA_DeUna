import { Component, ElementRef, OnDestroy, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService } from './chat.service';
import { SpeechService } from './speech.service';
import type { ChatMessage, Merchant, ProactiveInsight, SampleQuestion } from '../models/chat.models';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {
    @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;
    @Output() closeChat = new EventEmitter<void>();

    messages: ChatMessage[] = [];
    currentMessage = '';
    isTyping = false;
    isListening = false;
    speechSupported = false;
    mode: 'simple' | 'complete' = 'simple';

    merchants: Merchant[] = [];
    selectedMerchantId = '';
    sampleQuestions: SampleQuestion[] = [];
    proactiveAlert: ProactiveInsight | null = null;

    recordingSeconds = 0;
    private timerInterval: any;
    isBotSpeaking = false;

    private speechSub?: Subscription;

    constructor(
        private chatService: ChatService,
        private speechService: SpeechService,
        private router: Router
    ) { }

    async ngOnInit(): Promise<void> {
        this.speechSupported = this.speechService.isSupported;

        // Cargar datos iniciales
        try {
            const [merchants, questions] = await Promise.all([
                this.chatService.getMerchants(),
                this.chatService.getSampleQuestions()
            ]);
            this.merchants = merchants;
            this.sampleQuestions = questions;
            if (merchants.length > 0) {
                this.selectedMerchantId = merchants[0].merchantId;
            }
            await this.loadProactiveAlert();
        } catch {
            console.error('Error cargando datos iniciales. ¿Está el backend corriendo?');
        }

        // Mensaje de bienvenida
        const merchantName = this.merchants.find(m => m.merchantId === this.selectedMerchantId)?.merchantName ?? 'tu negocio';
        this.messages.push({
            text: `¡Hola! 👋 Soy tu Contador de Bolsillo para ${merchantName}. Pregúntame sobre tus ventas, clientes o tendencias. ¡Estoy aquí para ayudarte!`,
            sender: 'bot',
            timestamp: new Date()
        });

        // Suscripción a voz
        this.speechSub = this.speechService.events$.subscribe(event => {
            switch (event.type) {
                case 'result':
                    if (event.text) this.currentMessage = event.text;
                    break;
                case 'start':
                    this.isListening = true;
                    this.startTimer();
                    break;
                case 'end':
                    this.isListening = false;
                    this.stopTimer();
                    // Quitamos el auto-send para que el usuario pueda ver el texto primero
                    break;
                case 'error':
                    this.isListening = false;
                    break;
            }
        });
    }

    ngOnDestroy(): void {
        this.speechSub?.unsubscribe();
        this.speechService.stop();
    }

    async loadProactiveAlert(): Promise<void> {
        try {
            const res = await this.chatService.getProactiveAlert(this.selectedMerchantId);
            this.proactiveAlert = res.alert;
        } catch { /* silencioso */ }
    }

    async onMerchantChange(): Promise<void> {
        this.messages = [];
        const merchantName = this.merchants.find(m => m.merchantId === this.selectedMerchantId)?.merchantName ?? 'tu negocio';
        this.messages.push({
            text: `Cambiaste a ${merchantName}. ¿Qué quieres saber?`,
            sender: 'bot',
            timestamp: new Date()
        });
        await this.loadProactiveAlert();
    }

    async sendMessage(overrideText?: string): Promise<void> {
        const text = (overrideText ?? this.currentMessage).trim();
        if (!text) return;

        this.messages.push({ text, sender: 'user', timestamp: new Date() });
        this.currentMessage = '';
        this.scrollToBottom();

        this.isTyping = true;
        this.scrollToBottom();

        try {
            const response = await this.chatService.sendMessage(text, this.mode, this.selectedMerchantId);
            this.isTyping = false;

            this.messages.push({
                text: response.answer,
                sender: 'bot',
                timestamp: new Date(),
                visualization: response.visualization,
                suggestedFollowUps: response.suggestedFollowUps
            });
            this.scrollToBottom();
        } catch {
            this.isTyping = false;
            this.messages.push({
                text: 'Lo siento, ocurrió un error. ¿Está el servidor corriendo? (npm run dev)',
                sender: 'bot',
                timestamp: new Date()
            });
            this.scrollToBottom();
        }
    }

    askSuggested(question: string): void {
        this.sendMessage(question);
    }

    dismissAlert(): void {
        this.proactiveAlert = null;
    }

    toggleMode(): void {
        this.mode = this.mode === 'simple' ? 'complete' : 'simple';
    }

    toggleVoice(): void {
        this.speechService.toggle();
    }

    formatTime(date: Date): string {
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }

    getSeverityIcon(severity: string): string {
        switch (severity) {
            case 'warning': return '⚠️';
            case 'success': return '✅';
            default: return 'ℹ️';
        }
    }

    getBarHeight(values: number[], index: number): number {
        const max = Math.max(...values, 1);
        return Math.max(5, (values[index] / max) * 100);
    }

    formatBarLabel(label: string): string {
        if (label.length <= 6) return label;
        // Format dates or truncate long labels
        if (label.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return label.slice(5); // MM-DD
        }
        return label.slice(0, 6);
    }

    private pieColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e', '#06b6d4', '#f97316'];
    getPieColor(index: number): string {
        return this.pieColors[index % this.pieColors.length];
    }

    private startTimer(): void {
        this.recordingSeconds = 0;
        this.timerInterval = setInterval(() => {
            this.recordingSeconds++;
        }, 1000);
    }

    private stopTimer(): void {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    formatDuration(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    private scrollToBottom(): void {
        setTimeout(() => {
            if (this.messagesContainer) {
                const el = this.messagesContainer.nativeElement;
                el.scrollTop = el.scrollHeight;
            }
        }, 50);
    }

    onBackClick() {
        this.closeChat.emit();
        this.router.navigate(['/']);
    }
}
