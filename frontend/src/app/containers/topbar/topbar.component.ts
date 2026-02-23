import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { NotificationsComponent } from '../notifications/notifications.component';
import { MenuModule } from 'primeng/menu';
import { ModerationStore } from 'src/app/stores/moderation.store';

@Component({
  selector: 'ama-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  standalone: true,
  imports: [ToolbarModule, ButtonModule, NotificationsComponent, MenuModule],
})
export class TopbarComponent implements OnInit {
  public router = inject(Router);
  public as = inject(AuthService);
  private ms = inject(MessageService);
  private moderationStore = inject(ModerationStore);

  public isLoggedIn = false;
  public hasPermLevel = false;

  public userMenuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.as.watchLoggedIn.subscribe(async (value: boolean) => {
      this.isLoggedIn = value;
      if (value) {
        this.hasPermLevel = this.as.getPermLevel();
        this.ms.add({
          severity: 'success',
          summary: 'Logged in!',
          detail: 'You have been successfully logged in.',
        });

        await this.moderationStore.initStore();
        this.createUserMenu();
      }
    });
  }

  private createUserMenu() {
    this.userMenuItems = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => {
          this.router.navigate(['profile']);
        },
      },
    ];

    if (this.moderationStore.getModeratedCircleIds().length > 0) {
      this.userMenuItems.push({
        label: 'Moderation',
        icon: 'pi pi-shield',
        command: () => {
          this.router.navigate(['moderation']);
        },
      });
    }
  }

  public handleNavigateHome() {
    this.router.navigate(['explore']);
  }

  public async handleLogout() {
    await this.as.logout();
    this.ms.add({
      severity: 'success',
      summary: 'Logged out!',
      detail: 'You have been successfully logged out.',
    });
  }
}
