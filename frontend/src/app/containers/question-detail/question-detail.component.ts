
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AnswerService } from 'src/app/services/answer.service';
import { CircleService } from 'src/app/services/circle.service';
import { Answer } from 'src/app/typedefs/Answer.typedef';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { Question } from 'src/app/typedefs/Question.typedef';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss'],
  providers: [ConfirmationService],
})
export class QuestionDetailComponent implements OnInit {
  circle!: Circle;
  currentUserId!: string;
  isOwner = false;
  public question!: Question;
  public loading = false;
  public answers: Answer[] = [];

  constructor(
    private ar: ActivatedRoute,
    private cs: CircleService,
    private ro: Router,
    private cos: ConfirmationService,
    private as: AuthService,
    private ans: AnswerService,
  ) {
    this.currentUserId = this.as.getUserId();
  }

  ngOnInit(): void {
    /* observes params AND circles c/:id */
    const params$ = this.ar.paramMap;
    combineLatest([params$, this.cs.circles$]).subscribe(
      ([paramMap, circles]) => {
        circles.find((circle: Circle) => {
          if (circle.name === `c/${paramMap.get('id')}`) {
            this.circle = circle;
            this.question = ((circle as Circle).questions as Question[]).find(
              (question: Question) => {
                return question._id === paramMap.get('qid');
              },
            ) as Question;
            if (this.currentUserId === this.question?.ownerId) {
              this.isOwner = true;
            }
            this.ans.readAnswers(this.question._id as string);
          }
        });
      },
    );
    this.ans.answers$.subscribe((answers: Answer[]) => {
      this.answers = answers;
    })
  }

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

  public answerForm = new FormGroup({
    answerEditor: new FormControl(''),
  });

  public submitAnswer = async () => {
    this.loading = true;
    const answerEditor = this.answerForm.value.answerEditor;
    if (answerEditor !== '') {
      this.ans.createAnswer({
        parentId: this.question._id as string,
        parentType: 'question',
        answerText: answerEditor as string,
      });
    }
    this.loading = false;
  };

}
