import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from './api.service';
import { Circle } from '../typedefs/Circle.typedef';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Question } from '../typedefs/Question.typedef';

@Injectable({
  providedIn: 'root',
})
export class CircleService {
  private circlesSubject = new BehaviorSubject<Circle[]>([]);
  public circles$ = this.circlesSubject.asObservable();
  private created!: Observable<Circle>;

  constructor(
    private api: ApiService<Circle>,
    private as: AuthService,
    private ms: MessageService,
    private ro: Router
  ) {
    this.readCircles();
  }

  public readCircles = () => {
    this.api.readAsObservable$<Circle[]>('circles')
      .subscribe((circles: Circle[]) => {
        this.updateCircles(circles);
      });
  }

  private updateCircles = (newCircles: Circle[]) => {
    this.circlesSubject.next(newCircles);
  }

  public createCircle = (name: string) => {
    const payload: Circle = {
      ownerId: this.as.getUserId(),
      name,
    };

    this.created = this.api.createAsObservable$<Circle>('circles', payload);
    this.created.subscribe((newCircle: Circle) => {
      try {
        this.readCircles();
        this.circles$.subscribe(() => {
          this.ro.navigate([newCircle.name])
        })
        this.ms.add({
          severity: 'success',
          summary: 'Circle created!',
          detail: 'Your circle has been successfully created.',
        });
      } catch (error: any) {
        this.ms.add({
          severity: 'error',
          summary: 'Something went wrong!',
          detail: `Could not create Circle. Error: ${error.message}`,
        });
      }
    })
  };

  public createCircleQuestion = (circle: Circle, titleInput: string, bodyEditor: string) => {
    const payload: Question = {
      circleId: circle._id as string,
      ownerId: this.as.getUserId(),
      ownerName: this.as.getUserName(),
      title: titleInput,
      body: bodyEditor,
      upvotes: 0,
      downvotes: 0,
    };
    const createdQuestion$ = this.api.createAsObservable$(
      `circles/${circle._id}/questions/create`,
      payload,
    );

    createdQuestion$.subscribe((newQuestion: Question) => {
      try {
        this.readCircles();
        this.circles$.subscribe(() => {
          console.log('quesiton created', newQuestion);
          this.ro.navigate([circle.name, 'questions', newQuestion._id])
        })
        this.ms.add({
          severity: 'success',
          summary: 'Question created!',
          detail: 'Your question has been successfully created.',
        });
      } catch (error: any) {
        this.ms.add({
          severity: 'error',
          summary: 'Something went wrong!',
          detail: `Could not create Question. Error: ${error.message}`,
        });
      }
    })
  };

  public getCircles = () => this.circles$;

  public getCircleByName = (name: string) => {
    let foundCircle;
    this.circles$.subscribe((circles: Circle[]) => {
      foundCircle = circles.find((c) => c.name === name);
    })
    return foundCircle;
  }
}
