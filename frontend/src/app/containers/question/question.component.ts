import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, SharedModule } from 'primeng/api';
import { CircleService } from 'src/app/services/circle.service';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { Question } from 'src/app/typedefs/Question.typedef';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { NgIf } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { VoteComponent } from 'src/app/components/vote/vote.component';

@Component({
  selector: 'ama-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  providers: [ConfirmationService],
  standalone: true,
  imports: [
    NgIf,
    DateAgoPipe,
    PanelModule,
    SharedModule,
    DividerModule,
    ConfirmDialogModule,
    VoteComponent,
  ],
})
export class QuestionComponent implements OnInit {
  @Input() question!: Question;
  @Input() circle!: Circle;
  @Input() currentUserId!: string;

  isOwner = false;

  constructor(
    private ro: Router,
    private cs: CircleService,
    private cos: ConfirmationService,
  ) {}

  ngOnInit(): void {
    if (this.currentUserId === this.question.ownerId) {
      this.isOwner = true;
    }
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

  handleDelete = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    this.cos.confirm({
      message: 'Are you sure that you want to delete this question?',
      header: 'Delete question?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cs.deleteCircleQuestion(this.circle, this.question);
      },
      reject: () => {},
    });
  };

  public handleUpvoteQuestion = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    this.cs.updateQuestionUpvote(this.circle, this.question);
  };

  public handleDownvoteQuestion = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    this.cs.updateQuestionDownvote(this.circle, this.question);
  };
}
