import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'app works!';
  menuItems: MenuItem[] = [];

  constructor(public router: Router) {
    this.menuItems = [
      { label: 'Create new Post', icon: 'pi pi-plus', routerLink: 'create' },
      { label: 'Profile', icon: 'pi pi-user' },
      { label: 'Activity', icon: 'pi pi-history', routerLink: 'posts' },
    ];
  }
}
