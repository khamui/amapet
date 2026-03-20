import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { lastValueFrom } from 'rxjs';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import {
  AutoCompleteModule,
  AutoCompleteCompleteEvent,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';

import { environment } from 'src/environments/environment';
import {
  OwnedCircle,
  Moderator,
  UserSearchResult,
} from 'src/app/typedefs/Circle.typedef';
import { AuthService } from 'src/app/services/auth.service';

const API = environment.apiUrl;

@Component({
  selector: 'app-profile-circles',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    TextareaModule,
    AutoCompleteModule,
    TagModule,
    FormsModule,
    DatePipe,
    RouterLink,
  ],
  templateUrl: './profile-circles.component.html',
})
export class ProfileCirclesComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  circles = signal<OwnedCircle[]>([]);
  selectedCircle = signal<OwnedCircle | null>(null);
  editDialogVisible = signal(false);
  moderatorDialogVisible = signal(false);
  userSearchResults = signal<UserSearchResult[]>([]);

  aboutText = '';
  searchQuery = '';

  private getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('amapet_token')}`,
    },
  });

  async ngOnInit() {
    await this.loadOwnedCircles();
  }

  async loadOwnedCircles() {
    try {
      const response = await lastValueFrom(
        this.http.get<{ circles: OwnedCircle[] }>(
          `${API}/profile/circles`,
          this.getHeaders(),
        ),
      );
      this.circles.set(response.circles);
    } catch (error) {
      console.error('Error loading circles:', error);
    }
  }

  getDisplayName(circleName: string): string {
    return circleName.replace('c/', '');
  }

  humanizeDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString();
  }

  openEditDialog(circle: OwnedCircle) {
    this.selectedCircle.set(circle);
    this.aboutText = circle.about;
    this.editDialogVisible.set(true);
  }

  async saveAbout() {
    const circle = this.selectedCircle();
    if (!circle) return;

    try {
      await lastValueFrom(
        this.http.patch(
          `${API}/profile/circles/${circle._id}/about`,
          { about: this.aboutText },
          this.getHeaders(),
        ),
      );

      const updatedCircles = this.circles().map((c) =>
        c._id === circle._id ? { ...c, about: this.aboutText } : c,
      );
      this.circles.set(updatedCircles);
      this.editDialogVisible.set(false);
      this.messageService.add({
        severity: 'success',
        summary: 'Saved',
        detail: 'Circle description updated',
      });
    } catch (error) {
      console.error('Error saving about:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update description',
      });
    }
  }

  openModeratorDialog(circle: OwnedCircle) {
    this.selectedCircle.set(circle);
    this.searchQuery = '';
    this.userSearchResults.set([]);
    this.moderatorDialogVisible.set(true);
  }

  async searchUsers(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    if (query.length < 2) {
      this.userSearchResults.set([]);
      return;
    }

    try {
      const response = await lastValueFrom(
        this.http.get<{ users: UserSearchResult[] }>(
          `${API}/users/search?username=${encodeURIComponent(query)}`,
          this.getHeaders(),
        ),
      );
      this.userSearchResults.set(response.users);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  }

  async addModerator(event: AutoCompleteSelectEvent) {
    const user = event.value as UserSearchResult;
    const circle = this.selectedCircle();
    if (!circle) return;

    try {
      const response = await lastValueFrom(
        this.http.post<{ moderator: Moderator }>(
          `${API}/profile/circles/${circle._id}/moderators`,
          { username: user.username },
          this.getHeaders(),
        ),
      );

      const updatedCircle = {
        ...circle,
        moderators: [...circle.moderators, response.moderator],
      };
      this.selectedCircle.set(updatedCircle);

      const updatedCircles = this.circles().map((c) =>
        c._id === circle._id ? updatedCircle : c,
      );
      this.circles.set(updatedCircles);

      this.searchQuery = '';
      this.messageService.add({
        severity: 'success',
        summary: 'Added',
        detail: `${user.username} is now a moderator`,
      });
    } catch (error: any) {
      console.error('Error adding moderator:', error);
      const message = error?.error?.error || 'Failed to add moderator';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
      });
    }
  }

  async removeModerator(moderator: Moderator) {
    const circle = this.selectedCircle();
    if (!circle) return;

    try {
      await lastValueFrom(
        this.http.delete(
          `${API}/profile/circles/${circle._id}/moderators/${moderator._id}`,
          this.getHeaders(),
        ),
      );

      const updatedCircle = {
        ...circle,
        moderators: circle.moderators.filter((m) => m._id !== moderator._id),
      };
      this.selectedCircle.set(updatedCircle);

      const updatedCircles = this.circles().map((c) =>
        c._id === circle._id ? updatedCircle : c,
      );
      this.circles.set(updatedCircles);

      this.messageService.add({
        severity: 'success',
        summary: 'Removed',
        detail: `${moderator.username} removed from moderators`,
      });
    } catch (error) {
      console.error('Error removing moderator:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to remove moderator',
      });
    }
  }

  isOwner(moderator: Moderator): boolean {
    const circle = this.selectedCircle();
    return circle?.ownerId === moderator._id;
  }

  getCurrentUserId(): string {
    return this.authService.getUserId() || '';
  }
}
