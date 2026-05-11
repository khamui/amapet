import { ApplicationConfig, importProvidersFrom, APP_INITIALIZER, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ConsentService } from './services/consent.service';
import { MicrosoftAuthService } from './services/microsoft-auth.service';
import { GoogleAuthService } from './services/google-auth.service';
import {
  withInterceptorsFromDi,
  withInterceptors,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { backendStatusInterceptor } from './interceptors/backend-status.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { provideAnimations } from '@angular/platform-browser/animations';
import { StandardTheme } from '../assets/themes/standard/standard-theme';

const DefaultOptions = {
  darkModeSelector: '.darkmode',
};

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(AppRoutingModule),
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
      // Always process a possible Microsoft redirect response on app
      // startup. Runs on every route so MSAL's interaction_in_progress
      // flag is consumed even if the user lands somewhere other than
      // /redirect.html. No-op when there is no pending redirect.
      provide: APP_INITIALIZER,
      useFactory:
        (msAuth: MicrosoftAuthService, auth: AuthService) => async () => {
          try {
            const result = await msAuth.handleRedirect();
            if (result?.idToken) {
              await auth.exchangeMicrosoftIdToken(result.idToken);
            }
          } catch (e) {
            console.error('[MS-INIT] error', e);
          }
        },
      deps: [MicrosoftAuthService, AuthService],
      multi: true,
    },
    {
      // Process a possible Google OAuth redirect response on app
      // startup. Reads ?code= from the URL when the user lands on
      // /google-redirect.html and exchanges it for an amapet JWT
      // before routing kicks in. No-op when there is no code.
      provide: APP_INITIALIZER,
      useFactory:
        (
          platformId: object,
          googleAuth: GoogleAuthService,
          auth: AuthService,
        ) =>
        async () => {
          if (!isPlatformBrowser(platformId)) return;
          if (window.location.pathname !== '/google-redirect.html') return;
          try {
            const code = googleAuth.readCodeFromUrl();
            if (code) {
              await auth.exchangeGoogleCode(code);
            }
          } catch (e) {
            console.error('[GOOGLE-INIT] error', e);
          }
        },
      deps: [PLATFORM_ID, GoogleAuthService, AuthService],
      multi: true,
    },
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: StandardTheme,
        options: DefaultOptions,
      },
    }),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi(),
      withInterceptors([backendStatusInterceptor]),
    ),
    provideClientHydration(withEventReplay()),
  ],
};
