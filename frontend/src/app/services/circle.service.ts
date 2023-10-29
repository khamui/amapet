import { Injectable } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ApiService } from './api.service';
import { Circle } from '../typedefs/Circle.typedef';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CircleService {
  private circleItems: MenuItem[] = [];
  private circles: Circle[] = [];

  constructor(
    private api: ApiService<Circle>,
    private as: AuthService,
    private router: Router,
    private ms: MessageService,
  ) {}

  public readCircles = async () => {
    const response = await this.api.read('circles');
    const { isError, result } = response;

    if (!isError) {
      this.circles = result as Circle[];
      this.circleItems = (result as any).map((circle: Circle) => ({
        label: circle.name,
        command: () => this.router.navigate([circle.name]),
      })) as MenuItem[];
    }
  };

  public createCircle = async (name: string) => {
    const payload: Circle = {
      ownerId: this.as.getUserId(),
      name,
    };

    const response = await this.api.create('circles', payload);
    const { isError, result } = response;

    if (isError) {
      this.ms.add({
        severity: 'error',
        summary: 'Something went wrong!',
        detail: `Could not create Circle. Error ${result}`,
      });
    } else {
      this.circleItems = [
        ...this.circleItems,
        {
          label: `c/${name}`,
          command: () => this.router.navigate([`c/${name}`]),
        },
      ];
      this.ms.add({
        severity: 'success',
        summary: 'Circle created!',
        detail: 'Your circle has been successfully created.',
      });
    }
  };

  public getCircles = () => this.circles;
  public getCircleItems = () => this.circleItems;

  public getCircleByName = (name: string) =>
    this.circles.find((c) => c.name === name);
}
