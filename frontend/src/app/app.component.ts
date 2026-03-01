import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { DrawerModule } from 'primeng/drawer';
import { CircleBoxComponent } from './containers/circle-box/circle-box.component';
import { TopbarComponent } from './containers/topbar/topbar.component';
import { SoonAvailableComponent } from './containers/soon-available/soon-available.component';
import { SettingsService } from './services/settings.service';
import { UiStateService } from './services/ui-state.service';
import { NgClass } from '@angular/common';
import { CircleBoxModerationComponent } from './containers/circle-box-moderation/circle-box-moderation.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    ToastModule,
    DrawerModule,
    CircleBoxComponent,
    CircleBoxModerationComponent,
    TopbarComponent,
    SoonAvailableComponent,
    MessageModule,
    NgClass,
  ],
})
export class AppComponent implements OnInit {
  public router = inject(Router);
  private as = inject(AuthService);
  public ses = inject(SettingsService);
  public uiState = inject(UiStateService);

  // Computed signal that directly references auth service's isLoggedIn
  public isLoggedIn = computed(() => this.as.isLoggedIn());

  public isInModerationView = signal(false);
  public isInCircleView = signal(false);
  public isFullScreenRoute = signal(false);

  async ngOnInit() {
    this.as.subscribeLogin();

    await this.ses.init();

    this.setCircleBox();

    // listen to url changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setCircleBox();
        this.uiState.closeMobileDrawer();
      });
  }

  private setCircleBox = () => {
    const url = this.router.url;
    const knownRoutes = [
      '/explore',
      '/c/',
      '/profile',
      '/moderation',
      '/moderate/',
      '/global-settings',
    ];
    const isKnownRoute = knownRoutes.some(
      (route) => url === route || url.startsWith(route)
    );
    this.isFullScreenRoute.set(!isKnownRoute);

    if (url.startsWith('/moderation') || url.startsWith('/moderate')) {
      this.isInCircleView.set(false);
      this.isInModerationView.set(true);
    } else {
      this.isInModerationView.set(false);
      this.isInCircleView.set(true);
    }
  };
}
