import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

const CLIENT_ID =
  '265914185201-ln0r3huhnfjd1j1j80c5tvi43pf1lhpg.apps.googleusercontent.com';
const SCOPE = 'openid email profile';
const GSI_SRC = 'https://accounts.google.com/gsi/client';

interface GoogleCodeClient {
  requestCode: () => void;
}

interface GoogleOAuth2 {
  initCodeClient: (config: {
    client_id: string;
    scope: string;
    ux_mode: 'popup' | 'redirect';
    redirect_uri: string;
    state?: string;
  }) => GoogleCodeClient;
}

declare global {
  interface Window {
    google?: { accounts?: { oauth2?: GoogleOAuth2 } };
  }
}

/**
 * Wraps Google Identity Services (gsi/client) to provide Google sign-in
 * using the authorization-code redirect flow (no popup). Replaces
 * @abacritt/angularx-social-login's GoogleLoginProvider, whose popup +
 * window.postMessage flow trips the Cross-Origin-Opener-Policy warning
 * in current browsers.
 */
@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private platformId = inject(PLATFORM_ID);
  private scriptPromise: Promise<void> | null = null;

  /**
   * Loads the Google Identity Services script exactly once. No-op
   * during SSR. Resolves when window.google.accounts.oauth2 is ready.
   */
  private loadScript(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return Promise.resolve();
    if (this.scriptPromise) return this.scriptPromise;

    this.scriptPromise = new Promise<void>((resolve, reject) => {
      if (window.google?.accounts?.oauth2) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = GSI_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error('Failed to load Google Identity Services script'));
      document.head.appendChild(script);
    });

    return this.scriptPromise;
  }

  /**
   * Navigates the main window to Google's OAuth consent page. Does not
   * return on the current navigation; the user will land back on
   * environment.googleRedirectUri with ?code=... after auth.
   */
  public async loginRedirect(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    await this.loadScript();
    const oauth2 = window.google?.accounts?.oauth2;
    if (!oauth2) {
      throw new Error('Google Identity Services not available');
    }
    const client = oauth2.initCodeClient({
      client_id: CLIENT_ID,
      scope: SCOPE,
      ux_mode: 'redirect',
      redirect_uri: environment.googleRedirectUri,
    });
    client.requestCode();
  }

  /**
   * Reads the authorization code returned by Google from the current
   * URL's query string. Returns null when no code is present (e.g. on
   * direct navigation to /google-redirect.html).
   */
  public readCodeFromUrl(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const params = new URLSearchParams(window.location.search);
    return params.get('code');
  }
}
