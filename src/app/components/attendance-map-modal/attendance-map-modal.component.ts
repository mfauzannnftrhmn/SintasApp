import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { Geolocation, Position } from '@capacitor/geolocation';
import { LocationService } from '../../services/location.service';
import { AttendanceService } from '../../services/attendance.service';
import { EmployeeService } from '../../services/employee.service';
import { ShiftService } from '../../services/shift.service';
import { LocationSettings } from '../../models/employee.model';

@Component({
  selector: 'app-attendance-map-modal',
  templateUrl: './attendance-map-modal.component.html',
  styleUrls: ['./attendance-map-modal.component.scss'],
  standalone: false
})
export class AttendanceMapModalComponent implements OnInit, OnDestroy {
  currentLocation: Position | null = null;
  officeLocation: LocationSettings | null = null;
  locationValid: boolean = false;
  validationMessage: string = 'Mendapatkan lokasi...';
  distance: number = 0;
  isLoading: boolean = true;
  canCheckIn: boolean = false;
  canCheckOut: boolean = false;
  mapUrl: SafeResourceUrl | null = null;
  errorMessage: string = '';

  constructor(
    private modalController: ModalController,
    private locationService: LocationService,
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService,
    private shiftService: ShiftService,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    await this.loadOfficeLocation();
    await this.getCurrentLocation();
    this.updateMapUrl();
    this.checkAttendanceStatus();
  }

  ngOnDestroy() {}

  async loadOfficeLocation() {
    this.locationService.getOfficeLocation().subscribe(location => {
      this.officeLocation = location;
    });
  }

  async getCurrentLocation() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      // Request permission
      const permissionStatus = await Geolocation.requestPermissions();
      
      if (permissionStatus.location !== 'granted') {
        this.errorMessage = 'Izin lokasi tidak diberikan. Silakan aktifkan lokasi di pengaturan.';
        this.isLoading = false;
        return;
      }

      // Get current position
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      this.currentLocation = position;
      await this.validateLocation();
    } catch (error: any) {
      console.error('Error getting location:', error);
      this.errorMessage = 'Gagal mendapatkan lokasi. Pastikan GPS aktif.';
      this.validationMessage = 'Gagal mendapatkan lokasi';
    } finally {
      this.isLoading = false;
    }
  }

  async validateLocation() {
    if (!this.currentLocation || !this.officeLocation) {
      return;
    }

    const userLat = this.currentLocation.coords.latitude;
    const userLon = this.currentLocation.coords.longitude;

    this.locationService.validateLocation(userLat, userLon).subscribe(result => {
      this.locationValid = result.isValid;
      this.distance = result.distance;
      this.validationMessage = result.message;
    });
  }

  updateMapUrl() {
    if (!this.currentLocation || !this.officeLocation) {
      return;
    }

    const userLat = this.currentLocation.coords.latitude;
    const userLon = this.currentLocation.coords.longitude;
    const officeLat = this.officeLocation.latitude;
    const officeLon = this.officeLocation.longitude;

    // Google Maps embed URL - center pada lokasi kantor
    // Note: Untuk produksi, perlu API key Google Maps
    // Untuk sekarang, menggunakan center saja tanpa API key
    const url = `https://www.google.com/maps/embed/v1/view?center=${officeLat},${officeLon}&zoom=17`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    
    // Alternative: menggunakan static map dengan markers (perlu API key)
    // const staticUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${officeLat},${officeLon}&zoom=17&size=600x400&markers=color:red|${officeLat},${officeLon}&markers=color:blue|${userLat},${userLon}`;
    // this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(staticUrl);
  }

  async checkAttendanceStatus() {
    const employee = this.employeeService.getCurrentEmployee();
    if (!employee) return;

    this.attendanceService.getTodayAttendance(employee.id).subscribe(attendance => {
      this.canCheckIn = !attendance?.checkIn;
      this.canCheckOut = !!attendance?.checkIn && !attendance?.checkOut;
    });
  }

  async refreshLocation() {
    await this.getCurrentLocation();
    this.updateMapUrl();
  }

  async proceedCheckIn() {
    if (!this.locationValid || !this.currentLocation) {
      alert('Lokasi tidak valid. Pastikan Anda berada dalam radius yang ditentukan.');
      return;
    }

    const employee = this.employeeService.getCurrentEmployee();
    if (!employee) {
      alert('Data karyawan tidak ditemukan');
      return;
    }

    const location = {
      latitude: this.currentLocation.coords.latitude,
      longitude: this.currentLocation.coords.longitude
    };

    this.shiftService.getShiftByEmployeeId(employee.id).subscribe(shift => {
      if (!shift) {
        alert('Shift tidak ditemukan');
        return;
      }

      this.attendanceService.checkIn(employee.id, shift.id, location).subscribe(attendance => {
        alert('Absen masuk berhasil!');
        this.modalController.dismiss({ success: true, type: 'checkin' });
      });
    });
  }

  async proceedCheckOut() {
    if (!this.locationValid || !this.currentLocation) {
      alert('Lokasi tidak valid. Pastikan Anda berada dalam radius yang ditentukan.');
      return;
    }

    const employee = this.employeeService.getCurrentEmployee();
    if (!employee) {
      alert('Data karyawan tidak ditemukan');
      return;
    }

    const location = {
      latitude: this.currentLocation.coords.latitude,
      longitude: this.currentLocation.coords.longitude
    };

    this.attendanceService.checkOut(employee.id, location).subscribe(attendance => {
      if (attendance) {
        alert('Absen pulang berhasil!');
        this.modalController.dismiss({ success: true, type: 'checkout' });
      } else {
        alert('Gagal absen pulang. Pastikan Anda sudah absen masuk.');
      }
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }
}

