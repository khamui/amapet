import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from './services/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { SideboxComponent } from './components/sidebox/sidebox.component';
import { CircleBoxComponent } from './containers/circle-box/circle-box.component';
import { TopbarComponent } from './containers/topbar/topbar.component';
import { SoonAvailableComponent } from './containers/soon-available/soon-available.component';
import { SettingsService } from './services/settings.service';
import { NgClass } from '@angular/common';

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
    TopbarComponent,
    SoonAvailableComponent,
    MessageModule,
    NgClass,
  ],
})
export class AppComponent implements OnInit {
  public router = inject(Router);
  private as = inject(AuthService);
  private ses = inject(SettingsService);

  public menuItems: MenuItem[] = [];
  public isLoggedIn = false;
  public appIsAvailable!: boolean;
  public isMaintenance!: boolean;

  constructor() {
    this.menuItems = [
      // { label: 'Create new Post', icon: 'pi pi-plus', routerLink: 'create' },
      { label: 'Profile', icon: 'pi pi-user', routerLink: 'profile' },
      //{ label: 'Questions', icon: 'pi pi-history', routerLink: 'questions' },
    ];
  }

  async ngOnInit() {
    this.as.watchLoggedIn.subscribe((value: boolean) => {
      this.isLoggedIn = value;
    });
    this.as.subscribeLogin();

    this.isMaintenance = await this.ses.getIsMaintenance();
    this.appIsAvailable = await this.ses.getAppIsAvailable();
  }
}
