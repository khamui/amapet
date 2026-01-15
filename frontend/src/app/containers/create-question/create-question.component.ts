import {
  Component,
  computed,
  Inject,
  OnInit,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { CircleService } from 'src/app/services/circle.service';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'primeng/api';
import { EditorModule } from 'primeng/editor';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { isPlatformBrowser } from '@angular/common';
import { AutoFocusModule } from 'primeng/autofocus';
import {
  IntentionId,
  QuestionIntentionsValue,
} from 'src/app/typedefs/Settings.typedef';

@Component({
  selector: 'ama-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    EditorModule,
    SharedModule,
    ButtonModule,
    AutoFocusModule,
    SelectButtonModule,
    FormsModule,
  ],
})
export class CreateQuestionComponent implements OnInit {
  circles: Circle[] = [];

  public loading = false;
  public circle!: Circle | undefined;
  public questionIntentions: QuestionIntentionsValue[] = [];

  public selectedIntention = signal<IntentionId>('question');

  constructor(
    private cs: CircleService,
    private ar: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  get isBrowserOnly(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  async ngOnInit() {
    const settingsIntentions = await this.cs.readIntentions();
    this.questionIntentions =
      settingsIntentions.value as QuestionIntentionsValue[];

    //this.questionForm.controls.intentionSelect.setValue(
    //  this.questionIntentions[0].id,
    //);

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
    titleInput: new FormControl(''),
    bodyEditor: new FormControl(''),
    intentionSelect: new FormControl(''),
  });

  public submitQuestion = async () => {
    this.loading = true;
    const titleInput = this.questionForm.value.titleInput;
    const bodyEditor = this.questionForm.value.bodyEditor;
    const intentionId = this.questionForm.value.intentionSelect;
    if (titleInput !== '') {
      this.cs.createCircleQuestion(
        this.circle as Circle,
        titleInput as string,
        bodyEditor as string,
        intentionId as string,
      );
    }
    this.loading = false;
  };

  public toggleStyle = computed(() => {
    return {
      '--p-togglebutton-content-checked-background': `var(--p-intention-${this.selectedIntention()})`,
      '--p-togglebutton-content-checked-border-color': `var(--p-intention-${this.selectedIntention()})`,
    };
  });
}
