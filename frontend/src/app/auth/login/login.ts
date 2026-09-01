import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';
  showPassword = false;
  showEmailErrorExample = false;
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    this.showEmailErrorExample = false;
    this.errorMessage = '';
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }
    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoading = false;
        // Redirect based on role
        switch (response.user.role) {
          case 'pastor':
            this.router.navigate(['/pastor/home']);
            break;
          case 'secretary':
            this.router.navigate(['/secretary/home']);
            break;
          case 'church_representative':
            this.router.navigate(['/church_rep/home']);
            break;
          default:
            this.router.navigate(['/login']);
            break;
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.isLoading = false;
        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password.';
        } else {
          this.errorMessage = 'Unable to connect to the server.';
        }
      }
    });
  }
}