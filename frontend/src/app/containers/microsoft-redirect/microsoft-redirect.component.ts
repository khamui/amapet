import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

/**
 * Loading screen for the Microsoft OAuth redirect URI (/redirect.html).
 * The MSAL redirect response and backend token exchange are handled by
 * an APP_INITIALIZER before this component is activated; here we just
 * forward the user to the home route.
 */
@Component({
  selector: 'ama-microsoft-redirect',
  standalone: true,
  template: `
    <div class="flex h-screen w-full items-center justify-center">
      <p class="text-surface-700 dark:text-surface-200">Signing you in…</p>
    </div>
  `,
})
export class MicrosoftRedirectComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  async ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    await this.router.navigate(['/'], { replaceUrl: true });
  }
}
