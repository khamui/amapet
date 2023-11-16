import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { CircleService } from 'src/app/services/circle.service';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { Question } from 'src/app/typedefs/Question.typedef';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss'],
})
export class QuestionDetailComponent implements OnInit {
  question!: Question;

  constructor(
    private ar: ActivatedRoute,
    private cs: CircleService,
  ) {}

  ngOnInit(): void {
    /* observes params AND circles c/:id */
    const params$ = this.ar.paramMap;
    combineLatest([params$, this.cs.circles$]).subscribe(
      ([paramMap, circles]) => {
        const circle = circles.find((circle: Circle) => {
          return circle.name === `c/${paramMap.get('id')}`;
        });

        this.question = ((circle as Circle).questions as Question[]).find(
          (question: Question) => {
            return question._id === paramMap.get('qid');
          },
        ) as Question;
      },
    );
  }
}
