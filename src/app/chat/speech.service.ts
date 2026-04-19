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
    private retryCount = 0;
    private maxRetries = 2;
    private networkErrorCount = 0;
    private maxNetworkErrors = 2;
    private micDisabled = false;

    events$ = new Subject<SpeechEvent>();

    constructor(private ngZone: NgZone) {
        this.initRecognition();
    }

    private initRecognition(): void {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.error('❌ Web Speech API no soportada en este navegador');
            return;
        }
        
        // Detectar navegador
        const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
        console.log('✅ Web Speech API disponible');
        console.log('   Navegador:', navigator.userAgent);
        console.log('   ¿Es Firefox?:', isFirefox);
        
        if (isFirefox) {
            console.warn('⚠️ Firefox tiene soporte limitado para Web Speech API');
            console.warn('   Se recomienda usar Chrome o Edge para el micrófono');
        }

        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'es-EC';
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
        
        console.log('✅ Recognition creado:', this.recognition);
        console.log('   lang:', this.recognition.lang);
        console.log('   continuous:', this.recognition.continuous);
        console.log('   interimResults:', this.recognition.interimResults);

        this.recognition.onresult = (event: any) => {
            console.log('📝 onresult disparado');
            console.log('   resultIndex:', event.resultIndex);
            console.log('   results.length:', event.results.length);
            console.log('   Evento completo:', event);
            
            this.ngZone.run(() => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    console.log(`   [${i}] isFinal=${event.results[i].isFinal}, confidence=${event.results[i][0].confidence}, transcript="${transcript}"`);
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                const textToSend = finalTranscript || interimTranscript;
                console.log('📨 TEXTO CAPTURADO:', textToSend);
                console.log('   finalTranscript:', finalTranscript);
                console.log('   interimTranscript:', interimTranscript);
                
                this.events$.next({
                    type: 'result',
                    text: textToSend
                });
            });
        };

        this.recognition.onerror = (event: any) => {
            console.error('❌ Speech Recognition Error:', event.error);
            console.log('Error details:', event);
            this.ngZone.run(() => {
                // Si es error de red, contar intentos
                if (event.error === 'network') {
                    this.networkErrorCount++;
                    
                    if (this.networkErrorCount >= this.maxNetworkErrors) {
                        // Deshabilitar micrófono permanentemente
                        this.micDisabled = true;
                        this.isListening = false;
                        console.error('❌ Micrófono deshabilitado: Google Speech API no accesible');
                        this.events$.next({ 
                            type: 'error', 
                            error: '🚫 Micrófono no disponible en tu red. Usa el teclado para escribir.' 
                        });
                        return;
                    }
                    
                    // Reintentar si aún hay oportunidades
                    if (this.retryCount < this.maxRetries) {
                        this.retryCount++;
                        console.log(`Reintentando... (${this.retryCount}/${this.maxRetries})`);
                        setTimeout(() => {
                            try {
                                if (!this.micDisabled) {
                                    this.recognition.start();
                                }
                            } catch (e) {
                                console.error('Error al reintentar:', e);
                            }
                        }, 500);
                        return;
                    }
                }
                
                this.isListening = false;
                this.retryCount = 0;
                
                // Mensajes de error amigables
                let errorMessage = event.error;
                switch(event.error) {
                    case 'network':
                        errorMessage = '🌐 Google Speech API no accesible. Intenta escribir con el teclado.';
                        break;
                    case 'no-speech':
                        errorMessage = '🔇 No detecté voz. Habla más fuerte o más cerca del micrófono.';
                        break;
                    case 'audio-capture':
                        errorMessage = '🎙️ Micrófono no disponible. Verifica los permisos en tu navegador.';
                        break;
                    case 'not-allowed':
                        errorMessage = '🔒 Permiso de micrófono denegado. Actívalo en los permisos del navegador.';
                        break;
                    case 'bad-grammar':
                        errorMessage = '❌ Error en el reconocimiento. Intenta de nuevo.';
                        break;
                    default:
                        errorMessage = `❌ Error de micrófono: ${event.error}`;
                }
                
                this.events$.next({ type: 'error', error: errorMessage });
            });
        };

        this.recognition.onstart = () => {
            console.log('✅ onstart - Grabación iniciada');
            this.ngZone.run(() => {
                this.isListening = true;
                this.retryCount = 0;
                this.events$.next({ type: 'start' });
            });
        };

        this.recognition.onend = () => {
            console.log('⏹️ onend - Grabación terminada');
            this.ngZone.run(() => {
                this.isListening = false;
                this.events$.next({ type: 'end' });
            });
        };
    }

    get isSupported(): boolean {
        // Verificar si el Web Speech API está disponible
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        return !!SpeechRecognition && !!this.recognition && !this.micDisabled;
    }

    get listening(): boolean {
        return this.isListening;
    }

    get disabled(): boolean {
        return this.micDisabled;
    }

    start(): void {
        if (!this.recognition) {
            console.warn('❌ Speech Recognition no soportado');
            return;
        }
        
        // Si ya fue deshabilitado permanentemente, no permitir
        if (this.micDisabled && this.retryCount > 0) {
            console.warn('Micrófono deshabilitado: Google Speech API no accesible');
            this.events$.next({ 
                type: 'error', 
                error: '🚫 Micrófono no disponible. Usa el teclado.' 
            });
            return;
        }

        console.log('▶️ Iniciando reconocimiento de voz...');
        try {
            this.recognition.start();
            console.log('✅ recognition.start() ejecutado');
            // Actualizar estado inmediatamente (el onstart no siempre se dispara)
            this.isListening = true;
            this.ngZone.run(() => {
                this.events$.next({ type: 'start' });
            });
        } catch (e: any) {
            console.error('❌ Exception en start():', e.name, e.message);
            if (e.name === 'InvalidStateError') {
                console.warn('El reconocimiento ya estaba iniciado');
                // Ya estaba escuchando, asegurar que el estado sea correcto
                this.isListening = true;
            } else {
                this.ngZone.run(() => {
                    this.isListening = false;
                    this.events$.next({ type: 'error', error: e.message });
                });
            }
        }
    }

    stop(): void {
        if (!this.recognition) return;

        console.log('⏹️ Deteniendo grabación...');
        try {
            this.recognition.stop();
            // Actualizar estado inmediatamente (el onend no siempre se dispara)
            this.isListening = false;
            this.ngZone.run(() => {
                this.events$.next({ type: 'end' });
            });
        } catch (e) {
            console.error('❌ Error al detener voz:', e);
            this.isListening = false;
        }
    }

    toggle(): void {
        if (!this.recognition) {
            console.error('❌ Speech Recognition no está disponible');
            return;
        }

        console.log('🎤 Toggle llamado. isListening:', this.isListening, 'micDisabled:', this.micDisabled);

        if (this.isListening) {
            console.log('⏹️ Deteniendo grabación...');
            this.stop();
        } else {
            console.log('▶️ Iniciando grabación...');
            this.start();
        }
    }
}
