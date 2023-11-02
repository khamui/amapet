import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CircleService } from 'src/app/services/circle.service';
import { Circle } from 'src/app/typedefs/Circle.typedef';

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss'],
})
export class CircleComponent implements OnInit {
  circles$!: Observable<Circle[]>;
  circles: Circle[] = [];

  circle!: Circle | undefined;
  isLoggedIn = false;

  constructor(
    public router: Router,
    private cs: CircleService,
    private ar: ActivatedRoute,
    public as: AuthService
  ) {
    this.circles$ = this.cs.getCircles();
  }

  ngOnInit(): void {
    this.as.watchLoggedIn.subscribe((value: boolean) => {
      this.isLoggedIn = value;
    })

    /* creating two observables and combine their results */
    const params$ = this.ar.paramMap;
    combineLatest([params$, this.circles$])
      .subscribe(([paramMap , circles]) => {
        this.circle = circles.find((circle: Circle) => {
          return circle.name === `c/${paramMap.get('id')}`
        })
      })
  }

  navigateToCreateForm = () => {
    if (this.circle) {
      this.router.navigateByUrl(`/${this.circle.name}/questions/create`)
    }
  }
}
