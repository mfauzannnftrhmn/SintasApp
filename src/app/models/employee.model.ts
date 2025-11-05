export interface Employee {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  shiftId: string;
  position?: string;
  profileImage?: string;
  workGroup?: string; // Grup kerja
}

export interface Shift {
  id: string;
  name: string; // 'Pagi', 'Siang', 'Malam'
  startTime: string; // Format: 'HH:mm'
  endTime: string; // Format: 'HH:mm'
  employees: string[]; // Array of employee IDs
  workGroup?: string; // Grup kerja untuk shift ini
}

export interface LocationSettings {
  latitude: number;
  longitude: number;
  radius: number; // Radius dalam meter
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  shiftId: string;
  status: 'hadir' | 'tidak_hadir' | 'izin' | 'cuti';
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface ShiftExchangeRequest {
  id: string;
  requesterId: string; // Employee yang meminta tukar shift
  targetEmployeeId: string; // Employee yang diminta tukar shift
  requestDate: Date; // Tanggal shift yang ingin ditukar
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string; // Admin ID
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: Date;
  type: 'checkin' | 'checkout' | 'shift' | 'other';
  read: boolean;
  icon?: string;
}

export interface OvertimeRequest {
  id: string;
  employeeId: string;
  date: Date;
  startTime: string; // Format: 'HH:mm'
  reason: string;
  proofDocument?: string; // URL atau path ke file
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string; // Admin ID
  submittedAt: Date;
}

