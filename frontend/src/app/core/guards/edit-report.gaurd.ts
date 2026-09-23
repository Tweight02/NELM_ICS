// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../services/auth/auth';

// export const EditReportGuard: CanActivateFn = () => {
//     const auth = inject(AuthService);
//     const router = inject(Router);
//     const allowedRoles = ['pastor', 'church_representative'];

//     if (allowedRoles.includes(auth.currentUser.role)) return true;

//     router.navigate(['/reports']);
//     return false;
// };