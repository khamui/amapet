import { Component, inject, Input, signal } from '@angular/core';
import { Answer } from 'src/app/typedefs/Answer.typedef';
import { ModerationStore } from 'src/app/stores/moderation.store';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ama-moderation-answers',
  imports: [NgClass, DateAgoPipe, DividerModule, ButtonModule, TooltipModule],
  templateUrl: './moderation-answers.component.html',
  styleUrl: './moderation-answers.component.scss',
})
export class ModerationAnswersComponent {
  @Input() answers!: Answer[] | undefined;
  @Input() questionId!: string;
  @Input() circleId!: string;

  private moderationStore = inject(ModerationStore);

  public processingAnswerId = signal<string | null>(null);

  constructor(public router: Router) {}

  public async handleApproveAnswer(answer: Answer) {
    if (this.processingAnswerId()) return;
    this.processingAnswerId.set(answer._id || null);

    const currentStatus = this.getAnswerStatus(answer);
    const newStatus = currentStatus === 'approved' ? 'unread' : 'approved';

    const result = await this.moderationStore.updateAnswerStatus(
      answer._id!,
      newStatus,
    );

    if (result && answer.moderationInfo) {
      answer.moderationInfo.status = newStatus;
    } else if (result) {
      answer.moderationInfo = { status: newStatus };
    }
    this.processingAnswerId.set(null);
  }

  public async handleBlockAnswer(answer: Answer) {
    if (this.processingAnswerId()) return;
    this.processingAnswerId.set(answer._id || null);

    const currentStatus = this.getAnswerStatus(answer);
    const newStatus = currentStatus === 'blocked' ? 'unread' : 'blocked';

    const result = await this.moderationStore.updateAnswerStatus(
      answer._id!,
      newStatus,
    );

    if (result && answer.moderationInfo) {
      answer.moderationInfo.status = newStatus;
    } else if (result) {
      answer.moderationInfo = { status: newStatus };
    }
    this.processingAnswerId.set(null);
  }

  public getAnswerStatus(answer: Answer): 'unread' | 'approved' | 'blocked' {
    return answer.moderationInfo?.status || 'unread';
  }
}
