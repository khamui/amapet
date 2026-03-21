import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { NotificationsComponent } from '../notifications/notifications.component';
import { MenuModule } from 'primeng/menu';
import { ModerationStore } from 'src/app/stores/moderation.store';
import { SocialLoginDialogComponent } from 'src/app/components/social-login-dialog/social-login-dialog.component';
import { UiStateService } from 'src/app/services/ui-state.service';
import { ThemeSwitcherComponent } from 'src/app/components/theme-switcher/theme-switcher.component';

@Component({
  selector: 'ama-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  standalone: true,
  imports: [ToolbarModule, ButtonModule, NotificationsComponent, MenuModule, SocialLoginDialogComponent, ThemeSwitcherComponent],
})
export class TopbarComponent {
  public router = inject(Router);
  public as = inject(AuthService);
  private ms = inject(MessageService);
  private moderationStore = inject(ModerationStore);
  public uiState = inject(UiStateService);

  public showLoginDialog = signal(false);
  public hasPermLevel = signal(false);
  public userMenuItems = signal<MenuItem[]>([]);

  // Computed signal that directly references auth service's isLoggedIn
  public isLoggedIn = computed(() => this.as.isLoggedIn());

  // Burger menu icon toggles based on drawer state
  public burgerIcon = computed(() =>
    this.uiState.mobileDrawerOpen() ? 'pi pi-times' : 'pi pi-list'
  );

  constructor() {
    // React to login state changes
    effect(async () => {
      const loggedIn = this.as.isLoggedIn();
      if (loggedIn) {
        this.hasPermLevel.set(this.as.getPermLevel());
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
    const items: MenuItem[] = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => {
          this.router.navigate(['profile']);
        },
      },
    ];

    this.userMenuItems.set(items);
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

  public handleOpenLoginDialog() {
    this.showLoginDialog.set(true);
  }

  public handleToggleMobileDrawer() {
    this.uiState.toggleMobileDrawer();
  }
}
