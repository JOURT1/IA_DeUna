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
        this.recognition.lang = 'es-ES';
        this.recognition.continuous = false;
        this.recognition.interimResults = true;

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
        if (this.recognition && !this.isListening) {
            try {
                this.recognition.start();
            } catch (e) {
                console.error('Error starting speech recognition:', e);
            }
        }
    }

    stop(): void {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    toggle(): void {
        if (this.isListening) {
            this.stop();
        } else {
            this.start();
        }
    }
}
