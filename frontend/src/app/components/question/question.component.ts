import { Component, Input } from '@angular/core';
import { Question } from 'src/app/typedefs/Question.typedef';

@Component({
  selector: 'ama-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent {
  @Input() question!: Question;
}
