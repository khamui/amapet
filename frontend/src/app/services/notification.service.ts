import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Notification } from '../typedefs/Notification.typedef';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  currentUserId!: string;

  constructor(private api: ApiService<Notification>) {}

  // getAllBy(userId) --> paginate?
  getAll = (resource: string) => {
    return this.api.readAsObservable$<Notification>(resource, true);
  };

  // markRead(notificationId)

  // markUnread(notificationId)

  // deleteBy(notificationId)
}
