import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { LegalLanguageService } from '../../../services/legal-language.service';

@Component({
  selector: 'app-disclaimer',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './disclaimer.component.html',
})
export class DisclaimerComponent {
  private readonly router = inject(Router);
  private readonly langService = inject(LegalLanguageService);

  public readonly language = this.langService.language;
  public readonly isGerman = computed(() => this.language() === 'de');

  public toggleLanguage(): void {
    this.langService.toggle();
  }

  public dismiss(): void {
    this.router.navigate(['/explore']);
  }
}
