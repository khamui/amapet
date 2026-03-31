import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';

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
  private readonly api = inject(ApiService);
  private readonly info = signal<LegalInfo>(DEFAULT_INFO);
  private readonly loaded = signal(false);

  public readonly legalInfo = this.info.asReadonly();
  public readonly isLoaded = this.loaded.asReadonly();

  constructor() {
    this.loadInfo();
  }

  private async loadInfo(): Promise<void> {
    const response = await this.api.read<LegalInfo>('/legal-info');
    if (!response.isError) {
      this.info.set(response.result);
    }
    this.loaded.set(true);
  }
}
