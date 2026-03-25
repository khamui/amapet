import { Component, computed, inject, input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ModerationStore } from 'src/app/stores/moderation.store';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { Question } from 'src/app/typedefs/Question.typedef';
import { QuestionComponent } from '../question/question.component';

@Component({
  selector: 'ama-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
  standalone: true,
  imports: [QuestionComponent],
})
export class QuestionsComponent {
  questions = input.required<Question[]>();
  circle = input.required<Circle>();

  private as = inject(AuthService);
  private moderationStore = inject(ModerationStore);

  currentUserId = this.as.getUserId();

  isModerator = computed(() => {
    const moderatedIds = this.moderationStore.getModeratedCircleIds();
    const circleId = this.circle()?._id;
    return circleId ? moderatedIds.includes(circleId) : false;
  });

  filteredQuestions = computed(() => {
    const qs = this.questions();
    if (!qs) return [];
    if (this.isModerator()) return qs;
    return qs.filter((q) => q.moderationInfo?.status !== 'blocked');
  });
}
