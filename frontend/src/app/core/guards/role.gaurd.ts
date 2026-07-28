import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth';


export const roleGuard = (allowed: string[]): CanActivateFn => () => {
    const role = inject(AuthService).currentUser()?.role;
    return role && allowed.includes(role) ? true : inject(Router).parseUrl('/login');
};