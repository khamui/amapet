import { Component, Input, OnInit } from '@angular/core';
import { Answer } from 'src/app/typedefs/Answer.typedef';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';
import { DividerModule } from 'primeng/divider';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AnswerService } from 'src/app/services/answer.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { TexteditorComponent } from 'src/app/components/texteditor/texteditor.component';
import { AuthService } from 'src/app/services/auth.service';

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

  public answers$!: Observable<Answer[]>;
  public loading = false;
  public isLoggedIn = false;
  public currentUserId!: string;
  public answerInEditing!: Answer | undefined;

  constructor(
    private as: AuthService,
    private ans: AnswerService,
  ) {
    this.currentUserId = this.as.getUserId();
    this.as.watchLoggedIn.subscribe((value: boolean) => {
      this.isLoggedIn = value;
    });
  }

  public toggleSubAnswers(answer: Answer) {
    this.answers$ = this.ans.readSubAnswers$(answer._id as string);
  }

  /* owner methods */
  public toggleEditForm = (answer: Answer) => {
    this.answerInEditing = answer;
  };

  public submitAnswerUpdate = async ({
    text,
    data: answer,
  }: {
    text: string;
    data: Answer;
  }) => {
    this.loading = true;
    const answerText = text;
    if (answerText !== '') {
      const updated = this.ans.updateAnswer({
        id: answer._id as string,
        toBeUpdated: [{answerText}],
      });

      updated.subscribe((newAnswer: Answer) => {
        if(this.answers) {
          this.answers = this.answers.map((a: Answer) => {
            if(a._id === newAnswer._id) {
              return {
                ...a,
                answerText: newAnswer.answerText,
                modded_at: newAnswer.modded_at
              }
            } else {
              return a;
            }
          })
        }
        this.closeAnswerForm()
      });
    }
    this.loading = false;
  };

  public closeAnswerForm = () => {
    this.answerInEditing = undefined;
  }
  /* owner methods */

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
        redirectId: answer.parentId,
      });
    }
    this.loading = false;
  };
}
