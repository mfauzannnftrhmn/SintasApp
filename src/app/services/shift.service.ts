import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Shift } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  private shifts: Shift[] = [
    {
      id: 'shift_pagi',
      name: 'Pagi',
      startTime: '07:30',
      endTime: '16:30',
      employees: ['emp001', 'emp002', 'emp003', 'emp004'],
      workGroup: 'Grup A'
    },
    {
      id: 'shift_siang',
      name: 'Siang',
      startTime: '16:30',
      endTime: '01:30',
      employees: ['emp005', 'emp006', 'emp007', 'emp008', 'emp009'],
      workGroup: 'Grup B'
    },
    {
      id: 'shift_malam',
      name: 'Malam',
      startTime: '01:30',
      endTime: '07:30',
      employees: ['emp010', 'emp011', 'emp012', 'emp013'],
      workGroup: 'Grup C'
    }
  ];

  constructor() {}

  getShiftById(shiftId: string): Observable<Shift | undefined> {
    const shift = this.shifts.find(s => s.id === shiftId);
    return of(shift);
  }

  getAllShifts(): Observable<Shift[]> {
    return of(this.shifts);
  }

  getShifts(): Shift[] {
    return this.shifts;
  }

  getShiftByEmployeeId(employeeId: string): Observable<Shift | undefined> {
    const shift = this.shifts.find(s => s.employees.includes(employeeId));
    return of(shift);
  }
}

