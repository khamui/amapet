import { Component, effect, inject, model } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import {
  GoogleSigninButtonModule,
  SocialAuthService,
  MicrosoftLoginProvider,
} from '@abacritt/angularx-social-login';
import { AuthService } from 'src/app/services/auth.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'ama-social-login-dialog',
  templateUrl: './social-login-dialog.component.html',
  styleUrls: ['./social-login-dialog.component.scss'],
  standalone: true,
  imports: [DialogModule, GoogleSigninButtonModule],
})
export class SocialLoginDialogComponent {
  public as = inject(AuthService);
  public ses = inject(SettingsService);
  private sas = inject(SocialAuthService);

  public visible = model(false);

  constructor() {
    // Use effect to auto-close dialog on successful login
    effect(() => {
      if (this.as.isLoggedIn() && this.visible()) {
        this.closeDialog();
      }
    });
  }

  signInWithMicrosoft() {
    this.sas.signIn(MicrosoftLoginProvider.PROVIDER_ID);
  }

  closeDialog() {
    this.visible.set(false);
  }
}
