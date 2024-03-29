import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Answer } from '../typedefs/Answer.typedef';
import { AuthService } from './auth.service';
import { MessageService } from 'primeng/api';
@Injectable({
  providedIn: 'root',
})
export class AnswerService {
  public answers!: Answer[];
  public loadingList = false;

  constructor(
    private api: ApiService<Answer>,
    private as: AuthService,
    private ms: MessageService,
  ) {}

  public readAnswers = (byQuestionId: string) => {
    this.loadingList = true;
    this.api
      .readAsObservable$<Answer[]>(`answers/${byQuestionId}`)
      .subscribe((answers: Answer[]) => {
        this.answers = answers;
        this.loadingList = false;
      });
  };

  public readSubAnswers$ = (byParentId: string) => {
    return this.api.readAsObservable$<Answer[]>(`answers/${byParentId}`);
  };

  private readAllAnswers = async (byQuestionId: string) => {
    this.loadingList = true;
    const allAnswersResponse = await this.api.read(`answers/${byQuestionId}`);
    const { isError, result } = allAnswersResponse;
    this.loadingList = false;
    return result;
  };

  public createAnswer = ({
    parentId,
    parentType,
    answerText,
    redirectId,
    questionId,
    circleId,
  }: {
    parentId: string;
    parentType: 'question' | 'answer';
    answerText: string;
    redirectId: string;
    questionId: string;
    circleId: string;
  }) => {
    const payload: Answer = {
      parentId,
      parentType,
      ownerId: this.as.getUserId(),
      ownerName: this.as.getUserName(),
      answerText,
      questionId,
      circleId,
    };

    const created$ = this.api.createAsObservable$<Answer>(
      'answers/create',
      payload,
    );
    created$.subscribe(() => {
      try {
        this.readAnswers(redirectId);
        this.ms.add({
          severity: 'success',
          summary: 'Answer created!',
          detail: 'Your answer has been successfully created.',
        });
      } catch (error: any) {
        this.ms.add({
          severity: 'error',
          summary: 'Something went wrong!',
          detail: `Could not create Answer. Error: ${error.message}`,
        });
      }
    });
  };

  public updateAnswer = ({
    id,
    toBeUpdated,
  }: {
    id: string;
    toBeUpdated: any[];
  }) => {
    const updated = this.api.updateAsObservable$<Answer>(
      `answers/${id}/update`,
      { toBeUpdated },
    );
    updated.subscribe(() => {
      try {
        this.ms.add({
          severity: 'success',
          summary: 'Answer updated!',
          detail: 'Your answer has been successfully updated.',
        });
      } catch (error: any) {
        this.ms.add({
          severity: 'error',
          summary: 'Something went wrong!',
          detail: `Could not create Answer. Error: ${error.message}`,
        });
      }
    });
    return updated;
  };

  public deleteAnswer = ({
    id,
    redirectId,
  }: {
    id: string;
    redirectId: string;
  }) => {
    const deleted = this.api.deleteAsObservable$<Answer>(
      `answers/${id}/delete`,
    );
    deleted.subscribe(() => {
      try {
        this.readAnswers(redirectId);
        this.ms.add({
          severity: 'success',
          summary: 'Answer deleted!',
          detail: 'Your answer has been successfully deleted.',
        });
      } catch (error: any) {
        this.ms.add({
          severity: 'error',
          summary: 'Something went wrong!',
          detail: `Could not create Answer. Error: ${error.message}`,
        });
      }
    });
  };

  private findParentById(answers: Answer[], id: string): any {
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      if (answer._id === id) {
        return answer;
      } else if (answer.children && answer.children.length > 0) {
        const found = this.findParentById(answer.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  private findFirstQuestionParentFromId(answers: Answer[], id: string) {
    const startElement = this.findParentById(answers, id);
    if (!startElement) {
      return null;
    }

    let currentElement = startElement;
    while (currentElement) {
      if (currentElement.parentType === 'question') {
        return currentElement.parentId;
      }
      const parentId = currentElement.parentId;
      currentElement = this.findParentById(answers, parentId);
    }

    return null;
  }

  public getRedirectId = async (questionId: string, answer: Answer) => {
    const allAnswers = await this.readAllAnswers(questionId);
    return this.findFirstQuestionParentFromId(
      allAnswers as Answer[],
      answer._id as string,
    );
  }

  public updateAnswerUpvote = (
    answer: Answer,
    questionId: string,
    circleId: string,
  ) => {
    const updated$ = this.api.updateAsObservable$<Answer>(
      `answers/${answer._id}/upvote`,
      {
        questionId,
        circleId,
      },
    );

    updated$.subscribe(() => {
      this.readAnswers(questionId);
    });
  };

  public updateAnswerDownvote = (answer: Answer, qid: string) => {
    const updated$ = this.api.updateAsObservable$<Answer>(
      `answers/${answer._id}/downvote`,
    );

    updated$.subscribe(() => {
      this.readAnswers(qid);
    });
  };
}
