import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { Question } from 'src/app/typedefs/Question.typedef';

@Component({
  selector: 'ama-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent {
  @Input() question!: Question;
  @Input() circle!: Circle;

  constructor(private ro: Router) {}

  handleQuestionClicked = () => {
    this.ro.navigate([this.circle.name, 'questions', this.question._id])
  };
}
