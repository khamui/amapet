import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CircleService } from 'src/app/services/circle.service';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { QuestionsComponent } from '../questions/questions.component';
import { InputTextModule } from 'primeng/inputtext';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-circle',
    templateUrl: './circle.component.html',
    styleUrls: ['./circle.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        InputTextModule,
        QuestionsComponent,
    ],
})
export class CircleComponent implements OnInit {
  circle!: Circle;
  isLoggedIn = false;

  constructor(
    public router: Router,
    private cs: CircleService,
    private ar: ActivatedRoute,
    public as: AuthService
  ) {}

  ngOnInit(): void {
    this.as.watchLoggedIn.subscribe((value: boolean) => {
      this.isLoggedIn = value;
    })

    /* refetch circles after arriving c/:id */
    const params$ = this.ar.paramMap;
    combineLatest([params$, this.cs.circles$])
      .subscribe(([paramMap, circles]) => {
        this.circle = circles.find((circle: Circle) => {
          return circle.name === `c/${paramMap.get('id')}`
        }) as Circle
      })
  }

  navigateToCreateForm = () => {
    if (this.circle) {
      this.router.navigateByUrl(`/${this.circle.name}/questions/create`)
    }
  }
}
