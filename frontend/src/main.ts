import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import {
  withInterceptorsFromDi,
  provideHttpClient,
} from '@angular/common/http';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import {
  GoogleLoginProvider,
  SOCIAL_AUTH_CONFIG,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { MessageService } from 'primeng/api';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      SocialLoginModule,
    ),
    MessageService,
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
            ),
          },
          // {
          //   id: FacebookLoginProvider.PROVIDER_ID,
          //   provider: new FacebookLoginProvider('clientId'),
          // },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: Lara,
      },
    }),
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch((err) => console.error(err));
