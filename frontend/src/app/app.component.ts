import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  menuItems: MenuItem[] = [];
  circleItems: MenuItem[] = [];
  isLoggedIn = false;
  user!: any;

  constructor(
    public router: Router,
    private as: AuthService
  ) {
    this.menuItems = [
      // { label: 'Create new Post', icon: 'pi pi-plus', routerLink: 'create' },
      { label: 'Profile', icon: 'pi pi-user', routerLink: 'profile' },
      { label: 'Questions', icon: 'pi pi-history', routerLink: 'posts' },
    ];
    this.circleItems = [
      { label: 'Create new Circle', icon: 'pi pi-plus', routerLink: 'create' },
      { label: 'c/muenchen' },
      { label: 'c/stuttgart' },
      { label: 'c/food' },
      { label: 'c/training' },
      { label: 'c/shelterdogs' },
      { label: 'c/portugal' },
    ];

  }

  ngOnInit(): void {
    this.as.watchLoggedIn.subscribe((value: boolean) => {
      this.isLoggedIn = value;
    })
    this.as.subscribeLogin();
  }
}
