import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Attendance } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private attendanceHistorySubject = new BehaviorSubject<Attendance[]>([]);
  public attendanceHistory$ = this.attendanceHistorySubject.asObservable();

  constructor() {
    // Simulasi data history absensi
    this.loadMockAttendanceData();
  }

  private loadMockAttendanceData(): void {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const mockAttendance: Attendance[] = [
      // Current month
      {
        id: 'att001',
        employeeId: 'emp001',
        date: new Date(currentYear, currentMonth, today.getDate() - 2),
        checkIn: new Date(currentYear, currentMonth, today.getDate() - 2, 7, 5),
        checkOut: new Date(currentYear, currentMonth, today.getDate() - 2, 15, 10),
        shiftId: 'shift_pagi',
        status: 'hadir'
      },
      {
        id: 'att002',
        employeeId: 'emp001',
        date: new Date(currentYear, currentMonth, today.getDate() - 1),
        checkIn: new Date(currentYear, currentMonth, today.getDate() - 1, 7, 2),
        checkOut: new Date(currentYear, currentMonth, today.getDate() - 1, 15, 5),
        shiftId: 'shift_pagi',
        status: 'hadir'
      },
      {
        id: 'att003',
        employeeId: 'emp001',
        date: new Date(currentYear, currentMonth, today.getDate()),
        checkIn: new Date(currentYear, currentMonth, today.getDate(), 7, 8),
        checkOut: new Date(currentYear, currentMonth, today.getDate(), 16, 30),
        shiftId: 'shift_pagi',
        status: 'hadir'
      },
      // Previous month (last month)
      {
        id: 'att004',
        employeeId: 'emp001',
        date: new Date(currentYear, currentMonth - 1, 30),
        checkIn: new Date(currentYear, currentMonth - 1, 30, 7, 39),
        checkOut: new Date(currentYear, currentMonth - 1, 30, 16, 25),
        shiftId: 'shift_pagi',
        status: 'hadir'
      },
      {
        id: 'att005',
        employeeId: 'emp001',
        date: new Date(currentYear, currentMonth - 1, 29),
        checkIn: new Date(currentYear, currentMonth - 1, 29, 7, 42),
        checkOut: new Date(currentYear, currentMonth - 1, 29, 16, 20),
        shiftId: 'shift_pagi',
        status: 'hadir'
      },
      // More current month data
      {
        id: 'att006',
        employeeId: 'emp001',
        date: new Date(currentYear, currentMonth, today.getDate() - 3),
        checkIn: new Date(currentYear, currentMonth, today.getDate() - 3, 7, 15),
        checkOut: new Date(currentYear, currentMonth, today.getDate() - 3, 15, 45),
        shiftId: 'shift_pagi',
        status: 'hadir'
      }
    ];
    this.attendanceHistorySubject.next(mockAttendance);
  }

  checkIn(employeeId: string, shiftId: string, location?: { latitude: number; longitude: number }): Observable<Attendance> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const newAttendance: Attendance = {
      id: `att_${Date.now()}`,
      employeeId,
      date: today,
      checkIn: new Date(),
      shiftId,
      status: 'hadir',
      location: location
    };

    const currentHistory = this.attendanceHistorySubject.value;
    // Update jika sudah ada attendance untuk hari ini
    const existingIndex = currentHistory.findIndex(
      att => att.employeeId === employeeId && 
      att.date.toDateString() === today.toDateString()
    );

    if (existingIndex >= 0) {
      currentHistory[existingIndex] = { 
        ...currentHistory[existingIndex], 
        checkIn: new Date(),
        location: location || currentHistory[existingIndex].location
      };
      this.attendanceHistorySubject.next([...currentHistory]);
    } else {
      this.attendanceHistorySubject.next([newAttendance, ...currentHistory]);
    }

    return of(newAttendance);
  }

  checkOut(employeeId: string, location?: { latitude: number; longitude: number }): Observable<Attendance | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentHistory = this.attendanceHistorySubject.value;
    const todayAttendance = currentHistory.find(
      att => att.employeeId === employeeId && 
      att.date.toDateString() === today.toDateString()
    );

    if (todayAttendance) {
      todayAttendance.checkOut = new Date();
      if (location) {
        todayAttendance.location = location;
      }
      this.attendanceHistorySubject.next([...currentHistory]);
      return of(todayAttendance);
    }

    return of(null);
  }

  getAttendanceHistory(employeeId: string, limit: number = 10): Observable<Attendance[]> {
    const allHistory = this.attendanceHistorySubject.value;
    const employeeHistory = allHistory
      .filter(att => att.employeeId === employeeId)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
    return of(employeeHistory);
  }

  getAttendanceByMonth(employeeId: string, year: number, month: number): Observable<Attendance[]> {
    const allHistory = this.attendanceHistorySubject.value;
    const employeeHistory = allHistory
      .filter(att => {
        if (att.employeeId !== employeeId) return false;
        const attDate = new Date(att.date);
        return attDate.getFullYear() === year && attDate.getMonth() === month;
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    return of(employeeHistory);
  }

  getTodayAttendance(employeeId: string): Observable<Attendance | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAttendance = this.attendanceHistorySubject.value.find(
      att => att.employeeId === employeeId && 
      att.date.toDateString() === today.toDateString()
    );

    return of(todayAttendance);
  }
}

