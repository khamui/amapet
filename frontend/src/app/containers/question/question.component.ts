import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Circle } from 'src/app/typedefs/Circle.typedef';
import { Question } from 'src/app/typedefs/Question.typedef';

@Component({
  selector: 'ama-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  @Input() question!: Question;
  @Input() circle!: Circle;
  @Input() currentUserId!: string;

  isOwner = false;

  constructor(private ro: Router) {}

  ngOnInit(): void {
    if (this.currentUserId === this.question.ownerId) {
      this.isOwner = true;
    }
  }

  handleQuestionClicked = () => {
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
    event.stopPropagation();
    // do somehting
  };
}
