import { Component, Input } from '@angular/core';
import { Answer } from 'src/app/typedefs/Answer.typedef';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';
import { DividerModule } from 'primeng/divider';
import { Button } from 'primeng/button';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ama-moderation-answers',
  imports: [
    NgClass,
    DateAgoPipe,
    DividerModule,
    Button
  ],
  templateUrl: './moderation-answers.component.html',
  styleUrl: './moderation-answers.component.scss'
})
export class ModerationAnswersComponent {
  @Input() answers!: Answer[] | undefined;
  @Input() questionId!: string;
  @Input() circleId!: string;

  constructor(
    public router: Router
  ) {}
}
