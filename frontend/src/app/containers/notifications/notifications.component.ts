import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { Subscription, switchMap, timer } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification } from 'src/app/typedefs/Notification.typedef';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Popover, PopoverModule } from 'primeng/popover';

const INTERVAL_IN_MS = 180000; // 3 mins

@Component({
  selector: 'ama-notifications',
  standalone: true,
  imports: [ButtonModule, BadgeModule, JsonPipe, PopoverModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent implements OnInit, OnDestroy {
  @ViewChild('notificationsPanel') notificationsPanel!: Popover;

  notifications!: Notification[];
  unreadItems = 0;
  timerSubscription$!: Subscription;

  constructor(
    private nos: NotificationService,
    private ro: Router,
  ) {}

  ngOnInit(): void {
    this.timerSubscription$ = timer(0, INTERVAL_IN_MS)
      .pipe(
        switchMap(() => this.nos.getAll(`notifications`)),
      )
      .subscribe((notificationsResponse: unknown) => {
        this.notifications = notificationsResponse as Notification[];
        this.unreadItems = this.notifications.filter((n) => n.unread).length;
      });
  }

  ngOnDestroy(): void {
    this.timerSubscription$ && this.timerSubscription$.unsubscribe();
  }

  public removeTags = (formattedText: any) => {
    return formattedText.replace(/<\/?p>/g, '');
  };

  public handleNotification = (notification: Notification) => {
    this.notificationsPanel.hide();
    this.ro.navigate([
      notification.originCircleName,
      'questions',
      notification.originQuestionId,
    ]);

    if (notification.unread) {
      this.nos.markAsRead(`notifications/${notification._id}`).subscribe(() => {
        this.nos
          .getAll('notifications')
          .subscribe((notificationsResponse: unknown) => {
            this.notifications = notificationsResponse as Notification[];
            this.unreadItems = this.notifications.filter((n) => n.unread).length;
          });
      });
    }
  };

  public handleNotificationsToggle = (event: any, el: any) => {
    // fixme: little hack to make sure popover is not placed far down
    // when the page is scrolled down, before the popover is opened
    scrollTo(0, 0);
    el.toggle(event);
  }
}
