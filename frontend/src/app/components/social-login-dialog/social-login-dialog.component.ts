import { Component, effect, inject, model } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { SettingsService } from 'src/app/services/settings.service';
import { MicrosoftAuthService } from 'src/app/services/microsoft-auth.service';
import { GoogleAuthService } from 'src/app/services/google-auth.service';

@Component({
  selector: 'ama-social-login-dialog',
  templateUrl: './social-login-dialog.component.html',
  styleUrls: ['./social-login-dialog.component.scss'],
  standalone: true,
  imports: [DialogModule],
})
export class SocialLoginDialogComponent {
  public as = inject(AuthService);
  public ses = inject(SettingsService);
  private msAuth = inject(MicrosoftAuthService);
  private googleAuth = inject(GoogleAuthService);

  public visible = model(false);

  constructor() {
    // Use effect to auto-close dialog on successful login
    effect(() => {
      if (this.as.isLoggedIn() && this.visible()) {
        this.closeDialog();
      }
    });
  }

  signInWithGoogle() {
    this.googleAuth.loginRedirect();
  }

  signInWithMicrosoft() {
    this.msAuth.loginRedirect();
  }

  closeDialog() {
    this.visible.set(false);
  }
}
