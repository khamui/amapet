import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'ama-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  standalone: true,
  imports: [ToolbarModule, ButtonModule, NotificationsComponent],
})
export class TopbarComponent implements OnInit {
  isLoggedIn = false;

  constructor(
    public router: Router,
    public as: AuthService,
    private ms: MessageService,
  ) {}

  ngOnInit(): void {
    this.as.watchLoggedIn.subscribe((value: boolean) => {
      this.isLoggedIn = value;
      if (value) {
        this.ms.add({
          severity: 'success',
          summary: 'Logged in!',
          detail: 'You have been successfully logged in.',
        });
      }
    });
  }

  handleLogout() {
    this.ms.add({
      severity: 'success',
      summary: 'Logged out!',
      detail: 'You have been successfully logged out.',
    });
    this.as.logout();
  }
}
