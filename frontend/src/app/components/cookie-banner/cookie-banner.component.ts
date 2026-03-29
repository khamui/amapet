import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConsentService } from '../../services/consent.service';
import { LegalLanguageService } from '../../services/legal-language.service';

@Component({
  selector: 'ama-cookie-banner',
  standalone: true,
  imports: [ButtonModule, RouterLink],
  templateUrl: './cookie-banner.component.html',
})
export class CookieBannerComponent {
  private readonly consentService = inject(ConsentService);
  private readonly langService = inject(LegalLanguageService);

  public readonly showBanner = computed(() => !this.consentService.hasDecided());
  public readonly isGerman = computed(() => this.langService.language() === 'de');

  public accept(): void {
    this.consentService.giveConsent();
  }

  public reject(): void {
    this.consentService.rejectConsent();
  }
}
