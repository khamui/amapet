import { Injectable, signal } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ModerationInfo, Question } from '../typedefs/Question.typedef';
import { Circle } from '../typedefs/Circle.typedef';

interface ModerationResponse {
  success: boolean;
  moderationInfo: ModerationInfo;
}

@Injectable({
  providedIn: 'root',
})
export class ModerationStore {
  private moderatedCircleIds = signal<string[]>([]);
  private moderatedCircles = signal<Circle[]>([]);

  public moderatedCircles$ = this.moderatedCircles.asReadonly();

  constructor(private api: ApiService<unknown>) {}

  public async initStore() {
    await this.fetchModeratedCircleIds();
    await this.fetchModeratedCircles();
  }

  public async fetchModeratedCircleIds() {
    const { isError: _, result } = await this.api.read(
      '/moderatedCircleIds',
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
    }>('/moderatedCircles', true);

    if (!response.isError) {
      this.moderatedCircles.set(
        ((response.result as any).moderatedCircles as Circle[]) || [],
      );
    }
  }

  /**
   * Update a question's moderation status.
   */
  public async updateQuestionStatus(
    circleId: string,
    questionId: string,
    status: 'unread' | 'approved' | 'blocked',
  ): Promise<ModerationInfo | null> {
    const { isError, result } = await this.api.update(
      `/moderation/circles/${circleId}/questions/${questionId}/status`,
      { status },
      true,
    );

    if (!isError) {
      const response = result as ModerationResponse;
      this.updateQuestionInStore(circleId, questionId, response.moderationInfo);
      return response.moderationInfo;
    }
    return null;
  }

  /**
   * Toggle a question's closed status.
   */
  public async toggleQuestionClosed(
    circleId: string,
    questionId: string,
    closed: boolean,
  ): Promise<ModerationInfo | null> {
    const { isError, result } = await this.api.update(
      `/moderation/circles/${circleId}/questions/${questionId}/close`,
      { closed },
      true,
    );

    if (!isError) {
      const response = result as ModerationResponse;
      this.updateQuestionInStore(circleId, questionId, response.moderationInfo);
      return response.moderationInfo;
    }
    return null;
  }

  /**
   * Update a question's moderator note.
   */
  public async updateQuestionNote(
    circleId: string,
    questionId: string,
    noteText: string,
  ): Promise<ModerationInfo | null> {
    const { isError, result } = await this.api.update(
      `/moderation/circles/${circleId}/questions/${questionId}/note`,
      { noteText },
      true,
    );

    if (!isError) {
      const response = result as ModerationResponse;
      this.updateQuestionInStore(circleId, questionId, response.moderationInfo);
      return response.moderationInfo;
    }
    return null;
  }

  /**
   * Update an answer's moderation status.
   */
  public async updateAnswerStatus(
    answerId: string,
    status: 'unread' | 'approved' | 'blocked',
  ): Promise<ModerationInfo | null> {
    const { isError, result } = await this.api.update(
      `/moderation/answers/${answerId}/status`,
      { status },
      true,
    );

    if (!isError) {
      const response = result as ModerationResponse;
      return response.moderationInfo;
    }
    return null;
  }

  /**
   * Update an answer's moderator note.
   */
  public async updateAnswerNote(
    answerId: string,
    noteText: string,
  ): Promise<ModerationInfo | null> {
    const { isError, result } = await this.api.update(
      `/moderation/answers/${answerId}/note`,
      { noteText },
      true,
    );

    if (!isError) {
      const response = result as ModerationResponse;
      return response.moderationInfo;
    }
    return null;
  }

  /**
   * Update question in local store after moderation action.
   */
  private updateQuestionInStore(
    circleId: string,
    questionId: string,
    moderationInfo: ModerationInfo,
  ) {
    const circles = this.moderatedCircles();
    const updatedCircles = circles.map((circle) => {
      if (circle._id === circleId) {
        const updatedQuestions = circle.questions.map((q) => {
          if (q._id === questionId) {
            return { ...q, moderationInfo };
          }
          return q;
        });
        return { ...circle, questions: updatedQuestions };
      }
      return circle;
    });
    this.moderatedCircles.set(updatedCircles);
  }
}
