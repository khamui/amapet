import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Token } from '../typedefs/Token.typedef';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';
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
  public watchLoggedIn = new BehaviorSubject(false);
  public watchUser = new BehaviorSubject(undefined);

  constructor(
    private sas: SocialAuthService,
    private api: ApiService<Token>,
    private router: Router,
    private ms: MessageService,
  ) {}

  /***
   *
   * public subscribeLogin()
   * This method needs to be set at the earliest point possible.
   * Ideally if the app starts. This observes if a login action was
   * triggered or not.
   *
   ***/
  public subscribeLogin = () => {
    const storedToken = localStorage.getItem(TOKEN_NAME);

    if (!storedToken) {
      this.sas.authState.subscribe(async (user: SocialUser) => {
        try {
          const token = user && (await this.requestToken(user));
          if (token && !token.isError) {
            this.setToken((token.result as Token).token);
            this.watchLoggedIn.next(true);
            this.router.navigate(['/'], { replaceUrl: true });
          }
        } catch (error: any) {
          if (error.name !== 'AbortError') {
            this.ms.add({
              severity: 'error',
              summary: 'Login failed!',
              detail: 'An error occurred during login. Please try again.',
            });
          }
        }
      });
    } else {
      const payload = decode(storedToken);
      this.setLoggedInWithExpiration((payload as any).exp);
      console.log('Still valid token. Expiry date to be checked');
    }
  };

  public logout = async () => {
    localStorage.removeItem(TOKEN_NAME);
    this.watchLoggedIn.next(false);
    this.router.navigate(['/'], { replaceUrl: true });
    await this.sas.signOut();
  };

  private setLoggedInWithExpiration = (exp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = exp - now;
    if (diff < 0) {
      this.watchLoggedIn.next(false);
      localStorage.removeItem(TOKEN_NAME);
    } else {
      this.watchLoggedIn.next(true);
    }
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
      this.ms.add({
        severity: 'error',
        summary: 'Login failed!',
        detail: 'No token received from Google.',
      });
      return;
    }
    const authToken = await this.api.create('google-signin', {
      token,
    });
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
