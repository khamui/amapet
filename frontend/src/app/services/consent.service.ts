import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ConsentStatus = 'accepted' | 'rejected' | null;

const STORAGE_KEY = 'amapet_consent';

@Injectable({
  providedIn: 'root',
})
export class ConsentService {
  private platformId = inject(PLATFORM_ID);
  private readonly consentStatus = signal<ConsentStatus>(this.loadConsent());

  public readonly status = this.consentStatus.asReadonly();

  public hasDecided(): boolean {
    return this.consentStatus() !== null;
  }

  public isAccepted(): boolean {
    return this.consentStatus() === 'accepted';
  }

  public giveConsent(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    }
    this.consentStatus.set('accepted');
  }

  public rejectConsent(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, 'rejected');
    }
    this.consentStatus.set('rejected');
  }

  private loadConsent(): ConsentStatus {
    if (!isPlatformBrowser(this.platformId)) {
      return null; // Server-side: return null, will hydrate on client
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'accepted' || stored === 'rejected') {
      return stored;
    }
    return null;
  }
}
