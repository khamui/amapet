import { Component, ElementRef, Input } from '@angular/core';
import { Answer } from 'src/app/typedefs/Answer.typedef';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';
import { DividerModule } from 'primeng/divider';
import { ToggleButton, ToggleButtonModule } from 'primeng/togglebutton';
import { AnswerService } from 'src/app/services/answer.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'ama-answers',
    templateUrl: './answers.component.html',
    styleUrls: ['./answers.component.scss'],
    standalone: true,
    imports: [DividerModule, ToggleButtonModule, DateAgoPipe, AsyncPipe]
})
export class AnswersComponent {
  @Input() answers!: Answer[] | null;

  answers$!: Observable<Answer[]>;

  constructor(private ans: AnswerService) {}

  public toggleSubAnswers(answer: Answer) {
    this.answers$ = this.ans.readSubAnswers$(answer._id as string)
  }
}
