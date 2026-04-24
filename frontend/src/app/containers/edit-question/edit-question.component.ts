import { Component, inject, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CircleService } from 'src/app/services/circle.service';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { Question } from 'src/app/typedefs/Question.typedef';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'primeng/api';
import { EditorModule } from 'primeng/editor';
import { InputTextModule } from 'primeng/inputtext';
import { isPlatformBrowser } from '@angular/common';
import {
  ImageUploadComponent,
  ImageUploadState,
} from 'src/app/components/image-upload/image-upload.component';
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
  selector: 'ama-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    EditorModule,
    SharedModule,
    ButtonModule,
    ImageUploadComponent,
  ],
})
export class EditQuestionComponent implements OnInit {
  private router = inject(Router);

  circle!: Circle | undefined;
  public question!: Question;

  public loading = false;
  public existingImageUrls: string[] = [];
  public bodyTextLength = signal(0);
  public readonly titleMaxLength = QUESTION_TITLE_MAX_LENGTH;
  public readonly bodyMaxLength = QUESTION_BODY_MAX_LENGTH;
  private pendingFiles: File[] = [];
  private keptExistingUrls: string[] = [];

  constructor(
    private cs: CircleService,
    private ar: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  get isBrowserOnly(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const paramMap = this.ar.snapshot.paramMap;
    const circleName = paramMap.get('id') as string;
    const questionId = paramMap.get('qid') as string;

    this.loadQuestionData(circleName, questionId);
  }

  private async loadQuestionData(circleName: string, questionId: string) {
    const [circleRes, questionRes] = await Promise.all([
      this.cs.readCircle(circleName),
      this.cs.readCircleQuestion(circleName, questionId),
    ]);

    if (!circleRes.isError) {
      this.circle = circleRes.result as Circle;
    }

    if (!questionRes.isError) {
      this.question = questionRes.result as Question;
      this.questionForm.setValue({
        titleInput: this.question.title,
        bodyEditor: this.question.body,
      });
      this.existingImageUrls = this.question.images || [];
      this.keptExistingUrls = [...this.existingImageUrls];
    }
  }

  public questionForm = new FormGroup({
    titleInput: new FormControl('', [
      Validators.required,
      Validators.maxLength(QUESTION_TITLE_MAX_LENGTH),
      minWordsValidator(2),
    ]),
    bodyEditor: new FormControl(''),
  });

  public onImagesChanged(state: ImageUploadState) {
    this.pendingFiles = state.files;
    this.keptExistingUrls = state.existingUrls;
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
    try {
      let newUrls: string[] = [];
      if (this.pendingFiles.length > 0) {
        newUrls = await this.cs.uploadImages(this.pendingFiles);
      }
      const allImages = [...this.keptExistingUrls, ...newUrls];
      this.cs.updateCircleQuestion(
        this.circle as Circle,
        this.question as Question,
        titleInput as string,
        bodyEditor as string || '',
        allImages,
      );
    } catch {
      this.loading = false;
    }
    this.loading = false;
  };

  public cancel = () => {
    const circleName = this.circle?.name?.replace('c/', '');
    const slug = this.question?.slug || this.question?._id;
    if (circleName && slug) {
      this.router.navigateByUrl(`/c/${circleName}/questions/${slug}`);
    } else if (circleName) {
      this.router.navigateByUrl(`/c/${circleName}`);
    } else {
      this.router.navigateByUrl('/');
    }
  };
}
