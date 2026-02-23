import {
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { CircleBoxComponent } from './containers/circle-box/circle-box.component';
import { TopbarComponent } from './containers/topbar/topbar.component';
import { SoonAvailableComponent } from './containers/soon-available/soon-available.component';
import { SettingsService } from './services/settings.service';
import { NgClass } from '@angular/common';
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
    CircleBoxComponent,
    CircleBoxModerationComponent,
    TopbarComponent,
    SoonAvailableComponent,
    MessageModule,
    NgClass,
  ],
})
export class AppComponent implements OnInit {
  public router = inject(Router);
  private as = inject(AuthService);
  public ses = inject(SettingsService);

  public isLoggedIn = false;
  public isInModerationView = false;
  public isInCircleView = false;

  async ngOnInit() {
    this.as.watchLoggedIn.subscribe((value: boolean) => {
      this.isLoggedIn = value;
    });
    this.as.subscribeLogin();

    await this.ses.init();

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
