import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Token } from '../typedefs/Token.typedef';
import { inject, Injectable, signal } from '@angular/core';
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
  private sas = inject(SocialAuthService);
  private api = inject(ApiService<Token>);
  private router = inject(Router);
  private ms = inject(MessageService);

  public isLoggedIn = signal(false);
  public user = signal<User | undefined>(undefined);

  /***
   *
   * public subscribeLogin()
   * This method needs to be set at the earliest point possible.
   * Ideally if the app starts. This observes if a login action was
   * triggered or not.
   *
   ***/
  public subscribeLogin = async () => {
    const storedToken = localStorage.getItem(TOKEN_NAME);

    // Always set up auth state subscription to handle login attempts
    // This ensures login works even after logout without page refresh
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

    // If token exists, validate it
    if (storedToken) {
      const payload = decode(storedToken);
      this.setLoggedInWithExpiration((payload as any).exp);
    }
  };

  public logout = async () => {
    localStorage.removeItem(TOKEN_NAME);
    this.isLoggedIn.set(false);
    this.user.set(undefined);
    this.router.navigate(['/'], { replaceUrl: true });
    await this.sas.signOut();
  };

  private setLoggedInWithExpiration = (exp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = exp - now;
    if (diff < 0) {
      this.isLoggedIn.set(false);
      this.user.set(undefined);
      localStorage.removeItem(TOKEN_NAME);
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
        detail: 'Google authentication failed. Please try signing in again.',
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
    const { idToken: token } = user;

    if (!token) {
      const error = new Error('No authentication token received from Google');
      this.ms.add({
        severity: 'error',
        summary: 'Authentication Error',
        detail: 'No authentication token received from Google. Please try again.',
      });
      throw error;
    }

    const authToken = await this.api.create('google-signin', { token });

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
    localStorage.setItem(TOKEN_NAME, token);
  };

  /***
   *
   * public getToken()
   *
   ***/
  public getToken = () => {
    return localStorage.getItem(TOKEN_NAME);
  };

  /***
   *
   * public getUser()
   *
   ***/
  public getUser = (): User => {
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
    return `${(userPayload as User).firstname} ${
      (userPayload as User).lastname
    }`;
  };

  /***
   *
   * public getUserId()
   *
   ***/
  public getUserId = () => {
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
    const { isError, result } = await this.api.read('profile', true);
    return (result as any).profile.followedCircles || [];
  };

  /***
   *
   * public getPermLevel()
   *
   ***/
  public getPermLevel = () => {
    const jwtToken = localStorage.getItem(TOKEN_NAME);
    const payload = jwtToken && decode(jwtToken);
    return (payload as any)?.permLevel;
  };
}
