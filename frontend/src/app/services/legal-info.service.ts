import { Injectable, signal } from '@angular/core';

export interface LegalInfo {
  name: string;
  street: string;
  city: string;
  country: string;
  email: string;
  website: string;
}

const DEFAULT_INFO: LegalInfo = {
  name: '',
  street: '',
  city: '',
  country: '',
  email: '',
  website: '',
};

@Injectable({
  providedIn: 'root',
})
export class LegalInfoService {
  private readonly info = signal<LegalInfo>(DEFAULT_INFO);
  private readonly loaded = signal(false);

  public readonly legalInfo = this.info.asReadonly();
  public readonly isLoaded = this.loaded.asReadonly();

  constructor() {
    this.loadInfo();
  }

  private async loadInfo(): Promise<void> {
    try {
      const response = await fetch('/assets/config/legal-info.json');
      if (response.ok) {
        const data = await response.json();
        this.info.set(data);
      }
    } catch {
      // Config file not available, keep defaults
    }
    this.loaded.set(true);
  }
}
