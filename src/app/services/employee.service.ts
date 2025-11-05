import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private currentEmployeeSubject = new BehaviorSubject<Employee | null>(null);
  public currentEmployee$ = this.currentEmployeeSubject.asObservable();

  constructor() {
    // Simulasi data karyawan - dalam produksi ini akan datang dari API
    const mockEmployee: Employee = {
      id: 'emp001',
      name: 'Kaoruko Waguri',
      email: 'example@gmail.com',
      phone: '08123456789',
      address: 'New York, Jl. Ironman 123',
      shiftId: 'shift_pagi',
      position: 'Staff',
      profileImage: 'assets/icon/pp.jpg',
      workGroup: 'Grup A'
    };
    this.setCurrentEmployee(mockEmployee);
  }

  setCurrentEmployee(employee: Employee): void {
    this.currentEmployeeSubject.next(employee);
  }

  getCurrentEmployee(): Employee | null {
    return this.currentEmployeeSubject.value;
  }

  getCurrentEmployeeName(): string {
    const employee = this.getCurrentEmployee();
    return employee?.name || 'User';
  }
}

