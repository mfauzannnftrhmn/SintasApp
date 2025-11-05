import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LocationSettings } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  // Lokasi kantor default (dalam produksi ini akan dari API/config)
  private officeLocation: LocationSettings = {
    latitude: -6.2088, // Jakarta - UBAH INI sesuai lokasi kantor Anda untuk testing
    longitude: 106.8456,
    radius: 100 // 100 meter radius - UBAH INI jika ingin radius lebih besar untuk testing
  };

  /**
   * Helper method untuk update lokasi kantor (untuk testing)
   * Bisa dipanggil dari browser console: 
   * ng.probe($0).injector.get(LocationService).setOfficeLocation(lat, lng, radius)
   */
  setOfficeLocation(latitude: number, longitude: number, radius: number = 100): void {
    this.officeLocation = { latitude, longitude, radius };
    console.log('Lokasi kantor diupdate:', this.officeLocation);
  }

  constructor() {}

  /**
   * Mendapatkan lokasi kantor untuk absensi
   */
  getOfficeLocation(): Observable<LocationSettings> {
    return of(this.officeLocation);
  }

  /**
   * Menghitung jarak antara dua koordinat menggunakan formula Haversine
   * @param lat1 Latitude titik pertama
   * @param lon1 Longitude titik pertama
   * @param lat2 Latitude titik kedua
   * @param lon2 Longitude titik kedua
   * @returns Jarak dalam meter
   */
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Radius bumi dalam meter
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Validasi apakah lokasi user berada dalam radius yang ditentukan
   * @param userLat Latitude user
   * @param userLon Longitude user
   * @param officeLat Latitude kantor
   * @param officeLon Longitude kantor
   * @param radius Radius dalam meter
   * @returns true jika dalam radius, false jika di luar
   */
  isWithinRadius(
    userLat: number,
    userLon: number,
    officeLat: number,
    officeLon: number,
    radius: number
  ): boolean {
    const distance = this.calculateDistance(userLat, userLon, officeLat, officeLon);
    return distance <= radius;
  }

  /**
   * Validasi lokasi user terhadap lokasi kantor
   * @param userLat Latitude user
   * @param userLon Longitude user
   * @returns Object dengan status validasi dan jarak
   */
  validateLocation(userLat: number, userLon: number): Observable<{
    isValid: boolean;
    distance: number;
    radius: number;
    message: string;
  }> {
    const distance = this.calculateDistance(
      userLat,
      userLon,
      this.officeLocation.latitude,
      this.officeLocation.longitude
    );
    const isValid = distance <= this.officeLocation.radius;

    let message = '';
    if (isValid) {
      message = `Lokasi valid. Jarak: ${Math.round(distance)}m dari kantor`;
    } else {
      message = `Lokasi di luar radius. Jarak: ${Math.round(distance)}m (max: ${this.officeLocation.radius}m)`;
    }

    return of({
      isValid,
      distance: Math.round(distance),
      radius: this.officeLocation.radius,
      message
    });
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

