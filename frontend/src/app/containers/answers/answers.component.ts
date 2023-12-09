import { Component, Input } from '@angular/core';
import { Answer } from 'src/app/typedefs/Answer.typedef';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';
import { DividerModule } from 'primeng/divider';
import { NgFor } from '@angular/common';

@Component({
    selector: 'ama-answers',
    templateUrl: './answers.component.html',
    styleUrls: ['./answers.component.scss'],
    standalone: true,
    imports: [NgFor, DividerModule, DateAgoPipe]
})
export class AnswersComponent {
  @Input() answers!: Answer[]
}
