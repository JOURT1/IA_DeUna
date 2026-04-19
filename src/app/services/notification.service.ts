import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
    type: string;
    title: string;
    message: string;
    visible: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    notification$ = new Subject<Notification | null>();
    private notificationTimeout: any;

    showNotification(type: string, title: string, message: string): void {
        // Limpiar timeout anterior
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
        }

        // Emitir notificación
        this.notification$.next({
            type,
            title,
            message,
            visible: true
        });

        // Auto-cerrar después de 10 segundos
        this.notificationTimeout = setTimeout(() => {
            this.closeNotification();
        }, 10000);
    }

    closeNotification(): void {
        this.notification$.next(null);
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
        }
    }

    simulateAlert1(): void {
        this.showNotification('success', 'DeUna', '✅ ¡Bien esta semana! Has tenido más ingresos que la anterior. ¿Deseas revisar cómo mejora a largo plazo?');
    }

    simulateAlert2(): void {
        this.showNotification('warning', 'DeUna', '⚠️ Esta semana tuviste menos ingresos que la anterior. Veamos qué pasó o cómo mejorarlo.');
    }

    simulateAlert3(): void {
        this.showNotification('info', 'DeUna', '💬 Hace 12 horas que no consultas. ¿Veamos o sigues consultando?');
    }
}
