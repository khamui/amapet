import { Injectable, inject, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from './api.service';
import { PaginatedExploreResponse } from '../typedefs/Question.typedef';

@Injectable({
  providedIn: 'root',
})
export class ExploreService {
  private api = inject(ApiService);
  private state = inject(TransferState);
  private platformId = inject(PLATFORM_ID);

  readExploreQuestions = async (skip: number = 0, limit: number = 30) => {
    const key = makeStateKey<PaginatedExploreResponse>(
      `explore:${skip}:${limit}`,
    );

    if (isPlatformBrowser(this.platformId) && this.state.hasKey(key)) {
      const result = this.state.get(key, null as unknown as PaginatedExploreResponse);
      this.state.remove(key);
      return { isError: false as const, result };
    }

    const response = await this.api.read<PaginatedExploreResponse>(
      `/explore?skip=${skip}&limit=${limit}`,
      true,
    );

    if (!response.isError && !isPlatformBrowser(this.platformId)) {
      this.state.set(key, response.result);
    }

    return response;
  };
}
