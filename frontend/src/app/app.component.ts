import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from './services/auth.service';
import { ToastModule } from 'primeng/toast';
import { SideboxComponent } from './components/sidebox/sidebox.component';
import { CircleBoxComponent } from './containers/circle-box/circle-box.component';
import { TopbarComponent } from './containers/topbar/topbar.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        RouterOutlet,
        ToastModule,
        SideboxComponent,
        CircleBoxComponent,
        TopbarComponent
    ],
})
export class AppComponent implements OnInit {
  menuItems: MenuItem[] = [];
  isLoggedIn = false;
  user!: any;

  constructor(
    public router: Router,
    private as: AuthService,
  ) {
    this.menuItems = [
      // { label: 'Create new Post', icon: 'pi pi-plus', routerLink: 'create' },
      { label: 'Profile', icon: 'pi pi-user', routerLink: 'profile' },
      //{ label: 'Questions', icon: 'pi pi-history', routerLink: 'questions' },
    ];
  }

  ngOnInit(): void {
    this.as.watchLoggedIn.subscribe((value: boolean) => {
      this.isLoggedIn = value;
    });
    this.as.subscribeLogin();
  }
}
