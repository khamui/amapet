import { NgClass } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from 'src/app/services/auth.service';
import { SocialLoginDialogComponent } from '../social-login-dialog/social-login-dialog.component';

@Component({
  selector: 'ama-vote',
  standalone: true,
  imports: [ButtonModule, NgClass, SocialLoginDialogComponent],
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
  isLoggedIn = computed(() => this.as.isLoggedIn());
  showLoginDialog = signal(false);

  handleUpvote(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (!this.isLoggedIn()) {
      this.showLoginDialog.set(true);
      return;
    }
    if (this.isUpvoted()) return;
    this.upvoteSubmit.emit();
  }

  handleDownvote(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (!this.isLoggedIn()) {
      this.showLoginDialog.set(true);
      return;
    }
    if (this.isDownvoted()) return;
    this.downvoteSubmit.emit();
  }
}
