import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AnswerService } from 'src/app/services/answer.service';
import { CircleService } from 'src/app/services/circle.service';
import { Answer } from 'src/app/typedefs/Answer.typedef';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { Question } from 'src/app/typedefs/Question.typedef';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { NgClass } from '@angular/common';
import { ModerationAnswersComponent } from '../moderation-answers/moderation-answers.component';
import { ButtonModule } from 'primeng/button';
import {
  ToggleSwitchChangeEvent,
  ToggleSwitchModule,
} from 'primeng/toggleswitch';

@Component({
  selector: 'ama-moderation-question-detail',
  imports: [ NgClass,
    PanelModule,
    DividerModule,
    ModerationAnswersComponent,
    ConfirmDialogModule,
    DateAgoPipe,
    ProgressBarModule,
    ButtonModule,
    ToggleSwitchModule,
  ],
  templateUrl: './moderation-question-detail.component.html',
  styleUrl: './moderation-question-detail.component.scss',
})
export class ModerationQuestionDetailComponent implements OnInit {
  circle!: Circle;
  currentUserId!: string;
  public question!: Question;
  public loading = false;
  public answers: Answer[] = [];
  public isLoggedIn = false;
  public questionClosed = signal(false);

  constructor(
    private ar: ActivatedRoute,
    private cs: CircleService,
    private ro: Router,
    private as: AuthService,
    public ans: AnswerService,
  ) {
    this.currentUserId = this.as.getUserId();
  }

  ngOnInit(): void {
    this.as.watchLoggedIn.subscribe((value: boolean) => {
      this.isLoggedIn = value;
    });

    /* observes params */
    /* get circle id by circle name */
    /* fetch get question */
    const params$ = this.ar.paramMap;
    params$.subscribe(async (paramMap: any) => {
      const questionId = paramMap.get('qid');
      const circleName = paramMap.get('name');

      this.circle = await this.getCircle(circleName);
      //this.question = await this.getQuestion(circleName, questionId);
      this.question = this.circle.questions.find(
        (q) => q._id === questionId,
      ) as Question;

      if (this.question) {
        this.ans.readAnswers(this.question._id as string);
      }
    });
  }

  private getCircle = async (circleName: string) => {
    const { isError, result } = await this.cs.readCircle(circleName);
    return result as Circle;
  };

  public handleToggleCommenting(event: ToggleSwitchChangeEvent) {
    this.questionClosed.set(event.checked);
  }
}
