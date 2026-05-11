import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  AuthenticationResult,
  PublicClientApplication,
} from '@azure/msal-browser';
import { environment } from '../../environments/environment';

const CLIENT_ID = 'c35f1a94-54c1-4382-8458-851e9f9b8c30';
const SCOPES = ['openid', 'email', 'profile', 'User.Read'];

/**
 * Wraps @azure/msal-browser to provide Microsoft sign-in using the
 * redirect flow (no popup). Replaces @abacritt/angularx-social-login's
 * MicrosoftLoginProvider, which is bundled with an outdated MSAL build
 * and broke in current browsers due to popup/COOP behaviour.
 */
@Injectable({ providedIn: 'root' })
export class MicrosoftAuthService {
  private platformId = inject(PLATFORM_ID);
  private instance: PublicClientApplication | null = null;
  private initPromise: Promise<void> | null = null;

  private getInstance(): PublicClientApplication {
    if (!this.instance) {
      this.instance = new PublicClientApplication({
        auth: {
          clientId: CLIENT_ID,
          authority: 'https://login.microsoftonline.com/common/',
          redirectUri: environment.redirectUri,
          postLogoutRedirectUri: environment.uiUrl,
          // Callback fires for every redirect MSAL initiates: the
          // outgoing one to login.microsoftonline.com AND the incoming
          // full-page navigation back to the login request URL after
          // handleRedirectPromise processes the response. We must let
          // the outgoing one proceed, but cancel the incoming one so
          // /redirect.html stays loaded for the APP_INITIALIZER to
          // finish the backend token exchange and SPA-route from
          // there.
          onRedirectNavigate: (url: string) => {
            if (url.startsWith(environment.uiUrl)) return false;
            return undefined;
          },
        },
        cache: {
          cacheLocation: 'sessionStorage',
        },
      });
    }
    return this.instance;
  }

  /**
   * Ensures MSAL is initialized exactly once. Safe to call repeatedly.
   * No-op during SSR.
   */
  public initialize(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return Promise.resolve();
    if (!this.initPromise) {
      this.initPromise = this.getInstance().initialize();
    }
    return this.initPromise;
  }

  /**
   * Navigates the main window to the Microsoft sign-in page. Does not
   * return on the current navigation; the user will land back on
   * environment.redirectUri after auth.
   */
  public async loginRedirect(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    await this.initialize();
    await this.getInstance().loginRedirect({ scopes: SCOPES });
  }

  /**
   * Processes an MSAL redirect response if one is present in the current
   * URL. Returns null when there is nothing to process.
   */
  public async handleRedirect(): Promise<AuthenticationResult | null> {
    if (!isPlatformBrowser(this.platformId)) return null;
    await this.initialize();
    return this.getInstance().handleRedirectPromise();
  }
}
