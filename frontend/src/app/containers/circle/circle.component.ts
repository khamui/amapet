import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CircleService } from 'src/app/services/circle.service';
import { ModerationStore } from 'src/app/stores/moderation.store';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { Question } from 'src/app/typedefs/Question.typedef';
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
  private moderationStore = inject(ModerationStore);

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

  get isModerator(): boolean {
    const moderatedIds = this.moderationStore.getModeratedCircleIds();
    return this.circle?._id ? moderatedIds.includes(this.circle._id) : false;
  }

  get allQuestions(): Question[] {
    if (!this.circle?.questions) return [];

    // For moderators, merge blocked questions from ModerationStore
    if (this.isModerator) {
      const moderatedCircles = this.moderationStore.moderatedCircles$();
      const moderatedCircle = moderatedCircles.find(
        (c) => c._id === this.circle._id
      );

      if (moderatedCircle?.questions) {
        // Get blocked questions not in circle.questions
        const circleQuestionIds = new Set(this.circle.questions.map(q => q._id));
        const blockedQuestions = moderatedCircle.questions.filter(
          q => !circleQuestionIds.has(q._id)
        );
        return [...this.circle.questions, ...blockedQuestions];
      }
    }

    return this.circle.questions;
  }

  navigateToCreateForm = () => {
    if (this.circle) {
      this.router.navigateByUrl(`/${this.circle.name}/questions/create`)
    }
  }
}
