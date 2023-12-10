import { Component, ElementRef, Input } from '@angular/core';
import { Answer } from 'src/app/typedefs/Answer.typedef';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';
import { DividerModule } from 'primeng/divider';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AnswerService } from 'src/app/services/answer.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { TexteditorComponent } from 'src/app/components/texteditor/texteditor.component';

@Component({
  selector: 'ama-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.scss'],
  standalone: true,
  imports: [
    DividerModule,
    ToggleButtonModule,
    DateAgoPipe,
    AsyncPipe,
    TexteditorComponent,
  ],
})
export class AnswersComponent {
  @Input() answers!: Answer[] | null;

  answers$!: Observable<Answer[]>;
  loading = false;

  constructor(private ans: AnswerService) {}

  public toggleSubAnswers(answer: Answer) {
    this.answers$ = this.ans.readSubAnswers$(answer._id as string);
  }

  public submitAnswer = async ({
    text,
    data: answer,
  }: {
    text: string;
    data: Answer;
  }) => {
    this.loading = true;
    const answerText = text;
    if (answerText !== '') {
      this.ans.createAnswer({
        parentId: answer._id as string,
        parentType: 'answer',
        answerText: answerText as string,
        redirectId: answer.parentId
      });
    }
    this.loading = false;
  };
}
