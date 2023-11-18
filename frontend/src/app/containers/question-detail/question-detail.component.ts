import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { combineLatest } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CircleService } from 'src/app/services/circle.service';
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
  question!: Question;
  currentUserId!: string;
  isOwner = false;

  constructor(
    private ar: ActivatedRoute,
    private cs: CircleService,
    private ro: Router,
    private cos: ConfirmationService,
    private as: AuthService,
  ) {
    this.currentUserId = this.as.getUserId();
  }

  ngOnInit(): void {
    /* observes params AND circles c/:id */
    const params$ = this.ar.paramMap;
    combineLatest([params$, this.cs.circles$]).subscribe(
      ([paramMap, circles]) => {
        const circle = circles.find((circle: Circle) => {
          return circle.name === `c/${paramMap.get('id')}`;
        });

        if (circle) {
          this.circle = circle;
          this.question = ((circle as Circle).questions as Question[]).find(
            (question: Question) => {
              return question._id === paramMap.get('qid');
            },
          ) as Question;

          if (this.currentUserId === this.question?.ownerId) {
            this.isOwner = true;
          }
        }
      },
    );
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
}
