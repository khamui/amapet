import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { ApiService } from './services/api.service';
import { Token } from './typedefs/Token.typedef';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'app works!';
  menuItems: MenuItem[] = [];
  user!: any;

  constructor(
    public router: Router,
  ) {
    this.menuItems = [
      { label: 'Create new Post', icon: 'pi pi-plus', routerLink: 'create' },
      { label: 'Profile', icon: 'pi pi-user' },
      { label: 'Activity', icon: 'pi pi-history', routerLink: 'posts' },
    ];
  }
}
