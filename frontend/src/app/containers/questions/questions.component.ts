import { Component, inject, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ModerationStore } from 'src/app/stores/moderation.store';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { Question } from 'src/app/typedefs/Question.typedef';
import { QuestionComponent } from '../question/question.component';
import { NgFor } from '@angular/common';

@Component({
    selector: 'ama-questions',
    templateUrl: './questions.component.html',
    styleUrls: ['./questions.component.scss'],
    standalone: true,
    imports: [NgFor, QuestionComponent],
})
export class QuestionsComponent {
  @Input() questions!: Question[];
  @Input() circle!: Circle;

  private as = inject(AuthService);
  private moderationStore = inject(ModerationStore);

  currentUserId!: string;

  constructor() {
    this.currentUserId = this.as.getUserId();
  }

  get isModerator(): boolean {
    const moderatedIds = this.moderationStore.getModeratedCircleIds();
    return this.circle?._id ? moderatedIds.includes(this.circle._id) : false;
  }

  get filteredQuestions(): Question[] {
    if (!this.questions) return [];
    if (this.isModerator) return this.questions;
    return this.questions.filter(q => q.moderationInfo?.status !== 'blocked');
  }
}
