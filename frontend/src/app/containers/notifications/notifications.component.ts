import { Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { Subscription, switchMap, timer } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification } from 'src/app/typedefs/Notification.typedef';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';

const INTERVAL_IN_MS = 180000; // 3 mins

@Component({
  selector: 'ama-notifications',
  standalone: true,
  imports: [OverlayPanelModule, ButtonModule, BadgeModule, JsonPipe],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications!: Notification[];
  timerSubscription$!: Subscription;

  constructor(
    private nos: NotificationService,
    private ro: Router,
  ) {}

  ngOnInit(): void {
    let counter = 0;
    this.timerSubscription$ = timer(0, INTERVAL_IN_MS)
      .pipe(
        switchMap(() => this.nos.getAll(`notifications?reqno=${counter++}`)),
      )
      .subscribe((notificationsResponse: unknown) => {
        this.notifications = notificationsResponse as Notification[];
      });
  }

  ngOnDestroy(): void {
    this.timerSubscription$ && this.timerSubscription$.unsubscribe();
  }

  public removeTags = (formattedText: any) => {
    return formattedText.replace(/<\/?p>/g, '');
  };

  public handleNotification = (notification: Notification) => {
    console.log('markread -> api call');
    this.ro.navigate([
      notification.originCircleName,
      'questions',
      notification.originQuestionId,
    ]);
  };
}
