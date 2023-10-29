import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { Question } from 'src/app/typedefs/Question.typedef';

@Component({
  selector: 'ama-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent {
  @Input() questions!: Question[];

  constructor() {}
}
