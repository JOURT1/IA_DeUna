import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatComponent } from '../chat/chat.component';
import { NotificationService, Notification } from '../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule, ChatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  balanceVisible = false;
  chatOpen = false;
  inputMessage = '';
  advancedMode = false;

  // Notificaciones
  notification: Notification | null = null;
  private notificationSub?: Subscription;

  // Posición del ícono flotante
  iconX = 270;
  iconY = 560;

  private dragging = false;
  private offsetX = 0;
  private offsetY = 0;
  private moved = false;

  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.notificationSub = this.notificationService.notification$.subscribe(notif => {
      this.notification = notif;
    });
  }

  ngOnDestroy(): void {
    this.notificationSub?.unsubscribe();
  }

  closeNotification(): void {
    this.notificationService.closeNotification();
  }

  toggleBalance() {
    this.balanceVisible = !this.balanceVisible;
  }

  openChat() {
    if (!this.moved) {
      this.chatOpen = true;
    }
  }

  closeChat() {
    this.chatOpen = false;
  }

  startDrag(event: MouseEvent) {
    this.dragging = true;
    this.moved = false;
    this.offsetX = event.clientX - this.iconX;
    this.offsetY = event.clientY - this.iconY;
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.dragging) return;
    this.moved = true;
    this.iconX = this.clampX(event.clientX - this.offsetX);
    this.iconY = this.clampY(event.clientY - this.offsetY);
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.dragging = false;
  }

  startDragTouch(event: TouchEvent) {
    this.dragging = true;
    this.moved = false;
    const touch = event.touches[0];
    this.offsetX = touch.clientX - this.iconX;
    this.offsetY = touch.clientY - this.iconY;
    event.preventDefault();
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (!this.dragging) return;
    this.moved = true;
    const touch = event.touches[0];
    this.iconX = this.clampX(touch.clientX - this.offsetX);
    this.iconY = this.clampY(touch.clientY - this.offsetY);
  }

  @HostListener('document:touchend')
  onTouchEnd() {
    this.dragging = false;
  }

  private clampX(x: number): number {
    const min = 10;
    const max = window.innerWidth - 60;
    return Math.max(min, Math.min(max, x));
  }

  private clampY(y: number): number {
    const min = 10;
    const max = window.innerHeight - 60;
    return Math.max(min, Math.min(max, y));
  }
}
