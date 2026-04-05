import { ApplicationConfig, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ConsentService } from './services/consent.service';
import {
  withInterceptorsFromDi,
  withInterceptors,
  provideHttpClient,
} from '@angular/common/http';
import { backendStatusInterceptor } from './interceptors/backend-status.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  GoogleLoginProvider,
  MicrosoftLoginProvider,
  SOCIAL_AUTH_CONFIG,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { provideAnimations } from '@angular/platform-browser/animations';
import { StandardTheme } from '../assets/themes/standard/standard-theme';
import { environment } from '../environments/environment';

const DefaultOptions = {
  darkModeSelector: '.darkmode',
};

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(AppRoutingModule, SocialLoginModule),
    MessageService,
    {
      provide: APP_INITIALIZER,
      useFactory: (auth: AuthService) => () => auth.initFromStoredToken(),
      deps: [AuthService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (consent: ConsentService) => () => consent.init(),
      deps: [ConsentService],
      multi: true,
    },
    {
      provide: SOCIAL_AUTH_CONFIG,
      useValue: {
        autoLogin: false,
        lang: 'de',
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '265914185201-ln0r3huhnfjd1j1j80c5tvi43pf1lhpg.apps.googleusercontent.com',
              { onTapEnabled: false },
            ),
          },
          {
            id: MicrosoftLoginProvider.PROVIDER_ID,
            provider: new MicrosoftLoginProvider(
              'c35f1a94-54c1-4382-8458-851e9f9b8c30',
              {
                redirect_uri: environment.redirectUri,
                logout_redirect_uri: environment.uiUrl,
              },
            ),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: StandardTheme,
        options: DefaultOptions,
      },
    }),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([backendStatusInterceptor]),
    ),
    provideClientHydration(withEventReplay()),
  ],
};
