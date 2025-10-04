import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, SharedModule } from 'primeng/api';
import { CircleService } from 'src/app/services/circle.service';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { Question } from 'src/app/typedefs/Question.typedef';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'ama-moderation-question',
  templateUrl: './moderation-question.component.html',
  styleUrls: ['./moderation-question.component.scss'],
  providers: [ConfirmationService],
  imports: [
    DateAgoPipe,
    PanelModule,
    SharedModule,
    DividerModule,
    ConfirmDialogModule,
  ],
})
export class ModerationQuestionComponent implements OnInit {
  @Input() question!: Question;
  @Input() circle!: Circle;
  @Input() status!: undefined | 'unread' | 'approved' | 'blocked';

  isOwner = false;

  constructor(
    private ro: Router,
  ) {}

  ngOnInit(): void {
  }

  handleQuestionClicked = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    this.ro.navigate([this.circle.name, 'questions', this.question._id]);
  };

  handleEdit = (event: MouseEvent) => {
    event.stopPropagation();
    this.ro.navigate([
      this.circle.name,
      'questions',
      this.question._id,
      'edit',
    ]);
  };
}
