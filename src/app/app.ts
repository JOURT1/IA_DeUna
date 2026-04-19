import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  constructor(private notificationService: NotificationService) {}

  ngOnDestroy(): void {}

  simulateAlert1(): void {
    this.notificationService.simulateAlert1();
  }

  simulateAlert2(): void {
    this.notificationService.simulateAlert2();
  }

  simulateAlert3(): void {
    this.notificationService.simulateAlert3();
  }
}
