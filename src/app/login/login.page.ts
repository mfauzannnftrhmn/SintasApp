import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  phoneNumber: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    // Check if user is already logged in
    const currentEmployee = this.employeeService.getCurrentEmployee();
    if (currentEmployee) {
      this.router.navigate(['/home']);
    }
  }

  isFormValid(): boolean {
    return this.phoneNumber.trim().length > 0 && this.password.trim().length > 0;
  }

  onLogin() {
    if (!this.isFormValid()) {
      return;
    }

    // TODO: Implement actual login logic with API
    // For now, we'll simulate successful login
    console.log('Login attempt:', {
      phoneNumber: this.phoneNumber,
      password: this.password
    });

    // Simulate login success - navigate to home
    // In production, this should call an authentication service
    this.router.navigate(['/home']);
  }

  onForgotPassword(event: Event) {
    event.preventDefault();
    // TODO: Implement forgot password functionality
    console.log('Forgot password clicked');
    // Could navigate to forgot password page or show modal
  }
}
