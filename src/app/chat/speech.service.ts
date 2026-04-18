import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

export interface SpeechEvent {
    type: 'result' | 'error' | 'start' | 'end';
    text?: string;
    error?: string;
}

@Injectable({
    providedIn: 'root'
})
export class SpeechService {
    private recognition: any = null;
    private isListening = false;

    events$ = new Subject<SpeechEvent>();

    constructor(private ngZone: NgZone) {
        this.initRecognition();
    }

    private initRecognition(): void {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.warn('Web Speech API no soportada en este navegador');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'es-EC';
        this.recognition.continuous = false;
        this.recognition.interimResults = true; // Volver a habilitar para que vea el texto mientras habla

        this.recognition.onresult = (event: any) => {
            this.ngZone.run(() => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                this.events$.next({
                    type: 'result',
                    text: finalTranscript || interimTranscript
                });
            });
        };

        this.recognition.onerror = (event: any) => {
            console.error('Speech Recognition Error:', event.error);
            this.ngZone.run(() => {
                this.isListening = false;
                this.events$.next({ type: 'error', error: event.error });
            });
        };

        this.recognition.onstart = () => {
            this.ngZone.run(() => {
                this.isListening = true;
                this.events$.next({ type: 'start' });
            });
        };

        this.recognition.onend = () => {
            this.ngZone.run(() => {
                this.isListening = false;
                this.events$.next({ type: 'end' });
            });
        };
    }

    get isSupported(): boolean {
        return this.recognition !== null;
    }

    get listening(): boolean {
        return this.isListening;
    }

    start(): void {
        if (!this.recognition) return;

        try {
            this.recognition.start();
            // No seteamos isListening aquí, esperamos al evento onstart
        } catch (e: any) {
            if (e.name === 'InvalidStateError') {
                console.warn('El reconocimiento ya estaba iniciado, ignorando...');
            } else {
                console.error('Error al iniciar voz:', e);
                this.ngZone.run(() => {
                    this.isListening = false;
                    this.events$.next({ type: 'error', error: e.message });
                });
            }
        }
    }

    stop(): void {
        if (!this.recognition) return;

        try {
            this.recognition.stop();
            // isListening se reseteará en onend
        } catch (e) {
            console.error('Error al detener voz:', e);
        }
    }

    toggle(): void {
        if (!this.recognition) return;

        if (this.isListening) {
            this.stop();
        } else {
            this.start();
        }
    }
}
