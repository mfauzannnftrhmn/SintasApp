import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AttendanceService } from '../services/attendance.service';
import { EmployeeService } from '../services/employee.service';
import { Attendance } from '../models/employee.model';
import { Subscription } from 'rxjs';
import { GreetingUtil } from '../utils/greeting.util';

@Component({
  selector: 'app-riwayat',
  templateUrl: './riwayat.page.html',
  styleUrls: ['./riwayat.page.scss'],
  standalone: false,
})
export class RiwayatPage implements OnInit, OnDestroy {
  attendanceHistory: Attendance[] = [];
  filteredAttendance: Attendance[] = [];
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  
  private subscriptions: Subscription[] = [];

  constructor(
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.loadAttendanceData();
    
    // Subscribe to attendance changes
    const attendanceSub = this.attendanceService.attendanceHistory$.subscribe(() => {
      this.loadAttendanceData();
    });
    
    this.subscriptions.push(attendanceSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadAttendanceData() {
    const employee = this.employeeService.getCurrentEmployee();
    if (!employee) return;

    this.attendanceService.getAttendanceByMonth(
      employee.id,
      this.currentYear,
      this.currentMonth
    ).subscribe(history => {
      this.attendanceHistory = history;
      this.filteredAttendance = [...this.attendanceHistory];
    });
  }

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.loadAttendanceData();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.loadAttendanceData();
  }

  getMonthName(month: number, year: number): string {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[month];
  }

  formatAttendanceTime(date: Date | undefined): string {
    if (!date) return '--:--';
    return GreetingUtil.formatTime(date);
  }

  formatAttendanceDate(date: Date): string {
    return GreetingUtil.formatDate(date);
  }

  goBack() {
    this.location.back();
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}
