import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { Circle } from 'src/app/typedefs/Circle.typedef';

@Component({
  selector: 'ama-circle-box',
  templateUrl: './circle-box.component.html',
  styleUrls: ['./circle-box.component.scss'],
})
export class CircleBoxComponent implements OnInit {
  @ViewChild('createPopup') createPopup!: OverlayPanel;
  @ViewChild('nameInput') nameInput!: ElementRef;

  @Input() items!: MenuItem[];

  circleItems: MenuItem[] = [];

  constructor(
    private api: ApiService<Circle>,
    private as: AuthService,
    private ms: MessageService,
  ) {
    this.circleItems = [];
  }

  ngOnInit(): void {
    this.readCircles();
  }

  readCircles = async () => {
    const response = await this.api.read('circles');
    const { isError, result } = response;
    console.log(result);

    if (!isError) {
      this.circleItems = (result as any).map((circle: Circle) => ({
        label: circle.name,
      })) as MenuItem[];
    }
  };

  createCircle = async (event: any) => {
    const name = this.nameInput.nativeElement.value;
    const payload: Circle = {
      ownerId: this.as.getUserId(),
      name,
    };

    this.createPopup.toggle(event);

    const response = await this.api.create('circles', payload);
    const { isError, result } = response;

    if (isError) {
      this.ms.add({
        severity: 'error',
        summary: 'Something went wrong!',
        detail: `Could not create Circle. Error ${result}`,
      });
    } else {
      this.circleItems = [...this.circleItems, { label: `c/${name}` }];
      this.ms.add({
        severity: 'success',
        summary: 'Circle created!',
        detail: 'Your circle has been successfully created.',
      });
    }
  };
}
