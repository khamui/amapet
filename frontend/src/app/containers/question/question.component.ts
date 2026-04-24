import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConfirmationService, SharedModule } from 'primeng/api';
import { take } from 'rxjs';
import { CircleService } from 'src/app/services/circle.service';
import { ModerationStore } from 'src/app/stores/moderation.store';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { Question, ExploreQuestion } from 'src/app/typedefs/Question.typedef';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { VoteComponent } from 'src/app/components/vote/vote.component';
import { UsernameBadgeComponent } from 'src/app/components/username-badge/username-badge.component';
import { QuestionGalleryComponent } from 'src/app/components/question-gallery/question-gallery.component';

@Component({
  selector: 'ama-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  providers: [ConfirmationService],
  standalone: true,
  host: { ngSkipHydration: 'true' },
  imports: [
    DateAgoPipe,
    PanelModule,
    SharedModule,
    DividerModule,
    ConfirmDialogModule,
    VoteComponent,
    UsernameBadgeComponent,
    RouterLink,
    QuestionGalleryComponent,
  ],
})
export class QuestionComponent {
  questionInput = input.required<Question>({ alias: 'question' });
  circle = input.required<Circle>();
  currentUserId = input<string>();

  private moderationStore = inject(ModerationStore);
  private ro = inject(Router);
  private cs = inject(CircleService);
  private cos = inject(ConfirmationService);

  // Local mutable state for question (for vote updates)
  questionData = signal<Question | null>(null);

  isOwner = computed(() => {
    const q = this.questionData() ?? this.questionInput();
    return this.currentUserId() === q.ownerId;
  });

  isModerator = computed(() => {
    const moderatedIds = this.moderationStore.getModeratedCircleIds();
    const circleId = this.circle()?._id;
    return circleId ? moderatedIds.includes(circleId) : false;
  });

  questionUrl = computed(() => {
    const q = this.questionData() ?? this.questionInput();
    const c = this.circle();
    const plainCircleName = c.name.replace(/^c\//, '');
    return ['/', 'c', plainCircleName, 'questions', q.slug || q._id];
  });

  question = computed(() => this.questionData() ?? this.questionInput());

  answerCount = computed(() => {
    const q = this.question();
    return (q as ExploreQuestion).answerCount ?? 0;
  });

  bodyExcerpt = computed(() => {
    const q = this.question();
    const body = q.body || '';
    const hasImages = (q.images?.length ?? 0) > 0;
    const limit = hasImages ? 200 : 1200;

    const plainText = body.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    if (plainText.length <= limit) return body;

    let charCount = 0;
    let result = '';
    const tagRegex = /(<[^>]*>)|([^<]+)/g;
    let match: RegExpExecArray | null;
    while ((match = tagRegex.exec(body)) !== null) {
      if (match[1]) {
        result += match[1];
      } else {
        const decoded = match[2].replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
        const remaining = limit - charCount;
        if (decoded.length <= remaining) {
          result += match[2];
          charCount += decoded.length;
        } else {
          const raw = match[2];
          let rawIdx = 0;
          let added = 0;
          while (added < remaining && rawIdx < raw.length) {
            const entityMatch = raw.slice(rawIdx).match(/^&[a-zA-Z]+;|^&#\d+;/);
            if (entityMatch) {
              result += entityMatch[0];
              rawIdx += entityMatch[0].length;
            } else {
              result += raw[rawIdx];
              rawIdx++;
            }
            added++;
          }
          charCount += added;
          break;
        }
      }
    }
    return result + '…';
  });

  constructor() {
    // Sync input to local state
    effect(() => {
      this.questionData.set(this.questionInput());
    });
  }

  navigateToDetail = () => {
    this.ro.navigate(this.questionUrl());
  };

  handleEdit = (event: MouseEvent) => {
    event.stopPropagation();
    this.ro.navigate([
      this.circle().name,
      'questions',
      this.question()._id,
      'edit',
    ]);
  };

  handleDelete = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    this.cos.confirm({
      message: 'Are you sure that you want to delete this question?',
      header: 'Delete question?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cs.deleteCircleQuestion(this.circle(), this.question());
        window.location.reload();
      },
      reject: () => {},
    });
  };

  handleModerate = (event: MouseEvent) => {
    event.stopPropagation();
    const plainCircleName = this.circle().name.replace('c/', '');
    this.ro.navigate(['moderate', 'c', plainCircleName, 'q', this.question().slug || this.question()._id]);
  };

  handleUpvoteQuestion = () => {
    this.cs
      .updateQuestionUpvote(this.circle(), this.question())
      .pipe(take(1))
      .subscribe((updatedQuestion: Question) => {
        this.questionData.set(updatedQuestion);
      });
  };

  handleDownvoteQuestion = () => {
    this.cs
      .updateQuestionDownvote(this.circle(), this.question())
      .pipe(take(1))
      .subscribe((updatedQuestion: Question) => {
        this.questionData.set(updatedQuestion);
      });
  };
}
