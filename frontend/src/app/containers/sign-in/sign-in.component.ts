import { Component, inject, OnInit } from '@angular/core';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [GoogleSigninButtonModule],
})
export class SignInComponent {
  public ses = inject(SettingsService);
}
