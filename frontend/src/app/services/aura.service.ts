import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';

interface AuraResponse {
  aura: number;
  level: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuraService {
  private api = inject(ApiService);
  private cache = new Map<string, AuraResponse>();

  async getUserAura(userId: string): Promise<AuraResponse> {
    if (this.cache.has(userId)) {
      return this.cache.get(userId)!;
    }

    const { isError, result } = await this.api.read<AuraResponse>(
      `/users/${userId}/aura`,
    );

    if (!isError && result) {
      this.cache.set(userId, result);
      return result;
    }

    return { aura: 0, level: 'Newborn Pup' };
  }

  clearCache(userId?: string): void {
    if (userId) {
      this.cache.delete(userId);
    } else {
      this.cache.clear();
    }
  }
}
