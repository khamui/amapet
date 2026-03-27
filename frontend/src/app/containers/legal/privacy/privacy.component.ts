import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { LegalLanguageService } from '../../../services/legal-language.service';
import { LegalInfoService } from '../../../services/legal-info.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './privacy.component.html',
})
export class PrivacyComponent {
  private readonly router = inject(Router);
  private readonly langService = inject(LegalLanguageService);
  private readonly legalInfoService = inject(LegalInfoService);

  public readonly language = this.langService.language;
  public readonly isGerman = computed(() => this.language() === 'de');
  public readonly info = this.legalInfoService.legalInfo;

  public toggleLanguage(): void {
    this.langService.toggle();
  }

  public dismiss(): void {
    this.router.navigate(['/explore']);
  }
}
