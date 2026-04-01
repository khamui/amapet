import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, SharedModule } from 'primeng/api';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AnswerService } from 'src/app/services/answer.service';
import { CircleService } from 'src/app/services/circle.service';
import { ModerationStore } from 'src/app/stores/moderation.store';
import { QuestionResolverData } from 'src/app/resolvers/question.resolver';
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
import { NgClass } from '@angular/common';
import { VoteComponent } from 'src/app/components/vote/vote.component';
import { UsernameBadgeComponent } from 'src/app/components/username-badge/username-badge.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss'],
  providers: [ConfirmationService],
  standalone: true,
  imports: [
    NgClass,
    PanelModule,
    SharedModule,
    DividerModule,
    TexteditorComponent,
    AnswersComponent,
    ConfirmDialogModule,
    DateAgoPipe,
    VoteComponent,
    UsernameBadgeComponent,
    ProgressBarModule,
    ButtonModule,
  ],
})
export class QuestionDetailComponent implements OnInit {
  private ar = inject(ActivatedRoute);
  private cs = inject(CircleService);
  private ro = inject(Router);
  private cos = inject(ConfirmationService);
  private as = inject(AuthService);
  private moderationStore = inject(ModerationStore);
  public ans = inject(AnswerService);

  circle!: Circle;
  currentUserId!: string;
  isOwner = false;
  public question!: Question;
  public loading = false;
  public answers: Answer[] = [];
  public solutionAnswer = signal<Answer | null>(null);

  public isLoggedIn = computed(() => this.as.isLoggedIn());
  public isModerator = computed(() => {
    const moderatedIds = this.moderationStore.getModeratedCircleIds();
    return this.circle?._id ? moderatedIds.includes(this.circle._id) : false;
  });

  constructor() {
    this.currentUserId = this.as.getUserId();

    // Update solution answer when answers change
    effect(() => {
      const answers = this.ans.answers();
      if (this.question?.solutionId && answers.length > 0) {
        const found = this.findAnswerById(answers, this.question.solutionId);
        this.solutionAnswer.set(found);
      }
    });
  }

  ngOnInit(): void {
    // Get resolved data from route (SSR-compatible)
    const resolvedData = this.ar.snapshot.data['data'] as QuestionResolverData | null;

    if (resolvedData) {
      this.circle = resolvedData.circle;
      this.question = resolvedData.question;

      if (this.currentUserId === this.question?.ownerId) {
        this.isOwner = true;
      }

      if (this.question) {
        this.ans.readAnswers(this.question._id as string);
      }
    }
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
        this.ro.navigate([this.circle.name]);
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
    this.cs.updateQuestionUpvote(this.circle, this.question)
      .pipe(take(1))
      .subscribe((updatedQuestion: Question) => {
        this.question = updatedQuestion;
      });
  };

  public handleDownvoteQuestion = () => {
    this.cs.updateQuestionDownvote(this.circle, this.question)
      .pipe(take(1))
      .subscribe((updatedQuestion: Question) => {
        this.question = updatedQuestion;
      });
  };

  public goBack() {
    const circleName = this.circle.name.replace(/^c\//, '');
    this.ro.navigate(['c', circleName]);
  }

  handleModerate = (event: MouseEvent) => {
    event.stopPropagation();
    const plainCircleName = this.circle.name.replace('c/', '');
    this.ro.navigate(['moderate', 'c', plainCircleName, 'q', this.question.slug || this.question._id]);
  };

  private findAnswerById(answers: Answer[], id: string): Answer | null {
    for (const answer of answers) {
      if (answer._id === id) return answer;
      if (answer.children && answer.children.length > 0) {
        const found = this.findAnswerById(answer.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  public handleMarkSolution = async (answerId: string | null) => {
    const { isError, result } = await this.cs.updateQuestionSolution(
      this.circle,
      this.question,
      answerId,
    );
    if (!isError) {
      this.question = result as Question;
      if (answerId) {
        const found = this.findAnswerById(this.ans.answers(), answerId);
        this.solutionAnswer.set(found);
      } else {
        this.solutionAnswer.set(null);
      }
    }
  };
}
