import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Observable, map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CircleService } from 'src/app/services/circle.service';
import { Circle } from 'src/app/typedefs/Circle.typedef';

@Component({
  selector: 'ama-circle-box',
  templateUrl: './circle-box.component.html',
  styleUrls: ['./circle-box.component.scss'],
})
export class CircleBoxComponent implements OnInit {
  @Input() items!: MenuItem[];

  circles$!: Observable<Circle[]>;
  circleMenuItems: MenuItem[] = [];

  isLoggedIn = false;

  constructor(
    public cs: CircleService,
    private router: Router,
    private as: AuthService,
  ) {}

  ngOnInit(): void {
    this.as.watchLoggedIn.subscribe((value: boolean) => {
      this.isLoggedIn = value;
    });

    this.cs.circles$.subscribe((circles: Circle[]) => {
        this.circleMenuItems = circles.map((circle: Circle) => ({
          label: circle.name,
          command: () => this.router.navigate([circle.name]),
        })) as MenuItem[]
      })
  }
}
