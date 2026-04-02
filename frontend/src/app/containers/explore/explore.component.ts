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
import { AuthService } from 'src/app/services/auth.service';
import { ExploreService } from 'src/app/services/explore.service';
import { ExploreQuestion, PaginatedExploreResponse } from 'src/app/typedefs/Question.typedef';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { QuestionComponent } from '../question/question.component';
import { ProgressSpinner } from 'primeng/progressspinner';

const PAGE_SIZE = 30;

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
  standalone: true,
  imports: [QuestionComponent, ProgressSpinner],
})
export class ExploreComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollSentinel') scrollSentinel!: ElementRef;

  private es = inject(ExploreService);
  private as = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  questions = signal<ExploreQuestion[]>([]);
  isLoading = signal(false);
  hasMore = signal(true);

  private currentSkip = 0;
  private observer: IntersectionObserver | null = null;

  public isLoggedIn = computed(() => this.as.isLoggedIn());
  public currentUserId = computed(() => this.as.getUserId());

  ngOnInit(): void {
    this.loadMoreQuestions();
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private async loadMoreQuestions(): Promise<void> {
    if (this.isLoading() || !this.hasMore()) return;

    this.isLoading.set(true);

    const { isError, result } = await this.es.readExploreQuestions(
      this.currentSkip,
      PAGE_SIZE,
    );

    if (!isError && result && 'questions' in result) {
      const response = result as PaginatedExploreResponse;
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

  getCircleStub(question: ExploreQuestion): Circle {
    return {
      name: question.circleName,
      _id: '',
      ownerId: '',
      questions: [],
    };
  }
}
