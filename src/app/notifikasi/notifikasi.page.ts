import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NotificationService } from '../services/notification.service';
import { Notification } from '../models/employee.model';
import { Subscription } from 'rxjs';
import { GreetingUtil } from '../utils/greeting.util';

interface NotificationGroup {
  dateLabel: string;
  notifications: Notification[];
}

@Component({
  selector: 'app-notifikasi',
  templateUrl: './notifikasi.page.html',
  styleUrls: ['./notifikasi.page.scss'],
  standalone: false,
})
export class NotifikasiPage implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  groupedNotifications: NotificationGroup[] = [];
  filterType: 'all' | 'unread' = 'all';
  unreadCount: number = 0;

  private subscriptions: Subscription[] = [];

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    // Load notifications
    const notificationSub = this.notificationService.getAllNotifications().subscribe(
      notifications => {
        this.notifications = notifications.sort((a, b) => b.time.getTime() - a.time.getTime());
        this.applyFilter();
      }
    );

    // Load unread count
    const unreadSub = this.notificationService.getUnreadCount().subscribe(
      count => {
        this.unreadCount = count;
      }
    );

    this.subscriptions.push(notificationSub, unreadSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setFilter(type: 'all' | 'unread') {
    this.filterType = type;
    this.applyFilter();
  }

  applyFilter() {
    if (this.filterType === 'all') {
      this.filteredNotifications = [...this.notifications];
    } else {
      this.filteredNotifications = this.notifications.filter(n => !n.read);
    }
    this.groupNotifications();
  }

  groupNotifications() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups: NotificationGroup[] = [];
    const todayNotifications: Notification[] = [];
    const yesterdayNotifications: Notification[] = [];
    const olderNotifications: Notification[] = [];

    this.filteredNotifications.forEach(notification => {
      const notifDate = new Date(notification.time);
      notifDate.setHours(0, 0, 0, 0);

      if (notifDate.getTime() === today.getTime()) {
        todayNotifications.push(notification);
      } else if (notifDate.getTime() === yesterday.getTime()) {
        yesterdayNotifications.push(notification);
      } else {
        olderNotifications.push(notification);
      }
    });

    if (todayNotifications.length > 0) {
      groups.push({
        dateLabel: 'Hari ini',
        notifications: todayNotifications
      });
    }

    if (yesterdayNotifications.length > 0) {
      groups.push({
        dateLabel: 'Kemarin',
        notifications: yesterdayNotifications
      });
    }

    if (olderNotifications.length > 0) {
      // Group older notifications by date
      const olderGroups = this.groupByDate(olderNotifications);
      groups.push(...olderGroups);
    }

    this.groupedNotifications = groups;
  }

  groupByDate(notifications: Notification[]): NotificationGroup[] {
    const groups: { [key: string]: Notification[] } = {};

    notifications.forEach(notification => {
      const date = new Date(notification.time);
      const dateKey = GreetingUtil.formatDate(date);
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(notification);
    });

    return Object.keys(groups).map(dateLabel => ({
      dateLabel,
      notifications: groups[dateLabel]
    }));
  }

  formatTime(date: Date): string {
    return GreetingUtil.formatTime(date);
  }

  markAsRead(notificationId: string) {
    if (this.filterType === 'unread') {
      // Refresh after marking as read
      this.notificationService.markAsRead(notificationId).subscribe(() => {
        // Update will come through the observable
      });
    } else {
      this.notificationService.markAsRead(notificationId).subscribe();
    }
  }

  goBack() {
    this.location.back();
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}
