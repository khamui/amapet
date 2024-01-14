import { Component, Input } from '@angular/core';
import { Answer } from 'src/app/typedefs/Answer.typedef';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';
import { DividerModule } from 'primeng/divider';
import { ToggleButton, ToggleButtonModule } from 'primeng/togglebutton';
import { AnswerService } from 'src/app/services/answer.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { TexteditorComponent } from 'src/app/components/texteditor/texteditor.component';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { VoteComponent } from 'src/app/components/vote/vote.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ama-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    DateAgoPipe,
    AsyncPipe,
    DividerModule,
    ToggleButtonModule,
    ConfirmDialogModule,
    TexteditorComponent,
    VoteComponent,
  ],
})
export class AnswersComponent {
  @Input() answers!: Answer[] | undefined;
  @Input() questionId!: string;
  @Input() circleId!: string;

  public loading = false;
  public isLoggedIn = false;
  public currentUserId!: string;
  public answerInEditing!: Answer | undefined;
  public allExpanded = true;

  constructor(
    private as: AuthService,
    private ans: AnswerService,
    private cos: ConfirmationService,
  ) {
    this.currentUserId = this.as.getUserId();
    this.as.watchLoggedIn.subscribe((value: boolean) => {
      this.isLoggedIn = value;
    });
  }

  public submitAnswer = async ({
    text,
    data: answer,
    editorButtonEl,
  }: {
    text: string;
    data: Answer;
    editorButtonEl: ToggleButton;
  }) => {
    this.loading = true;
    editorButtonEl.checked = false;
    const answerText = text;
    const redirectId = await this.ans.getRedirectId(this.questionId, answer)

    if (answerText !== '') {
      this.ans.createAnswer({
        parentId: answer._id as string,
        parentType: 'answer',
        answerText: answerText as string,
        redirectId,
        questionId: this.questionId,
        circleId: this.circleId,
      });
    }
    this.loading = false;
  };

  /* vote methods */
  public handleUpvoteAnswer = (answer: Answer) => {
    this.ans.updateAnswerUpvote(answer, this.questionId, this.circleId);
  };

  public handleDownvoteAnswer = (answer: Answer) => {
    this.ans.updateAnswerDownvote(answer, this.questionId);
  };

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
        toBeUpdated: [{ answerText }],
      });

      updated.subscribe((newAnswer: Answer) => {
        if (this.answers) {
          this.answers = this.answers.map((a: Answer) => {
            if (a._id === newAnswer._id) {
              return {
                ...a,
                answerText: newAnswer.answerText,
                modded_at: newAnswer.modded_at,
              };
            } else {
              return a;
            }
          });
        }
        this.closeAnswerForm();
      });
    }
    this.loading = false;
  };

  public closeAnswerForm = () => {
    this.answerInEditing = undefined;
  };

  handleDelete = async (answer: Answer) => {
    const redirectId = await this.ans.getRedirectId(this.questionId, answer)
    this.cos.confirm({
      message: 'Are you sure that you want to delete this answer?',
      header: 'Delete answer?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ans.deleteAnswer({ id: answer._id as string, redirectId });
      },
      reject: () => {},
    });
  };
  /* owner methods */
}
