import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from './services/auth.service';
import { CircleService } from './services/circle.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  menuItems: MenuItem[] = [];
  isLoggedIn = false;
  user!: any;

  constructor(
    public router: Router,
    private as: AuthService,
    private cs: CircleService
  ) {
    this.cs.readCircles();
    this.menuItems = [
      // { label: 'Create new Post', icon: 'pi pi-plus', routerLink: 'create' },
      { label: 'Profile', icon: 'pi pi-user', routerLink: 'profile' },
      { label: 'Questions', icon: 'pi pi-history', routerLink: 'questions' },
    ];
  }

  ngOnInit(): void {
    this.as.watchLoggedIn.subscribe((value: boolean) => {
      this.isLoggedIn = value;
    });
    this.as.subscribeLogin();
  }
}
