import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  showPassword = false;

  /** Demo-only flag to preview the field error state described in the brief. */
  showEmailErrorExample = false;

  /** Demo-only flag to preview the primary button's disabled appearance. */
  showDisabledExample = true;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleEmailErrorExample(): void {
    this.showEmailErrorExample = !this.showEmailErrorExample;
  }
}
