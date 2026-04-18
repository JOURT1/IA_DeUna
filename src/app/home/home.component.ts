import { Component, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnDestroy {
  balanceVisible = false;
  chatOpen = false;
  inputMessage = '';
  advancedMode = false;        // switch: chat avanzado

  // Posición del ícono flotante (esquina inferior derecha por defecto)
  iconX = 270;
  iconY = 560;

  private dragging = false;
  private offsetX = 0;
  private offsetY = 0;
  private moved = false;

  constructor(private router: Router) {}

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

  // ── MOUSE DRAG ──────────────────────────────────────────
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

  // ── TOUCH DRAG ──────────────────────────────────────────
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

  // Mantener el ícono dentro del phone-wrapper (370x760, ícono ~70px)
  private clampX(x: number) {
    return Math.max(0, Math.min(x, 300));
  }
  private clampY(y: number) {
    return Math.max(0, Math.min(y, 690));
  }

  ngOnDestroy() {}
}
