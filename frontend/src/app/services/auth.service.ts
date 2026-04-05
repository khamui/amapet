import {
  SocialAuthService,
  SocialUser,
  MicrosoftLoginProvider,
} from '@abacritt/angularx-social-login';
import { Token } from '../typedefs/Token.typedef';
import { inject, Injectable, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from './api.service';
import { firstValueFrom } from 'rxjs';
import { jwtDecode as decode } from 'jwt-decode';
import { Router } from '@angular/router';
import { User } from '../typedefs/User.typedef';
import { MessageService } from 'primeng/api';

// CONSTANTS
const TOKEN_NAME = 'amapet_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private sas = inject(SocialAuthService);
  private api = inject(ApiService<Token>);
  private router = inject(Router);
  private ms = inject(MessageService);

  public isLoggedIn = signal(false);
  public user = signal<User | undefined>(undefined);

  /***
   *
   * public initFromStoredToken()
   * Synchronously initializes auth state from localStorage token.
   * Called via APP_INITIALIZER before routing starts.
   *
   ***/
  public initFromStoredToken(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const storedToken = localStorage.getItem(TOKEN_NAME);
    if (storedToken) {
      const payload = decode(storedToken);
      this.setLoggedInWithExpiration((payload as any).exp);
    }
  }

  /***
   *
   * public subscribeLogin()
   * Initializes social auth SDK and subscribes to login events.
   * Token check is handled separately by initFromStoredToken().
   *
   ***/
  public subscribeLogin = async () => {
    if (!isPlatformBrowser(this.platformId)) return;

    await firstValueFrom(this.sas.initState);
    this.sas.authState.subscribe(async (user: SocialUser) => {
      if (!user) return;

      try {
        const token = await this.requestToken(user);
        if (token && !token.isError) {
          this.setToken((token.result as Token).token);
          this.isLoggedIn.set(true);
          this.router.navigate(['/'], { replaceUrl: true });
        }
      } catch (error: any) {
        this.handleLoginError(error);
      }
    });
  };

  public logout = async () => {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_NAME);
    }
    this.isLoggedIn.set(false);
    this.user.set(undefined);
    this.router.navigate(['/'], { replaceUrl: true });
    try {
      await this.sas.signOut();
    } catch {
      // Ignore - social session may not exist if user logged in via stored token
    }
  };

  private setLoggedInWithExpiration = (exp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = exp - now;
    if (diff < 0) {
      this.isLoggedIn.set(false);
      this.user.set(undefined);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem(TOKEN_NAME);
      }
      this.ms.add({
        severity: 'warn',
        summary: 'Session Expired',
        detail: 'Your session has expired. Please log in again.',
      });
    } else {
      this.isLoggedIn.set(true);
    }
  };

  private handleLoginError = (error: any) => {
    // Silent fail for user-initiated aborts (e.g., closing popup)
    if (error.name === 'AbortError') {
      return;
    }

    // Network or server errors
    if (error.status === 0 || error.status >= 500) {
      this.ms.add({
        severity: 'error',
        summary: 'Connection Error',
        detail: 'Unable to connect to authentication server. Please check your internet connection and try again.',
      });
      return;
    }

    // Token validation errors (4xx errors)
    if (error.status >= 400 && error.status < 500) {
      this.ms.add({
        severity: 'error',
        summary: 'Authentication Failed',
        detail: 'Authentication failed. Please try signing in again.',
      });
      return;
    }

    // Generic errors
    this.ms.add({
      severity: 'error',
      summary: 'Login Failed',
      detail: error.message || 'An unexpected error occurred during login. Please try again.',
    });
  };

  /***
   *
   * private requestToken()
   * This method makes a call to amapet's backend to receive a jwt token
   * which can be used for further authorizations.
   *
   ***/
  private requestToken = async (user: SocialUser) => {
    const { idToken: token, provider } = user;

    if (!token) {
      const error = new Error('No authentication token received');
      this.ms.add({
        severity: 'error',
        summary: 'Authentication Error',
        detail: 'No authentication token received. Please try again.',
      });
      throw error;
    }

    // Route to correct backend endpoint based on provider
    const endpoint =
      provider === MicrosoftLoginProvider.PROVIDER_ID
        ? '/microsoft-signin'
        : '/google-signin';

    const authToken = await this.api.create(endpoint, { token });

    if (authToken.isError) {
      const error = new Error(
        (authToken as any).error || 'Backend authentication failed',
      );
      throw error;
    }

    return authToken;
  };

  /***
   *
   * private setToken()
   *
   ***/
  private setToken = (token: string) => {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(TOKEN_NAME, token);
    }
  };

  /***
   *
   * public getToken()
   *
   ***/
  public getToken = () => {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    return localStorage.getItem(TOKEN_NAME);
  };

  /***
   *
   * public getUser()
   *
   ***/
  public getUser = (): User => {
    if (!isPlatformBrowser(this.platformId)) {
      return {} as User;
    }
    const jwtToken = localStorage.getItem(TOKEN_NAME);
    const userPayload = jwtToken && decode(jwtToken);
    return userPayload as User;
  };

  /***
   *
   * public getUser()
   *
   ***/
  public getUserName = () => {
    const userPayload = this.getUser();
    return (userPayload as User).username ?? '';
  };

  /***
   *
   * public getUserId()
   *
   ***/
  public getUserId = () => {
    if (!isPlatformBrowser(this.platformId)) {
      return undefined;
    }
    const jwtToken = localStorage.getItem(TOKEN_NAME);
    const payload = jwtToken && decode(jwtToken);
    return (payload as any)?._id;
  };

  /***
   *
   * Get logged in user's followed circles
   *
   ***/
  public getFollowedCircles = async () => {
    const { isError, result } = await this.api.read('/profile', true);
    return (result as any).profile.followedCircles || [];
  };

  /***
   *
   * public getPermLevel()
   *
   ***/
  public getPermLevel = () => {
    if (!isPlatformBrowser(this.platformId)) {
      return undefined;
    }
    const jwtToken = localStorage.getItem(TOKEN_NAME);
    const payload = jwtToken && decode(jwtToken);
    return (payload as any)?.permLevel;
  };
}
