import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from './services/auth.service';
import { ToastModule } from 'primeng/toast';
import { SideboxComponent } from './components/sidebox/sidebox.component';
import { CircleBoxComponent } from './containers/circle-box/circle-box.component';
import { TopbarComponent } from './containers/topbar/topbar.component';
import { ModerationStore } from './stores/moderation.store';
import { CircleBoxModerationComponent } from './containers/circle-box-moderation/circle-box-moderation.component';
import { filter } from 'rxjs';

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
    CircleBoxModerationComponent,
  ],
})
export class AppComponent implements OnInit {
  menuItems: MenuItem[] = [];
  isLoggedIn = false;
  user!: any;
  isInModerationView = false;
  isInCircleView = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private as: AuthService,
    private moderationStore: ModerationStore,
  ) {}

  async ngOnInit() {
    this.as.watchLoggedIn.subscribe((value: boolean) => {
      this.isLoggedIn = value;
    });
    this.as.subscribeLogin();

    await this.moderationStore.initStore();
    const moderatedCircleIds = this.moderationStore.getModeratedCircleIds();
    console.log('moderatedCircleIds', moderatedCircleIds);

    this.menuItems = [
      // { label: 'Create new Post', icon: 'pi pi-plus', routerLink: 'create' },
      { label: 'Profile', icon: 'pi pi-user', routerLink: 'profile' },
      {
        label: 'Moderation',
        icon: 'pi pi-user',
        routerLink: 'moderation',
        disabled: moderatedCircleIds.length > 0 ? false : true,
      },
      //{ label: 'Questions', icon: 'pi pi-history', routerLink: 'questions' },
    ];

    this.setCircleBox();

    // listen to url changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(this.setCircleBox);
  }

  private setCircleBox = () => {
    if (
      this.router.url.startsWith('/moderation') ||
      this.router.url.startsWith('/moderate')
    ) {
      this.isInCircleView = false;
      this.isInModerationView = true;
    } else {
      this.isInModerationView = false;
      this.isInCircleView = true;
    }
  };
}
