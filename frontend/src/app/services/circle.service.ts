import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from './api.service';
import { Circle } from '../typedefs/Circle.typedef';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';

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

  public getCircles = () => this.circles$;

  public getCircleByName = (name: string) => {
    let foundCircle;
    this.circles$.subscribe((circles: Circle[]) => {
      foundCircle = circles.find((c) => c.name === name);
    })
    return foundCircle;
  }
}
