import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'ama-vote',
  standalone: true,
  imports: [ButtonModule, NgClass],
  templateUrl: './vote.component.html',
  styleUrl: './vote.component.scss',
})
export class VoteComponent implements OnChanges {
  @Input() upvotes: string[] = [];
  @Input() downvotes: string[] = [];
  @Output() upvoteSubmit = new EventEmitter();
  @Output() downvoteSubmit = new EventEmitter();

  currentUserId!: string;
  isUpvoted!: boolean;
  isDownvoted!: boolean;

  constructor(private as: AuthService) {
    this.currentUserId = this.as.getUserId();
  }

  ngOnChanges(): void {
    this.isUpvoted = this.upvotes.includes(this.currentUserId);
    this.isDownvoted = this.downvotes.includes(this.currentUserId);
  }
}
