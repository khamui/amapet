import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, SharedModule } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AnswerService } from 'src/app/services/answer.service';
import { CircleService } from 'src/app/services/circle.service';
import { Answer } from 'src/app/typedefs/Answer.typedef';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { Question } from 'src/app/typedefs/Question.typedef';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AnswersComponent } from '../answers/answers.component';
import { TexteditorComponent } from '../../components/texteditor/texteditor.component';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { NgIf } from '@angular/common';
import { VoteComponent } from 'src/app/components/vote/vote.component';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss'],
  providers: [ConfirmationService],
  standalone: true,
  imports: [
    NgIf,
    PanelModule,
    SharedModule,
    DividerModule,
    TexteditorComponent,
    AnswersComponent,
    ConfirmDialogModule,
    DateAgoPipe,
    VoteComponent,
    ProgressBarModule,
  ],
})
export class QuestionDetailComponent implements OnInit {
  circle!: Circle;
  currentUserId!: string;
  isOwner = false;
  public question!: Question;
  public loading = false;
  public answers: Answer[] = [];
  public isLoggedIn = false;

  constructor(
    private ar: ActivatedRoute,
    private cs: CircleService,
    private ro: Router,
    private cos: ConfirmationService,
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

      if (this.currentUserId === this.question?.ownerId) {
        this.isOwner = true;
      }

      if (this.question) {
        this.ans.readAnswers(this.question._id as string);
      }
    });
  }

  private getCircle = async (circleName: string) => {
    const { isError, result } = await this.cs.readCircle(circleName);
    return result as Circle;
  };

  private getQuestion = async (circleName: string, questionId: string) => {
    const { isError, result } = await this.cs.readCircleQuestion(
      circleName,
      questionId,
    );
    return result as Question;
  };

  handleEdit = (event: MouseEvent) => {
    event.stopPropagation();
    this.ro.navigate([
      this.circle.name,
      'questions',
      this.question._id,
      'edit',
    ]);
  };

  handleDelete = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    this.cos.confirm({
      message: 'Are you sure that you want to delete this question?',
      header: 'Delete question?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cs.deleteCircleQuestion(this.circle, this.question);
      },
      reject: () => {},
    });
  };

  public submitAnswer = async (value: string) => {
    this.loading = true;
    const answerEditor = value;
    if (answerEditor !== '') {
      this.ans.createAnswer({
        parentId: this.question._id as string,
        parentType: 'question',
        answerText: answerEditor as string,
        redirectId: this.question._id as string,
        questionId: this.question._id as string,
        circleId: this.circle._id as string,
      });
    }
    this.loading = false;
  };

  public handleUpvoteQuestion = () => {
    this.cs.updateQuestionUpvote(this.circle, this.question);
  };

  public handleDownvoteQuestion = () => {
    this.cs.updateQuestionDownvote(this.circle, this.question);
  };
}
