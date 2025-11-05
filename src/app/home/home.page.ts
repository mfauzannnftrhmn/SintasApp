import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EmployeeService } from '../services/employee.service';
import { ShiftService } from '../services/shift.service';
import { AttendanceService } from '../services/attendance.service';
import { GreetingUtil } from '../utils/greeting.util';
import { Employee, Shift, Attendance } from '../models/employee.model';
import { Subscription, interval } from 'rxjs';
import { AttendanceMapModalComponent } from '../components/attendance-map-modal/attendance-map-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {
  greeting: string = '';
  employeeName: string = '';
  currentDate: string = '';
  checkInTime: string = '--:--';
  checkOutTime: string = '--:--';
  
  employee: Employee | null = null;
  shift: Shift | undefined;
  todayAttendance: Attendance | undefined;
  attendanceHistory: Attendance[] = [];
  recentAttendanceHistory: Attendance[] = []; // Hanya 3 item terakhir
  
  canCheckIn: boolean = true;
  canCheckOut: boolean = false;

  private dateUpdateSubscription?: Subscription;

  constructor(
    private employeeService: EmployeeService,
    private shiftService: ShiftService,
    private attendanceService: AttendanceService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadEmployeeData();
    this.updateDate();
    this.updateGreeting();
    this.loadAttendanceData();
    
    // Update date and greeting every second for real-time experience
    this.dateUpdateSubscription = interval(1000).subscribe(() => {
      this.updateDate();
      this.updateGreeting();
      // Update shift times if shift changes
      this.updateShiftTimes();
    });
  }

  ngOnDestroy() {
    if (this.dateUpdateSubscription) {
      this.dateUpdateSubscription.unsubscribe();
    }
  }

  loadEmployeeData() {
    this.employee = this.employeeService.getCurrentEmployee();
    if (this.employee) {
      this.employeeName = GreetingUtil.getFirstName(this.employee.name);
      this.updateGreeting();
      
      // Load shift information
      this.shiftService.getShiftByEmployeeId(this.employee.id).subscribe(shift => {
        this.shift = shift;
        if (shift) {
          this.checkInTime = shift.startTime;
          this.checkOutTime = shift.endTime;
        }
      });
    }

    // Subscribe to employee changes
    this.employeeService.currentEmployee$.subscribe(employee => {
      if (employee) {
        this.employee = employee;
        this.employeeName = GreetingUtil.getFirstName(employee.name);
        this.updateGreeting();
        
        this.shiftService.getShiftByEmployeeId(employee.id).subscribe(shift => {
          this.shift = shift;
          if (shift) {
            this.checkInTime = shift.startTime;
            this.checkOutTime = shift.endTime;
          }
        });
      }
    });
  }

  loadAttendanceData() {
    if (!this.employee) return;

    // Load today's attendance
    this.attendanceService.getTodayAttendance(this.employee.id).subscribe(attendance => {
      this.todayAttendance = attendance;
      this.updateAttendanceButtons();
    });

    // Load attendance history
    this.attendanceService.getAttendanceHistory(this.employee.id, 5).subscribe(history => {
      this.attendanceHistory = history;
      this.recentAttendanceHistory = history.slice(0, 3); // Ambil hanya 3 item pertama
    });

    // Subscribe to attendance changes
    this.attendanceService.attendanceHistory$.subscribe(() => {
      if (this.employee) {
        this.attendanceService.getTodayAttendance(this.employee.id).subscribe(attendance => {
          this.todayAttendance = attendance;
          this.updateAttendanceButtons();
        });
        
        this.attendanceService.getAttendanceHistory(this.employee.id, 5).subscribe(history => {
          this.attendanceHistory = history;
          this.recentAttendanceHistory = history.slice(0, 3); // Ambil hanya 3 item pertama
        });
      }
    });
  }

  updateDate() {
    this.currentDate = GreetingUtil.formatDate(new Date());
  }

  updateGreeting() {
    this.greeting = GreetingUtil.getGreetingByTime();
  }

  updateShiftTimes() {
    // Only update if shift exists and times are different
    if (this.shift) {
      if (this.checkInTime !== this.shift.startTime || this.checkOutTime !== this.shift.endTime) {
        this.checkInTime = this.shift.startTime;
        this.checkOutTime = this.shift.endTime;
      }
    } else if (this.employee) {
      // Reload shift if employee exists but shift is missing
      this.shiftService.getShiftByEmployeeId(this.employee.id).subscribe(shift => {
        this.shift = shift;
        if (shift) {
          this.checkInTime = shift.startTime;
          this.checkOutTime = shift.endTime;
        } else {
          this.checkInTime = '--:--';
          this.checkOutTime = '--:--';
        }
      });
    }
  }

  updateAttendanceButtons() {
    if (this.todayAttendance) {
      this.canCheckIn = !this.todayAttendance.checkIn;
      this.canCheckOut = !!this.todayAttendance.checkIn && !this.todayAttendance.checkOut;
    } else {
      this.canCheckIn = true;
      this.canCheckOut = false;
    }
  }

  async handleFingerprintClick() {
    if (!this.employee || !this.shift) return;
    if (!this.canCheckIn && !this.canCheckOut) return;

    // Buka modal maps untuk absensi
    const modal = await this.modalController.create({
      component: AttendanceMapModalComponent,
      cssClass: 'attendance-map-modal'
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.success) {
      // Reload data setelah absen berhasil
      this.loadAttendanceData();
    }
  }

  checkIn() {
    if (!this.employee || !this.shift) return;

    this.attendanceService.checkIn(this.employee.id, this.shift.id).subscribe(attendance => {
      console.log('Check-in successful', attendance);
      this.loadAttendanceData();
    });
  }

  checkOut() {
    if (!this.employee) return;

    this.attendanceService.checkOut(this.employee.id).subscribe(attendance => {
      if (attendance) {
        console.log('Check-out successful', attendance);
        this.loadAttendanceData();
      }
    });
  }

  formatAttendanceTime(date: Date | undefined): string {
    if (!date) return '--:--';
    return GreetingUtil.formatTime(date);
  }

  formatAttendanceDate(date: Date): string {
    return GreetingUtil.formatDate(date);
  }

  getWorkGroup(): string {
    return this.employee?.workGroup || this.shift?.workGroup || '-';
  }
}
