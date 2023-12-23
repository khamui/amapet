import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Answer } from '../typedefs/Answer.typedef';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { MessageService } from 'primeng/api';
@Injectable({
  providedIn: 'root',
})
export class AnswerService {
  private answersSubject = new BehaviorSubject<Answer[]>([]);
  public answers$ = this.answersSubject.asObservable();

  constructor(
    private api: ApiService<Answer>,
    private as: AuthService,
    private ms: MessageService,
  ) {}

  private refreshAnswers = (newAnswers: Answer[]) => {
    this.answersSubject.next(newAnswers);
  };

  public readAnswers = (byQuestionId: string) => {
    this.api
      .readAsObservable$<Answer[]>(`answers/${byQuestionId}`)
      .subscribe((answers: Answer[]) => {
        this.refreshAnswers(answers);
      });
  };

  public readSubAnswers$ = (byParentId: string) => {
    return this.api.readAsObservable$<Answer[]>(`answers/${byParentId}`);
  };

  public readAllAnswers = async (byQuestionId: string) => {
    const allAnswersResponse = await this.api.read(`answers/${byQuestionId}`);
    const { isError, result } = allAnswersResponse;
    return result;
  };

  public createAnswer = ({
    parentId,
    parentType,
    answerText,
    redirectId,
  }: {
    parentId: string;
    parentType: 'question' | 'answer';
    answerText: string;
    redirectId: string;
  }) => {
    const payload: Answer = {
      parentId,
      parentType,
      ownerId: this.as.getUserId(),
      ownerName: this.as.getUserName(),
      answerText,
      totalSubAnswers: 0,
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

  public deleteAnswer = ({ id }: { id: string }) => {
    const deleted = this.api.deleteAsObservable$<Answer>(
      `answers/${id}/delete`,
    );
    deleted.subscribe(() => {
      try {
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

  public findFirstQuestionParentFromId(answers: Answer[], id: string) {
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
}
