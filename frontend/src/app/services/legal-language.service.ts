import { Injectable, signal } from '@angular/core';

export type LegalLanguage = 'de' | 'en';

const STORAGE_KEY = 'amapet_legal_lang';

@Injectable({
  providedIn: 'root',
})
export class LegalLanguageService {
  private readonly lang = signal<LegalLanguage>(this.loadLanguage());

  public readonly language = this.lang.asReadonly();

  public setLanguage(language: LegalLanguage): void {
    localStorage.setItem(STORAGE_KEY, language);
    this.lang.set(language);
  }

  public toggle(): void {
    const next = this.lang() === 'de' ? 'en' : 'de';
    this.setLanguage(next);
  }

  private loadLanguage(): LegalLanguage {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'de' || stored === 'en') {
      return stored;
    }
    // Default to browser language or 'en'
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('de') ? 'de' : 'en';
  }
}
