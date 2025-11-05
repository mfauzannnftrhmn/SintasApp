import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Notification } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor() {
    this.loadMockNotifications();
  }

  private loadMockNotifications(): void {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const mockNotifications: Notification[] = [
      {
        id: 'notif001',
        title: 'Absen Pulang Berhasil!',
        description: 'Kamu telah absen pulang di jam:',
        time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 30),
        type: 'checkout',
        read: false,
        icon: 'checkmark'
      },
      {
        id: 'notif002',
        title: 'Absen Masuk Berhasil!',
        description: 'Kamu telah absen masuk di jam:',
        time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 7, 58),
        type: 'checkin',
        read: false,
        icon: 'checkmark'
      },
      {
        id: 'notif003',
        title: 'Absen Masuk Berhasil!',
        description: 'Kamu telah absen masuk di jam:',
        time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 7, 39),
        type: 'checkin',
        read: true,
        icon: 'checkmark'
      },
      {
        id: 'notif004',
        title: 'Absen Pulang Berhasil!',
        description: 'Kamu telah absen pulang di jam:',
        time: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 16, 25),
        type: 'checkout',
        read: true,
        icon: 'checkmark'
      },
      {
        id: 'notif005',
        title: 'Absen Masuk Berhasil!',
        description: 'Kamu telah absen masuk di jam:',
        time: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 7, 42),
        type: 'checkin',
        read: true,
        icon: 'checkmark'
      }
    ];
    this.notificationsSubject.next(mockNotifications);
  }

  getAllNotifications(): Observable<Notification[]> {
    return this.notifications$;
  }

  getUnreadCount(): Observable<number> {
    return new Observable(observer => {
      this.notifications$.subscribe(notifications => {
        const unread = notifications.filter(n => !n.read).length;
        observer.next(unread);
      });
    });
  }

  markAsRead(notificationId: string): Observable<Notification | null> {
    const notifications = this.notificationsSubject.value;
    const index = notifications.findIndex(n => n.id === notificationId);
    
    if (index >= 0 && !notifications[index].read) {
      notifications[index].read = true;
      this.notificationsSubject.next([...notifications]);
      return of(notifications[index]);
    }
    
    return of(null);
  }

  markAllAsRead(): Observable<boolean> {
    const notifications = this.notificationsSubject.value.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(notifications);
    return of(true);
  }
}

