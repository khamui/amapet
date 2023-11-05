import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { Question } from 'src/app/typedefs/Question.typedef';

@Component({
  selector: 'ama-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent {
  @Input() questions!: Question[];
  @Input() circle!: Circle;

  currentUserId!: string

  constructor(private as: AuthService) {
    this.currentUserId = this.as.getUserId();
  }
}
