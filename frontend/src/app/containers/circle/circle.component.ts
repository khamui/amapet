import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CircleService } from 'src/app/services/circle.service';
import { ModerationStore } from 'src/app/stores/moderation.store';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { Question, PaginatedQuestionsResponse } from 'src/app/typedefs/Question.typedef';
import { QuestionsComponent } from '../questions/questions.component';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinner } from 'primeng/progressspinner';

const PAGE_SIZE = 50;

@Component({
  host: { ngSkipHydration: 'true' },
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss'],
  standalone: true,
  imports: [InputTextModule, QuestionsComponent, ProgressSpinner],
})
export class CircleComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollSentinel') scrollSentinel!: ElementRef;

  public router = inject(Router);
  private cs = inject(CircleService);
  private ar = inject(ActivatedRoute);
  public as = inject(AuthService);
  private moderationStore = inject(ModerationStore);
  private platformId = inject(PLATFORM_ID);

  circle = signal<Circle | null>(null);
  questions = signal<Question[]>([]);
  isLoading = signal(false);
  hasMore = signal(true);

  private currentSkip = 0;
  private circleName = '';
  private observer: IntersectionObserver | null = null;

  public isLoggedIn = computed(() => this.as.isLoggedIn());

  ngOnInit(): void {
    const params$ = this.ar.paramMap;
    params$.subscribe(async (paramMap) => {
      const name = paramMap.get('name');
      if (name && name !== this.circleName) {
        this.circleName = name;
        this.resetPagination();
        await this.loadCircleMetadata();
        await this.loadMoreQuestions();
      }
    });
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private resetPagination(): void {
    this.questions.set([]);
    this.currentSkip = 0;
    this.hasMore.set(true);
    this.isLoading.set(false);
  }

  private async loadCircleMetadata(): Promise<void> {
    const { isError, result } = await this.cs.readCircle(this.circleName);
    if (!isError) {
      const circleData = result as Circle;
      this.circle.set({ ...circleData, questions: [] });
    }
  }

  private async loadMoreQuestions(): Promise<void> {
    if (this.isLoading() || !this.hasMore()) return;

    this.isLoading.set(true);

    const { isError, result } = await this.cs.readCircleQuestions(
      this.circleName,
      this.currentSkip,
      PAGE_SIZE,
    );

    if (!isError && result && 'questions' in result) {
      const response = result as PaginatedQuestionsResponse;
      const newQuestions = response.questions;
      this.questions.update((current) => [...current, ...newQuestions]);
      this.currentSkip += newQuestions.length;
      this.hasMore.set(response.pagination.hasMore);
    }

    this.isLoading.set(false);
  }

  private setupIntersectionObserver(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.isLoading() && this.hasMore()) {
          this.loadMoreQuestions();
        }
      },
      { rootMargin: '200px' },
    );

    setTimeout(() => {
      if (this.scrollSentinel?.nativeElement) {
        this.observer?.observe(this.scrollSentinel.nativeElement);
      }
    });
  }

  get isModerator(): boolean {
    const moderatedIds = this.moderationStore.getModeratedCircleIds();
    const circleId = this.circle()?._id;
    return circleId ? moderatedIds.includes(circleId) : false;
  }

  allQuestions = computed(() => {
    const qs = this.questions();
    if (this.isModerator) {
      const moderatedCircles = this.moderationStore.moderatedCircles$();
      const moderatedCircle = moderatedCircles.find(
        (c) => c._id === this.circle()?._id,
      );
      if (moderatedCircle?.questions) {
        const questionIds = new Set(qs.map((q) => q._id));
        const blockedQuestions = moderatedCircle.questions.filter(
          (q) => !questionIds.has(q._id),
        );
        return [...qs, ...blockedQuestions];
      }
    }
    return qs;
  });

  navigateToCreateForm = () => {
    const c = this.circle();
    if (c) {
      this.router.navigateByUrl(`/${c.name}/questions/create`);
    }
  };
}
