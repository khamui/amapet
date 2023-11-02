import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable, combineLatest } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CircleService } from 'src/app/services/circle.service';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { Question } from 'src/app/typedefs/Question.typedef';

@Component({
  selector: 'ama-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.scss'],
})
export class CreateQuestionComponent implements OnInit {
  circles$!: Observable<Circle[]>;
  circles: Circle[] = [];

  public loading = false;
  circle!: Circle | undefined;

  constructor(
    private api: ApiService<Question>,
    private ms: MessageService,
    private cs: CircleService,
    private ar: ActivatedRoute,
    private as: AuthService,
  ) {
    this.circles$ = this.cs.getCircles();
  }

  ngOnInit(): void {
    /* creating two observables and combine their results */
    const params$ = this.ar.paramMap;
    combineLatest([params$, this.circles$]).subscribe(([paramMap, circles]) => {
      this.circle = circles.find((circle: Circle) => {
        return circle.name === `c/${paramMap.get('id')}`;
      });
    });
  }

  public questionForm = new FormGroup({
    titleInput: new FormControl(''),
    bodyEditor: new FormControl(''),
  });

  public submitQuestion = async () => {
    this.loading = true;
    const payload: Question = {
      circleId: (this.circle as Circle)._id as string,
      ownerId: this.as.getUserId(),
      ownerName: this.as.getUserName(),
      title: this.questionForm.value.titleInput as string,
      body: this.questionForm.value.bodyEditor as string,
      upvotes: 0,
      downvotes: 0,
    };
    const response = await this.api.create(
      `circles/${(this.circle as Circle)._id}/questions/create`,
      payload,
    );
    const { isError, result } = response;
    if (isError) {
      this.ms.add({
        severity: 'error',
        summary: 'Something went wrong!',
        detail: `Could not be created. Error: ${result}`,
      });
    } else {
      this.ms.add({
        severity: 'success',
        summary: 'Post created!',
        detail: 'Your post has been successfully created.',
      });
    }
    this.loading = false;
  };
}
