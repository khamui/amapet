import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { PaginatedExploreResponse } from '../typedefs/Question.typedef';

@Injectable({
  providedIn: 'root',
})
export class ExploreService {
  private api = inject(ApiService);

  readExploreQuestions = async (skip: number = 0, limit: number = 30) => {
    return await this.api.read<PaginatedExploreResponse>(
      `/explore?skip=${skip}&limit=${limit}`,
      true,
    );
  };
}
