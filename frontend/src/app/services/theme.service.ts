import { Injectable, inject, signal, computed, effect, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ConsentService } from './consent.service';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'ama-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly consentService = inject(ConsentService);
  private mediaQuery: MediaQueryList | null = null;

  public readonly theme = signal<Theme>(this.getStoredTheme());

  public readonly effectiveTheme = computed(() => {
    const current = this.theme();
    if (current === 'system') {
      return this.mediaQuery?.matches ? 'dark' : 'light';
    }
    return current;
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      effect(() => {
        this.applyTheme(this.effectiveTheme());
      });

      this.mediaQuery.addEventListener('change', () => {
        if (this.theme() === 'system') {
          this.applyTheme(this.effectiveTheme());
        }
      });
    }
  }

  public setTheme(theme: Theme): void {
    this.theme.set(theme);
    // Only persist to localStorage if user has accepted consent
    if (isPlatformBrowser(this.platformId) && this.consentService.isAccepted()) {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }

  private getStoredTheme(): Theme {
    if (!isPlatformBrowser(this.platformId)) {
      return 'system'; // Default for SSR
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
    return 'system';
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (theme === 'dark') {
      document.documentElement.classList.add('darkmode');
    } else {
      document.documentElement.classList.remove('darkmode');
    }
  }
}
