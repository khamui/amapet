import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Answer } from '../typedefs/Answer.typedef';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AnswerService {
  private answersSubject = new BehaviorSubject<Answer[]>([]);
  public answers$ = this.answersSubject.asObservable();
  private created!: Observable<Answer>;

  constructor(
    private api: ApiService<Answer>,
    private as: AuthService,
    private ms: MessageService,
  ) {}

  private updateAnswers = (newAnswers: Answer[]) => {
    this.answersSubject.next(newAnswers);
  };

  public readAnswers = (byQuestionId: string) => {
    this.api
      .readAsObservable$<Answer[]>(`answers/${byQuestionId}`)
      .subscribe((circles: Answer[]) => {
        this.updateAnswers(circles);
      });
  };

  public createAnswer = ({
    parentId,
    parentType,
    answerText,
  }: {
    parentId: string;
    parentType: 'question' | 'answer';
    answerText: string;
  }) => {
    const payload: Answer = {
      parentId,
      parentType,
      ownerId: this.as.getUserId(),
      ownerName: this.as.getUserName(),
      answerText,
    };

    this.created = this.api.createAsObservable$<Answer>('answers/create', payload);
    this.created.subscribe((newAnswer: Answer) => {
      try {
        this.readAnswers('6558de988c1e37d49850f25d');
        this.answers$.subscribe(() => {
          //this.ro.navigate([newAnswers.name]);
        });
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
}
