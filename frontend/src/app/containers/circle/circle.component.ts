import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CircleService } from 'src/app/services/circle.service';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { QuestionsComponent } from '../questions/questions.component';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    host: { ngSkipHydration: 'true' },
    selector: 'app-circle',
    templateUrl: './circle.component.html',
    styleUrls: ['./circle.component.scss'],
    standalone: true,
    imports: [
        InputTextModule,
        QuestionsComponent,
    ],
})
export class CircleComponent implements OnInit {
  public router = inject(Router);
  private cs = inject(CircleService);
  private ar = inject(ActivatedRoute);
  public as = inject(AuthService);

  circle!: Circle;

  public isLoggedIn = computed(() => this.as.isLoggedIn());

  ngOnInit(): void {
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
