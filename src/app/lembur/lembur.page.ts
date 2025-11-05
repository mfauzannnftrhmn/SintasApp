import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { EmployeeService } from '../services/employee.service';
import { OvertimeRequest } from '../models/employee.model';
import { GreetingUtil } from '../utils/greeting.util';

@Component({
  selector: 'app-lembur',
  templateUrl: './lembur.page.html',
  styleUrls: ['./lembur.page.scss'],
  standalone: false,
})
export class LemburPage implements OnInit {
  selectedDate: string = '';
  startTime: string = '';
  reason: string = '';
  proofFile: File | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('dateInput') dateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('timeInput') timeInput!: ElementRef<HTMLInputElement>;

  minDate: string = '';
  maxDate: string = '';

  constructor(
    private router: Router,
    private location: Location,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    // Set date constraints
    const today = new Date();
    this.minDate = today.toISOString();
    
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3); // Can apply for up to 3 months ahead
    this.maxDate = maxDate.toISOString();
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return GreetingUtil.formatDate(date);
  }

  openDatePicker() {
    // Trigger native date picker
    if (this.dateInput) {
      this.dateInput.nativeElement.showPicker();
    }
  }

  openTimePicker() {
    // Trigger native time picker
    if (this.timeInput) {
      this.timeInput.nativeElement.showPicker();
    }
  }

  triggerFileUpload() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.proofFile = input.files[0];
      // Validate file size (max 5MB)
      if (this.proofFile.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar. Maksimal 5MB');
        this.proofFile = null;
        return;
      }
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(this.proofFile.type)) {
        alert('Format file tidak didukung. Gunakan PDF, JPG, atau PNG');
        this.proofFile = null;
        return;
      }
    }
  }

  isFormValid(): boolean {
    return !!(
      this.selectedDate &&
      this.startTime &&
      this.reason.trim().length > 0 &&
      this.proofFile !== null
    );
  }

  onSubmit() {
    if (!this.isFormValid()) {
      return;
    }

    const employee = this.employeeService.getCurrentEmployee();
    if (!employee) {
      alert('Anda harus login terlebih dahulu');
      this.router.navigate(['/login']);
      return;
    }

    // Create overtime request
    const overtimeRequest: OvertimeRequest = {
      id: `ot_${Date.now()}`,
      employeeId: employee.id,
      date: new Date(this.selectedDate),
      startTime: this.startTime,
      reason: this.reason,
      proofDocument: this.proofFile ? this.proofFile.name : undefined,
      status: 'pending',
      submittedAt: new Date()
    };

    // TODO: Send to API/service
    console.log('Overtime request submitted:', overtimeRequest);
    
    // Show success message
    alert('Pengajuan lembur berhasil dikirim!');
    
    // Navigate back to home
    this.router.navigate(['/home']);
  }

  goBack() {
    this.location.back();
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}
