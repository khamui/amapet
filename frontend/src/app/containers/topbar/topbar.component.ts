import { Component, inject, OnInit } from '@angular/core';
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
  public router = inject(Router);
  public as = inject(AuthService);
  private ms = inject(MessageService);

  public isLoggedIn = false;
  public hasPermLevel = false;

  ngOnInit(): void {
    this.as.watchLoggedIn.subscribe((value: boolean) => {
      this.isLoggedIn = value;
      if (value) {
        this.hasPermLevel = this.as.getPermLevel();
        this.ms.add({
          severity: 'success',
          summary: 'Logged in!',
          detail: 'You have been successfully logged in.',
        });
      }
    });
  }

  handleLogout() {
    this.as.logout();
    this.ms.add({
      severity: 'success',
      summary: 'Logged out!',
      detail: 'You have been successfully logged out.',
    });
  }
}
