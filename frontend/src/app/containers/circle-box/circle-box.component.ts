import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CircleService } from 'src/app/services/circle.service';

@Component({
  selector: 'ama-circle-box',
  templateUrl: './circle-box.component.html',
  styleUrls: ['./circle-box.component.scss'],
})
export class CircleBoxComponent {
  @Input() items!: MenuItem[];

  constructor(
    public cs: CircleService,
  ) {}
}
