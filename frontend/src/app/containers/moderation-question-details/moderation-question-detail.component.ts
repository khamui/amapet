import { ActivatedRoute, Router } from '@angular/router';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AnswerService } from 'src/app/services/answer.service';
import { ModerationStore } from 'src/app/stores/moderation.store';
import { Answer } from 'src/app/typedefs/Answer.typedef';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { Question } from 'src/app/typedefs/Question.typedef';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModerationAnswersComponent } from '../moderation-answers/moderation-answers.component';
import { ButtonModule } from 'primeng/button';
import {
  ToggleSwitchChangeEvent,
  ToggleSwitchModule,
} from 'primeng/toggleswitch';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'ama-moderation-question-detail',
  imports: [
    NgClass,
    FormsModule,
    PanelModule,
    DividerModule,
    ModerationAnswersComponent,
    ConfirmDialogModule,
    DateAgoPipe,
    ProgressBarModule,
    ButtonModule,
    ToggleSwitchModule,
    TextareaModule,
    TooltipModule,
  ],
  templateUrl: './moderation-question-detail.component.html',
  styleUrl: './moderation-question-detail.component.scss',
})
export class ModerationQuestionDetailComponent implements OnInit {
  private ar = inject(ActivatedRoute);
  private ro = inject(Router);
  private as = inject(AuthService);
  private moderationStore = inject(ModerationStore);
  public ans = inject(AnswerService);

  circle!: Circle;
  currentUserId!: string;
  public question!: Question;
  public loading = false;
  public answers: Answer[] = [];

  public processingAction = signal(false);
  public currentStatus = signal<'unread' | 'approved' | 'blocked'>('unread');
  public questionClosed = signal(false);
  public noteText = signal('');
  public isEditingNote = signal(false);
  public savingNote = signal(false);

  public isLoggedIn = computed(() => this.as.isLoggedIn());

  constructor() {
    this.currentUserId = this.as.getUserId();
  }

  ngOnInit(): void {
    const params$ = this.ar.paramMap;
    params$.subscribe(async (paramMap: any) => {
      const questionId = paramMap.get('qid');
      const circleName = paramMap.get('name');

      // Use ModerationStore which has all questions including blocked ones
      const circles = this.moderationStore.moderatedCircles$();
      this.circle = circles.find(
        (c) => c.name === `c/${circleName}`,
      ) as Circle;

      if (this.circle) {
        this.question = this.circle.questions.find(
          (q) => q.slug === questionId || q._id === questionId,
        ) as Question;
      }

      if (this.question) {
        this.currentStatus.set(
          this.question.moderationInfo?.status || 'unread',
        );
        this.questionClosed.set(
          this.question.moderationInfo?.closed || false,
        );
        this.noteText.set(this.question.moderationInfo?.noteText || '');
        this.ans.readAnswers(this.question._id as string);
      }
    });
  }

  public async handleApprove() {
    if (this.processingAction()) return;
    this.processingAction.set(true);

    const newStatus = this.currentStatus() === 'approved' ? 'unread' : 'approved';
    const result = await this.moderationStore.updateQuestionStatus(
      this.circle._id!,
      this.question._id!,
      newStatus,
    );

    if (result) {
      this.currentStatus.set(newStatus);
    }
    this.processingAction.set(false);
  }

  public async handleBlock() {
    if (this.processingAction()) return;
    this.processingAction.set(true);

    const newStatus = this.currentStatus() === 'blocked' ? 'unread' : 'blocked';
    const result = await this.moderationStore.updateQuestionStatus(
      this.circle._id!,
      this.question._id!,
      newStatus,
    );

    if (result) {
      this.currentStatus.set(newStatus);
    }
    this.processingAction.set(false);
  }

  public async handleToggleCommenting(event: ToggleSwitchChangeEvent) {
    if (this.processingAction()) return;
    this.processingAction.set(true);

    const result = await this.moderationStore.toggleQuestionClosed(
      this.circle._id!,
      this.question._id!,
      event.checked,
    );

    if (result) {
      this.questionClosed.set(event.checked);
    }
    this.processingAction.set(false);
  }

  public goBack() {
    this.ro.navigate([this.circle.name, 'questions', this.question.slug || this.question._id]);
  }

  public toggleNoteEditor() {
    this.isEditingNote.update(v => !v);
  }

  public async saveNote() {
    if (this.savingNote()) return;
    this.savingNote.set(true);

    const result = await this.moderationStore.updateQuestionNote(
      this.circle._id!,
      this.question._id!,
      this.noteText(),
    );

    if (result) {
      this.isEditingNote.set(false);
    }
    this.savingNote.set(false);
  }

  public cancelNoteEdit() {
    this.noteText.set(this.question.moderationInfo?.noteText || '');
    this.isEditingNote.set(false);
  }
}
