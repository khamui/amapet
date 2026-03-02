import { NgClass } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'ama-vote',
  standalone: true,
  imports: [ButtonModule, NgClass],
  templateUrl: './vote.component.html',
  styleUrl: './vote.component.scss',
})
export class VoteComponent {
  private as = inject(AuthService);

  upvotes = input<string[]>([]);
  downvotes = input<string[]>([]);
  upvoteSubmit = output();
  downvoteSubmit = output();

  currentUserId = this.as.getUserId();
  isUpvoted = computed(() => this.upvotes().includes(this.currentUserId));
  isDownvoted = computed(() => this.downvotes().includes(this.currentUserId));

  handleUpvote(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (this.isUpvoted()) return;
    this.upvoteSubmit.emit();
  }

  handleDownvote(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (this.isDownvoted()) return;
    this.downvoteSubmit.emit();
  }
}
