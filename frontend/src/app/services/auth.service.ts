import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Token } from '../typedefs/Token.typedef';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loggedIn = new Subject();

  constructor(private sas: SocialAuthService, private api: ApiService<Token>) { }

  public check = () => {
    const validToken = localStorage.getItem('amapet_token');

    if (!validToken) {
      this.sas.authState.subscribe(async(user: SocialUser) => {
        const token = await this.api.create('google-signin', {
          token: user.idToken
        });
        // trigger call to server here!
        console.log('VERIFIED TOKEN', token);
        if (!token.isError) {
          localStorage.setItem('amapet_token', (token.result as Token).token);
        }
      });
    } else {
      this.loggedIn.next(true);
      console.log('Still valid token. Expiry date to be checked');
    }
  }
}
