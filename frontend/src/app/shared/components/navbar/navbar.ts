import { Component, input, ChangeDetectionStrategy, output, inject } from '@angular/core';
import { NavItem } from '../../../core/models/navigation/nav-item.model';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.html',
})
export class Navbar {
  items = input.required<NavItem[]>();
  portalLabel = input<string>('');
  open = input<boolean>(false);
  linkClicked = output<void>();

  auth = inject(AuthService); // public — used directly in the template
  currentUser = this.auth.currentUser;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {

    this.authService.logout().subscribe({

      next: () => {
        this.router.navigate(['/login']);
      },

      error: () => {

        // Even if Laravel fails,
        // clear local authentication.
        localStorage.removeItem('token');

        this.router.navigate(['/login']);

      }

    });
  }
}