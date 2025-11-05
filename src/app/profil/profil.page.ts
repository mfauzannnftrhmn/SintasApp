import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
  standalone: false,
})
export class ProfilPage implements OnInit, OnDestroy {
  employee: Employee | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.loadEmployeeData();
    
    const employeeSub = this.employeeService.currentEmployee$.subscribe(employee => {
      this.employee = employee;
    });
    
    this.subscriptions.push(employeeSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadEmployeeData() {
    this.employee = this.employeeService.getCurrentEmployee();
  }

  editName() {
    // TODO: Implement edit name functionality
    console.log('Edit name clicked');
  }

  editField(field: 'email' | 'phone' | 'address') {
    // TODO: Implement edit field functionality
    console.log('Edit', field, 'clicked');
  }

  logout() {
    // TODO: Implement logout functionality
    console.log('Logout clicked');
    // this.router.navigate(['/login']);
  }

  goBack() {
    this.location.back();
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  formatEmployeeId(id: string | undefined): string {
    if (!id) return '1234567 89010';
    // Format ID dengan spasi di tengah jika panjang
    if (id.length > 7) {
      return `${id.substring(0, 7)} ${id.substring(7)}`;
    }
    return id;
  }
}
