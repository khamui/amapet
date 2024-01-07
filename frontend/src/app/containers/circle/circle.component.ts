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
    host: { ngSkipHydration: 'true' },
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
    params$.subscribe(async (paramMap: any) => {
      const circleName = paramMap.get('name');

      this.circle = await this.getCircle(circleName);
    });
  }

  private getCircle = async (circleName: string) => {
    const { isError, result } = await this.cs.readCircle(circleName);
    return result as Circle;
  };

  navigateToCreateForm = () => {
    if (this.circle) {
      this.router.navigateByUrl(`/${this.circle.name}/questions/create`)
    }
  }
}
