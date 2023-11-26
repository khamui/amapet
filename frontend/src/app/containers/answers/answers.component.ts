import { Component, Input } from '@angular/core';
import { Answer } from 'src/app/typedefs/Answer.typedef';

@Component({
  selector: 'ama-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.scss']
})
export class AnswersComponent {
  @Input() answers!: Answer[]
}
