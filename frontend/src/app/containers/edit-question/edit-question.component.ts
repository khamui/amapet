import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { CircleService } from 'src/app/services/circle.service';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { Question } from 'src/app/typedefs/Question.typedef';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'primeng/api';
import { EditorModule } from 'primeng/editor';
import { InputTextModule } from 'primeng/inputtext';
import { isPlatformBrowser } from '@angular/common';

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
  ],
})
export class EditQuestionComponent implements OnInit {
  circles: Circle[] = [];
  circle!: Circle | undefined;
  public question!: Question;

  public loading = false;

  constructor(
    private cs: CircleService,
    private ar: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  get isBrowserOnly(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    /* creating two observables and combine their results */
    const params$ = this.ar.paramMap;
    combineLatest([params$, this.cs.circles$]).subscribe(
      ([paramMap, circles]) => {
        this.circle = circles.find((circle: Circle) => {
          return circle.name === `c/${paramMap.get('id')}`;
        }) as Circle;

        this.question = (this.circle.questions as Question[]).find(
          (question: Question) => {
            return question._id === paramMap.get('qid');
          },
        ) as Question;

        this.questionForm.setValue({
          titleInput: this.question.title,
          bodyEditor: this.question.body,
        });
      },
    );
  }

  public questionForm = new FormGroup({
    titleInput: new FormControl(''),
    bodyEditor: new FormControl(''),
  });

  public submitQuestion = async () => {
    this.loading = true;
    const titleInput = this.questionForm.value.titleInput;
    const bodyEditor = this.questionForm.value.bodyEditor;
    if (titleInput !== '' && bodyEditor !== '') {
      this.cs.updateCircleQuestion(
        this.circle as Circle,
        this.question as Question,
        titleInput as string,
        bodyEditor as string,
      );
    }
    this.loading = false;
  };
}
