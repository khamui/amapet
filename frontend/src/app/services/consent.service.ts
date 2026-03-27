import { Injectable, signal } from '@angular/core';

export type ConsentStatus = 'accepted' | 'rejected' | null;

const STORAGE_KEY = 'amapet_consent';

@Injectable({
  providedIn: 'root',
})
export class ConsentService {
  private readonly consentStatus = signal<ConsentStatus>(this.loadConsent());

  public readonly status = this.consentStatus.asReadonly();

  public hasDecided(): boolean {
    return this.consentStatus() !== null;
  }

  public isAccepted(): boolean {
    return this.consentStatus() === 'accepted';
  }

  public giveConsent(): void {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    this.consentStatus.set('accepted');
  }

  public rejectConsent(): void {
    localStorage.setItem(STORAGE_KEY, 'rejected');
    this.consentStatus.set('rejected');
  }

  private loadConsent(): ConsentStatus {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'accepted' || stored === 'rejected') {
      return stored;
    }
    return null;
  }
}
