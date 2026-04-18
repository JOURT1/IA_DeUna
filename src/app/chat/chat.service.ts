// ============================================
// Chat Service — Conecta con el backend API
// ============================================

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { ChatResponse, Merchant, ProactiveInsight, SampleQuestion } from '../models/chat.models';

@Injectable({ providedIn: 'root' })
export class ChatService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    async sendMessage(message: string, mode: 'simple' | 'complete', merchantId?: string): Promise<ChatResponse> {
        return firstValueFrom(
            this.http.post<ChatResponse>(`${this.apiUrl}/chat`, { message, mode, merchantId })
        );
    }

    async getProactiveAlert(merchantId?: string): Promise<{ alert: ProactiveInsight | null }> {
        const params = merchantId ? `?merchantId=${merchantId}` : '';
        return firstValueFrom(
            this.http.get<{ alert: ProactiveInsight | null }>(`${this.apiUrl}/proactive-alert${params}`)
        );
    }

    async getSampleQuestions(): Promise<SampleQuestion[]> {
        const res = await firstValueFrom(
            this.http.get<{ questions: SampleQuestion[] }>(`${this.apiUrl}/sample-questions`)
        );
        return res.questions;
    }

    async getMerchants(): Promise<Merchant[]> {
        const res = await firstValueFrom(
            this.http.get<{ merchants: Merchant[] }>(`${this.apiUrl}/merchants`)
        );
        return res.merchants;
    }
}
