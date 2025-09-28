import { Injectable, signal } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Question } from '../typedefs/Question.typedef';
import { Circle } from '../typedefs/Circle.typedef';

@Injectable({
  providedIn: 'root',
})
export class ModerationStore {
  private moderatedCircleIds = signal<string[]>([]);
  private moderatedCircles = signal<Circle[]>([]);

  // instead of get method
  public moderatedCircles$ = this.moderatedCircles.asReadonly();

  constructor(private api: ApiService<Question[]>) {}

  public async initStore() {
    await this.fetchModeratedCircleIds();
    await this.fetchModeratedCircles();
  }

  public async fetchModeratedCircleIds() {
    const { isError: _, result } = await this.api.read(
      'moderatedCircleIds',
      true,
    );
    this.moderatedCircleIds.set((result as any).moderatedCircleIds || []);
  }

  /**
   * Set the list of circle IDs the user moderates.
   * @param circleIds Array of circle IDs.
   */
  public setModeratedCircleIds(circleIds: string[]) {
    this.moderatedCircleIds.set(circleIds);
  }

  /**
   * Clear the store data.
   */
  public clearStore() {
    this.moderatedCircleIds.set([]);
  }

  /**
   * Get the list of circle IDs the user moderates.
   */
  public getModeratedCircleIds() {
    return this.moderatedCircleIds();
  }

  /**
   * Fetch the circles the user moderates from the backend.
   */
  public async fetchModeratedCircles() {
    const response = await this.api.read<{
      id: string;
      name: string;
      description: string;
    }>('moderatedCircles', true);

    if (!response.isError) {
      this.moderatedCircles.set(
        ((response.result as any).moderatedCircles as Circle[]) || [],
      );
    }
  }
}
