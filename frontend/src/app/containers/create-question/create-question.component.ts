import {
  Component,
  computed,
  effect,
  inject,
  Inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { CircleService } from 'src/app/services/circle.service';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { ButtonModule } from 'primeng/button';
import { PrimeTemplate } from 'primeng/api';
import { EditorModule } from 'primeng/editor';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { isPlatformBrowser } from '@angular/common';
import { AutoFocusModule } from 'primeng/autofocus';
import {
  ImageUploadComponent,
  ImageUploadState,
} from 'src/app/components/image-upload/image-upload.component';
import {
  IntentionId,
  QuestionIntentionsValue,
} from 'src/app/typedefs/Settings.typedef';
import { SettingsService } from 'src/app/services/settings.service';
import { QUESTION_BODY_MAX_LENGTH, QUESTION_TITLE_MAX_LENGTH } from 'src/app/constants/question.constants';

function minWordsValidator(min: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const words = (control.value?.trim() || '')
      .split(/\s+/)
      .filter((w: string) => w.length > 0);
    return words.length >= min ? null : { minWords: true };
  };
}

@Component({
  selector: 'ama-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    EditorModule,
    PrimeTemplate,
    ButtonModule,
    AutoFocusModule,
    SelectButtonModule,
    ImageUploadComponent,
  ],
})
export class CreateQuestionComponent implements OnInit {
  private ses = inject(SettingsService);
  public questionIntentions = computed(() => {
    return this.ses
      .intentions()
      ?.value.filter((intention: QuestionIntentionsValue) => intention.active);
  });

  public hasSingleIntention = computed(() => {
    return (this.questionIntentions()?.length ?? 0) === 1;
  });

  circles: Circle[] = [];

  public loading = false;
  public circle!: Circle | undefined;
  public bodyTextLength = signal(0);
  public readonly titleMaxLength = QUESTION_TITLE_MAX_LENGTH;
  public readonly bodyMaxLength = QUESTION_BODY_MAX_LENGTH;
  private pendingFiles = signal<File[]>([]);
  private existingUrls = signal<string[]>([]);

  public selectedIntention = signal<IntentionId>('question');

  private router = inject(Router);

  constructor(
    private cs: CircleService,
    private ar: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    // Sync selectedIntention signal with form control for styling
    effect(() => {
      const intentions = this.questionIntentions();
      if (intentions?.length === 1) {
        this.selectedIntention.set(intentions[0].id);
        this.questionForm.controls.intentionSelect.setValue(intentions[0].id);
      } else if (intentions && intentions.length > 1) {
        // Set default to 'question' or first available intention
        const defaultIntention = intentions.find((i: QuestionIntentionsValue) => i.id === 'question') || intentions[0];
        this.selectedIntention.set(defaultIntention.id);
        this.questionForm.controls.intentionSelect.setValue(defaultIntention.id);
      }
    });

    // Update selectedIntention signal when form control changes (for styling)
    this.questionForm.controls.intentionSelect.valueChanges.subscribe((value) => {
      if (value) {
        this.selectedIntention.set(value as IntentionId);
      }
    });
  }

  get isBrowserOnly(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip on server - requires browser context
    }

    /* creating two observables and combine their results */
    const params$ = this.ar.paramMap;
    combineLatest([params$, this.cs.circles$]).subscribe(
      ([paramMap, circles]) => {
        this.circle = circles.find((circle: Circle) => {
          return circle.name === `c/${paramMap.get('id')}`;
        });
      },
    );
  }

  public questionForm = new FormGroup({
    titleInput: new FormControl('', [
      Validators.required,
      Validators.maxLength(QUESTION_TITLE_MAX_LENGTH),
      minWordsValidator(2),
    ]),
    bodyEditor: new FormControl(''),
    intentionSelect: new FormControl(''),
  });

  public onImagesChanged(state: ImageUploadState) {
    this.pendingFiles.set(state.files);
    this.existingUrls.set(state.existingUrls);
  }

  public onBodyTextChange(event: { textValue: string }) {
    this.bodyTextLength.set((event.textValue || '').trim().length);
  }

  get isSubmitDisabled(): boolean {
    return (
      this.questionForm.controls.titleInput.invalid ||
      this.bodyTextLength() > QUESTION_BODY_MAX_LENGTH ||
      this.loading
    );
  }

  public submitQuestion = async () => {
    if (this.isSubmitDisabled) return;
    this.loading = true;
    const titleInput = this.questionForm.value.titleInput;
    const bodyEditor = this.questionForm.value.bodyEditor;
    const intentionId = this.questionForm.value.intentionSelect;
    try {
      let imageUrls: string[] = [];
      if (this.pendingFiles().length > 0) {
        imageUrls = await this.cs.uploadImages(this.pendingFiles());
      }
      this.cs.createCircleQuestion(
        this.circle as Circle,
        titleInput as string,
        bodyEditor as string || '',
        intentionId as string,
        imageUrls,
      );
    } catch {
      this.loading = false;
    }
    this.loading = false;
  };

  public cancel = () => {
    const circleName = this.circle?.name?.replace('c/', '');
    this.router.navigateByUrl(circleName ? `/c/${circleName}` : '/');
  };

  public toggleStyle = computed(() => {
    return {
      '--p-togglebutton-content-checked-background': `var(--p-intention-${this.selectedIntention()})`,
      '--p-togglebutton-content-checked-border-color': `var(--p-intention-${this.selectedIntention()})`,
    };
  });
}
