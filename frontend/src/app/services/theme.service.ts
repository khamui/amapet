import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { ConsentService } from './consent.service';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'ama-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly consentService = inject(ConsentService);
  private readonly mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  public readonly theme = signal<Theme>(this.getStoredTheme());

  public readonly effectiveTheme = computed(() => {
    const current = this.theme();
    if (current === 'system') {
      return this.mediaQuery.matches ? 'dark' : 'light';
    }
    return current;
  });

  constructor() {
    effect(() => {
      this.applyTheme(this.effectiveTheme());
    });

    this.mediaQuery.addEventListener('change', () => {
      if (this.theme() === 'system') {
        this.applyTheme(this.effectiveTheme());
      }
    });
  }

  public setTheme(theme: Theme): void {
    this.theme.set(theme);
    // Only persist to localStorage if user has accepted consent
    if (this.consentService.isAccepted()) {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }

  private getStoredTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
    return 'system';
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    if (theme === 'dark') {
      document.documentElement.classList.add('darkmode');
    } else {
      document.documentElement.classList.remove('darkmode');
    }
  }
}
