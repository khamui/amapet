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
import { FooterComponent } from './components/footer/footer.component';
import { CookieBannerComponent } from './components/cookie-banner/cookie-banner.component';
import { SideboxComponent } from './components/sidebox/sidebox.component';
import { SettingsService } from './services/settings.service';
import { UiStateService } from './services/ui-state.service';
import { ThemeService } from './services/theme.service';
import { NgClass } from '@angular/common';
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
    TopbarComponent,
    SoonAvailableComponent,
    MessageModule,
    NgClass,
    FooterComponent,
    CookieBannerComponent,
    SideboxComponent,
  ],
})
export class AppComponent implements OnInit {
  public router = inject(Router);
  private as = inject(AuthService);
  public ses = inject(SettingsService);
  public uiState = inject(UiStateService);
  private themeService = inject(ThemeService);

  // Computed signal that directly references auth service's isLoggedIn
  public isLoggedIn = computed(() => this.as.isLoggedIn());

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
      '/',
      '/explore',
      '/c/',
      '/profile',
      '/moderate/',
      '/global-settings',
    ];
    const isKnownRoute = knownRoutes.some(
      (route) => url === route || url.startsWith(route)
    );
    this.isFullScreenRoute.set(!isKnownRoute);
  };
}
