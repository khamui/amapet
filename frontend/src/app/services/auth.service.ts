import { Token } from '../typedefs/Token.typedef';
import { inject, Injectable, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from './api.service';
import { jwtDecode as decode } from 'jwt-decode';
import { Router } from '@angular/router';
import { User } from '../typedefs/User.typedef';
import { MessageService } from 'primeng/api';
import { environment } from '../../environments/environment';

// CONSTANTS
const TOKEN_NAME = 'amapet_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
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

  public logout = async () => {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_NAME);
    }
    this.isLoggedIn.set(false);
    this.user.set(undefined);
    this.router.navigate(['/'], { replaceUrl: true });
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
   * public exchangeGoogleCode()
   * Exchanges a Google OAuth authorization code (from the redirect
   * flow) for an amapet JWT, stores it, and updates auth state. Used
   * by the /google-redirect.html route handler.
   *
   ***/
  public exchangeGoogleCode = async (code: string): Promise<boolean> => {
    if (!code) {
      this.handleLoginError(new Error('No authentication code received'));
      return false;
    }
    try {
      const authToken = await this.api.create('/google-signin', {
        code,
        redirectUri: environment.googleRedirectUri,
      } as any);
      if (authToken.isError) {
        this.handleLoginError(authToken.result);
        return false;
      }
      this.setToken((authToken.result as Token).token);
      this.isLoggedIn.set(true);
      return true;
    } catch (error: any) {
      this.handleLoginError(error);
      return false;
    }
  };

  /***
   *
   * public exchangeMicrosoftIdToken()
   * Exchanges a Microsoft idToken (from msal-browser redirect) for an
   * amapet JWT, stores it, and updates auth state. Used by the
   * /redirect.html route handler.
   *
   ***/
  public exchangeMicrosoftIdToken = async (idToken: string): Promise<boolean> => {
    if (!idToken) {
      this.handleLoginError(new Error('No authentication token received'));
      return false;
    }
    try {
      const authToken = await this.api.create('/microsoft-signin', {
        token: idToken,
      });
      if (authToken.isError) {
        this.handleLoginError(authToken.result);
        return false;
      }
      this.setToken((authToken.result as Token).token);
      this.isLoggedIn.set(true);
      return true;
    } catch (error: any) {
      this.handleLoginError(error);
      return false;
    }
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
